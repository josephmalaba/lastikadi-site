/**
 * tv/portfolio.mjs — what the venue display knows about the games this service hosts.
 *
 * The venue screen is the surface most likely to advertise a game that cannot be
 * played, because it is the one nobody reloads: it is left on a wall for a week, and
 * a hard-coded list on it keeps making yesterday's promise. So the display owns no
 * list of games. It reads `GET /portfolio` from the table service and renders exactly
 * what that answer truthfully says, and nothing else.
 *
 * The module is deliberately split into four separable steps, because each one is a
 * place a lie could be introduced and each one is tested on its own:
 *
 *   readPortfolio()      the network exchange, and the difference between "no answer"
 *                        and "an answer that says there are no games"
 *   classifyPortfolio()  the answer is a portfolio, an empty portfolio, or not a
 *                        portfolio at all — three different facts
 *   planFor()            what the screen says, as plain data, decided once
 *   renderPicker()       painting that plan; it makes no decisions of its own
 *
 * Nothing here reaches for a global `fetch`, a global `document` or a clock, so every
 * state below — including the timeouts and the malformed answers — is exercised by
 * tests/tv-portfolio.test.mjs rather than reasoned about.
 *
 * WHAT IS NOT A CLAIM HERE. Two tables in this file mention game ids, and neither is a
 * roster of commissioned games:
 *
 *   CLIENT_PATHS       where *this repository* publishes a client, verified by a test
 *                      that the file exists. It says nothing about whether a game is
 *                      switched on; that is the portfolio's job and only its job.
 *   (there is no second table) — a game's name on screen is its own `displayName` if
 *                      the service sends one, and otherwise the service's own id with
 *                      its initial letter capitalised. No game is ever named from a
 *                      list written here.
 */

/* --------------------------------------------------------------- the service */

/** Where the portfolio is read from. The only origin this display talks to. */
export const PORTFOLIO_URL = 'https://api.lastikadi.com/portfolio';

/** The origin a scan opens. Same origin as the clients below. */
export const ORIGIN = 'https://lastikadi.com';

/**
 * A venue screen must never be left spinning. A service that accepts the connection
 * and then says nothing is indistinguishable, from across the room, from a screen that
 * crashed — so the read is bounded and a timeout is reported as the honest state it is.
 */
export const PORTFOLIO_TIMEOUT_MS = 8000;

/**
 * Client paths this repository publishes, as an index of what exists on the origin.
 *
 * A game is only offered for play if a scan can actually open it, so the display has
 * to know where each client lives. The authoritative portfolio does not (yet) carry a
 * client URL, and until it does this table is the only honest source for that fact:
 * every path here is a real, published document, and tests/tv-portfolio.test.mjs fails
 * if one stops existing or if the table names a path the repository does not ship.
 *
 * If the service ever declares `clientPath` on a games entry, that declaration wins —
 * see clientPathFor() — so a newly commissioned game needs no change here. A declaration
 * that a query cannot be appended to safely does not win, for the reason set out there.
 */
export const CLIENT_PATHS = Object.freeze({
  kadi: '/play/',
  go: '/go/',
  shogi: '/shogi/',
  bridge: '/bridge/',
});

/* ----------------------------------------------------------------- the states */

/**
 * The states the picker can be in.
 *
 * Five of these look similar from a phone but are different facts, and telling them
 * apart is the whole point:
 *
 *   EMPTY        the service answered and hosts no games
 *   NONE_AVAILABLE  the service answered and hosts games, none switched on
 *   UNROUTABLE   the service offers a game this display cannot open
 *   UNREACHABLE  there was no usable answer, so the games it hosts are UNKNOWN
 *   UNREADABLE   the service answered, but not with a portfolio
 *
 * `unreachable` and `empty` are the pair that must never be confused. A screen that
 * says "no games" when the network is down has told the operator the opposite of the
 * truth, and the operator will go looking for the fault in the wrong place.
 */
