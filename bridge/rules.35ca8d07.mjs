/**
 * Bridge â€” rules module on the shared LastiKadi game contract.
 *
 * Fourth title, same contract as Kadi and Go: rules only, no DOM, no network, no
 * clock, so the identical code runs in a browser and on the server.
 *
 * Scope of this first slice: the 52-card deck, a seeded deal, the **auction**
 * (including the rule that a pass ends the auction once a bid exists, doubling
 * and redoubling), contract determination, and **trick play** with follow-suit
 * enforcement and trick winner resolution.
 *
 * Not here yet, and named so nobody assumes otherwise:
 *   - dummy exposure and the closed hand (needs a daisychain of table state)
 *   - declarer play from the dummy
 *   - scoring (duplicate or rubber)
 *   - vulnerability
 * `SCORING_IMPLEMENTED` is exported as `false` for that reason.
 *
 * Seating is by compass: North/South are partners, East/West are partners.
 */

export const CLUBS = 'C';
export const DIAMONDS = 'D';
export const HEARTS = 'H';
export const SPADES = 'S';

/** Ascending order, used for comparing bids. */
export const STRAINS = [CLUBS, DIAMONDS, HEARTS, SPADES, 'NT'];
export const SUITS = [CLUBS, DIAMONDS, HEARTS, SPADES];
export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const SEATS = ['N', 'E', 'S', 'W'];
export const partner = (seat) => SEATS[(SEATS.indexOf(seat) + 2) % 4];
export const nextSeat = (seat) => SEATS[(SEATS.indexOf(seat) + 1) % 4];
export const sideOf = (seat) => (seat === 'N' || seat === 'S' ? 'NS' : 'EW');

export const SCORING_IMPLEMENTED = false;

/* ------------------------------------------------------------------ */
/* Determinism: the same seed always deals the same hands.             */
/* ------------------------------------------------------------------ */

/** mulberry32 â€” the same generator the other titles use. */
export function createRng(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function fullDeck() {
  const cards = [];
  for (const suit of SUITS) for (const rank of RANKS) cards.push({ suit, rank, id: `${suit}${rank}` });
  return cards;
}

export function shuffle(cards, rng) {
  const out = cards.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Deal four 13-card hands, thirteen at a time is not modelled â€” order is stable. */
export function deal(seed, dealer = 'N') {
  const deck = shuffle(fullDeck(), createRng(seed));
  const hands = { N: [], E: [], S: [], W: [] };
  let s = SEATS.indexOf(dealer);
  for (const card of deck) {
    hands[SEATS[s]].push(card);
    s = (s + 1) % 4;
  }
  for (const seat of SEATS) hands[seat].sort((a, b) => SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit) || RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank));
  return { hands, dealer };
}

/* ------------------------------------------------------------------ */
/* The auction                                                         */
/* ------------------------------------------------------------------ */

export const PASS = 'PASS';
export const DOUBLE = 'X';
export const REDOUBLE = 'XX';

/** A bid is `{level: 1..7, strain}`. Its rank orders bids for comparison. */
export const bidRank = (bid) => (bid.level - 1) * 5 + STRAINS.indexOf(bid.strain);

export function createAuction(dealer = 'N') {
  return { dealer, turn: dealer, calls: [], contract: null, doubled: 0, finished: false };
}

export function isBid(call) {
  return call && typeof call === 'object' && typeof call.level === 'number';
}

/** Is this bid higher than the highest bid so far? */
export function bidIsLegal(auction, bid) {
  if (auction.finished) return false;
  if (!bid || bid.level < 1 || bid.level > 7 || !STRAINS.includes(bid.strain)) return false;
  // calls holds {seat, call}; the predicate must look at the call itself.
  // Array.find passes the element, not the call, so ind(isBid) always failed.
  const highest = [...auction.calls].reverse().find((c) => isBid(c.call));
  if (!highest) return true;
  return bidRank(bid) > bidRank(highest.call);
}

export function applyCall(auction, call) {
  if (auction.finished) return { ok: false, reason: 'the auction is over' };
  const seat = auction.turn;

  // A bid must be validated BEFORE any next-auction state is built. An earlier
  // version checked it after constructing `next`, so a lower bid was "refused"
  // by a branch that had already accepted it.
  if (isBid(call)) {
    if (!bidIsLegal(auction, call)) {
      return { ok: false, reason: 'that bid is not higher than the last bid' };
    }
  }

  const next = {
    ...auction,
    calls: [...auction.calls, { seat, call }],
    turn: nextSeat(seat),
  };

  if (isBid(call)) {
    next.doubled = 0;
    return { ok: true, auction: next };
  }

  if (call === DOUBLE) {
    const highest = [...auction.calls].reverse().find((c) => isBid(c.call));
    if (!highest) return { ok: false, reason: 'there is nothing to double' };
    if (auction.doubled !== 0) return { ok: false, reason: 'that contract is already doubled' };
    if (sideOf(highest.seat) === sideOf(seat)) return { ok: false, reason: 'you cannot double your own side' };
    next.doubled = 1;
    return { ok: true, auction: next };
  }

  if (call === REDOUBLE) {
    if (auction.doubled !== 1) return { ok: false, reason: 'there is nothing to redouble' };
    const highest = [...auction.calls].reverse().find((c) => isBid(c.call));
    if (sideOf(highest.seat) !== sideOf(seat)) return { ok: false, reason: 'only the doubled side may redouble' };
    next.doubled = 2;
    return { ok: true, auction: next };
  }

  if (call === PASS) {
    // The auction ends on three consecutive passes after a bid, or four at the
    // start (a passed-out deal).
    const tail = next.calls.slice(-4).map((c) => c.call);
    const hasBid = next.calls.some((c) => isBid(c.call));
    const passes = tail.filter((c) => c === PASS).length;
    if ((hasBid && passes >= 3) || (!hasBid && passes >= 4)) {
      next.finished = true;
      const highest = [...next.calls].reverse().find((c) => isBid(c.call));
      next.contract = highest
        ? { level: highest.call.level, strain: highest.call.strain, declarer: highest.seat, doubled: auction.doubled }
        : null; // passed out
      // The declarer is the member of the winning side who first named the strain.
      if (next.contract) {
        const strain = next.contract.strain;
        const first = next.calls.find((c) => c.seat && isBid(c.call) && c.call.strain === strain &&
          sideOf(c.seat) === sideOf(highest.seat));
        if (first) next.contract.declarer = first.seat;
      }
    }
    return { ok: true, auction: next };
  }

  return { ok: false, reason: `unknown call: ${String(call)}` };
}

