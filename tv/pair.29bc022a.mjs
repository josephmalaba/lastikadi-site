/**
 * tv/pair.mjs — pairing this display with the account it acts for, and the token it keeps.
 *
 * THE PATTERN, and why it is this one. A wall in a public room cannot be given a password and
 * must never carry a shared secret in its own bytes: anything in this page is public the
 * moment the page is. So the display asks the service for a short CODE, shows that code to the
 * room, and an owner who is already signed in on a phone approves it. The device gets its own
 * token and keeps it in this browser only.
 *
 *   POST /device/code   (no credential)  -> 200 { deviceCode, userCode, expiresAt,
 *                                                 intervalSeconds }
 *   POST /device/token  (no credential)  -> 200 { status: "pending" }
 *                                        -> 200 { status: "approved", token, username, … }
 *                                        -> 200 { status: "expired" }
 *   POST /device/approve (owner's Bearer)  — the PHONE's call, not this screen's
 *
 * WHAT THIS MODULE IS CAREFUL ABOUT, each for a reason measured or paid for elsewhere:
 *
 *   - NO CREDENTIAL IN THE PAGE. The token is written to this device's own storage and sent
 *     only as an `Authorization` header. It is never put in the address, never in the scan
 *     code, never in an element's text.
 *   - POLL NO FASTER THAN THE SERVICE SAYS. `intervalSeconds` is honoured exactly, a 429 backs
 *     off further, and the loop stops at approved, at expired and at a refusal. A screen that
 *     hammered the service would be the one surface on the network nobody is watching.
 *   - A 401 IS NOT AN OUTAGE. If the token is rejected the token is DISCARDED and the screen
 *     returns to pairing. It does not retry in a loop and it does not fall back to a degraded
 *     read, because a wall showing yesterday's pairing as though it were today's is the defect
 *     the whole page exists to avoid.
 *   - THE ROUTE NOT EXISTING YET IS ITS OWN STATE. Measured on production 2026-10-04:
 *     POST /device/code answers 401 because the route is not deployed yet, and any other path
 *     under /device/ answers the same. A screen that reported that as "unreachable" would send
 *     an operator to look at the network; it is reported as what it is.
 *
 * Nothing here touches the DOM or a global clock. `fetchImpl`, the storage object and `nowMs`
 * are all passed in, so every state below is exercised by tests/tv-table.test.mjs.
 */

/** Where the service's device-pairing endpoints live. Same origin as every other read. */
export const API_ORIGIN = 'https://api.lastikadi.com';

/** The page an owner opens on a phone. Shown to the room, so it is one short string. */
export const PAIR_URL = 'lastikadi.com/pair';

/** This device's storage key. Namespaced, and the token is the only secret in it. */
export const TOKEN_KEY = 'lastikadi.tv.device';

/** How long to wait before asking for a code again, when the service did not say. */
export const DEFAULT_INTERVAL_SECONDS = 5;
export const MIN_INTERVAL_SECONDS = 2;
export const MAX_INTERVAL_SECONDS = 60;
/** The ceiling on the back-off a 429 can push us to, so a screen never stops asking. */
export const MAX_BACKOFF_SECONDS = 300;

export function deviceCodeUrl() { return API_ORIGIN + '/device/code'; }
export function deviceTokenUrl() { return API_ORIGIN + '/device/token'; }

/**
 * What the screen knows about its own pairing, as plain data.
 *
 *   ABSENT      no token, and no pairing under way — the screen has to ask for a code
 *   REQUESTING  POST /device/code is in flight
 *   WAITING     a code is on screen and the owner has not approved it yet
 *   APPROVED    a token is held, and it is the token the screen will use
 *   EXPIRED     the code ran out before anyone approved it; a new one is needed
 *   UNAVAILABLE the service does not offer device pairing (route absent, or no answer)
 *   REFUSED     the service answered something this screen cannot use as a pairing
 *   FORGOTTEN   storage will not hold a token, so pairing cannot survive a reload
 */
