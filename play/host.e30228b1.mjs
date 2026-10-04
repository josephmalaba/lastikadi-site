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

  /**
   * The loaded runtime's own identity, as the runtime reports it.
   *
   * This is the one version fact that does not come from the client's own words: the
   * bytes that were actually served say which runtime interface they implement. The
   * play client compares it against the interface version it declares it is pinned to
   * and refuses to deal if they differ (play/identity.mjs, planForRuntime), so a stale
   * runtime bundle cannot be played as though it were the declared one.
   */
  get identity() {
    try {
      const parsed = JSON.parse(this.rt.identityJson());
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch { return null; }
  }

  get ruleVersion() {
    const id = this.identity;
    return id && typeof id.schemaVersion === 'string' ? id.schemaVersion : 'unknown';
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
      // The offline engine reports legality itself, so the client may mark cards. The
      // network authority cannot and says so; the page must not treat the two the same.
      legalReported: true,
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
 * The game server over REST — a BOUND adapter.
 *
 * It is constructed with a table that has already been opened (play/session.mjs), and it
 * never opens one itself. That split is deliberate: opening a table needs an account, the
 * caller's own numeric id and the commissioned machine seat, and those are facts about the
 * service rather than about a game. Keeping them in one module that a test can drive end
 * to end is what stops a half-configured authority from dealing a card.
 *
 * The server wire contract, read from its own DTOs and MEASURED against production on
 * 2026-10-04 rather than taken from a comment:
 *
 *   POST /deckmaster/start, /state, /draw, /finish, /announce, /pass
 *        PlayerRequest      { playerId, gameId, playerCount, playerIds, machinePlayerIds }
 *   POST /deckmaster/play
 *        GameActionRequest  the same, plus { cardName, requestedFamily, finishTurn }
 *
 * Every one of them requires `Authorization: Bearer <token>`; without it the service
 * answers 401. The state it returns carries:
 *
 *   gameId, playerId, opponentId, started, gameOver, currentPlayerId, topCard,
 *   lastDirectiveCard, hand (Card[]), drawCount, penaltyCount, requestedFamily,
 *   penaltyPlayerId, penaltyType, direction, blockedPlayerId, blockedCardType,
 *   turnHasPlayed, lastCardAnnounced, mustAnnounceLastCard, playerCardCounts,
 *   machinePlayerIds, winnerId
 *
 * TWO THINGS THAT COMMENT USED TO GET WRONG, both of which made this class unusable and
 * neither of which announced itself:
 *
 *   1. `playerId` was the constant 1 and no Authorization header was sent at all, so every
 *      call was refused. The seat the caller holds is now read from the account, in
 *      play/session.mjs.
 *   2. The machine seat was the constant 2. The deployed seat rule refuses a machine seat
 *      unless the account really is a non-human principal, and account 2 is a human one, so
 *      the table was refused even after (1) was fixed. The seat is now the account the
 *      service accepts, declared in play/identity.mjs and measured live.
 *
 * WHAT THE SERVER DOES NOT REPORT, stated because the client must not pretend otherwise:
 * there is no `legalCards` in the state, and no canDraw/canPass/canFinish flags. So this
 * authority reports `legality: 'attempt'` — the client may not mark a card playable,
 * because nothing has told it which cards are. Every card is offered as a REQUEST and the
 * engine's own refusal is what the guest is shown. That is the host contract's own rule
 * ("client-side rule use is advisory/predictive for network games; the server result is
 * authoritative") applied honestly, rather than a second opinion about legality computed
 * here.
 */
export class NetworkAuthority extends GameAuthority {
  /** Every game call lives under this prefix on the service. Missing it is a 404, not a game. */
  static DECKMASTER = '/deckmaster';

  /**
   * @param {string} baseUrl  the table service origin
   * @param {{token:string, table:{tableId:number, accountId:number, machineId:number, seats:number[]}}} opts
   */
  constructor(baseUrl, opts = {}) {
    super();
    this.base = baseUrl.replace(/\/$/, '');
    this.token = opts.token || null;
    this.table = opts.table || null;
    this.seat = this.table ? this.table.accountId : null;
    this.nextTableId = opts.nextTableId || null;
    this.lastState = null;
    this.reachable = false;
  }

  get provenance() { return { kind: 'network', id: this.base }; }

  /**
   * The body every call about this table carries. Identical to the one that opened it:
   * the service refuses a caller who is not in the seats it names, so a body that
   * disagreed with the table would be refused rather than silently seating somebody else.
   */
  #seats() {
    return {
      playerId: this.table.accountId,
      gameId: this.table.tableId,
      playerCount: this.table.seats.length,
      playerIds: this.table.seats.slice(),
      machinePlayerIds: [this.table.machineId],
    };
  }

  async #post(path, body, { method = 'POST' } = {}) {
    const headers = { 'content-type': 'application/json' };
    if (this.token) headers.authorization = `Bearer ${this.token}`;
    /*
     * The `/deckmaster` prefix belongs here, once. It used to be absent from every call —
     * the adapter posted to /start and /state on the origin, which are not routes, so even
     * a signed-in call was answered 404 "Not Found". That failure looked like a service
     * that was down and was reported as one. tests/session.test.mjs §6.1 fails if the
     * prefix goes missing again.
     */
    const r = await fetch(this.base + NetworkAuthority.DECKMASTER + path, {
      method,
      headers,
      body: method === 'GET' ? undefined : JSON.stringify(body ?? {}),
    });
    let parsed = null;
    try { parsed = await r.json(); } catch { parsed = null; }
    if (!r.ok) {
      // The service's own words, not a code. "Card cannot be played" is a fact about the
      // game and the guest is owed it verbatim.
      const reason = parsed && typeof parsed === 'object'
        ? (parsed.error || parsed.message || null) : null;
      throw new Error(reason || `${path} -> HTTP ${r.status}`);
    }
    return parsed;
  }

  /**
   * Is the service able to take game traffic?
   *
   * `/readiness` is the endpoint that answers that, and it is public. This used to ask
   * `/admin/dashboard`, which requires the operator role — so an unsigned-in screen got
   * 401 every time and the client reported "the game server is not reachable" while the
   * service was perfectly healthy. Blaming the transport for a client defect is a
   * measurement failure, and it hid the real one for as long as it did.
   */
  async probe() {
    try {
      const r = await fetch(this.base + '/readiness', { method: 'GET' });
      let up = false;
      try { const body = await r.json(); up = r.status === 200 && body && body.status === 'UP'; } catch { up = false; }
      this.reachable = up;
    } catch { this.reachable = false; }
    return this.reachable;
  }

  /** Open means "read the table that was already opened", never "start a new one". */
  async open() {
    const s = await this.#post('/state', this.#seats());
    this.lastState = s;
    return this.#shape(s);
  }

  async view(seat) {
    const s = await this.#post('/state', this.#seats());
    this.lastState = s;
    return this.#shape(s, seat === undefined ? this.seat : seat);
  }

  async act(seat, action, args = {}) {
    const path = {
      play: '/play', draw: '/draw', pass: '/pass', finish: '/finish',
      announce: '/announce', announceLastCard: '/announce',
    }[action];
    if (!path) return { ok: false, error: `unknown action ${action}` };
    const body = { ...this.#seats(), ...args };
    if (action === 'play' && args.cardName) body.cardName = args.cardName;
    if (args.requestedFamily) body.requestedFamily = args.requestedFamily;
    if (action === 'finish') body.finishTurn = true;
    try {
      const s = await this.#post(path, body);
      this.lastState = s;
      return { ok: true, winnerId: s.winnerId ?? 0 };
    } catch (error) {
      // A refusal from the engine is an answer, not a failure of the client: the guest is
      // shown the engine's own sentence and the board is re-read.
      return { ok: false, error: (error && error.message) || 'the service refused that move' };
    }
  }

  #shape(s, seat) {
    const me = seat === undefined || seat === null ? this.seat : seat;
    const names = (s.hand || []).map((card) => (typeof card === 'string' ? card : card && card.cardName)).filter(Boolean);
    return {
      hand: names,
      // Not reported by this authority. See the class comment: an empty list here would
      // read as "nothing is playable", which is a claim the server never made.
      legalCards: [],
      legalReported: false,
      topCard: s.topCard || null,
      turnHasPlayed: !!s.turnHasPlayed,
      mustAnnounce: !!s.mustAnnounceLastCard,
      blocked: s.blockedPlayerId === me,
      penalty: s.penaltyPlayerId === me ? (s.penaltyCount || 0) : 0,
      request: s.requestedFamily || '',
      over: !!s.gameOver,
      winnerId: s.winnerId ?? 0,
      drawCount: s.drawCount ?? 0,
      counts: s.playerCardCounts || {},
      direction: s.direction ?? 1,
      requestedFamily: s.requestedFamily || '',
      isTurn: s.currentPlayerId === me,
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
