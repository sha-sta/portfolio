// The master charcoal line, drawn slightly ahead of the camera so it leads
// you through the world. One <path> stack per segment keeps repaint regions
// small: only the segment being drawn invalidates.

import { useTransform } from 'framer-motion';
import { WORLD_W, WORLD_H } from './worldMap';
import Stroke from '../charcoal/Stroke';

const LEAD = 0.08; // the line stays this far ahead of the camera (in t)

function SegmentStroke({ d, t0, t1, progress, seed }) {
  const segProgress = useTransform(progress, (v) => {
    const lead = Math.min(v + LEAD, 1);
    return (lead - t0) / (t1 - t0);
  });
  return <Stroke d={d} role="master" progress={segProgress} seed={seed} />;
}

export default function WorldSVG({ camera, progress }) {
  return (
    <svg
      className="pointer-events-none absolute top-0 left-0"
      width={WORLD_W}
      height={WORLD_H}
      viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
      aria-hidden="true"
    >
      {camera.segmentDs.map((d, i) => (
        <SegmentStroke
          key={i}
          d={d}
          t0={camera.tStops[i]}
          t1={camera.tStops[i + 1]}
          progress={progress}
          seed={i + 1}
        />
      ))}
    </svg>
  );
}
