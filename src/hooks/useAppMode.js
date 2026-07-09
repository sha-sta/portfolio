// One startup decision: spatial world (desktop, fine pointer) or linear
// document (small screens / coarse pointers). Reduced motion is orthogonal:
// world mode keeps the layout but pre-draws lines and cuts the camera.

import { useEffect, useState } from 'react';

const LINEAR_QUERY = '(max-width: 767px), (pointer: coarse)';
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

// read synchronously — framer's useReducedMotion is false on first render,
// which would let intro animations start before the preference lands
function useMedia(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export function useAppMode() {
  const linear = useMedia(LINEAR_QUERY);
  const reduced = useMedia(REDUCE_QUERY);
  return { mode: linear ? 'linear' : 'world', reduced };
}
