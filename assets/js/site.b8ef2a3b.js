/*
 * LastiKadi — lastikadi.com
 *
 * Deliberately tiny and dependency-free. This script:
 *   - sets no cookies, stores nothing, and sends nothing anywhere;
 *   - collects no analytics and loads no third-party resource;
 *   - degrades to a fully usable page if it never runs at all.
 *
 * The only behaviour here is the small-screen navigation disclosure. Everything
 * else on the page is plain HTML and CSS.
 */
(() => {
  'use strict';

  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');
  if (!toggle || !nav) return;

  const mq = window.matchMedia('(width <= 46rem)');

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.dataset.open = String(open);
  };

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  // Below the breakpoint the panel is a disclosure; above it the nav is always
  // visible, so the state is forced closed and aria-expanded is removed rather
  // than left lying about a control that is not on screen.
  const sync = () => {
    if (mq.matches) {
      if (!isOpen()) nav.removeAttribute('data-open');
    } else {
      setOpen(false);
      toggle.setAttribute('aria-expanded', 'false');
    }
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  // Escape closes and returns focus to the control that opened it.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Following an in-page link should not leave the panel covering the target.
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a') && mq.matches) setOpen(false);
  });

  // A tap outside the panel dismisses it, matching platform behaviour. The check
  // is "not the panel and not the control" rather than "inside the header",
  // because the dimming scrim is a pseudo-element of the header: a click landing
  // on it reports the header as its target, and testing for the header would
  // swallow the tap instead of closing the menu.
  document.addEventListener('click', (e) => {
    if (!isOpen() || !mq.matches) return;
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    setOpen(false);
  });

  mq.addEventListener('change', sync);
  sync();
})();
