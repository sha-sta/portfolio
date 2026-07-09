import SectionFrame from './SectionFrame';
import { projects } from '../../content/projects';

export default function ProjectsSection({ section, tStop, progress }) {
  return (
    <SectionFrame section={section} tStop={tStop} progress={progress}>
      <div className="grid grid-cols-2 gap-x-14 gap-y-9">
        {projects.map((p) => (
          <article key={p.id} id={`project-${p.id}`}>
            <div className="flex items-baseline gap-5">
              <h3 className="font-display text-[34px] font-medium lowercase">{p.name}</h3>
              <span className="text-ink-faint text-[19px] italic">{p.tagline}</span>
            </div>
            {p.badge && (
              <p className="font-hand text-sanguine mt-1 text-[19px]">{p.badge}</p>
            )}
            <ul className="mt-3 space-y-2 text-[20px] leading-normal">
              {p.bullets.map((b, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden="true" className="text-ink-faint">–</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-7 text-[20px]">
              {p.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-1 underline-offset-4 hover:text-sanguine"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}
