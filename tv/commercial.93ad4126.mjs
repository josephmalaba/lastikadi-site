/**
 * commercial.mjs â€” the venue screen's commercial-configuration contract.
 *
 * THE THING THIS MODULE IS FOR
 * ----------------------------
 * The setup step on a venue screen has to be able to name, out loud, which of five
 * economic modes a table is. Not "paid or not": that single flag is exactly the
 * ambiguity the programme's governance lane was built to refuse, because a boolean
 * cannot be gated, hashed, logged or compared. So the screen names one of five
 * explicit classes and every downstream decision branches on the class itself.
 *
 *   FREE             no sponsor, no player money, no advertising
 *   AD_SUPPORTED_FREE advertising may be present; nobody is charged; rules unchanged
 *   SPONSORED_FREE   a sponsor funds entry; no player is ever charged
 *   PAID_ENTRY       a player pays to enter; no sponsor and no advertising
 *   MIXED_SPONSOR_PAID  sponsor funds and player money are both present
 *
 * Three more boundaries are enforced here rather than left to review:
 *
 *   1. ADVERTISING IS NOT SPONSORSHIP. `AD_SUPPORTED_FREE` may not carry a sponsor
 *      reference and `SPONSORED_FREE` may not carry an ad slot. Advertising
 *      inventory and sponsor funding are different counterparties, different
 *      contracts and different accounting (LAS-218 keeps sponsor revenue; LAS-208
 *      keeps ad presentation), so a configuration that carries both is a statement
 *      the screen is not entitled to make.
 *
 *   2. THE THREE FUND KINDS NEVER SUM. Sponsor funds, player funds and advertising
 *      are held in three separately named buckets and there is deliberately no
 *      function that adds them together. `totalFunds(kind)` demands the caller name
 *      the kind first, so "how much money is on this table" is not a question this
 *      module will answer, because the honest answer is three different numbers
 *      that do not belong to the same account.
 *
 *   3. THE SPONSOR QR'S VISIBILITY IS A DECISION, NOT A DEFAULT. `PUBLIC` means the
 *      code may be drawn on the shared display. `PRIVATE_OWNER` means it may not, and
 *      a shared display is by definition public â€” so under `PRIVATE_OWNER` this
 *      module renders no QR at all and says why. Defaulting to visible would publish
 *      a code the operator restricted.
 *
 * WHAT IS NOT BUILT AND NOT CLAIMED
 * --------------------------------
 * The sponsor and payment micro-UI is a CONTRACT here, not an implementation. Its
 * availability and its status are read from two real responses:
 *
 *   - the WILLE capability manifest (`GET /capabilities.json` on the fintech origin),
 *     which is generated out of WILLE's own library by scripts/emit-fintech.mjs; and
 *   - the table service's own configuration, which must carry the game\'s economic
 *     class and sponsor QR visibility of its own accord.
 *
 * MEASURED AT 2026-10-07, and this is the reason the module exists in this shape:
 *
 *   GET https://fintech.lastikadi.com/capabilities.json -> 200
 *     capabilities: WILLE.PURCHASE, WILLE.REFUND, QUERY_PURCHASE, QUERY_RECEIPT,
 *                   QUERY_ENTITLEMENT, QUERY_UNIT_ECONOMICS
 *
 * `WILLE.SPONSORED_ENTRY` is NOT in that list. WILLE admits it on the PR-0472 branch
 * (lastikadi-wille `e196ff3`, src/capabilities.ts) and that branch is not what is
 * published at fintech.lastikadi.com. So on the live surface today the sponsor
 * micro-UI is UNAVAILABLE, and this module says so rather than drawing a QR for a
 * capability the economic core does not publish.
 *
 *   GET https://api.lastikadi.com/portfolio -> 200
 *     kadi@0.0.3 (8 capabilities), shogi@0.0.1 (5 capabilities)
 *
 * Neither game carries a commercial block, and `GET /v2/api-docs` on the same
 * origin lists 24 `/deckmaster/*` paths and no lobby, economic or sponsor path at
 * all. So no configuration response names an economic class yet, which means every
 * mode other than FREE fails closed here â€” correctly, and for a reason an operator
 * can act on.
 *
 * The module is pure and dependency-injected. `createCommercialClient({ request })`
 * takes its transport, so tests/commercial.test.mjs drives every class, every
 * refusal, every malformed capability manifest and every fail-closed path without a
 * server, and without any of this having been run against a live sponsor payment.
 */

