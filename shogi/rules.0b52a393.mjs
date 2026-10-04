/**
 * Shogi — rules module on the shared LastiKadi game contract.
 *
 * Third title, same contract as Kadi and Go: rules only, no DOM, no network, no
 * clock, so the identical code runs in a browser and on the server.
 *
 * Scope of this first slice: the board, the pieces, movement and capture, the
 * promotion zone and forced promotion of the dead pieces (pawn, lance, knight),
 * check detection and checkmate. Drops — returning a captured piece to the board
 * as your own — are the defining feature of shogi and are *not* implemented yet;
 * `dropsSupported` is exported as `false` so a host cannot accidentally present
 * this as complete shogi. That is deliberate: a shogi that silently omits drops
 * is a different game, and the honest thing is to say so in the code.
 *
 * Board: 9x9. Ranks are a-i from the top (White's side) and files 1-9 from the
 * right, which is the conventional Japanese orientation. Internally the board is
 * a flat array, index = row * 9 + col, with row 0 the top.
 */

export const EMPTY = null;

export const SENTE = 'sente'; // Black, moves first, moves up the board
export const GOTE = 'gote';   // White

export const other = (c) => (c === SENTE ? GOTE : SENTE);

export const DROPS_SUPPORTED = false;

/**
 * Piece kinds. `P` promotes to `+P` and so on. King and gold never promote, so
 * they have no `+` form.
 */
export const KINDS = {
  K: { name: 'king', promotable: false },
  R: { name: 'rook', promotable: true },
  B: { name: 'bishop', promotable: true },
  G: { name: 'gold', promotable: false },
  S: { name: 'silver', promotable: true },
  N: { name: 'knight', promotable: true },
  L: { name: 'lance', promotable: true },
  P: { name: 'pawn', promotable: true },
};

/** A piece is `{kind, owner, promoted}`. */
export const piece = (kind, owner, promoted = false) => ({ kind, owner, promoted });

export function createState() {
  const size = 9;
  return {
    size,
    board: initialBoard(),
    turn: SENTE,
    moveNumber: 0,
    finished: false,
    /** Set when the game ends by checkmate or resignation. */
    result: null,
    lastMove: null,
    /** Hands exist in the type so drops can be added without changing shape. */
    hands: { [SENTE]: {}, [GOTE]: {} },
  };
}

const backRank = (owner) => [
  piece('L', owner), piece('N', owner), piece('S', owner), piece('G', owner),
  piece('K', owner), piece('G', owner), piece('S', owner), piece('N', owner), piece('L', owner),
];

function initialBoard() {
  const b = new Array(81).fill(EMPTY);
  const put = (row, col, p) => { b[row * 9 + col] = p; };
  // Gote (White) on the top two ranks, Sente (Black) on the bottom two.
  backRank(GOTE).forEach((p, c) => put(0, c, p));
  put(1, 1, piece('R', GOTE));
  put(1, 7, piece('B', GOTE));
  for (let c = 0; c < 9; c++) put(2, c, piece('P', GOTE));
  for (let c = 0; c < 9; c++) put(6, c, piece('P', SENTE));
  put(7, 1, piece('B', SENTE));
  put(7, 7, piece('R', SENTE));
  backRank(SENTE).forEach((p, c) => put(8, c, p));
  return b;
}

/** Forward is up the board for Sente, down for Gote. */
const forward = (owner) => (owner === SENTE ? -1 : 1);

/**
 * Movement deltas for a piece, as [dRow, dCol]. Sliding pieces return `steps`
 * greater than one meaning "repeat until blocked".
 */
