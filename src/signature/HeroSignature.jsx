// The opening beat: Christian's actual signature (centerline-traced from
// public/cy-signature.png) writes itself stroke-by-stroke, in the world, at
// the exact spot where the master line begins — the trailing flourish of the
// "Y" hands off into the line.

import { useMemo } from 'react';
import { useTransform } from 'framer-motion';
import { strokes, SIG_W, SIG_H } from './signature.paths';
import { catmullRomToPath } from '../world/spline';
import Stroke from '../charcoal/Stroke';

function polylineLength(pts) {
  let l = 0;
  for (let i = 1; i < pts.length; i++) {
    l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  return l;
}

function SigStroke({ points, master, from, to, seed }) {
  const d = useMemo(() => catmullRomToPath(points, 0.9), [points]);
  const progress = useTransform(master, (v) => (v - from) / (to - from));
  return <Stroke d={d} role="signature" progress={progress} seed={seed} widthScale={2.2} />;
}

// `progress` is an external MotionValue (0 → 1); the owner sequences it so
// the master line can gate on the same value (line emerges as the pen lifts).
export default function HeroSignature({ x, y, scale, progress }) {
  const master = progress;

  // cumulative length fractions → each stroke draws in writing order
  const spans = useMemo(() => {
    const lens = strokes.map(polylineLength);
    const total = lens.reduce((a, b) => a + b, 0);
    let acc = 0;
    return lens.map((l) => {
      const from = acc / total;
      acc += l;
      return [from, acc / total];
    });
  }, []);

  return (
    <svg
      className="pointer-events-none absolute"
      style={{ left: x, top: y, width: SIG_W * scale, height: SIG_H * scale }}
      viewBox={`0 0 ${SIG_W} ${SIG_H}`}
      aria-label="Christian Yoon's signature"
      role="img"
    >
      {strokes.map((pts, i) => (
        <SigStroke
          key={i}
          points={pts}
          master={master}
          from={spans[i][0]}
          to={spans[i][1]}
          seed={i + 40}
        />
      ))}
    </svg>
  );
}
