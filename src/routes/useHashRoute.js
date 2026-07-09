// Hash routing for a spatial canvas: `#/work` ↔ camera position along the line.
// Free scroll updates the hash via replaceState (back button stays sane);
// nav clicks are plain <a href="#/..."> anchors — hashchange smooth-scrolls.

import { useEffect, useRef } from 'react';
import { useMotionValueEvent } from 'framer-motion';
import { sections } from '../world/worldMap';

export function useHashRoute({ camera, scrollRange, progress }) {
  const current = useRef('');

  useEffect(() => {
    const toTarget = (behavior) => {
      const id = location.hash.replace(/^#\/?/, '').split('/')[0] || 'hero';
      const i = sections.findIndex((s) => s.id === id);
      if (i === -1) return;
      current.current = sections[i].id;
      window.scrollTo({ top: camera.tStops[i] * scrollRange, behavior });
    };
    toTarget('instant');
    const onHash = () => toTarget('smooth');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [camera, scrollRange]);

  useMotionValueEvent(progress, 'change', (v) => {
    let nearest = 0;
    camera.tStops.forEach((t, i) => {
      if (Math.abs(t - v) < Math.abs(camera.tStops[nearest] - v)) nearest = i;
    });
    const s = sections[nearest];
    if (current.current !== s.id) {
      current.current = s.id;
      history.replaceState(
        null,
        '',
        s.hash ? `#/${s.hash}` : location.pathname + location.search
      );
    }
  });
}
