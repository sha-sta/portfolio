// The opening beat: Christian's actual signature (centerline-traced from
// public/cy-signature.png) writes itself stroke-by-stroke, in the world, at
// the exact spot where the master line begins — the trailing flourish of the
// "Y" hands off into the line.

import { useMemo } from 'react';
import { useTransform } from 'framer-motion';
import { strokes, SIG_W, SIG_H } from './signature.paths';
import { catmullRomToPath } from '../world/spline';
import { samplePathPoints } from '../charcoal/roughen';
import Stroke from '../charcoal/Stroke';

// no stroke may draw faster than this share of the total — tiny ticks
// otherwise finish in a frame or two and read as pops, not pen motion
const MIN_SPAN = 0.045;

function SigStroke({ d, master, from, to, seed, finish }) {
  const progress = useTransform(master, (v) => (v - from) / (to - from));
  return (
    <Stroke d={d} role="signature" progress={progress} seed={seed} widthScale={2.0} finish={finish} />
  );
}

// `progress` is an external MotionValue (0 → 1); the owner sequences it so
// the master line can gate on the same value (line emerges as the pen lifts).
// `finish` (optional MotionValue) fades the deferred hairline pass in after
// the draw. With x/y/scale it positions itself in the world; with className
// it renders as a normal flowing svg (linear mode).
export default function HeroSignature({ x, y, scale, progress, finish, className }) {
  const master = progress;

  const ds = useMemo(() => strokes.map((pts) => catmullRomToPath(pts, 0.9)), []);

  // spans from the MEASURED curve length (not the raw polyline) so the pen
  // moves at constant speed, with a floor so short strokes don't pop
  const spans = useMemo(() => {
    const lens = ds.map((d) => samplePathPoints(d).total);
    const total = lens.reduce((a, b) => a + b, 0);
    const weights = lens.map((l) => Math.max(l / total, MIN_SPAN));
    const wTotal = weights.reduce((a, b) => a + b, 0);
    let acc = 0;
    return weights.map((w) => {
      const from = acc / wTotal;
      acc += w;
      return [from, acc / wTotal];
    });
  }, [ds]);

  return (
    <svg
      className={className ?? 'pointer-events-none absolute'}
      style={
        className ? undefined : { left: x, top: y, width: SIG_W * scale, height: SIG_H * scale }
      }
      viewBox={`0 0 ${SIG_W} ${SIG_H}`}
      aria-label="Christian Yoon's signature"
      role="img"
    >
      {ds.map((d, i) => (
        <SigStroke
          key={i}
          d={d}
          master={master}
          from={spans[i][0]}
          to={spans[i][1]}
          seed={i + 40}
          finish={finish}
        />
      ))}
    </svg>
  );
}
