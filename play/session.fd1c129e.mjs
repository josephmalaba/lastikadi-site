/**
 * play/session.mjs — what a scanned guest has to do before a card can be dealt.
 *
 * THE DEFECT THIS EXISTS FOR. The scanned path used to try the network and, on any
 * failure, deal an offline game instead. That is worse than an error: the guest plays,
 * believes he played, and nothing reached the server — no session, no table, no record.
 * The Founder reported exactly this ("it seems it opens an offline game"). Underneath it,
 * three separate things were wrong and every one of them hid the others:
 *
 *   1. no Authorization header was sent at all, so every call was unauthenticated;
 *   2. `playerId` was a constant `1`, so the ownership rule refused the caller's own seat;
 *   3. the machine seat was a constant `2`, and the deployed seat rule refuses a machine
 *      seat unless the account really is a non-human principal — account 2 is a human, so
 *      the table was refused even when the first two were fixed.
 *
 * And the error the guest saw said "the game server is not reachable". The server was
 * fine: /readiness answered 200 the whole time. Blaming the transport for a client defect
 * is a measurement failure, and it is why this survived as long as it did.
 *
 * WHAT THIS MODULE DOES, in order, and nothing more:
 *
 *   signIn()      a guest account, created once per browser and reused, so a scan needs
 *                 no typing. The token is the only thing kept.
 *   whoAmI()      the caller's own NUMERIC account id. The seat rule needs that exact
 *                 number, and the auth response deliberately does not carry it (it
 *                 returns an opaque `lk_…` subject id instead), so it is read from the
 *                 only authenticated surface that publishes it. See the note on
 *                 discoverAccountId() — this is the ugliest line in the client and it is
 *                 called out rather than hidden.
 *   openTable()   a fresh table per visit, seating the caller and the commissioned
 *                 machine account, so "each gets his own game" is true by construction.
 *   resume()      the same table again, which is what a reload needs.
 *
 * AND THE SHARED-TABLE HALF, which is a different journey with a different order:
 *
 *   resolveLobby()    the code a scan carries, resolved PUBLICLY before sign-in, so a table
 *                     that does not exist costs a guest nothing and the screen can say which
 *                     game, which version, how many seats, and how long is left.
 *   joinLobby()       this phone's own seat at that table, and then the table's state again
 *                     from the same public route, so the countdown comes from the service.
 *   joinSharedTable() the two above in the order they must happen, plus the descriptor a
 *                     started table has to publish before this client can play it.
 *                     See PLAY_DESCRIPTOR_GAP: a started lobby table is addressed by a
 *                     runtime session id, where a machine seat never moves and no account
 *                     but the seat's own may act — measured, not assumed — so a table that
 *                     has started is its OWN outcome rather than a game.
 *
 * WHY openTable() IS NOT "START": the earlier client posted the caller's own id and a
 * guessed machine id and treated whatever came back as a game. It never checked that the
 * seat it asked for was the seat it got. Every call here reads the server's answer and
 * refuses when the answer is not the table that was asked for.
 *
 * Nothing here touches the DOM, and every network call goes through an injected `fetchImpl`
 * so the whole flow — including each refusal — is exercised by tests/session.test.mjs.
 */

import { SERVED } from './identity.777b0687.mjs';
import { hasStarted } from './waiting.a48eaa74.mjs';

/** Where the table service lives. The only origin this client talks to. */
export const SERVICE_BASE = 'https://api.lastikadi.com';