/* ------------------------------------------------------------ vocabulary ---- */

/**
 * The five economic classes, as the venue screen names them.
 *
 * `LUGUTU_CLASS` is the exact mapping to the governance lane's `EconomicClass`
 * constants (lastikadi-lugutu, `tz.co.lastikadi.governance.EconomicClass`, built in
 * the `feat/las-376-governed-setup-commercial-modes` lane at `8658bfa`). The screen\'s
 * vocabulary is shorter and it is a PRESENTATION name, not a second authority: every
 * request it builds carries `economicClass` in the governance spelling, so a table
 * created from this screen cannot be read back under a different name than the one
 * the governance hash was computed over.
 *
 * `REWARDED_AD` is deliberately NOT here. It exists as a governance constant and is
 * a different mechanic from `AD_SUPPORTED_FREE`; LAS-221 is a non-blocking option
 * that must not be activated by a venue screen.
 */
export const ECONOMIC_MODES = [
  'FREE',
  'AD_SUPPORTED_FREE',
  'SPONSORED_FREE',
  'PAID_ENTRY',
  'MIXED_SPONSOR_PAID',
];

export const LUGUTU_CLASS = Object.freeze({
  FREE: 'FREE',
  AD_SUPPORTED_FREE: 'AD_SUPPORTED_FREE',
  SPONSORED_FREE: 'SPONSOR_FUNDED_FREE_ENTRY',
  PAID_ENTRY: 'PLAYER_PAID_ENTRY',
  MIXED_SPONSOR_PAID: 'MIXED_PLAYER_SPONSOR',
});

/** The sponsor QR visibility vocabulary. There is no third value and no default. */
export const SPONSOR_QR_VISIBILITIES = ['PUBLIC', 'PRIVATE_OWNER'];

/** The capability WILLE must publish before any sponsor surface may be offered. */
export const SPONSOR_CAPABILITY = 'WILLE.SPONSORED_ENTRY';

/** The three fund kinds. Named separately, and never added together. */
export const FUND_KINDS = ['SPONSOR', 'PLAYER', 'ADVERTISING'];

export function isEconomicMode(value) {
  return ECONOMIC_MODES.includes(value);
}

export function isQrVisibility(value) {
  return SPONSOR_QR_VISIBILITIES.includes(value);
}

/**
 * What each class permits, in one place.
 *
 * `sponsor` and `advertising` say whether that counterpart may appear at all.
 * `playerCharge` says whether a player may be asked for money.
 */
export const MODE_RULES = Object.freeze({
  FREE: Object.freeze({ sponsor: false, playerCharge: false, advertising: false }),
  AD_SUPPORTED_FREE: Object.freeze({ sponsor: false, playerCharge: false, advertising: true }),
  SPONSORED_FREE: Object.freeze({ sponsor: true, playerCharge: false, advertising: false }),
  PAID_ENTRY: Object.freeze({ sponsor: false, playerCharge: true, advertising: false }),
  MIXED_SPONSOR_PAID: Object.freeze({ sponsor: true, playerCharge: true, advertising: false }),
});

/** The sentence the room reads for a class. Never a bare enum name. */
export function describeEconomicMode(mode) {
  switch (mode) {
    case 'FREE':
      return 'Free play. Nobody pays anything, and nothing is sold or advertised here.';
    case 'AD_SUPPORTED_FREE':
      return 'Free play with advertising. Play costs nothing and the rules do not change.';
    case 'SPONSORED_FREE':
      return 'Free entry funded by a sponsor. No player is ever charged.';
    case 'PAID_ENTRY':
      return 'Paid entry. A player pays to take a seat; no sponsor is attached.';
    case 'MIXED_SPONSOR_PAID':
      return 'Sponsor funding and player payments are both present on this table.';
    default:
      return 'This screen does not recognise the economic class the table service reported.';
  }
}