export function movement(p) {
  const { kind, owner, promoted } = p;
  const f = forward(owner);
  if (promoted) {
    // Promoted pawn, lance and knight move as gold; promoted silver too.
    if (kind === 'P' || kind === 'L' || kind === 'N' || kind === 'S') {
      return { steps: 1, deltas: goldDeltas(f) };
    }
    if (kind === 'R') return { steps: 9, deltas: [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]] };
    if (kind === 'B') return { steps: 9, deltas: [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]] };
  }
  switch (kind) {
    case 'K':
      return { steps: 1, deltas: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]] };
    case 'G':
      return { steps: 1, deltas: goldDeltas(f) };
    case 'S':
      return { steps: 1, deltas: [[f, -1], [f, 0], [f, 1], [-f, -1], [-f, 1]] };
    case 'N':
      return { steps: 1, deltas: [[2 * f, -1], [2 * f, 1]] };
    case 'L':
      return { steps: 9, deltas: [[f, 0]] };
    case 'P':
      return { steps: 1, deltas: [[f, 0]] };
    case 'R':
      return { steps: 9, deltas: [[-1, 0], [1, 0], [0, -1], [0, 1]] };
    case 'B':
      return { steps: 9, deltas: [[-1, -1], [-1, 1], [1, -1], [1, 1]] };
    default:
      return { steps: 0, deltas: [] };
  }
}

function goldDeltas(f) {
  return [[f, -1], [f, 0], [f, 1], [0, -1], [0, 1], [-f, 0]];
}

export const inBounds = (row, col) => row >= 0 && row < 9 && col >= 0 && col < 9;

/** The promotion zone: the last three ranks on the far side. */
export function promotionZone(owner, row) {
  return owner === SENTE ? row <= 2 : row >= 6;
}

/**
 * A piece that has no legal continuation must promote: pawn and lance on the
 * last rank, knight on the last two.
 */
export function mustPromote(p, row) {
  if (p.promoted || !KINDS[p.kind].promotable) return false;
  const last = p.owner === SENTE ? 0 : 8;
  if (p.kind === 'P' || p.kind === 'L') return row === last;
  if (p.kind === 'N') return p.owner === SENTE ? row <= 1 : row >= 7;
  return false;
}

/** Pseudo-legal moves: geometry only, kings may be left in check. */
export function pseudoMoves(state, from) {
  const p = state.board[from];
  if (!p) return [];
  const { steps, deltas } = movement(p);
  const row = Math.floor(from / 9);
  const col = from % 9;
  const out = [];
  // A delta list may contain the same geometric step twice — the king's eight
  // directions and a promoted bishop's diagonal-plus-orthogonal set can overlap —
  // so deduplicate destinations here rather than letting callers see the same
  // square twice.
  const seen = new Set();
  for (const [dr, dc] of deltas) {
    for (let n = 1; n <= steps; n++) {
      const r = row + dr * n;
      const c = col + dc * n;
      if (!inBounds(r, c)) break;
      const to = r * 9 + c;
      const target = state.board[to];
      if (target && target.owner === p.owner) break;
      if (!seen.has(to)) {
        seen.add(to);
        out.push({ from, to, promote: false });
      }
      if (target) break;
    }
  }
  return out;
}

/** Apply a move without checking whether it leaves your own king in check. */
function applyRaw(state, from, to, promote) {
  const board = state.board.slice();
  const p = board[from];
  board[to] = promote ? { ...p, promoted: true } : p;
  board[from] = EMPTY;
  return { ...state, board, hands: state.hands };
}

export function findKing(state, owner) {
  for (let i = 0; i < state.board.length; i++) {
    const p = state.board[i];
    if (p && p.kind === 'K' && p.owner === owner) return i;
  }
  return -1;
}

/** Is `owner`'s king attacked in this position? */
export function inCheck(state, owner) {
  const king = findKing(state, owner);
  if (king < 0) return true; // a missing king is treated as lost
  for (let i = 0; i < state.board.length; i++) {
    const p = state.board[i];
    if (!p || p.owner === owner) continue;
    for (const mv of pseudoMoves(state, i)) {
      if (mv.to === king) return true;
    }
  }
  return false;
}

/** Legal moves for one piece: pseudo-legal, minus anything that self-checks. */
export function movesFrom(state, from) {
  const p = state.board[from];
  if (!p || p.owner !== state.turn || state.finished) return [];
  const out = [];
  // A destination may admit more than one promotion choice, but the same
  // (destination, promote) pair must appear exactly once. Generating options
  // without deduplicating produced duplicate entries — a rook that enters the
  // zone reported the same square twice — which inflates move counts and makes
  // "how many moves does this piece have" unanswerable.
  const seen = new Set();
  for (const mv of pseudoMoves(state, from)) {
    const toRow = Math.floor(mv.to / 9);
    const canPromote = KINDS[p.kind].promotable &&
      (promotionZone(p.owner, Math.floor(from / 9)) || promotionZone(p.owner, toRow));
    const forced = mustPromote(p, toRow);
    const options = forced ? [true] : canPromote ? [false, true] : [false];
    for (const promote of options) {
      const key = `${mv.to}:${promote}`;
      if (seen.has(key)) continue;
      const next = applyRaw(state, from, mv.to, promote);
      if (inCheck(next, p.owner)) continue;
      seen.add(key);
      out.push({ from, to: mv.to, promote });
    }
  }
  return out;
}

