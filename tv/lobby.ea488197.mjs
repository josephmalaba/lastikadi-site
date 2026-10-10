/**
 * lobby.mjs — the venue screen's client for the table service's lobby API.
 *
 * The contract, exactly as the service will publish it:
 *
 *   POST /lobby                    (auth)              -> { lobbyId, joinCode, state, gameId,
 *                                                           ruleVersion, capacity, waitDeadline, expiresAt }
 *
 * The create request may also carry `economicClass` and `sponsorQrVisibility`. Both
 * are optional pass-throughs the service decides the meaning of; this client only
 * forwards what a caller gave it, and sends neither when the caller made no choice.
 *   GET  /lobby/{joinCode}         (public)            -> { lobbyId, gameId, ruleVersion, state,
 *                                                           capacity, seats:[{seatNo,displayName,machine,ready}],
 *                                                           expiresAt, waitDeadline }
 *   POST /lobby/{joinCode}/join    (auth) { displayName } -> { lobbyId, seatNo, state, seats:[...] }
 *   POST /lobby/{lobbyId}/start    (auth, host)         -> { lobbyId, state, gameId }
 *
 * Lifecycle: CREATED -> JOINABLE -> READY -> STARTING -> LIVE -> FINISHED/EXPIRED
 *
 * THIS ENDPOINT DOES NOT EXIST YET. Nothing in this module has been exercised
 * against a live service, and the report that accompanies this work says so. That
 * is why the module is built the way it is: every failure path is a first-class
 * outcome with its own sentence, and there is no path at all that renders a seat,
 * a name or a ready state that the service did not send. An invented roster on a
 * 404 would be the single worst thing this screen could do — it would look exactly
 * like a working lobby with nobody in it.
 *
 * The module is pure and dependency-injected: `createLobbyClient({ request, now })`
 * takes its transport and its clock, so tests/lobby.test.mjs drives every state
 * transition, every HTTP failure and every malformed payload without a server.
 */

/** The lifecycle, in order, from the published contract. */
export const STATES = ['CREATED', 'JOINABLE', 'READY', 'STARTING', 'LIVE', 'FINISHED', 'EXPIRED'];

/** A terminal state is one the screen must not keep polling. */
export const TERMINAL = new Set(['FINISHED', 'EXPIRED']);

/** Where a scan of the join code should go. The phone reads game, v, and code. */
export const CLIENT_ORIGIN = 'https://lastikadi.com';

/**
 * How long the screen waits before each poll, by state.
 *
 * A lobby that is filling up changes often; a live game's roster does not. Polling
 * one screen every two seconds all day is a cost the venue pays for nothing, so the
 * interval follows the state rather than a single constant.
 */
export const POLL_MS = {
  CREATED: 2000,
  JOINABLE: 2000,
  READY: 2000,
  STARTING: 1000,
  LIVE: 10000,
  FINISHED: 30000,
  EXPIRED: 30000,
};

/**
 * A join code is the public handle for a lobby and is shown to the room.
 */
export function isJoinCode(value) {
  return typeof value === 'string' && /^[A-Z0-9]{4,12}$/.test(value);
}

/**
 * A game identity, as the contract defines it.
 *
 * The runtime registry identity is a STRING, such as "kadi" or "go" — the same value
 * `GET /portfolio` returns as `games[].gameId`, so whatever the selector holds after
 * a choice is exactly what `POST /lobby` is given. It is not a numeric engine session
 * id: the response may carry one as the additive key `engineGameId`, and nothing here
 * reads it, depends on it or displays it. A response that echoed a number as `gameId`
 * would mean the service and this screen disagree about what a game is, so the client
 * refuses it rather than showing a table for a game it cannot name.
 */
export function isGameId(value) {
  return typeof value === 'string' && /^[a-z][a-z0-9-]{1,31}$/.test(value);
}

/**
 * Fold an HTTP response into { ok, status, body } or an honest failure.
 *
 * A non-JSON body is not swallowed into an empty object: an error page parsed as
 * `{}` would become a lobby with no seats and no state, which is precisely the
 * fabricated picture this module must never draw.
 */
export async function readJson(response) {
  const status = response && typeof response.status === 'number' ? response.status : 0;
  if (!response || typeof response.text !== 'function') {
    return { ok: false, reason: 'malformed', status };
  }
  let text = '';
  try {
    text = await response.text();
  } catch {
    return { ok: false, reason: 'malformed', status };
  }
  if (!text) return { ok: response.ok === true, status, body: null };
  try {
    return { ok: response.ok === true, status, body: JSON.parse(text) };
  } catch {
    return { ok: false, reason: 'malformed', status };
  }
}

