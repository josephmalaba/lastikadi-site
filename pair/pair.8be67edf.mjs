/**
 * pair/pair.mjs — the human half of device pairing.
 *
 * THE GAP THIS FILLS, MEASURED. A venue screen with no credential asks the table service for a
 * pairing code and shows it to the room. The service has always done its half:
 *
 *   POST /device/code     -> 200 { deviceCode, userCode:"A4EW-3FTM",
 *                                  verificationUri:"https://lastikadi.com/pair?code=A4EW-3FTM",
 *                                  expiresAt, intervalSeconds }
 *   POST /device/token    -> 200 {"status":"pending"}        (unapproved: correctly NO token)
 *   POST /device/approve  -> 401 without a session           (correctly refused)
 *
 * and `verificationUri` named https://lastikadi.com/pair. That page did not exist: measured
 * live, /pair answered the host's 404 page. So nobody could approve a code and the screen
 * could never obtain its credential. This module is that page's decision layer.
 *
 * ---------------------------------------------------------------------------------------
 * THE ONE PROPERTY EVERYTHING ELSE IS SUBORDINATE TO
 * ---------------------------------------------------------------------------------------
 * NO CREDENTIAL EVER APPEARS IN THE PAGE OR THE URL.
 *
 * The pairing flow exists so that the screen obtains a credential ON THE DEVICE and none ever
 * travels through a page — a public page's bytes are public the moment the page is. This page
 * is the OTHER half of that exchange, and it holds a different credential: the approver's own
 * session. It is:
 *
 *   * held in a variable for the life of the document and NOTHING else. No localStorage, no
 *     sessionStorage, no cookie, no IndexedDB, no URL, no form value, no element text. Reload
 *     the page and you are signed out, which is the correct cost of never writing it down;
 *   * sent only as an `Authorization` header, to `POST /device/approve` and to the table
 *     service's own route the game client uses to open a table (`POST /lobby`), for this
 *     origin's behalf;
 *   * scrubbed out of every sentence this module builds (`scrub()` below), so a service that
 *     echoed it, or a future edit that pasted it into a message, still cannot reach the DOM.
 *
 * `tests/pair-page.test.mjs` asserts all three, and asserts that the assertions FAIL when the
 * control is removed.
 *
 * ---------------------------------------------------------------------------------------
 * WHAT THIS PAGE DOES NOT DO, AND WHY EACH IS A DECISION RATHER THAN AN OMISSION
 * ---------------------------------------------------------------------------------------
 *   * It does not call `POST /device/code`. A code is the SCREEN's to ask for. A second code
 *     minted here would be a code nobody is displaying.
 *   * It does not call `POST /device/token`. That route is addressed by `deviceCode`, which is
 *     the screen's secret and is deliberately never sent to this page — that is the whole
 *     design. A page that could poll it could take the screen's credential for itself.
 *   * It does not offer an unauthenticated approve. `POST /device/approve` answers 401 without
 *     a session, that is CORRECT, and it must stay: the user code is short and guessable by
 *     construction, and the only thing standing between a guess and somebody else's account is
 *     that approval binds the screen to the APPROVER'S OWN account. `approveCode()` refuses to
 *     send the request at all with no session, so the page cannot even attempt it.
 *   * It does not READ the interval the service advertises as a licence to poll. It polls
 *     nothing. `ADVERTISED_INTERVAL_SECONDS` and `MIN_POLL_MILLIS` are recorded here because
 *     the advertisement contradicts the enforced floor, and the test suite pins the fact that
 *     this page issues no poll at all rather than quietly agreeing with either number.
 *
 * Nothing here touches the DOM, a global clock, `fetch` or storage: every one is passed in, so
 * every state below is exercised offline by `tests/pair-page.test.mjs`.
 */

/** The one origin this page talks to. */
export const SERVICE_BASE = 'https://api.lastikadi.com';

/**
 * Every route this page is allowed to call. Nothing else.
 *
 * Exported as data on purpose: the test suite drives every exported network function through a
 * recording `fetch` and asserts the set of URLs requested is exactly this set. A future edit
 * that added a poll, or an unauthenticated approve, would have to add a name here to pass — and
 * adding `/device/token` here is itself asserted against, because a page that can poll the
 * device's token is a page that can take the device's credential.
 */
export const ROUTES = Object.freeze({
  approve: '/device/approve',
  login: '/auth/login',
  register: '/auth/register',
  // The post-pairing control surface. A paired screen is operated from the phone, so the
  // phone opens a table through the same service the game client uses, and resolves an
  // existing table by its join code. These are exactly the table routes the deployed service
  // exposes to a non-operator account: `POST /lobby` (create, auth) and the public
  // `GET /lobby/{joinCode}` (resolve, the one open lobby route — its path is ROUTES.lobby plus
  // the code). The service has NO account-wide lobby listing and NO tournament field on a
  // lobby, so this page offers neither; a control that called a route the service does not
  // serve would be a control that always failed. Nothing here can touch a device credential
  // (see FORBIDDEN_ROUTES).
  portfolio: '/portfolio',
  lobby: '/lobby',
});

/** Routes this page must NEVER call, named so a test can say so out loud. */
export const FORBIDDEN_ROUTES = Object.freeze(['/device/code', '/device/token']);

/**
 * The service's own limits, restated so this page can be honest about them.
 *
 * `EXPIRY_SECONDS` is the service's. `MIN_POLL_MILLIS` is the service's ENFORCED floor, and
 * `ADVERTISED_INTERVAL_SECONDS` is what `POST /device/code` returns in the same response —
 * measured live as 1. They contradict each other. This page does not resolve that by choosing
 * one; it resolves it by not polling.
 */
export const EXPIRY_SECONDS = 300;
export const MIN_POLL_MILLIS = 1500;
export const ADVERTISED_INTERVAL_SECONDS = 1;

/**
 * How long one call may take before it is reported as no answer.
 *
 * Generous rather than tight, and the reason is measured. On a cold browser profile the FIRST
 * connection to a new origin cost ~15 s here (CDP `Network.responseReceived`: /device/code,
 * /portfolio and /v2/api-docs each answered 200 after 14.9 s on a fresh profile, while the same
 * routes answered Node in ~0.4 s). A five-second deadline would have reported a working service
 * as unreachable. Twenty seconds with an honest sentence is better than a fast wrong answer.
 */
