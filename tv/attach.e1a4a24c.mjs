/**
 * tv/attach.mjs — THE REFERENCE a display is given so it can show a table it did not open.
 *
 * ============================================================================================
 * WHAT PROBLEM THIS SOLVES, AND WHY IT IS A *REFERENCE* RATHER THAN A CREDENTIAL
 * ============================================================================================
 * The Founder's model is "tv is the display, and join tool. phones control everything." A
 * consequence that took a defect to notice: a display that OPENS a table is a display exercising
 * an owner's authority, and a venue with two screens must show ONE table rather than two. So a
 * display has to be able to ATTACH to a session that already exists — and attaching must be a
 * READ, never a create, or a screen that reconnects would silently manufacture a second table.
 *
 * The reference is the table's JOIN CODE, because the service already treats it as the public
 * handle for a session:
 *
 *   GET /lobby/{joinCode}   `permitAll` — SecurityConfig maps GET `/lobby/*` (one segment), so
 *                           exactly this route is public and /lobby, /lobby/{code}/join and
 *                           /lobby/{id}/start are not.
 *   LobbyController.resolve returns lobbyId, gameId, ruleVersion, state, capacity,
 *                           seats (labels only — `publicView()`), expiresAt, waitDeadline.
 *
 * WHY THAT VALUE IS NOT A CREDENTIAL, stated as the two properties that matter:
 *
 *   1. IT GRANTS NOTHING THAT IS NOT ALREADY PUBLIC. The join code is printed in the room, on
 *      the wall, and encoded in the join QR every phone scans. Anyone standing in the venue
 *      already has it. Reading it reveals exactly what the service already answers to an
 *      unauthenticated GET — a roster of the display names players chose, the seat count, the
 *      state and two deadlines. `LobbyController`'s own javadoc says the public shape carries
 *      "seat labels and nothing about the accounts behind them"; the account ids stay behind the
 *      authenticated routes.
 *   2. IT CONFERS NO AUTHORITY. It cannot create (POST /lobby), take a seat
 *      (POST /lobby/{code}/join) or start a game (POST /lobby/{id}/start). Those are the three
 *      routes it does not reach, and each is authenticated separately. A display holding a code
 *      and nothing else is a display that can only look.
 *
 * The alternative that was considered and REJECTED is worth recording, because it is the obvious
 * one: reuse device pairing, so a second screen gets its own /device/code approved by the owner.
 * Two measured reasons it is wrong here, both from the service source:
 *
 *   * PAIRING GRANTS THE OWNER'S ACCOUNT, WHICH IS MORE AUTHORITY THAN A DISPLAY NEEDS, NOT LESS.
 *     DeviceController.approve binds the pairing to `SeatAuthority.callerAccountIdOrNull()` — the
 *     approver's own account — and POST /device/token then hands the screen a token whose
 *     principal is that numeric account (JwtAuthenticationFilter). LobbyService.start refuses any
 *     caller whose account is not `lobby.getHostAccountId()`. So a paired display holds a token
 *     that IS the host, and can start the table. A second display paired the same way would be a
 *     second holder of host authority — exactly what must not be created.
 *   * PAIRING DOES NOT CARRY A SESSION REFERENCE, SO IT DOES NOT SOLVE ATTACHMENT AT ALL.
 *     ApproveRequest has ONE field (`userCode`); the approve response is
 *     {status, username, accountId}; the token response is {token, username, accountId}. Nothing
 *     in the exchange names a table. And the service has no way to address a display even in
 *     principle: a grep of src/main/java for `tvId` returns NOTHING, so the `tvId` the display
 *     already sends on POST /lobby is discarded, LobbyCreateRequest has no such field, and there
 *     is no account-wide lobby listing (pair/pair.mjs records the same measurement). So pairing
 *     answers "who may this screen be" and the question here is "which table is this screen for".
 *
 * ---------------------------------------------------------------------------------------------
 * A NON-GOAL, STATED SO IT CANNOT BE ASSUMED: `tvId` MUST NEVER BECOME THE ANSWER
 * ---------------------------------------------------------------------------------------------
 * `getTvId()` used to generate a random eight-character string in localStorage and send it on
 * POST /lobby. Two things are wrong with promoting it into an attachment key: it is CLIENT-MINTED
 * and therefore forgeable by anyone with devtools, and the join code it would have to be matched
 * against is what protects the roster. A server that trusted a client-supplied id to decide which
 * session a caller may see would be handing out the roster and the join code to whoever guessed
 * or copied eight characters. This module never reads, writes or accepts a `tvId`, and the display
 * no longer has one. The join code is accepted INSTEAD precisely because it is not a secret and
 * not an authorisation — it is the thing already on the wall.
 *
 * ---------------------------------------------------------------------------------------------
 * WHAT THIS MODULE IS NOT ALLOWED TO DO
 * ---------------------------------------------------------------------------------------------
 * It is PURE: no `fetch`, no DOM, no storage, no clock, no timer. Every function takes what it
 * needs and returns data. The display's single network path for a session stays `tv/lobby.mjs`,
 * so there is ONE reader and one authority to reason about rather than two that could drift.
 * Its storage key is exported so `tv/index.html` can persist the reference without this file
 * ever touching a device. Nothing here writes a credential anywhere, because nothing here ever
 * sees one.
 */