/** A seat rule that refuses is not a transport failure, and the two are kept apart. */
export const OUTCOMES = Object.freeze({
  OPEN: 'open',
  NO_ACCOUNT: 'no-account',
  ID_UNKNOWN: 'id-unknown',
  SEAT_REFUSED: 'seat-refused',
  UNREACHABLE: 'unreachable',
  /**
   * The service answered, and the answer was a fault on ITS side: a 5xx, or a status this
   * client does not recognise as a refusal.
   *
   * WHY THIS EXISTS. It was added after watching the real thing: the service briefly
   * answered `502 Application failed to respond`, and the client reported it as a seat
   * refusal — sending the reader to look at seat configuration when the fault was a service
   * that was down. That is the same class of error as "the game server is not reachable"
   * for a client defect, one layer along, and it is kept apart for the same reason.
   */
  SERVICE_FAULT: 'service-fault',
  /**
   * The code on the scan is not a table this service knows. `GET /lobby/{code}` is public
   * and answers `404 {"error":"Unknown or expired join code"}` — measured live — so an
   * unknown code and an expired one are the same answer from the service and are reported
   * as the one refusal the service made. It is its own outcome because it is NOT a practice
   * game and NOT a fault: the link named a table and the table is not there.
   */
  CODE_UNKNOWN: 'code-unknown',
  /**
   * The table exists and has not started: the state a waiting screen is for. The lobby it
   * resolved is attached to the outcome, so the countdown is a fact about the service's
   * answer rather than about this client's clock.
   */
  TABLE_WAITING: 'table-waiting',
  /**
   * The table has started, and this client does not yet have a way to PLAY it. Kept apart
   * from every other outcome on purpose, and the reason is measured rather than assumed:
   * see `PLAY_DESCRIPTOR_GAP` below.
   */
  TABLE_STARTED_UNPLAYABLE: 'table-started-unplayable',
});

/**
 * WHY A STARTED SHARED TABLE IS ITS OWN OUTCOME, in the service's own measured behaviour.
 *
 * A lobby that reaches LIVE is addressed by a RUNTIME SESSION id:
 *
 *   POST /lobby/{id}/start -> 200 {"lobbyId":…,"state":"LIVE","gameId":"kadi",
 *                                  "ruleVersion":"0.0.3","sessionId":"58794c98-…"}
 *
 * and its moves go through `POST /runtime/sessions/{sessionId}/execute`. Measured against
 * production as the account holding seat 1 of a two-human kadi lobby, on 2026-10-04:
 *
 *   - `draw` as seat "1" -> 200 status "ok"; the turn advanced 1 -> 2. The table is real and
 *     it does move.
 *   - `query`/`execute` as seat "2" -> 403 SEAT_NOT_AUTHORIZED ("You cannot act for another
 *     player"), so this client cannot act for the other seat either.
 *   - `execute` `machineTurn` / `playMachineTurn` / `tick` / `advance` -> 200 with
 *     `["Unsupported command: …"]`, so a machine turn is not a command on this boundary.
 *   - with the turn on seat 2, nothing moved for 8 seconds.
 *   - `RuntimeHostService.execute` calls `session.runtime().execute(command)` and nothing
 *     else, and the shipped `kadi-rule-engine-0.0.3` jar's `KadiGameRuntime` contains no
 *     `playMachineTurn` at all — it is the `/deckmaster` path's `GameService.advanceMachines`
 *     that plays machine seats, and that path takes a numeric game id and its own seat list.
 *
 * So a lobby-started table cannot be finished by this client: with the turn on the machine's
 * seat, no account is authorised to act and no command exists that would make it act. THAT is
 * the gap, it is a property of the deployed service, and this client states it instead of
 * sitting at a table that will never move again. Reimplementing `advanceMachines` in the
 * browser is not an option: the machine seat is a different account, the boundary refuses
 * every account that is not the seat's own, and a client-side machine would be a second rules
 * authority — the opposite of the host contract this client is built on.
 */
export const PLAY_DESCRIPTOR_GAP =
  'the table started, and this client cannot play it: its moves live at /runtime/sessions/'
  + '{id}/execute, where the seat this client does not hold refuses every account '
  + '(403 SEAT_NOT_AUTHORIZED) and where no command makes a machine seat move. The service '
  + 'that advances machine seats is the /deckmaster path, which is addressed by a numeric '
  + 'game id and takes its own seat list, and a started lobby does not publish either.';

/** How long a single call may take before it is reported as no answer at all. */
export const CALL_TIMEOUT_MS = 12000;

/**
 * How often the waiting screen asks the service what state its table is in.
 *
 * The COUNTDOWN is not on this timer: it is computed from the service's `waitDeadline` on
 * every repaint (see play/waiting.mjs), so a slow or missed poll cannot make the number on
 * screen wrong. This is only how often the state — JOINABLE, READY, LIVE — is re-read.
 */
