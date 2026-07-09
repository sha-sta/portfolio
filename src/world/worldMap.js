// Single source of truth for the world: section placement, the master line's
// waypoints, and (derived at runtime) each section's t-stop along the line.
//
// Coordinates are world units (px at scale 1). The world is WORLD_W x WORLD_H.
// Each section has an `anchor` — the point the camera centers on and the point
// the master line passes through. `entry`/`exit` angles are shaped by the
// waypoints between anchors, editable live via /?editor (dev only).

export const WORLD_W = 6600;
export const WORLD_H = 3400;

export const sections = [
  {
    id: 'hero',
    label: 'christian yoon.',
    hash: '',
    // anchor = the signature flourish's end point: the line starts where the
    // pen lifts. signature image point (690, 203) at SIGNATURE placement.
    anchor: { x: 250 + 690 * 1.4, y: 450 + 203 * 1.4 },
    view: { x: 1050, y: 780 },
    box: { x: 350, y: 320, w: 1400, h: 880 },
  },
  {
    id: 'work',
    label: 'work.',
    hash: 'work',
    // anchors sit in each section's left margin — the line arrives like a
    // sketchbook margin rule; the camera blends toward `view` (box center)
    anchor: { x: 2290, y: 840 },
    view: { x: 3060, y: 770 },
    box: { x: 2380, y: 260, w: 1420, h: 1160 },
  },
  {
    id: 'projects',
    label: 'projects.',
    hash: 'projects',
    anchor: { x: 1110, y: 2420 },
    view: { x: 1970, y: 2340 },
    box: { x: 1200, y: 1820, w: 1580, h: 1200 },
  },
  {
    id: 'open-source',
    label: 'open source.',
    hash: 'open-source',
    anchor: { x: 3390, y: 2210 },
    view: { x: 4080, y: 2210 },
    box: { x: 3480, y: 1780, w: 1240, h: 860 },
  },
  {
    id: 'contact',
    label: 'hit me up.',
    hash: 'contact',
    anchor: { x: 4690, y: 2780 },
    view: { x: 5420, y: 2650 },
    box: { x: 4780, y: 2380, w: 1080, h: 800 },
  },
];

// Waypoints between consecutive section anchors (exclusive of the anchors
// themselves). These bend the charcoal line; the camera spline follows it.
export const segments = [
  {
    from: 'hero',
    to: 'work',
    // leaves along the flourish's ending tangent (rightward, slight drop)
    waypoints: [
      [1500, 785],
      [1900, 810],
    ],
  },
  {
    from: 'work',
    to: 'projects',
    waypoints: [
      [2050, 1380],
      [1400, 1720],
      [1020, 2050],
    ],
  },
  {
    from: 'projects',
    to: 'open-source',
    waypoints: [
      [1800, 2640],
      [2600, 2470],
    ],
  },
  {
    from: 'open-source',
    to: 'contact',
    waypoints: [
      [3900, 2540],
      [4300, 2760],
    ],
  },
];

// world placement of the hero signature (image space is 713x350)
export const SIGNATURE = { x: 250, y: 450, scale: 1.4 };

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
