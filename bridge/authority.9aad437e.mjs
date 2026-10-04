/**
 * Bridge, behind the same client host as Kadi, Go and Shogi.
 *
 * Bridge is the hardest reuse case in the portfolio, and for two reasons the other
 * games do not have:
 *
 *   1. IT HAS TWO PHASES. There is no `createState`: an auction produces a
 *      contract, and the contract produces a play. The authority holds both and
 *      presents one view, which is exactly what an authority is for. The host never
 *      learns that phases exist.
 *   2. THE AUCTION TAKES NO SEAT. `applyCall(auction, call)` reads `auction.turn`
 *      itself. So this file must not pass a seat it invented; it checks whose turn
 *      it is and refuses otherwise, and the rules remain the only thing that knows
 *      what call comes next.
 *
 * Legality is never re-implemented. `applyCall` is pure — it returns a new auction
 * rather than mutating one — so a call is legal exactly when applying it to the
 * current auction succeeds. That includes doubles and redoubles, whose conditions
 * are subtler than a level comparison and would be the first thing to drift if they
 * were copied here.
 *
 * SCORING IS NOT IMPLEMENTED (SCORING_IMPLEMENTED is false in the rules). The client
 * says so rather than showing a score it cannot compute.
 *
 * The machine's bidding is a POLICY, not a rule: the rules say which bids are
 * legal, and this picks one. It is a crude points-and-length choice, described
 * plainly, and it is not a bidding system.
 */
import { GameAuthority } from '../play/host.0810b83e.mjs';
import {
  SEATS, STRAINS, PASS, DOUBLE, REDOUBLE, SCORING_IMPLEMENTED, descriptor,
  createAuction, applyCall, isBid, createPlay, legalPlays, playCard, botPlay,
  trickCount, trickWinner, nextSeat, sideOf, deal, fullDeck, shuffle, createRng,
} from './rules.35ca8d07.mjs';

const HUMAN = 'S';
const MACHINES = SEATS.filter((s) => s !== HUMAN);
const HIGH_CARD = { A: 4, K: 3, Q: 2, J: 1 };

/** High-card points. A hand-evaluation convention, not a rule of play. */
const hcp = (hand) => (hand || []).reduce((n, c) => n + (HIGH_CARD[c.rank] || 0), 0);

/** The suit a hand is longest in, breaking ties by the rules' own suit order. */
function longestSuit(hand) {
  const counts = Object.fromEntries(['C', 'D', 'H', 'S'].map((s) => [s, 0]));
  for (const c of hand || []) counts[c.suit] += 1;
  return ['S', 'H', 'D', 'C'].sort((a, b) => counts[b] - counts[a])[0];
}

export class BridgeAuthority extends GameAuthority {
  constructor(opts = {}) {
    super();
    this.human = opts.human ?? HUMAN;
    this.seed = opts.seed ?? null;
    this.dealerIndex = 0;
    this.phase = 'auction';
    this.auction = null;
    this.play = null;
    this.hands = null;
    this.passedOut = 0;
  }

  get provenance() { return { kind: 'local', id: descriptor.id }; }

  get ruleVersion() { return '0.0.1'; }

  async open() {
    const seed = this.seed ?? (Date.now() % 2147483647);
    // `deal` returns { hands: { N, E, S, W } }, not the seat map itself. Taking the
    // wrapper made every seat lookup undefined, which surfaced as the client sitting
    // on "Dealing…" with no cards — a rendering symptom of a shape mistake.
    const dealt = deal(shuffle(fullDeck(), createRng(seed)));
    this.hands = dealt.hands ?? dealt;
    const dealer = SEATS[this.dealerIndex % SEATS.length];
    this.auction = createAuction(dealer);
    this.phase = 'auction';
    this.play = null;
    this.passedOut = 0;
    this.advanceIfNeeded();
    return this.summary();
  }

  /**
   * One view for two phases. The host asks for a view and gets the auction, the
   * contract and the table together; it never has to know that Bridge has phases.
   */
  async view(seat = this.human) {
    void seat;
    return this.summary();
  }

  /**
   * A call is legal exactly when the rules accept it. Nothing about doubles,
   * redoubles or bid ordering is restated here.
   */
  canCall(call) {
    return this.auction && !this.auction.finished && applyCall(this.auction, call).ok === true;
  }

  /** Every call the rules would accept right now, including pass, double, redouble. */
  legalCalls() {
    if (!this.auction || this.auction.finished) return [];
    const out = [];
    if (this.canCall(PASS)) out.push(PASS);
    for (let level = 1; level <= 7; level++) {
      for (const strain of STRAINS) {
        const bid = { level, strain };
        if (this.canCall(bid)) out.push(bid);
      }
    }
    if (this.canCall(DOUBLE)) out.push(DOUBLE);
    if (this.canCall(REDOUBLE)) out.push(REDOUBLE);
    return out;
  }