export const POLL_MS = 2000;

/**
 * A table id for this visit.
 *
 * Nine digits, so the id stays inside the service's 32-bit `gameId`: a stamp that rolls
 * every hundred seconds, a random thousand, and a per-process counter so two visits in the
 * same millisecond cannot name the same table. Two people scanning the same screen at the
 * same moment must not land at one table — "each gets his own game" is a property of the id
 * as much as of the seat list.
 */
let issued = 0;
export function newTableId(now = Date.now()) {
  issued = (issued + 1) % 1000;
  const stamp = Math.abs(Math.trunc(now)) % 100000;
  const rand = Math.floor(Math.random() * 1000);
  return 1000000000 + ((stamp * 1000 + rand) % 1000000) * 1000 + issued;
}

function textOrNull(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

/**
 * One JSON call, with a deadline, that reports the transport and the answer separately.
 *
 * `ok` is about the transport and the HTTP status. The body is handed back whatever it is,
 * because the service's refusals carry the reason and that reason is what the guest has to
 * be shown — `"Card cannot be played"` is a fact about the game and must not be flattened
 * into "something went wrong".
 */
export async function call(fetchImpl, base, path, { method = 'POST', body, token } = {}) {
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  let timer = null;
  if (controller) timer = setTimeout(() => controller.abort(), CALL_TIMEOUT_MS);
  try {
    const headers = { 'content-type': 'application/json' };
    if (token) headers.authorization = `Bearer ${token}`;
    const response = await fetchImpl(base + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      ...(controller ? { signal: controller.signal } : {}),
    });
    if (!response || typeof response.status !== 'number') {
      return { ok: false, status: null, body: null, error: 'the service did not answer with a response' };
    }
    let parsed = null;
    try { parsed = await response.json(); } catch { parsed = null; }
    const reason = parsed && typeof parsed === 'object'
      ? (textOrNull(parsed.error) || textOrNull(parsed.message))
      : null;
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      body: parsed,
      error: reason || (parsed === null ? 'the answer was not JSON' : null),
    };
  } catch (error) {
    const aborted = Boolean(controller && controller.signal.aborted);
    return {
      ok: false,
      status: null,
      body: null,
      error: aborted ? `no answer within ${CALL_TIMEOUT_MS}ms` : 'the request failed: ' + ((error && error.message) || 'unknown'),
    };
  } finally {
    if (timer !== null) clearTimeout(timer);
  }
}

/**
 * The caller's own numeric account id, read from the only authenticated surface that
 * publishes it.
 *
 * THIS IS A WORKAROUND AND IT SHOULD NOT BE. The seat rule the game endpoints enforce is
 * `playerId must equal the token's account id`; the auth response returns an opaque
 * `lk_…` subject id and no account id, so a client is never told the number it is
 * required to send. `/deckmaster/leaders` is an ordinary authenticated endpoint that
 * publishes every account's id next to its username — so a client can find its own row.
 * That is how this works today, with no API change, and it means two things worth stating
 * plainly: it depends on the username being unique (the store enforces that), and it makes
 * a client read the account list to learn one fact about itself.
 *
 * `match` is the signed-in username. Returns null when the answer does not contain exactly
 * one matching row, which is a refusal rather than a guess: an ambiguous answer must not
 * become the identity a table is opened under.
 */
export async function discoverAccountId(fetchImpl, base, token, username) {
  const result = await call(fetchImpl, base, '/deckmaster/leaders', { method: 'GET', token });
  if (!result.ok || !Array.isArray(result.body)) {
    return { ok: false, id: null, error: result.error || 'the account list could not be read' };
  }
  const matches = result.body.filter((entry) => entry && String(entry.username) === username);
  if (matches.length !== 1) {
    return { ok: false, id: null, error: matches.length === 0
      ? 'the service did not list this account'
      : 'the service listed this account ' + matches.length + ' times' };
  }
  const id = matches[0].playerId;
  if (!Number.isInteger(id) || id <= 0) {
    return { ok: false, id: null, error: 'the service listed this account with no usable id' };
  }
  return { ok: true, id, error: null };
}

