import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiArrowRight,
  FiDownload,
} from 'react-icons/fi';
import {
  Palette,
  Code2,
  Lightbulb,
  Figma,
  Atom,
  Cog,
} from 'lucide-react';
import SplitType from 'split-type';
import { gsap } from '@/animations/gsap';
import { usePageReady } from '@/context/PageReadyContext';
import { useLenis } from '@/context/LenisContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { isFinePointer, prefersReducedMotion } from '@/utils';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const ROTATING_TITLES = [
  'Computer Science & Design Student',
  'UI/UX Designer',
  'Frontend Developer',
  'Creative Problem Solver',
];

const FLOAT_CARDS = [
  {
    label: 'UI/UX Designer',
    icon: <Palette size={13} strokeWidth={1.75} />,
    className: 'left-[-2rem] top-[10%]',
  },
  {
    label: 'Frontend Developer',
    icon: <Code2 size={13} strokeWidth={1.75} />,
    className: 'right-[-1.5rem] top-[30%]',
  },
  {
    label: 'Creative Thinker',
    icon: <Lightbulb size={13} strokeWidth={1.75} />,
    className: 'left-[-2.5rem] bottom-[22%]',
  },
  {
    label: 'Figma',
    icon: <Figma size={13} strokeWidth={1.75} />,
    className: 'right-[-2rem] bottom-[40%]',
  },
  {
    label: 'Angular',
    icon: <Atom size={13} strokeWidth={1.75} />,
    className: 'left-[8%] top-[-1.5rem]',
  },
  {
    label: 'React',
    icon: <Cog size={13} strokeWidth={1.75} />,
    className: 'right-[10%] bottom-[-1rem]',
  },
];

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/LokanshiAggarwal', icon: <FiGithub size={17} /> },
{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/lokanshi-aggarwal-b31b7234a/', icon: <FiLinkedin size={17} /> },
{ label: 'Email', href: 'mailto:lokanshii@gmail.com', icon: <FiMail size={17} /> },
];

/* ------------------------------------------------------------------ */
/* Small internal components                                           */
/* ------------------------------------------------------------------ */

/** Rotating subtitle — fades + slides upward every 2.5s, loops forever. */
const RotatingTitle = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ROTATING_TITLES.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-7 overflow-hidden md:h-8">
      <motion.p
        key={index}
        initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -22, filter: 'blur(6px)' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="font-serif-display text-lg italic text-ink/75 md:text-xl"
      >
        {ROTATING_TITLES[index]}
      </motion.p>
    </div>
  );
};

/** Magnetic wrapper — gently pulls children toward the cursor. */
const Magnetic = ({
  children,
  className,
  strength = 0.28,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !isFinePointer()) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ willChange: 'transform', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)' }}
    >
      {children}
    </div>
  );
};

