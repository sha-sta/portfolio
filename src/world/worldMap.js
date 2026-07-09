// Single source of truth for the world: section placement, the master line's
// waypoints, and (derived at runtime) each section's t-stop along the line.
//
// Coordinates are world units (px at scale 1). The world is WORLD_W x WORLD_H.
// Each section has an `anchor` — the point the camera centers on and the point
// the master line passes through. `entry`/`exit` angles are shaped by the
// waypoints between anchors, editable live via /?editor (dev only).

export const WORLD_W = 6000;
export const WORLD_H = 3400;

export const sections = [
  {
    id: 'hero',
    label: 'christian yoon.',
    hash: '',
    anchor: { x: 1050, y: 750 },
    // content box, centered-ish on anchor
    box: { x: 350, y: 320, w: 1400, h: 880 },
  },
  {
    id: 'work',
    label: 'work.',
    hash: 'work',
    anchor: { x: 3080, y: 820 },
    box: { x: 2380, y: 260, w: 1420, h: 1160 },
  },
  {
    id: 'projects',
    label: 'projects.',
    hash: 'projects',
    anchor: { x: 1980, y: 2380 },
    box: { x: 1200, y: 1820, w: 1580, h: 1200 },
  },
  {
    id: 'open-source',
    label: 'open source.',
    hash: 'open-source',
    anchor: { x: 4080, y: 2200 },
    box: { x: 3480, y: 1780, w: 1240, h: 860 },
  },
  {
    id: 'contact',
    label: 'hit me up.',
    hash: 'contact',
    anchor: { x: 5320, y: 2780 },
    box: { x: 4780, y: 2380, w: 1080, h: 800 },
  },
];

// Waypoints between consecutive section anchors (exclusive of the anchors
// themselves). These bend the charcoal line; the camera spline follows it.
export const segments = [
  {
    from: 'hero',
    to: 'work',
    waypoints: [
      [1700, 520],
      [2300, 1050],
    ],
  },
  {
    from: 'work',
    to: 'projects',
    waypoints: [
      [3560, 1350],
      [2900, 1750],
      [2380, 2080],
    ],
  },
  {
    from: 'projects',
    to: 'open-source',
    waypoints: [
      [2620, 2820],
      [3400, 2620],
    ],
  },
  {
    from: 'open-source',
    to: 'contact',
    waypoints: [
      [4720, 2260],
      [4980, 2560],
    ],
  },
];

export const sectionById = Object.fromEntries(sections.map((s) => [s.id, s]));

// Ordered list of anchor points with waypoints in between → the master polyline.
export function masterPoints() {
  const pts = [];
  sections.forEach((s, i) => {
    pts.push([s.anchor.x, s.anchor.y]);
    if (i < segments.length) pts.push(...segments[i].waypoints);
  });
  return pts;
}
