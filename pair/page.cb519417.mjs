/**
 * pair/page.mjs — the wiring for the page a phone opens to approve a screen.
 *
 * THIS FILE DECIDES NOTHING. Every decision — what the code is, whether a session is held,
 * what a service answer means, what may be shown — lives in `./pair.8be67edf.mjs` and is tested there
 * without a browser. This file contributes the DOM lookups, the event listeners, the clock and
 * `fetch`, and nothing else.
 *
 * THE SESSION LIVES IN THE `state` OBJECT BELOW AND NOWHERE ELSE. It is never written to
 * localStorage, sessionStorage, a cookie or IndexedDB, never put in a form field's value, never
 * placed in the address, and never rendered. A reload therefore signs the reader out, which is
 * the price of never writing a credential down — and it is the right price for a page whose
 * whole reason for existing is that a credential must not travel through a page.
 *
 * WHY THERE IS A REPAINT TIMER AND NO POLLING TIMER. `setInterval` here re-paints the plan so
 * the code's remaining life counts down. It issues NO network request. That matters: the service
 * advertises `intervalSeconds: 1` while enforcing `MIN_POLL_MILLIS = 1500` server-side, so a
 * page that polled on the advertisement would be polling faster than the floor it is held to.
 * This page does not poll at all — the screen itself is the only thing that polls, and it holds
 * the `deviceCode` this page is deliberately never told.
 */
import {
  DEFAULT_SEATS, DEFAULT_WAIT_SECONDS, FILL_EMPTY_SEATS_NOTE, MAX_WAIT_SECONDS, MIN_WAIT_SECONDS,
  STEPS, TABLE_SEATS_CEILING, TABLE_SEATS_FLOOR, approved, approveCode, createTable, failed,
  gamesLoaded, initialState, listGames, looksLikeCredential, plan, readCode, registerAccount, render,
  seatsBoundsFor, selectTable, signIn, signedOut, tableChosen, controlFailed, withCode,
  withSession, working,
} from './pair.8be67edf.mjs';

const byId = (id) => document.getElementById(id);

const ui = {
  code: byId('code'),
  message: byId('message'),
  detail: byId('detail'),
  expiry: byId('expiry'),
  codeForm: byId('codeForm'),
  signInPanel: byId('signInPanel'),
  sessionLine: byId('sessionLine'),
  approveButton: byId('approve'),
  signOutButton: byId('signOut'),
  controlPanel: byId('controlPanel'),
  controlMessage: byId('controlMessage'),
  createTableForm: byId('createTableForm'),
  selectTableForm: byId('selectTableForm'),
  screenRef: byId('screenRef'),
};

/* The control panel's own elements. These are DOM wiring, not decisions: the game list is built
 * only from rows the control functions in pair.mjs already validated against the service's shape,
 * and the panel is only ever populated while a session is held. */
const control = {
  gameSelect: byId('tableGame'),
  gamesNote: byId('gamesNote'),
  seatsInput: byId('tableSeats'),
  waitInput: byId('tableWait'),
  createButton: byId('createTableButton'),
  selectCodeInput: byId('selectCode'),
  selectButton: byId('selectTableButton'),
};

/*
 * The limits the FORM shows start at the host's own floor and ceiling, read from the module at
 * start-up rather than typed into the markup twice. A binding attribute that disagreed with the module
 * would let the browser accept a number the module then refuses, which reads to the owner as a bug in
 * the phone.
 *
 * AND THEY ARE THEN NARROWED PER GAME, FROM WHAT THE SERVICE PUBLISHED. `boundSeatsTo` is called once
 * at start-up and again every time the game changes, because a fixed-size game admits exactly its own
 * seats: a box that still offered sixteen for Shogi would be offering a table the module refuses. The
 * bounds come FROM the manifest's own `seats` block, never from a table of game names written here —
 * which is the distinction the constant's comment draws.
 */
control.seatsInput.min = String(TABLE_SEATS_FLOOR);
control.seatsInput.max = String(TABLE_SEATS_CEILING);
control.seatsInput.value = String(DEFAULT_SEATS);
control.waitInput.min = String(MIN_WAIT_SECONDS);
control.waitInput.max = String(MAX_WAIT_SECONDS);
control.waitInput.value = String(DEFAULT_WAIT_SECONDS);

/**
 * Bound the seat box to one game's DECLARED range, or to this host's own floor and ceiling when the
 * manifest declared none. A value left outside the new bounds is clamped INTO them rather than
 * silently sent: the service would refuse it, and the owner would be told their phone is broken.
 */
