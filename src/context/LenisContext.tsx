import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Lenis from 'lenis';

interface LenisContextValue {
  lenis: Lenis | null;
  scrollTo: (target: string | number, options?: Record<string, unknown>) => void;
  stop: () => void;
  start: () => void;
  velocity: number;
}

const LenisContext = createContext<LenisContextValue | null>(null);

export const LenisProvider = ({ children }: { children: ReactNode }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const [velocity, setVelocity] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      infinite: false,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Expose velocity for animation systems
    const onScroll = (e: { velocity: number }) => {
      setVelocity(e.velocity);
    };
    lenis.on('scroll', onScroll);

    setReady(true);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback(
    (target: string | number, options?: Record<string, unknown>) => {
      if (!lenisRef.current) return;
      lenisRef.current.scrollTo(target, {
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        offset: 0,
        ...options,
      });
    },
    []
  );

  const stop = useCallback(() => lenisRef.current?.stop(), []);
  const start = useCallback(() => lenisRef.current?.start(), []);

  const value = useMemo<LenisContextValue>(
    () => ({ lenis: lenisRef.current, scrollTo, stop, start, velocity }),
    [scrollTo, stop, start, velocity, ready]
  );

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
};

export const useLenis = (): LenisContextValue => {
  const ctx = useContext(LenisContext);
  if (!ctx) {
    throw new Error('useLenis must be used within a LenisProvider');
  }
  return ctx;
};

export default LenisProvider;

