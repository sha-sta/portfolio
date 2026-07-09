import SectionFrame from './SectionFrame';
import { openSource } from '../../content/openSource';

export default function OpenSourceSection({ section, tStop, progress }) {
  return (
    <SectionFrame section={section} tStop={tStop} progress={progress}>
      <div className="max-w-[1080px] space-y-10">
        {openSource.map((os) => (
          <div key={os.project}>
            <div className="flex items-baseline gap-5">
              <h3 className="font-display text-[36px] font-medium">
                <a href={os.href} target="_blank" rel="noreferrer" className="hover:text-sanguine">
                  {os.project} ↗
                </a>
              </h3>
              <span className="font-hand text-sanguine text-[20px]">{os.stars}</span>
            </div>
            {os.blurb && <p className="text-ink-soft mt-2 text-[21px] italic">{os.blurb}</p>}
            <ul className="mt-4 space-y-4 text-[20px] leading-normal">
              {os.prs.map((pr) => (
                <li key={pr.id} className="flex gap-3">
                  <a
                    href={pr.href}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 underline decoration-1 underline-offset-4 hover:text-sanguine"
                  >
                    {pr.id}
                  </a>
                  <span>{pr.note}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
