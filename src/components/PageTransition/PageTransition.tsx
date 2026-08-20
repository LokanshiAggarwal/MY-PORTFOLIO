import { AnimatePresence, motion } from 'framer-motion';
import { useNavigation } from '@/context/NavigationContext';

/**
 * PageTransition — route-style transition overlay.
 * When navigation fires, a cream veil fades/scales/blurs over the page,
 * holds while the destination scrolls into view, then lifts away.
 * Driven by NavigationContext; duration ≈ 0.6s per phase.
 */
export const PageTransition = () => {
  const { transitioning } = useNavigation();

  return (
    <AnimatePresence>
      {transitioning && (
        <motion.div
          key="page-transition"
          className="pointer-events-none fixed inset-0 z-[9998] flex items-center justify-center bg-background"
          initial={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.03, filter: 'blur(10px)' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        >
          {/* Soft monogram while the veil is up */}
          <motion.span
            className="font-serif-display text-3xl tracking-tight text-ink/25 md:text-5xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            Lokanshi
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition;

