// The world: a fixed viewport, one big translated div, and a scroll proxy that
// owns the native scrollbar. Scroll position → t along the master line → the
// world div's translate3d (the only animated transform on the page).

import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const MotionDiv = motion.div;
import { buildCamera } from './camera';
import { WORLD_W, WORLD_H, sections } from './worldMap';
import { useHashRoute } from '../routes/useHashRoute';

const TRAVEL_RATIO = 0.85; // scroll px per world-unit of line length

export default function WorldStage({ children, reducedMotion = false }) {
  const [camera] = useState(() => buildCamera());
  const scrollRange = Math.round(camera.total * TRAVEL_RATIO);

  const { scrollYProgress } = useScroll();
  const smooth = useSpring(
    scrollYProgress,
    reducedMotion
      ? { stiffness: 1000, damping: 100 }
      : { stiffness: 110, damping: 28, mass: 0.4 }
  );

  const [viewport, setViewport] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));
  useEffect(() => {
    const onResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // World units → screen px; sections are authored ~1400-1600 wide.
  const scale = Math.min(
    Math.max(Math.min(viewport.w / 1560, viewport.h / 1060), 0.5),
    1.05
  );

  const transform = useTransform(smooth, (v) => {
    const p = camera.pointAt(v);
    const tx = viewport.w / 2 - p.x * scale;
    const ty = viewport.h / 2 - p.y * scale;
    return `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${scale})`;
  });

  useHashRoute({ camera, scrollRange, progress: scrollYProgress });

  return (
    <>
      <div
        style={{ height: `calc(100vh + ${scrollRange}px)` }}
        className="relative"
        aria-hidden="true"
      >
        {camera.tStops.map((t, i) => (
          <div
            key={sections[i].id}
            className="absolute left-0 h-screen w-px"
            style={{ top: t * scrollRange, scrollSnapAlign: 'start' }}
          />
        ))}
      </div>
      <div className="fixed inset-0 overflow-hidden">
        <MotionDiv
          className="absolute top-0 left-0 origin-top-left will-change-transform"
          style={{ width: WORLD_W, height: WORLD_H, transform }}
        >
          {children({ camera, progress: smooth, rawProgress: scrollYProgress })}
        </MotionDiv>
      </div>
    </>
  );
}