/** A guest username: unique, and obviously not a person typing their name. */
export function guestUsername(seed = Math.random()) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let suffix = '';
  let value = Math.abs(Math.trunc(seed * Number.MAX_SAFE_INTEGER)) || 1;
  for (let i = 0; i < 10; i++) { suffix += alphabet[value % alphabet.length]; value = Math.floor(value / alphabet.length) || 7; }
  return 'venueguest-' + suffix;
}

/**
 * Sign in, creating the guest account on first use.
 *
 * `store` is passed in (localStorage in the browser, a stub under test) so the token and
 * the discovered id survive a reload: a scan that lands on an already-known browser opens
 * a new table rather than making another account.
 */
export async function signIn(fetchImpl, base, store, options = {}) {
  const existing = store.get('token');
  const existingName = store.get('username');
  if (existing && existingName) {
    const check = await call(fetchImpl, base, '/deckmaster/leaders', { method: 'GET', token: existing });
    if (check.ok) return { ok: true, token: existing, username: existingName, created: false, error: null };
    store.remove('token');
    store.remove('username');
    store.remove('accountId');
  }

  const username = options.username || guestUsername();
  const password = options.password || ('venue-' + guestUsername(options.seed) + '-9x');
  const created = await call(fetchImpl, base, '/auth/register', {
    method: 'POST', body: { username, email: `${username}@venue.invalid`, password },
  });
  if (created.ok && created.body && textOrNull(created.body.token)) {
    store.set('token', created.body.token);
    store.set('username', textOrNull(created.body.username) || username);
    store.remove('accountId');
    return { ok: true, token: created.body.token, username: store.get('username'), created: true, error: null };
  }

  // A name that is already taken is the ordinary race between two scans of the same
  // browser, and signing in is the right answer to it rather than a second account.
  const signedIn = await call(fetchImpl, base, '/auth/login', { method: 'POST', body: { username, password } });
  if (signedIn.ok && signedIn.body && textOrNull(signedIn.body.token)) {
    store.set('token', signedIn.body.token);
    store.set('username', textOrNull(signedIn.body.username) || username);
    store.remove('accountId');
    return { ok: true, token: signedIn.body.token, username: store.get('username'), created: false, error: null };
  }

  return {
    ok: false, token: null, username: null, created: false,
    error: created.error || signedIn.error || 'the service would not open a session for this browser',
  };
}

/**
 * Open a table of the caller plus the commissioned machine account.
 *
 * The body is the count form the service documents for exactly this: `playerCount` is the
 * number of seats, the caller holds one of them (the service reads the caller from the
 * token, it is not told), and the machine seats fill the rest. `playerIds` is sent as well
 * — the client's own record of who is seated — and the answer is checked against it.
 */
export async function openTable(fetchImpl, base, token, accountId, game, options = {}) {
  const tableId = options.tableId === undefined ? newTableId() : options.tableId;
  const machineId = options.machineAccountId === undefined ? game.machineAccountId : options.machineAccountId;
  const seats = [accountId, machineId];
  const body = {
    playerId: accountId,
    gameId: tableId,
    playerCount: seats.length,
    playerIds: seats,
    machinePlayerIds: [machineId],
  };
  const result = await call(fetchImpl, base, '/deckmaster/start', { method: 'POST', body, token });
  return judge(result, { tableId, accountId, machineId, seats });
}

/** Read a table again — what a reload needs, and what proves a table is still there. */
export async function resumeTable(fetchImpl, base, token, table) {
  const body = seatBody(table);
  const result = await call(fetchImpl, base, '/deckmaster/state', { method: 'POST', body, token });
  return judge(result, table);
}

/** The body every later call about this table must carry, identical to the one that made it. */
export function seatBody(table) {
  return {
    playerId: table.accountId,
    gameId: table.tableId,
    playerCount: table.seats.length,
    playerIds: table.seats,
    machinePlayerIds: [table.machineId],
  };
}