function boundSeatsTo(game) {
  const bounds = seatsBoundsFor(game);
  control.seatsInput.min = String(bounds.minimum);
  control.seatsInput.max = String(bounds.maximum);
  const current = Number(control.seatsInput.value);
  if (!Number.isFinite(current) || current < bounds.minimum || current > bounds.maximum) {
    control.seatsInput.value = String(bounds.minimum);
  }
}

/** Re-bound for whichever game is selected now. Used at start-up and on every change. */
function boundSeatsToSelection(gamesById) {
  const game = gamesById.get(control.gameSelect.value) ?? null;
  boundSeatsTo(game);
}

/*
 * The games the service last offered, BY ID, so a change of selection can find the row it needs
 * without re-fetching. Empty until `loadControl` succeeds; a change before then finds no row and
 * therefore falls back to this host's floor and ceiling, which is the correct answer for "we do not
 * know what this game declares".
 */
let gamesById = new Map();
control.gameSelect.addEventListener('change', () => boundSeatsToSelection(gamesById));
// The sentence about the machine-fill option comes from the module that records WHY there is no
// such control, so the page cannot drift into offering one.
byId('fillNote').textContent = FILL_EMPTY_SEATS_NOTE;

let state = initialState(readCode(location.href), Date.now());

function paint() {
  render(document, ui, plan(state, Date.now()));
}

/** A thrown request is still a sentence on the page: nobody is ever left with a spinner. */
async function guarded(promise) {
  try {
    return await promise;
  } catch (error) {
    return {
      ok: false, token: null, username: null,
      error: 'Could not reach the service (' + ((error && error.message) || 'no answer') + ').',
    };
  }
}

/** Take a session from a sign-in or a sign-up, or say why not. */
function adopt(result, failureOf) {
  if (result && result.ok) {
    state = withSession(state, { token: result.token, username: result.username });
    return;
  }
  state = {
    ...state, step: STEPS.SIGN_IN, session: null, failure: failureOf,
    message: (result && result.error) || 'That did not work. Try again.',
  };
}

/* ---- the code, typed by hand when the link carried none ---- */
ui.codeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = byId('codeInput');
  state = withCode(state, input.value, Date.now());
  if (state.step === STEPS.SIGN_IN) {
    input.value = '';
    byId('signInName').focus();
  }
  paint();
});

/* ---- sign in ---- */
byId('signInForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = byId('signInName').value;
  const password = byId('signInPassword').value;
  byId('signInPassword').value = '';
  adopt(await guarded(signIn((url, init) => fetch(url, init), name, password)), 'sign-in');
  paint();
});

/* ---- create an account, through the same public route the game client already uses ---- */
byId('registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = byId('registerName').value;
  const email = byId('registerEmail').value;
  const password = byId('registerPassword').value;
  byId('registerPassword').value = '';
  adopt(await guarded(registerAccount((url, init) => fetch(url, init), name, email, password)), 'register');
  paint();
});

/* ---- approve ---- */
ui.approveButton.addEventListener('click', async () => {
  const held = state.session;
  const code = state.code;
  state = working(state);
  paint();
  let result;
  try {
    result = await approveCode((url, init) => fetch(url, init), held, code);
  } catch (error) {
    result = { outcome: 'unreachable', error: 'Could not reach the service (' + ((error && error.message) || 'no answer') + ').' };
  }
  state = result.outcome === 'approved'
    ? approved(state, result)
    : failed(state, result.outcome, result.error, result.detail, Date.now());
  paint();
  // A newly paired screen gets its control panel populated straight away, so the person who
  // approved it is not left looking at an empty box wondering what to do next.
  loadControl();
});

ui.signOutButton.addEventListener('click', () => {
  state = signedOut(state);
  paint();
});

/* ---- the post-pairing control panel ----
 *
 * This is DOM wiring over decisions that live in pair.mjs. The game list is built only from
 * rows the control functions already validated; nothing is invented, and no credential is ever
 * placed in an element — the values here are table codes and game ids, which are public.
 */
async function safe(promise) {
  try {
    return await promise;
  } catch (error) {
    return { ok: false, error: 'Could not reach the service (' + ((error && error.message) || 'no answer') + ').' };
  }
}

