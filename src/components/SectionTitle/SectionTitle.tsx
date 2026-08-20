import { useRef, type ReactNode } from 'react';
import { gsap } from '@/animations/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { cn } from '@/utils/cn';

interface SectionTitleProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

/**
 * SectionTitle — editorial section header with eyebrow, large serif title
 * and optional description. Reveals with blur + slide on scroll.
 */
export const SectionTitle = ({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionTitleProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-stagger]',
        { opacity: 0, y: 40, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' && 'text-center mx-auto',
        className
      )}
    >
      {eyebrow && (
        <span
          data-stagger
          className="mb-5 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-widest-2 text-accent"
        >
          <span className="h-px w-8 bg-accent/50" />
          {eyebrow}
          {align === 'center' && <span className="h-px w-8 bg-accent/50" />}
        </span>
      )}
      <h2
        data-stagger
        className="font-serif-display text-balance text-4xl leading-[1.05] tracking-tightest text-ink md:text-5xl lg:text-6xl"
      >
        {title}
      </h2>
      {description && (
        <p
          data-stagger
          className={cn(
            'mt-5 max-w-2xl text-base leading-relaxed text-ink/60 md:text-lg',
            align === 'center' && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;

