// Dev-only authoring tool (open /?editor while `npm run dev`).
// Shows the whole world scaled to fit with draggable handles for section
// anchors (filled) and segment waypoints (hollow). "copy worldMap" puts a
// paste-ready snippet on the clipboard; paste into worldMap.js and HMR
// re-renders the real thing.

import { useState, useRef } from 'react';
import {
  WORLD_W,
  WORLD_H,
  sections as baseSections,
  segments as baseSegments,
} from '../world/worldMap';
import { catmullRomToPath } from '../world/spline';

export default function PathEditor() {
  const [secs, setSecs] = useState(() => baseSections.map((s) => ({ ...s, anchor: { ...s.anchor }, box: { ...s.box } })));
  const [segs, setSegs] = useState(() => baseSegments.map((g) => ({ ...g, waypoints: g.waypoints.map((w) => [...w]) })));
  const [ref, setRef] = useState('');
  const svgRef = useRef(null);
  const drag = useRef(null);

  const points = [];
  secs.forEach((s, i) => {
    points.push([s.anchor.x, s.anchor.y]);
    if (i < segs.length) points.push(...segs[i].waypoints);
  });
  const d = catmullRomToPath(points);

  const toWorld = (e) => {
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    return [Math.round(p.x), Math.round(p.y)];
  };

  const onMove = (e) => {
    if (!drag.current) return;
    const [x, y] = toWorld(e);
    const { kind, i, j } = drag.current;
    if (kind === 'anchor') {
      setSecs((prev) =>
        prev.map((s, k) => {
          if (k !== i) return s;
          const dx = x - s.anchor.x;
          const dy = y - s.anchor.y;
          return { ...s, anchor: { x, y }, box: { ...s.box, x: s.box.x + dx, y: s.box.y + dy } };
        })
      );
    } else {
      setSegs((prev) =>
        prev.map((g, k) => (k !== i ? g : { ...g, waypoints: g.waypoints.map((w, m) => (m === j ? [x, y] : w)) }))
      );
    }
  };

  const copy = () => {
    const out =
      'export const sections = ' +
      JSON.stringify(secs, null, 2) +
      ';\n\nexport const segments = ' +
      JSON.stringify(segs, null, 2) +
      ';\n';
    navigator.clipboard.writeText(out);
  };

  return (
    <div className="fixed inset-0 bg-paper">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
        className="h-full w-full"
        onPointerMove={onMove}
        onPointerUp={() => (drag.current = null)}
      >
        {ref && <image href={ref} x="0" y="0" opacity="0.35" />}
        {secs.map((s) => (
          <g key={s.id}>
            <rect x={s.box.x} y={s.box.y} width={s.box.w} height={s.box.h} fill="none" stroke="var(--color-hairline)" strokeWidth="3" />
            <text x={s.box.x + 24} y={s.box.y + 60} fontSize="48" fill="var(--color-ink-faint)">{s.id}</text>
          </g>
        ))}
        <path d={d} fill="none" stroke="var(--color-ink)" strokeWidth="4" strokeOpacity="0.7" />
        {segs.map((g, i) =>
          g.waypoints.map((w, j) => (
            <circle
              key={`${i}-${j}`}
              cx={w[0]}
              cy={w[1]}
              r="26"
              fill="var(--color-paper)"
              stroke="var(--color-sanguine)"
              strokeWidth="5"
              style={{ cursor: 'grab' }}
              onPointerDown={(e) => {
                e.target.setPointerCapture(e.pointerId);
                drag.current = { kind: 'waypoint', i, j };
              }}
            />
          ))
        )}
        {secs.map((s, i) => (
          <circle
            key={s.id}
            cx={s.anchor.x}
            cy={s.anchor.y}
            r="30"
            fill="var(--color-sanguine)"
            style={{ cursor: 'grab' }}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId);
              drag.current = { kind: 'anchor', i };
            }}
          />
        ))}
      </svg>
      <div className="fixed top-3 left-3 flex gap-2 font-hand text-sm">
        <button onClick={copy} className="border border-ink bg-paper px-3 py-1 hover:bg-paper-deep">
          copy worldMap
        </button>
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="reference image url"
          className="border border-hairline bg-paper px-2 py-1"
        />
      </div>
    </div>
  );
}
