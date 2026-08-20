import { useEffect, useRef, useState } from 'react';
import { useCursor, type CursorVariant } from '@/context/CursorContext';
import { isFinePointer, prefersReducedMotion } from '@/utils';
import { cn } from '@/utils/cn';
import styles from './Cursor.module.css';

const RING_SIZES: Record<CursorVariant, number> = {
  default: 40,
  hover: 64,
  text: 56,
  image: 88,
  drag: 88,
  hidden: 40,
};

/**
 * Custom cursor — dot + soft ring with blend-mode difference.
 * - Follows the mouse with lerp (buttery)
 * - Stretches while moving fast
 * - Morphs between states: default / text / hover / image / drag
 *   (image & drag grow into a filled disc with a label inside)
 */
export const Cursor = () => {
  const { variant } = useCursor();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [morph, setMorph] = useState<CursorVariant>('default');

  /* Track the latest variant so the rAF loop can read it cheaply */
  const variantRef = useRef<CursorVariant>(variant);
  variantRef.current = variant;

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let dotX = mouseX;
    let dotY = mouseY;
    let raf = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
      const dx = e.movementX || 0;
      const dy = e.movementY || 0;
      const speed = Math.min(Math.hypot(dx, dy) / 10, 1);
      ring.dataset.stretch = String(speed);
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const onDown = () => {
      if (variantRef.current === 'image') return;
      dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%) scale(0.72)`;
    };
    const onUp = () => {
      dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%) scale(1)`;
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      dotX += (mouseX - dotX) * 0.55;
      dotY += (mouseY - dotY) * 0.55;

      const v = variantRef.current;
      const stretch = parseFloat(ring.dataset.stretch || '0');
      const scaleX = 1 + stretch * 0.35;
      const scaleY = 1 - stretch * 0.12;

      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${scaleX}, ${scaleY}) rotate(${stretch * 10}deg)`;
      dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;

      /* Hide the inner dot in image/drag states — the ring is the cursor */
      dot.style.opacity = visible && (v === 'image' || v === 'drag') ? '0' : visible ? '1' : '0';

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* Hover morph via event delegation */
  useEffect(() => {
    if (!isFinePointer()) return;

    const interactive =
      'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]';
    const textLike = 'p, h1, h2, h3, h4, h5, h6, li, [data-cursor="text"]';
    const imageLike = '[data-cursor="image"], img, [data-cursor="drag"]';

    const applyState = (v: CursorVariant) => {
      const ring = ringRef.current;
      if (!ring) return;

      ring.style.width = `${RING_SIZES[v]}px`;
      ring.style.height = `${RING_SIZES[v]}px`;

      ring.classList.toggle(styles.ringText, v === 'text');
      ring.classList.toggle(styles.ringHover, v === 'hover');
      ring.classList.toggle(styles.ringImage, v === 'image');
      ring.classList.toggle(styles.ringDrag, v === 'drag');
      ring.classList.toggle(styles.ringHidden, v === 'hidden');
      setMorph(v);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const imageEl = target.closest<HTMLElement>(imageLike);
      if (imageEl) {
        applyState(imageEl.dataset.cursor === 'drag' ? 'drag' : 'image');
        return;
      }
      if (target.closest(textLike)) {
        applyState('text');
        return;
      }
      if (target.closest(interactive)) {
        applyState('hover');
        return;
      }
      applyState('default');
    };

    document.addEventListener('mouseover', onOver);
    return () => document.removeEventListener('mouseover', onOver);
  }, []);

  /* Context variant overrides (e.g. hidden during loader or transitions) */
  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    if (variant === 'hidden') {
      ring.style.opacity = '0';
      dot.style.opacity = '0';
      ring.classList.add(styles.ringHidden);
    } else {
      ring.classList.remove(styles.ringHidden);
      ring.style.opacity = '1';
      dot.style.opacity = '1';
    }
  }, [variant]);

  const isLabelState = morph === 'image' || morph === 'drag';

  return (
    <>
      <div
        ref={ringRef}
        className={cn(styles.ring, 'hidden md:block')}
        style={{ opacity: 0, willChange: 'transform' }}
        aria-hidden
      >
        <span className={cn(styles.label, isLabelState && styles.labelVisible)}>
          {morph === 'drag' ? 'Drag' : 'View'}
        </span>
      </div>
      <div
        ref={dotRef}
        className={cn(styles.dot, 'hidden md:block')}
        style={{ opacity: 0, willChange: 'transform' }}
        aria-hidden
      />
    </>
  );
};

export default Cursor;

