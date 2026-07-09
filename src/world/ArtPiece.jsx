// The closing piece: a real charcoal drawing hung just past the last section,
// with a museum-style label. The sketched frame draws in on arrival.

import { motion, useTransform } from 'framer-motion';
import Stroke from '../charcoal/Stroke';

const MotionDiv = motion.div;

export default function ArtPiece({ progress, src, title, credit, x, y, w, h, tCenter = 1 }) {
  const presence = useTransform(progress, (v) => {
    const d = Math.abs(v - tCenter);
    return Math.min(Math.max(1 - d * 4, 0), 1);
  });
  const draw = useTransform(presence, (p) => Math.min(p * 1.5, 1));
  const opacity = useTransform(presence, (p) => 0.08 + 0.92 * p);

  const pad = 24;
  const frameD = `M ${pad} ${pad} L ${w - pad} ${pad + 3} L ${w - pad - 2} ${h - pad} L ${pad + 3} ${h - pad - 2} L ${pad} ${pad}`;

  return (
    <MotionDiv
      className="pointer-events-none absolute"
      style={{ left: x, top: y, width: w, height: h + 90, opacity }}
    >
      <img
        src={src}
        alt={`${title}, charcoal drawing by ${credit}`}
        loading="lazy"
        className="absolute object-cover"
        style={{ left: pad + 8, top: pad + 8, width: w - 2 * pad - 16, height: h - 2 * pad - 16 }}
      />
      <svg className="absolute inset-0" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        <Stroke d={frameD} role="sketch" seed={55} progress={draw} />
      </svg>
      {/* museum label */}
      <div className="absolute" style={{ left: pad + 8, top: h + 2 }}>
        <p className="font-display text-ink text-[24px] italic">{title}</p>
        <p className="font-hand text-ink-faint text-[18px]">
          {credit} · charcoal · 2024
        </p>
      </div>
    </MotionDiv>
  );
}
