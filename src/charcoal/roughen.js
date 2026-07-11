// Deterministic "hand" jitter for SVG paths. A clean path is resampled every
// ~12 world-units and its points are offset along their normals by smooth
// seeded value-noise, then rebuilt as a Catmull-Rom path. Same seed → same
// stroke on every render (resume/HMR safe, no Math.random).

import { catmullRomToPath } from '../world/spline';

const SVG_NS = 'http://www.w3.org/2000/svg';
const sampleCache = new Map();

// mulberry32 — tiny seeded PRNG
function prng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function samplePathPoints(d, step = 12) {
  const key = `${step}|${d}`;
  if (sampleCache.has(key)) return sampleCache.get(key);

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.style.position = 'absolute';
  svg.style.visibility = 'hidden';
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  svg.appendChild(path);
  document.body.appendChild(svg);

  const total = path.getTotalLength();
  const n = Math.max(2, Math.ceil(total / step));
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const p = path.getPointAtLength((i / n) * total);
    pts.push([p.x, p.y]);
  }
  svg.remove();

  const result = { points: pts, total };
  sampleCache.set(key, result);
  return result;
}

// Smooth noise in [-1, 1]: random control values every `period` samples,
// cosine-interpolated between them.
function valueNoise(count, period, rand) {
  const controls = [];
  for (let i = 0; i <= Math.ceil(count / period) + 1; i++) {
    controls.push(rand() * 2 - 1);
  }
  const out = new Float32Array(count + 1);
  for (let i = 0; i <= count; i++) {
    const x = i / period;
    const i0 = Math.floor(x);
    const f = x - i0;
    const s = (1 - Math.cos(f * Math.PI)) / 2;
    out[i] = controls[i0] * (1 - s) + controls[i0 + 1] * s;
  }
  return out;
}

// d → jittered d. amp = max normal offset (world units), wobble = noise period
// in samples (bigger = lazier drift), seed = pass identity. offset = constant
// shift along the normal: parallel "fiber" lines riding beside the centerline
// (they converge at the pinned ends, like pencil fibers at a pen lift).
export function roughenPath(d, { amp = 1.5, wobble = 6, seed = 1, step = 12, offset = 0 } = {}) {
  const { points } = samplePathPoints(d, step);
  if (points.length < 3) return d;

  const rand = prng(seed);
  const noise = valueNoise(points.length - 1, wobble, rand);
  const out = points.map(([x, y], i) => {
    const prev = points[Math.max(i - 1, 0)];
    const next = points[Math.min(i + 1, points.length - 1)];
    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const len = Math.hypot(dx, dy) || 1;
    // normal = (-dy, dx) / len; ends pinned so joined strokes stay joined
    const pin = i === 0 || i === points.length - 1 ? 0 : 1;
    const off = (noise[i] * amp + offset) * pin;
    return [x + (-dy / len) * off, y + (dx / len) * off];
  });
  return catmullRomToPath(out, 0.8);
}
