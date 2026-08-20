import { useRef, type ReactNode, type MouseEvent } from 'react';
import { cn } from '@/utils/cn';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
}

/**
 * MagneticButton — the button gently follows the cursor within its bounds
 * and springs back on leave. Uses rAF for smoothness.
 */
export const MagneticButton = ({
  children,
  className,
  strength = 0.3,
  onClick,
  ariaLabel,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const rafRef = useRef(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    targetRef.current.x = (e.clientX - rect.left - rect.width / 2) * strength;
    targetRef.current.y = (e.clientY - rect.top - rect.height / 2) * strength;
    if (!rafRef.current) {
      const loop = () => {
        currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.18;
        currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.18;
        if (el) {
          el.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px)`;
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
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-background transition-[background-color,box-shadow] duration-500 ease-power3 hover:bg-accent hover:shadow-soft',
        className
      )}
      data-cursor="hover"
      style={{ willChange: 'transform' }}
    >
      {children}
    </button>
  );
};

export default MagneticButton;

