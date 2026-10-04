/**
 * play/identity.mjs — which game this client is serving, and where that came from.
 *
 * The venue display chooses a game from the table service's own portfolio and puts that
 * identity into the scan code:
 *
 *   https://lastikadi.com/play/?game=kadi&v=0.0.3
 *
 * The wall was fixed to carry that identity (LAS-376 step 2). This module is the other
 * half: the phone reading it. Until this existed the client hard-coded a numeric game id
 * and never looked at its own address, so a scan carried the identity and nothing on the
 * phone consumed it — the screen said "Kadi, rules v0.0.3" and the phone silently played
 * whatever it had always played.
 *
 * THE ONE RULE THIS FILE EXISTS TO KEEP: a link that does not name a game and version
 * this client can actually serve opens nothing. It is refused, with the game NAMED and
 * nothing pressable. The acceptance on the wall was exactly this — an unverifiable game
 * is drawn greyed out and named rather than offered — and a client that quietly dealt
 * Kadi for `?game=weqi&v=9.9.9` would reintroduce on the phone the defect that was fixed
 * on the wall.
 *
 * WHY A TABLE AND NOT A NETWORK READ. `SERVED` below is what this document can actually
 * do: the rules module it ships, and the numbers it sends with them. It is not a claim
 * about what the table service has switched on — that is the portfolio's job and only
 * its job, and the wall is where that is read. A phone that had to reach the table
 * service before it would deal a practice hand would be a phone that stops working when
 * the service does; the identity check below is deliberately local for that reason.
 *
 * NOTHING HERE TOUCHES THE DOM, THE CLOCK OR THE NETWORK, so every refusal below —
 * absent, unknown, mismatched — is exercised by tests/play-identity.test.mjs rather than
 * reasoned about in a browser.
 */

/**
 * What this client can serve.
 *
 * Three different things live here and they are not the same kind of fact:
 *
 *   game       the game's IDENTITY. `kadi` is the string the table service registers the
 *              game under and the string the venue display carries on a scan. This is
 *              the identity the whole feature is about.
 *   engineGameId
 *              the numeric id the rules engine is opened under. It is not the game's
 *              identity and nothing on the server routes by it: GameService keys its
 *              tables with the integer and GameEngine stores and echoes it, while the
 *              module a table runs is selected elsewhere by the string id (the server's
 *              own LobbyStart says so: "the lobby contract's own gameId is the game's
 *              identity, not a session"). A network table allocates a fresh one per
 *              visit; see newTableId() in ./session.mjs. It is kept here as the id a
 *              single-device practice game is opened under.
 *   ruleVersion / runtimeInterfaceVersion
 *              the versions this client is pinned to. `ruleVersion` is the value the
 *              table service publishes for `kadi` and the value a scan carries (verified
 *              live 2026-10-04: GET /portfolio -> ruleVersion "0.0.3",
 *              runtimeInterfaceVersion "1.0"); `runtimeInterfaceVersion` is the one
 *              version fact the loaded engine can confirm about itself, and
 *              planForRuntime() makes it do so.
 *   machineAccountId
 *              the commissioned machine account the table service seats as the opponent.
 *
 *              IT CANNOT BE DISCOVERED, and that was measured rather than assumed, because
 *              the honest alternative was to look it up. Asked of production on
 *              2026-10-04, as an ordinary signed-in player:
 *
 *                GET  /portfolio          200, and it carries no machine, seat or agent
 *                                         field at all — only games
 *                GET  /admin/machines     403  operator only
 *                GET  /admin/dashboard    403  operator only
 *                GET  /registry/modules   403  operator only
 *                GET  /deckmaster/leaders 200, 117 accounts, and each entry is
 *                                         {playerId, username, wins, ...} with NO role or
 *                                         kind field — so it cannot tell a machine from a
 *                                         person. (It also should not: see below.)
 *                POST /lobby              the public resolve route deliberately carries no
 *                                         account ids ("The public shape carries no account
 *                                         ids")
 *
 *              So there is no player-accessible surface that names the machine, and this
 *              constant is the honest form of that fact: ONE named number, in ONE place,
 *              with the reason it cannot be looked up written next to it. It is not the
 *              next `GAME_ID = 7` — that was a number standing in for an identity nothing
 *              checked. This one is checked by the service on every visit: the seat rule
 *              validates it against the account store and refuses the whole table if it is
 *              wrong, and the refusal names this number so an operator can see what the
 *              client believed. tests/session.test.mjs fails if the seat is ever
 *              hard-coded anywhere else, or if a refusal stops naming it.
 *
 *              The value: `115`, commissioned 2026-10-04 (`username kadi-machine-1791154794`,
 *              role MACHINE). The number it replaces, `2`, was a human account; the number
 *              before that is why the old client could never open a table at all. A seat is
 *              refused for a human, and — after the seat rule is tightened — for an operator
 *              account too, so this must stay a non-human principal.
 *
 * If the service ever offers a second game, the entry is added here and the client can
 * serve it; a client whose table has no entry refuses rather than guessing. See
 * tests/play-identity.test.mjs, which fails if the venue display's own client index and
 * this table ever disagree about which games exist.
 */
