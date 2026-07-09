import { lazy, Suspense } from 'react';
import WorldStage from './world/WorldStage';
import WorldSVG from './world/WorldSVG';
import { sections } from './world/worldMap';

const PathEditor = import.meta.env.DEV
  ? lazy(() => import('./dev/PathEditor'))
  : null;

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
        {({ camera, progress }) => (
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
            <WorldSVG camera={camera} progress={progress} />
          </>
        )}
      </WorldStage>
    </div>
  );
}

export default App;
