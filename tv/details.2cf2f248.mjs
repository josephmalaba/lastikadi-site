/**
 * tv/details.mjs — the panel under the clock: what THIS game's table looks like.
 *
 * THE POINT OF THE FILE. Kadi and Shogi are not the same game and must not share a generic
 * panel. Kadi is a shedding game where the things a room wants are whose turn it is, what is
 * on top of the pile, which way play is running, what round it is and who is ahead. Shogi is
 * a board game where the things a room wants are the position, the last move, and who is
 * sitting where. A panel that averaged those two would tell the room nothing about either.
 *
 * So a panel is a TABLE KEYED BY gameId (PANELS below), and adding a third game is adding a
 * third entry — the painter, the layout and the honesty rules do not change. A game with no
 * entry gets the fallback, which NAMES the game and says plainly that this screen has no
 * panel for it. It never borrows another game's panel: a Shogi table drawn with Kadi's
 * vocabulary would be the same class of defect as a Go scan opening Kadi.
 *
 * WHAT IS AND IS NOT READABLE, and this is the whole reason the panel looks the way it does.
 * Every game-state route the service has — POST /deckmaster/state, POST
 * /deckmaster/playingdeck, GET /deckmaster/leaders — answers 401 to a caller with no token,
 * measured against production on 2026-10-04. A venue display has no account and must not
 * carry one, so the play, the leaders and the round are NOT readable from this screen. The
 * one public per-table read is GET /lobby/{joinCode}, which publishes the lifecycle, the
 * seat list and the wait deadline and nothing about the position.
 *
 * The panel therefore does three things and no more:
 *   1. it shows the table facts that ARE readable, in full (seats, lifecycle, the clock);
 *   2. it shows what the SERVICE ITSELF declares about the game (its rules version, its
 *      runtime interface, and the capabilities it says the engine implements) — real,
 *      per-game data, and already different between Kadi and Shogi;
 *   3. for each of the game's own play fields it either shows the value the service sent or
 *      says `not published`, with the exact field it is waiting for named in `needs`.
 *
 * It never fills a field it does not have. A wrong board is worse than a named gap.
 *
 * THE SEAM A FUTURE READ COMES THROUGH. Each field declares where its value lives on the
 * table payload (`at`). classifyTable() in ./table.mjs keeps the service's whole answer,
 * unknown fields included, so the day the service publishes `play` or `leaders` under that
 * name these fields light up with no change to this file — which is the test of whether the
 * panel was built for a third game or just for these two.
 */

/**
 * The endpoint and field shape that would light the play half of every panel, in one place.
 * It is carried onto the page as data (see renderPanel) so the gap is inspectable from the
 * artefact rather than only from a report.
 */
export const PLAY_READ_NEEDED = 'GET /lobby/{joinCode} -> play{turnSeatNo, round, direction, topCard, pileSize, lastMove, board} and leaders[]';

/**
 * What each game's panel asks its table for.
 *
 * `at` is a path into the service's answer, e.g. 'play.topCard'. A panel is data, not code,
 * so a third game is an entry here plus nothing else.
 */
export const PANELS = Object.freeze({
  kadi: Object.freeze({
    title: 'Kadi',
    /** What this game's table would show a room, in this game's own words. */
    fields: Object.freeze([
      Object.freeze({ label: 'Whose turn', at: 'play.turnSeatNo' }),
      Object.freeze({ label: 'Top of the pile', at: 'play.topCard' }),
      Object.freeze({ label: 'Cards in the pile', at: 'play.pileSize' }),
      Object.freeze({ label: 'Direction of play', at: 'play.direction' }),
      Object.freeze({ label: 'Round', at: 'play.round' }),
      Object.freeze({ label: 'Leaders', at: 'leaders' }),
    ]),
  }),
  shogi: Object.freeze({
    title: 'Shogi',
    fields: Object.freeze([
      Object.freeze({ label: 'Side to move', at: 'play.turnSeatNo' }),
      Object.freeze({ label: 'Last move', at: 'play.lastMove' }),
      Object.freeze({ label: 'Board', at: 'play.board' }),
      Object.freeze({ label: 'Pieces in hand', at: 'play.hands' }),
      Object.freeze({ label: 'Move number', at: 'play.moveNumber' }),
    ]),
  }),
});

/** Every game this screen has a panel for, as ids. Used by the tests and by nothing else. */
export function knownGames() {
  return Object.keys(PANELS);
}

/** The panel for a game, or null when this screen has none — never another game's. */
export function panelFor(gameId) {
  const id = typeof gameId === 'string' ? gameId.trim() : '';
  return Object.prototype.hasOwnProperty.call(PANELS, id) ? PANELS[id] : null;
}

/* ------------------------------------------------------------- reading a value */

const MAX_VALUE = 64;

