import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // Shrink dramatically
    const scale = useTransform(scrollYProgress, [0, 0.35], [1, 0.16]);

    // Move towards top-left (approximating positions)
    // We want it to end up roughly where the navbar logo is.
    // Adjusted to -25vw and -35vh to prevent overshooting
    const x = useTransform(scrollYProgress, [0, 0.4], ["0%", "-22vw"]);
    const y = useTransform(scrollYProgress, [0, 0.4], ["0vh", "2vh"]);

    // Struggle/Wobble effect near the end
    const rotate = useTransform(scrollYProgress, [0.3, 0.35, 0.4], [0, -4, 4]);
    const opacity = useTransform(scrollYProgress, [0.35, 0.45], [1, 0]);

    return (
        <section ref={ref} className="h-screen w-full flex items-center justify-center sticky top-0 -z-10 overflow-hidden">
            <motion.div
                style={{ scale, x, y, rotate, opacity }}
                className="w-full max-w-4xl px-6 md:px-12 flex flex-col justify-center items-center origin-center"
            >
                <motion.h1
                    className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.9] text-white whitespace-nowrap"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                >
                    christian yoon.
                </motion.h1>
            </motion.div>
        </section>
    );
};

export default Hero;