/* --------------------------------------------------------------- funds ------ */

/**
 * A three-bucket set whose balances have not been reported.
 */
export function emptyFunds() {
  return { SPONSOR: { confirmedMinor: null, currency: null }, PLAYER: { confirmedMinor: null, currency: null }, ADVERTISING: { confirmedMinor: null, currency: null } };
}

/**
 * The total for ONE named kind.
 *
 * There is no overload that defaults to "all of them". A caller that has not said
 * which money it is asking about gets a refusal, because the three kinds are held
 * by different counterparties and adding them would produce a number that means
 * nothing.
 */
export function totalFunds(funds, kind) {
  if (!FUND_KINDS.includes(kind)) {
    return { ok: false, reason: 'unknown-fund-kind', detail: `No fund kind named ${String(kind)}. Sponsor funds, player funds and advertising are never added together.` };
  }
  const bucket = funds?.[kind];
  if (!bucket || !Number.isInteger(bucket.confirmedMinor) || bucket.confirmedMinor < 0) {
    return { ok: false, reason: 'unreadable-funds', detail: `The ${kind} bucket was not reported as a whole number of minor units.` };
  }
  return { ok: true, kind, confirmedMinor: bucket.confirmedMinor, currency: bucket.currency ?? null };
}

/**
 * The three buckets, each named, so a screen can show three lines without ever
 * producing a fourth line that adds them.
 */
export function fundsBreakdown(funds) {
  return FUND_KINDS.map((kind) => {
    const t = totalFunds(funds, kind);
    return {
      kind,
      reported: t.ok,
      confirmedMinor: t.ok ? t.confirmedMinor : null,
      currency: t.ok ? t.currency : null,
      reason: t.ok ? null : t.reason,
    };
  });
}

function readFunds(funds) {
  const result = emptyFunds();
  for (const kind of FUND_KINDS) {
    const bucket = funds?.[kind];
    if (!bucket || typeof bucket !== 'object') continue;
    result[kind] = {
      confirmedMinor: Number.isInteger(bucket.confirmedMinor) && bucket.confirmedMinor >= 0
        ? bucket.confirmedMinor
        : null,
      currency: typeof bucket.currency === 'string' && /^[A-Z]{3}$/.test(bucket.currency)
        ? bucket.currency
        : null,
    };
  }
  return result;
}

/* ------------------------------------------------ configuration validation -- */

/**
 * Read a game's commercial configuration out of whatever the service reported.
 *
 * The commercial block is `game.commercial`, and it is absent on every game the live
 * table service publishes today. An absent block is not a FREE table â€” it is an
 * unreported one, and the two are deliberately not the same value.
 */
export function commercialConfiguration(game) {
  const block = game?.commercial;
  if (!block || typeof block !== 'object') return null;
  const mode = block.economicMode;
  if (!isEconomicMode(mode)) return null;
  const visibility = block.sponsorQrVisibility ?? null;
  if (visibility !== null && !isQrVisibility(visibility)) return null;
  return {
    economicMode: mode,
    sponsorQrVisibility: visibility,
    sponsorRef: typeof block.sponsorRef === 'string' && block.sponsorRef ? block.sponsorRef : null,
    advertisingAllowed: block.advertisingAllowed === true,
    playerEntry: block.playerEntry && typeof block.playerEntry === 'object'
      ? {
        amountMinor: Number.isInteger(block.playerEntry.amountMinor) ? block.playerEntry.amountMinor : null,
        currency: typeof block.playerEntry.currency === 'string' ? block.playerEntry.currency : null,
      }
      : null,
    configurationHash: typeof block.configurationHash === 'string' && block.configurationHash ? block.configurationHash : null,
    /*
     * The opaque sponsor code, if the service issued one.
     *
     * It is kept as an opaque token and nothing is derived from it: no amount, no
     * sponsor identity, no table secret. An absent code is an absent code, and
     * `sponsorQrPayload` refuses anything that is not an opaque token of the right
     * shape rather than encoding whatever arrived.
     */
    sponsorCode: typeof block.sponsorCode === 'string' && block.sponsorCode ? block.sponsorCode : null,
    sponsorStatus: typeof block.sponsorStatus === 'string' && block.sponsorStatus ? block.sponsorStatus : null,
    sponsorStatusSource: typeof block.sponsorStatusSource === 'string' && block.sponsorStatusSource ? block.sponsorStatusSource : null,
    funds: readFunds(block.funds),
  };
}

