import { lazy, Suspense, useEffect, useState } from 'react';
import { useMotionValue, animate } from 'framer-motion';
import { useAppMode } from './hooks/useAppMode';
import LinearApp from './linear/LinearApp';
import WorldStage from './world/WorldStage';
import WorldSVG from './world/WorldSVG';
import ArtPiece from './world/ArtPiece';
import HeroSignature from './signature/HeroSignature';
import GrainDefs from './charcoal/GrainDefs';
import SketchNav from './nav/SketchNav';
import IndexOverlay from './nav/IndexOverlay';
import HeroSection from './world/sections/HeroSection';
import WorkSection from './world/sections/WorkSection';
import ProjectsSection from './world/sections/ProjectsSection';
import OpenSourceSection from './world/sections/OpenSourceSection';
import ContactSection from './world/sections/ContactSection';
import { sections, SIGNATURE } from './world/worldMap';

const PathEditor = import.meta.env.DEV
  ? lazy(() => import('./dev/PathEditor'))
  : null;

const SECTION_COMPONENTS = {
  hero: HeroSection,
  work: WorkSection,
  projects: ProjectsSection,
  'open-source': OpenSourceSection,
  contact: ContactSection,
};

function WorldContent({ camera, progress, reduced }) {
  const sig = useMotionValue(reduced ? 1 : 0);
  // runs 0 → 1 after the signature completes: eases the master line's lead in
  // (no end-of-draw pop) and fades in the deferred hairline pass
  const finish = useMotionValue(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      sig.set(1);
      finish.set(1);
      return undefined;
    }
    let cancelled = false;
    let settle;
    const draw = animate(sig, 1, { duration: 2.1, ease: 'linear', delay: 0.35 });
    draw.then(() => {
      if (!cancelled) settle = animate(finish, 1, { duration: 0.6, ease: 'easeOut' });
    });
    return () => {
      cancelled = true;
      draw.stop();
      settle?.stop();
    };
  }, [sig, finish, reduced]);

  return (
    <>
      <WorldSVG camera={camera} progress={progress} gate={finish} />
      <ArtPiece
        progress={progress}
        src="/take-your-marks.webp"
        title="“take your marks”"
        credit="christian yoon"
        x={5040}
        y={2700}
        w={990}
        h={470}
      />
      {sections.map((s, i) => {
        const Section = SECTION_COMPONENTS[s.id];
        return (
          <Section key={s.id} section={s} tStop={camera.tStops[i]} progress={progress} />
        );
      })}
      <HeroSignature
        x={SIGNATURE.x}
        y={SIGNATURE.y}
        scale={SIGNATURE.scale}
        progress={sig}
        finish={finish}
      />
    </>
  );
}

function App() {
  const [indexOpen, setIndexOpen] = useState(false);
  const { mode, reduced } = useAppMode();

  if (PathEditor && new URLSearchParams(location.search).has('editor')) {
    return (
      <Suspense fallback={null}>
        <PathEditor />
      </Suspense>
    );
  }

  return (
    <div className="text-ink">
      <GrainDefs />
      <SketchNav onIndex={() => setIndexOpen(true)} />
      <IndexOverlay open={indexOpen} onClose={() => setIndexOpen(false)} />
      {mode === 'linear' ? (
        <LinearApp reduced={reduced} />
      ) : (
        <WorldStage reducedMotion={reduced}>
          {({ camera, progress }) => (
            <WorldContent camera={camera} progress={progress} reduced={reduced} />
          )}
        </WorldStage>
      )}
    </div>
  );
}

export default App;
