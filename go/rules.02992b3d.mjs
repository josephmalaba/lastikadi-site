/**
 * Go — rules module on the shared game contract.
 *
 * This is the second title, and its real purpose is to prove the shared
 * infrastructure is shared: the same host that drives Kadi drives this, with no
 * changes to the host and no second copy of the turn logic.
 *
 * It follows the same division the platform already draws: this module owns
 * *rules only* — legality, captures, ko, scoring, result. It contains no DOM, no
 * network, no storage and no clock, so the identical code runs in the browser,
 * on the server and in a test. Presentation is somebody else's problem.
 *
 * Correctness notes that matter for Go specifically:
 *   - Groups and liberties are recomputed from scratch each turn rather than
 *     cached, because a captured group invalidates every neighbouring group's
 *     liberty count. A cache here is how engines develop "impossible" positions.
 *   - Suicide is illegal, and the check must run *after* removing captured
 *     opponent stones, or a legal capture would be rejected.
 *   - Simple ko is enforced by forbidding a move that would recreate the
 *     immediately previous position.
 *   - Scoring uses Chinese-style area scoring (stones on the board plus enclosed
 *     empty points) so the result does not depend on counting captures.
 */

export const EMPTY = 0;
export const BLACK = 1;
export const WHITE = 2;

export const other = (c) => (c === BLACK ? WHITE : BLACK);

export const PASS = 'pass';
export const RESIGN = 'resign';

/** Board coordinates as 'D4'-style GTP points, which is what players expect. */
const LETTERS = 'ABCDEFGHJKLMNOPQRSTUVWXYZ'; // 'I' is skipped, as in GTP

export function pointToIndex(point, size) {
  if (typeof point !== 'string' || point.length < 2) return -1;
  const col = LETTERS.indexOf(point[0].toUpperCase());
  const row = Number(point.slice(1));
  if (col < 0 || col >= size) return -1;
  if (!Number.isInteger(row) || row < 1 || row > size) return -1;
  return (row - 1) * size + col;
}

export function indexToPoint(idx, size) {
  if (idx < 0 || idx >= size * size) return '';
  return LETTERS[idx % size] + String(Math.floor(idx / size) + 1);
}

/** Neighbours of an index, with no wraparound across rows. */
export function neighbours(idx, size) {
  const out = [];
  const row = Math.floor(idx / size);
  const col = idx % size;
  if (row > 0) out.push(idx - size);
  if (row < size - 1) out.push(idx + size);
  if (col > 0) out.push(idx - 1);
  if (col < size - 1) out.push(idx + 1);
  return out;
}

/**
 * Flood-fill one group and its liberties.
 * @returns {{stones:number[], liberties:Set<number>, colour:number}}
 */
export function group(board, size, start) {
  const colour = board[start];
  const stones = [];
  const liberties = new Set();
  if (colour === EMPTY) return { stones, liberties, colour: EMPTY };
  const seen = new Set([start]);
  const stack = [start];
  while (stack.length) {
    const cur = stack.pop();
    stones.push(cur);
    for (const n of neighbours(cur, size)) {
      if (board[n] === EMPTY) liberties.add(n);
      else if (board[n] === colour && !seen.has(n)) {
        seen.add(n);
        stack.push(n);
      }
    }
  }
  return { stones, liberties, colour };
}

/** All groups of one colour, used for scoring and for "is anything captured". */
export function groupsOf(board, size, colour) {
  const seen = new Set();
  const out = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== colour || seen.has(i)) continue;
    const g = group(board, size, i);
    for (const s of g.stones) seen.add(s);
    out.push(g);
  }
  return out;
}

/**
 * The board is a flat array of length size*size whose values are EMPTY, BLACK or
 * WHITE. Kept as a plain array (not a typed array) so states clone cheaply and
 * compare by value in tests.
 */
export function createState(size = 9, options = {}) {
  const cells = size * size;
  return {
    size,
    board: new Array(cells).fill(EMPTY),
    turn: BLACK,
    /** Consecutive passes; two ends the game. */
    passes: 0,
    /** Position string before the last move, for simple-ko. */
    previous: null,
    /** Indices of stones removed by the last move, for the UI and for audit. */
    lastCaptured: [],
    lastMove: null,
    moveNumber: 0,
    komi: options.komi ?? (size <= 9 ? 5.5 : 6.5),
    /** Set once the game is over; handlers/scoring are derived from it. */
    finished: false,
    resigner: 0,
  };
}

/** A compact string of the position, used only for ko comparison. */
export function positionKey(board) {
  return board.join('');
}

/**
 * Play a stone. Returns a new state, or `null` when the move is illegal, so the
 * caller can report a reason without the module needing an error vocabulary.
 *
 * `reason` is filled in on failure via the thrown object shape used by
 * `validate`, which keeps the common path allocation-free.
 */
