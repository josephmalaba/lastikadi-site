/**
 * feedback-client.js — the durable feedback channel, from inside a game client.
 *
 * The contract, as published by the API branch:
 *
 *   POST /feedback   (authenticated)
 *     body { gameId, gameIdVersion?, tableRef?, category, message, consent }
 *     -> 201 { feedbackId, status, receivedAt }
 *     400 if consent is not true or the message is empty or overlong
 *     401 if unauthenticated
 *     429 if rate-limited
 *
 * A support agent reads and triages submissions in the support console.
 *
 * Three decisions worth stating, because each of them is a place this could go
 * wrong in a way that looks fine:
 *
 *   1. CONSENT IS NEVER ASSUMED. The box starts unticked, is never set by script,
 *      and Submit refuses without it — the client checks it locally as well as the
 *      service checking it, so a mis-wired button cannot post a note nobody agreed
 *      to send. This mirrors the landing page, whose whole feedback instrument
 *      exists because consent has to be a real choice rather than a formality.
 *
 *   2. NO PRIVATE GAME STATE LEAVES THE PAGE. The payload carries an identifier for
 *      the game, an optional version and table reference, a category and the words
 *      the player typed. It does not carry a hand, a card, a seat, a score or a
 *      move, and the module has no access to the game host at all. That is a design
 *      constraint rather than a promise: there is nothing here to leak.
 *
 *   3. UNSIGNED IS SAID, NOT FAKED. The endpoint is authenticated. A client with no
 *      session says so and does not post, because a request that is certain to come
 *      back 401 is not a submission — it is a lie told to the player's face. Once
 *      the platform has a sign-in, the same control starts working with no edit.
 *
 * The endpoint is NOT DEPLOYED. Nothing here has been run against a live service:
 * the report that accompanies this work states that plainly, and the failure states
 * below are exercised against a stub in tests/feedback-client.test.mjs.
 *
 * Classic script rather than a module, for the same reason as app-prompt.js: the
 * note has to survive a failure in the client's own module script.
 */
