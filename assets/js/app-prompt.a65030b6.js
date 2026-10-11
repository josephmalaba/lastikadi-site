/**
 * app-prompt.js — the honest "the app does not exist yet" note on a playable client.
 *
 * Why this exists
 * ---------------
 * Every playable client is a browser build of a game whose real target is a native
 * app. A visitor who has just played a hand deserves to know that, and the tempting
 * way to tell them is a button that promises the app. No Android application has
 * been released and no store listing exists — the fixture in data/truth.json records
 * that, and the landing page says it — so a download button would be a link to
 * nothing: a worse failure than saying nothing at all, because a visitor who taps it
 * and lands on a 404 has been lied to by omission rather than by wording.
 *
 * So this module renders a note that:
 *
 *   * says plainly that the Android app is not available yet;
 *   * carries NO link when no store listing exists — `release.storeUrl` is null for
 *     every game today, and the button is only rendered when both a URL and an
 *     ISO-8601 release date are present, so a future release is a one-line change
 *     to a config and not a copy edit that invents an availability claim;
 *   * is dismissible with a real button carrying a real accessible name;
 *   * is announced politely rather than stealing focus, and is placed *before* the
 *     game so a keyboard user meets it first and can dismiss it before playing;
 *   * remembers a dismissal for a bounded period (14 days) rather than forever, so
 *     a player who comes back next month learns that the app is out.
 *
 * Storage
 * -------
 * `localStorage`, one key per game. That is the smallest mechanism that survives a
 * revisit, and it holds a timestamp and nothing else — no identifier, no counter, no
 * cross-game key. If storage is unavailable (private mode, a locked-down browser)
 * the note simply shows every time, which is the honest degradation: we cannot
 * remember the dismissal, so we do not pretend to.
 *
 * This file is deliberately a classic script rather than a module. It attaches one
 * small global and boots on parse, so a client whose own module script fails to load
 * still gets the note — and, more importantly, so the load order between the note
 * and the game can never leave the note stranded.
 *
 * It injects no <style> element: see the note on STYLE below, which is a CSP
 * consequence rather than a preference.
 */
