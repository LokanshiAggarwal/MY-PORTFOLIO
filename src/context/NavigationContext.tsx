import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLenis } from '@/context/LenisContext';

interface NavigationContextValue {
  /** True while a route-style transition overlay is covering the page. */
  transitioning: boolean;
  /**
   * Triggers a cinematic page transition (overlay fades/scales/blurs in),
   * scrolls to the target while covered, then reveals.
   * Accepts a section id or a raw scroll position.
   */
  navigate: (target: string | number) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

const OVERLAY_IN_MS = 420;
const OVERLAY_OUT_MS = 950;

/**
 * NavigationContext — coordinates route-style section changes.
 * The overlay (rendered by <PageTransition />) covers the screen, the
 * target is scrolled into view while hidden, then the overlay lifts to
 * reveal the destination. Falls back to instant scroll when reduced
 * motion is preferred.
 */
export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const { scrollTo } = useLenis();
  const [transitioning, setTransitioning] = useState(false);
  const pendingRef = useRef(false);

  const navigate = useCallback(
    (target: string | number) => {
      if (pendingRef.current) return;
      pendingRef.current = true;

      setTransitioning(true);

      window.setTimeout(() => {
        scrollTo(target, { duration: 0.85 });
      }, OVERLAY_IN_MS);

      window.setTimeout(() => {
        setTransitioning(false);
        pendingRef.current = false;
      }, OVERLAY_OUT_MS);
    },
    [scrollTo]
  );

  const value = useMemo<NavigationContextValue>(
    () => ({ transitioning, navigate }),
    [transitioning, navigate]
  );

  return (
    <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextValue => {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return ctx;
};

export default NavigationProvider;

