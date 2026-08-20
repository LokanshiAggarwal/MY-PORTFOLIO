/**
 * Utility helpers shared across the application.
 */

/** Clamp a value between a min and max. */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** Linear interpolation between two values. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Map a value from one range to another. */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  if (inMin === inMax) return outMin;
  const ratio = (value - inMin) / (inMax - inMin);
  return outMin + ratio * (outMax - outMin);
};

/** Debounce a function call. */
export const debounce = <T extends (...args: never[]) => void>(
  fn: T,
  delay = 150
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/** Throttle a function call. */
export const throttle = <T extends (...args: never[]) => void>(
  fn: T,
  limit = 100
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/** Check if the current device supports hover (mouse). */
export const isFinePointer = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Check if the user prefers reduced motion. */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Format a number with leading zero. */
export const pad = (value: number): string => String(value).padStart(2, '0');

/** Shorten a number for display. */
export const formatNumber = (value: number): string => new Intl.NumberFormat('en-US').format(value);

