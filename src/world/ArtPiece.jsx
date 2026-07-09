// A real charcoal drawing hung on the studio wall, passed en route between
// sections. The sketched frame draws in as the camera approaches.

import { motion, useTransform } from 'framer-motion';
import Stroke from '../charcoal/Stroke';

const MotionDiv = motion.div;

export default function ArtPiece({
  camera,
  progress,
  src,
  caption,
  x,
  y,
  w,
  h,
  seg,
  frac = 0.5,
}) {
  const t0 = camera.tStops[seg];
  const t1 = camera.tStops[seg + 1];
  const tCenter = t0 + (t1 - t0) * frac;

  const presence = useTransform(progress, (v) => {
    const d = Math.abs(v - tCenter);
    return Math.min(Math.max(1 - d * 3.5, 0), 1);
  });
  const opacity = useTransform(presence, (p) => 0.1 + 0.9 * p);

  const pad = 26;
  const frameD = `M ${pad} ${pad} L ${w - pad} ${pad + 3} L ${w - pad - 2} ${h - pad} L ${pad + 3} ${h - pad - 2} L ${pad} ${pad}`;

  return (
    <MotionDiv
      className="pointer-events-none absolute"
      style={{ left: x, top: y, width: w, height: h + 56, opacity }}
    >
      <img
        src={src}
        alt={caption}
        loading="lazy"
        className="absolute object-cover"
        style={{ left: pad + 8, top: pad + 8, width: w - 2 * pad - 16, height: h - 2 * pad - 16 }}
      />
      <svg className="absolute inset-0" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        <Stroke d={frameD} role="sketch" seed={55} progress={presence} />
      </svg>
      <span className="font-hand text-ink-faint absolute text-[19px]" style={{ left: pad + 8, top: h + 4 }}>
        {caption}
      </span>
    </MotionDiv>
  );
}
