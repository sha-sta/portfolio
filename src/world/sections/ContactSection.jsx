import SectionFrame from './SectionFrame';
import { contact } from '../../content/contact';

export default function ContactSection({ section, tStop, progress }) {
  return (
    <SectionFrame section={section} tStop={tStop} progress={progress}>
      <a
        href={`mailto:${contact.email}`}
        className="font-display block text-[42px] underline decoration-2 underline-offset-8 hover:text-sanguine"
      >
        {contact.email}
      </a>
      <div className="mt-8 flex gap-10 text-[22px]">
        <a className="underline decoration-1 underline-offset-4 hover:text-sanguine" href={contact.github} target="_blank" rel="noreferrer">
          github ↗
        </a>
        <a className="underline decoration-1 underline-offset-4 hover:text-sanguine" href={contact.linkedin} target="_blank" rel="noreferrer">
          linkedin ↗
        </a>
      </div>
    </SectionFrame>
  );
}