/**
 * Check a configuration against the class it claims, before any lobby is opened.
 *
 * Every refusal carries its own reason code. They are all distinct on purpose: a
 * screen that said only "not allowed" for a wrong-class configuration, a missing
 * sponsor reference and an unreadable amount would send an operator to the wrong
 * system three times.
 */
export function validateConfiguration(config) {
  if (!config) {
    return {
      ok: false,
      reason: 'commercial-configuration-absent',
      text: 'This table service reported no commercial configuration for this game, so this screen cannot name an economic class. It will not guess one.',
    };
  }
  const rules = MODE_RULES[config.economicMode];
  if (!rules) {
    return { ok: false, reason: 'unknown-economic-mode', text: 'This screen does not recognise the economic class that was reported.' };
  }

  // Advertising and sponsorship are different counterparties. A configuration that
  // carries both is refused rather than quietly preferring one of them.
  if (rules.advertising && config.sponsorRef) {
    return { ok: false, reason: 'sponsor-in-advertising-class', text: 'This table is configured as advertising-supported free and also names a sponsor. Those are different arrangements, so the configuration is refused.' };
  }
  if (!rules.advertising && config.advertisingAllowed) {
    return { ok: false, reason: 'advertising-outside-advertising-class', text: 'Advertising is switched on for a table whose economic class does not allow it.' };
  }
  // And the reverse: a class with no sponsor may not name one. Without this, a paid
  // table carrying a sponsor reference would validate, and the screen would then hold
  // a sponsor identity that no arrangement on this table accounts for.
  if (!rules.sponsor && config.sponsorRef) {
    return { ok: false, reason: 'sponsor-outside-sponsor-class', text: 'This table names a sponsor, but its economic class is not one that can carry a sponsor.' };
  }
  if (rules.sponsor && !config.sponsorRef) {
    return { ok: false, reason: 'sponsor-reference-required', text: 'This table is configured as sponsor-funded but names no sponsor, so nothing here is funded.' };
  }
  if (rules.playerCharge) {
    const entry = config.playerEntry;
    if (!entry) {
      return { ok: false, reason: 'player-entry-required', text: 'This table takes player payments but reports no player entry amount.' };
    }
    if (!Number.isInteger(entry.amountMinor) || entry.amountMinor <= 0) {
      return { ok: false, reason: 'player-entry-amount-unreadable', text: 'The player entry amount was not reported as a positive whole number of minor units, so this screen will not ask anyone to pay it.' };
    }
    if (typeof entry.currency !== 'string' || !/^[A-Z]{3}$/.test(entry.currency)) {
      return { ok: false, reason: 'player-entry-currency-unreadable', text: 'The player entry currency was not reported as a currency code, so this screen will not ask anyone to pay it.' };
    }
  } else if (config.playerEntry && Number.isInteger(config.playerEntry.amountMinor) && config.playerEntry.amountMinor > 0) {
    return { ok: false, reason: 'player-entry-outside-paid-class', text: 'This table reports a player entry amount but its economic class does not allow anyone to be charged.' };
  }

  if (rules.sponsor && config.sponsorQrVisibility === null) {
    return { ok: false, reason: 'sponsor-qr-visibility-required', text: 'A sponsor-funded table must say whether its sponsor code may be shown on a shared display. Until it does, no code is drawn.' };
  }

  return {
    ok: true,
    economicMode: config.economicMode,
    economicClass: LUGUTU_CLASS[config.economicMode],
    sponsorQrVisibility: config.sponsorQrVisibility,
    sponsorRef: config.sponsorRef,
    sponsorCode: config.sponsorCode ?? null,
    sponsorStatus: config.sponsorStatus ?? null,
    sponsorStatusSource: config.sponsorStatusSource ?? null,
    funds: config.funds ?? emptyFunds(),
    text: describeEconomicMode(config.economicMode),
  };
}

