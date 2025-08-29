const SPEC = [
  { color: "transparent", p: 0.15 },
  { color: "#6C7874", p: 0.15 },
  { color: "#A4B6B0", p: 0.15 },
  { color: "#ADE800", p: 0.15 },
  { color: "#D8F0E4", p: 0.4 },
] as const;

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seededShuffle<T>(arr: T[], seed = 1337) {
  const a = arr.slice();
  const rand = mulberry32(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const palette = (totalCells: number) => {
  // 1) base counts via floor
  const raw = SPEC.map((s) => s.p * totalCells);
  const base = raw.map((v) => Math.floor(v));
  // 2) distribute the remainder to largest fractional parts
  const remainder = totalCells - base.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);

  const counts = base.slice();
  for (let r = 0; r < remainder; r++) counts[order[r].i]++;

  // 3) expand to a flat color list
  const list: string[] = [];
  counts.forEach((n, i) => {
    for (let k = 0; k < n; k++) list.push(SPEC[i].color);
  });

  // 4) shuffle (stable per seed)
  return seededShuffle(list, 111313131231012023);
};
