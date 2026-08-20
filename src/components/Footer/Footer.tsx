import { useMemo, useRef } from 'react';
import { FiGithub, FiLinkedin, FiArrowUp } from 'react-icons/fi';
import { gsap } from '@/animations/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useLenis } from '@/context/LenisContext';
import { useNavigation } from '@/context/NavigationContext';
import { Magnetic } from '@/components/Magnetic/Magnetic';
import { prefersReducedMotion } from '@/utils';
import { cn } from '@/utils/cn';
import styles from './Footer.module.css';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/LokanshiAggarwal', icon: <FiGithub size={16} /> },
{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/lokanshi-aggarwal-b31b7234a/', icon: <FiLinkedin size={16} /> },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * Footer — minimal luxury closing band.
 * Reveals upward with an opacity 0→1 + blur 12→0 entrance, delayed so it
 * arrives just after the contact section. Layout: logo left, navigation
 * center, socials right, and a bottom line crediting the craft.
 */
export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const { scrollTo } = useLenis();
  const { navigate } = useNavigation();
  const prefersReduced = useMemo(() => prefersReducedMotion(), []);

  /* Entrance — upward reveal, blur dissolve, delayed after contact */
  useIsomorphicLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-footer-reveal]', {
        opacity: 0,
        y: 48,
        filter: 'blur(12px)',
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.1,
        delay: 0.15,
        scrollTrigger: { trigger: footer, start: 'top 92%', once: true },
      });

      /* Decorative outline word drifts upward slowly as footer enters */
      gsap.from('[data-footer-outline]', {
        y: '18%',
        opacity: 0,
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: footer, start: 'top 95%', once: true },
      });
    }, footer);

    return () => ctx.revert();
  }, [prefersReduced]);

  const scrollTop = useMemo(
    () => () => {
      scrollTo(0, { duration: 1.6 });
    },
    [scrollTo]
  );

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.divider} aria-hidden />

      {/* Large decorative outline word */}
      <div className={styles.outlineWord} data-footer-outline aria-hidden>
        Lokanshi
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pb-10 md:px-10 lg:px-16">
        {/* Top row — logo / nav / socials */}
        <div className="flex flex-col items-center justify-between gap-10 border-t border-white/10 pt-12 md:flex-row md:items-start">
          {/* Logo */}
          <div data-footer-reveal className="flex flex-col items-center gap-2 md:items-start">
            <span className="font-serif-display text-3xl font-semibold tracking-tight text-background">
              Lokanshi
            </span>
            <span className="text-[11px] uppercase tracking-widest-2 text-background/40">
              CS &amp; Design Student
            </span>
          </div>

          {/* Navigation */}
          <nav
            aria-label="Footer navigation"
            data-footer-reveal
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => navigate(link.id)}
                className={styles.navLink}
                data-cursor="hover"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Socials + back to top */}
          <div data-footer-reveal className="flex items-center gap-3">
            {SOCIALS.map((social) => (
              <Magnetic key={social.label} strength={0.35}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className={styles.socialIcon}
                  data-cursor="hover"
                >
                  {social.icon}
                </a>
              </Magnetic>
            ))}

            <Magnetic strength={0.4}>
              <button
                type="button"
                onClick={scrollTop}
                aria-label="Back to top"
                className={cn(styles.socialIcon, 'ml-1')}
                data-cursor="hover"
              >
                <FiArrowUp size={17} />
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Bottom line */}
        <div
          data-footer-reveal
          className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[11px] uppercase tracking-widest-2 text-background/35 md:flex-row"
        >
          <span>Designed &amp; Developed by Lokanshi</span>
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
            2026
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

