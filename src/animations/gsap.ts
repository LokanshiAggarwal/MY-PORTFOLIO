import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Central GSAP registration.
 * Call once at app bootstrap to ensure the plugin is registered globally.
 */
export const registerGsapPlugins = (): void => {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
};

export { gsap, ScrollTrigger };

