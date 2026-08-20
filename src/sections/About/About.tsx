import { useMemo, useRef } from 'react';
import { FiDownload } from 'react-icons/fi';
import { gsap } from '@/animations/gsap';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useNavigation } from '@/context/NavigationContext';
import { isFinePointer, prefersReducedMotion } from '@/utils';
import { ProgressiveImage } from '@/components/ProgressiveImage/ProgressiveImage';
import styles from './About.module.css';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const PARA_LINES = [
  'I am Lokanshi, a Computer Science & Design student passionate about creating digital experiences that combine thoughtful design with clean development.',
  'I enjoy solving real problems through intuitive user interfaces, responsive web applications and meaningful interactions.',
  'My goal is to bridge creativity and technology to build products people genuinely enjoy using.',
];

/* Recent project highlights — clickable, jump to the projects section */
const HIGHLIGHTS = [
  'PANJDHARA Mustard Oil Website',
  'Portfolio Website',
  'Spotify Clone',
  'Angular Projects',
];

/* Hand-crafted flowing signature path for "Lokanshi" */
const SIGNATURE_PATH =
  'M20 84 C18 58 26 28 40 34 C52 40 48 58 44 74 C41 86 42 96 52 98 C64 100 66 82 64 66 ' +
  'M78 56 C76 40 94 34 102 44 C110 54 104 70 94 74 C84 78 76 72 78 62 ' +
  'M116 36 L114 80 M114 58 C122 50 130 46 142 44 M114 58 C122 62 132 70 142 76 ' +
  'M160 72 C158 54 174 44 184 52 C194 60 188 78 174 80 C162 82 156 72 160 62 ' +
  'M200 54 C202 44 210 40 218 46 C226 52 224 66 222 78 M200 54 C202 44 210 40 218 46 ' +
  'M238 52 C232 50 226 54 228 60 C230 66 238 66 240 72 C242 78 236 84 228 82 ' +
  'M258 38 L256 78 M256 58 C262 48 272 44 280 52 C288 60 286 72 284 80 ' +
  'M300 42 L298 44 M298 58 L296 80';

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * About — editorial magazine section.
 * Large portrait (clip-path reveal, float, mouse + scroll parallax),
 * huge chapter heading, line-by-line paragraph reveal, quote that fades
 * on scroll, and a stroke-drawn handwritten signature.
 */
