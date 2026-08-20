import { useRef, type ReactNode, type MouseEvent } from 'react';
import { cn } from '@/utils/cn';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Hover lift + tilt */
  interactive?: boolean;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

/**
 * GlassCard — soft glass surface with border, subtle shadow.
 * Interactive mode: floats slightly, lifts + rotates 1deg on hover.
 */
export const GlassCard = ({
  children,
  className,
  interactive = true,
  onClick,
}: GlassCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 3}deg) translateY(-6px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseMove={interactive ? handleMove : undefined}
      onMouseLeave={interactive ? handleLeave : undefined}
      data-cursor={interactive ? 'hover' : undefined}
      className={cn(
        'rounded-2xl border border-line bg-card shadow-card',
        interactive && 'transition-transform duration-300 ease-power3 hover:shadow-lift',
        className
      )}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  );
};

export default GlassCard;

