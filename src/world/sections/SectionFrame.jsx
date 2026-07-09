// Shared world placement + arrival presence for a section. Sections sit faint
// on the paper (like distant pencil work) and sharpen as the camera arrives.

import { motion, useTransform } from 'framer-motion';

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
    <motion.div
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
        <h2 className="font-display mb-8 text-6xl font-semibold tracking-tight lowercase">
          {section.label}
        </h2>
      )}
      {children}
    </motion.div>
  );
}
