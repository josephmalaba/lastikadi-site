/**
 * tv/table.mjs — the table this screen is showing, and the ONE clock it counts down to.
 *
 * WHY THIS EXISTS. The room asked for a countdown that "shows in both the mobile and tv",
 * which is only true if both surfaces render the SAME value. Two client timers that happen
 * to agree are two countdowns; the moment one screen is loaded late, or its clock is off,
 * or its tab is throttled, they disagree in front of the room. So nothing here starts a
 * clock of its own. It reads an absolute deadline the table service states, and renders the
 * difference:
 *
 *   GET https://api.lastikadi.com/lobby/{joinCode}   (no credential; the one public
 *                                                     per-table read the service has)
 *     200 {
 *       "lobbyId": "…", "gameId": "kadi", "ruleVersion": "0.0.3",
 *       "state": "JOINABLE" | "READY" | "STARTING" | "LIVE" | "FINISHED" | "EXPIRED",
 *       "capacity": 2,
 *       "seats": [ { "seatNo": 1, "displayName": "Host", "state": "OPEN" | "HELD" }, … ],
 *       "waitDeadline": 1791151988497,   epoch ms on the SERVICE's clock
 *       "expiresAt":    1791151988497
 *     }
 *
 * That shape and every state above were read off the deployed service on 2026-10-04, not
 * taken from its source; see the report beside this change. `waitDeadline` is the single
 * source of truth the phone would read too, and the whole countdown below is a rendering of
 * it — no timer here can disagree with the phone about WHEN the wait ends.
 *
 * THE CLOCK SKEW IS STATED, NOT HIDDEN. `waitDeadline` is absolute, so the only thing this
 * screen's own clock contributes is the offset. A browser cannot see the service's `Date`
 * header (it is not a CORS-safelisted response header and the service does not expose it —
 * measured), so the offset cannot be corrected from here. When the remaining time is inside
 * a few seconds of zero the screen says the wait is over; it does not pretend to be exact.
 *
 * WHAT THIS MODULE CANNOT DO, named here so nobody has to rediscover it:
 *
 *   - It cannot OPEN the table it would advertise. POST /lobby is authenticated: asked
 *     without a token the deployed service answers 401. So a screen only ever FOLLOWS a
 *     table, and the join code it follows has to arrive from outside (this page reads it
 *     from its own address — see readTableCode). A wall that could mint its own code needs
 *     the service to accept the request from a display, and that is a server change; it is
 *     asked for in the report rather than worked around here.
 *   - It cannot read the PLAY. Every game-state route (POST /deckmaster/state,
 *     /deckmaster/playingdeck, GET /deckmaster/leaders) answers 401 without a signed-in
 *     player's token, and this screen has no account and must not carry one. What is
 *     readable is the lobby's own lifecycle and its seats, and that is exactly what is
 *     shown. ./details.mjs carries the per-game half of that boundary.
 *
 * Nothing here touches the DOM, a global `fetch` or a global clock.
 */

/** The only origin this display talks to. Same origin ./portfolio.mjs reads. */
export const API_ORIGIN = 'https://api.lastikadi.com';

/** The public per-table read. A join code is the only thing it needs. */
export function tableUrl(joinCode) {
  return API_ORIGIN + '/lobby/' + encodeURIComponent(joinCode);
}

/**
 * A venue screen must never be left spinning, for the same reason the portfolio read is
 * bounded: a service that accepts the connection and says nothing looks, from across the
 * room, exactly like a screen that crashed.
 */
export const TABLE_TIMEOUT_MS = 6000;

/**
 * The join-code alphabet the service mints from, to the letter.
 *
 * Copied deliberately rather than generalised, because its whole purpose is to omit the
 * characters a person mishears and mistypes (I, L, O, U, 0, 1). A screen that accepted a
 * looser shape would send a request for a code the service cannot have minted and then
 * report the service's 404 as though the table had expired — blaming the wrong thing.
 */
export const JOIN_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTVWXYZ23456789';
export const JOIN_CODE_LENGTH = 10;

/**
 * Normalize what a person actually typed: any case, and grouping separators.
 *
 * Returns null when the input cannot be a code, so the screen says so itself rather than
 * asking the service a question whose answer it already knows.
 */
export function normalizeJoinCode(raw) {
  if (typeof raw !== 'string') return null;
  if (raw.length > 32) return null;
  let normalized = '';
  for (const symbol of raw) {
    if (symbol === '-' || symbol === ' ' || symbol === '_') continue;
    normalized += symbol.toUpperCase();
  }
  if (normalized.length !== JOIN_CODE_LENGTH) return null;
  for (const symbol of normalized) {
    if (JOIN_CODE_ALPHABET.indexOf(symbol) === -1) return null;
  }
  return normalized;
}

