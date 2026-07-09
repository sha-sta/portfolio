// THE texture seam. Every charcoal stroke on the site gets its pass stack
// from here — swap simulated passes for real scanned-charcoal patterns
// (art/ folder → baked assets) by editing only this module.
//
// A "pass" = one jittered copy of the logical path. Stacked passes with
// different widths/opacities/seeds read as dry charcoal on toothed paper.

export const INK = 'var(--color-ink)';

const styles = {
  // the master line the camera follows
  master: [
    { width: 4, opacity: 0.8, amp: 2.2, wobble: 7, linecap: 'round' },
    { width: 8, opacity: 0.2, amp: 5, wobble: 4, linecap: 'round' },
    { width: 1.4, opacity: 0.45, amp: 3.4, wobble: 9, linecap: 'round' },
  ],
  // section frames, underlines, doodles
  sketch: [
    { width: 2.6, opacity: 0.8, amp: 1.6, wobble: 6, linecap: 'round' },
    { width: 4.2, opacity: 0.18, amp: 2.6, wobble: 4, linecap: 'round' },
  ],
  // the signature — tighter, ink-like
  signature: [
    { width: 3.2, opacity: 0.92, amp: 0.9, wobble: 10, linecap: 'round' },
    { width: 5, opacity: 0.14, amp: 1.6, wobble: 6, linecap: 'round' },
  ],
  // faint construction/guide lines
  guide: [{ width: 1.2, opacity: 0.28, amp: 1.2, wobble: 8, linecap: 'round' }],
};

export function strokePasses(role = 'sketch') {
  return styles[role] || styles.sketch;
}