export const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const prefersReduced = useMemo(() => prefersReducedMotion(), []);
  const { navigate } = useNavigation();

  /* Entrance reveal timeline */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        scrollTrigger: { trigger: section, start: 'top 68%', once: true },
      });

      tl.from('[data-about-label]', { opacity: 0, y: 26, duration: 0.7 })
        .from(
          '[data-about-title]',
          { opacity: 0, y: 44, filter: 'blur(8px)', duration: 0.95 },
          '-=0.3'
        )
        .from(
          '[data-about-line]',
          {
            opacity: 0,
            y: 40,
            filter: 'blur(8px)',
            duration: 0.85,
            stagger: 0.08,
          },
          '-=0.6'
        )
        .from('[data-about-quote]', { opacity: 0, y: 32, duration: 0.9 }, '-=0.4')
        .from('[data-about-sign]', { opacity: 0, y: 18, duration: 0.5 }, '-=0.55');

      /* Portrait clipping-mask reveal */
      gsap.from('[data-about-portrait]', {
        clipPath: 'inset(0 0 100% 0)',
        scale: 1.12,
        opacity: 0,
        filter: 'blur(14px)',
        duration: 1.5,
        ease: 'power4.out',
        scrollTrigger: { trigger: section, start: 'top 62%', once: true },
      });

      /* Signature stroke-draw */
      const paths = gsap.utils.toArray<SVGPathElement>('[data-sign-path]');
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.to('[data-sign-path]', {
        strokeDashoffset: 0,
        duration: 2.4,
        ease: 'power4.inOut',
        stagger: 0.2,
        delay: 0.35,
        scrollTrigger: { trigger: '[data-about-sign]', start: 'top 88%', once: true },
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReduced]);

  /* Scroll scrub — parallax, portrait scale, quote fade, exit drift */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      /* Portrait scale 1 → 1.03 while scrolling */
      gsap.to('[data-about-portrait-wrap]', {
        scale: 1.03,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      });

      /* Inner image parallax — subtle Ken Burns */
      gsap.fromTo(
        '[data-about-img]',
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );

      /* Content drifts up + fades toward the section exit (cinematic overlap) */
      gsap.to('[data-about-content]', {
        yPercent: -9,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: section, start: '62% top', end: 'bottom top', scrub: true },
      });

      /* Quote fades while scrolling */
      gsap.to('[data-about-quote]', {
        opacity: 0,
        y: -22,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'center center', end: 'bottom top', scrub: true },
      });

      /* Background word moves slower than foreground */
      gsap.to('[data-about-bg]', {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReduced]);

  /* Mouse parallax on the portrait */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!isDesktop || !isFinePointer() || prefersReduced) return;

    const ctx = gsap.context(() => {
      const wrap = section.querySelector<HTMLElement>('[data-about-portrait-inner]');
      if (!wrap) return;
      const xTo = gsap.quickTo(wrap, 'x', { duration: 0.8, ease: 'power3.out' });
      const yTo = gsap.quickTo(wrap, 'y', { duration: 0.8, ease: 'power3.out' });

      const onMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        xTo(nx * 22);
        yTo(ny * 16);
      };

      window.addEventListener('mousemove', onMove, { passive: true });
      return () => window.removeEventListener('mousemove', onMove);
    }, section);

    return () => ctx.revert();
  }, [isDesktop, prefersReduced]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-[110vh] overflow-hidden bg-background"
    >
      {/* Giant background word */}
      <div className={styles.bgWord} data-about-bg aria-hidden>
        ABOUT
      </div>

      {/* Grid layout */}
      <div className="relative z-10 mx-auto grid min-h-[110vh] w-full max-w-[1500px] grid-cols-1 items-center gap-16 px-6 py-28 md:px-10 lg:grid-cols-12 lg:gap-10 lg:px-16">
        {/* ------------------------- Portrait ------------------------- */}
        <div className="order-1 lg:col-span-5">
          <div className={styles.portraitWrap} data-about-portrait-wrap>
            <div data-about-portrait-inner>
              <div className={styles.offsetFrame} aria-hidden />
              <div className={`${styles.accentDisc} left-[-3.5rem] top-[-2.5rem] h-56 w-56`} aria-hidden />
              <div className={styles.floatPortrait}>
                <div className={styles.portraitFrame} data-about-portrait>
                  <ProgressiveImage
                    src="/profile.jpeg"
                    alt="Portrait of Lokanshi"
                    aspectRatio="4 / 5"
                    placeholderColor="#e6ddd2"
                    className={styles.portraitImg}
                    wrapperClassName={styles.portraitImgWrap}
                    draggable={false}
                    data-about-img
                  />
                </div>
              </div>
              <div className={`${styles.accentDisc} bottom-[-3.5rem] right-[-2.5rem] h-64 w-64`} aria-hidden />
            </div>
          </div>
        </div>

        {/* -------------------------- Text ---------------------------- */}
        <div className="order-2 lg:col-span-7" data-about-content>
          <div className="max-w-[650px]">
            {/* Chapter heading — "ABOUT" */}
            <div data-about-label className="mb-7">
              <span className={styles.label}>About</span>
            </div>

            {/* Main heading */}
            <h2
              data-about-title
              className="font-serif-display text-balance text-5xl leading-[1.02] tracking-tightest text-ink md:text-6xl lg:text-7xl"
            >
              About <em className="italic text-accent">Me</em>
            </h2>

            {/* Editorial paragraph — line by line */}
            <div className="mt-9 space-y-5">
              {PARA_LINES.map((line, i) => (
                <p
                  key={i}
                  data-about-line
                  className={`${styles.paraLine} text-[15px] leading-[1.9] text-ink/65 md:text-base lg:text-[17px]`}
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Project highlights — clickable chips */}
            <div className="mt-8" data-about-highlights>
              <span className="text-[11px] font-medium uppercase tracking-widest-2 text-ink/40">
                Selected work
              </span>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {HIGHLIGHTS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => navigate('#projects')}
                    className={styles.highlightChip}
                    data-cursor="hover"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quote block */}
            <blockquote className={styles.quote} data-about-quote>
              <span className={styles.quoteMark} aria-hidden>
                &ldquo;
              </span>
              <p className={styles.quoteText}>Great design begins with empathy.</p>
            </blockquote>

            {/* Handwritten signature */}
            <div data-about-sign className="mt-3">
              <svg
                viewBox="0 0 360 120"
                className={styles.signature}
                role="img"
                aria-label="Signature — Lokanshi"
              >
                <path data-sign-path className={styles.signaturePath} d={SIGNATURE_PATH} />
              </svg>
            </div>

            {/* Resume preview card */}
            <div data-about-resume className={styles.resumeCard}>
              <a
                href="/resume.png"
                target="_blank"
                rel="noreferrer"
                className={styles.resumePreviewLink}
                data-cursor="hover"
                aria-label="View full resume"
              >
                <ProgressiveImage
                  src="/resume.png"
                  alt="Lokanshi's resume"
                  aspectRatio="8.5 / 11"
                  placeholderColor="#faf7f2"
                  className={styles.resumePreviewImg}
                  wrapperClassName={styles.resumePreviewWrap}
                  draggable={false}
                />
                <span className={styles.resumePreviewOverlay}>
                  <span className={styles.resumePreviewLabel}>View Resume</span>
                </span>
              </a>
              <div className={styles.resumeCardMeta}>
                <div>
                  <span className={styles.resumeCardTitle}>My Resume</span>
                  <span className={styles.resumeCardSub}>Updated 2026 · PNG</span>
                </div>
                <a
                  href="/resume.png"
                  download="Lokanshi-Resume.png"
                  className={styles.resumeDownloadBtn}
                  data-cursor="hover"
                  aria-label="Download resume"
                >
                  <FiDownload size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

