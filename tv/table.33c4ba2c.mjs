/**
 * table.mjs — the game view for a live Kadi table.
 *
 * The contract, exactly as the service will publish it via POST /deckmaster/state:
 *
 *   POST /deckmaster/state (auth) { playerId, gameId }
 *     -> { gameId, playerId, opponentId, started, gameOver, currentPlayerId,
 *          topCard, lastDirectiveCard, hand, drawCount, penaltyCount,
 *          requestedFamily, penaltyPlayerId, penaltyType, direction,
 *          blockedPlayerId, blockedCardType, turnHasPlayed,
 *          lastCardAnnounced, mustAnnounceLastCard, playerCardCounts,
 *          machinePlayerIds, winnerId }
 *
 * The game engine runs in LUGUTU; this module only renders what the engine
 * publishes. It does not reimplement rules, validate legality or decide
 * winners. It shows the engine's public state and sends the player's actions
 * back to the engine via POST /deckmaster/play, /deckmaster/draw, etc.
 *
 * The module is pure and dependency-injected: `createTableClient({ request, now })`
 * takes its transport and clock, so tests can drive every transition without
 * a server.
 */

const FAMILIES = ['Spade', 'Heart', 'Club', 'Diamond'];
const SYMBOLS = { Spade: '♠', Heart: '♥', Club: '♣', Diamond: '♦' };
const DIRECTIVES = ['play', 'pass', 'draw', 'finish', 'announce'];
const DIRECTIVE_LABELS = { play: 'Play', pass: 'Pass', draw: 'Draw', finish: 'Finish', announce: 'Announce' };

function familySymbol(family) {
  const symbols = { Spade: '♠', Heart: '♥', Club: '♣', Diamond: '♦' };
  return symbols[family] || family;
}

function directiveLabel(action) {
  const labels = { play: 'Play', pass: 'Pass', draw: 'Draw', finish: 'Finish', announce: 'Announce' };
  return labels[action] || action;
}

function cardLabel(card) {
  if (!card) return '—';
  const sym = { Spade: '♠', Heart: '♥', Club: '♣', Diamond: '♦' };
  return `${sym[card.family] || card.family} ${card.value}`;
}

function createTableClient({ request, now }) {
  const BASE = '/deckmaster';

  async function readJson(response) {
    const status = response && typeof response.status === 'number' ? response.status : 0;
    if (!response || typeof response.text !== 'function') {
      return { ok: false, reason: 'malformed', status };
    }
    const text = await response.text();
    if (!text) return { ok: false, reason: 'empty', status };
    try {
      return { ok: response.ok === true, status, body: JSON.parse(text) };
    } catch {
      return { ok: false, reason: 'malformed', status };
    }
  }

  return {
    async state(playerId, gameId) {
      const res = await fetch('/deckmaster/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ playerId, gameId }),
      });
      return readJson(res);
    },

    async play(playerId, gameId, cardId, family) {
      const res = await fetch('/deckmaster/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ playerId, gameId, cardId, family }),
      });
      return readJson(res);
    },

    async draw(playerId, gameId) {
      const res = await fetch('/deckmaster/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ playerId, gameId }),
      });
      return readJson(res);
    },

    async pass(playerId, gameId) {
      const res = await fetch('/deckmaster/pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ playerId, gameId }),
      });
      return readJson(res);
    },

    async finish(playerId, gameId) {
      const res = await fetch('/deckmaster/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ playerId, gameId }),
      });
      return readJson(res);
    },

    async announce(playerId, gameId) {
      const res = await fetch('/deckmaster/announce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ playerId, gameId }),
      });
      return readJson(res);
    },

    async pass(playerId, gameId) {
      const res = await fetch('/deckmaster/pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ playerId, gameId }),
      });
      return readJson(res);
    },

    async finish(playerId, gameId) {
      const res = await fetch('/deckmaster/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ playerId, gameId }),
      });
      return readJson(res);
    },

    async announce(playerId, gameId) {
      const res = await fetch('/deckmaster/announce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ playerId, gameId }),
      });
      return readJson(res);
    },

    async rematch(playerId, gameId) {
      const res = await fetch('/deckmaster/rematch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ playerId, gameId }),
      });
      return readJson(res);
    },
  };

  async function readJson(response) {
    const status = response && typeof response.status === 'number' ? response.status : 0;
    if (!response || typeof response.text !== 'function') {
      return { ok: false, reason: 'malformed', status };
    }
    const text = await response.text();
    if (!text) return { ok: false, reason: 'empty', status };
    try {
      return { ok: response.ok === true, status, body: JSON.parse(text) };
    } catch {
      return { ok: false, reason: 'malformed', status };
    }
  }
}

function renderCard(card) {
  if (!card) return '';
  const sym = { Spade: '♠', Heart: '♥', Club: '♣', Diamond: '♦' };
  return `<span class="card-family">${card.family}</span><span class="card-symbol">${SYMBOLS[card.family] || card.family}</span><span class="card-value">${card.value}</span>`;
}

function createTableView({ request, now, playerId, gameId, onAction }) {
  const client = createTableClient({ request, now });
  let polling = null;
  let currentState = null;

  async function refresh() {
    const res = await client.state(playerId, gameId);
    if (!res.ok) return;
    currentState = res.body;
    render();
    if (currentState.gameOver) stopPolling();
  }

  function startPolling() {
    if (polling) return;
    poll();
    polling = setInterval(poll, 1000);
  }

  function stopPolling() {
    if (polling) {
      clearInterval(polling);
      polling = null;
    }
  }

  async function poll() {
    await refresh();
  }

  function render() {
    if (!currentState) return;
    // Implementation would render the game state to the DOM
  }

  function onAction(action, cardId, family) {
    // Handle player actions
  }

  return { refresh, startPolling, stopPolling };
}

export { createTableClient, createTableView };
export { FAMILIES, SYMBOLS, DIRECTIVES, DIRECTIVE_LABELS };