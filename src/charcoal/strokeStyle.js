// THE texture seam. Every charcoal stroke on the site gets its pass stack
// from here — swap the baked grain tile (public/charcoal-grain.webp) for a
// real scanned-charcoal tile (art/ folder) without touching anything else.
//
// Stroke anatomy (user-picked "E" look): a DARK grainy body made of two
// near-equal-width grain passes (edges nearly coincide — never a wider,
// lighter pass under a darker core, that reads laminated), plus thin ink
// FIBER lines riding at constant normal offsets (`off`) like pencil fibers,
// all eaten at the edges by a baked paper-tooth luminance mask.
// `defer: true` passes sit out the draw animation and fade in via `finish`.

export const INK = 'var(--color-ink)';
export const GRAIN_PATTERN_ID = 'charcoalGrain';
// baked paper-tooth luminance masks (public/charcoal-tooth*.webp): applied
// over a stroke group they break the vector edge like dry media
export const TOOTH_MASK_ID = 'charcoalTooth';
export const TOOTH_HEAVY_MASK_ID = 'charcoalToothHeavy';

const styles = {
  // the master line the camera follows — weight matches the signature.
  // 3 fibers (not 4): this role repaints on every scroll frame.
  master: [
    { width: 9.0, opacity: 0.7, amp: 0.35, wobble: 8, linecap: 'round', paint: 'grain' },
    { width: 7.6, opacity: 0.6, amp: 0.55, wobble: 6, linecap: 'round', paint: 'grain' },
    { width: 1.4, opacity: 0.5, amp: 0.5, wobble: 14, off: -4.2, linecap: 'round', paint: 'ink' },
    { width: 1.3, opacity: 0.45, amp: 0.45, wobble: 12, off: 1.7, linecap: 'round', paint: 'ink' },
    { width: 1.4, opacity: 0.5, amp: 0.5, wobble: 15, off: 3.9, linecap: 'round', paint: 'ink' },
  ],
  // section underlines, doodles, frames — small strokes, 2 fibers suffice
  sketch: [
    { width: 3.0, opacity: 0.7, amp: 0.5, wobble: 6, linecap: 'round', paint: 'grain' },
    { width: 2.5, opacity: 0.6, amp: 0.65, wobble: 6, linecap: 'round', paint: 'grain' },
    { width: 0.5, opacity: 0.5, amp: 0.3, wobble: 12, off: -1.4, linecap: 'round', paint: 'ink' },
    { width: 0.5, opacity: 0.45, amp: 0.3, wobble: 13, off: 1.2, linecap: 'round', paint: 'ink' },
  ],
  // the signature: cores follow the retrace faithfully (small amp); the
  // fibers defer so only 2 paths per stroke animate during the draw
  signature: [
    { width: 3.2, opacity: 0.7, amp: 0.25, wobble: 8, linecap: 'round', paint: 'grain' },
    { width: 2.7, opacity: 0.6, amp: 0.4, wobble: 6, linecap: 'round', paint: 'grain' },
    { width: 0.55, opacity: 0.5, amp: 0.35, wobble: 14, off: -1.5, linecap: 'round', paint: 'ink', defer: true },
    { width: 0.5, opacity: 0.45, amp: 0.3, wobble: 12, off: -0.7, linecap: 'round', paint: 'ink', defer: true },
    { width: 0.5, opacity: 0.45, amp: 0.3, wobble: 13, off: 0.6, linecap: 'round', paint: 'ink', defer: true },
    { width: 0.55, opacity: 0.5, amp: 0.35, wobble: 15, off: 1.4, linecap: 'round', paint: 'ink', defer: true },
  ],
  // faint construction/guide lines
  guide: [{ width: 1.3, opacity: 0.35, amp: 1.2, wobble: 8, linecap: 'round', paint: 'grain' }],
};

// paper-tooth mask per role: heavy tooth on the expressive strokes, subtle
// on hairline guides so they don't dissolve
const masks = {
  master: TOOTH_HEAVY_MASK_ID,
  sketch: TOOTH_HEAVY_MASK_ID,
  signature: TOOTH_HEAVY_MASK_ID,
  guide: TOOTH_MASK_ID,
};

export function strokePasses(role = 'sketch') {
  return styles[role] || styles.sketch;
}

export function strokeMask(role = 'sketch') {
  return masks[role] || masks.sketch;
}
