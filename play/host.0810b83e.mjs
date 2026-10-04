/**
 * the company Games — client host.
 *
 * The reusable layer between a game's rules authority and whatever is drawing
 * the screen. Deliberately free of DOM, so the same host runs in the browser,
 * in a TV app, and under a test.
 *
 * Why this exists: `UI_BEHAVIOR` is not the rules. The host
 * owns the loop — whose turn it is, what is legal, what just happened — and
 * asks the authority for every one of those answers. It never decides legality
 * itself. That is what lets every title share one host.
 *
 * Two authorities implement the same interface:
 *
 *   LocalAuthority   the published Kadi runtime, offline. Practice and any
 *                    single-device play. No network at all.
 *   NetworkAuthority the game server over REST. The authoritative host for network play
 *                    (the host contract: client-side rule use is advisory/predictive
 *                    for network games; the server result is authoritative).
 *
 * The host is written against the interface, so adding a game or moving a game
 * from local to network does not change the client.
 */

/** The surface every authority must provide. */
export class GameAuthority {
  /** @returns {Promise<{seatIds:number[], currentSeat:number, machineSeats:number[], over:boolean, winnerId:number}>} */
  async open() { throw new Error('not implemented'); }
  /** @returns {Promise<{hand:string[], legalCards:string[], topCard:object|null, turnHasPlayed:boolean,
   *   mustAnnounce:boolean, blocked:boolean, penalty:number, request:string, over:boolean,
   *   winnerId:number, drawCount:number, counts:object, direction:number, requestedFamily:string}>} */
  async view(seat) { throw new Error('not implemented'); }
  /** @returns {Promise<{ok:boolean, error?:string, winnerId?:number}>} */
  async act(seat, action, args = {}) { throw new Error('not implemented'); }
  /** Identifies the authority for provenance and for honest UI wording. */
  get provenance() { return { kind: 'unknown', id: 'unknown' }; }
  /** Rule version this authority is pinned to, for provenance. */
  get ruleVersion() { return 'unknown'; }
}

/* ------------------------------------------------------------------ */
/* Authority: the published Kadi runtime, offline                      */
/* ------------------------------------------------------------------ */

export class LocalAuthority extends GameAuthority {
  /**
   * @param {Function} KadiRuntimeJsCtor the canonical constructor
   * @param {{gameId?:number, entropy?:string, human?:number, machine?:number}} opts
   */
  constructor(KadiRuntimeJsCtor, opts = {}) {
    super();
    this.Ctor = KadiRuntimeJsCtor;
    this.gameId = opts.gameId ?? 7;
    this.entropy = opts.entropy ?? String(Date.now());
    this.human = opts.human ?? 1;
    this.machine = opts.machine ?? 2;
    this.rt = null;
  }

  get provenance() { return { kind: 'local', id: 'kadi-runtime-js' }; }

  get ruleVersion() {
    try { return JSON.parse(this.rt.identityJson()).schemaVersion; } catch { return 'unknown'; }
  }

  async open() {
    this.rt = new this.Ctor(this.gameId, this.entropy, this.human, this.machine);
    this.rt.initializeJson('practice', '{}', '[]');
    return {
      seatIds: this.rt.playerIds(),
      currentSeat: this.rt.currentPlayerId(),
      machineSeats: this.rt.machineIds(),
      over: this.rt.winnerId() !== 0,
      winnerId: this.rt.winnerId(),
    };
  }