export const STATES = Object.freeze({
  LOADING: 'loading',
  READY: 'ready',
  EMPTY: 'empty',
  NONE_AVAILABLE: 'none-available',
  UNROUTABLE: 'unroutable',
  UNREACHABLE: 'unreachable',
  UNREADABLE: 'unreadable',
});

/**
 * The words each state puts on screen, and the sentence under them.
 *
 * `marker` is a second, non-colour signal: a room read at ten feet should not have to
 * rely on the tint of a chip to know whether there is a game to play or a service to
 * ring about. `note: null` means the sentence is built from the answer instead.
 */
export const STATE_TEXT = Object.freeze({
  [STATES.LOADING]: {
    word: 'Checking',
    marker: '…',
    note: 'Checking which games this table service can host…',
    warn: false,
  },
  [STATES.READY]: {
    word: 'Available',
    marker: '·',
    note: null,
    warn: false,
  },
  [STATES.EMPTY]: {
    word: 'No games',
    marker: '×',
    note: 'The table service is answering, and its portfolio is empty: no game is commissioned on it.',
    warn: true,
  },
  [STATES.NONE_AVAILABLE]: {
    word: 'None switched on',
    marker: '×',
    note: null,
    warn: true,
  },
  [STATES.UNROUTABLE]: {
    word: 'No client here',
    marker: '×',
    note: null,
    warn: true,
  },
  [STATES.UNREACHABLE]: {
    word: 'Service unreachable',
    marker: '!',
    note: 'Could not read the list of games from the table service, so the games it hosts are unknown — which is not the same as it hosting none.',
    warn: true,
  },
  [STATES.UNREADABLE]: {
    word: 'Answer not understood',
    marker: '!',
    note: 'The table service answered, but not with a portfolio, so this screen cannot say which games it hosts.',
    warn: true,
  },
});

/* ------------------------------------------------------------- reading a game */

function textOrNull(value) {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}

/** How a game id is spelled on screen. The service's own name wins if it sends one. */
export function gameLabel(game) {
  const declared = textOrNull(game && game.displayName);
  if (declared) return declared;
  const id = textOrNull(game && game.gameId);
  if (!id) return 'Unnamed game';
  return id.charAt(0).toUpperCase() + id.slice(1);
}

/**
 * A declared client path, if it is one a scan query can be appended to safely, else null.
 *
 * The scan URL is built as `clientPath + '?' + query`, so a declaration is usable only
 * while the identity that query carries stays *in the query*:
 *
 *   `/play/#frag`  the `?game=…&v=…` that follows lands after the `#`, where the phone
 *                  reads a fragment and never sees the game or its rules version. The
 *                  wall shows a scan code, the scan opens the client, and the identity
 *                  step 3 resumes a table from has silently gone — a failure that is
 *                  invisible on this screen and only appears on the phone.
 *   `/play/?x=1`   the appended `?game=…` stops being a parameter and becomes part of
 *                  the previous value: the same loss, from the other side.
 *
 * Both are refused rather than carried, and refusing means the declaration does not win:
 * clientPathFor() falls back to CLIENT_PATHS, this repository's own verified index, or to
 * "unroutable" where there is no entry. Nothing here is stripped and re-written silently;
 * the declaration is either used whole or not used.
 *
 * The one deliberate non-check: a well-formed declaration is still honoured even for a
 * game this repository has never heard of, which is what lets a newly commissioned game
 * reach the wall with no change here.
 */
function declaredClientPath(game) {
  const declared = textOrNull(game && game.clientPath);
  if (!declared) return null;
  if (!declared.startsWith('/') || declared.startsWith('//')) return null;
  if (declared.includes('#') || declared.includes('?')) return null;
  return declared;
}

/**
 * Where a scan should open this game, or null if this display has no client for it.
 *
 * A game the display cannot open is not offered. Pointing an unknown id at a default
 * client would open the wrong game, which is worse than not offering it at all: the
 * person at the table would scan one game and land in another.
 */