export const PAIR_STATES = Object.freeze({
  ABSENT: 'absent',
  REQUESTING: 'requesting',
  WAITING: 'waiting',
  APPROVED: 'approved',
  EXPIRED: 'expired',
  FORGOTTEN: 'forgotten',
  UNAVAILABLE: 'unavailable',
  REFUSED: 'refused',
});

/* ------------------------------------------------------------------- storage */

function storageGet(storage, key) {
  try {
    return storage ? storage.getItem(key) : null;
  } catch {
    return null;
  }
}

function storageSet(storage, key, value) {
  try {
    if (!storage) return false;
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function storageRemove(storage, key) {
  try {
    if (storage) storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/** Can this device hold a token across a reload? Measured rather than assumed. */
export function storageWorks(storage) {
  const probe = TOKEN_KEY + '.probe';
  if (!storageSet(storage, probe, '1')) return false;
  const readBack = storageGet(storage, probe) === '1';
  storageRemove(storage, probe);
  return readBack;
}

/**
 * The credential this device holds, or null.
 *
 * Deliberately tolerant of the service's own vocabulary and strict about the token: a stored
 * record without a usable token is not a pairing, it is a record, and it is discarded rather
 * than half-used.
 */
export function readToken(storage) {
  const raw = storageGet(storage, TOKEN_KEY);
  if (!raw) return null;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    storageRemove(storage, TOKEN_KEY);
    return null;
  }
  if (!parsed || typeof parsed !== 'object') { storageRemove(storage, TOKEN_KEY); return null; }
  const token = typeof parsed.token === 'string' && parsed.token.trim() !== '' ? parsed.token.trim() : null;
  if (!token) { storageRemove(storage, TOKEN_KEY); return null; }
  return {
    token,
    username: typeof parsed.username === 'string' && parsed.username.trim() !== '' ? parsed.username.trim() : null,
    /*
     * The numeric account id, IF the service ever sends one with the approval. It is not in
     * the contract today, and every route that reads a live game wants exactly this number —
     * `POST /deckmaster/state` refuses a caller who does not present their own id. It is read
     * and kept when present, and its absence is reported rather than papered over, because
     * the alternative is a screen that appears paired and can still read nothing.
     */
    playerId: Number.isInteger(parsed.playerId) ? parsed.playerId : null,
    pairedAt: Number.isFinite(parsed.pairedAt) ? parsed.pairedAt : null,
  };
}

/** Keep the credential on this device, and nowhere else. Returns false if it cannot be kept. */
export function writeToken(storage, approved, nowMs) {
  const token = approved && typeof approved.token === 'string' ? approved.token.trim() : '';
  if (!token) return false;
  return storageSet(storage, TOKEN_KEY, JSON.stringify({
    token,
    username: typeof approved.username === 'string' ? approved.username : null,
    playerId: Number.isInteger(approved.playerId) ? approved.playerId : null,
    pairedAt: nowMs,
  }));
}

export function clearToken(storage) {
  return storageRemove(storage, TOKEN_KEY);
}

/* ----------------------------------------------------------------- the states */

const textOrNull = (v) => (typeof v === 'string' && v.trim() !== '' ? v.trim() : null);
const integerOrNull = (v) => (Number.isInteger(v) ? v : null);

function boundedInterval(seconds) {
  const value = Number.isFinite(seconds) ? Math.floor(seconds) : DEFAULT_INTERVAL_SECONDS;
  return Math.min(MAX_INTERVAL_SECONDS, Math.max(MIN_INTERVAL_SECONDS, value));
}

/** The state a screen starts in, read off this device. */
export function initialPairState(storage) {
  const held = readToken(storage);
  if (held) {
    return {
      state: PAIR_STATES.APPROVED, token: held.token, username: held.username,
      playerId: held.playerId, userCode: null, deviceCode: null, expiresAt: null,
      intervalMs: DEFAULT_INTERVAL_SECONDS * 1000, nextPollAt: 0, detail: '',
      backoffMs: 0,
    };
  }
  return {
    state: storageWorks(storage) ? PAIR_STATES.ABSENT : PAIR_STATES.FORGOTTEN,
    token: null, username: null, playerId: null, userCode: null, deviceCode: null,
    expiresAt: null, intervalMs: DEFAULT_INTERVAL_SECONDS * 1000, nextPollAt: 0,
    detail: storageWorks(storage) ? '' : 'this browser will not keep a token, so this screen has to be paired again after every reload',
    backoffMs: 0,
  };
}

/**
 * What to do next, as data. The page drives this on its own tick; nothing here starts a timer.
 *
 * `action` is one of:
 *   'request'  ask the service for a new code
 *   'poll'     ask whether the owner has approved the code on screen
 *   'wait'     do nothing yet
 */
export function pairStep(state, nowMs) {
  if (state.state === PAIR_STATES.APPROVED) return { action: 'none', reason: 'already paired' };
  if (state.state === PAIR_STATES.FORGOTTEN) return { action: 'none', reason: 'this device cannot keep a token' };
  if (state.state === PAIR_STATES.REQUESTING) return { action: 'wait', reason: 'asking for a code' };
  if (state.state === PAIR_STATES.ABSENT || state.state === PAIR_STATES.EXPIRED) {
    return { action: 'request', reason: state.state === PAIR_STATES.EXPIRED ? 'the code ran out' : 'no code yet' };
  }
  if (state.state === PAIR_STATES.WAITING) {
    if (state.expiresAt !== null && nowMs >= state.expiresAt) return { action: 'request', reason: 'the code ran out' };
    return nowMs >= state.nextPollAt ? { action: 'poll', reason: 'waiting for the owner' } : { action: 'wait', reason: 'not yet due' };
  }
  // UNAVAILABLE and REFUSED do not retry on their own: a screen that retried a route that is
  // not there would hammer it forever, and one that retried a refusal would ignore the answer.
  return { action: 'none', reason: 'the service did not offer a pairing; not retrying' };
}

/** POST /device/code, with the service's own words when it refuses. */
export async function requestPairCode(fetchImpl, options = {}) {
  const url = options.url || deviceCodeUrl();
  const timeoutMs = options.timeoutMs === undefined ? 8000 : options.timeoutMs;
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  let timer = null;
  if (controller && timeoutMs > 0) timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, controller
      ? { method: 'POST', signal: controller.signal }
      : { method: 'POST' });
    if (!response || typeof response.ok !== 'boolean') {
      return { outcome: PAIR_STATES.UNAVAILABLE, detail: 'the service did not answer with a response' };
    }
    if (response.status === 401 || response.status === 403 || response.status === 404) {
      return {
        outcome: PAIR_STATES.UNAVAILABLE,
        detail: 'the table service does not offer device pairing (HTTP ' + response.status + ')',
      };
    }
    if (!response.ok) {
      return { outcome: PAIR_STATES.UNAVAILABLE, detail: 'the service answered HTTP ' + response.status };
    }
    let body;
    try { body = await response.json(); } catch { return { outcome: PAIR_STATES.UNAVAILABLE, detail: 'the answer was not JSON' }; }
    const deviceCode = textOrNull(body && body.deviceCode);
    const userCode = textOrNull(body && body.userCode);
    if (!deviceCode || !userCode) {
      return { outcome: PAIR_STATES.REFUSED, detail: 'the pairing answer carried no code to show' };
    }
    const expiresAt = Date.parse(body.expiresAt);
    const intervalSeconds = boundedInterval(body.intervalSeconds);
    return {
      outcome: PAIR_STATES.WAITING,
      deviceCode,
      userCode,
      expiresAt: Number.isFinite(expiresAt) ? expiresAt : null,
      intervalMs: intervalSeconds * 1000,
      detail: '',
    };
  } catch (error) {
    const name = error && error.name ? error.name : 'the request failed';
    return { outcome: PAIR_STATES.UNAVAILABLE, detail: 'could not reach the table service (' + name + ')' };
  } finally {
    if (timer !== null) clearTimeout(timer);
  }
}

/** POST /device/token, one poll. `retryAfterMs` is the service's own instruction, honoured. */
export async function pollPairToken(fetchImpl, deviceCode, options = {}) {
  const url = options.url || deviceTokenUrl();
  const timeoutMs = options.timeoutMs === undefined ? 8000 : options.timeoutMs;
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  let timer = null;
  if (controller && timeoutMs > 0) timer = setTimeout(() => controller.abort(), timeoutMs);
  const body = JSON.stringify({ deviceCode });
  try {
    const response = await fetchImpl(url, controller
      ? { method: 'POST', headers: { 'content-type': 'application/json' }, body, signal: controller.signal }
      : { method: 'POST', headers: { 'content-type': 'application/json' }, body });
    if (!response || typeof response.ok !== 'boolean') {
      return { outcome: PAIR_STATES.UNAVAILABLE, detail: 'the service did not answer with a response' };
    }
    if (response.status === 429) {
      const header = response.headers && typeof response.headers.get === 'function'
        ? response.headers.get('retry-after') : null;
      const seconds = Number.parseInt(header, 10);
      return {
        outcome: 'slow-down',
        retryAfterMs: (Number.isFinite(seconds) && seconds > 0 ? seconds : DEFAULT_INTERVAL_SECONDS) * 1000,
        detail: 'the service asked this screen to slow down',
      };
    }
    if (response.status === 404) return { outcome: PAIR_STATES.EXPIRED, detail: 'the service no longer knows this pairing' };
    if (!response.ok) {
      return { outcome: PAIR_STATES.UNAVAILABLE, detail: 'the service answered HTTP ' + response.status };
    }
    let payload;
    try { payload = await response.json(); } catch { return { outcome: PAIR_STATES.UNAVAILABLE, detail: 'the answer was not JSON' }; }
    const status = textOrNull(payload && payload.status);
    if (status === 'pending') return { outcome: 'pending', detail: '' };
    if (status === 'expired') return { outcome: PAIR_STATES.EXPIRED, detail: 'the code ran out before anyone approved it' };
    if (status === 'approved') {
      const token = textOrNull(payload && payload.token);
      if (!token) return { outcome: PAIR_STATES.REFUSED, detail: 'the service said approved, with no token to use' };
      return {
        outcome: PAIR_STATES.APPROVED,
        token,
        username: textOrNull(payload.username),
        playerId: integerOrNull(payload.playerId) ?? integerOrNull(payload.accountId),
        detail: '',
      };
    }
    return { outcome: PAIR_STATES.REFUSED, detail: 'the pairing answer said "' + (status || 'nothing') + '", which this screen does not know' };
  } catch (error) {
    const name = error && error.name ? error.name : 'the request failed';
    return { outcome: PAIR_STATES.UNAVAILABLE, detail: 'could not reach the table service (' + name + ')' };
  } finally {
    if (timer !== null) clearTimeout(timer);
  }
}

/**
 * Fold one outcome into the pairing state. Pure: it takes the state and the answer and
 * returns the next state, so the whole machine is exercised without a network or a clock.
 */
export function applyPairOutcome(state, result, nowMs) {
  const base = { ...state, detail: result.detail || '' };
  switch (result.outcome) {
    case PAIR_STATES.WAITING: {
      // The deadline is accepted as epoch milliseconds or as the ISO string the service sends,
      // and anything else becomes "no deadline" rather than NaN, which would put a meaningless
      // number in front of the room and never expire the code.
      const expiresAt = Number.isFinite(result.expiresAt)
        ? result.expiresAt
        : (typeof result.expiresAt === 'string' && Number.isFinite(Date.parse(result.expiresAt))
          ? Date.parse(result.expiresAt)
          : null);
      return { ...base, state: PAIR_STATES.WAITING, deviceCode: result.deviceCode, userCode: result.userCode,
        expiresAt, intervalMs: result.intervalMs, backoffMs: 0, nextPollAt: nowMs + result.intervalMs };
    }
    case 'pending':
      return { ...base, state: PAIR_STATES.WAITING, nextPollAt: nowMs + state.intervalMs + state.backoffMs };
    case 'slow-down':
      // The service said slow down, so the next ask is at least as far away as it asked for,
      // and the interval itself is backed off so a screen cannot settle into a hammering rate.
      return { ...base,
        state: PAIR_STATES.WAITING,
        backoffMs: Math.min(result.retryAfterMs, MAX_BACKOFF_SECONDS * 1000),
        intervalMs: Math.min(MAX_INTERVAL_SECONDS * 1000, Math.max(state.intervalMs * 2, result.retryAfterMs)),
        nextPollAt: nowMs + Math.min(result.retryAfterMs, MAX_BACKOFF_SECONDS * 1000) };
    case PAIR_STATES.APPROVED:
      return { ...base, state: PAIR_STATES.APPROVED, token: result.token, username: result.username,
        playerId: result.playerId, userCode: null, deviceCode: null, expiresAt: null, backoffMs: 0, nextPollAt: 0 };
    case PAIR_STATES.EXPIRED:
      return { ...base, state: PAIR_STATES.EXPIRED, userCode: null, deviceCode: null, expiresAt: null, backoffMs: 0 };
    case PAIR_STATES.REQUESTING:
      return { ...base, state: PAIR_STATES.REQUESTING, backoffMs: 0 };
    default:
      return { ...base, state: result.outcome };
  }
}

/**
 * The token was refused (401) by an ordinary read. Discard it and go back to pairing.
 * A separate function because this is the one transition a screen must never soften.
 */
export function pairingRevoked(state, detail) {
  return { ...state, state: PAIR_STATES.ABSENT, token: null, username: null, playerId: null,
    userCode: null, deviceCode: null, expiresAt: null, nextPollAt: 0, backoffMs: 0,
    detail: detail || 'the table service refused this screen\u2019s pairing, so it has to be paired again' };
}

/* ------------------------------------------------------------- what to show */

/**
 * The credential attached to a read, and ONLY as an `Authorization` header.
 *
 * There is deliberately no function here that puts the token anywhere else. It is not written
 * into a URL, not into the scan code and not into an element, which is why the only way to
 * reach it from outside this module is through this one call.
 */
export function withAuthorization(init, token) {
  if (!token) return init || {};
  const headers = { ...((init && init.headers) || {}), authorization: 'Bearer ' + token };
  return { ...(init || {}), headers };
}

export const PAIR_TEXT = Object.freeze({
  [PAIR_STATES.ABSENT]: { word: 'Not paired', warn: false },
  [PAIR_STATES.REQUESTING]: { word: 'Asking for a code', warn: false },
  [PAIR_STATES.WAITING]: { word: 'Waiting for approval', warn: false },
  [PAIR_STATES.APPROVED]: { word: 'Paired', warn: false },
  [PAIR_STATES.EXPIRED]: { word: 'Code expired', warn: true },
  [PAIR_STATES.FORGOTTEN]: { word: 'Cannot stay paired', warn: true },
  [PAIR_STATES.UNAVAILABLE]: { word: 'Pairing unavailable', warn: true },
  [PAIR_STATES.REFUSED]: { word: 'Pairing refused', warn: true },
});

/**
 * Everything the pairing UI says, as data.
 *
 * `voice` is 'room' or 'operator'. The one string the ROOM must read is the instruction, and
 * it is worded for a person holding a phone: a code on a wall with no instruction is a dead
 * end, which is the failure this whole block exists to avoid. The operator's version carries
 * the transport detail, which belongs on a screen a technician is looking at, not on a wall.
 */
export function pairPlan(state, nowMs) {
  const text = PAIR_TEXT[state.state] || PAIR_TEXT[PAIR_STATES.ABSENT];
  const plan = {
    state: state.state,
    word: text.word,
    warn: text.warn,
    userCode: state.userCode,
    username: state.username,
    playerId: state.playerId,
    paired: state.state === PAIR_STATES.APPROVED,
    shows: state.state !== PAIR_STATES.APPROVED,
    detail: state.detail || '',
    remainingMs: Number.isFinite(state.expiresAt) ? Math.max(0, state.expiresAt - nowMs) : null,
    say: '',
    needs: '',
  };
  switch (state.state) {
    case PAIR_STATES.ABSENT:
      plan.say = 'This screen is not paired with an account. Asking the table service for a pairing code…';
      plan.needs = 'a pairing code from the table service';
      break;
    case PAIR_STATES.REQUESTING:
      plan.say = 'Asking the table service for a pairing code…';
      plan.needs = 'a pairing code from the table service';
      break;
    case PAIR_STATES.WAITING:
      plan.say = 'On a phone, open ' + PAIR_URL + ' and enter this code.';
      plan.needs = '';
      break;
    case PAIR_STATES.EXPIRED:
      plan.say = 'That code ran out. Asking the table service for a new one…';
      plan.needs = 'a fresh pairing code';
      break;
    case PAIR_STATES.FORGOTTEN:
      plan.say = 'This browser will not keep a token, so this screen cannot stay paired. Use a browser that allows site storage.';
      plan.needs = 'a browser that allows this page to store a token';
      break;
    case PAIR_STATES.UNAVAILABLE: {
      /*
       * *** TWO DIFFERENT FACTS ARRIVE HERE AS ONE, AND THEY NEED DIFFERENT SENTENCES. ***
       *
       * `requestPairCode` maps five causes onto this single state: a 401/403/404, meaning the route
       * is not offered at all — a POLICY answer, and a final one — and a 5xx, a non-JSON body, a
       * timeout or a network failure, meaning the service is having trouble — a TRANSIENT answer.
       *
       * *** MEASURED ON 2026-10-11: A 502 FROM THE API DURING A DEPLOY PRODUCED EXACTLY THE SENTENCE
       * BELOW — "the table service is not offering device pairing to this screen" — WITH THE DETAIL
       * "the answer was not JSON". *** A venue operator reading that concludes pairing has been
       * switched off for them. It had not; the screen needed reloading.
       *
       * AND IT COULD NOT RECOVER ON ITS OWN. `pairStep` deliberately does not retry an UNAVAILABLE
       * answer, for a reason it states and which is sound ("a screen that retried a route that is
       * not there would hammer it forever"). So for a TRANSIENT cause the wrong sentence was the
       * ONLY thing between the operator and a working screen: the page had already given up.
       *
       * The wording now says which of the two happened, and for the transient case names the one
       * action that works. *** THE RETRY GAP ITSELF IS NOT FIXED HERE AND IS NOT CLAIMED TO BE: a
       * transient failure still needs a reload. It is recorded rather than papered over. ***
       */
      const detail = state.detail || '';
      const notOffered = /does not offer device pairing/.test(detail);
      plan.say = notOffered
        ? 'The table service is not offering device pairing to this screen. ' + detail
        : 'The table service could not be reached for a pairing code, so this screen is not paired yet. '
          + detail + ' Reload this screen to try again.';
      plan.needs = 'POST /device/code on the table service, answering { deviceCode, userCode, expiresAt, intervalSeconds }';
      break;
    }
    case PAIR_STATES.REFUSED:
      plan.say = 'The table service answered the pairing with something this screen cannot use. ' + (state.detail || '');
      plan.needs = 'a pairing answer of { status: "approved", token, username }';
      break;
    default:
      plan.say = '';
  }
  return plan;
}