/* --------------------------------------------------------- sponsor the QR --- */

/**
 * The origin a sponsor code may be opened on.
 *
 * An allowlist of exactly the one origin, not a shape check. "Some https host" would
 * let a configuration send a room's scan to a third party, and the QR is the one thing
 * on this screen that a stranger acts on.
 */
export const SPONSOR_QR_ORIGIN = 'https://lastikadi.com';

/**
 * The only thing a sponsor QR is allowed to encode.
 *
 * A same-origin path plus an opaque code. No amount, no currency, no sponsor
 * identity, no payer field, no table secret â€” the code is the whole payload, so a
 * screen cannot leak an economic figure by drawing a QR, and a modified amount
 * cannot travel inside one.
 */
export function sponsorQrPayload(origin, opaqueCode) {
  if (origin !== SPONSOR_QR_ORIGIN) {
    return { ok: false, reason: 'bad-origin', detail: `A sponsor code may only be opened on ${SPONSOR_QR_ORIGIN}.` };
  }
  if (typeof opaqueCode !== 'string' || !/^[A-Za-z0-9_-]{8,64}$/.test(opaqueCode)) {
    return { ok: false, reason: 'bad-code', detail: 'The sponsor code was not an opaque token of the expected shape.' };
  }
  return { ok: true, text: `${origin}/wille/sponsor/${opaqueCode}`, containsEconomicData: false };
}

/**
 * Whether a sponsor QR may be drawn on THIS shared display.
 *
 * Three independent things must all be true, and each one alone is enough to refuse:
 *
 *   - the class is a sponsor class at all;
 *   - the visibility decision is `PUBLIC` â€” `PRIVATE_OWNER` means no shared
 *     display draws it, whatever else is true;
 *   - WILLE has published the sponsor capability.
 *
 * An absent, unreadable or wrong-shaped capability answer is treated as absent. A
 * manifest that cannot be parsed is not evidence of a capability.
 */
export function mayShowSponsorQr(validated, capabilities) {
  if (!validated?.ok) {
    return { show: false, reason: 'configuration-refused', text: 'No sponsor code is shown, because this table\'s commercial configuration was refused.' };
  }
  const rules = MODE_RULES[validated.economicMode];
  if (!rules.sponsor) {
    return { show: false, reason: 'not-a-sponsor-table', text: 'This table has no sponsor attached, so there is no sponsor code to show.' };
  }
  if (validated.sponsorQrVisibility !== 'PUBLIC') {
    return {
      show: false,
      reason: 'sponsor-qr-private',
      text: 'This table\'s sponsor code is restricted to its owner, so it is not shown on a shared display.',
    };
  }
  const admitted = Array.isArray(capabilities?.capabilities) && capabilities.capabilities.includes(SPONSOR_CAPABILITY);
  if (!admitted) {
    return {
      show: false,
      reason: 'sponsor-capability-absent',
      text: 'The economic service has not published the sponsor capability this screen needs, so no sponsor code is offered.',
    };
  }
  return { show: true, reason: null, text: 'Sponsor code shown. It carries no amount and no payment details.' };
}

/* ------------------------------------------------------- the WILLE client --- */

/**
 * Where the WILLE capability manifest is read from.
 *
 * fintech.lastikadi.com/capabilities.json is generated out of WILLE's own compiled
 * library, so it cannot drift from what the economic core supports. It is a read of
 * a public manifest and nothing else: it carries no caller identity, and WILLE's own
 * manifest states it makes no claim about any caller's permission, so this client
 * treats it as evidence of support and never as evidence of authorisation.
 */
export const WILLE_CAPABILITIES_PATH = '/capabilities.json';

/**
 * The venue screen's commercial client.
 *
 * @param {object} deps
 *   request  - (url, init) => Promise<Response>. Injected so tests drive any answer.
 *   willeOrigin    - the economic service's published capability manifest.
 *   tableService   - the table service that owns the commercial configuration.
 */