/* ---------------------------------------------------- where the code comes from */

/**
 * The join code this screen has been told to follow, or null.
 *
 * Read from the page's own address, in the query (`?code=…`) or the fragment
 * (`#…&code=…`). Both are accepted because both are how a venue operator will actually
 * attach a screen to a table: the fragment is what this page already rewrites as it carries
 * its chosen game, and the query is what a deployment can pin in a start URL.
 *
 * THE SHAPE OF THE GAP, in one place: this is the ONLY way this screen can learn a code.
 * The service has no listing of open tables and refuses an anonymous POST /lobby, so a
 * display cannot open or discover the table it should be following. A code that is never
 * supplied is not a bug in this reader — it is the missing server mechanism, said out loud.
 */
export function readTableCode(search, hash) {
  const pairs = [];
  for (const raw of [search, hash]) {
    const text = typeof raw === 'string' ? raw.replace(/^[?#]/, '') : '';
    if (!text) continue;
    for (const pair of text.split('&')) {
      const at = pair.indexOf('=');
      if (at <= 0) continue;
      let value = pair.slice(at + 1);
      try {
        value = decodeURIComponent(value);
      } catch {
        continue;
      }
      pairs.push([pair.slice(0, at), value]);
    }
  }
  for (const [key, value] of pairs) {
    if (key !== 'code') continue;
    const code = normalizeJoinCode(value);
    if (code) return code;
  }
  return null;
}

/** Re-attach a code to the fragment this page rewrites, so it survives a reload. */
export function withTableCode(fragment, code) {
  const base = typeof fragment === 'string' ? fragment.replace(/^#/, '') : '';
  const kept = base
    .split('&')
    .filter((pair) => pair && !/^code=/.test(pair))
    .join('&');
  if (!code) return kept ? '#' + kept : '';
  return '#' + (kept ? kept + '&' : '') + 'code=' + encodeURIComponent(code);
}

/* --------------------------------------------------------------- the states */

/**
 * What this screen knows about the table, as six different facts.
 *
 * The middle four are the service's own lifecycle words, mapped rather than renamed: a
 * screen that called LIVE "ready" would be telling the room the opposite of the truth about
 * whether the cards have been dealt.
 */
export const TABLE_STATES = Object.freeze({
  /** No code is named to this screen: it is not following any table. */
  NO_TABLE: 'no-table',
  /** The service does not know this code — expired, or never existed. A fact, not an error. */
  UNKNOWN_CODE: 'unknown-code',
  /** The code the operator typed cannot be a code the service mints. */
  NOT_A_CODE: 'not-a-code',
  /** Open for players, or full and waiting for the host to deal. */
  WAITING: 'waiting',
  /** The cards are on the table. */
  LIVE: 'live',
  /** Finishing or finished. */
  OVER: 'over',
  /** The service named a lifecycle this screen does not understand, and it is shown as said. */
  UNKNOWN_LIFECYCLE: 'unknown-lifecycle',
  /** The address names a code and the first read has not come back yet. Claims nothing. */
  READING: 'reading',
  /**
   * The service refused this screen's credential. Its own fact, not an outage: a screen that
   * reported a 401 as "unreachable" would send an operator to look at the network while the
   * real answer is that the pairing has to be made again.
   */
  REFUSED: 'refused',
  /** The service answered, but not with a table. */
  UNREADABLE: 'unreadable',
  /** There was no usable answer at all. */
  UNREACHABLE: 'unreachable',
});

/** The service's lifecycle words, mapped to what the screen is entitled to claim. */
const LIFECYCLE = Object.freeze({
  CREATED: TABLE_STATES.WAITING,
  JOINABLE: TABLE_STATES.WAITING,
  READY: TABLE_STATES.WAITING,
  STARTING: TABLE_STATES.LIVE,
  LIVE: TABLE_STATES.LIVE,
  FINISHED: TABLE_STATES.OVER,
  EXPIRED: TABLE_STATES.OVER,
});

/* --------------------------------------------------------------- reading one */

function textOrNull(value) {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}

function wholeNumberOrNull(value) {
  return typeof value === 'number' && Number.isFinite(value) && Math.floor(value) === value ? value : null;
}

function unreadable(detail) {
  return { state: TABLE_STATES.UNREADABLE, table: null, detail };
}

/**
 * Turn a parsed body into an outcome, refusing any shape this screen does not understand.
 *
 * A display that shrugged at a shape it could not read and reported "no seats taken" would
 * have converted its own confusion into a fact about the room. The unknown fields are KEPT
 * (see `raw`) rather than dropped, which is what lets a service that starts publishing the
 * play — `play`, `leaders`, whatever it chooses — reach ./details.mjs with no change here.
 */
export function classifyTable(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return unreadable('the answer was not a table object');
  }
  const gameId = textOrNull(payload.gameId);
  if (!gameId) return unreadable('the table carried no game id');
  const lifecycle = textOrNull(payload.state);
  if (!lifecycle) return unreadable('the table carried no state');
  const capacity = wholeNumberOrNull(payload.capacity);
  if (capacity === null || capacity < 1) return unreadable('the table carried no usable seat count');
  if (!Array.isArray(payload.seats)) return unreadable('the table carried no seats list');

  const seats = [];
  for (const entry of payload.seats) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      return unreadable('a seats entry was not an object');
    }
    const seatNo = wholeNumberOrNull(entry.seatNo);
    if (seatNo === null) return unreadable('a seats entry carried no seat number');
    const seatState = textOrNull(entry.state) || 'UNKNOWN';
    seats.push(Object.freeze({
      seatNo,
      displayName: textOrNull(entry.displayName),
      seatState,
      // The service publishes a seat as OPEN or HELD. Anything else is not this screen's
      // word to interpret, so it is not called taken and it is not called free either.
      taken: seatState === 'HELD',
      known: seatState === 'HELD' || seatState === 'OPEN',
    }));
  }
  seats.sort((a, b) => a.seatNo - b.seatNo);

  const waitDeadline = wholeNumberOrNull(payload.waitDeadline);
  const expiresAt = wholeNumberOrNull(payload.expiresAt);

  return {
    state: LIFECYCLE[lifecycle] || TABLE_STATES.UNKNOWN_LIFECYCLE,
    lifecycle,
    table: Object.freeze({
      gameId,
      ruleVersion: textOrNull(payload.ruleVersion),
      lifecycle,
      capacity,
      seats: Object.freeze(seats),
      waitDeadline,
      expiresAt,
      // Everything the service sent, kept whole: this is the seam a future play read
      // arrives through, and ./details.mjs reads it without this file changing.
      raw: payload,
    }),
    detail: '',
  };
}

