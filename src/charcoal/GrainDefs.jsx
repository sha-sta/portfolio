// Document-wide charcoal grain paint server. Rendered once at app root; every
// Stroke pass with paint:'grain' references it (with a solid-ink fallback).

import { GRAIN_PATTERN_ID } from './strokeStyle';

export default function GrainDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <pattern
          id={GRAIN_PATTERN_ID}
          patternUnits="userSpaceOnUse"
          width="256"
          height="256"
        >
          <image href="/charcoal-grain.webp" width="256" height="256" />
        </pattern>
      </defs>
    </svg>
  );
}
