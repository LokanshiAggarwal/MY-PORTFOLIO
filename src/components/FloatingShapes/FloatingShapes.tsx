import { useEffect, useRef } from 'react';
import { gsap } from '@/animations/gsap';
import { cn } from '@/utils/cn';

interface FloatingShapesProps {
  count?: number;
  className?: string;
  /** Shapes: circle, square, ring, triangle */
  shapes?: Array<'circle' | 'square' | 'ring' | 'triangle'>;
}

/**
 * FloatingShapes — subtle decorative shapes drifting slowly behind content.
 * Adds editorial, handcrafted depth without gradients.
 */
export const FloatingShapes = ({
  count = 6,
  className,
  shapes = ['circle', 'square', 'ring'],
}: FloatingShapesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const els = Array.from(container.querySelectorAll<HTMLElement>('[data-shape]'));
    if (!els.length) return;

    const ctx = gsap.context(() => {
      els.forEach((el, i) => {
        const driftX = gsap.utils.random(-40, 40);
        const driftY = gsap.utils.random(-30, 30);
        const duration = gsap.utils.random(8, 16);
        gsap.to(el, {
          x: driftX,
          y: driftY,
          rotation: gsap.utils.random(-30, 30),
          duration,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.4,
        });
      });
    }, container);

    return () => ctx.revert();
  }, [count]);

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => {
        const shape = shapes[i % shapes.length];
        const size = 8 + ((i * 7) % 24);
        const pos = {
          left: `${(i * 17 + 8) % 92}%`,
          top: `${(i * 23 + 12) % 85}%`,
        };
        return (
          <div
            key={i}
            data-shape
            className="absolute opacity-20"
            style={{ ...pos, width: size, height: size }}
          >
            {shape === 'circle' && (
              <span className="block h-full w-full rounded-full border border-ink/30" />
            )}
            {shape === 'square' && (
              <span className="block h-full w-full rotate-45 border border-ink/30" />
            )}
            {shape === 'ring' && (
              <span className="block h-full w-full rounded-full border border-accent/40" />
            )}
            {shape === 'triangle' && (
              <span
                className="block h-full w-full"
                style={{
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  background: 'rgba(139,58,58,0.2)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FloatingShapes;

