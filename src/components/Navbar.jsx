import { motion, useScroll, useMotionValueEvent, useMotionValue } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Explosion from './Explosion';

const Navbar = () => {
  const [phase, setPhase] = useState('hidden'); // 'hidden' | 'sliding' | 'landed'
  const [exploded, setExploded] = useState(false);
  const [portalTarget, setPortalTarget] = useState(null);
  const { scrollY } = useScroll();
  const navRef = useRef(null);

  // Motion values for the slide animation (center → left)
  const slideX = useMotionValue(0);
  const slideOpacity = useMotionValue(0);

  // Find the portal target on mount
  useEffect(() => {
    setPortalTarget(document.getElementById('navbar-container'));
  }, []);

  // Thresholds (as fraction of viewport height scrolled)
  const SLIDE_START = 0.62;
  const SLIDE_END = 0.95;

  useMotionValueEvent(scrollY, "change", (latest) => {
    const vh = window.innerHeight;
    const progress = latest / vh;

    if (progress < SLIDE_START) {
      if (phase !== 'hidden') setPhase('hidden');
      slideOpacity.set(0);
    } else if (progress >= SLIDE_START && progress < SLIDE_END) {
      if (phase !== 'sliding') {
        setPhase('sliding');
      }

      const t = (progress - SLIDE_START) / (SLIDE_END - SLIDE_START);

      const navWidth = navRef.current?.offsetWidth || window.innerWidth;
      const startX = navWidth / 2 - 80;
      const endX = 0;

      slideX.set(startX + t * (endX - startX));
      slideOpacity.set(Math.min(t * 1.5, 1));
    } else {
      if (phase !== 'landed') {
        setPhase('landed');
        setExploded(true);
        setTimeout(() => setExploded(false), 600);
      }
      slideX.set(0);
      slideOpacity.set(1);
    }
  });

  const links = [
    { name: 'experience.', id: 'experience' },
    { name: 'projects.', id: 'projects' },
    { name: 'contact.', id: 'contact' },
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Sliding text — portaled into navbar-container at z-[5], BEHIND the z-10 background */}
      {phase === 'sliding' && portalTarget && createPortal(
        <div className="absolute inset-0 z-5 flex items-center pointer-events-none">
          <div className="max-w-6xl mx-auto px-6 md:px-12 w-full">
            <motion.div
              style={{ x: slideX, opacity: slideOpacity }}
              className="font-bold text-xl tracking-tighter text-white pl-1 whitespace-nowrap"
            >
              christian yoon.
            </motion.div>
          </div>
        </div>,
        portalTarget
      )}

      <motion.nav
        ref={navRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-between items-center w-full relative h-12"
      >
        <div className="relative flex items-center h-full w-48">
          <Explosion active={exploded} />

          {/* Landed phase: text pops IN FRONT with bounce */}
          {phase === 'landed' && (
            <motion.div
              initial={{ scale: 1.15, x: 5 }}
              animate={{ scale: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 600,
                damping: 15,
                mass: 1,
              }}
              className="font-bold text-xl tracking-tighter text-white pl-1 absolute left-0 whitespace-nowrap"
            >
              christian yoon.
            </motion.div>
          )}
        </div>

        <ul className="flex gap-6 text-md text-neutral-400 lowercase pointer-events-auto">
          {links.map((link) => (
            <li key={link.name}>
              <button
                onClick={() => scrollTo(link.id)}
                className="hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {link.name}
              </button>
            </li>
          ))}
        </ul>
      </motion.nav>
    </>
  );
};

export default Navbar;
