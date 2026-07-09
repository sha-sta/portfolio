// THE texture seam. Every charcoal stroke on the site gets its pass stack
// from here — swap the baked grain tile (public/charcoal-grain.webp) for a
// real scanned-charcoal tile (art/ folder) without touching anything else.
//
// Charcoal reads as grain INSIDE the stroke body: strokes are painted with a
// tileable ink-with-tooth pattern (paint: 'grain'), so paper pits eat into
// the line. A thin solid filament adds the dry edge.

export const INK = 'var(--color-ink)';
export const GRAIN_PATTERN_ID = 'charcoalGrain';

// Pencil/charcoal anatomy per stroke: a tight low-opacity soft edge UNDER a
// grain-painted core, plus 1-2 hairline streaks riding along the stroke.
// Softness comes from the edge pass hugging the core (not a wide halo).
const styles = {
  // the master line the camera follows — weight matches the signature
  master: [
    { width: 12.5, opacity: 0.14, amp: 0.9, wobble: 7, linecap: 'round', paint: 'grain' },
    { width: 9, opacity: 0.88, amp: 0.4, wobble: 7, linecap: 'round', paint: 'grain' },
    { width: 1.1, opacity: 0.28, amp: 2.1, wobble: 9, linecap: 'round', paint: 'ink' },
    { width: 0.9, opacity: 0.22, amp: 3, wobble: 8, linecap: 'round', paint: 'ink' },
  ],
  // section underlines, doodles
  sketch: [
    { width: 4.2, opacity: 0.14, amp: 0.7, wobble: 6, linecap: 'round', paint: 'grain' },
    { width: 2.9, opacity: 0.85, amp: 0.6, wobble: 6, linecap: 'round', paint: 'grain' },
    { width: 0.9, opacity: 0.26, amp: 1.9, wobble: 8, linecap: 'round', paint: 'ink' },
  ],
  // the signature: core follows the trace exactly
  signature: [
    { width: 4.6, opacity: 0.14, amp: 0.5, wobble: 9, linecap: 'round', paint: 'grain' },
    { width: 3.3, opacity: 0.92, amp: 0, wobble: 8, linecap: 'round', paint: 'grain' },
    { width: 0.55, opacity: 0.28, amp: 1.1, wobble: 10, linecap: 'round', paint: 'ink' },
  ],
  // faint construction/guide lines
  guide: [{ width: 1.3, opacity: 0.35, amp: 1.2, wobble: 8, linecap: 'round', paint: 'grain' }],
};

export function strokePasses(role = 'sketch') {
  return styles[role] || styles.sketch;
}
