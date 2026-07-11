// Document-wide charcoal paint servers. Rendered once at app root; every
// Stroke pass with paint:'grain' references the grain pattern (with a
// solid-ink fallback), and stroke groups can opt into a paper-tooth
// luminance mask that eats their edges like dry media.

import { GRAIN_PATTERN_ID, TOOTH_MASK_ID, TOOTH_HEAVY_MASK_ID } from './strokeStyle';

// big enough to cover the world (6600x3400) and any lab/linear viewBox
const MASK_EXTENT = 8192;

function ToothMask({ id, href }) {
  return (
    <>
      <pattern id={`${id}Pat`} patternUnits="userSpaceOnUse" width="256" height="256">
        <image href={href} width="256" height="256" />
      </pattern>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={MASK_EXTENT} height={MASK_EXTENT}>
        <rect x="0" y="0" width={MASK_EXTENT} height={MASK_EXTENT} fill={`url(#${id}Pat)`} />
      </mask>
    </>
  );
}

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
        <ToothMask id={TOOTH_MASK_ID} href="/charcoal-tooth.webp" />
        <ToothMask id={TOOTH_HEAVY_MASK_ID} href="/charcoal-tooth-heavy.webp" />
      </defs>
    </svg>
  );
}
