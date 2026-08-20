/**
 * Shared animation presets for GSAP & Framer Motion.
 */

/** GSAP — global default easing used across the site. */
export const EASE = {
  power4: 'power4.out',
  power3: 'power3.out',
  expo: 'expo.out',
} as const;

/** GSAP — reveal a block of content (opacity + y) on scroll. */
export const revealFrom = (y = 60) => ({
  opacity: 0,
  y,
  duration: 0.8,
  ease: EASE.power4,
});

/** GSAP — fade + blur + slide entrance. */
export const cinematicReveal = (y = 48, blur = 8) => ({
  opacity: 0,
  y,
  filter: `blur(${blur}px)`,
  duration: 0.9,
  ease: EASE.power4,
});

/** GSAP — clip-path mask reveal for images. */
export const imageReveal = {
  clipPath: 'inset(0 0 100% 0)',
  scale: 1.15,
  duration: 1.2,
  ease: EASE.power4,
};

/** Framer Motion — standard fade-up variants. */
export const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: i * 0.08,
    },
  }),
};

/** Framer Motion — word reveal variants. */
export const wordReveal = {
  hidden: { opacity: 0, y: '110%', rotate: 2, filter: 'blur(6px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: '0%',
    rotate: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      delay: i * 0.03,
    },
  }),
};

/** Framer Motion — stagger container. */
export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

