// Camera math: turns the master line into a fast t → {x, y} lookup table.
// All getPointAtLength sampling happens once at init — never per frame.

import { sections, segments, masterPoints } from './worldMap';
import { catmullRomToSpans } from './spline';

const SVG_NS = 'http://www.w3.org/2000/svg';
const SAMPLES = 2048;

// Measure paths on a hidden SVG in the DOM (detached paths can't be measured
// reliably in all engines).
function withMeasurer(fn) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.style.visibility = 'hidden';
  document.body.appendChild(svg);
  try {
    return fn(svg);
  } finally {
    svg.remove();
  }
}

export function buildCamera() {
  const points = masterPoints();
  const spans = catmullRomToSpans(points);

  return withMeasurer((svg) => {
    const els = spans.map((d) => {
      const el = document.createElementNS(SVG_NS, 'path');
      el.setAttribute('d', d);
      svg.appendChild(el);
      return el;
    });
    const lengths = els.map((el) => el.getTotalLength());
    const total = lengths.reduce((a, b) => a + b, 0);

    // Point index of each section anchor within the master polyline.
    const anchorIdx = [];
    let idx = 0;
    sections.forEach((s, i) => {
      anchorIdx.push(idx);
      idx += 1 + (segments[i] ? segments[i].waypoints.length : 0);
    });

    // t-stop of each section = fraction of total length at its anchor point.
    const cum = [0];
    for (const len of lengths) cum.push(cum[cum.length - 1] + len);
    const tStops = anchorIdx.map((pi) => cum[pi] / total);

    // The camera rides its own smooth spline through the section VIEW points
    // (not the line itself) — calm, direct travel while the line meanders
    // nearby. Each camera span is mapped to the line-derived t range of its
    // segment so arrivals stay in sync with the drawing.
    const views = sections.map((s) => [s.view?.x ?? s.anchor.x, s.view?.y ?? s.anchor.y]);
    const camSpans = catmullRomToSpans(views);
    const camEls = camSpans.map((d) => {
      const el = document.createElementNS(SVG_NS, 'path');
      el.setAttribute('d', d);
      svg.appendChild(el);
      return el;
    });
    const camLengths = camEls.map((el) => el.getTotalLength());

    const table = new Float32Array((SAMPLES + 1) * 2);
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES;
      let seg = 0;
      while (seg < tStops.length - 2 && tStops[seg + 1] < t) seg++;
      const local = (t - tStops[seg]) / (tStops[seg + 1] - tStops[seg]);
      const pt = camEls[seg].getPointAtLength(
        Math.min(Math.max(local, 0), 1) * camLengths[seg]
      );
      table[i * 2] = pt.x;
      table[i * 2 + 1] = pt.y;
    }

    // Per-segment lengths keyed by "from" section, for the line engine.
    const segLengths = sections.slice(0, -1).map((s, i) => {
      const a = anchorIdx[i];
      const b = anchorIdx[i + 1];
      return cum[b] - cum[a];
    });

    // One merged single-subpath `d` per section-to-section segment, so the
    // line engine can scrub each independently with dashoffset.
    const segmentDs = sections.slice(0, -1).map((s, i) => {
      const a = anchorIdx[i];
      const b = anchorIdx[i + 1];
      let d = spans[a];
      for (let j = a + 1; j < b; j++) d += ' ' + spans[j].slice(spans[j].indexOf('C'));
      return d;
    });

    const pointAt = (t) => {
      const c = Math.min(Math.max(t, 0), 1) * SAMPLES;
      const i = Math.floor(c);
      const f = c - i;
      const j = Math.min(i + 1, SAMPLES);
      return {
        x: table[i * 2] + (table[j * 2] - table[i * 2]) * f,
        y: table[i * 2 + 1] + (table[j * 2 + 1] - table[i * 2 + 1]) * f,
      };
    };

    return { pointAt, tStops, total, segLengths, segmentDs, spans };
  });
}