function shorten(text) {
  const flat = String(text).replace(/\s+/g, ' ').trim();
  return flat.length <= MAX_VALUE ? flat : flat.slice(0, MAX_VALUE - 1) + '…';
}

/**
 * A value as a room can read it, or a refusal to render one.
 *
 * Three outcomes, and the difference matters: a value the screen can show; `not published`
 * when the service sent nothing; and `not shown here` when the service sent something this
 * screen has no honest form for. The third exists so that a future field — a nested board
 * object, say — is never flattened into a string that reads like a fact.
 */
export function describe(value) {
  if (value === null || value === undefined) return { value: 'not published', state: 'absent' };
  if (typeof value === 'string') {
    const trimmed = textOrNull(value);
    return trimmed ? { value: shorten(trimmed), state: 'known' } : { value: 'not published', state: 'absent' };
  }
  if (typeof value === 'number' && Number.isFinite(value)) return { value: String(value), state: 'known' };
  if (typeof value === 'boolean') return { value: value ? 'yes' : 'no', state: 'known' };
  if (Array.isArray(value)) {
    if (value.length === 0) return { value: 'none', state: 'known' };
    if (value.every((v) => typeof v === 'string' || typeof v === 'number')) {
      return { value: shorten(value.join(', ')), state: 'known' };
    }
    return { value: value.length + ' entries, not shown here', state: 'unreadable' };
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value).length;
    return { value: keys + ' fields, not shown here', state: 'unreadable' };
  }
  return { value: 'not published', state: 'absent' };
}

function textOrNull(value) {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}

/** Read one declared path out of the service's answer. Absent anywhere means absent. */
export function readAt(source, path) {
  let node = source;
  for (const step of String(path).split('.')) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return undefined;
    if (!Object.prototype.hasOwnProperty.call(node, step)) return undefined;
    node = node[step];
  }
  return node;
}

/* --------------------------------------------------------------- the panel plan */

/** The portfolio entry for the game, so the panel can show what the service declares. */
function entryFor(outcome, gameId) {
  const games = outcome && Array.isArray(outcome.games) ? outcome.games : [];
  return games.find((g) => g && g.gameId === gameId) || null;
}

