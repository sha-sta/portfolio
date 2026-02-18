import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Explosion from './Explosion';

const Navbar = () => {
  const [showName, setShowName] = useState(false);
  const [exploded, setExploded] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldShow = latest > 390;

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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-between items-center w-full relative h-12"
    >
      <div className="relative flex items-center h-full">
        <Explosion active={exploded} />

        <AnimatePresence>
          {showName && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, x: -20 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: 0,
              }}
              exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="font-bold text-xl tracking-tighter text-white pointer-events-auto pl-1"
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
