/**
 * Minimal QR encoder (byte mode, error-correction level L).
 *
 * The site forbids third-party references — the build fails on any off-origin
 * URL — so the venue lobby's QR cannot come from a CDN. This implements the
 * parts of ISO/IEC 18004 the lobby needs: byte-mode payloads up to version 10 at
 * level L, with the standard eight mask patterns scored by the reference
 * lost-point heuristic.
 *
 * Correctness note: an encoder that is *nearly* right produces a symbol that
 * looks plausible and does not scan, so this is verified module-for-module
 * against an independent implementation in tests/qr.test.mjs. The mask choice in
 * particular is not cosmetic — picking a different mask than the reference
 * produces a valid but different symbol, and the test asserts identity.
 */

/* ---- GF(256), polynomial 0x11d ---- */
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();
const mul = (a, b) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

function rsGenerator(degree) {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= mul(poly[j], 1);
      next[j + 1] ^= mul(poly[j], EXP[i]);
    }
    poly = next;
  }
  return poly;
}

function rsEncode(data, ecLen) {
  const gen = rsGenerator(ecLen);
  const res = new Array(data.length + ecLen).fill(0);
  for (let i = 0; i < data.length; i++) res[i] = data[i];
  for (let i = 0; i < data.length; i++) {
    const factor = res[i];
    if (factor === 0) continue;
    for (let j = 0; j < gen.length; j++) res[i + j] ^= mul(gen[j], factor);
  }
  return res.slice(data.length);
}

/* ---- Version tables, level L ---- */
const VERSIONS = {
  1: { ec: 7, groups: [[1, 19]] },
  2: { ec: 10, groups: [[1, 34]] },
  3: { ec: 15, groups: [[1, 55]] },
  4: { ec: 20, groups: [[1, 80]] },
  5: { ec: 26, groups: [[1, 108]] },
  6: { ec: 18, groups: [[2, 68]] },
  7: { ec: 20, groups: [[2, 78]] },
  8: { ec: 24, groups: [[2, 97]] },
  9: { ec: 30, groups: [[2, 116]] },
  10: { ec: 18, groups: [[2, 68], [2, 69]] },
};
const ALIGN = {
  1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
  6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50],
};
const dataCodewords = (v) => VERSIONS[v].groups.reduce((n, [c, d]) => n + c * d, 0);

function pickVersion(byteLen) {
  for (let v = 1; v <= 10; v++) {
    const header = 4 + (v >= 10 ? 16 : 8);
    if (header + byteLen * 8 <= dataCodewords(v) * 8) return v;
  }
  throw new Error(`payload too long for a level-L QR in this implementation: ${byteLen} bytes`);
}

/* ---- mask formulas (ISO/IEC 18004 table 10) ---- */
const MASKS = [
  (i, j) => (i + j) % 2 === 0,
  (i) => i % 2 === 0,
  (i, j) => j % 3 === 0,
  (i, j) => (i + j) % 3 === 0,
  (i, j) => (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0,
  (i, j) => ((i * j) % 2) + ((i * j) % 3) === 0,
  (i, j) => (((i * j) % 2) + ((i * j) % 3)) % 2 === 0,
  (i, j) => (((i * j) % 3) + ((i + j) % 2)) % 2 === 0,
];

const BCH_TYPE_INFO = (() => {
  const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | 1;
  const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);
  return (data) => {
    let d = data << 10;
    while (bchDigit(d) - bchDigit(G15) >= 0) d ^= G15 << (bchDigit(d) - bchDigit(G15));
    return ((data << 10) | d) ^ G15_MASK;
  };
})();

function bchDigit(data) {
  let digit = 0;
  while (data !== 0) { digit++; data >>>= 1; }
  return digit;
}

/* ---- lost-point heuristic, as the reference implements it ---- */
function lostPoint(m) {
  const n = m.length;
  let lost = 0;
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      let same = 0;
      const dark = m[row][col];
      for (let r = -1; r <= 1; r++) {
        if (row + r < 0 || row + r >= n) continue;
        for (let c = -1; c <= 1; c++) {
          if (col + c < 0 || col + c >= n) continue;
          if (r === 0 && c === 0) continue;
          if (dark === m[row + r][col + c]) same++;
        }
      }
      if (same > 5) lost += 3 + same - 5;
    }
  }
  for (let row = 0; row < n - 1; row++) {
    for (let col = 0; col < n - 1; col++) {
      let count = 0;
      if (m[row][col]) count++;
      if (m[row + 1][col]) count++;
      if (m[row][col + 1]) count++;
      if (m[row + 1][col + 1]) count++;
      if (count === 0 || count === 4) lost += 3;
    }
  }
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n - 6; col++) {
      if (m[row][col] && !m[row][col + 1] && m[row][col + 2] && m[row][col + 3] &&
          m[row][col + 4] && !m[row][col + 5] && m[row][col + 6]) lost += 40;
    }
  }
  for (let col = 0; col < n; col++) {
    for (let row = 0; row < n - 6; row++) {
      if (m[row][col] && !m[row + 1][col] && m[row + 2][col] && m[row + 3][col] &&
          m[row + 4][col] && !m[row + 5][col] && m[row + 6][col]) lost += 40;
    }
  }
  let darkCount = 0;
  for (let row = 0; row < n; row++) for (let col = 0; col < n; col++) if (m[row][col]) darkCount++;
  const ratio = Math.abs((100 * darkCount) / (n * n) - 50) / 5;
  lost += ratio * 10;
  return lost;
}

