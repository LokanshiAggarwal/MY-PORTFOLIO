import { useRef, type MouseEvent, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'outline' | 'ghost' | 'light';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: Variant;
  ripple?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-ink text-background hover:bg-accent',
  outline: 'border border-ink/20 text-ink hover:border-accent hover:text-accent',
  ghost: 'text-ink/70 hover:text-ink',
  light: 'bg-background text-ink hover:bg-white',
};

/**
 * Button — pill-shaped, with ripple animation and magnetic lift.
 * Variants: primary, outline, ghost, light.
 */
export const Button = ({
  children,
  variant = 'primary',
  ripple = true,
  className,
  ...props
}: ButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ripple) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rippleEl = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 1.2;
    rippleEl.style.cssText = `position:absolute;border-radius:9999px;background:rgba(255,255,255,0.35);transform:scale(0);width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;pointer-events:none;transition:transform 0.6s cubic-bezier(0.16,1,0.3,1),opacity 0.6s ease;`;
    el.appendChild(rippleEl);
    requestAnimationFrame(() => {
      rippleEl.style.transform = 'scale(1)';
      rippleEl.style.opacity = '0';
    });
    setTimeout(() => rippleEl.remove(), 700);
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ y: -2, scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={handleClick}
      data-cursor="hover"
      className={cn(
        'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium transition-colors duration-500',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;

