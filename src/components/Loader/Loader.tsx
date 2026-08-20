import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from '@/context/LenisContext';
import styles from './Loader.module.css';

interface LoaderProps {
  duration?: number;
  onComplete?: () => void;
}

const LOAD_STEPS = [0, 10, 20, 40, 60, 80, 100];

/**
 * Premium cinematic loader.
 * Shows a monogram logo, a thin progress line and a percentage counter.
 * Fades out with a smooth curtain reveal once complete.
 */
export const Loader = ({ duration = 2.2, onComplete }: LoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const { start } = useLenis();

  useEffect(() => {
    const total = duration * 1000;
    const startTime = performance.now();

    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const raw = (elapsed / total) * 100;

      // Ease toward the next step for a premium stepped feel
      const stepIndex = LOAD_STEPS.findIndex((s) => s >= raw);
      const nextStep = LOAD_STEPS[Math.min(stepIndex + 1, LOAD_STEPS.length - 1)];
      const eased = raw + (nextStep - raw) * 0.12;
      setProgress(Math.min(100, Math.round(eased)));

      if (raw < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setDone(true);
        onComplete?.();
        // Resume scrolling after loader completes
        setTimeout(() => start(), 50);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [duration, onComplete, start]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className={styles.loader}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Monogram */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className={styles.brand}
          >
            <span className={styles.monogram}>Lokanshi</span>
            <span className={styles.monogramLine} />
          </motion.div>

          {/* Progress line */}
          <div className={styles.rail}>
            <motion.div
              className={styles.railFill}
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          {/* Percentage */}
          <motion.div
            className="mt-6 flex w-56 items-center justify-between md:w-72"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <span className="text-[10px] font-medium uppercase tracking-widest-2 text-ink/50">
              Crafting experience
            </span>
            <span className="font-serif-display text-sm text-accent tabular-nums">
              {String(progress).padStart(3, '0')}%
            </span>
          </motion.div>

          {/* Bottom fade hint */}
          <motion.span
            className={styles.hint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Portfolio © 2026
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;