export function allMoves(state, owner = state.turn) {
  const probe = { ...state, turn: owner };
  const out = [];
  for (let i = 0; i < state.board.length; i++) {
    const p = state.board[i];
    if (!p || p.owner !== owner) continue;
    out.push(...movesFrom(probe, i));
  }
  return out;
}

export function playMove(state, from, to, promote = false) {
  if (state.finished) return { ok: false, reason: 'the game is over' };
  const legal = movesFrom(state, from);
  const match = legal.find((m) => m.to === to && m.promote === !!promote);
  if (!match) {
    const anyTo = legal.find((m) => m.to === to);
    if (anyTo) return { ok: false, reason: `that move must be played with promote=${anyTo.promote}` };
    return { ok: false, reason: 'that move is not legal' };
  }
  const captured = state.board[to] || null;
  const next = applyRaw(state, from, to, match.promote);
  next.turn = other(state.turn);
  next.moveNumber = state.moveNumber + 1;
  next.lastMove = { from, to, promote: match.promote, captured: captured ? captured.kind : null };
  // Hands are shaped but unused until drops exist; captured pieces are recorded
  // so the information is not lost when drops are implemented.
  const hands = { [SENTE]: { ...state.hands[SENTE] }, [GOTE]: { ...state.hands[GOTE] } };
  if (captured) hands[state.turn][captured.kind] = (hands[state.turn][captured.kind] || 0) + 1;
  next.hands = hands;

  const replies = allMoves(next, next.turn);
  if (replies.length === 0) {
    next.finished = true;
    next.result = inCheck(next, next.turn)
      ? { winner: state.turn, reason: 'checkmate' }
      : { winner: null, reason: 'stalemate' }; // not a win in shogi, but a result
  }
  return { ok: true, state: next, captured };
}

export function resign(state, owner) {
  if (state.finished) return { ok: false, reason: 'the game is over' };
  return {
    ok: true,
    state: { ...state, finished: true, result: { winner: other(owner), reason: 'resignation' } },
  };
}

/* ------------------------------------------------------------------ */
/* A modest opponent, so one player has something to play against.     */
/* ------------------------------------------------------------------ */

/** Piece values, used only to order the bot's choices. */
const VALUE = { K: 10000, R: 900, B: 800, G: 600, S: 500, N: 300, L: 300, P: 100 };
const value = (p) => (p ? (VALUE[p.kind] || 0) * (p.promoted ? 1.5 : 1) : 0);

export function botMove(state, owner = state.turn) {
  const legal = allMoves(state, owner);
  if (!legal.length) return null;
  let best = legal[0];
  let bestScore = -Infinity;
  for (const mv of legal) {
    const victim = state.board[mv.to];
    let score = value(victim) - value(state.board[mv.from]) / 100;
    if (mv.promote) score += 40;
    // Prefer moving toward the enemy king.
    const ek = findKing(state, other(owner));
    if (ek >= 0) {
      const r0 = Math.floor(mv.from / 9), c0 = mv.from % 9;
      const r1 = Math.floor(mv.to / 9), c1 = mv.to % 9;
      const er = Math.floor(ek / 9), ec = ek % 9;
      const before = Math.abs(r0 - er) + Math.abs(c0 - ec);
      const after = Math.abs(r1 - er) + Math.abs(c1 - ec);
      score += (before - after) * 2;
    }
    if (score > bestScore) { bestScore = score; best = mv; }
  }
  return best;
}

export const descriptor = {
  id: 'shogi',
  title: 'Shogi',
  seats: 2,
  boardSize: 9,
  dropsSupported: DROPS_SUPPORTED,
};