  async view(seat) {
    const dto = JSON.parse(this.rt.stateDtoJson(seat));
    const p = JSON.parse(this.rt.queryJson('clientTurnProfile', JSON.stringify({ playerId: seat }))).payload;
    const legal = this.rt.legalCards(seat) || [];
    const isTurn = this.rt.isHumanTurn();
    const mustAnnounce = !!p.mustAnnounceLastCard;
    const choosingFamily = p.requestedFamily === 'CHOICE';
    // `legalCards` reports whether a card is playable in isolation. It does not
    // carry the turn context, and it does not distinguish a wild that still
    // needs a target from one that plays directly. Both gaps produce a card the
    // authority then rejects, so the host narrows the list:
    //
    //   - while the last-card announcement is pending, the engine refuses every
    //     play;
    //   - while a family choice is outstanding, the answer is a family, not a card;
    //   - on a fresh turn a Jack/Joker needs a family named WITH it, so it is
    //     reported separately as a choice-bearing play rather than a plain one.
    //
    // None of this decides rules. It applies turn state the authority already
    // reported to the authority's own list.
    const canAct = isTurn && !mustAnnounce && !choosingFamily;
    const isWild = (name) => /_J$/.test(name) || /^Joker/.test(name);
    const freshTurn = !p.turnHasPlayed;
    const playable = canAct ? legal.filter((c) => !(freshTurn && isWild(c))) : [];
    const needsFamily = canAct ? legal.filter((c) => freshTurn && isWild(c)) : [];
    return {
      hand: (dto.hand || []).map((c) => c.cardName),
      legalCards: playable,
      wildCards: needsFamily,
      legalCardsInIsolation: legal,
      topCard: dto.topCard || null,
      turnHasPlayed: !!p.turnHasPlayed,
      mustAnnounce,
      choosingFamily,
      blocked: p.blockedPlayerId === seat,
      penalty: p.penaltyTargetId === seat ? (p.penaltyCount || 0) : 0,
      request: p.requestedFamily || '',
      over: !!dto.gameOver,
      winnerId: this.rt.winnerId(),
      drawCount: dto.drawCount ?? 0,
      counts: dto.playerCardCounts || {},
      direction: dto.direction ?? 1,
      requestedFamily: p.requestedFamily || '',
      canDraw: !!p.canDraw,
      canPass: !!p.canPass,
      canFinish: !!p.canFinish,
      canAnnounce: !!p.canAnnounce,
      isTurn,
    };
  }

  async act(seat, action, args = {}) {
    const tokens = { playerId: seat, ...args };
    const env = JSON.parse(this.rt.executeJson(action, JSON.stringify(tokens)));
    if (env.status !== 'ok') {
      return { ok: false, error: (env.errors || []).join('; ') || 'rejected' };
    }
    return { ok: true, winnerId: this.rt.winnerId() };
  }

  /** Let an agent seat act. Returns true if the machine acted. */
  machineReady() { return this.rt.machineTurnReady(); }
  async machineTurn() { return this.act(this.machine, 'machineTurn'); }

  /**
   * Name a family for a Jack. The candidates are the canonical six the engine
   * itself defines; this is not a local rule, it is the engine's own vocabulary
   * surfaced so a UI can offer it.
   */
  static JACK_CALLS = ['Heart', 'Kisu', 'Mavi', 'Spade', 'Special', 'Free'];
  async chooseFamily(seat, family) {
    return this.act(seat, 'chooseFamily', { family });
  }
}

/* ------------------------------------------------------------------ */
/* Authority: the game server over REST                                         */
/* ------------------------------------------------------------------ */

/**
 * the server wire contract, read from its own DTOs:
 *   PlayerRequest      { playerId, gameId, playerCount, machinePlayerIds }
 *   GameActionRequest  { gameId, playerId, cardName, requestedFamily,
 *                        finishTurn, lastCardAnnounced, playerCount,
 *                        machinePlayerIds }
 * and the GameStateDto returned by the interface dependency.
 *
 * IMPORTANT, and stated precisely because the two halves differ:
 *
 * The game server is live at api.lastikadi.com, and multiplayer has been verified
 * end to end against it — two independent accounts signing in, sharing one game,
 * and observing each other's moves, with the server refusing both an illegal card
 * and an attempt to act as another player.
 *
 * That verification drove the REST endpoints directly. THIS adapter class has not
 * itself been exercised against the live server, so it must not be presented as
 * working multiplayer until it has been. Two things to settle when it is:
 *
 *   1. `seat` must be the caller's own account id, not an arbitrary seat number.
 *      The server rejects a request whose playerId is not the authenticated
 *      account, so a default of 1 only works for the account with id 1.
 *   2. The game's seats must be sent explicitly (`playerIds`), because the server
 *      otherwise seats 1..playerCount, which names seats no real account holds.
 */
export class NetworkAuthority extends GameAuthority {
  constructor(baseUrl, opts = {}) {
    super();
    this.base = baseUrl.replace(/\/$/, '');
    this.seat = opts.seat ?? 1;
    this.gameId = opts.gameId ?? 7;
    this.playerCount = opts.playerCount ?? 2;
    this.machinePlayerIds = opts.machinePlayerIds ?? [];
    this.lastState = null;
    this.reachable = false;
  }

  get provenance() { return { kind: 'network', id: this.base }; }

