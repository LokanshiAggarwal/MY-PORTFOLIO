import { useMemo, useRef, type MouseEvent } from 'react';
import { FiCode, FiPenTool, FiZap, FiGithub, FiLayout } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa6';
import { gsap } from '@/animations/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { isFinePointer, prefersReducedMotion } from '@/utils';
import styles from './Experience.module.css';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

interface TimelineItem {
  title: string;
  period: string;
  desc: string;
  chips: string[];
  icon: React.ReactNode;
}

const TIMELINE: TimelineItem[] = [
  {
    title: 'Computer Science & Design Student',
    period: '2022 — Present',
    desc: 'Studying the intersection of computing and design — algorithms, human behaviour, and the craft of interfaces.',
    chips: ['CS & Design', 'Problem Solving'],
    icon: <FaGraduationCap size={17} />,
  },
  {
    title: 'Frontend Development Journey',
    period: '2023',
    desc: 'Deep-dived into modern frontend — JavaScript, TypeScript, React, Angular — and building responsive, animated interfaces.',
    chips: ['React', 'Angular', 'TypeScript'],
    icon: <FiCode size={17} />,
  },
  {
    title: 'UI/UX Design Learning',
    period: '2023 — 2024',
    desc: 'Learned the language of interfaces — Figma, wireframing, prototyping, usability and design systems.',
    chips: ['Figma', 'UI', 'UX'],
    icon: <FiPenTool size={17} />,
  },
  {
    title: 'Creative Projects',
    period: '2024',
    desc: 'Brought ideas to life — from the PANJDHARA website to a Spotify Clone, exploring motion, interaction and polish.',
    chips: ['PANJDHARA Website', 'Spotify Clone'],
    icon: <FiZap size={17} />,
  },
  {
    title: 'Open Source Learning',
    period: '2024 — 2025',
    desc: 'Learning in the open — sharing on GitHub, reading others’ code, and growing through collaboration and Angular practice projects.',
    chips: ['Git', 'GitHub', 'Angular Practice'],
    icon: <FiGithub size={17} />,
  },
  {
    title: 'Portfolio Development',
    period: '2025',
    desc: 'Designing and engineering this very experience — an editorial magazine built with React, GSAP and care.',
    chips: ['Portfolio Website', 'GSAP'],
    icon: <FiLayout size={17} />,
  },
];

interface Stat {
  value: number | null;
  symbol?: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 15, symbol: '+', label: 'Projects' },
  { value: 100, symbol: '%', label: 'Responsive' },
  { value: 2023, label: 'Started Journey' },
  { value: null, symbol: '∞', label: 'Learning' },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * Experience — editorial alternating timeline.
 * The central line grows as you scroll, cards slide in from opposite
 * sides with a blur dissolve, icons spin in, and a numbers strip counts
 * up at the bottom (15+ / 100% / 2023 / ∞).
 */