/**
 * Turn the service's answer into an outcome, and refuse anything that is not the table
 * that was asked for.
 *
 * The seat rule's refusals are 403s with a reason in the body, and they are NOT transport
 * failures. Keeping them apart is the whole point: `SEAT_REFUSED` says the service
 * declined to seat somebody, `UNREACHABLE` says nobody answered, and a guest is owed the
 * difference.
 */
export function judge(result, table) {
  if (result.ok && result.body && typeof result.body === 'object') {
    const seated = Array.isArray(result.body.machinePlayerIds) ? result.body.machinePlayerIds : null;
    if (seated && !seated.includes(table.machineId)) {
      return {
        outcome: OUTCOMES.SEAT_REFUSED, table: null, state: result.body,
        error: 'the service opened a table without the machine seat this client asked for (account '
          + table.machineId + ')',
        machineId: table.machineId,
      };
    }
    return { outcome: OUTCOMES.OPEN, table, state: result.body, error: null };
  }
  if (result.status === 401) {
    return { outcome: OUTCOMES.NO_ACCOUNT, table: null, state: null, error: result.error || 'the service did not accept this session' };
  }
  if (result.status === 403) {
    /*
     * A refused seat is almost always a refused MACHINE seat, because the machine is the
     * only seat the caller does not hold itself. The client's machine account is a named
     * constant that cannot be discovered (see play/identity.mjs), so a refusal here is the
     * service telling this client its constant is wrong — and the number is named in the
     * sentence so the failure is diagnosable instead of reading "Forbidden".
     */
    return {
      outcome: OUTCOMES.SEAT_REFUSED, table: null, state: null,
      error: (result.error || 'the service refused a seat at this table')
        + ' This client names account ' + table.machineId + ' as the commissioned machine seat; '
        + 'if the service has commissioned a different one, this client needs updating.',
      machineId: table.machineId,
    };
  }
  if (result.status === null) {
    return { outcome: OUTCOMES.UNREACHABLE, table: null, state: null, error: result.error };
  }
  // Anything else: the service answered, but not with a refusal this client recognises. It
  // is a fault on the service's side and it must not be dressed up as a seat refusal.
  return {
    outcome: OUTCOMES.SERVICE_FAULT, table: null, state: null,
    error: `the service answered HTTP ${result.status}`
      + (result.error ? ' (' + result.error + ')' : '')
      + ' — that is a fault at the service, not a refusal of this table',
  };
}

/**
 * The whole journey, in the order the page needs it, returning the state a screen can
 * render. A caller that already has a token and a remembered id skips the discovery.
 */
export async function joinVenue(fetchImpl, base, store, game = SERVED.kadi, options = {}) {
  const session = await signIn(fetchImpl, base, store, options);
  if (!session.ok) return { outcome: OUTCOMES.NO_ACCOUNT, table: null, state: null, session, error: session.error };

  let accountId = Number(store.get('accountId'));
  if (!Number.isInteger(accountId) || accountId <= 0) {
    const found = await discoverAccountId(fetchImpl, base, session.token, session.username);
    if (!found.ok) {
      return { outcome: OUTCOMES.ID_UNKNOWN, table: null, state: null, session, error: found.error };
    }
    accountId = found.id;
    store.set('accountId', String(accountId));
  }

  const opened = await openTable(fetchImpl, base, session.token, accountId, game, options);
  return { ...opened, session, accountId };
}

/* ------------------------------------------------------------------ the shared table */

/**
 * Resolve the code a scan carries — BEFORE signing in, and with no token at all.
 *
 * `GET /lobby/{joinCode}` is the one public route on this service, and its own documentation
 * says why: "a phone has to resolve a code BEFORE it can sign in". So this is the first thing
 * the client does with a link that carries a code, and it is what lets the screen say which
 * game, which rules version, how many seats and how long is left before any account exists.
 *
 * The service's 404 is its own answer — `{"error":"Unknown or expired join code"}`, measured
 * live — and it becomes `CODE_UNKNOWN` rather than an outage, a refusal of a seat, or a
 * practice game. A code that cannot be resolved names no table, and a client that invented
 * one would be inventing somebody else's table.
 */
