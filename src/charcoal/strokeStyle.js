// THE texture seam. Every charcoal stroke on the site gets its pass stack
// from here — swap simulated passes for real scanned-charcoal patterns
// (art/ folder → baked assets) by editing only this module.
//
// Charcoal is FEATHERED: a semi-opaque core ridden by several thin filaments
// that braid around it (different seeds → different jitter per filament).
// The paper grain shows through the core; the filaments break the edge.

export const INK = 'var(--color-ink)';

function feathered({ coreW, coreO, count, filW, filO, spread, wobble }) {
  const passes = [
    { width: coreW, opacity: coreO, amp: spread * 0.35, wobble, linecap: 'round' },
  ];
  for (let i = 0; i < count; i++) {
    passes.push({
      width: filW * (0.75 + 0.5 * ((i * 7) % 3) / 2),
      opacity: filO * (0.55 + 0.45 * ((i * 13) % 5) / 4),
      amp: spread * (0.55 + 0.45 * (i / Math.max(count - 1, 1))),
      wobble: wobble - 1 + (i % 3),
      linecap: 'round',
    });
  }
  return passes;
}

const styles = {
  // the master line the camera follows — weight matches the signature
  master: feathered({ coreW: 6.5, coreO: 0.68, count: 5, filW: 1.4, filO: 0.4, spread: 5, wobble: 7 }),
  // section underlines, doodles
  sketch: feathered({ coreW: 2.8, coreO: 0.66, count: 3, filW: 0.9, filO: 0.38, spread: 2.6, wobble: 6 }),
  // the signature: core follows the trace exactly, filaments feather it
  signature: feathered({ coreW: 3.1, coreO: 0.72, count: 4, filW: 0.65, filO: 0.4, spread: 1.5, wobble: 9 }),
  // faint construction/guide lines
  guide: [{ width: 1.2, opacity: 0.28, amp: 1.2, wobble: 8, linecap: 'round' }],
};

// the signature core must not deviate from the traced path
styles.signature[0].amp = 0;

export function strokePasses(role = 'sketch') {
  return styles[role] || styles.sketch;
}
