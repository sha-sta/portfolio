// One logical charcoal stroke = 2-3 stacked jittered <path>es sharing a
// single draw progress. `pathLength={1}` normalizes every pass so one
// dashoffset value drives them in sync. No SVG filters — texture comes from
// the pass stack (see strokeStyle.js).

import { useMemo } from 'react';
import { motion, useTransform, isMotionValue } from 'framer-motion';

const MotionPath = motion.path;
import { roughenPath } from './roughen';
import { strokePasses, strokeMask, INK, GRAIN_PATTERN_ID } from './strokeStyle';

// offset 1.02 (not 1.0) parks the round linecap fully off the path start,
// so undrawn strokes don't show a cap dot
const mapOffset = (v) => (1 - Math.min(Math.max(v, 0), 1)) * (v <= 0 ? 1.02 : 1);

function StrokePass({ d, pass, widthScale, color, dashoffset, finish }) {
  // deferred passes sit out the draw (cheaper animation frame) and fade in
  // once `finish` runs 0 → 1 after the pen lifts
  const deferred = Boolean(pass.defer && finish);
  // eslint-disable-next-line react-hooks/rules-of-hooks -- deferred is stable per mount
  const opacity = deferred ? useTransform(finish, (v) => v * pass.opacity) : pass.opacity;
  return (
    <MotionPath
      d={d}
      pathLength={1}
      fill="none"
      stroke={pass.paint === 'grain' ? `url(#${GRAIN_PATTERN_ID}) #23201a` : color}
      strokeWidth={pass.width * widthScale}
      strokeLinecap={pass.linecap}
      strokeLinejoin="round"
      strokeDasharray="1 2"
      style={{ strokeDashoffset: deferred ? 0 : dashoffset, strokeOpacity: opacity }}
    />
  );
}

export default function Stroke({
  d,
  role = 'sketch',
  progress = 1, // number | MotionValue, 0 → 1
  seed = 1,
  color = INK,
  widthScale = 1,
  finish, // optional MotionValue, 0 → 1 after the draw completes
}) {
  const passes = strokePasses(role);
  const ds = useMemo(
    () =>
      passes.map((p, i) =>
        roughenPath(d, {
          amp: p.amp,
          wobble: p.wobble,
          seed: seed * 7919 + i * 101,
          offset: (p.off ?? 0) * widthScale,
        })
      ),
    [d, passes, seed, widthScale]
  );

  const mv = isMotionValue(progress);
  // eslint-disable-next-line react-hooks/rules-of-hooks -- progress kind is stable per mount
  const dashoffset = mv ? useTransform(progress, mapOffset) : mapOffset(progress);

  return (
    // multiply: overlapping strokes darken like real media instead of stacking
    // flat; the role's paper-tooth mask breaks the vector edge like dry media
    <g style={{ mixBlendMode: 'multiply' }} mask={`url(#${strokeMask(role)})`}>
      {ds.map((dd, i) => (
        <StrokePass
          key={i}
          d={dd}
          pass={passes[i]}
          widthScale={widthScale}
          color={color}
          dashoffset={dashoffset}
          finish={finish}
        />
      ))}
    </g>
  );
}
