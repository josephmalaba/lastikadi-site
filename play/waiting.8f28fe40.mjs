/**
 * play/waiting.mjs — the table a scan names, and the one countdown that waits for it.
 *
 * THE DEFECT THIS EXISTS FOR. A scan used to name a GAME and nothing else, so every scan
 * opened its own private table immediately: no waiting state existed anywhere in the client
 * (the word `waiting` occurred 0 times), there was nothing to count down, and the Founder's
 * sentence — "does not wait for others to join" — was literally true of the code. A link can
 * name a TABLE, and the table service already publishes exactly the facts a waiting screen
 * needs, through `GET /lobby/{joinCode}`: the game and its rules version, the state, the
 * capacity, every seat with whether it is OPEN or HELD, and the deadline the table will wait
 * until. That route is public on purpose, and its own documentation says why: "a phone has to
 * resolve a code BEFORE it can sign in".
 *
 * ONE SOURCE OF TRUTH FOR THE COUNTDOWN, and it is not this file. Two screens counting down
 * to zero with two timers of their own are two numbers that disagree the moment either is
 * started late, reloaded, or slept. So the countdown here is not a timer and holds no state:
 * it is a pure function of the SERVICE'S OWN `waitDeadline` and the clock, evaluated wherever
 * it is drawn. Both the phone and the venue display read the same field from the same route
 * and call the same function, so "what the TV shows" and "what the phone shows" are the same
 * arithmetic on the same number rather than two hopes. Nothing in this file reads the clock
 * itself — `now` is passed in — which is also what makes every case below testable without a
 * browser or a fake timer.
 *
 * DEADLINE EXPIRY IS NOT A START. `waitDeadline` is when the table stops waiting for more
 * people; it is not a promise that the table has started, and it is not a licence for a
 * client to deal a hand. A phone whose countdown reaches zero while the table is still
 * JOINABLE says so and keeps waiting. Only the service's own state decides that a table is
 * live, and `state` below is read from the service and never inferred from the clock. The
 * alternative — treating zero as "go" — is how a client ends up playing a game nobody
 * started, which is the same class of fabricated success as the offline fallback this client
 * already removed once.
 *
 * WHAT THIS FILE DOES NOT DO. It does not sign anybody in, it does not call anything, and it
 * does not decide which mechanism a started table uses. It reads a link and judges a
 * service's answer; the calls live in ./session.mjs with every other call, and the page
 * renders what this returns.
 */

import { readLink } from './identity.777b0687.mjs';