export async function resolveLobby(fetchImpl, base, code) {
  const trimmed = typeof code === 'string' ? code.trim() : '';
  if (trimmed === '') return { outcome: OUTCOMES.CODE_UNKNOWN, lobby: null, error: 'this link carries no table code' };
  const result = await call(fetchImpl, base, '/lobby/' + encodeURIComponent(trimmed), { method: 'GET' });
  if (result.ok && result.body && typeof result.body === 'object') {
    return { outcome: OUTCOMES.TABLE_WAITING, lobby: result.body, error: null };
  }
  if (result.status === 404) {
    return {
      outcome: OUTCOMES.CODE_UNKNOWN, lobby: null,
      error: result.error || 'the table service does not know that code',
    };
  }
  if (result.status === null) return { outcome: OUTCOMES.UNREACHABLE, lobby: null, error: result.error };
  return {
    outcome: OUTCOMES.SERVICE_FAULT, lobby: null,
    error: `the service answered HTTP ${result.status}` + (result.error ? ' (' + result.error + ')' : '')
      + ' to the public table lookup — that is a fault at the service, not a bad code',
  };
}

/**
 * Claim this phone's seat at the table the code names, and say what the table is waiting for.
 *
 * `join` is the account's OWN action and the only way a seat is taken (the service states
 * that as a rule and enforces it). A caller that already holds a seat gets that same seat
 * back — which is what makes a reload safe — and a full table is refused as full, so a phone
 * arriving late is told the table is full rather than quietly given nothing.
 *
 * AFTER JOINING, the state is re-read from the public route rather than taken from the join
 * answer: the join answer is about this caller's seat, and the waiting screen is about the
 * whole table. Re-reading also means the countdown a phone shows is derived from the same
 * field the venue display reads, whichever of the two arrived second.
 */
export async function joinLobby(fetchImpl, base, token, code, options = {}) {
  const trimmed = typeof code === 'string' ? code.trim() : '';
  if (trimmed === '') return { outcome: OUTCOMES.CODE_UNKNOWN, lobby: null, seatNo: null, error: 'this link carries no table code' };
  const path = '/lobby/' + encodeURIComponent(trimmed) + '/join';
  const body = options.displayName ? { displayName: options.displayName } : {};
  const joined = await call(fetchImpl, base, path, { method: 'POST', body, token });
  if (!joined.ok) {
    if (joined.status === 401) return { outcome: OUTCOMES.NO_ACCOUNT, lobby: null, seatNo: null, error: joined.error };
    if (joined.status === 404) {
      return { outcome: OUTCOMES.CODE_UNKNOWN, lobby: null, seatNo: null, error: joined.error || 'that table code is not there' };
    }
    if (joined.status === 409) {
      // Full, already started, or past its deadline — the service says which, and its own
      // sentence is what a guest needs. All three mean "no seat for you here", none means
      // "the service is broken", and none means "play offline".
      return { outcome: OUTCOMES.SEAT_REFUSED, lobby: null, seatNo: null, error: joined.error || 'this table would not take a seat' };
    }
    if (joined.status === null) return { outcome: OUTCOMES.UNREACHABLE, lobby: null, seatNo: null, error: joined.error };
    return {
      outcome: OUTCOMES.SERVICE_FAULT, lobby: null, seatNo: null,
      error: `the service answered HTTP ${joined.status}` + (joined.error ? ' (' + joined.error + ')' : '')
        + ' — that is a fault at the service, not a refusal of this seat',
    };
  }

  const seatNo = joined.body && Number.isInteger(joined.body.seatNo) ? joined.body.seatNo : null;
  const again = await resolveLobby(fetchImpl, base, trimmed);
  return { outcome: again.outcome, lobby: again.lobby, seatNo, error: again.error };
}

/**
 * What a started table would have to publish before this client can play it.
 *
 * READ FROM THE SERVICE'S OWN ANSWER, and deliberately strict: a numeric game id AND the
 * seat list that game id is played with. Anything less is not a table this client can address
 * on the path that advances machine seats, and a half-answer is refused rather than guessed —
 * the alternative is opening a `/deckmaster` table with a seat list this client invented,
 * which is exactly the defect the old `playerId = 1` and `machine = 2` constants were.
 *
 * Returns null when the answer carries no such descriptor. `PLAY_DESCRIPTOR_GAP` above says
 * what is missing and why.
 */