export const CALL_TIMEOUT_MS = 20000;

/**
 * The user-code alphabet, as the service defines it: no O/0, no I/1/L.
 *
 * Duplicated deliberately. This page has to accept the code a person read off a wall and typed
 * on a phone, and it has to refuse to be clever about anything outside this alphabet — a code
 * containing a character the service cannot mint is a typo, not a code.
 */
export const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const USER_CODE_LENGTH = 8;

/* ------------------------------------------------------------------ the code */

/**
 * The code a person read off the screen, in the one spelling the service looks up.
 *
 * The service stores codes upper-cased with a hyphen after the fourth character, and its
 * lookup is an exact match on the upper-cased string INCLUDING the hyphen. Measured:
 * `approve` with the lower-cased real code answers 200 (the service upper-cases), and a
 * hyphen-less spelling would not match at all. So the hyphen is re-inserted here rather than
 * left to the reader: somebody reading "A4EW-3FTM" off a wall four metres away and typing
 * "A4EW3FTM" must not be told their code is invalid.
 *
 * Returns null when the input cannot be a code at all, and the raw up-cased text otherwise, so
 * that anything genuinely wrong is judged by the service and its own sentence is shown.
 */
export function normalizeUserCode(raw) {
  if (typeof raw !== 'string') return null;
  const up = raw.trim().toUpperCase();
  if (up === '') return null;
  const compact = [...up].filter((ch) => ALPHABET.includes(ch)).join('');
  if (compact.length === USER_CODE_LENGTH) {
    return compact.slice(0, 4) + '-' + compact.slice(4);
  }
  /*
   * Not eight characters of the alphabet. It is returned as typed-and-up-cased so the service
   * refuses it with its own words — and so the page never silently repairs a code into a
   * different one, which would be a guess about whose screen is being paired.
   */
  return up;
}

/** Does this look like a code the service could have minted? */
export function looksLikeUserCode(normalized) {
  if (typeof normalized !== 'string') return false;
  if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(normalized)) return false;
  return [...normalized.replace('-', '')].every((ch) => ALPHABET.includes(ch));
}

/**
 * The table service's join-code alphabet and length, as `JoinCode.java` defines them: TEN
 * characters drawn from 32 symbols that omit the ones people mis-read — `I`, `L`, `O`, `U`
 * (Crockford's exclusions) plus `0` and `1`. Duplicated deliberately and pinned by a test, so
 * this page accepts exactly the shape the service can mint and refuses to show a "code" the
 * service never issued. A different alphabet and length from a pairing user-code (8 chars,
 * with a hyphen) on purpose: the two identities are never allowed to be confused.
 */
export const JOIN_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTVWXYZ23456789';
export const JOIN_CODE_LENGTH = 10;

/** Does this look like a TABLE join code the table service could have minted? Shape only. */
export function looksLikeJoinCode(value) {
  if (typeof value !== 'string' || value.length !== JOIN_CODE_LENGTH) return false;
  return [...value].every((ch) => JOIN_CODE_ALPHABET.includes(ch));
}

/**
 * A table code as a person typed it, in the one spelling the service looks up.
 *
 * The service's own `JoinCode.normalize` is the contract, and this mirrors it exactly: strip
 * `-`, ` ` and `_`, upper-case the rest, and accept only ten characters of the alphabet. Returns
 * null when the input cannot be a code at all — so the page refuses a typo without a request and
 * without repairing it into a different code, which would be a guess about which table is meant.
 */
export function normalizeJoinCode(raw) {
  if (typeof raw !== 'string') return null;
  const cleaned = [...raw.trim().toUpperCase()]
    .filter((ch) => ch !== '-' && ch !== ' ' && ch !== '_')
    .join('');
  if (cleaned.length !== JOIN_CODE_LENGTH) return null;
  return [...cleaned].every((ch) => JOIN_CODE_ALPHABET.includes(ch)) ? cleaned : null;
}

/**
 * The code carried by an address, if it carries one.
 *
 * The service builds the verification link as `...?code=USERCODE`, so the query is the
 * contract. The fragment is accepted as a second spelling because the venue display already
 * uses a fragment for the table it follows, and a link that mixed the two must not silently
 * lose the code. Nothing else is read, and nothing is ever ADDED to the address.
 */
