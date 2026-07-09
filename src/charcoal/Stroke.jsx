// One logical charcoal stroke = 2-3 stacked jittered <path>es sharing a
// single draw progress. `pathLength={1}` normalizes every pass so one
// dashoffset value drives them in sync. No SVG filters — texture comes from
// the pass stack (see strokeStyle.js).

import { useMemo } from 'react';
import { motion, useTransform, isMotionValue } from 'framer-motion';

const MotionPath = motion.path;
import { roughenPath } from './roughen';
import { strokePasses, INK } from './strokeStyle';

export default function Stroke({
  d,
  role = 'sketch',
  progress = 1, // number | MotionValue, 0 → 1
  seed = 1,
  color = INK,
  widthScale = 1,
}) {
  const passes = strokePasses(role);
  const ds = useMemo(
    () =>
      passes.map((p, i) =>
        roughenPath(d, { amp: p.amp, wobble: p.wobble, seed: seed * 7919 + i * 101 })
      ),
    [d, passes, seed]
  );

  const mv = isMotionValue(progress);
  // offset 1.02 (not 1.0) parks the round linecap fully off the path start,
  // so undrawn strokes don't show a cap dot
  const mapOffset = (v) => (1 - Math.min(Math.max(v, 0), 1)) * (v <= 0 ? 1.02 : 1);
  // eslint-disable-next-line react-hooks/rules-of-hooks -- progress kind is stable per mount
  const dashoffset = mv ? useTransform(progress, mapOffset) : mapOffset(progress);

  return (
    <g>
      {ds.map((dd, i) => (
        <MotionPath
          key={i}
          d={dd}
          pathLength={1}
          fill="none"
          stroke={color}
          strokeWidth={passes[i].width * widthScale}
          strokeOpacity={passes[i].opacity}
          strokeLinecap={passes[i].linecap}
          strokeLinejoin="round"
          strokeDasharray="1 2"
          style={{ strokeDashoffset: dashoffset }}
        />
      ))}
    </g>
  );
}