/** Circular rotating badge — "CREATIVE DEVELOPER • 2026 •" */
const ExperienceBadge = () => {
  const text = 'CREATIVE DEVELOPER • 2026 •';
  return (
    <div className="hero-badge-spin h-32 w-32 select-none md:h-36 md:w-36" aria-hidden>
      <svg viewBox="0 0 144 144" className="h-full w-full">
        <defs>
          <path
            id="badge-circle"
            d="M72,72 m-60,0 a60,60 0 1,1 120,0 a60,60 0 1,1 -120,0"
          />
        </defs>
        <circle cx="72" cy="72" r="71" className="fill-[#FAF7F2]/70 stroke-[#1a1a1a]/15" strokeWidth="1" />
        <text className="fill-[#1a1a1a]/85" style={{ fontSize: '11.5px', letterSpacing: '2.2px' }}>
          <textPath href="#badge-circle">{text}</textPath>
        </text>
        <circle cx="72" cy="72" r="7" className="fill-accent/80" />
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { ready } = usePageReady();
  const { scrollTo } = useLenis();
  const isDesktop = useIsDesktop();

  const prefersReduced = useMemo(() => prefersReducedMotion(), []);

  /* Entrance timeline (runs once when loader completes) */
  useIsomorphicLayoutEffect(() => {
    if (!ready) return;
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      /* Split heading into words so each word can be animated individually */
      const titleLine = section.querySelector<HTMLElement>('[data-hero-title-line]');
      let splitWords: HTMLElement[] = [];
      if (titleLine) {
        const split = new SplitType(titleLine, { types: 'words' });
        splitWords = (split.words as HTMLElement[]) || [];
        splitWords.forEach((word) => {
          if (word.textContent?.trim() === 'Lokanshi') {
            word.classList.add('text-accent');
            word.classList.add('hero-name-word');
          }
        });
      }

      /* Initial hidden states */
      gsap.set('[data-hero-label]', { opacity: 0, y: 24 });
      gsap.set('[data-hero-title-line] .word', {
        opacity: 0,
        y: 80,
        filter: 'blur(20px)',
        rotateX: 15,
        transformOrigin: '0% 50%',
      });
      gsap.set('[data-hero-subtitle]', { opacity: 0, y: 24, filter: 'blur(8px)' });
      gsap.set('[data-hero-desc]', { opacity: 0, y: 24, filter: 'blur(8px)' });
      gsap.set('[data-hero-cta]', { opacity: 0, y: 24 });
      gsap.set('[data-hero-social]', { opacity: 0, y: 16 });
      gsap.set('[data-hero-image]', {
        opacity: 0,
        scale: 1.2,
        rotate: 3,
        transformOrigin: 'center center',
      });
      gsap.set('[data-hero-card]', { opacity: 0, scale: 0.85, y: 20 });
      gsap.set('[data-hero-badge]', { opacity: 0, scale: 0.6 });
      gsap.set('[data-hero-scroll]', { opacity: 0, y: 16 });

      /* Master timeline */
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        delay: 0.15,
      });

      tl.to('[data-hero-label]', { opacity: 1, y: 0, duration: 0.7 })
        .to(
          '[data-hero-title-line] .word',
          { opacity: 1, y: 0, filter: 'blur(0px)', rotateX: 0, duration: 1.2, stagger: 0.12 },
          '-=0.3'
        )
        .to('[data-hero-subtitle]', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, '-=0.7')
        .to('[data-hero-desc]', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, '-=0.55')
        .to('[data-hero-cta]', { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, '-=0.45')
        .to('[data-hero-social]', { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 }, '-=0.4')
        .to(
          '[data-hero-image]',
          { opacity: 1, scale: 1, rotate: 0, duration: 1.4, ease: 'power4.out' },
          '-=1.0'
        )
        .to(
          '[data-hero-card]',
          { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power4.out' },
          '-=1.0'
        )
        .to('[data-hero-badge]', { opacity: 1, scale: 1, duration: 0.8 }, '-=0.6')
        .to('[data-hero-scroll]', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
    }, section);

    return () => ctx.revert();
  }, [ready, prefersReduced]);

  /* Floating cards — infinite gentle y float, different timing each card */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);
      q('[data-hero-card]').forEach((card, i) => {
        const duration = 4.5 + (i % 5) * 0.7;
        gsap.to(card, {
          y: '-=12',
          duration,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.4,
        });
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReduced]);

  /* Background blurred circles — slow infinite drift (18–25s linear) */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.to('[data-hero-blob="0"]', {
        xPercent: 12,
        yPercent: -10,
        scale: 1.12,
        duration: 22,
        ease: 'linear',
        repeat: -1,
        yoyo: true,
      });
      gsap.to('[data-hero-blob="1"]', {
        xPercent: -14,
        yPercent: 12,
        scale: 0.9,
        duration: 25,
        ease: 'linear',
        repeat: -1,
        yoyo: true,
      });
      gsap.to('[data-hero-blob="2"]', {
        xPercent: 8,
        yPercent: 14,
        scale: 1.06,
        duration: 18,
        ease: 'linear',
        repeat: -1,
        yoyo: true,
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReduced]);

  /* Mouse parallax — right visual responds to cursor at different depths */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!isDesktop || !isFinePointer() || prefersReduced) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);
      const visual = q('[data-hero-visual]')[0] as HTMLElement | undefined;
      if (!visual) return;

      const depthEls = Array.from(
        visual.querySelectorAll<HTMLElement>('[data-depth]')
      );
      const xTo = depthEls.map((el) =>
        gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
      );
      const yTo = depthEls.map((el) =>
        gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
      );

      const onMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        depthEls.forEach((el, i) => {
          const depth = parseFloat(el.dataset.depth || '10');
          xTo[i](nx * depth);
          yTo[i](ny * depth);
        });
      };

      window.addEventListener('mousemove', onMove, { passive: true });
      return () => window.removeEventListener('mousemove', onMove);
    }, section);

    return () => ctx.revert();
  }, [isDesktop, prefersReduced]);

  /* Scroll exit — hero content moves upward on scroll at different speeds */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.to('[data-hero-content]', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      gsap.to('[data-hero-title-line]', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      gsap.to('[data-hero-visual]', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      gsap.to('[data-hero-card]', {
        yPercent: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      gsap.to('[data-hero-scroll]', {
        opacity: 0,
        y: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '15% top',
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReduced]);

  const scrollToAbout = useCallback(() => scrollTo('#about'), [scrollTo]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hero-grain relative flex min-h-screen flex-col overflow-hidden bg-background"
    >
      {/* Background giant typography */}
      <div className="hero-bg-word" data-hero-bg-word aria-hidden>
        DESIGN
      </div>

      {/* Background blurred circles */}
      <div className="pointer-events-none absolute inset-0" data-hero-blobs aria-hidden>
        <div className="hero-blob-wrap left-[-8%] top-[-6%]" data-hero-blob="0">
          <div
            className="hero-blob h-[420px] w-[420px]"
            style={{ background: 'rgba(139, 58, 58, 0.16)' }}
          />
        </div>
        <div className="hero-blob-wrap right-[-6%] top-[24%]" data-hero-blob="1">
          <div
            className="hero-blob h-[360px] w-[360px]"
            style={{ background: 'rgba(139, 58, 58, 0.12)' }}
          />
        </div>
        <div className="hero-blob-wrap bottom-[-8%] left-[28%]" data-hero-blob="2">
          <div
            className="hero-blob h-[300px] w-[300px]"
            style={{ background: 'rgba(26, 26, 26, 0.08)' }}
          />
        </div>
      </div>

      {/* Grid wrapper */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 items-center gap-12 px-6 py-10 pt-24 md:px-10 md:pt-28 lg:grid-cols-12 lg:gap-8 lg:px-20 lg:pt-32">
        {/* ------------------------------ Left content ------------------------------ */}
        <div
          className="order-1 flex flex-col items-start lg:col-span-7"
          data-hero-content
        >
          {/* Availability label */}
          <div data-hero-label className="mb-7 flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[4px] text-ink/70">
              Available for internships
            </span>
            <span className="h-px w-10 bg-ink/20" />
          </div>

          {/* Heading */}
          <h1 className="font-serif-display text-[42px] leading-[1.04] tracking-tightest text-ink md:text-[64px] lg:text-[90px] xl:text-[120px]">
            <span data-hero-title-line className="hero-title-line block">
              <span className="hero-title-greeting block">Hi, I'm</span>
              <span className="hero-title-name-line block">
                <span className="text-accent">Lokanshi</span>
              </span>
            </span>
          </h1>

          {/* Rotating subtitle */}
          <div data-hero-subtitle className="mt-5">
            <RotatingTitle />
          </div>

          {/* Description */}
          <p
            data-hero-desc
            className="mt-6 max-w-[520px] text-[15px] leading-relaxed text-ink/60 md:text-base"
          >
            I design and develop modern digital experiences that combine
            aesthetics, usability, and clean code. I enjoy transforming ideas
            into elegant, responsive interfaces that solve real-world problems.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div data-hero-cta>
              <Magnetic>
                <button
                  type="button"
                  onClick={scrollToAbout}
                  data-cursor="hover"
                  className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-ink px-9 text-sm font-medium text-background transition-all duration-500 ease-power3 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-soft"
                  style={{ padding: '0 36px' }}
                >
                  <span className="relative z-10">View Projects</span>
                  <FiArrowRight
                    size={15}
                    className="relative z-10 transition-transform duration-500 group-hover:translate-x-1"
                  />
                  <span className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-500 ease-power3 group-hover:translate-x-0" />
                </button>
              </Magnetic>
            </div>
            <div data-hero-cta>
              <Magnetic>
                <a
                  href="/resume.png"
                  download="Lokanshi-Resume.png"
                  data-cursor="hover"
                  className="group relative inline-flex h-14 items-center justify-center gap-2 rounded-full border border-ink/20 bg-transparent px-9 text-sm font-medium text-ink transition-all duration-500 ease-power3 hover:-translate-y-1 hover:scale-[1.03] hover:border-accent hover:text-accent hover:shadow-soft"
                  style={{ padding: '0 36px' }}
                >
                  Download Resume
                  <FiDownload
                    size={15}
                    className="transition-transform duration-500 group-hover:translate-y-0.5"
                  />
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Social links */}
          <div className="mt-9 flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <div key={social.label} data-hero-social>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  data-cursor="hover"
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink/60 transition-all duration-500 ease-power3 hover:-translate-y-0.5 hover:rotate-6 hover:scale-110 hover:border-accent/30 hover:text-accent hover:shadow-glow"
                >
                  {social.icon}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------ Right visual ------------------------------ */}
        <div
          className="order-2 lg:col-span-5"
          data-hero-visual
        >
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            {/* Floating cards */}
            {FLOAT_CARDS.map((card, i) => (
              <div
                key={card.label}
                data-hero-card
                data-depth={10 + (i % 3) * 8}
                className={card.className}
                style={{ position: 'absolute' }}
              >
                <div className="hero-card">
                  {card.icon}
                  <span>{card.label}</span>
                </div>
              </div>
            ))}

            {/* Portrait card */}
            <div
              data-hero-image
              className="group relative overflow-hidden rounded-[2.5rem] shadow-soft"
              data-depth={14}
              style={{ willChange: 'transform' }}
            >
              <img
                src="/profile.jpeg"
                alt="Portrait of Lokanshi"
                className="aspect-[4/5] w-full object-cover"
                loading="eager"
                draggable={false}
              />
              {/* subtle inner border */}
              <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-ink/5" />
              {/* soft bottom gradient */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/10 to-transparent" />
            </div>

            {/* Experience badge */}
            <div
              data-hero-badge
              data-depth={6}
              className="absolute -bottom-8 -right-6 md:-right-10"
              style={{ position: 'absolute' }}
            >
              <ExperienceBadge />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-hero-scroll
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <button
          type="button"
          onClick={scrollToAbout}
          className="flex flex-col items-center gap-3"
          data-cursor="hover"
          aria-label="Scroll to about"
        >
          <span className="text-[10px] font-medium uppercase tracking-[4px] text-ink/70">
            Scroll
          </span>
          <span className="relative block h-14 w-px overflow-hidden bg-ink/15">
            <motion.span
              className="absolute left-0 top-0 h-4 w-px bg-accent"
              animate={{ y: [-16, 56] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </button>
      </div>
    </section>
  );
};

export default Hero;