export function playMove(state, colour, index) {
  if (state.finished) return { ok: false, reason: 'the game is over' };
  if (colour !== state.turn) return { ok: false, reason: 'not your turn' };
  if (index < 0 || index >= state.board.length) return { ok: false, reason: 'off the board' };
  if (state.board[index] !== EMPTY) return { ok: false, reason: 'that point is occupied' };

  const next = clone(state);
  const board = next.board;
  board[index] = colour;

  // Captures first: a move that fills its own last liberty may still be legal
  // because it captures the opponent.
  const captured = [];
  for (const n of neighbours(index, next.size)) {
    if (board[n] === other(colour)) {
      const g = group(board, next.size, n);
      if (g.liberties.size === 0) {
        for (const s of g.stones) {
          board[s] = EMPTY;
          captured.push(s);
        }
      }
    }
  }

  // Then suicide.
  if (group(board, next.size, index).liberties.size === 0) {
    return { ok: false, reason: 'that move would have no liberties' };
  }

  // Then ko: the resulting position may not equal the position before the
  // opponent's last move.
  const key = positionKey(board);
  if (state.previous !== null && key === state.previous && captured.length === 1) {
    return { ok: false, reason: 'ko — play elsewhere first' };
  }

  next.previous = positionKey(state.board);
  next.lastCaptured = captured;
  next.lastMove = { colour, index };
  next.passes = 0;
  next.moveNumber = state.moveNumber + 1;
  next.turn = other(colour);
  return { ok: true, state: next, captured };
}

export function pass(state, colour) {
  if (state.finished) return { ok: false, reason: 'the game is over' };
  if (colour !== state.turn) return { ok: false, reason: 'not your turn' };
  const next = clone(state);
  next.passes = state.passes + 1;
  next.moveNumber = state.moveNumber + 1;
  next.turn = other(colour);
  next.previous = positionKey(state.board);
  next.lastCaptured = [];
  next.lastMove = { colour, index: null, pass: true };
  if (next.passes >= 2) {
    next.finished = true;
    next.result = score(next);
  }
  return { ok: true, state: next };
}

export function resign(state, colour) {
  if (state.finished) return { ok: false, reason: 'the game is over' };
  const next = clone(state);
  next.finished = true;
  next.resigner = colour;
  next.result = { winner: other(colour), reason: 'resignation', margin: null };
  return { ok: true, state: next };
}

function clone(state) {
  return {
    ...state,
    board: state.board.slice(),
    lastCaptured: state.lastCaptured.slice(),
  };
}

/**
 * Chinese-style area scoring: your stones on the board plus the empty regions
 * only your colour surrounds, plus komi for White. Dead-stone resolution is a
 * human judgement the engine cannot make, so it is out of scope here and the
 * score is honest about that.
 */
export function score(state) {
  const { board, size } = state;
  let black = 0;
  let white = 0;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === BLACK) black++;
    else if (board[i] === WHITE) white++;
  }
  const seen = new Set();
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== EMPTY || seen.has(i)) continue;
    // Flood the empty region and see which colours border it.
    const region = [];
    const stack = [i];
    seen.add(i);
    const borders = new Set();
    while (stack.length) {
      const cur = stack.pop();
      region.push(cur);
      for (const n of neighbours(cur, size)) {
        if (board[n] === EMPTY && !seen.has(n)) {
          seen.add(n);
          stack.push(n);
        } else if (board[n] !== EMPTY) {
          borders.add(board[n]);
        }
      }
    }
    if (borders.size === 1) {
      if (borders.has(BLACK)) black += region.length;
      else white += region.length;
    }
  }
  const whiteTotal = white + state.komi;
  return {
    black,
    white: whiteTotal,
    komi: state.komi,
    margin: black - whiteTotal,
    winner: black > whiteTotal ? BLACK : whiteTotal > black ? WHITE : 0,
    method: 'area',
  };
}

/** Every point the given colour may legally play right now. */
export function legalMoves(state, colour) {
  if (state.finished || colour !== state.turn) return [];
  const out = [];
  for (let i = 0; i < state.board.length; i++) {
    if (state.board[i] !== EMPTY) continue;
    if (playMove(state, colour, i).ok) out.push(i);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* A tiny opponent, so a single player has something to play against.  */
/* ------------------------------------------------------------------ */

/**
 * A deliberately simple opponent: prefer a capture, then a move adjacent to the
 * last stone, then any legal point, with a preference for the third and fourth
 * lines on an empty board. It is not strong and is not meant to be — it exists
 * so that "play Go" does not require an account, a server or a second person.
 */
export function botMove(state, colour = state.turn) {
  const legal = legalMoves(state, colour);
  if (!legal.length) return { pass: true };
  const size = state.size;

  // Capture something if it is free.
  for (const idx of legal) {
    const r = playMove(state, colour, idx);
    if (r.ok && r.captured.length) return { index: idx };
  }

  // Otherwise stay near the action.
  const last = state.lastMove && state.lastMove.index != null ? state.lastMove.index : null;
  if (last !== null) {
    const near = legal.filter((idx) => neighbours(last, size).includes(idx));
    if (near.length) return { index: near[Math.floor(near.length / 2)] };
  }

  // On a quiet board, play on a good line rather than in the corner.
  const preferred = legal.filter((idx) => {
    const row = Math.floor(idx / size);
    const col = idx % size;
    const line = (v) => v === 2 || v === 3 || v === size - 3 || v === size - 4;
    return line(row) && line(col);
  });
  const pool = preferred.length ? preferred : legal;
  return { index: pool[Math.floor(pool.length / 2)] };
}
