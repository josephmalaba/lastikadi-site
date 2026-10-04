/**
 * Shogi, behind the same client host Kadi and Go use.
 *
 * `GameHost` from play/host.mjs is used unchanged: it asks for `open`, `view` and
 * `act`, and optionally `machineReady`/`machineTurn`. That was already true for Go;
 * Shogi is the second game to confirm it, and it is a harder case because a Shogi
 * move is (from, to, promote) rather than a single point, so the host cannot be
 * assuming a one-argument action either.
 *
 * No rule is decided here. Legality, promotion requirements, check and mate all
 * come from rules.mjs, which is the vendored copy of `lastikadi-shogi` and remains
 * that repository's authority. `scripts/vendor-rules.mjs --check` fails the build
 * if this copy drifts from it.
 *
 * DROPS ARE NOT IMPLEMENTED. `DROPS_SUPPORTED` is false in the rules module and it
 * is reported through the view rather than hidden, so the client can say so and
 * support can answer a report about drops as known-not-yet-built.
 */
import { GameAuthority } from '../play/host.dbf3483b.mjs';
import {
  SENTE, GOTE, other, createState, movesFrom, playMove, resign, botMove,
  inCheck, DROPS_SUPPORTED, descriptor,
} from './rules.0b52a393.mjs';

const HUMAN_SEAT = 1;
const MACHINE_SEAT = 2;
const seatOwner = (seat) => (seat === HUMAN_SEAT ? SENTE : GOTE);
const ownerSeat = (owner) => (owner === SENTE ? HUMAN_SEAT : MACHINE_SEAT);

export class ShogiAuthority extends GameAuthority {
  constructor(opts = {}) {
    super();
    this.human = opts.human ?? HUMAN_SEAT;
    this.machine = opts.machine ?? MACHINE_SEAT;
    this.state = null;
  }

  get provenance() { return { kind: 'local', id: descriptor.id }; }

  get ruleVersion() { return '0.0.1'; }

  async open() {
    this.state = createState();
    return this.summary();
  }

  async view(seat = this.human) {
    void seat;
    return this.summary();
  }

  /**
   * Actions: `move` with {from, to, promote}, or `resign`.
   *
   * A Shogi move is three arguments, not one. Accepting the whole move object and
   * handing it to the rules is what keeps this authority from re-deciding anything:
   * if the (from, to, promote) triple is not in the legal list, the rules refuse it
   * and the reason is passed straight back.
   */
  async act(seat, action, args = {}) {
    if (action === 'move') {
      const owner = seatOwner(seat);
      if (this.state.turn !== owner) return { ok: false, error: 'not your turn' };
      const { from, to, promote } = args;
      if (!Number.isInteger(from) || !Number.isInteger(to)) {
        return { ok: false, error: 'a move needs a from and a to' };
      }
      const r = playMove(this.state, from, to, !!promote);
      if (!r.ok) return { ok: false, error: r.reason };
      this.state = r.state;
      return { ok: true, captured: r.captured ? r.captured.kind : null, winnerId: this.winnerId() };
    }
    if (action === 'resign') {
      const r = resign(this.state, seatOwner(seat));
      if (!r.ok) return { ok: false, error: r.reason };
      this.state = r.state;
      return { ok: true, winnerId: this.winnerId() };
    }
    return { ok: false, error: `unknown action: ${action}` };
  }

  machineReady() {
    return !!this.state && !this.state.finished && this.state.turn === seatOwner(this.machine);
  }

  async machineTurn() {
    if (!this.machineReady()) return { ok: false, error: 'not the machine turn' };
    const mv = botMove(this.state, this.state.turn);
    if (!mv) {
      // No move available: the rules already finished the game, or it is stuck.
      return { ok: false, error: 'the machine has no move' };
    }
    return this.act(this.machine, 'move', { from: mv.from, to: mv.to, promote: mv.promote });
  }

  /* ------------------------------------------------------------------ */

  /** Every legal move for a seat, straight from the rules. */
  legalFor(seat) {
    if (!this.state || this.state.finished) return [];
    if (this.state.turn !== seatOwner(seat)) return [];
    const out = [];
    for (let i = 0; i < this.state.board.length; i++) {
      if (!this.state.board[i] || this.state.board[i].owner !== this.state.turn) continue;
      for (const m of movesFrom(this.state, i)) out.push(m);
    }
    return out;
  }

  winnerId() {
    if (!this.state || !this.state.finished || !this.state.result) return 0;
    return this.state.result.winner ? ownerSeat(this.state.result.winner) : 0;
  }

  summary() {
    const s = this.state;
    const finished = !!s.finished;
    return {
      size: s.size,
      board: s.board,
      turn: s.turn,
      turnSeat: ownerSeat(s.turn),
      moveNumber: s.moveNumber,
      over: finished,
      winnerId: this.winnerId(),
      result: s.result,
      lastMove: s.lastMove,
      hands: s.hands,
      // Reported, not hidden: the client must be able to say what is missing.
      dropsSupported: DROPS_SUPPORTED,
      inCheck: !finished && inCheck(s, s.turn),
      checkedOwner: !finished && inCheck(s, s.turn) ? s.turn : null,
      canResign: !finished,
      legalCount: finished ? 0 : this.legalFor(ownerSeat(s.turn)).length,
    };
  }
}
