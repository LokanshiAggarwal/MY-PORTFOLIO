import { useEffect, useLayoutEffect } from 'react';

/**
 * useLayoutEffect that works in both client and server environments.
 * Uses useLayoutEffect on the client, falls back to useEffect during SSR.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;