/** The canonical address of the venue display. The reference link is built on it. */
export const DISPLAY_ORIGIN = 'https://tv.lastikadi.com';

/**
 * The one parameter a reference link carries.
 *
 * `table` rather than `code` because a bare `code` in a URL is ambiguous on this estate — the
 * service mints an 8-character user code WITH a hyphen for PAIRING and a 10-character join code
 * WITHOUT one for a TABLE, and they are deliberately never confusable (pair/pair.mjs says so and
 * pins both alphabets). The fragment of a real published link may still spell it `code=`, so that
 * spelling is accepted; when this module BUILDS a link it writes `table=`, and a test asserts the
 * two spellings cannot be told apart from each other once parsed.
 */
export const REFERENCE_PARAM = 'table';

/** Every spelling of the parameter this module accepts, canonical one first. */
export const REFERENCE_PARAMS = Object.freeze([REFERENCE_PARAM, 'code']);

/**
 * The table service's join-code alphabet and length, exactly as `JoinCode.java` defines them: TEN
 * characters from 32 symbols that omit the ones a person mis-reads — `I`, `L`, `O`, `U` (the
 * exclusions Crockford's alphabet makes) plus `0` and `1`.
 *
 * WHY THIS IS DUPLICATED RATHER THAN SHARED. `pair/pair.mjs` carries the same two constants for
 * the phone, and the two files are emitted to two different published roots (`/pair/` and `/tv/`),
 * so neither can import the other without a cross-root dependency in the build. `lobby.mjs`
 * carries a LOOSER shape (`[A-Z0-9]{4,12}`) on purpose and this module does not change it: that
 * value is compared against codes the SERVICE returned, where the service is the authority on its
 * own spelling. The shape here is the one applied to a code a HUMAN or an ADDRESS supplied, where
 * a shape the service could not have minted must be refused WITHOUT a request. A test pins the two
 * pair/tv copies equal, so they cannot drift.
 */
export const SERVICE_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTVWXYZ23456789';
export const SERVICE_CODE_LENGTH = 10;

/**
 * Where the reference is kept on the display, so a screen that reloads or restarts re-attaches to
 * the same table instead of forgetting it.
 *
 * The SAME key the display already used to remember its active lobby, deliberately: the value
 * stored is the same fact under the same name, so an existing screen's saved record keeps working
 * and there is one record rather than two that could disagree.
 */
export const ATTACH_STORAGE_KEY = 'lastikadi.tv.activeLobby';

/** Does this look like a table code the table service could have minted? Shape only. */
export function looksLikeServiceTableCode(value) {
  if (typeof value !== 'string' || value.length !== SERVICE_CODE_LENGTH) return false;
  return [...value].every((ch) => SERVICE_CODE_ALPHABET.includes(ch));
}

/**
 * A table code in the one spelling the service looks up, or null.
 *
 * `JoinCode.normalize` is the contract and this mirrors it: strip `-`, ` ` and `_`, upper-case the
 * rest, and accept only ten characters of the alphabet. It returns NULL rather than a cleaned-up
 * guess when the input cannot be a code at all — repairing a mistyped code into a DIFFERENT code
 * would be a guess about which table is on the screen, and two tables that differ by one character
 * are two different rooms.
 */
export function normalizeServiceTableCode(raw) {
  if (typeof raw !== 'string') return null;
  const cleaned = [...raw.trim().toUpperCase()]
    .filter((ch) => ch !== '-' && ch !== ' ' && ch !== '_')
    .join('');
  if (cleaned.length !== SERVICE_CODE_LENGTH) return null;
  return [...cleaned].every((ch) => SERVICE_CODE_ALPHABET.includes(ch)) ? cleaned : null;
}

/**
 * Why a reference was refused, as a sentence an operator can act on.
 *
 * Kept here rather than at the call site so `readTableReference` and the display's own messages
 * cannot disagree about what went wrong.
 */
export const REFERENCE_PROBLEMS = Object.freeze({
  ABSENT: 'absent',
  UNUSABLE: 'unusable',
  NOT_A_SERVICE_CODE: 'not-a-service-code',
});

function referenceFromParam(value, source) {
  const code = normalizeServiceTableCode(value);
  if (code === null) {
    return {
      joinCode: null,
      source,
      problem: REFERENCE_PROBLEMS.NOT_A_SERVICE_CODE,
      raw: typeof value === 'string' ? value : '',
    };
  }
  return { joinCode: code, source, problem: null, raw: value };
}

