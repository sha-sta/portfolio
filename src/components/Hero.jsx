import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef, useState } from 'react';
import Explosion from './Explosion';

const Hero = () => {
    const ref = useRef(null);
    const [exploded, setExploded] = useState(false);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest >= 0.73 && !exploded) {
            setExploded(true);
            setTimeout(() => setExploded(false), 600);
        } else if (latest < 0.73 && exploded) {
            setExploded(false);
        }
    });

    // Shrink dramatically to match navbar size
    // 0.16 is roughly the ratio between 7xl/9xl and xl
    const scale = useTransform(scrollYProgress, [0, 0.6, 0.73], [1, 0.25, 0.16]);

    // X (Horizontal) Movement
    const x = useTransform(scrollYProgress,
        [0, 1],
        ["0vw", "-31vw"]
    );

    // Y (Vertical) Movement
    const y = useTransform(scrollYProgress,
        [0, 5.2],
        ["0vh", "220vh"]
    );

    // Repulsion/Struggle effect near the end
    const repulsionX = useTransform(scrollYProgress, [0.65, 0.7, 0.73], [0, 5, 0]);
    const repulsionY = useTransform(scrollYProgress, [0.65, 0.7, 0.73], [0, 5, 0]);

    // Fade out just as it snaps
    const opacity = useTransform(scrollYProgress, [0.729, 0.73], [1, 0]);

    return (
        <section ref={ref} className="h-screen w-full flex items-center justify-center sticky top-0 -z-10 overflow-hidden">
            <motion.div
                style={{
                    scale,
                    x,
                    y,
                    marginLeft: repulsionX,
                    marginTop: repulsionY
                }}
                className="w-full max-w-4xl px-6 md:px-12 flex flex-col justify-center items-center origin-center relative"
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Explosion active={exploded} />
                </div>

                <motion.h1
                    style={{ opacity }}
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
