// The master charcoal line, drawn slightly ahead of the camera so it leads
// you through the world. One <path> stack per segment keeps repaint regions
// small: only the segment being drawn invalidates.

import { useTransform } from 'framer-motion';
import { WORLD_W, WORLD_H } from './worldMap';
import Stroke from '../charcoal/Stroke';

const LEAD = 0.08; // the line stays this far ahead of the camera (in t)

function SegmentStroke({ d, t0, t1, progress, gate, seed }) {
  // gate = the eased 0 → 1 handoff that runs after the signature completes:
  // the line's lead grows in over ~0.6s as the pen lifts off the flourish,
  // instead of the full LEAD popping in at once
  const inputs = gate ? [progress, gate] : [progress];
  const segProgress = useTransform(inputs, (vals) => {
    const v = vals[0];
    const g = gate ? vals[1] : 1;
    const lead = Math.min(v + LEAD * g, 1);
    return (lead - t0) / (t1 - t0);
  });
  return <Stroke d={d} role="master" progress={segProgress} seed={seed} />;
}

export default function WorldSVG({ camera, progress, gate }) {
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
          gate={gate}
          seed={i + 1}
        />
      ))}
    </svg>
  );
}
