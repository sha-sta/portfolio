// Studio-wall marginalia: small unlabeled charcoal doodles scattered across
// the paper between sections, each sketching itself in as the camera
// approaches. Nerdy but generic: anyone who knows, knows; nothing is a logo
// or a caption.

import { motion, useTransform } from 'framer-motion';
import Stroke from '../charcoal/Stroke';

const MotionDiv = motion.div;

// paths are in doodle-local coordinates
const DOODLES = [
  {
    // gradient descent: a loss bowl, a dotted path down the slope, the ball
    // resting at the minimum
    id: 'descent',
    x: 3150,
    y: 1830,
    w: 250,
    h: 170,
    seg: 2,
    frac: 0.45,
    paths: [
      { d: 'M 15 30 C 55 155, 190 155, 232 38', role: 'sketch', seed: 61 },
      { d: 'M 52 62 L 66 78', role: 'guide', seed: 62 },
      { d: 'M 78 92 L 92 106', role: 'guide', seed: 63 },
      { d: 'M 104 116 L 115 124', role: 'guide', seed: 64 },
      { d: 'M 124 143 a 9 9 0 1 1 0.1 0', role: 'sketch', seed: 65 },
    ],
  },
  {
    // a bézier with its control handles out — the whole site is made of these
    id: 'bezier',
    x: 2840,
    y: 1600,
    w: 250,
    h: 150,
    seg: 1,
    frac: 0.62,
    paths: [
      { d: 'M 20 120 C 85 22, 165 22, 230 120', role: 'sketch', seed: 81 },
      { d: 'M 20 120 L 85 22', role: 'guide', seed: 82 },
      { d: 'M 230 120 L 165 22', role: 'guide', seed: 83 },
      { d: 'M 80 17 a 6 6 0 1 1 0.1 0', role: 'sketch', seed: 84 },
      { d: 'M 160 17 a 6 6 0 1 1 0.1 0', role: 'sketch', seed: 85 },
      { d: 'M 14 114 L 26 114 L 26 126 L 14 126 L 14 114', role: 'sketch', seed: 86 },
      { d: 'M 224 114 L 236 114 L 236 126 L 224 126 L 224 114', role: 'sketch', seed: 87 },
    ],
  },
  {
    // nodes and edges
    id: 'graph',
    x: 4750,
    y: 1950,
    w: 260,
    h: 190,
    seg: 3,
    frac: 0.42,
    paths: [
      { d: 'M 40 40 C 52 32, 64 40, 58 52 C 50 62, 34 54, 40 40', role: 'sketch', seed: 101 },
      { d: 'M 180 30 C 194 24, 204 34, 197 46 C 188 55, 172 44, 180 30', role: 'sketch', seed: 102 },
      { d: 'M 110 110 C 124 102, 136 112, 129 126 C 120 137, 102 124, 110 110', role: 'sketch', seed: 103 },
      { d: 'M 215 130 C 228 124, 238 133, 232 145 C 224 155, 209 143, 215 130', role: 'sketch', seed: 104 },
      { d: 'M 58 48 L 108 112', role: 'guide', seed: 105 },
      { d: 'M 190 44 L 128 112', role: 'guide', seed: 106 },
      { d: 'M 132 122 L 212 136', role: 'guide', seed: 107 },
      { d: 'M 60 44 L 176 36', role: 'guide', seed: 108 },
    ],
  },
];

function Doodle({ doodle, progress, tCenter }) {
  const presence = useTransform(progress, (v) => {
    const d = Math.abs(v - tCenter);
    return Math.min(Math.max(1 - d * 5, 0), 1);
  });
  // finish drawing well before full presence so passers-by never see a
  // half-drawn fragment; fade opacity on a sharper curve
  const draw = useTransform(presence, (p) => Math.min(p * 1.7, 1));
  const opacity = useTransform(presence, (p) => 0.08 + 0.72 * p * p);

  return (
    <MotionDiv
      className="pointer-events-none absolute"
      style={{ left: doodle.x, top: doodle.y, width: doodle.w, height: doodle.h, opacity }}
    >
      <svg width={doodle.w} height={doodle.h} viewBox={`0 0 ${doodle.w} ${doodle.h}`} aria-hidden="true">
        {doodle.paths.map((p, i) => (
          <Stroke key={i} d={p.d} role={p.role} seed={p.seed} progress={draw} />
        ))}
      </svg>
    </MotionDiv>
  );
}

export default function Marginalia({ camera, progress }) {
  return (
    <>
      {DOODLES.map((d) => {
        const t0 = camera.tStops[d.seg];
        const t1 = camera.tStops[d.seg + 1];
        return <Doodle key={d.id} doodle={d} progress={progress} tCenter={t0 + (t1 - t0) * d.frac} />;
      })}
    </>
  );
}