/** Fill a <select> from validated rows. An empty list clears it; it never keeps a stale option. */
function fillSelect(select, rows, valueOf, labelOf) {
  select.textContent = '';
  for (const row of rows) {
    const option = document.createElement('option');
    option.value = valueOf(row);
    option.textContent = labelOf(row);
    select.appendChild(option);
  }
}

/** Read the games the service can host once, for the create form. Failure is a sentence, not a void. */
async function loadControl() {
  if (state.step !== STEPS.PAIRED || !state.session) return;
  const games = await safe(listGames((url, init) => fetch(url, init)));
  if (games.ok) {
    state = gamesLoaded(state, games.games);
    // ONLY THE GAMES THE SERVICE REPORTS AS AVAILABLE CAN BE CHOSEN, and the picker says plainly
    // that anything absent cannot be opened here. A game the manifest lists but has switched off is
    // shown as an unavailable OPTION with the service's own reason rather than dropped, so a reader
    // can tell "this service does not host that game" from "the phone is broken".
    const offered = games.games.filter((g) => g.available);
    fillSelect(control.gameSelect, offered, (g) => g.gameId, (g) => g.gameId
      + (g.ruleVersion ? ' — rules v' + g.ruleVersion : ''));
    /*
     * THE SEAT BOX IS BOUND TO THE GAME THAT IS SELECTED, AND RE-BOUND WHENEVER THAT CHANGES. This is
     * the one place the manifest's own `seats` block reaches a control: a fixed-size game admits
     * exactly its own seats, so a box still offering sixteen for it would be offering a table the
     * module refuses. The rows carry `gameId` AND `seats` (see `listGames`), so nothing here names a
     * game.
     */
    gamesById = new Map(offered.map((g) => [g.gameId, g]));
    boundSeatsToSelection(gamesById);
    const off = games.games.filter((g) => !g.available);
    control.gamesNote.textContent = offered.length === 0
      ? 'This table service is not offering any game right now, so no table can be opened.'
      : 'Only the games this table service hosts can be opened. A game this site shows but the '
        + 'service does not host cannot have a table, so it is not offered here and no request is '
        + 'made for it.'
        + (off.length
          ? ' Not available here: ' + off.map((g) => g.gameId + ' (' + g.unavailableReason + ')').join('; ') + '.'
          : '');
    if (offered.length === 0) control.createButton.disabled = true;
  } else {
    state = controlFailed(state, games.error);
    control.gamesNote.textContent = games.error;
    control.createButton.disabled = true;
  }
  paint();
}

ui.createTableForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (state.step !== STEPS.PAIRED || !state.session) return;
  const gameId = control.gameSelect.value;
  /*
   * THE TWO NUMBERS ARE READ AS NUMBERS, AND AN EMPTY FIELD MEANS "NOT SAID" RATHER THAN ZERO.
   * `Number('')` is 0, which the service would refuse as a table of no seats, so an empty box is
   * passed as `undefined` and the service's own default applies. This is the one place a blank
   * input could otherwise become a value nobody chose.
   */
  const seats = control.seatsInput.value.trim() === '' ? undefined : Number(control.seatsInput.value);
  const wait = control.waitInput.value.trim() === '' ? undefined : Number(control.waitInput.value);
  const result = await safe(createTable((url, init) => fetch(url, init), state.session, {
    gameId,
    ...(seats === undefined ? {} : { capacity: seats }),
    ...(wait === undefined ? {} : { waitSeconds: wait }),
  }));
  state = result.ok ? tableChosen(state, result.table) : controlFailed(state, result.error);
  paint();
});

ui.selectTableForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (state.step !== STEPS.PAIRED || !state.session) return;
  const code = control.selectCodeInput.value;
  control.selectCodeInput.value = '';
  const result = await safe(selectTable((url, init) => fetch(url, init), state.session, code));
  state = result.ok ? tableChosen(state, result.table) : controlFailed(state, result.error);
  paint();
});

/* ---- the clock ---- */
paint();
setInterval(paint, 1000);

/*
 * A LAST LINE OF DEFENCE, MEASURED RATHER THAN TRUSTED. If anything at all ever put a
 * credential-shaped string into this document, the page says so rather than leaving it there
 * silently — and the browser check in the report asserts the same property from outside. It
 * reads the document's own text, so it cannot be fooled by which element was used.
 */
setInterval(() => {
  const text = document.body ? (document.body.innerText || document.body.textContent || '') : '';
  if (looksLikeCredential(text)) {
    ui.message.textContent = 'This page refused to display a credential. Reload and sign in again.';
  }
}, 2000);