/**
 * Read one table, and report which of "no answer", "an answer we cannot read", "no such
 * code" and "a table" actually happened.
 *
 * A 404 is NOT an error here. The service answering "Unknown or expired join code" is the
 * service stating a fact about the code, and a screen that reported it as unreachable would
 * send an operator to look at the network.
 */
export async function readTable(fetchImpl, joinCode, options = {}) {
  const code = normalizeJoinCode(joinCode);
  if (!code) {
    return { state: TABLE_STATES.NOT_A_CODE, table: null, detail: 'not a join code this table service mints' };
  }
  const url = options.url || tableUrl(code);
  const timeoutMs = options.timeoutMs === undefined ? TABLE_TIMEOUT_MS : options.timeoutMs;

  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  let timer = null;
  if (controller && timeoutMs > 0) timer = setTimeout(() => controller.abort(), timeoutMs);
  const aborted = () => Boolean(controller && controller.signal && controller.signal.aborted);
  const timedOut = () => ({ state: TABLE_STATES.UNREACHABLE, table: null, detail: 'timed out after ' + timeoutMs + 'ms' });

  try {
    const response = await fetchImpl(url, controller ? { method: 'GET', signal: controller.signal } : { method: 'GET' });
    if (!response || typeof response.ok !== 'boolean') {
      return { state: TABLE_STATES.UNREACHABLE, table: null, detail: 'the service did not answer with a response' };
    }
    if (response.status === 404) {
      return { state: TABLE_STATES.UNKNOWN_CODE, table: null, detail: 'the service has no open table with this code' };
    }
    if (response.status === 401 || response.status === 403) {
      return {
        state: TABLE_STATES.REFUSED,
        table: null,
        detail: 'the service refused this screen\u2019s credential (HTTP ' + response.status + ')',
      };
    }
    if (!response.ok) {
      const status = response.status === undefined ? 'unknown' : response.status;
      return { state: TABLE_STATES.UNREACHABLE, table: null, detail: 'the service answered HTTP ' + status };
    }

    let payload;
    try {
      payload = await response.json();
    } catch {
      if (aborted()) return timedOut();
      return unreadable('the answer was not JSON');
    }
    return classifyTable(payload);
  } catch (error) {
    if (aborted()) return timedOut();
    const name = error && typeof error.name === 'string' && error.name ? error.name : null;
    return {
      state: TABLE_STATES.UNREACHABLE,
      table: null,
      detail: name ? 'the request failed (' + name + ')' : 'the request failed',
    };
  } finally {
    if (timer !== null) clearTimeout(timer);
  }
}

