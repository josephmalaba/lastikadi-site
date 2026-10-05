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
 *   * sent only as an `Authorization` header, to `POST /device/approve`, on this origin's
 *     behalf;
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
    // The session has done its one job. It is DROPPED here rather than kept for a later
    // action, so the remainder of the page's life holds no credential at all.
    session: null,
    step: STEPS.PAIRED,
    failure: null,
    detail: '',
    message: 'This screen is now paired. It acts as ' + who
      + ' and keeps its own credential on the device — nothing was shown here and nothing '
      + 'was put in this address.',
  };
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
 * Paint the plan. This function is deliberately the ONLY writer of page text, and it writes
 * only fields of a plan — never a session, never a token, never a response object.
 *
 * `ui` is an object of elements, so the whole thing is exercised offline by the test suite
 * against a fake document rather than by matching strings in the page's source.
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
  // Signing out is offered only while a session is held. After a pairing there is no session
  // left to drop, because `approved()` has already dropped it.
  ui.signOutButton.hidden = !planData.signedInAs;
  return planData;
}
