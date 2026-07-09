// Studio-wall marginalia: small charcoal studies scattered across the paper
// between sections, each sketching itself in as the camera approaches. This
// is what makes the world read as a working artist's wall instead of empty
// paper with a line through it.

import { motion, useTransform } from 'framer-motion';
import Stroke from '../charcoal/Stroke';

const MotionDiv = motion.div;

// paths are in doodle-local coordinates (~200x200 boxes)
const DOODLES = [
  {
    id: 'okn-eye',
    // between hero and work, above the route
    x: 1620,
    y: 380,
    w: 260,
    h: 240,
    seg: 0,
    frac: 0.5,
    caption: 'okn trace',
    captionAt: { x: 60, y: 232 },
    paths: [
      // almond eye
      { d: 'M 15 70 C 70 18, 160 18, 225 70 C 160 118, 70 118, 15 70', role: 'sketch', seed: 61 },
      // iris
      { d: 'M 120 32 C 145 42, 145 96, 120 104 C 95 96, 95 42, 120 32', role: 'sketch', seed: 62 },
      // sawtooth nystagmus trace: slow drift up, quick reset
      {
        d: 'M 15 185 L 55 158 L 60 182 L 100 155 L 105 179 L 145 152 L 150 176 L 190 149 L 195 173 L 228 150',
        role: 'sketch',
        seed: 63,
      },
    ],
  },
  {
    id: 'spark-line',
    // on the descent from work to projects
    x: 2150,
    y: 1180,
    w: 220,
    h: 130,
    seg: 1,
    frac: 0.42,
    paths: [
      { d: 'M 10 110 L 45 82 L 62 95 L 100 45 L 122 62 L 160 22 L 205 38', role: 'sketch', seed: 71 },
      { d: 'M 10 118 L 205 118', role: 'guide', seed: 72 },
    ],
  },
  {
    id: 'hatch-patch',
    x: 2820,
    y: 1720,
    w: 170,
    h: 150,
    seg: 1,
    frac: 0.62,
    paths: [
      { d: 'M 15 130 L 55 15', role: 'sketch', seed: 81 },
      { d: 'M 45 135 L 85 20', role: 'sketch', seed: 82 },
      { d: 'M 75 138 L 115 23', role: 'sketch', seed: 83 },
      { d: 'M 105 140 L 145 25', role: 'sketch', seed: 84 },
      { d: 'M 20 55 L 150 95', role: 'guide', seed: 85 },
      { d: 'M 12 85 L 142 125', role: 'guide', seed: 86 },
    ],
  },
  {
    id: 'node-graph',
    // between open source and contact
    x: 4750,
    y: 1950,
    w: 260,
    h: 200,
    seg: 3,
    frac: 0.42,
    caption: 'entities, resolved',
    captionAt: { x: 55, y: 196 },
    paths: [
      { d: 'M 40 40 C 52 32, 64 40, 58 52 C 50 62, 34 54, 40 40', role: 'sketch', seed: 91 },
      { d: 'M 180 30 C 194 24, 204 34, 197 46 C 188 55, 172 44, 180 30', role: 'sketch', seed: 92 },
      { d: 'M 110 110 C 124 102, 136 112, 129 126 C 120 137, 102 124, 110 110', role: 'sketch', seed: 93 },
      { d: 'M 215 130 C 228 124, 238 133, 232 145 C 224 155, 209 143, 215 130', role: 'sketch', seed: 94 },
      { d: 'M 58 48 L 108 112', role: 'guide', seed: 95 },
      { d: 'M 190 44 L 128 112', role: 'guide', seed: 96 },
      { d: 'M 132 122 L 212 136', role: 'guide', seed: 97 },
      { d: 'M 60 44 L 176 36', role: 'guide', seed: 98 },
    ],
  },
];

function Doodle({ doodle, progress, tCenter }) {
  const presence = useTransform(progress, (v) => {
    const d = Math.abs(v - tCenter);
    return Math.min(Math.max(1 - d * 4.5, 0), 1);
  });
  const opacity = useTransform(presence, (p) => 0.15 + 0.7 * p);

  return (
    <MotionDiv
      className="pointer-events-none absolute"
      style={{ left: doodle.x, top: doodle.y, width: doodle.w, height: doodle.h, opacity }}
    >
      <svg width={doodle.w} height={doodle.h} viewBox={`0 0 ${doodle.w} ${doodle.h}`} aria-hidden="true">
        {doodle.paths.map((p, i) => (
          <Stroke key={i} d={p.d} role={p.role} seed={p.seed} progress={presence} />
        ))}
      </svg>
      {doodle.caption && (
        <span
          className="font-hand text-ink-faint absolute text-[17px]"
          style={{ left: doodle.captionAt.x, top: doodle.captionAt.y }}
        >
          {doodle.caption}
        </span>
      )}
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