/**
 * Classify a failed lobby call into something the room can read.
 *
 * The distinction that matters on a venue screen is "this screen cannot do this
 * yet" versus "the service is having a bad day": the first is a permanent state of
 * deployment or unknown code, the second is worth waiting out. Conflating them
 * would leave an operator rebooting a screen over a request the service refused.
 */
export function describeFailure(result) {
  if (!result) return { id: 'unreachable', text: 'The table service could not be reached from this screen.' };
  // The status decides first. A 404 with a human-readable error page is a missing
  // endpoint, not an unparseable one, and an operator fixes those differently.
  switch (result.status) {
    case 401:
    case 403:
      return {
        id: 'auth',
        text: 'This screen is not signed in, and starting a lobby needs an account. A venue screen cannot open one yet.',
      };
    case 404:
    case 405:
    case 501:
      return {
        id: 'absent',
        text: 'The table service did not confirm this lobby request. The display will not infer a table or a join code.',
      };
    default:
      break;
  }
  if (result.reason === 'malformed') {
    return {
      id: 'malformed',
      text: 'The table service answered, but not with a lobby. Nothing has been shown from that answer.',
    };
  }
  switch (result.status) {
    case 409:
      return { id: 'conflict', text: 'That lobby has already started or closed.' };
    case 429:
      return { id: 'busy', text: 'The table service is rate-limiting this screen. It will try again shortly.' };
    case 0:
      // No HTTP status at all: the request never produced an answer. Reported before
      // the 5xx branch, because "refused (0)" is not a thing an operator can act on.
      return { id: 'unreachable', text: 'The table service could not be reached from this screen.' };
    default:
      if (result.status >= 500) {
        return { id: 'server', text: `The table service reported an error (${result.status}). No lobby was created.` };
      }
      return { id: 'failed', text: `The table service refused the request (${result.status}). No lobby was created.` };
  }
}

/** Render the state as a sentence, without inventing information the state lacks. */
export function describeState(state) {
  switch (state) {
    case 'CREATED':
      return 'Opening the table.';
    case 'JOINABLE':
      return 'Open for players.';
    case 'READY':
      return 'Everyone is ready.';
    case 'STARTING':
      return 'Starting.';
    case 'LIVE':
      return 'In play.';
    case 'FINISHED':
      return 'This table has finished.';
    case 'EXPIRED':
      return 'This table closed before it started.';
    default:
      return 'This screen does not recognise the state the table service reported.';
  }
}

/**
 * The seat list, as the room should see it.
 *
 * Every seat the lobby reports is rendered, and every seat the lobby does not
 * report stays empty. A seat is only ever filled from `lobby.seats`; there is no
 * placeholder name, no "Player 2", and no default that could read as a person.
 */
export function seatmap(lobby) {
  const capacity = Number.isFinite(lobby?.capacity) ? lobby.capacity : 0;
  const taken = new Map();
  for (const seat of Array.isArray(lobby?.seats) ? lobby.seats : []) {
    if (!seat || !Number.isFinite(seat.seatNo)) continue;
    taken.set(seat.seatNo, {
      seatNo: seat.seatNo,
      displayName: typeof seat.displayName === 'string' && seat.displayName ? seat.displayName : null,
      machine: seat.machine === true,
      ready: seat.ready === true,
    });
  }
  const seats = [];
  for (let i = 1; i <= capacity; i += 1) {
    seats.push(taken.get(i) ?? { seatNo: i, displayName: null, machine: false, ready: false, empty: true });
  }
  return seats;
}

/** How many seats are filled, and how many of those are ready. */
export function occupancy(lobby) {
  const seats = seatmap(lobby);
  const filled = seats.filter((s) => !s.empty);
  return {
    capacity: seats.length,
    filled: filled.length,
    ready: filled.filter((s) => s.ready || s.machine).length,
    open: seats.length - filled.length,
  };
}

/** Seconds left until an ISO-8601 deadline, floored at zero. Null if unparseable. */
export function secondsLeft(deadline, now) {
  if (typeof deadline !== 'string' || !deadline) return null;
  const at = Date.parse(deadline);
  if (Number.isNaN(at)) return null;
  return Math.max(0, Math.round((at - now) / 1000));
}

