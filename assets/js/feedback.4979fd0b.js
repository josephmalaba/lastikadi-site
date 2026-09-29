/*
 * feedback.js — first-party, consent-first page and preview-trial signals.
 *
 * What this file does:
 *   - keeps an in-memory-only funnel: arrived, started, played, finished/left;
 *   - counts only after the visitor ticks the consent box, never before;
 *   - sends nothing anywhere by itself; the only delivery is a mailto link
 *     the visitor opens in their own mail app and may edit or discard;
 *   - stores nothing: no cookies, no local or session storage, no cache
 *     entries, no network calls of any kind.
 *
 * What this file does not do:
 *   - no third-party requests, no pixels, no identifiers;
 *   - no personal data: aggregate counters only, never an address or handle;
 *   - degrades to plain mailto links when scripting is off.
 */

const TOPICS = {
  'page-clear': {
    subject: 'LastiKadi page feedback - clear',
    intro: 'Topic: page was clear',
    prompt: 'What I saw:',
  },
  'page-confusing': {
    subject: 'LastiKadi page feedback - confusing',
    intro: 'Topic: page was confusing',
    prompt: 'What confused me:',
  },
  'page-wrong': {
    subject: 'LastiKadi page feedback - wrong',
    intro: 'Topic: something is wrong',
    prompt: 'What is wrong:',
  },
};

const MAIL_TO = 'admin@lastikadi.com';
const ORDER = ['arrived', 'started', 'played', 'finished'];

export function createFeedbackState() {
  return {
    consent: false,
    counts: { arrived: 0, started: 0, played: 0, finished: 0 },
    playedSeconds: 0,
  };
}

export function setConsent(state, on) {
  state.consent = on === true;
  if (!state.consent) resetCounts(state);
  return state.consent;
}

export function resetCounts(state) {
  state.counts.arrived = 0;
  state.counts.started = 0;
  state.counts.played = 0;
  state.counts.finished = 0;
  state.playedSeconds = 0;
}

function orderIndex(name) {
  return ORDER.indexOf(name);
}

/*
 * Record one funnel step. Steps before consent are dropped. A step later in
 * the funnel needs the step before it to have happened at least once, so a
 * finished ping can never appear without a start. Returns true when counted.
 */
export function recordTrialEvent(state, name, seconds) {
  if (!state || state.consent !== true) return false;
  const at = orderIndex(name);
  if (at < 0) return false;
  if (at > 0) {
    const prev = ORDER[at - 1];
    if ((state.counts[prev] ?? 0) < 1) return false;
  }
  state.counts[name] += 1;
  if (name === 'played' && typeof seconds === 'number' && seconds > 0) {
    state.playedSeconds += seconds;
  }
  return true;
}

/* Aggregate counters only. There is deliberately no identity field to read. */
export function summarize(state) {
  return {
    arrived: state.counts.arrived,
    started: state.counts.started,
    played: state.counts.played,
    playedSeconds: state.playedSeconds,
    finished: state.counts.finished,
  };
}

export function summarizeText(state) {
  const s = summarize(state);
  return (
    `Trial counts (this visit only): arrived ${s.arrived}, ` +
    `started ${s.started}, played ${s.played} ` +
    `(${s.playedSeconds}s), finished or left ${s.finished}`
  );
}

export function buildMailto(topic) {
  const t = TOPICS[topic] ?? TOPICS['page-confusing'];
  const body = `${t.intro}\n${t.prompt} \n\nTrial counts (this visit only): not counted unless you ticked the box.`;
  return (
    `mailto:${MAIL_TO}` +
    `?subject=${encodeURIComponent(t.subject)}` +
    `&body=${encodeURIComponent(body)}`
  );
}

export function mailtoWithCounts(topic, state) {
  const t = TOPICS[topic] ?? TOPICS['page-confusing'];
  const body = `${t.intro}\n${t.prompt} \n\n${summarizeText(state)}`;
  return (
    `mailto:${MAIL_TO}` +
    `?subject=${encodeURIComponent(t.subject)}` +
    `&body=${encodeURIComponent(body)}`
  );
}

/* Page wiring. Kept separate from the pure counters above so tests can
 * exercise the funnel without a document. Runs only in a browser. */
function wire(documentRef, windowRef) {
  const consentBox = documentRef.getElementById('feedbackConsent');
  const status = documentRef.getElementById('trialStatus');
  const links = [...documentRef.querySelectorAll('a[data-feedback-topic]')];
  if (!consentBox || links.length === 0) return;

  const state = createFeedbackState();
  const spans = {
    arrived: documentRef.getElementById('trialArrived'),
    started: documentRef.getElementById('trialStarted'),
    played: documentRef.getElementById('trialPlayed'),
    finished: documentRef.getElementById('trialFinished'),
  };

  const paint = () => {
    const s = summarize(state);
    if (spans.arrived) spans.arrived.textContent = String(s.arrived);
    if (spans.started) spans.started.textContent = String(s.started);
    if (spans.played) spans.played.textContent = String(s.played);
    if (spans.finished) spans.finished.textContent = String(s.finished);
    for (const a of links) {
      const topic = a.getAttribute('data-feedback-topic');
      a.setAttribute('href', state.consent ? mailtoWithCounts(topic, state) : buildMailto(topic));
    }
    if (status) {
      status.textContent = state.consent
        ? `${summarizeText(state)}. These counts stay on this page unless you send them.`
        : 'Counting starts only after you tick the box above. Unticking stops it and clears the counts.';
    }
  };

  let playedTimer = null;
  consentBox.addEventListener('change', () => {
    setConsent(state, consentBox.checked);
    if (state.consent) {
      recordTrialEvent(state, 'arrived');
      if (playedTimer) windowRef.clearTimeout(playedTimer);
      playedTimer = windowRef.setTimeout(() => {
        recordTrialEvent(state, 'played', 10);
        paint();
      }, 10000);
    } else if (playedTimer) {
      windowRef.clearTimeout(playedTimer);
      playedTimer = null;
    }
    paint();
  });

  for (const a of links) {
    a.addEventListener('click', () => {
      if (!state.consent) return;
      recordTrialEvent(state, 'started');
      recordTrialEvent(state, 'finished');
      paint();
    });
  }

  paint();
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  wire(document, window);
}
