import { motion, useTransform } from 'framer-motion';
import SectionFrame from './SectionFrame';
import Stroke from '../../charcoal/Stroke';
import { hero, contact } from '../../content/contact';

const MotionDiv = motion.div;
const MotionSvg = motion.svg;

// visitors try to scroll sideways — say it plainly, then get out of the way
// (fades as soon as scrolling starts)
function ScrollHint({ progress }) {
  const opacity = useTransform(progress, [0, 0.015], [1, 0]);
  // read synchronously: framer's useReducedMotion is false on first render
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <MotionDiv className="mt-9 flex items-center gap-4" style={{ opacity }}>
      <p className="font-hand text-ink-faint text-[22px]">scroll down</p>
      <MotionSvg
        className="h-[34px] w-[22px]"
        viewBox="0 0 22 34"
        aria-hidden="true"
        animate={reduced ? undefined : { y: [0, 7, 0] }}
        transition={reduced ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Stroke d="M 11 3 L 11 25" role="sketch" seed={71} widthScale={0.4} />
        <Stroke d="M 4 19 L 11 29 L 18 19" role="sketch" seed={72} widthScale={0.4} />
      </MotionSvg>
    </MotionDiv>
  );
}

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
        <ScrollHint progress={progress} />
      </div>
    </SectionFrame>
  );
}