export const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useMemo(() => prefersReducedMotion(), []);

  /* Timeline entrance — cards slide from opposite sides + line grows */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      /* Header */
      gsap.from('[data-exp-title]', {
        opacity: 0,
        y: 40,
        filter: 'blur(8px)',
        duration: 0.9,
        ease: 'power4.out',
        scrollTrigger: { trigger: section, start: 'top 78%', once: true },
      });

      /* Cards alternate from left / right with blur + scale */
      gsap.utils.toArray<HTMLElement>('[data-exp-item]').forEach((item) => {
        const fromLeft = item.dataset.side === 'left';
        gsap.from(item, {
          opacity: 0,
          x: fromLeft ? -90 : 90,
          filter: 'blur(10px)',
          scale: 0.94,
          duration: 1.1,
          ease: 'power4.out',
          scrollTrigger: { trigger: item, start: 'top 82%', once: true },
        });
      });

      /* Dots pop in with a rotation */
      gsap.from('[data-exp-dot]', {
        scale: 0,
        rotate: -180,
        opacity: 0,
        duration: 0.7,
        ease: 'back.out(2)',
        stagger: 0.15,
        scrollTrigger: { trigger: section, start: 'top 60%', once: true },
      });

      /* Icon tiles rotate in */
      gsap.from('[data-exp-icon]', {
        rotate: -120,
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(2.2)',
        stagger: 0.1,
        scrollTrigger: { trigger: section, start: 'top 60%', once: true },
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReduced]);

  /* Line grows with scroll (scrub) + background drift + section exit */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      /* The line fill grows as the section scrolls through */
      gsap.fromTo(
        '[data-exp-line-fill]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-exp-line]',
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: true,
          },
        }
      );

      /* Background word drifts slower */
      gsap.to('[data-exp-bg]', {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      });

      /* Numbers strip reveal */
      gsap.from('[data-exp-stats]', {
        opacity: 0,
        y: 60,
        filter: 'blur(8px)',
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: { trigger: '[data-exp-stats]', start: 'top 88%', once: true },
      });

      /* Section exit fade */
      gsap.to('[data-exp-content]', {
        yPercent: -7,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: section, start: '72% top', end: 'bottom top', scrub: true },
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReduced]);

  /* Count-up numbers */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count || '0');
        const symbol = el.dataset.symbol || '';
        if (prefersReduced) {
          el.textContent = `${target}${symbol}`;
          return;
        }
        const counter = { val: 0 };
        gsap.to(counter, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.val)}${symbol}`;
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReduced]);

  /* Tilt + glow following the mouse on cards */
  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isFinePointer()) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
  };

  const handleLeave = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '50%');
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative min-h-[110vh] overflow-hidden bg-section3"
    >
      {/* Giant background word */}
      <div className={styles.bgWord} data-exp-bg aria-hidden>
        JOURNEY
      </div>

      {/* Content */}
      <div
        className="relative z-10 mx-auto flex min-h-[110vh] w-full max-w-[1200px] flex-col px-6 py-28 md:px-10"
        data-exp-content
      >
        {/* Header */}
        <header className="mb-20" data-exp-title>
          <span className="mb-5 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-widest-2 text-accent">
            <span className="h-px w-8 bg-accent/50" />
            Experience
          </span>
          <h2 className="font-serif-display text-balance text-5xl leading-[1.02] tracking-tightest text-ink md:text-6xl lg:text-7xl">
            A journey of <em className="italic text-accent">growth</em>
          </h2>
        </header>

        {/* Timeline */}
        <div className={`${styles.timeline} flex-1`}>
          <div className={styles.line} data-exp-line aria-hidden>
            <div className={styles.lineFill} data-exp-line-fill />
          </div>

          <div className="space-y-16 lg:space-y-24">
            {TIMELINE.map((item, i) => {
              const left = i % 2 === 0;
              return (
                <div
                  key={item.title}
                  data-exp-item
                  data-side={left ? 'left' : 'right'}
                  className="relative lg:grid lg:grid-cols-2 lg:gap-16"
                >
                  {/* Dot */}
                  <span className={styles.dot} data-exp-dot aria-hidden />

                  {/* Card */}
                  <div
                    className={`pl-12 lg:pl-0 ${
                      left ? 'lg:col-start-1 lg:pr-4' : 'lg:col-start-2 lg:pl-4'
                    }`}
                  >
                    <div
                      className={styles.card}
                      onMouseMove={handleMove}
                      onMouseLeave={handleLeave}
                      data-cursor="hover"
                    >
                      <div className={styles.glow} aria-hidden />
                      <div className={styles.cardBody}>
                        <div className={styles.cardTop}>
                          <span className={styles.iconTile} data-exp-icon>
                            {item.icon}
                          </span>
                          <span className={styles.period}>{item.period}</span>
                        </div>
                        <h3 className={styles.title}>{item.title}</h3>
                        <p className={styles.desc}>{item.desc}</p>
                        <div className={styles.chips}>
                          {item.chips.map((chip) => (
                            <span key={chip} className={styles.chip}>
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Numbers strip */}
        <div className="mt-24" data-exp-stats>
          <div className={styles.statsGrid}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.stat} data-cursor="hover">
                {stat.value === null ? (
                  <span className={styles.statValue}>{stat.symbol}</span>
                ) : (
                  <span
                    className={styles.statValue}
                    data-count={stat.value}
                    data-symbol={stat.symbol || ''}
                  >
                    0{stat.symbol || ''}
                  </span>
                )}
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