export function clientPathFor(game) {
  const declared = declaredClientPath(game);
  if (declared) return declared;
  const id = textOrNull(game && game.gameId);
  return id && Object.prototype.hasOwnProperty.call(CLIENT_PATHS, id) ? CLIENT_PATHS[id] : null;
}

/**
 * Is the portfolio offering this game?
 *
 * Strict equality with `true` is deliberate. "available" with any other value — absent,
 * the string "true", a truthy object — is not the service saying yes, and the rule this
 * file exists to keep is that a game is selectable only when the portfolio says it is.
 */
export function isAvailable(game) {
  return Boolean(game) && game.available === true;
}

/**
 * May this game be selected on this screen?
 *
 * Two questions, both of which must be answered yes: the service says the game is
 * available, and this display knows where its client is published.
 */
export function isSelectable(game) {
  return isAvailable(game) && clientPathFor(game) !== null;
}

/** Why a game shown on screen is not selectable. Never "unknown". */
export function unavailableReason(game) {
  const stated = textOrNull(game && game.unavailableReason);
  if (stated) return stated;
  if (!isAvailable(game)) {
    const lifecycle = textOrNull(game && game.lifecycle);
    return lifecycle ? 'not switched on at this service — ' + lifecycle : 'not switched on at this service';
  }
  return 'no client is published for this game at this venue';
}

/* --------------------------------------------------------- reading an answer */

/**
 * Reject a plausible-looking object. A venue display must not read a shape it does not
 * understand and then describe the absence of data as the absence of games.
 */
function unreadable(detail) {
  return { state: STATES.UNREADABLE, games: [], detail };
}

/**
 * Turn a parsed body into an outcome.
 *
 * Every entry must be an object carrying a usable id. Anything else is not a portfolio,
 * and saying so is the honest answer: a display that shrugs at a shape it cannot read
 * and reports "no games" has converted its own confusion into a fact about the service.
 */
export function classifyPortfolio(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return unreadable('the answer was not a portfolio object');
  }
  if (!Array.isArray(payload.games)) {
    return unreadable('the answer carried no games list');
  }

  const games = [];
  for (const entry of payload.games) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      return unreadable('a games entry was not an object');
    }
    if (textOrNull(entry.gameId) === null) {
      return unreadable('a games entry carried no game id');
    }
    games.push(entry);
  }

  if (games.length === 0) {
    return { state: STATES.EMPTY, games: [], detail: 'the portfolio lists no games' };
  }

  const selectable = games.filter(isSelectable).length;
  const available = games.filter(isAvailable).length;
  const state = selectable > 0
    ? STATES.READY
    : (available > 0 ? STATES.UNROUTABLE : STATES.NONE_AVAILABLE);
  return {
    state,
    games,
    detail: games.length + ' game(s) listed, ' + available + ' available, ' + selectable + ' selectable here',
  };
}

/**
 * Read the portfolio, and report which of "no answer", "an answer we cannot read" and
 * "an answer that says there are no games" actually happened.
 *
 * `fetchImpl` is passed in rather than taken from the global scope so the timeout, the
 * HTTP failure, the unparseable body and the malformed payload are all testable.
 */
