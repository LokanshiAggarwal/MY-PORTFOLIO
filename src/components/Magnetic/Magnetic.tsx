import { useRef, type ReactNode, type MouseEvent } from 'react';
import { isFinePointer } from '@/utils';
import { cn } from '@/utils/cn';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** How strongly the element follows the cursor (0–1). */
  strength?: number;
}

/**
 * Magnetic — wraps children and gently pulls the whole element toward the
 * cursor while hovering, then springs back on leave. Uses a rAF loop with
 * lerp for a buttery, premium feel. Passes through className to the wrapper.
 */
export const Magnetic = ({ children, className, strength = 0.3 }: MagneticProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !isFinePointer()) return;
    const rect = el.getBoundingClientRect();
    targetRef.current.x = (e.clientX - rect.left - rect.width / 2) * strength;
    targetRef.current.y = (e.clientY - rect.top - rect.height / 2) * strength;

    if (!rafRef.current) {
      const loop = () => {
        currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.18;
        currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.18;
        const elNow = ref.current;
        if (elNow) {
          elNow.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0)`;
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }
  };

  const onLeave = () => {
    targetRef.current = { x: 0, y: 0 };
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(className)}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  );
};

export default Magnetic;

