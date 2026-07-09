import SectionFrame from './SectionFrame';
import { hero, contact } from '../../content/contact';

export default function HeroSection({ section, tStop, progress }) {
  return (
    <SectionFrame section={section} tStop={tStop} progress={progress} heading={false}>
      {/* the signature (rendered by HeroSignature) is the name */}
      <div className="absolute bottom-[10px] left-[30px] max-w-[880px]">
        <h1 className="sr-only">christian yoon</h1>
        <p className="text-[30px] leading-snug">{hero.line1}</p>
        <p className="text-ink-soft mt-2 text-[24px] italic">{hero.line2}</p>
        <div className="mt-7 flex gap-9 text-[22px]">
          <a className="underline decoration-1 underline-offset-4 hover:text-sanguine" href={contact.github}>
            github ↗
          </a>
          <a className="underline decoration-1 underline-offset-4 hover:text-sanguine" href={contact.linkedin}>
            linkedin ↗
          </a>
          <a className="underline decoration-1 underline-offset-4 hover:text-sanguine" href={`mailto:${contact.email}`}>
            email ↗
          </a>
        </div>
        <p className="font-hand text-ink-faint mt-9 text-[22px]">
          scroll, follow the line ⟶
        </p>
      </div>
    </SectionFrame>
  );
}