export function readCode(address) {
  if (typeof address !== 'string' || address === '') return null;
  let url;
  try {
    url = new URL(address, 'https://lastikadi.com/pair');
  } catch {
    return null;
  }
  const fromQuery = url.searchParams.get('code');
  if (fromQuery) return normalizeUserCode(fromQuery);
  const fromHash = /(?:^|[#&?])code=([^&]+)/.exec(url.hash);
  return fromHash ? normalizeUserCode(decodeURIComponent(fromHash[1])) : null;
}

/**
 * Has this code certainly run out?
 *
 * The page is not told when the code was minted, so it cannot read an expiry off the address.
 * It does not have to: the code was minted at or before the moment this page first held it, so
 * the page's own held-since time is a LOWER bound on the code's age — and once that lower bound
 * reaches the service's `EXPIRY_SECONDS`, the code is expired whatever the true mint time was.
 *
 * That is a sound inference rather than a guess, and it is why this is a separate function with
 * its own test: a page that said "this has expired" too early would refuse a code that still
 * worked, and one that said it too late would leave the reader guessing.
 */
export function codeHasExpired(heldSinceMs, nowMs) {
  if (!Number.isFinite(heldSinceMs) || !Number.isFinite(nowMs)) return false;
  return nowMs - heldSinceMs >= EXPIRY_SECONDS * 1000;
}

/** Minutes and seconds left before the page can say the code has certainly run out. */
export function codeSecondsLeft(heldSinceMs, nowMs) {
  if (!Number.isFinite(heldSinceMs) || !Number.isFinite(nowMs)) return null;
  return Math.max(0, EXPIRY_SECONDS - Math.floor((nowMs - heldSinceMs) / 1000));
}

/* ------------------------------------------------------------------ hygiene */

/**
 * Remove the session from a sentence before it can be shown.
 *
 * Belt and braces, and worth the four lines. Nothing in this module puts the token into a
 * message today; this exists so that the ONE property the page cannot afford to lose does not
 * depend on every future edit remembering it. A service that echoed a credential, or a message
 * built by string-concatenating a request object, still cannot reach the DOM.
 */
export function scrub(text, session) {
  let out = typeof text === 'string' ? text : '';
  const token = session && typeof session.token === 'string' ? session.token : null;
  if (token && token.length >= 8) {
    out = out.split(token).join('[removed]');
    // A truncated echo is still an echo: redact any long run that contains the token's head.
    const head = token.slice(0, 12);
    if (head.length === 12) out = out.split(head).join('[removed]');
  }
  return out;
}

/** Does this text carry anything that looks like a credential? Used by the DOM assertions. */
export function looksLikeCredential(text) {
  if (typeof text !== 'string') return false;
  // A JSON Web Token: three dot-separated base64url runs, the first of which is a header.
  if (/\bey[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/.test(text)) return true;
  // The device's handle, if it were ever echoed: 64 hex characters.
  if (/\b[0-9a-f]{64}\b/.test(text)) return true;
  return false;
}

/* ------------------------------------------------------------------- calls */

/** Read a service answer into transport facts and a body, without ever throwing. */
async function call(fetchImpl, method, path, { body, token } = {}) {
  const headers = { 'content-type': 'application/json' };
  if (token) headers.authorization = 'Bearer ' + token;
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  let timer = null;
  if (controller) timer = setTimeout(() => controller.abort(), CALL_TIMEOUT_MS);
  try {
    const response = await fetchImpl(SERVICE_BASE + path, {
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
    return { ok: response.status >= 200 && response.status < 300, status: response.status, body: parsed };
  } catch (error) {
    const aborted = Boolean(controller && controller.signal.aborted);
    const name = error && error.name ? error.name : 'the request failed';
    return {
      ok: false, status: null, body: null,
      error: aborted ? `no answer within ${CALL_TIMEOUT_MS}ms` : 'the request failed (' + name + ')',
    };
  } finally {
    if (timer !== null) clearTimeout(timer);
  }
}

/** The service's own sentence about a refusal, if it sent one. */
export function serviceSentence(body) {
  if (!body || typeof body !== 'object') return null;
  for (const key of ['message', 'error']) {
    const value = body[key];
    if (typeof value === 'string' && value.trim() !== '' && value.trim() !== 'No message available') {
      return value.trim();
    }
  }
  return null;
}

/**
 * Approve the code on screen, as the signed-in caller.
 *
 * THE SESSION IS REQUIRED BEFORE THE REQUEST IS BUILT. Not "the service will refuse it" — the
 * request is not made. `POST /device/approve` answering 401 without a session is the correct
 * behaviour and is kept; this page simply never creates the situation, so a reader is told to
 * sign in instead of being shown a bare 401.
 */
export async function approveCode(fetchImpl, session, userCode) {
  const code = typeof userCode === 'string' ? userCode.trim() : '';
  if (code === '') return { outcome: 'no-code', error: 'There is no code to approve. Read the code off the screen.' };
  if (!session || typeof session.token !== 'string' || session.token === '') {
    return { outcome: 'no-session', error: 'Sign in first — a screen is paired to the account that approves it.' };
  }
  const result = await call(fetchImpl, 'POST', ROUTES.approve, { body: { userCode: code }, token: session.token });

  if (result.ok && result.body && typeof result.body === 'object'
      && String(result.body.status) === 'approved') {
    return {
      outcome: 'approved',
      username: typeof result.body.username === 'string' ? result.body.username : (session.username || null),
      accountId: Number.isInteger(result.body.accountId) ? result.body.accountId : null,
      error: null,
    };
  }

  if (result.status === 401) {
    return {
      outcome: 'session-refused',
      error: 'The service did not accept that sign-in. Sign in again and approve the code.',
    };
  }
  if (result.status === 403) {
    return {
      outcome: 'refused',
      error: serviceSentence(result.body)
        || 'The service refused this approval. Sign in again and try once more.',
    };
  }
  /*
   * THE 500 IS THE EXPECTED ANSWER FOR A WRONG, RE-USED OR EXPIRED CODE, and that is a defect
   * in the service rather than in this page. Measured live: approving a code that does not
   * exist, and approving a code a second time, both answer
   *   HTTP 500 {"error":"Internal Server Error",
   *             "message":"That code is not valid, or it has expired. Check the screen and try again."}
   * The service's own sentence is right and is shown. The status is wrong: an ordinary
   * user-caused outcome is dressed as a server fault, which will page an operator and which a
   * client that treats 5xx as "the service is broken" — correctly — will mislabel. Reported,
   * not repaired here: changing it means changing and redeploying the service.
   */
  const sentence = serviceSentence(result.body);
  if (result.status !== null && result.status >= 500) {
    return {
      outcome: 'service-fault',
      error: sentence
        ? sentence
        : 'The service could not approve that code. Check the code on the screen and try again.',
      detail: 'the service answered HTTP ' + result.status,
    };
  }
  if (result.status === null) {
    return { outcome: 'unreachable', error: result.error || 'The service did not answer.' };
  }
  return {
    outcome: 'refused',
    error: sentence || ('The service answered HTTP ' + result.status + ' and did not approve the code.'),
    detail: 'the service answered HTTP ' + result.status,
  };
}

/** Sign in with a username and a password. The session is returned; nothing is stored. */
export async function signIn(fetchImpl, username, password) {
  const name = typeof username === 'string' ? username.trim() : '';
  if (name === '' || typeof password !== 'string' || password === '') {
    return { ok: false, token: null, username: null, error: 'Enter your sign-in name and password.' };
  }
  const result = await call(fetchImpl, 'POST', ROUTES.login, { body: { username: name, password } });
  if (result.ok && result.body && typeof result.body.token === 'string' && result.body.token !== '') {
    return {
      ok: true, token: result.body.token,
      username: typeof result.body.username === 'string' ? result.body.username : name,
      error: null,
    };
  }
  if (result.status === 401 || result.status === 403) {
    return { ok: false, token: null, username: null, error: 'That sign-in name and password were not accepted.' };
  }
  if (result.status === null) {
    return { ok: false, token: null, username: null, error: result.error || 'The service did not answer.' };
  }
  return {
    ok: false, token: null, username: null,
    error: serviceSentence(result.body) || ('The service answered HTTP ' + result.status + ' to the sign-in.'),
  };
}

/**
 * Create an account, through the same public route the shipped game client already uses.
 *
 * A DECISION, STATED RATHER THAN HIDDEN. This is a form over a route that is already
 * `permitAll` and that `play/session.mjs` already calls automatically on the first scan, so the
 * page adds a form and not a capability. It is here because without it a visitor who has no
 * account cannot sign in at all, and a pairing page that nobody can complete is the same defect
 * this page exists to remove. It mints nothing silently: the fields are the reader's and the
 * button is pressed by the reader.
 */
export async function registerAccount(fetchImpl, username, email, password) {
  const name = typeof username === 'string' ? username.trim() : '';
  const address = typeof email === 'string' ? email.trim() : '';
  if (name === '' || address === '' || typeof password !== 'string' || password === '') {
    return { ok: false, token: null, username: null, error: 'Fill in a name, an email address and a password.' };
  }
  if (name.length < 3) {
    return { ok: false, token: null, username: null, error: 'A sign-in name needs at least three characters.' };
  }
  if (password.length < 8) {
    return { ok: false, token: null, username: null, error: 'A password needs at least eight characters.' };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(address)) {
    return { ok: false, token: null, username: null, error: 'That does not look like an email address.' };
  }
  const result = await call(fetchImpl, 'POST', ROUTES.register, {
    body: { username: name, email: address, password },
  });
  if (result.ok && result.body && typeof result.body.token === 'string' && result.body.token !== '') {
    return {
      ok: true, token: result.body.token,
      username: typeof result.body.username === 'string' ? result.body.username : name,
      error: null,
    };
  }
  if (result.status === 409) {
    return { ok: false, token: null, username: null, error: 'That sign-in name is already taken. Sign in instead.' };
  }
  if (result.status === null) {
    return { ok: false, token: null, username: null, error: result.error || 'The service did not answer.' };
  }
  return {
    ok: false, token: null, username: null,
    error: serviceSentence(result.body) || ('The service answered HTTP ' + result.status + ' to the sign-up.'),
  };
}

/* ------------------------------------------------- the post-pairing control surface
 *
 * Pairing a screen used to be the end of this page's work. It is not. The person who
 * approved the screen is standing at it with a phone, and the phone — not the room's
 * television — is where a table should be chosen. These functions are the decision layer
 * for that: read the games the service can host, open a table, and resolve a table this
 * account already has by its code.
 *
 * WHAT THE DEPLOYED SERVICE ACTUALLY OFFERS, AND WHY THIS PAGE OFFERS ONLY THIS. Measured
 * against the service source (LobbyController, JoinCode, SecurityConfig):
 *   * POST /lobby            — open a table (auth). The response carries the join code.
 *   * GET  /lobby/{joinCode} — resolve a table by code (PUBLIC; the one open lobby route).
 *   * GET  /portfolio        — the games this host serves (public).
 * There is NO account-wide lobby listing and NO tournament field on a lobby (the create body
 * is exactly gameId/ruleVersion/capacity/waitSeconds/displayName). So this page does NOT offer
 * a list of "my tables" and does NOT offer a tournament: it cannot, and a control that called
 * a route the service does not serve would be a control that always failed. "Select an
 * existing table" is done the way the service makes possible: by its code.
 *
 * THREE RULES, AND THEY ARE THE SAME RULES AS THE REST OF THE FILE:
 *   1. every request needs a usable session and refuses to leave without one;
 *   2. nothing is displayed unless the service named it in the service's own shape — a
 *      body that is not the expected shape is an ERROR, not an empty success, and a code the
 *      service never minted is never shown;
 *   3. no function here ever sees, stores or returns a device credential.
 */

/** A usable session, or null. The single gate every control request passes. */
function usableSession(session) {
  return session && typeof session.token === 'string' && session.token !== '' ? session : null;
}

/** The service's own sentence about a control request, or a plain honest one. */
function controlError(result, fallback) {
  if (!result || result.status === null) {
    return (result && result.error) || 'The service did not answer.';
  }
  return serviceSentence(result.body) || (fallback + ' (HTTP ' + result.status + ').');
}

/** Read a list either as the whole body or under one named key, or null when it is neither. */
function rowsOf(body, key) {
  if (Array.isArray(body)) return body;
  if (body && typeof body === 'object' && Array.isArray(body[key])) return body[key];
  return null;
}

/**
 * The games this service can host, from the public manifest. GET /portfolio (no session).
 *
 * The manifest is public and is the same list the venue screen shows, so the phone offers
 * exactly the games the screen could open — no more, and no invented ones.
 *
 * UNAVAILABLE GAMES ARE KEPT AND MARKED, NOT SILENTLY DROPPED, and that is a correction to how
 * this function used to behave. It skipped `available === false` rows, which made the picker
 * unable to distinguish two different facts: "this service does not host that game" and "this
 * service hosts it but has switched it off". The second is what the manifest's own
 * `unavailableReason` exists to explain, and a reader who cannot see the row cannot be told the
 * reason. The row reaches the page and the page decides how to show it; `createTable` still
 * refuses to open a table for a game the service did not report as available, because a request
 * for one could only fail.
 *
 * A row with no `available` member at all is treated as AVAILABLE, which is what the deployed
 * manifest does today (`{"gameId":"kadi",...,"available":true}` for both kadi and shogi); reading
 * an absent flag as "off" would hide every game the first time a manifest omitted it.
 */
export async function listGames(fetchImpl) {
  const result = await call(fetchImpl, 'GET', ROUTES.portfolio);
  if (!result.ok) return { ok: false, games: [], error: controlError(result, 'The service did not list its games') };
  const rows = rowsOf(result.body, 'games');
  if (rows === null) {
    return { ok: false, games: [], error: 'The service answered with something that is not a game list. Nothing was shown from it.' };
  }
  const games = [];
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    if (typeof row.gameId !== 'string' || row.gameId === '') continue;
    const available = row.available !== false;
    games.push({
      gameId: row.gameId,
      ruleVersion: typeof row.ruleVersion === 'string' ? row.ruleVersion : '',
      available,
      unavailableReason: available
        ? null
        : (typeof row.unavailableReason === 'string' && row.unavailableReason.trim() !== ''
          ? row.unavailableReason.trim()
          : 'this table service does not currently offer it'),
      /*
       * THE SEATS THE MODULE ITSELF DECLARES, CARRIED THROUGH RATHER THAN DROPPED. This field did not
       * exist to read until the host began publishing it, and the sentence beside the form's own seat
       * box has promised it all along — "A game may declare a smaller range, and the table service
       * will say so if this one does" — with nothing behind the promise.
       *
       * ABSENT MEANS NOT DECLARED, NEVER ZERO. A manifest that omits the block is what is deployed
       * today, and reading an absent block as a range of 0..0 would make every game unopenable the
       * first time a manifest did not carry it. That is the same tolerance this function already
       * applies to `available`, for the same reason.
       */
      seats: readDeclaredSeats(row.seats),
    });
  }
  return { ok: true, games, error: null };
}

/**
 * Select a table this account already has, by its code. GET /lobby/{joinCode} (public).
 *
 * This is the service's one open lobby route and the honest way to "select an existing table":
 * the code is the handle. The route is public, so the read carries no token — but the page offers
 * it only once a screen is paired, because that is when selecting matters. The typed code is
 * normalized the service's own way and is NOT trusted for identity: the shown gameId, ruleVersion
 * and lobbyId are the service's answer, and the code shown is the normalized code the caller
 * typed (the resolve response deliberately carries no code). A 404 is "no table with that code",
 * never an empty success.
 */
export async function selectTable(fetchImpl, session, rawCode) {
  if (!usableSession(session)) {
    return { ok: false, table: null, error: 'Sign in first — selecting a table is part of operating the paired screen.' };
  }
  const code = normalizeJoinCode(rawCode);
  if (code === null) {
    return {
      ok: false, table: null,
      error: 'That is not a table code. A table code is ten letters and digits, read off the screen.',
    };
  }
  const result = await call(fetchImpl, 'GET', ROUTES.lobby + '/' + encodeURIComponent(code));
  if (result.status === 404) {
    return { ok: false, table: null, error: 'No open table has that code. Check the code and try again.' };
  }
  if (!result.ok || !result.body || typeof result.body !== 'object') {
    return { ok: false, table: null, error: controlError(result, 'The service did not resolve that table') };
  }
  if (typeof result.body.gameId !== 'string' || result.body.gameId === '') {
    return { ok: false, table: null, error: 'The service answered without a game for that table. Nothing was shown from it.' };
  }
  return {
    ok: true,
    table: {
      joinCode: code,
      gameId: result.body.gameId,
      ruleVersion: typeof result.body.ruleVersion === 'string' ? result.body.ruleVersion : '',
      state: typeof result.body.state === 'string' ? result.body.state : '',
      lobbyId: result.body.lobbyId === undefined || result.body.lobbyId === null ? null : String(result.body.lobbyId),
    },
    error: null,
  };
}

/* ============================================================================================
 * THE TABLE'S OWN PROPERTIES, AND THE LIMITS THE SERVICE ACTUALLY ENFORCES
 * ============================================================================================
 *
 * This is the part of setting a table up that the pair page did NOT have: it could choose a GAME
 * and nothing else. The service can be told four things about a new table, and only four —
 * `LobbyCreateRequest` is exactly `gameId`, `ruleVersion`, `capacity`, `waitSeconds`,
 * `displayName` — so these are the only properties this page offers. A control for anything else
 * would be a control that always failed.
 *
 * THE NUMBERS BELOW ARE THE SERVICE'S OWN, MIRRORED. They are constants in `LobbyService`:
 * MIN_CAPACITY 2, MAX_CAPACITY 16, DEFAULT_WAIT_SECONDS 120, MIN_WAIT_SECONDS 1,
 * MAX_WAIT_SECONDS 600. They are duplicated rather than fetched because there is no route that
 * publishes them, and `tests/pair-page.test.mjs` pins each value so a change on either side is a
 * failing test rather than a form that silently sends something the service will refuse.
 *
 * WHY THE PREVIOUS SCREEN'S NUMBERS WERE WRONG, measured against that source: the removed TV
 * setup form bounded seats at `min="2" max="12"` — right for Kadi by luck and wrong for Shogi,
 * whose module declares exactly two, and wrong for a second deck — and bounded the wait at
 * `min="30" max="900"` when the service accepts 1..600. Nine hundred seconds of waiting was
 * therefore a value the form offered and the service refuses.
 *
 * THE MODULE'S OWN RANGE IS STILL THE SERVICE'S TO ENFORCE, AND THE SERVICE NOW PUBLISHES IT.
 * This comment used to read "`/portfolio` does not publish a seat range, so this page cannot know
 * that Kadi declares two-to-twelve and Shogi declares exactly two — and inventing a per-game table
 * here is how a hard-coded game list gets written by accident." Both halves of that still bind:
 *   * THE PAGE MUST NOT INVENT A PER-GAME TABLE. `readDeclaredSeats` below only READS what the
 *     manifest carries, field by field, and `seatsBoundsFor` only chooses between the declared range
 *     and this host's own floor and ceiling. There is no game named anywhere in this file.
 *   * BUT THE PREMISE CHANGED. The manifest now carries `seats: {minimum, maximum, labels}`, published
 *     from the module's own `SeatSchema`, so the page CAN know that a fixed-size game admits exactly
 *     its two seats. Reading it keeps ONE AUTHORITY for "how big is this game's table" — the service.
 * ABSENT STILL MEANS UNDECLARED. A manifest without the block (which is what is deployed today) leaves
 * the input bounded by this host's floor and ceiling exactly as before, and a size the MODULE refuses
 * still comes back as HTTP 400 carrying its own sentence (`ApiExceptionHandler` maps
 * `IllegalArgumentException` to 400), shown verbatim.
 */
export const TABLE_SEATS_FLOOR = 2;
export const TABLE_SEATS_CEILING = 16;
export const DEFAULT_SEATS = TABLE_SEATS_FLOOR;

/**
 * The `seats` block a manifest row carries, normalised, or `null` when it declares none.
 *
 * `null` and a range are DIFFERENT FACTS and this function keeps them different: absent means the
 * module did not declare its seats, which is not the same as declaring a range of no seats. Treating
 * an absent block as `0..0` would make every game unopenable on the first manifest that omitted it,
 * which is the same mistake reading an absent `available` as false would make.
 *
 * The shape is read defensively and by name, because it crosses a network boundary: a non-integer, a
 * negative, or a `maximum` below its `minimum` is not a range this page will bound a form to, and a
 * malformed block is treated as UNDECLARED rather than as a range nobody can satisfy.
 */
export function readDeclaredSeats(block) {
  if (!block || typeof block !== 'object') return null;
  const min = block.minimum;
  const max = block.maximum;
  if (!Number.isInteger(min) || !Number.isInteger(max)) return null;
  if (min < TABLE_SEATS_FLOOR || max > TABLE_SEATS_CEILING || max < min) return null;
  return { minimum: min, maximum: max };
}

/**
 * The bounds the seat input should show for one game: what the MODULE declared, else this HOST's own
 * floor and ceiling. A game the manifest did not give a block keeps the previous bounds exactly, so
 * the change is inert against the manifest deployed today.
 */
export function seatsBoundsFor(game) {
  const declared = game && typeof game === 'object' ? readDeclaredSeats(game.seats) : null;
  return declared ?? { minimum: TABLE_SEATS_FLOOR, maximum: TABLE_SEATS_CEILING };
}
export const DEFAULT_WAIT_SECONDS = 120;
export const MIN_WAIT_SECONDS = 1;
export const MAX_WAIT_SECONDS = 600;

/**
 * THE FOUNDER ASKED FOR A "FILL EMPTY SEATS" OPTION, AND THE SERVICE DOES NOT HAVE ONE.
 *
 * Recorded here, beside the fields that ARE offered, because the honest form of this fact is a
 * sentence on the page rather than a control that looks like it works. `LobbyService` states the
 * position in its own words: the lobby "has no machine-fill mechanism on purpose — a machine seat
 * must name an attributable commissioned" player. The removed TV form had a `machineFill`
 * allowed/disallowed select, which `LobbyCreateRequest` does not declare at all, so on a service
 * with Jackson's unknown-property handling at its Spring Boot default the field was DISCARDED and
 * the control did nothing. Offering it again on the phone would repeat that in a place where more
 * people would trust it.
 *
 * This is a SERVICE gap, not a UI one, and it is reported rather than papered over.
 */
export const FILL_EMPTY_SEATS_SUPPORTED = false;

export const FILL_EMPTY_SEATS_NOTE =
  'Filling seats left empty by the machine is not something this table service accepts yet, so '
  + 'there is no control for it: the service refuses to seat a machine unless an attributable '
  + 'player is named for that seat.';

/* ============================================================================================
 * PUTTING THE TABLE ON A SCREEN
 * ============================================================================================
 *
 * `tv/attach.mjs` owns the reference format for the display. This file cannot import it: the two
 * files are emitted to two different published roots (`/pair/` and the display's own host), so a
 * cross-root import would be a build dependency this repository does not have. The four lines are
 * therefore mirrored — and PINNED by a test that builds the address BOTH ways and asserts they are
 * equal for every code it tries, which is what stops the two copies drifting apart.
 */
export const DISPLAY_ORIGIN = 'https://tv.lastikadi.com';
export const ATTACH_PARAM = 'table';

/**
 * The address that shows a table on a screen, or null when the code is not one.
 *
 * The reference rides in the FRAGMENT, so it is never sent to the host and never appears in a
 * server log, and the page it names is the display's canonical address rather than whichever host
 * served this document.
 */
export function screenAddress(joinCode) {
  const code = normalizeJoinCode(joinCode);
  if (code === null) return null;
  return DISPLAY_ORIGIN + '/#' + ATTACH_PARAM + '=' + code;
}

/** What to tell the owner about putting this table on a screen, in one sentence. */
export function screenSentence(joinCode) {
  const address = screenAddress(joinCode);
  if (address === null) return '';
  return 'To show this table on a screen, open ' + address
    + ' on that screen. It joins the table that already exists — a screen can never open a second one.';
}

/**
 * Open a table for the paired screen. POST /lobby (auth).
 *
 * The phone does the choosing; the screen only has to be told which table to show, which it does
 * by the join code this returns (the screen's own attach control). Nothing is opened unless the
 * service answers with a service-shaped code.
 *
 * THE ANSWER IS THE AUTHORITY. `gameId` and `ruleVersion` are taken from the service's response,
 * never from the request: `ruleVersion` in particular may be RESOLVED server-side (the newest
 * active version) when the caller omits it, so echoing the request would report a version the
 * table is not actually running. A response without a service-shaped join code is an error.
 *
 * THE TWO NUMBERS ARE CHECKED HERE AS WELL AS THERE, and the reason is not distrust of the
 * service. It is that a size outside the host's range cannot be built, so sending it produces a
 * refusal the owner has to read and act on for nothing; refusing it locally costs one sentence and
 * no request. A size the MODULE refuses (Shogi at four seats) is deliberately NOT guessed at here
 * — this page does not know the module's range and will not invent one — so that value does go to
 * the service, which answers 400 with the range in its own words.
 */
export async function createTable(fetchImpl, session, options = {}) {
  const held = usableSession(session);
  if (!held) return { ok: false, table: null, error: 'Sign in first — a table on the screen is opened by your account.' };
  const gameId = typeof options.gameId === 'string' ? options.gameId.trim() : '';
  if (gameId === '') return { ok: false, table: null, error: 'Choose a game for the table.' };

  if (options.capacity !== undefined && options.capacity !== null) {
    const seats = options.capacity;
    if (!Number.isInteger(seats)) {
      return { ok: false, table: null, error: 'Seats has to be a whole number of seats.' };
    }
    if (seats < TABLE_SEATS_FLOOR || seats > TABLE_SEATS_CEILING) {
      return {
        ok: false, table: null,
        error: 'This table service builds tables of ' + TABLE_SEATS_FLOOR + ' to '
          + TABLE_SEATS_CEILING + ' seats. A game may declare a smaller range than that, and the '
          + 'service will say so if this one does.',
      };
    }
  }
  if (options.waitSeconds !== undefined && options.waitSeconds !== null) {
    const wait = options.waitSeconds;
    if (!Number.isInteger(wait) || wait < MIN_WAIT_SECONDS || wait > MAX_WAIT_SECONDS) {
      return {
        ok: false, table: null,
        error: 'Waiting closes after a time between ' + MIN_WAIT_SECONDS + ' and ' + MAX_WAIT_SECONDS
          + ' seconds.',
      };
    }
  }

  const body = { gameId };
  if (Number.isInteger(options.capacity)) body.capacity = options.capacity;
  if (Number.isInteger(options.waitSeconds)) body.waitSeconds = options.waitSeconds;
  if (typeof options.ruleVersion === 'string' && options.ruleVersion.trim() !== '') {
    body.ruleVersion = options.ruleVersion.trim();
  }
  const result = await call(fetchImpl, 'POST', ROUTES.lobby, { body, token: held.token });
  if (!result.ok || !result.body || typeof result.body !== 'object') {
    return { ok: false, table: null, error: controlError(result, 'The service did not open a table') };
  }
  if (!looksLikeJoinCode(result.body.joinCode)) {
    return { ok: false, table: null, error: 'The service answered without a table code. Nothing was opened from it.' };
  }
  // The response is the authority for the game too: a table the page cannot name is a table the
  // screen cannot show. No game in the answer is an error, not an unnamed success.
  if (typeof result.body.gameId !== 'string' || result.body.gameId === '') {
    return { ok: false, table: null, error: 'The service answered without a game for the new table. Nothing was opened from it.' };
  }
  return {
    ok: true,
    table: {
      joinCode: result.body.joinCode,
      gameId: result.body.gameId,
      ruleVersion: typeof result.body.ruleVersion === 'string' ? result.body.ruleVersion : '',
      // The service's own account of the table it built. Kept when present and reported as absent
      // when not, because the seat count is what the owner set up and the room will be shown.
      capacity: Number.isInteger(result.body.capacity) ? result.body.capacity : null,
      state: typeof result.body.state === 'string' ? result.body.state : '',
      lobbyId: result.body.lobbyId === undefined || result.body.lobbyId === null ? null : String(result.body.lobbyId),
    },
    error: null,
  };
}

/* ------------------------------------------------------------- the page state */

export const STEPS = Object.freeze({
  NO_CODE: 'no-code',
  SIGN_IN: 'sign-in',
  READY: 'ready',
  WORKING: 'working',
  PAIRED: 'paired',
  FAILED: 'failed',
});

/** A fresh page state. `session` starts null and only ever holds what a sign-in returned. */
export function initialState(code = null, nowMs = 0) {
  return {
    step: code ? STEPS.SIGN_IN : STEPS.NO_CODE,
    code,
    heldSinceMs: code ? nowMs : null,
    session: null,
    message: code
      ? 'Sign in to approve this screen.'
      : 'This link carries no code. Read the code off the screen and type it below.',
    detail: '',
    failure: null,
    // Post-pairing control state. null until a screen is paired; then it records the last
    // control action's result so the renderer can say what happened.
    control: null,
  };
}

/** The code that was entered by hand, recorded with the moment it was entered. */
export function withCode(state, code, nowMs) {
  const normalized = normalizeUserCode(code);
  if (normalized === null) {
    return { ...state, step: STEPS.FAILED, failure: 'empty-code', message: 'Type the code shown on the screen.' };
  }
  return { ...state, step: STEPS.SIGN_IN, code: normalized, heldSinceMs: nowMs, failure: null,
    message: 'Sign in to approve this screen.' };
}

export function withSession(state, session) {
  return { ...state, step: STEPS.READY, session: { token: session.token, username: session.username },
    failure: null, message: 'Signed in as ' + session.username + '. Approve the screen when you are ready.' };
}

export function signedOut(state) {
  return { ...state, step: STEPS.SIGN_IN, session: null, failure: null,
    message: 'Signed out. Sign in to approve this screen.' };
}

export function working(state) {
  return { ...state, step: STEPS.WORKING, failure: null, detail: '',
    message: 'Approving the code on the screen…' };
}

export function approved(state, result) {
  const who = result.username || (state.session && state.session.username) || 'your account';
  return {
    ...state,
    /*
     * THE SESSION IS KEPT, AND THAT IS A DELIBERATE REVERSAL.
     *
     * It used to be dropped here — "the session has done its one job". It has not: pairing
     * the screen is now the middle of the page's work, and the phone is the control surface
     * for the table the screen will show. The same in-memory session opens and selects
     * tables through the public service. Every safety property is unchanged and re-asserted:
     * it is a variable and nothing else (no storage, no address, no DOM), it is sent only as
     * an `Authorization` header, and `scrub()` still guards every sentence. Signing out
     * still drops it.
     */
    step: STEPS.PAIRED,
    failure: null,
    detail: '',
    control: { kind: 'idle', games: [], table: null, error: null },
    message: 'This screen is now paired. It acts as ' + who
      + ' and keeps its own credential on the device — nothing was shown here and nothing '
      + 'was put in this address. Open a table below, or select one you already have by its code.',
  };
}

/** Fold a control result into the state that already holds the session. Never touches it. */
export function withControl(state, patch) {
  const base = state.control || { kind: 'idle', games: [], table: null, error: null };
  return { ...state, control: { ...base, ...patch } };
}

/** The games the service can host were read. */
export function gamesLoaded(state, games) {
  return withControl(state, { kind: 'games', games: Array.isArray(games) ? games : [], error: null });
}

/** A table was opened or selected, and the screen can be pointed at it by code. */
export function tableChosen(state, table) {
  return withControl(state, { kind: 'chosen', table: table || null, error: null });
}

/** A control action failed; its sentence is shown, never a fabricated result. */
export function controlFailed(state, error) {
  return withControl(state, { kind: 'error', error: typeof error === 'string' ? error : 'That did not work.' });
}

export function failed(state, outcome, error, detail, nowMs) {
  const expired = codeHasExpired(state.heldSinceMs, nowMs);
  return {
    ...state,
    step: STEPS.FAILED,
    failure: expired ? 'expired' : outcome,
    message: (expired ? 'That code has run out. ' : '') + (error || 'The screen was not paired.'),
    detail: expired ? '' : (detail || ''),
  };
}

/**
 * The control state as data, and credential-free by construction: it only ever holds rows the
 * control functions already validated against the service's own shape. `error` is scrubbed by
 * the renderer like every other sentence.
 */
function normaliseControl(control, session) {
  const c = control || {};
  const table = c.table && typeof c.table === 'object' ? c.table : null;
  return {
    kind: typeof c.kind === 'string' ? c.kind : 'idle',
    table,
    games: Array.isArray(c.games) ? c.games : [],
    /*
     * THE SCREEN ADDRESS, BUILT HERE SO THE RENDERER NEVER BUILDS ONE. `screenAddress` validates the
     * code against the service's own shape, so a plan can only ever carry an address for a code
     * the service could have minted. It is null when no table has been chosen.
     */
    screenAddress: table ? screenAddress(table.joinCode) : null,
    // Scrubbed HERE, where the session is in scope, so the renderer never holds a sentence
    // that could carry a credential even if a future service echoed one.
    error: typeof c.error === 'string' ? scrub(c.error, session) : null,
  };
}

/**
 * Everything the page shows, as data — derived from the state and the clock, and carrying NO
 * credential. This is the only thing the renderer is given; the renderer cannot show what it
 * is not handed.
 */
export function plan(state, nowMs) {
  const session = state.session;
  const left = state.code && state.heldSinceMs !== null ? codeSecondsLeft(state.heldSinceMs, nowMs) : null;
  const expired = state.code && state.heldSinceMs !== null ? codeHasExpired(state.heldSinceMs, nowMs) : false;

  const base = {
    step: expired && state.step !== STEPS.PAIRED ? STEPS.FAILED : state.step,
    code: state.code || '',
    hasCode: Boolean(state.code),
    signedInAs: session ? session.username : null,
    canApprove: state.step === STEPS.READY && Boolean(session) && !expired,
    showCodeForm: state.step === STEPS.NO_CODE,
    showSignIn: state.step === STEPS.SIGN_IN || (state.step === STEPS.FAILED && !session && !expired),
    busy: state.step === STEPS.WORKING,
    paired: state.step === STEPS.PAIRED,
    canControl: state.step === STEPS.PAIRED && Boolean(session),
    control: normaliseControl(state.control, session),
    message: '',
    detail: '',
    secondsLeft: expired ? 0 : left,
    expiryNote: '',
  };

  if (state.step === STEPS.PAIRED) {
    return { ...base, message: scrub(state.message, session), detail: '' };
  }
  if (expired) {
    return {
      ...base,
      message: 'That code has run out. Codes last ' + Math.round(EXPIRY_SECONDS / 60)
        + ' minutes — ask the screen for a new one and approve that.',
      detail: '',
    };
  }
  if (state.step === STEPS.WORKING) {
    return { ...base, message: scrub(state.message, session), detail: '' };
  }
  return {
    ...base,
    message: scrub(state.message, session),
    detail: scrub(state.detail, session),
    expiryNote: left !== null && left <= 60
      ? 'This code has ' + left + ' seconds left.'
      : '',
  };
}

/**
 * One honest sentence about the last control action, or '' when there is nothing to say. The
 * error text was already scrubbed by `plan()`, so nothing here can carry a credential.
 */
export function controlSentence(planData) {
  if (!planData || !planData.canControl) return '';
  const control = planData.control;
  if (!control) return '';
  if (control.kind === 'chosen' && control.table) {
    // The sentence carries the ADDRESS rather than an instruction to go and find one, because the
    // person reading it is holding the phone and the screen is across the room.
    const name = 'Table ' + control.table.joinCode + ' is the table for this screen.';
    const address = control.screenAddress ? ' ' + screenSentence(control.table.joinCode) : '';
    return name + address;
  }
  if (control.kind === 'error') {
    return control.error || 'That did not work. Try again.';
  }
  return '';
}

/**
 * Paint the plan. This function is deliberately the ONLY writer of page text, and it writes
 * only fields of a plan — never a session, never a token, never a response object.
 *
 * `ui` is an object of elements, so the whole thing is exercised offline by the test suite
 * against a fake document rather than by matching strings in the page's source.
 *
 * The post-pairing control panel is written GUARDED (`if (ui.x)`): the pairing-only fake
 * documents used by the render tests have no control elements, and a page without the panel
 * must simply not show it rather than throw.
 */
export function render(document, ui, planData) {
  ui.code.textContent = planData.code || '— — — —';
  ui.code.hidden = !planData.hasCode;
  ui.message.textContent = planData.message || '';
  ui.detail.textContent = planData.detail || '';
  ui.detail.hidden = !planData.detail;
  ui.expiry.textContent = planData.expiryNote || '';
  ui.expiry.hidden = !planData.expiryNote;

  ui.codeForm.hidden = !planData.showCodeForm;
  ui.signInPanel.hidden = !planData.showSignIn;
  ui.sessionLine.textContent = planData.signedInAs ? 'Signed in as ' + planData.signedInAs : 'Not signed in';
  ui.approveButton.hidden = !(planData.signedInAs && !planData.paired);
  ui.approveButton.disabled = !planData.canApprove;
  ui.approveButton.textContent = planData.busy ? 'Approving…' : 'Approve this screen';
  ui.approveButton.setAttribute('aria-busy', planData.busy ? 'true' : 'false');
  // Signing out is offered whenever a session is held, including after a pairing — because
  // the session now stays for the table controls, signing out is the action that ends it.
  ui.signOutButton.hidden = !planData.signedInAs;

  if (ui.controlPanel) ui.controlPanel.hidden = !planData.canControl;
  if (ui.controlMessage) {
    const sentence = controlSentence(planData);
    ui.controlMessage.textContent = sentence;
    ui.controlMessage.hidden = !sentence;
  }
  /*
   * THE SECOND-SCREEN ADDRESS IS ITS OWN SURFACE. It is written into its own element rather than
   * only appearing inside a sentence because it is the one string on this page that gets COPIED —
   * an operator reads it onto a second display or opens it there — and a link buried mid-paragraph
   * is a link that gets mistyped. It is a join code and an address, never a credential.
   */
  if (ui.screenRef) {
    const address = planData.control ? planData.control.screenAddress : null;
    ui.screenRef.textContent = address || '';
    ui.screenRef.hidden = !address;
    if (address) ui.screenRef.setAttribute('href', address);
  }
  if (ui.createTableForm) ui.createTableForm.hidden = !planData.canControl;
  if (ui.selectTableForm) ui.selectTableForm.hidden = !planData.canControl;
  return planData;
}
