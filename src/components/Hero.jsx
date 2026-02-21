import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Explosion from './Explosion';

const Hero = () => {
    const ref = useRef(null);
    const textRef = useRef(null);
    const [exploded, setExploded] = useState(false);

    // Track scroll globally
    const { scrollY } = useScroll();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const [targetPos, setTargetPos] = useState({ x: -window.innerWidth * 0.42, y: -window.innerHeight * 0.45 });
    const [finalScale, setFinalScale] = useState(0.16);

    useEffect(() => {
        const updateTarget = () => {
            const targetEl = document.getElementById('navbar-logo-target');
            const heroText = textRef.current;

            if (targetEl && heroText) {
                const targetRect = targetEl.getBoundingClientRect();
                const heroRect = heroText.getBoundingClientRect();

                // Calculate Scale
                const computedStyle = window.getComputedStyle(heroText);
                const fontSize = parseFloat(computedStyle.fontSize);
                const targetFontSize = 20; // text-xl approx
                const scaleFactor = targetFontSize / fontSize;
                setFinalScale(scaleFactor);

                // --- CALIBRATION ---
                // Adjust these values to fine-tune the final position
                // Positive X -> Right, Negative X -> Left
                // Positive Y -> Down, Negative Y -> Up
                const calibrationX = 0;
                const calibrationY = 0;

                console.log("Hero Calibration:", { calibrationX, calibrationY });

                // --- HORIZONTAL CALCULATION ---
                // We want the left edge of the scaled text to align with targetRect.left + padding
                // Navbar text has pl-1 (4px)
                const targetVisualLeft = targetRect.left + 4;

                // Current Center (Hero start)
                const startCenterX = window.innerWidth / 2;

                // Target Center X
                // We want: targetVisualLeft = (TargetCenter - (ScaledWidth / 2))
                // TargetCenter = targetVisualLeft + (ScaledWidth / 2)
                const scaledWidth = heroRect.width * scaleFactor;
                const targetCenterX = targetVisualLeft + (scaledWidth / 2);

                // Delta X
                const deltaX = (targetCenterX - startCenterX) + calibrationX;

                // --- VERTICAL CALCULATION ---
                // We need to account for the scroll that happens during the animation.
                // The animation ends at scrollYProgress = 0.73.
                // The container is h-screen, so scroll distance is window.innerHeight.
                // ScrollAmount at finish = 0.73 * window.innerHeight.

                const scrollFinishProgress = 0.73;
                const scrollAmountAtFinish = window.innerHeight * scrollFinishProgress;

                // Target Center Y (Visual)
                const targetCenterY = targetRect.top;

                // Current Center Y (Hero start)
                const startCenterY = window.innerHeight / 2;

                // Delta Y (Visual)
                const visualDeltaY = targetCenterY - startCenterY;

                // Transform Y needs to compensate for scroll:
                // FinalPosition = StartY - ScrollAmount + TransformY
                // TargetY = StartY - ScrollAmount + TransformY
                // TransformY = TargetY - StartY + ScrollAmount
                const transformY = (visualDeltaY + scrollAmountAtFinish) + calibrationY;

                console.log("Setting TargetPos to:", { deltaX, transformY });

                setTargetPos({ x: deltaX, y: transformY });
            } else {
                console.warn("Hero target element missing, retrying...", { targetEl, heroText });
                // Retry if element not found yet
                requestAnimationFrame(updateTarget);
            }
        };

        // Initial call
        updateTarget();

        window.addEventListener('resize', updateTarget);

        return () => {
            window.removeEventListener('resize', updateTarget);
        };
    }, []);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const threshold = window.innerHeight * 0.73;

        if (latest >= threshold && !exploded) {
            setExploded(true);
            setTimeout(() => setExploded(false), 600);
        } else if (latest < threshold && exploded) {
            setExploded(false);
        }
    });

    // Linear interpolation for direct path to target
    const x = useTransform(scrollYProgress, [0, 0.73], [0, targetPos.x]);
    const y = useTransform(scrollYProgress, [0, 0.73], [0, targetPos.y]);
    const scale = useTransform(scrollYProgress, [0, 0.73], [1, finalScale]);

    // Removed repulsionX/Y as it causes the "hook" deviation at the end

    // Force opacity 1 always -> Fade out at end to reveal Navbar text
    // Extended opacity to allow calibration visibility
    const opacity = useTransform(scrollYProgress, [0, 0.73, 0.75], [1, 1, 0]);

    return (
        <section ref={ref} className="h-screen w-full flex items-center justify-center sticky top-0 -z-10 overflow-hidden">
            <motion.div
                style={{
                    scale,
                    x,
                    y,
                    // removed marginLeft/marginTop
                    position: 'relative',
                    zIndex: 100
                }}
                className="flex flex-col justify-center items-center origin-center w-full max-w-6xl px-6 md:px-12 relative"
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Explosion active={exploded} />
                </div>

                <motion.h1
                    ref={textRef}
                    style={{ opacity }}
                    className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.9] text-white whitespace-nowrap pointer-events-none"
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