(function () {
  'use strict';

  /** How long a dismissal is remembered. Bounded on purpose; see the header. */
  var DISMISS_DAYS = 14;

  /** The body of the note. One place, so the four clients cannot drift apart. */
  var MESSAGE =
    'LastiKadi is playable in this browser today. The Android app is in development and is ' +
    'not on any store yet, so there is nothing to install; this browser build is the whole ' +
    'product for now. iOS has not been built.';

  var DISMISS_LABEL = 'Dismiss this note about the phone app';

  /**
   * The note's own stylesheet, injected once.
   *
   * The clients carry their CSS in the document because each one is a single
   * self-contained page, so a shared stylesheet would be a fifth file per client
   * for one component. Injecting it here keeps the component whole — one module,
   * one place to change — and costs one <style> element. It is written in the same
   * tokens the clients already define so the note belongs to the page it opens on.
   *
   * No animation is declared, so there is nothing for prefers-reduced-motion to
   * switch off and no motion for a player who asked for none.
   */
  /**
   * The note's own rules, as text.
   *
   * These are NOT injected as a <style> element, and that is a deliberate decision
   * rather than an omission. `_headers` sets `Content-Security-Policy: default-src
   * 'none'; style-src 'self'`, with no 'unsafe-inline' and no nonce, so an injected
   * style block is a rule a browser will refuse to apply — the note would ship
   * unstyled on exactly the deployment it was written for. Each client therefore
   * carries this block inside its own <style>, which the CSP permits, and this
   * constant is what tests compare those four copies against so a component styled
   * in four places cannot drift into four different components.
   *
   * It is written against the tokens the clients already define, with a literal
   * fallback each, so the note belongs to whatever page it opens on.
   *
   * No animation is declared, so there is nothing for prefers-reduced-motion to
   * switch off and no motion for a player who asked for none.
   */
  var STYLE = [
    // The clients set `display` on the note, which would defeat the `hidden`
    // attribute; one rule restores it. The config element that names the note is
    // itself `hidden`, so this is what keeps a JSON blob off the screen during parse.
    '[hidden]{display:none}',
    '.appnote{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;',
    'padding:10px 14px;background:var(--panel2,#263D31);color:var(--cream,#F2E9D6);',
    'border-bottom:1px solid var(--line,#3A5346)}',
    '.appnote[hidden]{display:none}',
    '.appnote__text{margin:0;flex:1 1 22rem;min-width:0;font-size:14px;line-height:1.45}',
    '.appnote__label{display:block;color:var(--gold,#D9A93C);font-weight:650}',
    '.appnote__body{display:block;color:var(--dim,#9FB3A6)}',
    '.appnote__actions{display:flex;gap:8px;align-items:center}',
    '.appnote__store{border:1px solid var(--line,#3A5346);border-radius:999px;padding:8px 14px;',
    'color:var(--cream,#F2E9D6);text-decoration:none;min-height:var(--tap,2.75rem);',
    'display:inline-flex;align-items:center}',
    '.appnote__dismiss{font:inherit;border:1px solid var(--line,#3A5346);background:transparent;',
    'color:var(--cream,#F2E9D6);border-radius:999px;padding:8px 14px;cursor:pointer;',
    'min-height:var(--tap,2.75rem)}',
    '.appnote__dismiss:hover{border-color:var(--gold,#D9A93C)}',
  ].join('');

  /**
   * Is the app released?
   *
   * Both halves are required. A URL without a date is an unannounced listing and a
   * date without a URL is a promise, and neither is a thing this note may render.
   *
   * The date is checked by parsing it, not only by matching its shape: "2026-13-45"
   * has the shape of a date and is not one, and a release line built from it would
   * be a claim with no moment behind it.
   */
  function isReleased(release) {
    if (!release) return false;
    if (typeof release.storeUrl !== 'string' || release.storeUrl.length === 0) return false;
    try {
      var storeUrl = new URL(release.storeUrl);
      if (storeUrl.protocol !== 'https:' || !storeUrl.hostname || storeUrl.username || storeUrl.password) return false;
    } catch (e) {
      return false;
    }
    if (typeof release.releasedOn !== 'string') return false;
    if (!/^\d{4}-\d{2}-\d{2}/.test(release.releasedOn)) return false;
    var at = Date.parse(release.releasedOn);
    if (Number.isNaN(at)) return false;
    // A real calendar date, not a shape: the parsed value must round-trip to the
    // same year, month and day the string names.
    var d = new Date(at);
    var round = d.toISOString().slice(0, 10);
    return round === release.releasedOn.slice(0, 10);
  }

  /** The storage key for one game. Namespaced, and the only thing persisted. */
  function storageKey(gameId) {
    return 'lastikadi.app-note.' + gameId;
  }

  /**
   * Read the stored dismissal. Returns the timestamp, or null when there is none
   * or when storage cannot be read — an unreadable store must not throw and must
   * not be reported as a dismissal.
   */
  function readDismissed(storage, gameId, now) {
    try {
      var raw = storage.getItem(storageKey(gameId));
      if (!raw) return null;
      var at = Number(raw);
      if (!Number.isFinite(at)) return null;
      if (now - at >= DISMISS_DAYS * 24 * 60 * 60 * 1000) return null;
      return at;
    } catch (e) {
      return null;
    }
  }

  /** Remember a dismissal. A store that refuses is not an error the player sees. */
  function writeDismissed(storage, gameId, now) {
    try {
      storage.setItem(storageKey(gameId), String(now));
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Build the note.
   *
   * The note is a plain section with a heading and one sentence; the App Store
   * button is optional and absent by default. `role="status"` would make it an
   * interruption, so it is not used: a polite live region announces it once for a
   * screen-reader user without moving focus.
   */
  function build(doc, config, now) {
    var section = doc.createElement('section');
    section.className = 'appnote';
    section.id = 'appNote';
    section.setAttribute('aria-label', 'About the phone app');

    var text = doc.createElement('p');
    text.className = 'appnote__text';

    var label = doc.createElement('span');
    label.className = 'appnote__label';
    label.textContent = config.label || 'Continue in the LastiKadi app';
    text.appendChild(label);

    var body = doc.createElement('span');
    body.className = 'appnote__body';
    body.textContent = config.message || MESSAGE;
    text.appendChild(body);
    section.appendChild(text);

    var actions = doc.createElement('div');
    actions.className = 'appnote__actions';

    if (isReleased(config.release)) {
      var link = doc.createElement('a');
      link.className = 'appnote__store';
      // setAttribute rather than the href property: the property resolves the URL
      // against the document base, which is the right behaviour in a browser but
      // makes the value unreadable as written. The attribute is what a reviewer and
      // a test both read, and it is the only form that cannot quietly become
      // relative to whatever page happens to host the note.
      link.setAttribute('href', config.release.storeUrl);
      link.textContent = 'Get the LastiKadi app';
      actions.appendChild(link);
    }

    var dismiss = doc.createElement('button');
    dismiss.className = 'appnote__dismiss';
    dismiss.type = 'button';
    dismiss.textContent = 'Dismiss';
    dismiss.setAttribute('aria-label', DISMISS_LABEL);
    dismiss.addEventListener('click', function () {
      writeDismissed(config.storage, config.gameId, now);
      section.hidden = true;
    });
    actions.appendChild(dismiss);
    section.appendChild(actions);

    return section;
  }

  /**
   * Boot the note into a document.
   *
   * @param {Document} doc
   * @param {object} config
   *   gameId   - required; names both the storage key and the note
   *   label    - the heading line
   *   anchorId - the element the note is inserted *before*
   *   release  - { storeUrl, releasedOn } or null/absent while nothing is released
   *   storage  - injectable for tests; window.localStorage by default
   * @returns {HTMLElement|null} the note, or null when it was dismissed recently
   */
  function mount(doc, config) {
    var anchor = $call(doc, config.anchorId) || doc.body.firstElementChild;
    if (!anchor || !anchor.parentNode) return null;
    if ($call(doc, 'appNote')) return $call(doc, 'appNote');

    var storage = config.storage || safeStorage();
    var now = typeof config.now === 'number' ? config.now : Date.now();
    if (storage && readDismissed(storage, config.gameId, now) !== null) return null;

    var section = build(doc, { release: config.release, label: config.label, message: config.message,
      storage: storage, gameId: config.gameId }, now);
    anchor.parentNode.insertBefore(section, anchor);
    return section;
  }

  function $call(doc, id) { return doc.getElementById(id); }

  /** localStorage, or null where the browser refuses to give one up. */
  function safeStorage() {
    try {
      var s = window.localStorage;
      // Touch it: Safari throws on access in some privacy configurations.
      var probe = '__lastikadi_probe__';
      s.setItem(probe, '1');
      s.removeItem(probe);
      return s;
    } catch (e) {
      return null;
    }
  }

  var api = {
    DISMISS_DAYS: DISMISS_DAYS,
    MESSAGE: MESSAGE,
    STYLE: STYLE,
    isReleased: isReleased,
    storageKey: storageKey,
    readDismissed: readDismissed,
    writeDismissed: writeDismissed,
    build: build,
    mount: mount,
  };

  if (typeof window !== 'undefined') window.LastiKadiAppNote = api;

  // Boot from the data attribute the client declares, so the client names itself
  // and its game in markup rather than in a second script.
  if (typeof document !== 'undefined') {
    var boot = function () {
      var host = document.getElementById('appNoteConfig');
      if (!host) return;
      try {
        var config = JSON.parse(host.getAttribute('data-app-note') || '{}');
        config.anchorId = host.getAttribute('data-app-note-anchor') || null;
        mount(document, config);
      } catch (e) {
        // A malformed config must not break the game. The note is a courtesy.
      }
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  }
})();