/* ---- construction ---- */
function buildSymbol(text, version, mask, test = false) {
  const bytes = new TextEncoder().encode(text);
  const v = version ?? pickVersion(bytes.length);
  const spec = VERSIONS[v];
  const n = 17 + v * 4;
  const capacityBits = dataCodewords(v) * 8;

  // Bit stream: mode, length, payload, terminator, pad.
  const bits = [];
  const push = (value, length) => {
    for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };
  push(0b0100, 4);
  push(bytes.length, v >= 10 ? 16 : 8);
  for (const b of bytes) push(b, 8);
  push(0, Math.min(4, capacityBits - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);
  for (let i = 0; bits.length < capacityBits; i++) push(i % 2 === 0 ? 0xec : 0x11, 8);

  const data = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
    data.push(byte);
  }

  // Blocks, error correction, interleave.
  const blocks = [];
  let offset = 0;
  for (const [count, dc] of spec.groups) {
    for (let i = 0; i < count; i++) {
      const d = data.slice(offset, offset + dc);
      offset += dc;
      blocks.push({ data: d, ec: rsEncode(d, spec.ec) });
    }
  }
  const maxData = Math.max(...blocks.map((b) => b.data.length));
  const codewords = [];
  for (let i = 0; i < maxData; i++) for (const b of blocks) if (i < b.data.length) codewords.push(b.data[i]);
  for (let i = 0; i < spec.ec; i++) for (const b of blocks) codewords.push(b.ec[i]);

  // Matrix with every function pattern reserved as non-null.
  const m = Array.from({ length: n }, () => new Array(n).fill(null));

  const probe = (row, col) => {
    for (let r = -1; r <= 7; r++) {
      if (row + r < 0 || row + r >= n) continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c < 0 || col + c >= n) continue;
        const onRing = (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
                       (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
                       (r >= 2 && r <= 4 && c >= 2 && c <= 4);
        m[row + r][col + c] = onRing;
      }
    }
  };
  probe(0, 0);
  probe(n - 7, 0);
  probe(0, n - 7);

  for (const r of ALIGN[v]) {
    for (const c of ALIGN[v]) {
      const nearFinder = (r <= 8 && c <= 8) || (r <= 8 && c >= n - 9) || (r >= n - 9 && c <= 8);
      if (nearFinder) continue;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          m[r + dr][c + dc] = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
        }
      }
    }
  }

  for (let i = 8; i < n - 8; i++) {
    if (m[6][i] === null) m[6][i] = i % 2 === 0;
    if (m[i][6] === null) m[i][6] = i % 2 === 0;
  }

  // Format information for the chosen mask (level L = 01), reserved as non-null
  // so data mapping and masking both skip it.
  //
  // While *scoring* a candidate mask the reference writes these modules as false
  // rather than as the real format bits, so they do not contribute to the
  // heuristic. Placing real bits here would change every candidate's score and
  // therefore the chosen mask — which is how a symbol ends up valid but
  // different from the reference.
  const fmt = BCH_TYPE_INFO((1 << 3) | mask);
  const fmtBit = (i) => (test ? false : ((fmt >> i) & 1) === 1);
  for (let i = 0; i < 15; i++) {
    const bit = fmtBit(i);
    if (i < 6) m[i][8] = bit;
    else if (i < 8) m[i + 1][8] = bit;
    else m[n - 15 + i][8] = bit;
  }
  for (let i = 0; i < 15; i++) {
    const bit = fmtBit(i);
    if (i < 8) m[8][n - i - 1] = bit;
    else if (i < 9) m[8][15 - i - 1 + 1] = bit;
    else m[8][15 - i - 1] = bit;
  }
  m[n - 8][8] = !test; // fixed dark module

  // Data, zig-zag from the bottom-right, skipping the timing column.
  //
  // Ported exactly from the reference traversal rather than approximated: the
  // order in which the two columns of a pair are visited, and the point at which
  // the row direction reverses, both change which module receives which bit.
  {
    let inc = -1;
    let row = n - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    for (let col = n - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      for (;;) {
        for (let c = 0; c < 2; c++) {
          const cc = col - c;
          if (m[row][cc] !== null) continue;
          let dark = false;
          if (byteIndex < codewords.length) {
            dark = ((codewords[byteIndex] >>> bitIndex) & 1) === 1;
          }
          if (MASKS[mask](row, cc)) dark = !dark;
          m[row][cc] = dark;
          bitIndex--;
          if (bitIndex === -1) { byteIndex++; bitIndex = 7; }
        }
        row += inc;
        if (row < 0 || row >= n) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  }

  return m;
}

/** Choose the mask with the lowest lost-point score, as the reference does. */
function bestMask(text, version) {
  let best = 0;
  let bestScore = null;
  for (let i = 0; i < 8; i++) {
    const score = lostPoint(buildSymbol(text, version, i, true));
    if (bestScore === null || score < bestScore) { bestScore = score; best = i; }
  }
  return best;
}

/** Encode `text` and return a square boolean matrix (true = dark). */
export function matrix(text, version) {
  return buildSymbol(text, version, bestMask(text, version));
}

/** The chosen mask, exposed for tests and diagnostics. */
export function chosenMask(text, version) {
  return bestMask(text, version);
}
