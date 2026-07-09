import { sections } from '../world/worldMap';

export default function SketchNav({ onIndex }) {
  return (
    <nav className="font-hand bg-paper/85 fixed top-4 right-5 z-40 flex items-center gap-6 rounded-full px-4 py-1.5 text-[17px] lowercase">
      <div className="hidden items-center gap-6 md:flex">
        {sections
          .filter((s) => s.hash)
          .map((s) => (
            <a
              key={s.id}
              href={`#/${s.hash}`}
              className="text-ink-soft hover:text-sanguine transition-colors"
            >
              {s.label}
            </a>
          ))}
      </div>
      <button
        onClick={onIndex}
        className="border-ink-soft text-ink hover:text-sanguine hover:border-sanguine -rotate-1 cursor-pointer border px-2.5 py-0.5 transition-colors"
        style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}
      >
        index.
      </button>
    </nav>
  );
}
