import SectionFrame from './SectionFrame';
import { experience } from '../../content/experience';

export default function WorkSection({ section, tStop, progress }) {
  return (
    <SectionFrame section={section} tStop={tStop} progress={progress}>
      <div className="grid grid-cols-2 gap-x-16 gap-y-12">
        {experience.map((e) => (
          <article key={e.id}>
            <h3 className="font-display text-[34px] font-medium lowercase">
              {e.link ? (
                <a href={e.link} className="hover:text-sanguine" target="_blank" rel="noreferrer">
                  {e.company} ↗
                </a>
              ) : (
                e.company
              )}
            </h3>
            <p className="text-ink-faint mt-1 text-[19px]">
              {e.role} · {e.when}
            </p>
            <ul className="mt-3 space-y-2 text-[20px] leading-normal">
              {e.bullets.map((b, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden="true" className="text-ink-faint">–</span>
                  <span>
                    {typeof b === 'string' ? b : b.text}
                    {/* strings have a legacy .link() method — must type-check */}
                    {typeof b === 'object' && b.link && (
                      <>
                        {' '}
                        <a
                          href={b.link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-1 underline-offset-4 hover:text-sanguine"
                        >
                          {b.link.label} ↗
                        </a>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}
