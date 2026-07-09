// Catmull-Rom → cubic bézier conversion, so the world line can be authored as
// plain waypoints ("place dots") instead of hand-written control handles.

// points: [[x,y], ...] → SVG path `d` through every point.
export function catmullRomToPath(points, tension = 1) {
  if (points.length < 2) return '';
  const p = points;
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    d += ` C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

// Same conversion but returns one `d` per span so segments can be split at
// section anchors while keeping tangent continuity across the whole line.
export function catmullRomToSpans(points, tension = 1) {
  const spans = [];
  const p = points;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    spans.push(
      `M ${p1[0]} ${p1[1]} C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${p2[0]} ${p2[1]}`
    );
  }
  return spans;
}

function round(n) {
  return Math.round(n * 100) / 100;
}
