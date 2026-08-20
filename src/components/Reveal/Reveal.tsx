import { useRef, type ReactNode } from 'react';
import { gsap } from '@/animations/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { cn } from '@/utils/cn';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Offset distance for the reveal */
  y?: number;
  /** Blur amount for cinematic entrance */
  blur?: number;
  delay?: number;
  duration?: number;
  /** Trigger point: 'top 85%' style */
  start?: string;
}

/**
 * Reveal — wraps content and animates it in on scroll
 * (opacity + y + blur) using GSAP ScrollTrigger.
 */
export const Reveal = ({
  children,
  className,
  y = 60,
  blur = 0,
  delay = 0,
  duration = 0.8,
  start = 'top 85%',
}: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y, filter: blur ? `blur(${blur}px)` : 'none' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration,
          delay,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [y, blur, delay, duration, start]);

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  );
};

export default Reveal;

