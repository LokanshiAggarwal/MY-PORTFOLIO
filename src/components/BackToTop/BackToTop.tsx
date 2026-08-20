import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';
import { useLenis } from '@/context/LenisContext';
import { Magnetic } from '@/components/Magnetic/Magnetic';
import { cn } from '@/utils/cn';

/**
 * BackToTop — floating circular button, bottom-right.
 * Appears once the page is scrolled, magnetically follows the cursor,
 * glows and rotates gently, and scrolls back to the top via Lenis.
 */
export const BackToTop = () => {
  const { scrollTo } = useLenis();
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setVisible(window.scrollY > 600);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollTop = useCallback(() => {
    setPressed(true);
    scrollTo(0, { duration: 1.6 });
    window.setTimeout(() => setPressed(false), 1600);
  }, [scrollTo]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-8 right-7 z-50 md:right-9"
          initial={{ opacity: 0, y: 24, scale: 0.6 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.6 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Magnetic strength={0.45}>
            <motion.button
              type="button"
              onClick={scrollTop}
              aria-label="Back to top"
              whileHover={{ rotate: 90 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              className={cn(
                'group relative flex h-14 w-14 items-center justify-center rounded-full border border-ink/15 bg-card/80 text-ink shadow-soft backdrop-blur-md transition-colors duration-500 hover:border-accent/40 hover:text-accent hover:shadow-glow',
                pressed && 'border-accent text-accent'
              )}
              data-cursor="hover"
            >
              <FiArrowUp
                size={19}
                className={cn(
                  'transition-transform duration-500',
                  pressed && '-translate-y-1'
                )}
              />
              {/* soft pulse ring */}
              <span
                className="pointer-events-none absolute inset-0 rounded-full bg-accent/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />
            </motion.button>
          </Magnetic>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;