  async #post(path, body) {
    const r = await fetch(this.base + path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`${path} -> HTTP ${r.status}`);
    return r.json();
  }

  async probe() {
    try {
      const r = await fetch(this.base + '/admin/dashboard', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
      this.reachable = r.ok;
    } catch { this.reachable = false; }
    return this.reachable;
  }

  async open() {
    const s = await this.#post('/start', {
      playerId: this.seat, gameId: this.gameId,
      playerCount: this.playerCount, machinePlayerIds: this.machinePlayerIds,
    });
    this.lastState = s;
    return this.#shape(s);
  }

  async view(seat) {
    const s = this.lastState || await this.#post('/state', {
      playerId: seat, gameId: this.gameId,
      playerCount: this.playerCount, machinePlayerIds: this.machinePlayerIds,
    });
    this.lastState = s;
    return this.#shape(s, seat);
  }

  async act(seat, action, args = {}) {
    const path = { play: '/play', draw: '/draw', pass: '/pass', finish: '/finish', announce: '/announce', announceLastCard: '/announce' }[action];
    if (!path) return { ok: false, error: `unknown action ${action}` };
    const body = {
      gameId: this.gameId, playerId: seat,
      playerCount: this.playerCount, machinePlayerIds: this.machinePlayerIds,
      ...args,
    };
    if (action === 'play' && args.cardName) body.cardName = args.cardName;
    if (args.requestedFamily) body.requestedFamily = args.requestedFamily;
    if (action === 'finish') body.finishTurn = true;
    const s = await this.#post(path, body);
    this.lastState = s;
    return { ok: true, winnerId: s.winnerId ?? 0 };
  }

  #shape(s, seat) {
    return {
      hand: s.hand || [],
      legalCards: s.legalCards || [],
      topCard: s.topCard || null,
      turnHasPlayed: !!s.turnHasPlayed,
      mustAnnounce: !!s.mustAnnounceLastCard,
      blocked: s.blockedPlayerId === (seat ?? this.seat),
      penalty: s.penaltyPlayerId === (seat ?? this.seat) ? (s.penaltyCount || 0) : 0,
      request: s.requestedFamily || '',
      over: !!s.gameOver,
      winnerId: s.winnerId ?? 0,
      drawCount: s.drawCount ?? 0,
      counts: s.playerCardCounts || {},
      direction: s.direction ?? 1,
      requestedFamily: s.requestedFamily || '',
      isTurn: s.currentPlayerId === (seat ?? this.seat),
      currentSeat: s.currentPlayerId,
    };
  }
}

/* ------------------------------------------------------------------ */
/* The host                                                            */
/* ------------------------------------------------------------------ */

/**
 * Drives a game against any authority and reports what changed. Contains no
 * rules and no DOM.
 */
export class GameHost {
  constructor(authority, opts = {}) {
    this.authority = authority;
    this.localSeat = opts.localSeat ?? 1;
    this.log = [];
    this.state = null;
  }

  async start() {
    const opened = await this.authority.open();
    this.state = opened;
    this.log.push({ event: 'open', ...opened });
    /*
     * Let agent seats move before returning, because the opening seat is not always
     * the human's.
     *
     * `act` already settles agents after a human action, but `start` did not, so a
     * game whose first turn belongs to a machine simply stopped there. Kadi, Go and
     * Shogi all open on the human seat, so none of them revealed it; Bridge does,
     * because the dealer is a machine and the auction starts with the dealer.
     *
     * Found by Bridge, fixed for every game here rather than worked around in the
     * Bridge page, because the next title with a machine-first opening would hit the
     * same wall. Where the human opens, machineReady() is already false and this is
     * a no-op.
     */
    await this.settleAgents();
    return opened;
  }

  async view(seat = this.localSeat) {
    return this.authority.view(seat);
  }

  /** Perform a human action, then let any agent seats respond. */
  async act(action, args = {}, seat = this.localSeat) {
    const res = await this.authority.act(seat, action, args);
    this.log.push({ event: 'act', seat, action, args, ok: res.ok, error: res.error });
    if (!res.ok) return res;
    await this.settleAgents();
    return res;
  }

  /**
   * Let agent seats take their turn until control returns to a human seat or
   * the game ends. Bounded so a misbehaving authority cannot spin.
   */
  async settleAgents(maxSteps = 64) {
    if (typeof this.authority.machineReady !== 'function') return;
    let steps = 0;
    while (!this.state?.over && this.authority.machineReady() && steps++ < maxSteps) {
      const r = await this.authority.machineTurn();
      this.log.push({ event: 'agent', action: 'machineTurn', ok: r.ok, error: r.error });
      if (!r.ok) break;
      const opened = await this.authority.view(this.localSeat);
      this.state = { ...this.state, over: opened.over, winnerId: opened.winnerId };
    }
  }

  /** A plain-language summary of the authority, for honest UI wording. */
  describeAuthority() {
    const p = this.authority.provenance;
    return p.kind === 'network'
      ? { label: 'Network game', detail: p.id }
      : { label: 'Practice (offline)', detail: 'no network used' };
  }
}
