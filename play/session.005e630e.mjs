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
 * WHY openTable() IS NOT "START": the earlier client posted the caller's own id and a
 * guessed machine id and treated whatever came back as a game. It never checked that the
 * seat it asked for was the seat it got. Every call here reads the server's answer and
 * refuses when the answer is not the table that was asked for.
 *
 * Nothing here touches the DOM, and every network call goes through an injected `fetchImpl`
 * so the whole flow — including each refusal — is exercised by tests/session.test.mjs.
 */

import { SERVED } from './identity.17b1dc91.mjs';

/** Where the table service lives. The only origin this client talks to. */
export const SERVICE_BASE = 'https://api.lastikadi.com';

/** A seat rule that refuses is not a transport failure, and the two are kept apart. */
export const OUTCOMES = Object.freeze({
  OPEN: 'open',
  NO_ACCOUNT: 'no-account',
  ID_UNKNOWN: 'id-unknown',
  SEAT_REFUSED: 'seat-refused',
  UNREACHABLE: 'unreachable',
});

/** How long a single call may take before it is reported as no answer at all. */
export const CALL_TIMEOUT_MS = 12000;

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
        error: 'the service opened a table without the machine seat this client asked for',
      };
    }
    return { outcome: OUTCOMES.OPEN, table, state: result.body, error: null };
  }
  if (result.status === 401) {
    return { outcome: OUTCOMES.NO_ACCOUNT, table: null, state: null, error: result.error || 'the service did not accept this session' };
  }
  if (result.status === 403) {
    return { outcome: OUTCOMES.SEAT_REFUSED, table: null, state: null, error: result.error || 'the service refused a seat at this table' };
  }
  if (result.status === null) {
    return { outcome: OUTCOMES.UNREACHABLE, table: null, state: null, error: result.error };
  }
  return {
    outcome: OUTCOMES.SEAT_REFUSED, table: null, state: null,
    error: result.error || `the service answered HTTP ${result.status}`,
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