/* ------------------------------------------------------------------ */
/* Play                                                                */
/* ------------------------------------------------------------------ */

export function createPlay(contract, hands, leader) {
  return {
    contract,
    trump: contract && contract.strain !== 'NT' ? contract.strain : null,
    leader,
    turn: leader,
    trick: [],
    tricks: [],
    hands: Object.fromEntries(Object.entries(hands).map(([s, h]) => [s, h.slice()])),
    finished: false,
  };
}

/** Cards in hand that may legally be played now: you must follow suit if you can. */
export function legalPlays(play, seat) {
  const hand = play.hands[seat] || [];
  if (!play.trick.length) return hand.map((c) => c.id);
  const led = play.trick[0].card.suit;
  const following = hand.filter((c) => c.suit === led);
  return (following.length ? following : hand).map((c) => c.id);
}

export function playCard(play, seat, cardId) {
  if (play.finished) return { ok: false, reason: 'the game is over' };
  if (seat !== play.turn) return { ok: false, reason: 'not your turn' };
  const legal = legalPlays(play, seat);
  if (!legal.includes(cardId)) {
    const hand = play.hands[seat] || [];
    const held = hand.some((c) => c.id === cardId);
    return {
      ok: false,
      reason: held ? 'you must follow suit while you can' : 'that card is not in your hand',
    };
  }
  const hand = play.hands[seat].filter((c) => c.id !== cardId);
  const card = play.hands[seat].find((c) => c.id === cardId);
  const next = {
    ...play,
    hands: { ...play.hands, [seat]: hand },
    trick: [...play.trick, { seat, card }],
    turn: nextSeat(seat),
  };

  if (next.trick.length === 4) {
    const winner = trickWinner(next.trick, next.trump);
    const tricks = [...next.tricks, { cards: next.trick, winner }];
    const empty = SEATS.every((s) => next.hands[s].length === 0);
    return {
      ok: true,
      play: {
        ...next,
        tricks,
        trick: [],
        leader: winner,
        turn: winner,
        finished: empty,
      },
      trickWinner: winner,
    };
  }
  return { ok: true, play: next };
}

/** Highest card of the led suit, unless a trump was played. */
export function trickWinner(trick, trump) {
  const led = trick[0].card.suit;
  let best = trick[0];
  for (const entry of trick.slice(1)) {
    const isTrump = trump && entry.card.suit === trump && best.card.suit !== trump;
    const sameSuitHigher = entry.card.suit === best.card.suit &&
      RANKS.indexOf(entry.card.rank) > RANKS.indexOf(best.card.rank);
    const beatsLed = entry.card.suit === led && best.card.suit !== led;
    if (isTrump || sameSuitHigher || (beatsLed && !(trump && best.card.suit === trump))) best = entry;
  }
  return best.seat;
}

/** Tricks won by each side. */
export function trickCount(play) {
  const counts = { NS: 0, EW: 0 };
  for (const t of play.tricks) counts[sideOf(t.winner)] += 1;
  return counts;
}

/* ------------------------------------------------------------------ */
/* A modest opponent: follow suit, win cheaply, otherwise discard low.  */
/* ------------------------------------------------------------------ */

export function botPlay(play, seat = play.turn) {
  const legal = legalPlays(play, seat);
  if (!legal.length) return null;
  const hand = play.hands[seat];
  const byId = (id) => hand.find((c) => c.id === id);
  const value = (card) => {
    let v = RANKS.indexOf(card.rank);
    if (play.trump && card.suit === play.trump) v += 20;
    return v;
  };
  // If the trick is complete to my left, just play the lowest card.
  if (play.trick.length === 3) {
    return legal.map(byId).sort((a, b) => value(a) - value(b))[0].id;
  }
  return legal.map(byId).sort((a, b) => value(a) - value(b))[0].id;
}

export const descriptor = {
  id: 'bridge',
  title: 'Bridge',
  seats: 4,
  teams: [['N', 'S'], ['E', 'W']],
  scoringImplemented: SCORING_IMPLEMENTED,
};


