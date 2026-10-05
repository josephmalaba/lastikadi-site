/**
 * pair/page.mjs — the wiring for the page a phone opens to approve a screen.
 *
 * THIS FILE DECIDES NOTHING. Every decision — what the code is, whether a session is held,
 * what a service answer means, what may be shown — lives in `./pair.67b89d3b.mjs` and is tested there
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
  STEPS, approved, approveCode, failed, initialState, looksLikeCredential, plan, readCode,
  registerAccount, render, signIn, signedOut, withCode, withSession, working,
} from './pair.67b89d3b.mjs';

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
};

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
});

ui.signOutButton.addEventListener('click', () => {
  state = signedOut(state);
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
