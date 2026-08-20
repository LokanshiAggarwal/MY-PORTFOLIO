import { useEffect, useMemo, useRef } from 'react';
import SplitType from 'split-type';
import { gsap } from '@/animations/gsap';
import { cn } from '@/utils/cn';

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  delay?: number;
  stagger?: number;
  once?: boolean;
  onSplit?: () => void;
}

/**
 * AnimatedText — splits text into words (SplitType) and reveals each word
 * with a slide-up + blur + tiny rotation, staggered.
 */
export const AnimatedText = ({
  text,
  className,
  as = 'div',
  delay = 0,
  stagger = 0.03,
  once = true,
  onSplit,
}: AnimatedTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const Tag = useMemo(() => (as as React.ElementType) || 'div', [as]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const split = new SplitType(el, { types: 'words' });
    onSplit?.();

    const ctx = gsap.context(() => {
      gsap.set(split.words, {
        opacity: 0,
        y: '110%',
        rotate: 3,
        filter: 'blur(8px)',
        transformOrigin: 'left center',
      });
      gsap.to(split.words, {
        opacity: 1,
        y: '0%',
        rotate: 0,
        filter: 'blur(0px)',
        duration: 0.7,
        ease: 'power4.out',
        stagger,
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once,
        },
      });
    }, el);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, [text, delay, stagger, once, onSplit]);

  return (
    <Tag ref={containerRef} className={cn('inline-block', className)}>
      {text}
    </Tag>
  );
};

export default AnimatedText;