/** A trimmed non-empty string, or null. The one reading of "a value that is not there". */
function textOrNull(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

/**
 * The service's own lobby lifecycle, as `GET /lobby/{code}` spells it, plus the two states
 * this client is allowed to add because they are facts about the CLOCK rather than about the
 * lobby: `EXPIRED` (the service's own derivation once the deadline has passed) and
 * `UNRESOLVED` (the caller could not be answered at all).
 *
 * QUOTED FROM THE DEPLOYED SERVICE, not invented: `POST /lobby` and `GET /lobby/{code}` were
 * both measured live and answer `JOINABLE`, `READY`, `LIVE`; `EXPIRED` is the service's own
 * derived state for the same row, and it is spelled here because a screen has to be able to
 * say "this code is past its deadline" without pretending the table started.
 */
export const LOBBY_STATES = Object.freeze({
  JOINABLE: 'JOINABLE',
  READY: 'READY',
  LIVE: 'LIVE',
  STARTING: 'STARTING',
  FINISHED: 'FINISHED',
  EXPIRED: 'EXPIRED',
});

/** What a waiting screen is actually waiting for. One value per screen, and it is shown. */
export const WAITS = Object.freeze({
  /** The link names a table that does not exist, or whose name this client cannot use. */
  NO_TABLE: 'no-table',
  /** A table exists and is taking players. */
  PLAYERS: 'players',
  /** Every declared seat is held; the table is as full as it can get. */
  FULL: 'full',
  /** The deadline has passed and the table has not started. It is still not this client's to start. */
  DEADLINE_PASSED: 'deadline-passed',
  /** The table has started. There is nothing left to wait for. */
  STARTED: 'started',
  /** The code is past its deadline or gone. */
  GONE: 'gone',
});

/** The words, in one place, so two screens cannot describe one state two ways. */
export const WAIT_TEXT = Object.freeze({
  [WAITS.NO_TABLE]: 'No table named',
  [WAITS.PLAYERS]: 'Waiting for players',
  [WAITS.FULL]: 'Table full',
  [WAITS.DEADLINE_PASSED]: 'Waiting for the table to start',
  [WAITS.STARTED]: 'The table has started',
  [WAITS.GONE]: 'This table is closed',
});

/* --------------------------------------------------------------- reading the link */

/**
 * The join code on this link, if it carries one.
 *
 * READ BY THE SAME READER AS `game` AND `v`, deliberately: `readLink()` in ./identity.777b0687.mjs
 * owns the one set of rules for what a scan may carry, including the two non-leniencies that
 * matter most for a code — a value is never trimmed and `+` is never read as a space. A
 * second reader here would be a second opinion about what the display wrote, and for a join
 * code that second opinion would be this client asking for a table nobody named.
 *
 * Uppercased deliberately NOT here. `GET /lobby/{code}` normalises the code itself, and a
 * client that guessed the service's case rules would be a second implementation of them.
 * What arrives is sent.
 */
export function readCode(search) {
  return readLink(search).code;
}

/* ------------------------------------------------------------ judging the answer */

function integerOrNull(value) {
  return Number.isInteger(value) ? value : null;
}

function refused(status, reason, extra) {
  return {
    ok: false,
    status,
    reason,
    // A refusal never carries a table to join. Same rule ./identity.777b0687.mjs keeps for a game.
    lobbyId: null,
    code: null,
    seats: [],
    seatCount: 0,
    heldCount: 0,
    openCount: 0,
    capacity: null,
    waitDeadline: null,
    ...extra,
  };
}

/**
 * Read the public lobby answer, and REFUSE anything this client cannot honestly wait on.
 *
 * `body` is what `GET /lobby/{code}` returned, verbatim. It is not trusted: the capacity is
 * checked against the seats actually present, the deadline is checked to be a usable number,
 * and the state is checked to be one the service is known to publish. A shape this client
 * does not understand is a refusal, not a guess — the alternative is a waiting screen that
 * counts down to a number it invented.
 *
 * `served` is the table from ./identity.777b0687.mjs, so a table for a game or a rules version this
 * client does not serve is refused HERE, by name, before anything is signed in or sent.
 */
export function readLobby(body, served = null) {
  if (!body || typeof body !== 'object') {
    return refused('shape', 'the table service answered with nothing this client can read');
  }

  const state = textOrNull(body.state);
  if (!state) return refused('state', 'the table service did not say what state this table is in');
  if (!Object.values(LOBBY_STATES).includes(state)) {
    return refused('state', 'the table service answered with a table state this client does not know: ' + JSON.stringify(state));
  }

  const game = textOrNull(body.gameId);
  const ruleVersion = textOrNull(body.ruleVersion);
  if (!game) return refused('game', 'this table does not name a game');
  if (!ruleVersion) return refused('version', 'this table does not name a rules version');

  if (served) {
    const entry = Object.prototype.hasOwnProperty.call(served, game) ? served[game] : null;
    if (!entry) {
      return refused('game', 'this table is for ' + JSON.stringify(game)
        + ', and this client serves ' + Object.keys(served).map((g) => g.charAt(0).toUpperCase() + g.slice(1)).join(' and ') + ' only');
    }
    if (ruleVersion !== entry.ruleVersion) {
      return refused('version', 'this table plays ' + entry.label + ' rules v' + ruleVersion
        + ', and this client serves v' + entry.ruleVersion);
    }
  }

  const seats = Array.isArray(body.seats)
    ? body.seats.filter((s) => s && typeof s === 'object').map((s) => ({
      seatNo: integerOrNull(s.seatNo),
      // The public shape carries the NAME a player chose and never the account behind it.
      // A machine seat has no account and no name, which is a fact the screen may show.
      displayName: textOrNull(s.displayName),
      state: textOrNull(s.state),
    }))
    : [];

  const capacity = integerOrNull(body.capacity);
  if (capacity !== null && capacity < seats.length) {
    return refused('shape', 'the table service says this table seats ' + capacity
      + ' and listed ' + seats.length + ' seats, which cannot both be true');
  }

  const waitDeadline = integerOrNull(body.waitDeadline);
  if (waitDeadline === null) {
    // Without the service's own deadline there is no countdown to show and no honest way to
    // invent one, because a local timer is exactly the second source of truth this file
    // exists to avoid.
    return refused('deadline', 'the table service did not publish the deadline this table waits until');
  }

  const held = seats.filter((s) => s.state === 'HELD').length;
  const openCount = seats.filter((s) => s.state === 'OPEN').length;

  return {
    ok: true,
    status: 'resolved',
    reason: null,
    lobbyId: textOrNull(body.lobbyId),
    code: null,         // filled in by the caller, from the link it used
    game,
    ruleVersion,
    state,
    capacity,
    seats,
    seatCount: seats.length,
    heldCount: held,
    openCount,
    waitDeadline,
  };
}

/* ------------------------------------------------------------ what is being waited for */

/** Is this a state in which the table is over before it began? */
function gone(state) {
  return state === LOBBY_STATES.EXPIRED || state === LOBBY_STATES.FINISHED;
}

/** Has the table started? The service's word, never the clock's. */
export function hasStarted(lobby) {
  return Boolean(lobby) && (lobby.state === LOBBY_STATES.LIVE || lobby.state === LOBBY_STATES.STARTING);
}

/**
 * What this screen is waiting for, decided from the service's state and the service's
 * deadline — and in that order, so "the table started" is never overruled by a stale clock.
 */
export function waitFor(lobby, now) {
  if (!lobby || !lobby.ok) return WAITS.NO_TABLE;
  if (gone(lobby.state)) return WAITS.GONE;
  if (hasStarted(lobby)) return WAITS.STARTED;
  if (lobby.openCount === 0 && lobby.capacity !== null && lobby.heldCount >= lobby.capacity) return WAITS.FULL;
  if (Number.isFinite(now) && now >= lobby.waitDeadline) return WAITS.DEADLINE_PASSED;
  return WAITS.PLAYERS;
}

/**
 * The countdown, as a whole number of seconds, derived from the service's deadline.
 *
 * Clamped at zero: a countdown that went negative would be this screen counting past the
 * moment it is describing, and "starts in -3s" is not a sentence. A table that is waiting
 * with no deadline left is a table whose host has not started it, which is a different
 * sentence and `waitFor` already says it.
 */
export function secondsLeft(lobby, now) {
  if (!lobby || !lobby.ok || !Number.isFinite(now)) return null;
  return Math.max(0, Math.ceil((lobby.waitDeadline - now) / 1000));
}

/**
 * `MM:SS` for a countdown a person reads at a glance, and it never says a negative time.
 *
 * THE SAME TEXT THE VENUE DISPLAY RENDERS, deliberately, down to the padding: the display's
 * `clockText` in tv/table.mjs computes `Math.max(0, Math.ceil(remainingMs / 1000))` from the
 * SAME `waitDeadline` field and formats it as two-digit minutes and seconds. Two screens
 * counting to the same number in two different shapes is the disagreement this file exists to
 * prevent, and "0:43" beside "00:43" is exactly the kind of difference a room notices. The
 * one fact — the service's deadline — and the one rendering of it are therefore shared by
 * construction rather than by coincidence.
 */
export function countdown(seconds) {
  if (!Number.isFinite(seconds) || seconds === null) return null;
  const whole = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  return String(minutes).padStart(2, '0') + ':' + String(rest).padStart(2, '0');
}

/* ------------------------------------------------------------------ what is on screen */

/**
 * The one sentence a waiting screen shows, plus the two facts under it, so the phone and the
 * venue display say the same thing because they called the same function.
 *
 * `seatsOpen` is what the Founder asked to be shown ("how many seats are still open").
 * `waitingFor` is the answer to "what is being waited for" — and when people are missing it
 * NAMES them by seat, because "waiting" with no object is the state the Founder complained
 * about in the first place.
 */
export function describeWait(lobby, now) {
  const waitingFor = waitFor(lobby, now);
  const seconds = secondsLeft(lobby, now);
  /*
   * A LOBBY THAT DID NOT RESOLVE HAS NO SEATS, and asking one for its seats is how this
   * function threw the first time it was driven from a test rather than from a page that
   * happened to have a good answer. Every read below goes through this one object.
   */
  const known = Boolean(lobby && lobby.ok);
  const open = known ? lobby.seats.filter((s) => s.state === 'OPEN') : [];
  const held = known ? lobby.seats.filter((s) => s.state === 'HELD') : [];
  const capacity = known ? lobby.capacity : null;
  const seatsTotal = capacity === null || capacity === undefined
    ? (known ? lobby.seatCount : 0)
    : capacity;

  const seatWord = (n) => n + (n === 1 ? ' seat' : ' seats');
  let sentence = WAIT_TEXT[waitingFor];
  let detail = '';

  if (waitingFor === WAITS.PLAYERS) {
    sentence = 'Waiting for ' + seatWord(open.length) + ' to be taken';
    detail = held.length + ' of ' + seatsTotal + ' seats taken';
  } else if (waitingFor === WAITS.FULL) {
    sentence = 'The table is full — waiting for it to start';
    detail = held.length + ' of ' + seatsTotal + ' seats taken';
  } else if (waitingFor === WAITS.DEADLINE_PASSED) {
    sentence = 'The deadline has passed and the table has NOT started';
    detail = 'nobody can take a seat after the deadline, so this screen can only wait for the table itself';
  } else if (waitingFor === WAITS.STARTED) {
    sentence = WAIT_TEXT[WAITS.STARTED];
    detail = 'the cards have been dealt';
  } else if (waitingFor === WAITS.GONE) {
    sentence = 'This table is closed';
    detail = 'the code is past its deadline, so this table can no longer be joined';
  }

  return {
    waitingFor,
    sentence,
    detail,
    seconds,
    countdown: countdown(seconds),
    seatsOpen: open.length,
    seatsTaken: held.length,
    seatsTotal,
    openSeats: open.map((s) => s.seatNo).filter((n) => n !== null),
    started: waitingFor === WAITS.STARTED,
  };
}

/**
 * The whole waiting screen for one link, from the link and the service's answer.
 *
 * This is the function the page calls every tick: it takes the same two inputs, so a repaint
 * can never drift from the state it is describing, and there is no second copy of "how long
 * is left" anywhere in the client.
 */
export function waitPlan(code, body, served, now) {
  if (!code) {
    return {
      ok: false,
      code: null,
      lobby: null,
      view: describeWait(null, now),
      reason: 'this link names a game but no table, so there is nothing to wait for',
    };
  }
  const lobby = readLobby(body, served);
  if (!lobby.ok) {
    return { ok: false, code, lobby: null, view: describeWait(null, now), reason: lobby.reason };
  }
  lobby.code = code;
  return { ok: true, code, lobby, view: describeWait(lobby, now), reason: null };
}
