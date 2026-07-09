// Shared world placement + arrival presence for a section. Sections sit faint
// on the paper (like distant pencil work) and sharpen as the camera arrives.

import { motion, useTransform } from 'framer-motion';
import Stroke from '../../charcoal/Stroke';

const MotionDiv = motion.div;

// deterministic per-section seed from its id
function idSeed(id) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h % 997) + 3;
}

export default function SectionFrame({
  section,
  tStop,
  progress,
  children,
  heading = true,
  className = '',
}) {
  const presence = useTransform(progress, (v) => {
    const d = Math.abs(v - tStop);
    return Math.min(Math.max(1 - d * 5, 0), 1);
  });
  const opacity = useTransform(presence, (p) => 0.14 + 0.86 * p);
  const y = useTransform(presence, (p) => (1 - p) * 26);

  return (
    <MotionDiv
      id={section.id}
      className={`absolute ${className}`}
      style={{
        left: section.box.x,
        top: section.box.y,
        width: section.box.w,
        height: section.box.h,
        opacity,
        y,
      }}
    >
      {heading && (
        <div className="mb-8">
          <h2 className="font-display text-6xl font-semibold tracking-tight lowercase">
            {section.label}
          </h2>
          {/* rough charcoal underline sketches in with arrival */}
          <svg
            className="mt-2 h-[18px] w-[420px]"
            viewBox="0 0 420 18"
            aria-hidden="true"
          >
            <Stroke
              d="M 6 10 C 110 4, 260 14, 414 7"
              role="sketch"
              progress={presence}
              seed={idSeed(section.id)}
            />
          </svg>
        </div>
      )}
      {children}
    </MotionDiv>
  );
}
