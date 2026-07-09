import SectionFrame from './SectionFrame';
import { openSource as oss } from '../../content/openSource';

export default function OpenSourceSection({ section, tStop, progress }) {
  return (
    <SectionFrame section={section} tStop={tStop} progress={progress}>
      <div className="max-w-[1080px]">
        <div className="flex items-baseline gap-5">
          <h3 className="font-display text-[36px] font-medium">
            <a href="https://github.com/unionai-oss/pandera" target="_blank" rel="noreferrer" className="hover:text-sanguine">
              {oss.project} ↗
            </a>
          </h3>
          <span className="font-hand text-sanguine text-[20px]">{oss.stars}</span>
        </div>
        <p className="text-ink-soft mt-2 text-[21px] italic">{oss.blurb}</p>
        <ul className="mt-5 space-y-4 text-[20px] leading-normal">
          {oss.prs.map((pr) => (
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
    </SectionFrame>
  );
}
