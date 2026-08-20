import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useSpring } from 'framer-motion';
import { useNavigation } from '@/context/NavigationContext';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { usePageReady } from '@/context/PageReadyContext';
import { cn } from '@/utils/cn';

export interface NavItem {
  id: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Navigation bar.
 * - Transparent initially, glass pill after scrolling
 * - Hides while scrolling down, appears while scrolling up
 * - Active section highlight + smooth underline animation
 * - Full-screen mobile menu
 */
export const Navbar = () => {
  const { navigate } = useNavigation();
  const { y, direction } = useScrollPosition();
  const { ready } = usePageReady();
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  const scrolled = y > 80;
  const hidden = scrolled && direction === 'down' && !menuOpen;

  /* Entrance (after loader): y -100 → 0, opacity 0 → 1, 1s, 0.4s delay, power4.out */
  const entrance = ready ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 };
  const animate = ready && hidden ? { y: -120, opacity: 0 } : entrance;

  /* Smooth underline spring */
  const scaleX = useSpring(0, { stiffness: 260, damping: 24 });

  /* Track active section via IntersectionObserver */
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.id)
    ).filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* Lock body scroll when menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavigate = useCallback(
    (id: string) => {
      setMenuOpen(false);
      navigate(`#${id}`);
    },
    [navigate]
  );

  const handleLinkHover = useCallback(() => {
    scaleX.set(1);
    setTimeout(() => scaleX.set(0), 500);
  }, [scaleX]);

  const navLinks = useMemo(
    () =>
      NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => handleNavigate(item.id)}
          onMouseEnter={handleLinkHover}
          className={cn(
            'group relative px-1 py-2 text-[13px] font-medium tracking-wide transition-colors duration-300',
            active === item.id ? 'text-accent' : 'text-ink/70 hover:text-ink'
          )}
        >
          {item.label}
          <span
            className={cn(
              'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-500 ease-power3',
              active === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            )}
          />
        </button>
      )),
    [active, handleNavigate, handleLinkHover]
  );

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={animate}
        transition={{ duration: 1, delay: ready ? 0.4 : 0, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:px-6 md:pt-5"
      >
        <motion.nav
          layout
          className={cn(
            'flex w-full max-w-6xl items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 md:px-7',
            scrolled
              ? 'glass shadow-soft'
              : 'bg-transparent border border-transparent'
          )}
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            className="group flex items-center gap-2.5"
            data-cursor="hover"
          >
            <span className="font-serif-display text-2xl font-semibold tracking-tight text-ink">
              Lokanshi
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-500 group-hover:scale-150" />
          </button>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 lg:flex">{navLinks}</div>

          {/* CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => handleNavigate('contact')}
              className="group relative overflow-hidden rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-background transition-all duration-500 ease-power3 hover:-translate-y-0.5 hover:shadow-soft"
              data-cursor="hover"
            >
              <span className="relative z-10">Let's talk</span>
              <span className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-500 ease-power3 group-hover:translate-x-0" />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label="Toggle menu"
            data-cursor="hover"
          >
            <span
              className={cn(
                'h-px w-6 bg-ink transition-all duration-300',
                menuOpen && 'translate-y-[3.5px] rotate-45'
              )}
            />
            <span
              className={cn(
                'h-px w-6 bg-ink transition-all duration-300',
                menuOpen && '-translate-y-[3.5px] -rotate-45'
              )}
            />
          </button>
        </motion.nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  'font-serif-display text-4xl transition-colors duration-300 md:text-5xl',
                  active === item.id ? 'text-accent italic' : 'text-ink'
                )}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