function labelFor(entry, gameId) {
  const declared = textOrNull(entry && entry.displayName);
  if (declared) return declared;
  const id = textOrNull(gameId);
  if (!id) return 'Unnamed game';
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function capabilityList(entry) {
  const caps = entry && Array.isArray(entry.capabilities) ? entry.capabilities : null;
  if (!caps || caps.length === 0) return null;
  // The service's own words, with the `command:`/`query:` prefix kept: it is what the
  // engine declares it can do, and stripping the prefix would be this screen inventing a
  // friendlier taxonomy than the one the service publishes.
  return caps.map((c) => (typeof c === 'string' ? c.trim() : '')).filter(Boolean);
}

/**
 * Everything the details panel says, as data.
 *
 * `outcome` is the portfolio outcome (for what the service declares about the game),
 * `selection` is the portfolio's chosen game, and `table` is the table plan from
 * ./table.mjs. The table's gameId wins: the table service is the authority on which game
 * this table is, and a screen whose picker said Kadi while the table said Shogi would be
 * showing the wrong panel for the real table.
 */
export function panelPlan({ outcome = null, selection = null, table = null, paired = false } = {}) {
  const tableGame = table && table.table ? textOrNull(table.table.gameId) : null;
  const gameId = tableGame || (selection ? textOrNull(selection.gameId) : null);

  if (!gameId) {
    return {
      shows: false, gameId: null, title: '', subtitle: '', stateWord: '', warn: false,
      seats: [], facts: [], fields: [], hasFields: false, foot: '', needs: '',
    };
  }

  const entry = entryFor(outcome, gameId);
  const spec = panelFor(gameId);
  const label = labelFor(entry, gameId);
  /*
   * The version comes from the TABLE when there is one, and from the portfolio's chosen
   * game otherwise — never from the table plan's own fallback, which is the previous
   * selection and would print one game's rules version under another game's name.
   */
  const rules = (table && table.table ? textOrNull(table.table.ruleVersion) : null)
    || (selection && selection.gameId === gameId ? textOrNull(selection.ruleVersion) : null);

  /*
   * THE SEATS. Real data, and the only per-player fact this screen is entitled to: the
   * service's public table shape carries a seat number, the display name that seat chose
   * and whether it is held, and no account id behind any of it.
   */
  const seats = [];
  if (table && table.table) {
    for (const seat of table.table.seats) {
      seats.push({
        label: 'Seat ' + seat.seatNo,
        value: seat.taken ? (seat.displayName || 'taken') : (seat.known ? 'open' : seat.seatState),
        state: seat.taken ? 'known' : 'open',
      });
    }
  }

  /* WHAT THE SERVICE DECLARES ABOUT THE GAME — real, per game, and already different. */
  const facts = [];
  if (entry) {
    const facts_wanted = [
      ['Rules version', textOrNull(entry.ruleVersion) || 'not stated'],
      ['Runtime interface', textOrNull(entry.runtimeInterfaceVersion) || 'not stated'],
      ['Lifecycle', textOrNull(entry.lifecycle) || 'not stated'],
    ];
    for (const [label_, value] of facts_wanted) facts.push({ label: label_, value, state: 'known' });
    const caps = capabilityList(entry);
    if (caps) facts.push({ label: 'The engine declares', value: caps.join(', '), state: 'known' });
  } else {
    // The portfolio did not answer, so this screen cannot say what the service declares.
    facts.push({ label: 'Service declares', value: 'not readable', state: 'absent' });
  }

  /*
   * THE GAME'S OWN FIELDS. Only rendered when there is a table whose play they describe:
   * a wall that is following no table has nothing to put in them, and a column of
   * `not published` on a screen nobody has attached to a table is noise, not honesty.
   */
  const hasTable = Boolean(table && table.table);
  const fields = [];
  if (hasTable && spec) {
    for (const field of spec.fields) {
      const found = describe(readAt(table.table.raw, field.at));
      fields.push({ label: field.label, value: found.value, state: found.state, needs: field.needs || field.at });
    }
  }

  const footParts = [];
  if (!spec) {
    footParts.push('This screen has no detail panel for ' + label
      + ', so it shows only what the table service declares and invents nothing about the game.');
  }
  if (hasTable && fields.length > 0 && fields.some((f) => f.state !== 'known')) {
    footParts.push('The play is read from the table service\u2019s live table, and it publishes no public read of one: '
      + (paired
        ? 'that read needs this screen\u2019s own account, and the service has no route yet that serves a paired screen the play at its own table.'
        : 'that read needs this screen\u2019s own account, and this screen is not paired with one.')
      + ' What could not be read is named, not guessed.');
  }
  if (!hasTable) {
    footParts.push('This screen is not following a table, so it has no seats or play to show.');
  }

  const needs = fields.filter((f) => f.state !== 'known').map((f) => f.needs);

  return {
    shows: true,
    gameId,
    title: spec ? spec.title : label,
    subtitle: rules ? 'rules v' + rules : 'rules version not stated',
    stateWord: table ? table.word : 'No table',
    warn: Boolean(table && table.warn),
    seats,
    facts,
    fields,
    hasFields: fields.length > 0,
    foot: footParts.join(' '),
    needs: needs.length ? needs.join(' ') : '',
    playReadNeeded: hasTable && needs.length ? PLAY_READ_NEEDED : '',
  };
}

/* ------------------------------------------------------------------ painting */

function row(doc, className, label, value, state) {
  const wrap = doc.createElement('div');
  wrap.className = className + (state ? ' ' + className + '--' + state : '');
  const k = doc.createElement('span');
  k.className = 'panel__k';
  k.textContent = label;
  const v = doc.createElement('span');
  v.className = 'panel__v';
  v.textContent = value;
  wrap.appendChild(k);
  wrap.appendChild(v);
  return wrap;
}

/**
 * Paint the panel. Like renderPicker(), this decides nothing: every word, every seat and
 * every field arrives in the plan, so the screen can be asserted from the plan.
 */
export function renderPanel(doc, ui, plan) {
  ui.panel.hidden = !plan.shows;
  if (!plan.shows) return plan;

  ui.panel.dataset.state = plan.warn ? 'warn' : 'ok';
  ui.panelGame.textContent = plan.title;
  ui.panelRules.textContent = plan.subtitle;
  ui.panelState.textContent = plan.stateWord;
  ui.panelState.dataset.state = plan.warn ? 'warn' : 'ok';

  ui.panelSeats.textContent = '';
  for (const seat of plan.seats) {
    ui.panelSeats.appendChild(row(doc, 'panel__row', seat.label, seat.value, seat.state));
  }
  ui.panelSeats.hidden = plan.seats.length === 0;

  ui.panelFacts.textContent = '';
  for (const fact of plan.facts) {
    ui.panelFacts.appendChild(row(doc, 'panel__row', fact.label, fact.value, fact.state));
  }

  ui.panelFields.textContent = '';
  for (const field of plan.fields) {
    const built = row(doc, 'panel__row', field.label, field.value, field.state);
    // What this row is waiting for, on the row itself, so the gap is inspectable from the
    // page rather than only from a report.
    if (field.state !== 'known') built.title = 'this screen would need ' + field.needs;
    ui.panelFields.appendChild(built);
  }
  ui.panelFields.hidden = plan.fields.length === 0;

  ui.panelFoot.textContent = plan.foot;
  ui.panelFoot.hidden = plan.foot === '';
  if (plan.playReadNeeded) ui.panelFoot.dataset.needs = plan.playReadNeeded;
  else delete ui.panelFoot.dataset.needs;

  return plan;
}