export function createCommercialClient({ request, willeOrigin = 'https://fintech.lastikadi.com', tableService = 'https://api.lastikadi.com' } = {}) {
  if (typeof request !== 'function') throw new Error('createCommercialClient needs a request function');

  const state = { capabilities: null, capabilitiesFailure: null, game: null, configuration: null, validation: null, sponsor: null };

  const readJson = async (response) => {
    const status = response && typeof response.status === 'number' ? response.status : 0;
    if (!response || typeof response.text !== 'function') return { ok: false, reason: 'malformed', status };
    let text = '';
    try {
      text = await response.text();
    } catch {
      return { ok: false, reason: 'malformed', status };
    }
    if (!text) return { ok: false, reason: 'empty', status };
    try {
      return { ok: response.ok === true, status, body: JSON.parse(text) };
    } catch {
      return { ok: false, reason: 'malformed', status };
    }
  };

  const call = async (url, init) => {
    let response;
    try {
      response = await request(url, init);
    } catch {
      return { ok: false, reason: 'unreachable', status: 0 };
    }
    return readJson(response);
  };

  /**
   * Read WILLE's published capability manifest.
   *
   * Any failure â€” a 404, an HTML error page, an unreachable host, a body with no
   * `capabilities` array â€” leaves the capability ABSENT. There is no path here that
   * treats an unreadable manifest as permission.
   */
  async function loadCapabilities() {
    const result = await call(willeOrigin + WILLE_CAPABILITIES_PATH, { method: 'GET' });
    if (!result.ok || !result.body) {
      state.capabilities = null;
      /*
       * The status decides first, the same distinction lobby.mjs draws: a 404 carrying
       * an HTML error page means the endpoint is absent, which an operator fixes by
       * publishing it, while a 200 whose body is not JSON means the surface answered
       * wrongly. Both fail closed; they are reported apart because they are different
       * problems with different owners.
       */
      const absent = result.status === 404 || result.status === 405 || result.status === 501;
      state.capabilitiesFailure = {
        reason: absent ? 'capabilities-absent' : result.reason === 'malformed' ? 'capabilities-malformed' : 'capabilities-unavailable',
        text: absent
          ? "The economic service does not publish a capability list at the address this screen reads, so no sponsor or payment surface is offered."
          : "The economic service's published capability list could not be read, so this screen offers no sponsor or payment surface.",
      };
      return { ok: false, failure: state.capabilitiesFailure };
    }
    const list = result.body.capabilities;
    if (!Array.isArray(list)) {
      state.capabilities = null;
      state.capabilitiesFailure = { reason: 'capabilities-malformed', text: 'The economic service published a capability answer with no capability list in it, so no sponsor or payment surface is offered.' };
      return { ok: false, failure: state.capabilitiesFailure };
    }
    state.capabilities = { manifestVersion: result.body.manifestVersion ?? null, capabilities: list };
    state.capabilitiesFailure = null;
    return { ok: true, capabilities: state.capabilities };
  }

  /**
   * Read one game's commercial configuration from the table service's own portfolio.
   *
   * The portfolio is the same call the game picker already makes, so a game cannot be
   * listed here and be commercially configured somewhere else.
   */
  async function loadGame(gameId) {
    const result = await call(tableService + '/portfolio', { method: 'GET' });
    if (!result.ok || !result.body || !Array.isArray(result.body.games)) {
      state.game = null;
      state.configuration = null;
      state.validation = null;
      state.sponsor = { available: false, reason: 'portfolio-unavailable', text: 'This screen could not read the table service\'s game list, so it cannot show any commercial configuration.' };
      return { ok: false, failure: state.sponsor };
    }
    const game = result.body.games.find((g) => g && g.gameId === gameId) ?? null;
    state.game = game;
    state.configuration = game ? commercialConfiguration(game) : null;
    state.validation = validateConfiguration(state.configuration);
    // Every refusal keeps its own sentence, and the sponsor surface is derived from
    // the SAME validation rather than re-decided here, so the code on the screen and
    // the sentence under it cannot disagree.
    state.sponsor = state.validation.ok
      ? sponsorMicroUi(state.validation, state.capabilities)
      : { available: false, reason: state.validation.reason, text: state.validation.text };
    return { ok: state.validation.ok, validation: state.validation, sponsor: state.sponsor };
  }

  return {
    loadCapabilities,
    loadGame,
    get capabilities() { return state.capabilities; },
    get capabilitiesFailure() { return state.capabilitiesFailure; },
    get configuration() { return state.configuration; },
    get validation() { return state.validation; },
    get sponsor() { return state.sponsor; },
    /** The opaque sponsor code the service issued, or null. Never derived. */
    get sponsorCode() { return state.validation?.ok ? state.validation.sponsorCode ?? null : null; },
    /** The sponsor QR decision for the loaded table, recomputed from live state. */
    get sponsorQr() { return mayShowSponsorQr(state.validation, state.capabilities); },
    /** One line for the footer. Never a claim the services did not make. */
    get summary() {
      if (state.capabilitiesFailure) return state.capabilitiesFailure.text;
      if (!state.game) return 'No commercial configuration has been read yet.';
      if (!state.validation?.ok) return state.validation.text;
      return state.validation.text;
    },
  };
}

