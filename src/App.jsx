import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-purple-500/30 overflow-x-hidden">
      <div className="fixed inset-0 z-0 bg-neutral-950 pointer-events-none" />

      {/* Fixed Navbar Container */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-neutral-950 backdrop-blur-md border-b border-neutral-900/50">
        <div className="max-w-6xl mx-auto px-6 pt-3 pb-1.5 md:px-12 md:pt-4 md:pb-2 relative">
          <Navbar />
        </div>
      </div>

      <div className="relative z-10">
        <Hero />
      </div>

      {/* Main Content with Background to cover Hero */}
      <div className="relative z-20 bg-neutral-950 border-t border-neutral-900/50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-32 space-y-32">
          <Experience />
          <Projects />
          <Contact />
        </div>

        <footer className="py-12 text-center text-neutral-600 text-sm">
          <p>© {new Date().getFullYear()} Christian Yoon.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