/**
 * The table reference carried by an address, if it carries one.
 *
 * THE FRAGMENT IS CANONICAL AND THE QUERY IS ACCEPTED. A fragment is never sent to a server, so
 * the canonical link leaves no trace in an access log and cannot arrive at the wrong origin
 * through a redirect; a query spelling is accepted because an operator may already have one and a
 * link that mixed the two must not silently lose the table. Nothing else in the address is read,
 * and nothing is ever ADDED to it — this function is a pure read of a string it was handed.
 *
 * Both copies of the parameter are tried in `REFERENCE_PARAMS` order, fragment before query. A
 * present-but-unusable value is REPORTED rather than treated as absent: an operator who pasted a
 * truncated link needs to be told the link is wrong, not shown the same "no table" screen as a
 * display that was never given one.
 */
export function readTableReference(address) {
  const absent = { joinCode: null, source: null, problem: REFERENCE_PROBLEMS.ABSENT, raw: '' };
  if (typeof address !== 'string' || address.trim() === '') return absent;
  let url;
  try {
    url = new URL(address, DISPLAY_ORIGIN + '/');
  } catch {
    return { joinCode: null, source: null, problem: REFERENCE_PROBLEMS.UNUSABLE, raw: '' };
  }

  const hash = url.hash.startsWith('#') ? url.hash.slice(1) : url.hash;
  for (const source of ['fragment', 'query']) {
    const params = source === 'fragment' ? new URLSearchParams(hash) : url.searchParams;
    for (const name of REFERENCE_PARAMS) {
      if (!params.has(name)) continue;
      return referenceFromParam(params.get(name), source);
    }
  }
  // A bare `#MNPQRSTVWX`, accepted because it is unambiguous: ten characters of the service's own
  // alphabet cannot be anything but a table code, and a hash of any other shape is not read.
  if (hash !== '' && !hash.includes('=') && looksLikeServiceTableCode(normalizeServiceTableCode(hash) || '')) {
    return referenceFromParam(hash, 'fragment');
  }
  return absent;
}

/**
 * The address that shows a table on a display, or null if the code is not one.
 *
 * Built from `DISPLAY_ORIGIN`, never from `location`, so the link an owner is shown is the
 * canonical venue address rather than whichever host happened to serve the page. The result
 * carries the code in the FRAGMENT, which is the whole point: the reference is not transmitted to
 * the host when the link is opened.
 */
export function attachAddress(joinCode) {
  const code = normalizeServiceTableCode(joinCode);
  if (code === null) return null;
  return DISPLAY_ORIGIN + '/#' + REFERENCE_PARAM + '=' + code;
}

/**
 * What to tell the owner who has just opened a table, about putting it on a screen.
 *
 * One sentence, and it says the thing that is easy to get wrong: opening the link does not create
 * anything. A sentence that only printed an address would leave a reader wondering whether they
 * were about to open a second table.
 *
 * THE ADDRESS IS PRINTED WITHOUT ITS SCHEME, and the exact same string is built in
 * `pair/pair.mjs` for the phone. The two files are emitted to different published roots and cannot
 * import each other, so `tests/tv-attach.test.mjs` asserts the two sentences and the two addresses
 * are EQUAL for a good code and for several bad ones — a drift here would hand an owner a link the
 * display cannot read, which is the failure this whole module exists to make impossible.
 */
export function attachSentence(joinCode) {
  const address = attachAddress(joinCode);
  if (address === null) return '';
  return 'To show this table on a screen, open ' + address
    + ' on that screen. It joins the table that already exists — a screen can never open a second one.';
}

/**
 * The saved record a display keeps for itself, read back strictly.
 *
 * Returns null for anything that is not a usable reference, and the caller removes the record in
 * that case rather than half-using it. `clientPath` and `gameId` ride along because the display
 * already stored them and `joinUrl()` needs the game and version from the SERVICE's answer, not
 * from this record — this only remembers which table the screen was showing.
 */
export function readSavedReference(rawValue) {
  if (typeof rawValue !== 'string' || rawValue === '') return null;
  let parsed;
  try {
    parsed = JSON.parse(rawValue);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const joinCode = normalizeServiceTableCode(parsed.joinCode);
  if (joinCode === null) return null;
  return {
    joinCode,
    gameId: typeof parsed.gameId === 'string' && parsed.gameId !== '' ? parsed.gameId : null,
    clientPath: typeof parsed.clientPath === 'string' && /^\/[a-z0-9/-]*\/$/.test(parsed.clientPath)
      ? parsed.clientPath
      : null,
  };
}

/** The record to keep for a reference, so a reload re-attaches to the same table. */
export function savedReference(joinCode, gameId, clientPath) {
  const code = normalizeServiceTableCode(joinCode);
  if (code === null) return null;
  return JSON.stringify({
    joinCode: code,
    gameId: typeof gameId === 'string' && gameId !== '' ? gameId : null,
    clientPath: typeof clientPath === 'string' && /^\/[a-z0-9/-]*\/$/.test(clientPath) ? clientPath : null,
  });
}