  async act(seat, action, args = {}) {
    if (action === 'call') {
      if (this.phase !== 'auction') return { ok: false, error: 'the auction is over' };
      if (this.auction.turn !== seat) return { ok: false, error: 'not your turn to call' };
      const r = applyCall(this.auction, args.call);
      if (!r.ok) return { ok: false, error: r.reason };
      this.auction = r.auction;
      this.advanceIfNeeded();
      return { ok: true };
    }
    if (action === 'play') {
      if (this.phase !== 'play') return { ok: false, error: 'the play has not started' };
      if (this.play.turn !== seat) return { ok: false, error: 'not your turn to play' };
      const r = playCard(this.play, seat, args.card);
      if (!r.ok) return { ok: false, error: r.reason };
      this.play = r.play ?? this.play;
      this.advanceIfNeeded();
      return { ok: true, winnerId: this.winnerId() };
    }
    return { ok: false, error: `unknown action: ${action}` };
  }

  /** Auction finished -> contract or passed out; play finished -> next trick. */
  advanceIfNeeded() {
    if (this.phase === 'auction' && this.auction && this.auction.finished) {
      if (!this.auction.contract) {
        // A passed-out deal is a real outcome, not an error. Record it and start a
        // fresh board when this one is asked for again.
        this.passedOut += 1;
        this.phase = 'passed-out';
        return;
      }
      // The rules name the declarer; the leader is the seat to declarer's left,
      // which is what nextSeat means here.
      this.play = createPlay(this.auction.contract, this.hands, nextSeat(this.auction.contract.declarer));
      this.phase = 'play';
    }
    if (this.phase === 'play' && this.play && this.play.finished) return;
  }

  machineReady() {
    if (this.phase === 'auction') return this.auction && !this.auction.finished && this.auction.turn !== this.human;
    if (this.phase === 'play') return this.play && !this.play.finished && this.play.turn !== this.human;
    return false;
  }

  async machineTurn() {
    if (!this.machineReady()) return { ok: false, error: 'not the machine turn' };
    if (this.phase === 'auction') {
      const seat = this.auction.turn;
      return this.act(seat, 'call', { call: this.chooseCall(seat) });
    }
    const seat = this.play.turn;
    const card = botPlay(this.play, seat);
    if (!card) return { ok: false, error: 'the machine has no legal card' };
    return this.act(seat, 'play', { card });
  }

  /**
   * The machine's bidding choice. A policy, plainly: open or raise the lowest legal
   * bid in the longest suit when the hand holds twelve or more high-card points,
   * and pass otherwise. Not a bidding system, and not presented as one.
   */
  chooseCall(seat) {
    const hand = this.hands[seat] || [];
    const strong = hcp(hand) >= 12;
    if (!strong) return PASS;
    const strain = longestSuit(hand);
    for (let level = 1; level <= 7; level++) {
      const bid = { level, strain };
      if (this.canCall(bid)) return bid;
    }
    return PASS;
  }

  winnerId() {
    if (this.phase !== 'play' || !this.play || !this.play.finished) return 0;
    const counts = trickCount(this.play);
    if (counts.NS === counts.EW) return 0;
    return counts.NS > counts.EW ? 1 : 2;
  }

  summary() {
    const a = this.auction;
    const p = this.play;
    const seat = this.human;
    /*
     * During the play, the seat's hand is the PLAY state's hand, which shrinks as
     * cards are played. Reading the original deal here instead meant the client kept
     * showing thirteen cards after cards had been played — a trick could be won
     * while the hand never changed.
     */
    const hand = this.phase === 'play' && p
      ? (p.hands[seat] || [])
      : (this.hands ? this.hands[seat] : []);
    const legal = this.phase === 'play' && p && !p.finished && p.turn === seat
      ? legalPlays(p, seat) : [];
    const counts = p ? trickCount(p) : { NS: 0, EW: 0 };

    return {
      phase: this.phase,
      seats: SEATS,
      teams: { 1: 'NS', 2: 'EW' },
      dealer: a ? a.dealer : null,
      auction: a ? a.calls.map((c) => ({ seat: c.seat, call: c.call })) : [],
      contract: a ? a.contract : null,
      doubled: a ? a.doubled : 0,
      passedOut: this.passedOut,
      hands: this.hands,
      hand: hand.map((c) => c.id),
      handCards: hand,
      turn: this.phase === 'auction' ? (a ? a.turn : null)
        : this.phase === 'play' && p ? p.turn : null,
      turnSeat: this.phase === 'auction' ? (a ? a.turn : null)
        : this.phase === 'play' && p ? p.turn : null,
      legalCalls: this.phase === 'auction' && a && a.turn === seat ? this.legalCalls() : [],
      legalPlays: legal,
      trick: p ? p.trick : [],
      tricks: p ? p.tricks : [],
      trickCounts: counts,
      trumps: p ? p.trump : null,
      over: this.phase === 'play' && !!p && p.finished,
      winnerId: this.winnerId(),
      scoringImplemented: SCORING_IMPLEMENTED,
      canNewDeal: true,
    };
  }
}
