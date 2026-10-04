/**
 * play/boot.mjs — the one thing that must never be stale.
 *
 * THE DEFECT THIS EXISTS FOR, measured rather than reasoned about:
 *
 *   $ curl -sI https://lastikadi.com/play/ | grep -i cache-control
 *   Cache-Control: max-age=600
 *
 * Every module this client loads carries a content tag in its name (`host.e30228b1.mjs`,
 * `identity.4a23d912.mjs`), so a changed module is a changed URL and no cache anywhere can
 * hold the old bytes. The ONE thing that is not content-addressed is the document at the
 * stable address `/play/`, because that address is what a printed code and a scan point at
 * and it has to keep working across a rebuild. With a ten-minute lifetime on it, a phone can
 * answer a scan by running a ten-minute-old client — and the client that shipped before this
 * one fell back into offline practice on a link it could not serve, so the stale copy a
 * guest got was not merely old, it was wrong about what it was doing.
 *
 * WHAT THIS DOES ABOUT IT. The document at `/play/` becomes a loader and nothing else: it
 * fetches the real page from its content-addressed name and hands the document over to it.
 * The bytes that decide anything — the game, the rules version, the table, the countdown —
 * are therefore never the bytes a cache chose; they are the bytes named by a tag that
 * changed when they changed. The loader itself can be stale and it does not matter: it holds
 * no game, opens no account and contacts nothing, and the only thing it can be stale ABOUT is
 * the name of the page it fetches, which the build rewrites into it.
 *
 * WHY A FETCH AND NOT A REDIRECT. A redirect to the content-addressed page would work and is
 * the more obvious answer, but it changes the address in the bar, and a guest who reloads a
 * redirected page is reloading the OLD address again — the same page, one hop, two names. A
 * fetch keeps one address: the one on the scanned code from the first byte of the page to the
 * last, and a reload is a reload of the same thing.
 *
 * WHAT IT REFUSES. A fetch that does not answer 200 is not silently retried into an empty
 * page: the loader says the client could not be loaded, names the file it asked for, and
 * leaves nothing pressable. A loader that fell back to some built-in game would be the same
 * class of defect as the offline fallback this client already removed once.
 *
 * STANDALONE ON PURPOSE. This file imports nothing. It is on the critical path of a page
 * that runs on a phone at a venue, and a loader that depended on a module would have to
 * resolve that module before it could load the module that names the page — a second chance
 * to be stale, and a second chance to fail before the guest sees anything.
 */

const LOADING = 'Opening the game…';

function say(message) {
  const body = document.body;
  if (!body) return;
  body.textContent = '';
  const main = document.createElement('main');
  const line = document.createElement('p');
  line.textContent = message;
  main.appendChild(line);
  body.appendChild(main);
}

/**
 * The content-addressed page this build of the loader belongs to.
 *
 * Read from the loader document's own `<link rel="preload" data-role="page">`, whose `href`
 * the build rewrites to the content-addressed name it emitted — so the loader and the page it
 * loads are stamped by the same build and cannot be mixed across a deploy. A document that
 * names no page has nothing to load, and saying so is better than fetching a guess.
 */
function pageHref() {
  const link = document.querySelector('link[data-role="page"]');
  const href = link && link.getAttribute ? link.getAttribute('href') : null;
  if (!href) return null;
  const url = new URL(href, document.baseURI);
  // The page must be on this origin and under this document's own directory. An absolute URL
  // or a climb out of the directory would make this loader a way to fetch an arbitrary
  // document into the page a scan opened, and the one thing this file must not become is a
  // general-purpose injector. The value is written by the build and is not something a link
  // can set, so this is belt and braces — the kind that costs one comparison.
  const here = new URL('.', document.baseURI);
  if (url.origin !== here.origin || !url.pathname.startsWith(here.pathname)) return null;
  return url;
}

/**
 * Hand the document over to the page, scripts and all.
 *
 * `importNode` copies nodes; it does not run a `script`. Each script is therefore re-created
 * and appended in document order, which is what makes an inline module and its imports run
 * exactly as they would have if the document had been served directly. `async = false` is set
 * explicitly so the order the page declares is the order that runs: the engine bundle first,
 * then the module that uses it.
 */
function adopt(doc) {
  const head = document.head;
  const body = document.body;

  for (const node of [...doc.head.childNodes]) {
    // The loader's own title and viewport are already right and are not replaced: a second
    // `meta viewport` is a second answer to a question that has one.
    if (node.nodeType === 1 && (node.tagName === 'META' || node.tagName === 'TITLE'
      || node.tagName === 'LINK' || node.tagName === 'SCRIPT')) continue;
    head.appendChild(document.importNode(node, true));
  }

  body.textContent = '';
  for (const node of [...doc.body.childNodes]) {
    if (node.nodeType === 1 && node.tagName === 'SCRIPT') continue;
    body.appendChild(document.importNode(node, true));
  }

  /*
   * THE MARKUP IS IN PLACE BEFORE ANY SCRIPT RUNS. The page's own module looks its elements
   * up as it evaluates (`document.getElementById('surface')` and twenty more), so a script
   * appended to <head> would evaluate against an empty body and throw. Every script is
   * therefore appended to <body>, in document order, after the markup above — which is also
   * the order a browser would have used for scripts at the end of a document.
   *
   * The engine bundle is a classic script and the page is a module, and a module always runs
   * after every classic script that was parsed before it, so `KadiRuntime` exists by the time
   * the page asks for it without anything here sequencing them by hand.
   *
   * THE LOADER'S OWN SCRIPT IS SKIPPED. The page is fetched from a document that does not
   * contain the loader, so this is belt and braces — but a loader that could accidentally
   * adopt itself would fetch the page for ever, and the check costs one string comparison.
   */
  const mine = document.currentScript && document.currentScript.src ? document.currentScript.src : null;
  for (const script of [...doc.querySelectorAll('script')]) {
    if (script.src && mine && new URL(script.src, doc.baseURI).href === mine) continue;
    const copy = document.createElement('script');
    for (const attr of script.attributes) copy.setAttribute(attr.name, attr.value);
    copy.async = false;
    if (script.src) copy.src = script.src;
    else copy.textContent = script.textContent;
    body.appendChild(copy);
  }
}

async function boot() {
  const href = pageHref();
  if (!href) {
    say('This page could not be loaded: the game page it belongs to is not named. '
      + 'Rescan the code on the screen at the venue.');
    return;
  }
  let response;
  try {
    // `no-store` because the whole reason this file exists is that a cached copy of the page
    // is the defect. The name is content-addressed, so a fresh one is the same bytes anyway;
    // asking for no cache costs nothing and cannot be wrong.
    response = await fetch(href, { cache: 'no-store', credentials: 'same-origin' });
  } catch (error) {
    say('This page could not be loaded: the game page could not be fetched ('
      + ((error && error.message) || 'no answer') + '). Check the connection and reload.');
    return;
  }
  if (!response.ok) {
    say('This page could not be loaded: the game page at ' + href.pathname
      + ' answered HTTP ' + response.status + '. Rescan the code on the screen at the venue.');
    return;
  }
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  if (!doc || !doc.body || !doc.body.childNodes.length) {
    say('This page could not be loaded: the game page arrived empty.');
    return;
  }
  adopt(doc);
}

say(LOADING);
boot().catch((error) => {
  say('This page could not be loaded: ' + ((error && error.message) || 'unknown fault')
    + '. Rescan the code on the screen at the venue.');
});
