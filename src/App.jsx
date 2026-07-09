import { lazy, Suspense, useEffect } from 'react';
import { useMotionValue, useReducedMotion, animate } from 'framer-motion';
import WorldStage from './world/WorldStage';
import WorldSVG from './world/WorldSVG';
import HeroSignature from './signature/HeroSignature';
import { sections, SIGNATURE } from './world/worldMap';

const PathEditor = import.meta.env.DEV
  ? lazy(() => import('./dev/PathEditor'))
  : null;

function WorldContent({ camera, progress }) {
  const sig = useMotionValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      sig.set(1);
      return undefined;
    }
    const controls = animate(sig, 1, { duration: 2.1, ease: 'linear', delay: 0.35 });
    return () => controls.stop();
  }, [sig, reduced]);

  return (
    <>
      {sections.map((s) => (
        <div
          key={s.id}
          className="absolute flex items-center justify-center rounded-sm border border-hairline"
          style={{ left: s.box.x, top: s.box.y, width: s.box.w, height: s.box.h }}
        >
          <span className="font-display text-5xl lowercase">{s.label}</span>
        </div>
      ))}
      <WorldSVG camera={camera} progress={progress} gate={sig} />
      <HeroSignature x={SIGNATURE.x} y={SIGNATURE.y} scale={SIGNATURE.scale} progress={sig} />
    </>
  );
}

function App() {
  if (PathEditor && new URLSearchParams(location.search).has('editor')) {
    return (
      <Suspense fallback={null}>
        <PathEditor />
      </Suspense>
    );
  }

  return (
    <div className="bg-paper text-ink">
      <WorldStage>
        {({ camera, progress }) => <WorldContent camera={camera} progress={progress} />}
      </WorldStage>
    </div>
  );
}

export default App;