export function playDescriptor(body) {
  if (!body || typeof body !== 'object') return null;
  const tableId = Number.isInteger(body.engineGameId) && body.engineGameId > 0 ? body.engineGameId : null;
  const seats = Array.isArray(body.playerIds) && body.playerIds.length
    && body.playerIds.every((n) => Number.isInteger(n) && n > 0) ? body.playerIds.slice() : null;
  const machineId = Number.isInteger(body.machineAccountId) && body.machineAccountId > 0 ? body.machineAccountId : null;
  if (tableId === null || seats === null || machineId === null) return null;
  if (!seats.includes(machineId)) return null;
  return { tableId, seats, machineId, sessionId: typeof body.sessionId === 'string' ? body.sessionId : null };
}

/**
 * The whole shared-table journey: resolve the code publicly, sign in, and take a seat.
 *
 * The order is the point. The code is resolved BEFORE sign-in because the service allows it
 * and because a code that names no table should cost a guest nothing — no account, no seat,
 * no request that could be mistaken for consent. Only once the table is known to exist, and
 * to be for a game and rules version this client serves, is an account created.
 *
 * A table that has already started is reported as `TABLE_STARTED_UNPLAYABLE` together with a
 * resolved descriptor if the service ever publishes one, so the moment that gap closes the
 * play path is a small, tested change here rather than a rewrite in the page.
 */
export async function joinSharedTable(fetchImpl, base, store, code, game = SERVED.kadi, options = {}) {
  const resolved = await resolveLobby(fetchImpl, base, code);
  if (resolved.outcome !== OUTCOMES.TABLE_WAITING) {
    return { ...resolved, session: null, accountId: null, seatNo: null, play: null };
  }

  /*
   * THE ACCOUNT IS MADE AFTER THE TABLE IS KNOWN TO EXIST, and BEFORE the state is acted on.
   * The order is the point twice over:
   *
   *   - before sign-in: a code that names no table costs a guest nothing, which is why the
   *     resolve is public in the first place;
   *   - after the resolve, and NOT after the state check: a table that has already started is
   *     still a table this phone is entitled to play, and a client that returned the started
   *     outcome without signing in had no session to play it with. Measured, not reasoned
   *     about — the first build of this did exactly that and the started-table case failed
   *     with "Cannot read properties of null (reading 'token')" in real Chrome.
   */
  const session = await signIn(fetchImpl, base, store, options);
  if (!session.ok) {
    return { outcome: OUTCOMES.NO_ACCOUNT, lobby: resolved.lobby, session: null, accountId: null, seatNo: null, play: null, error: session.error };
  }

  let accountId = Number(store.get('accountId'));
  if (!Number.isInteger(accountId) || accountId <= 0) {
    const found = await discoverAccountId(fetchImpl, base, session.token, session.username);
    if (!found.ok) {
      return { outcome: OUTCOMES.ID_UNKNOWN, lobby: resolved.lobby, session, accountId: null, seatNo: null, play: null, error: found.error };
    }
    accountId = found.id;
    store.set('accountId', String(accountId));
  }

  if (hasStarted(resolved.lobby)) {
    return {
      outcome: OUTCOMES.TABLE_STARTED_UNPLAYABLE,
      lobby: resolved.lobby,
      session,
      accountId,
      seatNo: null,
      play: playDescriptor(resolved.lobby),
      error: PLAY_DESCRIPTOR_GAP,
    };
  }

  const seat = await joinLobby(fetchImpl, base, session.token, code, options);
  if (seat.outcome !== OUTCOMES.TABLE_WAITING) {
    return { ...seat, session, accountId, play: seat.play || null };
  }
  if (hasStarted(seat.lobby)) {
    return {
      outcome: OUTCOMES.TABLE_STARTED_UNPLAYABLE, lobby: seat.lobby, session, accountId, seatNo: seat.seatNo,
      play: playDescriptor(seat.lobby), error: PLAY_DESCRIPTOR_GAP,
    };
  }
  return { ...seat, session, accountId, play: null };
}
