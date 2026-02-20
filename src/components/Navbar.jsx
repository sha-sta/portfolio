import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Explosion from './Explosion';

const Navbar = () => {
  const [showName, setShowName] = useState(false);
  const [exploded, setExploded] = useState(false);
  const { scrollY } = useScroll();
  const logoRef = useRef(null);
  const navRef = useRef(null);

  // Expose refs to window for Hero component to read
  useEffect(() => {
    if (logoRef.current) {
      window.navbarLogoRect = logoRef.current.getBoundingClientRect();
    }
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Trigger transition later to match the new slow struggle timing
    // We can also check position dynamically here if needed
    const shouldShow = latest > 650;

    if (shouldShow && !showName) {
      setExploded(true);
      setTimeout(() => setExploded(false), 600);
    }

    setShowName(shouldShow);
  });

  const links = [
    { name: 'projects', href: '#projects' },
    { name: 'experience', href: '#experience' },
    { name: 'contact', href: '#contact' },
  ];

  return (
    <motion.nav
      ref={navRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-between items-center w-full relative h-12"
    >
      <div
        ref={logoRef}
        className="relative flex items-center h-full w-48"
      >
        <Explosion active={exploded} />

        <AnimatePresence>
          {showName && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, x: -10, y: -5 }} // Start slightly offset to initiate direction
              animate={{
                scale: 1,
                opacity: 1,
                x: 0,
                y: 0,
              }}
              exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
              transition={{
                type: "spring",
                stiffness: 600,
                damping: 15,
                mass: 1,
              }}
              className="font-bold text-xl tracking-tighter text-white pointer-events-auto pl-1 absolute left-0"
            >
              christian yoon.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ul className="flex gap-6 text-md text-neutral-400 lowercase pointer-events-auto">
        {links.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              className="hover:text-white transition-colors duration-200"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
};

export default Navbar;