/* ------------------------------------------------------------- the countdown */

/** Seconds as MM:SS, which is what a room reads. Never negative. */
export function clockText(remainingMs) {
  const total = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

/**
 * The countdown, as data, from the service's own deadline and this screen's clock.
 *
 * `shows` is false in every state where a countdown would be a claim this screen cannot
 * support: no table, an unknown code, a table already in play, or a table whose service
 * stated no deadline. It is never faked, and it never counts up.
 */
export function countdownFor(outcome, nowMs) {
  const table = outcome && outcome.table ? outcome.table : null;
  if (!table) return { shows: false, over: false, text: '', remainingMs: null, reason: 'there is no table to count down' };
  if (outcome.state !== TABLE_STATES.WAITING) {
    return { shows: false, over: false, text: '', remainingMs: null, reason: 'the wait is over' };
  }
  if (table.waitDeadline === null) {
    return { shows: false, over: false, text: '', remainingMs: null, reason: 'the service stated no waiting deadline' };
  }
  const remainingMs = table.waitDeadline - nowMs;
  return {
    shows: true,
    over: remainingMs <= 0,
    text: clockText(remainingMs),
    remainingMs,
    reason: '',
  };
}

/* --------------------------------------------------------------- what to show */

function seatsOf(table) {
  if (!table) return { taken: 0, capacity: 0, open: 0, unknown: 0, text: '' };
  const taken = table.seats.filter((s) => s.taken).length;
  const unknown = table.seats.filter((s) => !s.known).length;
  const open = Math.max(0, table.capacity - taken);
  return { taken, capacity: table.capacity, open, unknown, text: taken + ' of ' + table.capacity + ' seats taken' };
}

/**
 * The words each state puts on screen.
 *
 * As in ./portfolio.mjs, `marker` is a second, non-colour signal: a room read at ten feet
 * must be able to tell "waiting" from "playing" without seeing a tint. `needs` is what the
 * screen would have to be told to say more, in the operator's words rather than a
 * developer's, and it is never shown as a filled-in value.
 */
export const TABLE_TEXT = Object.freeze({
  [TABLE_STATES.NO_TABLE]: {
    word: 'No table named',
    marker: '·',
    warn: false,
    waitingFor: 'This screen is not following a table, so there is nothing to count down.',
    needs: 'the join code of the table this screen should follow, in its own address as ?code=XXXXXXXXXX',
  },
  [TABLE_STATES.NOT_A_CODE]: {
    word: 'Not a join code',
    marker: '!',
    warn: true,
    waitingFor: 'The code in this screen\u2019s address is not one the table service mints (ten characters, no I, L, O, U, 0 or 1).',
    needs: 'a join code in the shape the table service mints',
  },
  [TABLE_STATES.UNKNOWN_CODE]: {
    word: 'No such table',
    marker: '×',
    warn: true,
    waitingFor: 'The table service has no open table with the code this screen was given — it has expired, or the table has finished.',
    needs: 'a join code for a table that is still open at the table service',
  },
  [TABLE_STATES.WAITING]: {
    word: 'Waiting',
    marker: '·',
    warn: false,
    waitingFor: '',
    needs: '',
  },
  [TABLE_STATES.LIVE]: {
    word: 'In play',
    marker: '·',
    warn: false,
    waitingFor: 'The cards are on the table. The scan code has come down, because its job is finished.',
    needs: '',
  },
  [TABLE_STATES.OVER]: {
    word: 'Finished',
    marker: '·',
    warn: false,
    waitingFor: 'This table has finished at the table service.',
    needs: '',
  },
  [TABLE_STATES.UNKNOWN_LIFECYCLE]: {
    word: 'State not known',
    marker: '!',
    warn: true,
    waitingFor: 'The table service named a lifecycle this screen does not know, and it is shown as the service said it.',
    needs: '',
  },
  [TABLE_STATES.READING]: {
    word: 'Reading the table',
    marker: '…',
    warn: false,
    waitingFor: 'Reading this table from the table service…',
    needs: '',
  },
  [TABLE_STATES.REFUSED]: {
    word: 'Pairing refused',
    marker: '!',
    warn: true,
    waitingFor: 'The table service refused this screen\u2019s credential, so it cannot read this table until it is paired again.',
    needs: 'a pairing this screen is allowed to use',
  },
  [TABLE_STATES.UNREADABLE]: {
    word: 'Answer not understood',
    marker: '!',
    warn: true,
    waitingFor: 'The table service answered, but not with a table, so the state of this table is unknown.',
    needs: '',
  },
  [TABLE_STATES.UNREACHABLE]: {
    word: 'Table unreadable',
    marker: '!',
    warn: true,
    waitingFor: 'Could not read this table from the table service, so whether it is waiting or in play is unknown — which is not the same as it being empty.',
    needs: '',
  },
});

/** The sentence under the clock while the table is waiting for something. */
function waitingSentence(state, table, seats, countdown) {
  if (state === TABLE_STATES.WAITING) {
    if (seats.open > 0) {
      return 'Waiting for ' + seats.open + ' more player' + (seats.open === 1 ? '' : 's')
        + ' to take a seat at this table.';
    }
    return 'Every seat is taken. Waiting for the table to be started.';
  }
  const text = TABLE_TEXT[state];
  if (state === TABLE_STATES.UNKNOWN_LIFECYCLE && table) {
    return text.waitingFor + ' It says: ' + table.lifecycle + '.';
  }
  return text.waitingFor;
}

/**
 * Decide everything the left column says, as data.
 *
 * `selection` is the portfolio's chosen game (or null), and it is used for one thing only:
 * to say which game the table is for when the table came back with a game name this screen
 * cannot spell any better. The table's own gameId is authoritative.
 */
export function tablePlan(outcome, selection, nowMs) {
  const state = outcome && outcome.state ? outcome.state : TABLE_STATES.NO_TABLE;
  const table = outcome && outcome.table ? outcome.table : null;
  const text = TABLE_TEXT[state] || TABLE_TEXT[TABLE_STATES.UNREADABLE];
  const seats = seatsOf(table);
  const countdown = countdownFor(outcome, nowMs);

  const plan = {
    state,
    table,
    detail: textOrNull(outcome && outcome.detail) || '',
    word: text.word,
    marker: text.marker,
    warn: text.warn,
    needs: text.needs,
    countdown,
    seats,
    waitingFor: waitingSentence(state, table, seats, countdown),
    gameId: table ? table.gameId : (selection ? selection.gameId : null),
    ruleVersion: table && table.ruleVersion ? table.ruleVersion : (selection ? selection.ruleVersion : null),
    /*
     * MAY THE SCAN CODE STAY ON SCREEN?
     *
     * The scan code's job is to put a phone at this table, and that job ends when play
     * begins. So it comes down the moment the service says the table is in play or over.
     * It also comes down when the screen was given a code that turns out not to be a table
     * at all, because then the promise it makes is one nothing is standing behind.
     *
     * It STAYS when the table cannot be read. That is not a lapse: the code encodes the
     * game and its rules version, which is still true, and taking the only way in off a
     * wall because the wall could not reach the service would punish the room for the
     * screen's fault. The state is reported underneath either way.
     */
    scanAllowed: !(state === TABLE_STATES.LIVE
      || state === TABLE_STATES.OVER
      || state === TABLE_STATES.UNKNOWN_CODE
      || state === TABLE_STATES.NOT_A_CODE),
  };

  // A countdown at zero is stated as over rather than as "00:00" — the same fact the phone
  // is showing, said in words a room can act on.
  plan.waitingFor = countdown.shows && countdown.over && plan.state === TABLE_STATES.WAITING
    ? 'The wait is over. The table service will not take another player at this code.'
    : plan.waitingFor;

  return plan;
}

/* ------------------------------------------------------------------ painting */

/**
 * Paint the left column's table block. This function decides nothing: every word and
 * whether the clock is shown at all arrive in the plan.
 */
export function renderTable(doc, ui, plan) {
  ui.stage.dataset.table = plan.state;
  ui.countdown.hidden = !plan.countdown.shows;
  ui.countdown.textContent = plan.countdown.shows ? plan.countdown.text : '';
  ui.countdownWord.textContent = plan.marker + ' ' + plan.word;
  ui.countdownWord.dataset.state = plan.state;
  ui.countdownWord.className = plan.warn ? 'clock__word warn' : 'clock__word';
  ui.countdownDetail.textContent = plan.waitingFor;
  // The precise thing this screen would need in order to say more, as machine-readable
  // data on the element rather than as another sentence on a wall. Present only when the
  // screen is genuinely short of something.
  if (plan.needs) ui.countdownDetail.dataset.needs = plan.needs;
  else delete ui.countdownDetail.dataset.needs;
  return plan;
}
