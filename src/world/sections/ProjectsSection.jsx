import SectionFrame from './SectionFrame';
import { projects } from '../../content/projects';

export default function ProjectsSection({ section, tStop, progress }) {
  return (
    <SectionFrame section={section} tStop={tStop} progress={progress}>
      <div className="grid grid-cols-2 gap-x-14 gap-y-9">
        {projects.map((p) => (
          <article key={p.id} id={`project-${p.id}`}>
            <h3 className="font-display text-[34px] font-medium lowercase">
              {p.links?.[0] ? (
                <a href={p.links[0].href} target="_blank" rel="noreferrer" className="hover:text-sanguine">{p.name} ↗</a>
              ) : (
                p.name
              )}
            </h3>
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
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}