export const SERVED = Object.freeze({
  kadi: Object.freeze({
    label: 'Kadi',
    engineGameId: 7,
    ruleVersion: '0.0.3',
    runtimeInterfaceVersion: '1.0',
    machineAccountId: 115,
  }),
});

/* ----------------------------------------------------------------- the states */

/**
 * The states a link can put this client in.
 *
 * Four of these are refusals and they are deliberately distinct, because "no game was
 * named" and "a game was named that I cannot serve" are different facts and a person
 * holding a phone needs to be told which one happened:
 *
 *   NO_GAME           the link names no game at all
 *   UNKNOWN_GAME      the link names a game this client does not serve
 *   NO_VERSION        the link names a game but no rules version
 *   VERSION_MISMATCH  the link names a version this client does not serve
 *   RUNTIME_MISMATCH  the rules module that loaded is not the one this client declares
 *
 * `RUNTIME_MISMATCH` is the engine's own vote, and it is the only check here that is not
 * a comparison of strings the client wrote down itself.
 */
export const PLAY_STATES = Object.freeze({
  READY: 'ready',
  NO_GAME: 'no-game',
  UNKNOWN_GAME: 'unknown-game',
  NO_VERSION: 'no-version',
  VERSION_MISMATCH: 'version-mismatch',
  RUNTIME_MISMATCH: 'runtime-mismatch',
});

/**
 * The words each state puts on the screen. `marker` is a second, non-colour signal, and
 * `note: null` means the sentence is built from the link instead.
 */
export const PLAY_TEXT = Object.freeze({
  [PLAY_STATES.READY]: { word: 'Ready', marker: '·', warn: false, note: null },
  [PLAY_STATES.NO_GAME]: {
    word: 'No game named',
    marker: '×',
    warn: true,
    note: 'This link names no game, so this client will not pick one for it.',
  },
  [PLAY_STATES.UNKNOWN_GAME]: { word: 'Cannot serve that game', marker: '×', warn: true, note: null },
  [PLAY_STATES.NO_VERSION]: { word: 'No rules version', marker: '×', warn: true, note: null },
  [PLAY_STATES.VERSION_MISMATCH]: { word: 'Different rules version', marker: '×', warn: true, note: null },
  [PLAY_STATES.RUNTIME_MISMATCH]: { word: 'Rules engine mismatch', marker: '!', warn: true, note: null },
});

/* ------------------------------------------------------------------- reading */

