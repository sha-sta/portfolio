import WorldStage from './world/WorldStage';
import { sections } from './world/worldMap';

function App() {
  return (
    <div className="bg-paper text-ink">
      <WorldStage>
        {() => (
          <>
            {sections.map((s) => (
              <div
                key={s.id}
                className="absolute flex items-center justify-center rounded-sm border border-hairline bg-paper-deep/60"
                style={{ left: s.box.x, top: s.box.y, width: s.box.w, height: s.box.h }}
              >
                <span className="font-display text-5xl lowercase">{s.label}</span>
              </div>
            ))}
          </>
        )}
      </WorldStage>
    </div>
  );
}

export default App;