/** A countdown a person reads across a room. */
export function formatCountdown(seconds) {
  if (seconds === null) return null;
  if (seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Which deadline the room is waiting on, given the state. */
export function activeDeadline(lobby) {
  if (!lobby) return { label: null, deadline: null };
  if (lobby.state === 'CREATED' || lobby.state === 'JOINABLE' || lobby.state === 'READY') {
    return { label: 'Waiting closes in', deadline: lobby.waitDeadline ?? null };
  }
  if (lobby.state === 'STARTING' || lobby.state === 'LIVE') {
    return { label: 'Table closes in', deadline: lobby.expiresAt ?? null };
  }
  return { label: null, deadline: null };
}

/** The URL a phone should open to take a seat. */
export function joinUrl(joinCode, clientPath = '/play/', gameId, ruleVersion) {
  // All three identifiers are mandatory: a code-only scan must never start a private
  // fallback game, and a game-only scan must never masquerade as joining a table.
  if (!isJoinCode(joinCode) || !isGameId(gameId)) return null;
  if (typeof ruleVersion !== 'string' || !ruleVersion.trim() || ruleVersion !== ruleVersion.trim()) return null;
  if (typeof clientPath !== 'string' || !/^\/[a-z0-9/-]*\/$/.test(clientPath)) return null;
  const base = `${CLIENT_ORIGIN}${clientPath}`;
  return `${base}?game=${encodeURIComponent(gameId)}&v=${encodeURIComponent(ruleVersion)}&code=${encodeURIComponent(joinCode)}`;
}

/**
 * The lobby client.
 *
 * @param {object} deps
 *   request - (path, init) => Promise<Response>. Injected so a test can drive any
 *             status without a server.
 *   now     - () => epoch ms. Injected so countdowns are deterministic.
 *   clientPath - which client a scan should open; defaults to the Kadi client.
 */
export function createLobbyClient({ request, now = () => Date.now(), clientPath = '/play/' } = {}) {
  if (typeof request !== 'function') throw new Error('createLobbyClient needs a request function');

  const state = { lobby: null, failure: null, joinCode: null, selectedGameId: null };

  const call = async (path, init) => {
    let response;
    try {
      response = await request(path, init);
    } catch {
      // A network failure and a DNS failure are the same thing to the room.
      return { ok: false, reason: 'unreachable', status: 0 };
    }
    const read = await readJson(response);
    if (read.ok || read.reason === 'malformed') return read;
    // The endpoint's own answer decides whether it exists at all: an HTML error page
    // served with 404 must not be flattened into "the service answered wrongly",
    // because those are different problems an operator fixes differently.
    return read;
  };

  /**
   * Open a lobby for a game.
   *
   * On any failure the previous lobby is cleared rather than left on screen: a
   * stale lobby under a new game's name would attribute one game's seats to
   * another, which is worse than showing nothing.
   */
  async function open(gameId, capacity, options = {}) {
    if (!isGameId(gameId)) {
      state.lobby = null;
      state.joinCode = null;
      state.failure = {
        id: 'bad-game-id',
        text: 'This screen cannot name the game it was asked to open a table for, so it has not asked.',
      };
      return { ok: false, failure: state.failure };
    }
    state.selectedGameId = gameId;
    const payload = {
      gameId,
      ...(capacity ? { capacity } : {}),
      ...(options.waitSeconds ? { waitSeconds: options.waitSeconds } : {}),
      ...(options.ruleVersion ? { ruleVersion: options.ruleVersion } : {}),
      ...(options.gameType ? { gameType: options.gameType } : {}),
      ...(options.machineFill ? { machineFill: options.machineFill } : {}),
      ...(options.tvId ? { tvId: options.tvId } : {}),
      /*
       * The economic class and the sponsor QR visibility decision.
       *
       * Both are pure pass-throughs. The service is the authority for what a class
       * permits, so this client forwards a class name it was handed and never derives
       * one, coerces one, or defaults to FREE — a default here would be a claim about
       * a table that nobody made. The visibility is sent only when an operator
       * actually decided one; supplying a default would publish a code the operator
       * never chose to publish.
       */
      ...(options.economicClass ? { economicClass: options.economicClass } : {}),
      ...(options.sponsorQrVisibility ? { sponsorQrVisibility: options.sponsorQrVisibility } : {}),
    };
    const result = await call('/lobby', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!result.ok || !result.body) {
      state.lobby = null;
      state.joinCode = null;
      state.failure = describeFailure(result);
      return { ok: false, failure: state.failure };
    }

    const body = result.body;
    if (!isJoinCode(body.joinCode)) {
      state.lobby = null;
      state.joinCode = null;
      state.failure = {
        id: 'malformed',
        text: 'The table service created something that is not a lobby. Nothing has been shown from that answer.',
      };
      return { ok: false, failure: state.failure };
    }

    // The server's identity and rules version are the QR contract. If either is
    // missing or disagrees, this is not a table the screen can safely advertise.
    if (!isGameId(body.gameId) || body.gameId !== gameId) {
      state.lobby = null;
      state.joinCode = null;
      state.failure = {
        id: 'game-id-mismatch',
        text: 'The table service did not confirm the requested game, so no join code has been shown.',
      };
      return { ok: false, failure: state.failure };
    }
    if (typeof body.ruleVersion !== 'string' || !body.ruleVersion.trim() || body.ruleVersion !== body.ruleVersion.trim()) {
      state.lobby = null;
      state.joinCode = null;
      state.failure = {
        id: 'rule-version-mismatch',
        text: 'The table service did not confirm a usable rules version, so no join code has been shown.',
      };
      return { ok: false, failure: state.failure };
    }

    state.lobby = body;
    state.joinCode = body.joinCode;
    state.failure = null;
    return { ok: true, lobby: body, joinUrl: joinUrl(body.joinCode, clientPath, body.gameId, body.ruleVersion) };
  }

  function clear() {
    state.lobby = null;
    state.failure = null;
    state.joinCode = null;
    state.selectedGameId = null;
  }

  /** Re-attach this display to the same issued lobby after a reload. */
  async function resume(joinCode) {
    if (!isJoinCode(joinCode)) {
      state.failure = {
        id: 'bad-join-code',
        text: 'The saved table code is not usable, so this screen will not guess another table.',
      };
      return { ok: false, failure: state.failure };
    }
    state.joinCode = joinCode;
    const result = await refresh();
    if (!result.ok) return result;
    state.selectedGameId = result.lobby.gameId;
    return result;
  }

  /** Re-read the lobby. A failure keeps the last known lobby but records the gap. */
  async function refresh() {
    if (!state.joinCode) return { ok: false, failure: state.failure };
    const result = await call(`/lobby/${encodeURIComponent(state.joinCode)}`, { method: 'GET' });
    if (!result.ok || !result.body) {
      state.failure = describeFailure(result);
      return { ok: false, failure: state.failure, lobby: state.lobby };
    }
    state.lobby = result.body;
    state.failure = null;
    return { ok: true, lobby: result.body };
  }

  /**
   * Record a join that a phone has already made.
   *
   * The venue screen is NOT the caller of the join endpoint in normal use: the
   * phone opens the client with the join code and joins from there, and the screen
   * sees the result on its next poll. This exists so a screen that has just shown a
   * code can refresh the roster immediately rather than waiting out the interval,
   * and it is the only write this module performs other than opening a lobby.
   */
  async function recordJoin(displayName) {
    if (!state.joinCode) return { ok: false, failure: state.failure };
    const result = await call(`/lobby/${encodeURIComponent(state.joinCode)}/join`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ displayName }),
    });
    if (!result.ok || !result.body) {
      state.failure = describeFailure(result);
      return { ok: false, failure: state.failure };
    }
    state.lobby = { ...state.lobby, ...result.body };
    state.failure = null;
    return { ok: true, lobby: state.lobby };
  }

  /** Ask the host's service to start the game. The venue screen is not the host. */
  async function start() {
    if (!state.lobby?.lobbyId) return { ok: false, failure: { id: 'absent', text: 'There is no lobby to start.' } };
    const result = await call(`/lobby/${encodeURIComponent(state.lobby.lobbyId)}/start`, { method: 'POST' });
    if (!result.ok || !result.body) {
      state.failure = describeFailure(result);
      return { ok: false, failure: state.failure };
    }
    state.lobby = { ...state.lobby, ...result.body };
    state.failure = null;
    return { ok: true, lobby: state.lobby };
  }

  return {
    open,
    resume,
    clear,
    refresh,
    recordJoin,
    start,
    get lobby() { return state.lobby; },
    get joinCode() { return state.joinCode; },
    get failure() { return state.failure; },
    /** True when the screen must not keep polling this lobby. */
    get settled() { return TERMINAL.has(state.lobby?.state); },
    /** The poll interval for the current state, in milliseconds. */
    get pollMs() { return POLL_MS[state.lobby?.state] ?? POLL_MS.JOINABLE; },
    /** A one-line summary, or the honest failure in its place. */
    get summary() {
      if (state.failure) return state.failure.text;
      if (!state.lobby) return 'No table has been opened from this screen yet.';
      const o = occupancy(state.lobby);
      const countdown = formatCountdown(secondsLeft(activeDeadline(state.lobby).deadline, now()));
      const stateText = describeState(state.lobby.state);
      const seats = o.capacity ? ` ${o.filled} of ${o.capacity} seats taken.` : '';
      return countdown === null ? stateText + seats : `${stateText}${seats} ${countdown} left.`;
    },
  };
}
