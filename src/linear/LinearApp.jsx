// Small screens / coarse pointers get a plain vertical document with a
// charcoal line drawing down the left gutter as you scroll. Same content
// data, same hash anchors, no camera.

import { useEffect } from 'react';
import { motion, useScroll, useSpring, useMotionValue, useTransform, animate } from 'framer-motion';

const MotionDiv = motion.div;
import HeroSignature from '../signature/HeroSignature';
import Stroke from '../charcoal/Stroke';
import { hero, contact } from '../content/contact';
import { experience } from '../content/experience';
import { projects } from '../content/projects';
import { openSource as oss } from '../content/openSource';

const link = 'underline decoration-1 underline-offset-4 hover:text-sanguine';

function GutterLine({ reduced }) {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, reduced ? { stiffness: 1000, damping: 100 } : { stiffness: 120, damping: 30 });
  const progress = useTransform(smooth, (v) => (reduced ? 1 : Math.min(v + 0.06, 1)));
  return (
    <svg className="pointer-events-none fixed top-0 left-1 z-0 h-screen w-[26px]" viewBox="0 0 26 1000" preserveAspectRatio="none" aria-hidden="true">
      <Stroke d="M 13 8 C 20 250, 6 520, 15 745 C 18 840, 10 930, 13 992" role="sketch" progress={progress} seed={12} />
    </svg>
  );
}

function Heading({ id, children }) {
  return (
    <div id={id} className="mb-6 scroll-mt-20">
      <h2 className="font-display text-4xl font-semibold tracking-tight lowercase">{children}</h2>
      <svg className="mt-1 h-[14px] w-[220px]" viewBox="0 0 220 14" aria-hidden="true">
        <Stroke d="M 4 8 C 60 3, 140 11, 216 6" role="sketch" seed={id.length * 17} />
      </svg>
    </div>
  );
}

export default function LinearApp({ reduced }) {
  const sig = useMotionValue(reduced ? 1 : 0);
  // deferred fiber passes fade in after the draw (keeps the mobile draw cheap)
  const finish = useMotionValue(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      sig.set(1);
      finish.set(1);
      return undefined;
    }
    let cancelled = false;
    let settle;
    const draw = animate(sig, 1, { duration: 2.1, ease: 'linear', delay: 0.3 });
    draw.then(() => {
      if (!cancelled) settle = animate(finish, 1, { duration: 0.6, ease: 'easeOut' });
    });
    return () => {
      cancelled = true;
      draw.stop();
      settle?.stop();
    };
  }, [sig, finish, reduced]);

  // hash nav (#/work) → scroll to the anchor
  useEffect(() => {
    const go = (behavior) => {
      const id = location.hash.replace(/^#\/?/, '').split('/')[0] || 'hero';
      document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
    };
    go('instant');
    const onHash = () => go(reduced ? 'instant' : 'smooth');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [reduced]);

  return (
    <div className="relative">
      <GutterLine reduced={reduced} />
      <main className="mx-auto max-w-xl px-8 py-14">
        <section id="hero">
          <HeroSignature className="h-auto w-full max-w-md" progress={sig} finish={finish} />
          <MotionDiv
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 2.2, duration: 0.6 }}
          >
            <h1 className="sr-only">christian yoon</h1>
            <p className="mt-6 text-xl">{hero.line1}</p>
            <p className="text-ink-soft mt-1 text-base italic">{hero.line2}</p>
            <div className="mt-5 flex gap-6">
              <a className={link} href={contact.github}>github ↗</a>
              <a className={link} href={contact.linkedin}>linkedin ↗</a>
              <a className={link} href={`mailto:${contact.email}`}>email ↗</a>
            </div>
          </MotionDiv>
        </section>

        <section className="mt-20">
          <Heading id="work">work.</Heading>
          <div className="space-y-10">
            {experience.map((e) => (
              <article key={e.id}>
                <h3 className="font-display text-2xl font-medium lowercase">
                  {e.link ? (
                    <a href={e.link} className="hover:text-sanguine" target="_blank" rel="noreferrer">{e.company} ↗</a>
                  ) : (
                    e.company
                  )}
                </h3>
                <p className="text-ink-faint mt-0.5 text-sm">{e.role} · {e.when}</p>
                <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed">
                  {e.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span aria-hidden="true" className="text-ink-faint">–</span>
                      <span>
                        {typeof b === 'string' ? b : b.text}
                        {typeof b === 'object' && b.link && (
                          <>
                            {' '}
                            <a href={b.link.href} target="_blank" rel="noreferrer" className={link}>
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
        </section>

        <section className="mt-20">
          <Heading id="projects">projects.</Heading>
          <div className="space-y-10">
            {projects.map((p) => (
              <article key={p.id}>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="font-display text-2xl font-medium lowercase">{p.name}</h3>
                  <span className="text-ink-faint text-sm italic">{p.tagline}</span>
                </div>
                {p.badge && <p className="font-hand text-sanguine mt-0.5 text-sm">{p.badge}</p>}
                <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed">
                  {p.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span aria-hidden="true" className="text-ink-faint">–</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex gap-5 text-[15px]">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={link}>{l.label} ↗</a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <Heading id="open-source">open source.</Heading>
          <div className="space-y-8">
            {oss.map((os) => (
              <div key={os.project}>
                <div className="flex items-baseline gap-3">
                  <h3 className="font-display text-2xl font-medium">
                    <a href={os.href} target="_blank" rel="noreferrer" className="hover:text-sanguine">{os.project} ↗</a>
                  </h3>
                  <span className="font-hand text-sanguine text-sm">{os.stars}</span>
                </div>
                {os.blurb && <p className="text-ink-soft mt-1 text-[15px] italic">{os.blurb}</p>}
                <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed">
                  {os.prs.map((pr) => (
                    <li key={pr.id} className="flex gap-2.5">
                      <a href={pr.href} target="_blank" rel="noreferrer" className={`${link} shrink-0`}>{pr.id}</a>
                      <span>{pr.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 pb-16">
          <Heading id="contact">hit me up.</Heading>
          <a href={`mailto:${contact.email}`} className="font-display block text-2xl underline decoration-2 underline-offset-8 hover:text-sanguine">
            {contact.email}
          </a>
          <div className="mt-5 flex gap-7">
            <a className={link} href={contact.github} target="_blank" rel="noreferrer">github ↗</a>
            <a className={link} href={contact.linkedin} target="_blank" rel="noreferrer">linkedin ↗</a>
          </div>
          <figure className="mt-14">
            <img
              src="/take-your-marks.webp"
              alt="take your marks, charcoal drawing by christian yoon"
              loading="lazy"
              className="border-hairline w-full border"
            />
            <figcaption className="mt-2">
              <span className="font-display text-base italic">“take your marks”</span>
              <span className="font-hand text-ink-faint block text-sm">christian yoon · charcoal · 2024</span>
            </figcaption>
          </figure>
        </section>
      </main>
    </div>
  );
}