/**
 * The sponsor/payment micro-UI contract, as this screen consumes it.
 *
 * Available means BOTH: the economic service publishes `WILLE.SPONSORED_ENTRY`, and
 * this table's own configuration is a sponsor class whose code may be shown. Status
 * is never inferred from a scan, a redirect or a browser success screen â€” the only
 * status this module will ever show is the state the service reported, and an
 * absent status is reported as absent.
 */
export function sponsorMicroUi(validated, capabilities) {
  if (!validated?.ok) {
    return { available: false, reason: validated?.reason ?? 'configuration-refused', text: validated?.text ?? 'No sponsor surface is offered for this table.' };
  }
  const rules = MODE_RULES[validated.economicMode];
  if (!rules.sponsor) {
    return { available: false, reason: 'not-a-sponsor-table', text: 'This table has no sponsor attached, so there is no sponsor surface to offer.' };
  }
  const admitted = Array.isArray(capabilities?.capabilities) && capabilities.capabilities.includes(SPONSOR_CAPABILITY);
  if (!admitted) {
    return {
      available: false,
      reason: 'sponsor-capability-absent',
      text: `The economic service has not published ${SPONSOR_CAPABILITY}, so no sponsor surface is offered on this table.`,
    };
  }
  return {
    available: true,
    reason: null,
    capability: SPONSOR_CAPABILITY,
    visibility: validated.sponsorQrVisibility,
    status: validated.sponsorStatus ?? null,
    statusSource: validated.sponsorStatusSource ?? null,
    text: 'Sponsor surface available. Payment happens on the payer\'s phone; this screen never handles money.',
  };
}

/**
 * Turn a sponsor status the service reported into the sentence a room reads.
 *
 * Two rules, both of which exist because the alternative is a lie:
 *   - `FUNDS_CONFIRMED` and `SETTLED` are the only states that say funded. A browser
 *     redirect, a client callback or an authorisation hold is not available money
 *     (LAS-218 acceptance 7).
 *   - an unrecognised or absent status is `UNCONFIRMED`, never optimistically
 *     rendered as success.
 */
export function describeSponsorStatus(status, source) {
  if (typeof status !== 'string' || !status) {
    return { funded: false, label: 'Sponsor status not reported', code: 'NOT_REPORTED' };
  }
  if (status !== 'FUNDS_CONFIRMED' && status !== 'SETTLED') {
    return { funded: false, label: `Payment processing (${status})`, code: status };
  }
  if (source !== 'provider-evidence') {
    // A funded state that did not come from authenticated provider evidence is
    // exactly the case the directive forbids being treated as confirmation.
    return { funded: false, label: 'Payment processing (confirmation not yet evidenced)', code: 'UNCONFIRMED' };
  }
  return { funded: true, label: 'Sponsored', code: status };
}