export async function readPortfolio(fetchImpl, options = {}) {
  const url = options.url || PORTFOLIO_URL;
  const timeoutMs = options.timeoutMs === undefined ? PORTFOLIO_TIMEOUT_MS : options.timeoutMs;

  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  let timer = null;
  if (controller && timeoutMs > 0) {
    timer = setTimeout(() => controller.abort(), timeoutMs);
  }
  const aborted = () => Boolean(controller && controller.signal && controller.signal.aborted);
  const timedOut = () => ({ state: STATES.UNREACHABLE, games: [], detail: 'timed out after ' + timeoutMs + 'ms' });

  try {
    const response = await fetchImpl(url, controller ? { method: 'GET', signal: controller.signal } : { method: 'GET' });
    if (!response || typeof response.ok !== 'boolean') {
      return { state: STATES.UNREACHABLE, games: [], detail: 'the service did not answer with a response' };
    }
    if (!response.ok) {
      const status = response.status === undefined ? 'unknown' : response.status;
      return { state: STATES.UNREACHABLE, games: [], detail: 'the service answered HTTP ' + status };
    }

    let payload;
    try {
      payload = await response.json();
    } catch (error) {
      // A body that stopped mid-read because the deadline passed is a timeout, not a
      // malformed answer, and saying "not JSON" would point the operator at the service's
      // payload instead of at the clock.
      if (aborted()) return timedOut();
      return unreadable('the answer was not JSON');
    }
    return classifyPortfolio(payload);
  } catch (error) {
    if (aborted()) return timedOut();
    const name = error && typeof error.name === 'string' && error.name ? error.name : null;
    return {
      state: STATES.UNREACHABLE,
      games: [],
      detail: name ? 'the request failed (' + name + ')' : 'the request failed',
    };
  } finally {
    if (timer !== null) clearTimeout(timer);
  }
}

/* --------------------------------------------------------- carrying a choice */

/**
 * The selection record: the exact game identity, its version, and where a scan opens.
 *
 * This object is what survives. It is not re-derived from a name on screen and it is
 * not re-guessed downstream: the id and the rules version a phone receives are the ones
 * the authoritative portfolio stated when the game was chosen.
 */
export function selectionFor(game) {
  if (!isSelectable(game)) return null;
  const clientPath = clientPathFor(game);
  const ruleVersion = textOrNull(game.ruleVersion);
  const runtimeInterfaceVersion = textOrNull(game.runtimeInterfaceVersion);
  const query = 'game=' + encodeURIComponent(game.gameId)
    + (ruleVersion ? '&v=' + encodeURIComponent(ruleVersion) : '');
  return Object.freeze({
    gameId: game.gameId,
    label: gameLabel(game),
    ruleVersion,
    runtimeInterfaceVersion,
    clientPath,
    url: ORIGIN + clientPath + '?' + query,
  });
}

/**
 * The same identity, as a fragment on this screen's own address.
 *
 * A venue display is left running for days and reloaded by whoever finds it, so the
 * choice cannot live only in a variable: after a reload the screen would fall back to
 * the first game the service lists, which is a different game from the one a person
 * scanned a minute ago. The fragment is also how a reviewer can read the carried
 * identity off the address bar rather than taking this file's word for it.
 */
export function selectionFragment(selection) {
  if (!selection) return '';
  return '#game=' + encodeURIComponent(selection.gameId)
    + (selection.ruleVersion ? '&v=' + encodeURIComponent(selection.ruleVersion) : '');
}

