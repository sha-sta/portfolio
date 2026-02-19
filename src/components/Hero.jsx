import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // Shrink dramatically to match navbar size
    // 0.16 is roughly the ratio between 7xl/9xl and xl
    const scale = useTransform(scrollYProgress, [0, 0.6, 0.73], [1, 0.25, 0.16]);

    // X (Horizontal) Movement
    // [0, 0.6, 0.73] -> Scroll Progress points (0% = top, 100% = bottom)
    // ["0vw", "-38vw", "-42vw"] -> X position at those points
    // 0% scroll: 0vw (Center)
    // 60% scroll: -38vw (Moved mostly left, slowing down)
    // 73% scroll: -42vw (Final snap position, ~42% of viewport width to the left)
    const x = useTransform(scrollYProgress,
        [0, 1],
        ["0vw", "-33vw"]
    );

    // Y (Vertical) Movement
    // [0, 0.6, 0.73] -> Scroll Progress points (must match X for sync)
    // ["0vh", "-40vh", "-45vh"] -> Y position at those points
    // 0% scroll: 0vh (Center)
    // 60% scroll: -40vh (Moved mostly up, slowing down)
    // 73% scroll: -45vh (Final snap position, ~45% of viewport height up)
    const y = useTransform(scrollYProgress,
        [0, 5],
        ["0vh", "200vh"]
    );

    // Repulsion/Struggle effect near the end
    // Pushes slightly back against the movement direction before snapping
    const repulsionX = useTransform(scrollYProgress, [0.65, 0.7, 0.73], [0, 5, 0]);
    const repulsionY = useTransform(scrollYProgress, [0.65, 0.7, 0.73], [0, 5, 0]);

    // Fade out just as it snaps
    const opacity = useTransform(scrollYProgress, [0.72, 0.73], [1, 0]);

    return (
        <section ref={ref} className="h-screen w-full flex items-center justify-center sticky top-0 -z-10 overflow-hidden">
            <motion.div
                style={{
                    scale,
                    x,
                    y,
                    opacity,
                    marginLeft: repulsionX,
                    marginTop: repulsionY
                }}
                className="w-full max-w-4xl px-6 md:px-12 flex flex-col justify-center items-center origin-center"
            >
                <motion.h1
                    className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.9] text-white whitespace-nowrap"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    christian yoon.
                </motion.h1>
            </motion.div>
        </section>
    );
};

export default Hero;
