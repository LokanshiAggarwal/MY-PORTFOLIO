import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgress — thin vertical progress indicator fixed to the right
 * edge. The accent fill tracks page scroll with spring smoothing for a
 * premium, fluid feel. Hidden on small screens where it would crowd
 * the edge.
 */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      className="pointer-events-none fixed right-5 top-1/2 z-50 hidden h-40 -translate-y-1/2 md:block"
      aria-hidden
    >
      <div className="relative h-full w-px overflow-hidden bg-ink/10">
        <motion.div
          className="absolute inset-x-0 top-0 h-full origin-top bg-accent"
          style={{ scaleY }}
        />
      </div>
      {/* End dot */}
      <motion.div
        className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent"
        style={{ scale: scaleY }}
      />
    </div>
  );
};

export default ScrollProgress;

