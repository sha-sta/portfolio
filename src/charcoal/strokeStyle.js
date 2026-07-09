// THE texture seam. Every charcoal stroke on the site gets its pass stack
// from here — swap simulated passes for real scanned-charcoal patterns
// (art/ folder → baked assets) by editing only this module.
//
// A "pass" = one jittered copy of the logical path. Stacked passes with
// different widths/opacities/seeds read as dry charcoal on toothed paper.

export const INK = 'var(--color-ink)';

// Charcoal reads as a near-opaque core with a broken dry edge, not stacked
// translucent halos: one solid pass + one thin low-opacity flick.
const styles = {
  // the master line the camera follows
  master: [
    { width: 4.2, opacity: 0.94, amp: 1.8, wobble: 7, linecap: 'round' },
    { width: 1.5, opacity: 0.38, amp: 3.2, wobble: 9, linecap: 'round' },
  ],
  // section frames, underlines, doodles
  sketch: [
    { width: 2.6, opacity: 0.88, amp: 1.4, wobble: 6, linecap: 'round' },
    { width: 1, opacity: 0.3, amp: 2.2, wobble: 8, linecap: 'round' },
  ],
  // the signature: the trace is already handmade, add no jitter to the core
  signature: [
    { width: 3.4, opacity: 0.96, amp: 0, wobble: 8, linecap: 'round' },
    { width: 1.1, opacity: 0.26, amp: 1.1, wobble: 10, linecap: 'round' },
  ],
  // faint construction/guide lines
  guide: [{ width: 1.2, opacity: 0.28, amp: 1.2, wobble: 8, linecap: 'round' }],
};

export function strokePasses(role = 'sketch') {
  return styles[role] || styles.sketch;
}
