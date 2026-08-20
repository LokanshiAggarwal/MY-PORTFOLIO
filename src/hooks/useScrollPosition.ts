import { useCallback, useEffect, useState } from 'react';

interface ScrollPosition {
  y: number;
  direction: 'up' | 'down';
  atTop: boolean;
}

/**
 * Tracks window scroll position and direction.
 * Throttled via requestAnimationFrame for smooth reads.
 */
export const useScrollPosition = (): ScrollPosition => {
  const [position, setPosition] = useState<ScrollPosition>({
    y: 0,
    direction: 'up',
    atTop: true,
  });

  const onScroll = useCallback(() => {
    const y = window.scrollY;
    setPosition((prev) => ({
      y,
      direction: y > prev.y ? 'down' : 'up',
      atTop: y < 24,
    }));
  }, []);

  useEffect(() => {
    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(onScroll);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(raf);
    };
  }, [onScroll]);

  return position;
};

export default useScrollPosition;

