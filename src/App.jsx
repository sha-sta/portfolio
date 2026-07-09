import { lazy, Suspense, useEffect, useState } from 'react';
import { useMotionValue, animate } from 'framer-motion';
import { useAppMode } from './hooks/useAppMode';
import LinearApp from './linear/LinearApp';
import WorldStage from './world/WorldStage';
import WorldSVG from './world/WorldSVG';
import Marginalia from './world/Marginalia';
import ArtPiece from './world/ArtPiece';
import HeroSignature from './signature/HeroSignature';
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
      <WorldSVG camera={camera} progress={progress} gate={sig} />
      <Marginalia camera={camera} progress={progress} />
      <ArtPiece
        progress={progress}
        src="/take-your-marks.webp"
        title="take your marks"
        credit="christian yoon"
        x={5580}
        y={2350}
        w={760}
        h={360}
      />
      {sections.map((s, i) => {
        const Section = SECTION_COMPONENTS[s.id];
        return (
          <Section key={s.id} section={s} tStop={camera.tStops[i]} progress={progress} />
        );
      })}
      <HeroSignature x={SIGNATURE.x} y={SIGNATURE.y} scale={SIGNATURE.scale} progress={sig} />
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