(function () {
  'use strict';

  /** Where the API lives. Same origin the clients already use. */
  var API_BASE = 'https://api.lastikadi.com';

  /** The service's own limit; enforced here first so a long note is not lost. */
  var MAX_MESSAGE = 2000;

  /** The session key a signed-in player's client is expected to carry. */
  var SESSION_KEY = 'lastikadi.session';

  /** Categories the service accepts. The first is the default and the plainest. */
  var CATEGORIES = [
    { id: 'page-or-client', label: 'Something on this screen is wrong' },
    { id: 'gameplay', label: 'Something about how the game plays' },
    { id: 'accessibility', label: 'Something got in the way of playing' },
    { id: 'other', label: 'Something else' },
  ];

  var TITLE = 'Tell us what you found';
  var BLURB = 'This goes to the team that builds the game, not to a marketing list. '
    + 'Only what you type is sent: no cards, no moves, no score.';

  var $ = function (id) { return document.getElementById(id); };

  /**
   * The rules for the component, as text.
   *
   * Not injected: `_headers` serves `style-src 'self'` with no 'unsafe-inline', so
   * an injected <style> is a rule a browser refuses to apply. Each client carries
   * this block inside its own <style>, and tests/feedback-client.test.mjs compares
   * the copies against this constant.
   */
  var STYLE = [
    '.feedback{border-bottom:1px solid var(--line,#3A5346);background:var(--panel,#1F332A);color:var(--cream,#F2E9D6)}',
    '.feedback[hidden]{display:none}',
    '.feedback__summary{cursor:pointer;list-style:none;padding:10px 14px;font-weight:650;',
    'min-height:var(--tap,2.75rem);display:flex;align-items:center;gap:8px}',
    '.feedback__summary::-webkit-details-marker{display:none}',
    '.feedback__summary::after{content:"+";margin-left:auto;color:var(--gold,#D9A93C)}',
    '.feedback[open] .feedback__summary::after{content:"\\2212"}',
    '.feedback__body{padding:0 14px 14px;max-width:60ch}',
    '.feedback__blurb{margin:0 0 10px;color:var(--dim,#9FB3A6);font-size:14px;line-height:1.5}',
    '.feedback__row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:10px}',
    '.feedback__row label{font-size:13px;color:var(--dim,#9FB3A6)}',
    '.feedback select,.feedback textarea,.feedback input[type=text]{font:inherit;color:var(--cream,#F2E9D6);',
    'background:#0B1410;border:1px solid var(--line,#3A5346);border-radius:8px;padding:8px 10px;max-width:100%}',
    '.feedback textarea{width:100%;min-height:6rem;resize:vertical}',
    '.feedback__consent{display:flex;gap:8px;align-items:flex-start;font-size:14px;color:var(--dim,#9FB3A6)}',
    '.feedback__actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}',
    '.feedback__send{font:inherit;border:1px solid var(--gold,#D9A93C);background:var(--gold,#D9A93C);',
    'color:#20170A;border-radius:8px;padding:10px 16px;font-weight:650;cursor:pointer;',
    'min-height:var(--tap,2.75rem)}',
    '.feedback__send[disabled]{opacity:.45;cursor:not-allowed}',
    '.feedback__status{margin:0;font-size:14px;min-height:1.4em}',
    '.feedback__status.ok{color:var(--ok,#5AA469)}',
    '.feedback__status.bad{color:var(--danger,#C4553F)}',
    '.feedback__status.wait{color:var(--gold,#D9A93C)}',
    '.feedback__note{margin:8px 0 0;font-size:13px;color:var(--dim,#9FB3A6)}',
  ].join('');

  /* ----------------------------------------------------------- pure helpers */

  /**
   * The message as the service will judge it: trimmed, and rejected when empty.
   *
   * Returns { ok, reason, message }. `reason` is a stable identifier so a test can
   * assert the decision rather than the wording.
   */
  function validateMessage(text) {
    var message = typeof text === 'string' ? text.trim() : '';
    if (!message) return { ok: false, reason: 'empty', message: '' };
    if (message.length > MAX_MESSAGE) return { ok: false, reason: 'too-long', message: message };
    return { ok: true, reason: null, message: message };
  }

  /**
   * The request body.
   *
   * Built from named fields only, so there is no way for a caller to smuggle a game
   * object in: the shape of what leaves the page is fixed here. `consent` is carried
   * as submitted rather than forced true, because the service checking it is the
   * point, and `gameId` is the registry identity — a string such as "go" — matching
   * the value every other surface uses.
   */
  function buildPayload(input) {
    var payload = {
      gameId: input.gameId,
      category: input.category,
      message: input.message,
      consent: input.consent === true,
    };
    if (input.gameIdVersion) payload.gameIdVersion = input.gameIdVersion;
    if (input.tableRef) payload.tableRef = input.tableRef;
    return payload;
  }

  /**
   * Can this submission be made at all?
   *
   * Ordered so the first thing a player reads is the thing they can act on. The
   * consent decision comes before the session check because consent is the one the
   * player controls here and now.
   */
  function preflight(input) {
    var check = validateMessage(input.message);
    if (!check.ok) {
      return check.reason === 'empty'
        ? { ok: false, reason: 'empty', text: 'Write what you found before sending it.' }
        : { ok: false, reason: 'too-long', text: 'That note is longer than the service accepts. Shorten it and try again.' };
    }
    if (input.consent !== true) {
      return { ok: false, reason: 'consent', text: 'Tick the box to confirm you want to send this. Nothing is sent without it.' };
    }
    if (!input.signedIn) {
      return {
        ok: false,
        reason: 'unsigned',
        text: 'Sending feedback needs a LastiKadi account, and this browser is not signed in. '
          + 'Nothing has been sent. The note you typed is still here.',
      };
    }
    return { ok: true, reason: null, text: 'Sending…' };
  }

  /** Fold an HTTP status into something a player can read. */
  function describeStatus(status) {
    switch (status) {
      case 201:
      case 200:
        return { ok: true, text: 'Thank you — that reached the team.' };
      case 400:
        return { ok: false, text: 'The service refused that note: it needs to be non-empty and under the length limit, with the box ticked.' };
      case 401:
        return { ok: false, text: 'This browser is not signed in, so the note was not accepted. Sign in and send it again.' };
      case 429:
        return { ok: false, text: 'You have sent a few notes already. Wait a little and try again.' };
      default:
        if (status >= 500) return { ok: false, text: 'The feedback service is having trouble (error ' + status + '). Nothing was sent; your note is still here.' };
        return { ok: false, text: 'The feedback service refused the note (' + status + '). Nothing was sent; your note is still here.' };
    }
  }

  /**
   * Is this browser signed in?
   *
   * The token's *presence* is the whole question, and its value is never read,
   * copied into the payload, logged or rendered. The store is injected so a test can
   * drive both answers without a browser.
   */
  function detectSession(storage) {
    try {
      if (!storage) return false;
      var raw = storage.getItem(SESSION_KEY);
      if (!raw || typeof raw !== 'string') return false;
      // A presence check plus a shape check. The value is never read for anything
      // else, and it is never copied out of storage. The shape matters because a
      // stored "undefined" or "null" — which a broken sign-out leaves behind — is
      // not a session, and treating one as a session produces a 401 the player
      // cannot explain. No real token is shorter than this or outside this alphabet.
      return raw.length >= 16 && /^[A-Za-z0-9._~+/=-]+$/.test(raw);
    } catch (e) {
      return false;
    }
  }

  /**
   * The submitter.
   *
   * @param {object} deps
   *   request - (url, init) => Promise<Response>. Injected so a stub can answer 201,
   *             400, 401 or 429 without a network.
   *   storage - session store; defaults to window.localStorage.
   */
  function createFeedbackClient({ request, storage } = {}) {
    if (typeof request !== 'function') throw new Error('createFeedbackClient needs a request function');

    return {
      isSignedIn() {
        return detectSession(storage === undefined ? safeStorage() : storage);
      },

      /**
       * Send one note.
       *
       * Returns { ok, status, text } and never throws: the caller is a click
       * handler, and an unhandled rejection there would leave the player looking at
       * a button that did nothing.
       */
      async send(input) {
        var signedIn = this.isSignedIn();
        var gate = preflight({ ...input, signedIn });
        if (!gate.ok) return { ok: false, reason: gate.reason, text: gate.text, sent: false };

        var payload = buildPayload(input);
        var response;
        try {
          response = await request(API_BASE + '/feedback', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (e) {
          return { ok: false, reason: 'unreachable', sent: false, text: 'The feedback service could not be reached. Nothing was sent; your note is still here.' };
        }

        var status = response && typeof response.status === 'number' ? response.status : 0;
        var verdict = describeStatus(status);
        return { ok: verdict.ok, status, reason: verdict.ok ? null : 'refused', sent: verdict.ok, text: verdict.text };
      },
    };
  }

  function safeStorage() {
    try {
      var s = window.localStorage;
      var probe = '__lastikadi_probe__';
      s.setItem(probe, '1');
      s.removeItem(probe);
      return s;
    } catch (e) {
      return null;
    }
  }

  /* ------------------------------------------------------------- the view */

  /**
   * Build the disclosure.
   *
   * A <details> rather than a modal: collapsed by default so it cannot obstruct
   * play, opened by the player when they have something to say, and keyboard and
   * screen-reader operable without any script maintaining focus. When it is open,
   * it sits above the header rather than over the board, so a hand is never covered.
   */
  function build(doc, config, client) {
    var box = doc.createElement('details');
    box.className = 'feedback';
    box.id = 'feedback';

    var summary = doc.createElement('summary');
    summary.className = 'feedback__summary';
    summary.textContent = TITLE;
    box.appendChild(summary);

    var body = doc.createElement('div');
    body.className = 'feedback__body';

    var blurb = doc.createElement('p');
    blurb.className = 'feedback__blurb';
    blurb.textContent = BLURB;
    body.appendChild(blurb);

    var categoryRow = doc.createElement('div');
    categoryRow.className = 'feedback__row';
    var categoryLabel = doc.createElement('label');
    categoryLabel.setAttribute('for', 'feedbackCategory');
    categoryLabel.textContent = 'What is it about?';
    var category = doc.createElement('select');
    category.id = 'feedbackCategory';
    for (var i = 0; i < CATEGORIES.length; i += 1) {
      var option = doc.createElement('option');
      option.value = CATEGORIES[i].id;
      option.textContent = CATEGORIES[i].label;
      category.appendChild(option);
    }
    categoryRow.appendChild(categoryLabel);
    categoryRow.appendChild(category);
    body.appendChild(categoryRow);

    var messageLabel = doc.createElement('label');
    messageLabel.setAttribute('for', 'feedbackMessage');
    messageLabel.className = 'feedback__blurb';
    messageLabel.textContent = 'Your note';
    body.appendChild(messageLabel);

    var message = doc.createElement('textarea');
    message.id = 'feedbackMessage';
    message.setAttribute('maxlength', String(MAX_MESSAGE));
    message.setAttribute('rows', '4');
    body.appendChild(message);

    var consentRow = doc.createElement('div');
    consentRow.className = 'feedback__row';
    var consent = doc.createElement('input');
    consent.type = 'checkbox';
    consent.id = 'feedbackConsent';
    // Never pre-ticked, and never set by script anywhere below. Consent is the
    // player's to give.
    consent.checked = false;
    var consentLabel = doc.createElement('label');
    consentLabel.setAttribute('for', 'feedbackConsent');
    consentLabel.className = 'feedback__consent';
    consentLabel.textContent = 'I want to send this note to the LastiKadi team. Nothing is sent until I press Send.';
    consentRow.appendChild(consent);
    consentRow.appendChild(consentLabel);
    body.appendChild(consentRow);

    var actions = doc.createElement('div');
    actions.className = 'feedback__actions';
    var send = doc.createElement('button');
    send.className = 'feedback__send';
    send.type = 'button';
    send.id = 'feedbackSend';
    send.textContent = 'Send';
    actions.appendChild(send);
    var status = doc.createElement('p');
    status.className = 'feedback__status';
    status.id = 'feedbackStatus';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    actions.appendChild(status);
    body.appendChild(actions);

    var note = doc.createElement('p');
    note.className = 'feedback__note';
    note.id = 'feedbackSession';
    body.appendChild(note);
    box.appendChild(body);

    /** The session line, refreshed each time the box is opened. */
    function reflectSession() {
      note.textContent = client.isSignedIn()
        ? 'Sending uses the account this browser is signed in with. Your note is the only thing sent.'
        : 'This browser is not signed in, and sending feedback needs an account. You can still write the note; it will not be sent until you are signed in.';
      return client.isSignedIn();
    }
    reflectSession();
    box.addEventListener('toggle', reflectSession);

    send.addEventListener('click', async function () {
      status.className = 'feedback__status wait';
      status.textContent = 'Sending…';
      var result = await client.send({
        gameId: config.gameId,
        gameIdVersion: config.gameIdVersion,
        tableRef: config.tableRef,
        category: category.value,
        message: message.value,
        consent: consent.checked,
      });
      status.className = 'feedback__status ' + (result.ok ? 'ok' : result.reason === 'unreachable' ? 'bad' : 'bad');
      status.textContent = result.text;
      // The note is cleared only on a confirmed 201; anything else leaves the words
      // where the player can retry them.
      if (result.ok) {
        message.value = '';
        consent.checked = false;
      }
    });

    return box;
  }

  /**
   * Boot.
   *
   * @param {Document} doc
   * @param {object} config { gameId, gameIdVersion?, tableRef?, anchorId? }
   * @param {object} deps   { request, storage } — injectable for tests
   */
  function mount(doc, config, deps) {
    var host = doc.getElementById('feedbackConfig');
    var anchorId = config.anchorId || (host && host.getAttribute('data-feedback-anchor')) || null;
    var anchor = anchorId ? doc.getElementById(anchorId) : null;
    if (!anchor || !anchor.parentNode) return null;
    if (doc.getElementById('feedback')) return doc.getElementById('feedback');
    // The game is named by the config, never by the DOM: a note about the wrong game
    // is worse than no note, so a config with no gameId is refused rather than sent.
    if (typeof config.gameId !== 'string' || !config.gameId) return null;

    var client = deps && deps.client
      ? deps.client
      : createFeedbackClient({
        request: (deps && deps.request) || function (url, init) { return fetch(url, init); },
        storage: deps && deps.storage !== undefined ? deps.storage : undefined,
      });
    var box = build(doc, config, client);
    anchor.parentNode.insertBefore(box, anchor);
    return box;
  }

  var api = {
    API_BASE: API_BASE,
    MAX_MESSAGE: MAX_MESSAGE,
    SESSION_KEY: SESSION_KEY,
    CATEGORIES: CATEGORIES,
    TITLE: TITLE,
    BLURB: BLURB,
    STYLE: STYLE,
    validateMessage: validateMessage,
    buildPayload: buildPayload,
    preflight: preflight,
    describeStatus: describeStatus,
    detectSession: detectSession,
    createFeedbackClient: createFeedbackClient,
    build: build,
    mount: mount,
  };

  if (typeof window !== 'undefined') window.LastiKadiFeedback = api;

  if (typeof document !== 'undefined') {
    var boot = function () {
      var host = document.getElementById('feedbackConfig');
      if (!host) return;
      try {
        var config = JSON.parse(host.getAttribute('data-feedback') || '{}');
        config.anchorId = host.getAttribute('data-feedback-anchor') || null;
        mount(document, config, {});
      } catch (e) {
        // A malformed config must not break the game. Feedback is a courtesy.
      }
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  }
})();
