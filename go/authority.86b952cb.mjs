/**
 * Go, behind the same client host Kadi uses.
 *
 * This is the point of the exercise: `GameHost` from play/host.mjs is not
 * card-shaped. It asks an authority for `open`, `view` and `act`, and optionally
 * `machineReady`/`machineTurn`. Nothing in it mentions hands, tricks, families or
 * a top card, so a board game implements the same three methods and reuses the
 * host unchanged — including its bounded agent loop, which is what stops a
 * misbehaving opponent from spinning.
 *
 * If this file needed the host changed to work, the shared-infrastructure claim
 * would be false. It does not.
 *
 * Rules are not restated here. Every legality question goes to go/rules.mjs, which
 * is the only thing in this client that knows what Go is.
 */
import { GameAuthority } from '../play/host.e30228b1.mjs';
import {
  BLACK, WHITE, EMPTY, createState, playMove, pass, resign,
  legalMoves, botMove, score, indexToPoint, pointToIndex,
} from './rules.02992b3d.mjs';

const HUMAN_SEAT = 1;
const MACHINE_SEAT = 2;
const seatColour = (seat) => (seat === HUMAN_SEAT ? BLACK : WHITE);
const colourSeat = (colour) => (colour === BLACK ? HUMAN_SEAT : MACHINE_SEAT);

export class GoAuthority extends GameAuthority {
  /**
   * @param {{size?:number, komi?:number, human?:number, machine?:number}} opts
   */
  constructor(opts = {}) {
    super();
    this.size = opts.size ?? 9;
    this.komi = opts.komi ?? 5.5;
    this.human = opts.human ?? HUMAN_SEAT;
    this.machine = opts.machine ?? MACHINE_SEAT;
    this.state = null;
  }

  get provenance() { return { kind: 'local', id: 'go-rules' }; }

  get ruleVersion() { return '0.0.1'; }

  async open() {
    this.state = createState(this.size, { komi: this.komi });
    return this.summary();
  }

  /** The view shape is Go's, not Kadi's — the host passes it through untouched. */
  async view(seat = this.human) {
    void seat;
    return this.summary();
  }

  async act(seat, action, args = {}) {
    if (action === 'play') {
      const colour = seatColour(seat);
      let index = args.index;
      if (index === undefined && typeof args.point === 'string') {
        index = pointToIndex(args.point, this.size);
      }
      if (!Number.isInteger(index)) return { ok: false, error: 'no point given' };
      const r = playMove(this.state, colour, index);
      if (!r.ok) return { ok: false, error: r.reason };
      this.state = r.state;
      return { ok: true, captured: r.captured, winnerId: this.winnerId() };
    }
    if (action === 'pass') {
      const r = pass(this.state, seatColour(seat));
      if (!r.ok) return { ok: false, error: r.reason };
      this.state = r.state;
      return { ok: true, winnerId: this.winnerId() };
    }
    if (action === 'resign') {
      const r = resign(this.state, seatColour(seat));
      if (!r.ok) return { ok: false, error: r.reason };
      this.state = r.state;
      return { ok: true, winnerId: this.winnerId() };
    }
    return { ok: false, error: `unknown action: ${action}` };
  }

  /* ---- the optional half of the host contract ---- */

  machineReady() {
    return !!this.state && !this.state.finished && this.state.turn === seatColour(this.machine);
  }

  async machineTurn() {
    if (!this.machineReady()) return { ok: false, error: 'not the machine turn' };
    const mv = botMove(this.state, seatColour(this.machine));
    if (mv.pass) return this.act(this.machine, 'pass');
    return this.act(this.machine, 'play', { index: mv.index });
  }

  /* ------------------------------------------------------------------ */

  /** Why a move would be refused, asked of the rules rather than guessed at. */
  legalFor(seat) {
    if (!this.state) return [];
    return legalMoves(this.state, seatColour(seat));
  }

  winnerId() {
    if (!this.state || !this.state.finished) return 0;
    if (this.state.result) return colourSeat(this.state.result.winner);
    // A finished game always carries a result; the score is the fallback.
    const s = score(this.state);
    return s.winner ? colourSeat(s.winner) : 0;
  }

  summary() {
    const s = this.state;
    const finished = !!s.finished;
    const sc = finished ? score(s) : null;
    return {
      size: s.size,
      board: s.board,
      turn: s.turn,
      turnSeat: colourSeat(s.turn),
      moveNumber: s.moveNumber,
      passes: s.passes,
      lastCaptured: s.lastCaptured.map((i) => indexToPoint(i, s.size)),
      lastMove: s.lastMove,
      komi: s.komi,
      over: finished,
      winnerId: this.winnerId(),
      result: s.result || sc,
      canPass: !finished,
      legalCount: finished ? 0 : legalMoves(s, s.turn).length,
      empty: s.board.filter((v) => v === EMPTY).length,
    };
  }
}
