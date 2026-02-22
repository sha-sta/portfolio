import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const Hero = () => {
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    // Section is h-[200vh], sticky div is h-screen.
    // Sticky range = progress 0 → 0.5 (scroll 0 → 100vh).
    // All animation must complete within that window.
    //
    // Text starts at viewport center (50vh from top).
    // Navbar is ~3-5vh from top. So we move up ~46vh.
    const y = useTransform(scrollYProgress, [0, 0.3], ["0vh", "21vh"]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.04]);
    // Hero fades out just after crossing behind the navbar.
    // Navbar slide starts at scroll 0.7*vh = hero progress 0.35.
    const opacity = useTransform(scrollYProgress, [0, 0.4, 0.43], [1, 0.7, 0]);

    return (
        <section
            ref={sectionRef}
            className="h-[150vh] w-full relative"
        >
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden -z-10">
                <motion.h1
                    style={{ y, scale, opacity }}
                    className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-white whitespace-nowrap pointer-events-none origin-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    christian yoon.
                </motion.h1>
            </div>
        </section>
    );
};

export default Hero;
