import { useEffect, useState } from 'react';

/**
 * Reactive media query hook.
 * Returns true when the given query matches the current viewport.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

export const useIsDesktop = (): boolean => useMediaQuery('(min-width: 1024px)');
export const useIsMobile = (): boolean => useMediaQuery('(max-width: 768px)');