/** Read a carried selection back. Returns null when there is nothing usable. */
export function readSelectionFragment(hash) {
  const raw = typeof hash === 'string' ? hash.replace(/^#/, '') : '';
  if (!raw) return null;
  const found = {};
  for (const pair of raw.split('&')) {
    const at = pair.indexOf('=');
    if (at <= 0) continue;
    const key = pair.slice(0, at);
    let value = pair.slice(at + 1);
    try {
      value = decodeURIComponent(value);
    } catch {
      continue;
    }
    if (key === 'game' || key === 'v') found[key] = value;
  }
  const gameId = textOrNull(found.game);
  if (!gameId) return null;
  return { gameId, ruleVersion: textOrNull(found.v) };
}

/* --------------------------------------------------------------- what to show */

function cardFor(game, selectedId) {
  const selectable = isSelectable(game);
  return {
    gameId: game.gameId,
    label: gameLabel(game),
    ruleVersion: textOrNull(game.ruleVersion),
    lifecycle: textOrNull(game.lifecycle),
    selectable,
    reason: selectable ? null : unavailableReason(game),
    selected: game.gameId === selectedId,
  };
}

function selectionSummary(selection) {
  const rules = selection.ruleVersion
    ? 'rules v' + selection.ruleVersion
    : 'the service states no rules version';
  const iface = selection.runtimeInterfaceVersion
    ? ' on runtime interface v' + selection.runtimeInterfaceVersion
    : '';
  return selection.label + ' selected — ' + rules + iface
    + '. Scanning opens ' + selection.url.replace(/^https?:\/\//, '') + '.';
}

function namesOf(games) {
  const labels = games.map((g) => gameLabel(g));
  if (labels.length <= 1) return labels.join('');
  return labels.slice(0, -1).join(', ') + ' and ' + labels[labels.length - 1];
}

/** The venue tag in the header, which must not name a game before one is chosen. */
const VENUE_TAG = Object.freeze({
  [STATES.LOADING]: 'LastiKadi at the table',
  [STATES.EMPTY]: 'No game at this table',
  [STATES.NONE_AVAILABLE]: 'No game switched on',
  [STATES.UNROUTABLE]: 'No game this screen can open',
  [STATES.UNREACHABLE]: 'List of games unavailable',
  [STATES.UNREADABLE]: 'List of games unavailable',
});

const JOIN_LABEL = Object.freeze({
  [STATES.LOADING]: 'Checking the list of games…',
  [STATES.READY]: 'Scan to play',
  [STATES.EMPTY]: 'No game to play',
  [STATES.NONE_AVAILABLE]: 'No game to play',
  [STATES.UNROUTABLE]: 'No game to play',
  [STATES.UNREACHABLE]: 'List of games unavailable',
  [STATES.UNREADABLE]: 'List of games unavailable',
});

/**
 * The state the screen is actually in.
 *
 * A claimed state is trusted only where it cannot overstate. Loading, unreachable and
 * unreadable promise nothing, so any games they accidentally carry are ignored. Every
 * other claim is re-derived from the games themselves, which is what stops a caller that
 * hand-builds an outcome from talking this screen into calling a game playable — the one
 * direction of error this whole surface exists to make impossible.
 */
function resolveState(claimed, games) {
  if (claimed === STATES.LOADING || claimed === STATES.UNREACHABLE || claimed === STATES.UNREADABLE) {
    return claimed;
  }
  if (games.length === 0) return STATES.EMPTY;
  if (games.some(isSelectable)) return STATES.READY;
  return games.some(isAvailable) ? STATES.UNROUTABLE : STATES.NONE_AVAILABLE;
}

/**
 * Decide everything the screen will say, as data.
 *
 * `preferred` is a selection carried in from the screen's own address, so a reload keeps
 * the game that was chosen. A preferred game that is no longer selectable is replaced —
 * openly, in the sentence under the picker, not silently.
 */
export function planFor(outcome, preferred = null) {
  const claimedRaw = outcome && typeof outcome.state === 'string' ? outcome.state : '';
  const claimed = Object.prototype.hasOwnProperty.call(STATE_TEXT, claimedRaw) ? claimedRaw : STATES.UNREADABLE;
  const games = Array.isArray(outcome && outcome.games) ? outcome.games : [];
  const state = resolveState(claimed, games);
  const text = STATE_TEXT[state];
  const detail = textOrNull(outcome && outcome.detail) || '';
  const plan = {
    state,
    stateWord: text.word,
    stateMarker: text.marker,
    warn: text.warn,
    note: text.note,
    detail,
    venueTag: VENUE_TAG[state] || VENUE_TAG[STATES.LOADING],
    joinLabel: JOIN_LABEL[state] || JOIN_LABEL[STATES.LOADING],
    games: [],
    selection: null,
  };

  if (state === STATES.READY) {
    const selectable = games.filter(isSelectable);
    const wanted = textOrNull(preferred && preferred.gameId);
    const chosen = (wanted && selectable.find((g) => g.gameId === wanted)) || selectable[0];
    const selection = selectionFor(chosen);
    plan.selection = selection;
    plan.games = games.map((g) => cardFor(g, selection.gameId));
    plan.note = selectionSummary(selection);
    plan.venueTag = selection.label + ' at the table';
    if (wanted && wanted !== selection.gameId) {
      plan.note = 'The game that was chosen is no longer on offer here. ' + plan.note;
      plan.warn = true;
    }
    return plan;
  }

  if (state === STATES.NONE_AVAILABLE || state === STATES.UNROUTABLE) {
    const chosenId = null;
    plan.games = games.map((g) => cardFor(g, chosenId));
    if (state === STATES.NONE_AVAILABLE) {
      plan.note = 'The table service lists ' + games.length + ' game' + (games.length === 1 ? '' : 's')
        + ', but none is switched on at the moment.';
    } else {
      const offered = games.filter(isAvailable);
      plan.note = 'The table service offers ' + namesOf(offered)
        + ', but this display has no client published for '
        + (offered.length === 1 ? 'it' : 'them') + ', so it cannot open a table.';
    }
  }

  return plan;
}

/**
 * Where the scan code points. Separated from the drawing so the decision — there is a
 * verified selection, or there is nothing to scan — is testable without a canvas.
 */
export function qrPlan(plan) {
  const selection = plan && plan.selection ? plan.selection : null;
  if (!selection) {
    return { show: false, url: null, text: '', ariaLabel: 'No game to open — nothing to scan' };
  }
  return {
    show: true,
    url: selection.url,
    text: selection.url.replace(/^https?:\/\//, ''),
    ariaLabel: 'Scan to open ' + selection.label + ' — ' + selection.url.replace(/^https?:\/\//, ''),
  };
}

/* ------------------------------------------------------------------ painting */

/**
 * One game control.
 *
 * `disabled` is bound to the plan's `selectable` and to nothing else. This is the line
 * the whole file is for: a control that can be clicked is a control that offers a game,
 * and the only thing entitled to say a game is on offer is the portfolio.
 */
export function gameButton(doc, card) {
  const btn = doc.createElement('button');
  btn.type = 'button';
  btn.className = 'picker__game';
  btn.setAttribute('role', 'option');
  btn.dataset.gameId = card.gameId;
  btn.disabled = card.selectable !== true;
  btn.setAttribute('aria-selected', String(card.selected === true));
  btn.setAttribute('aria-disabled', String(card.selectable !== true));
  btn.title = card.selectable
    ? 'Choose ' + card.label
    : card.label + ' — ' + card.reason;

  const name = doc.createElement('span');
  name.className = 'picker__game-name';
  name.textContent = card.label;
  btn.appendChild(name);

  const sub = doc.createElement('small');
  sub.textContent = card.selectable
    ? (card.ruleVersion ? 'rules v' + card.ruleVersion : 'rules version not stated')
    : card.reason;
  btn.appendChild(sub);

  return btn;
}

/**
 * Paint a plan. This function decides nothing: every word, every control's state and
 * whether there is anything to scan arrive in the plan, so a test can assert the screen
 * by asserting the plan and then confirm the painting agrees with it.
 */
export function renderPicker(doc, ui, plan) {
  ui.panel.dataset.state = plan.state;
  ui.panel.setAttribute('aria-busy', String(plan.state === STATES.LOADING));

  ui.chip.textContent = plan.stateMarker + ' ' + plan.stateWord;
  ui.chip.dataset.state = plan.state;

  ui.games.textContent = '';
  ui.games.setAttribute('aria-busy', String(plan.state === STATES.LOADING));
  for (const card of plan.games) ui.games.appendChild(gameButton(doc, card));

  ui.note.textContent = plan.note;
  ui.note.className = plan.warn ? 'picker__note warn' : 'picker__note';

  ui.detail.textContent = plan.detail;
  ui.detail.hidden = plan.detail === '';

  ui.venueTag.textContent = plan.venueTag;
  ui.joinLabel.textContent = plan.joinLabel;

  return plan;
}
