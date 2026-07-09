// THE texture seam. Every charcoal stroke on the site gets its pass stack
// from here — swap the baked grain tile (public/charcoal-grain.webp) for a
// real scanned-charcoal tile (art/ folder) without touching anything else.
//
// Charcoal reads as grain INSIDE the stroke body: strokes are painted with a
// tileable ink-with-tooth pattern (paint: 'grain'), so paper pits eat into
// the line. A thin solid filament adds the dry edge.

export const INK = 'var(--color-ink)';
export const GRAIN_PATTERN_ID = 'charcoalGrain';

const styles = {
  // the master line the camera follows — weight matches the signature
  master: [
    { width: 8.5, opacity: 0.95, amp: 0.5, wobble: 7, linecap: 'round', paint: 'grain' },
    { width: 4.5, opacity: 0.7, amp: 2.2, wobble: 6, linecap: 'round', paint: 'grain' },
    { width: 1.2, opacity: 0.3, amp: 3.8, wobble: 9, linecap: 'round', paint: 'ink' },
  ],
  // section underlines, doodles
  sketch: [
    { width: 3, opacity: 0.9, amp: 0.8, wobble: 6, linecap: 'round', paint: 'grain' },
    { width: 1, opacity: 0.28, amp: 2.2, wobble: 8, linecap: 'round', paint: 'ink' },
  ],
  // the signature: core follows the trace exactly
  signature: [
    { width: 3.4, opacity: 0.97, amp: 0, wobble: 8, linecap: 'round', paint: 'grain' },
    { width: 1.8, opacity: 0.55, amp: 0.8, wobble: 9, linecap: 'round', paint: 'grain' },
    { width: 0.6, opacity: 0.3, amp: 1.3, wobble: 10, linecap: 'round', paint: 'ink' },
  ],
  // faint construction/guide lines
  guide: [{ width: 1.3, opacity: 0.35, amp: 1.2, wobble: 8, linecap: 'round', paint: 'grain' }],
};

export function strokePasses(role = 'sketch') {
  return styles[role] || styles.sketch;
}