function textOrNull(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

/** How a game id is spelled on screen. */
export function gameLabel(gameId) {
  const id = textOrNull(gameId);
  if (!id) return 'Unnamed game';
  return id.charAt(0).toUpperCase() + id.slice(1);
}

/**
 * The games this client serves, as a sentence, so a refusal can name them.
 *
 * A refusal that only says "unknown game" tells the person nothing they can act on.
 */
export function servedNames(served = SERVED) {
  const labels = Object.keys(served).map(gameLabel);
  if (labels.length <= 1) return labels.join('');
  return labels.slice(0, -1).join(', ') + ' and ' + labels[labels.length - 1];
}

/**
 * Read `game` and `v` out of a location search string, without judging them.
 *
 * Deliberately mirrors tv/portfolio.mjs's readSelectionFragment(): the same pairs, the
 * same "a value that is only whitespace is an absent value" rule, and a tolerant decode.
 * It answers what the link ASKED FOR; whether this client can serve it is planForLink()'s
 * decision.
 *
 * TWO DELIBERATE NON-LENIENCIES. A value is NOT trimmed and `+` is NOT read as a space,
 * because both would make this reader disagree with the encoder on the other side of the
 * scan: the venue display writes these pairs with `encodeURIComponent`, which leaves `+`
 * alone and never emits a trailing space. An id that arrives carrying one is therefore not
 * the id the display wrote, and quietly repairing it would be this client inventing an
 * identity rather than reading one. It is reported as unknown instead, which is the same
 * refusal as any other unrecognised game.
 */
export function readLink(search) {
  const raw = typeof search === 'string' ? search.replace(/^\?/, '') : '';
  const found = {};
  if (raw) {
    for (const pair of raw.split('&')) {
      const at = pair.indexOf('=');
      if (at <= 0) continue;
      const key = pair.slice(0, at);
      let value = pair.slice(at + 1);
      try {
        value = decodeURIComponent(value);
      } catch {
        // A value that will not decode cannot be the identity it claims to be, and the
        // honest reading of it is "nothing usable here" rather than a half-decoded id.
        continue;
      }
      if (key === 'game' || key === 'v') found[key] = value;
    }
  }
  const usable = (value) => (typeof value === 'string' && value.trim() !== '' ? value : null);
  return { game: usable(found.game), version: usable(found.v) };
}

/* ---------------------------------------------------------------- the decision */

function refuse(state, asked, extra) {
  const text = PLAY_TEXT[state];
  return {
    state,
    word: text.word,
    marker: text.marker,
    warn: text.warn,
    // The single switch the page binds every control to. A refusal is a refusal: nothing
    // on the page may deal a game while this is false.
    ok: false,
    game: asked.game,
    label: asked.game ? gameLabel(asked.game) : null,
    ruleVersion: asked.version,
    servedLabel: null,
    servedRuleVersion: null,
    engineGameId: null,
    title: text.word,
    note: text.note,
    detail: '',
    ...extra,
  };
}

/**
 * Decide what the link in front of this client means, from the URL alone.
 *
 * Order matters and each refusal is checked before the next, so the sentence always names
 * the first thing that is actually wrong:
 *
 *   1. no game            -> refuse, and name what this client does serve
 *   2. unknown game       -> refuse, naming the game that was asked for
 *   3. known game, no v   -> refuse; an unversioned link cannot be checked against the
 *                            rules this client ships, so it is not the same table
 *   4. v is not served    -> refuse, naming both versions
 *   5. otherwise          -> READY, and the page may deal
 */
export function planForLink(search, served = SERVED) {
  const asked = readLink(search);

  if (!asked.game) {
    return refuse(PLAY_STATES.NO_GAME, asked, {
      note: PLAY_TEXT[PLAY_STATES.NO_GAME].note + ' This client serves ' + servedNames(served)
        + '. A scan from the venue screen carries the game and the rules version it selected, so '
        + 'the link to open is the one on that screen.',
      detail: 'serves ' + servedNames(served),
    });
  }

  const entry = Object.prototype.hasOwnProperty.call(served, asked.game) ? served[asked.game] : null;
  if (!entry) {
    return refuse(PLAY_STATES.UNKNOWN_GAME, asked, {
      note: 'This link asks for ' + JSON.stringify(asked.game) + '. This client serves '
        + servedNames(served) + ' only, so it will not open a different game under that name.',
      detail: 'serves ' + servedNames(served),
    });
  }

  const label = entry.label || gameLabel(asked.game);

  if (!asked.version) {
    return refuse(PLAY_STATES.NO_VERSION, asked, {
      label,
      note: 'This link names ' + label + ' but no rules version, so this client cannot tell which '
        + label + ' it would be joining. It serves ' + label + ' rules v' + entry.ruleVersion + '.',
      servedLabel: label,
      servedRuleVersion: entry.ruleVersion,
      detail: 'serves ' + label + ' rules v' + entry.ruleVersion,
    });
  }

  if (asked.version !== entry.ruleVersion) {
    return refuse(PLAY_STATES.VERSION_MISMATCH, asked, {
      label,
      note: 'This link asks for ' + label + ' rules v' + asked.version + '. This client serves '
        + label + ' rules v' + entry.ruleVersion + ', and will not play one version\'s rules under '
        + 'the other version\'s name.',
      servedLabel: label,
      servedRuleVersion: entry.ruleVersion,
      detail: 'asked v' + asked.version + ', serves v' + entry.ruleVersion,
    });
  }

  const text = PLAY_TEXT[PLAY_STATES.READY];
  return {
    state: PLAY_STATES.READY,
    word: text.word,
    marker: text.marker,
    warn: text.warn,
    ok: true,
    game: asked.game,
    label,
    ruleVersion: asked.version,
    servedLabel: label,
    servedRuleVersion: entry.ruleVersion,
    engineGameId: entry.engineGameId,
    title: label,
    note: label + ' — rules v' + asked.version + ', which is the version this link named and the '
      + 'version this client serves.',
    detail: label + ' · rules v' + asked.version,
  };
}

/**
 * The loaded rules module's vote.
 *
 * `identity` is the engine's own answer — the object `identityJson()` returns from the
 * runtime that actually loaded. The client declares the interface version it is pinned
 * to; if the bytes that arrived speak a different one, this refuses rather than dealing
 * a hand under a version it did not declare. Nothing else in this file can be checked
 * against anything but itself; this can, which is why it is here.
 */
export function planForRuntime(plan, identity, served = SERVED) {
  const entry = plan && plan.ok ? served[plan.game] : null;
  if (!entry) return plan;

  const reporting = identity && typeof identity.schemaVersion === 'string' ? identity.schemaVersion : null;
  if (reporting === entry.runtimeInterfaceVersion) return plan;

  const asked = { game: plan.game, version: plan.ruleVersion };
  return refuse(PLAY_STATES.RUNTIME_MISMATCH, asked, {
    label: plan.label,
    servedLabel: plan.label,
    servedRuleVersion: entry.ruleVersion,
    note: 'The rules engine that loaded reports runtime interface '
      + (reporting === null ? 'no version at all' : 'v' + reporting) + ', and this client is pinned '
      + 'to v' + entry.runtimeInterfaceVersion + '. It will not deal a hand against an engine it '
      + 'cannot identify.',
    detail: 'engine v' + (reporting === null ? 'unknown' : reporting)
      + ', pinned to v' + entry.runtimeInterfaceVersion,
  });
}
