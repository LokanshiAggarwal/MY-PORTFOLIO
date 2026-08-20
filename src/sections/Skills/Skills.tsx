import { useMemo, useRef, type MouseEvent } from 'react';
import {
  FiCode,
  FiLayout,
  FiSearch,
  FiPenTool,
  FiSmartphone,
} from 'react-icons/fi';
import {
  SiReact,
  SiAngular,
  SiFigma,
  SiGithub,
  SiNodedotjs,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiMongodb,
  SiExpress,
  SiHtml5,
  SiCss,
} from 'react-icons/si';
import { FaGitAlt } from 'react-icons/fa6';
import { gsap } from '@/animations/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { isFinePointer, prefersReducedMotion } from '@/utils';
import styles from './Skills.module.css';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const ICON_MAP: Record<string, React.ReactNode> = {
  HTML: <SiHtml5 size={20} />,
  CSS: <SiCss size={20} />,
  JavaScript: <SiJavascript size={20} />,
  TypeScript: <SiTypescript size={20} />,
  React: <SiReact size={20} />,
  Angular: <SiAngular size={20} />,
  'Node.js': <SiNodedotjs size={20} />,
  Express: <SiExpress size={20} />,
  MongoDB: <SiMongodb size={20} />,
  Git: <FaGitAlt size={20} />,
  GitHub: <SiGithub size={20} />,
  Figma: <SiFigma size={20} />,
  'UI Design': <FiPenTool size={20} />,
  'UX Research': <FiSearch size={20} />,
  Wireframing: <FiLayout size={20} />,
  Prototyping: <FiSmartphone size={20} />,
  'Responsive Design': <FiCode size={20} />,
};

interface Skill {
  name: string;
  years?: string;
  desc: string;
  size: 'sm' | 'md' | 'lg';
}

/* Organic — deliberately not a perfect grid. Sizes and positions vary. */
const SKILLS: Skill[] = [
  { name: 'HTML', years: '2y', desc: 'Semantic, accessible structure.', size: 'sm' },
  { name: 'CSS', years: '2y', desc: 'Responsive, elegant styling.', size: 'sm' },
  { name: 'JavaScript', years: '2y', desc: 'The language I think in.', size: 'md' },
  { name: 'TypeScript', years: '1y', desc: 'Typed, safer frontends.', size: 'md' },
  { name: 'React', years: '1.5y', desc: 'Component-driven interfaces.', size: 'lg' },
  { name: 'Angular', years: '1y', desc: 'Structured app architecture.', size: 'md' },
  { name: 'Node.js', years: '1y', desc: 'Backend logic & APIs.', size: 'sm' },
  { name: 'Express', years: '1y', desc: 'Lightweight REST APIs.', size: 'sm' },
  { name: 'MongoDB', years: '1y', desc: 'Flexible data modelling.', size: 'sm' },
  { name: 'Git', years: '2y', desc: 'Version control workflow.', size: 'sm' },
  { name: 'GitHub', years: '2y', desc: 'Collaboration & open source.', size: 'sm' },
  { name: 'Figma', years: '1.5y', desc: 'Design & prototyping.', size: 'md' },
  { name: 'UI Design', years: '1.5y', desc: 'Visual systems & aesthetics.', size: 'md' },
  { name: 'UX Research', years: '1y', desc: 'Empathy-driven decisions.', size: 'sm' },
  { name: 'Wireframing', years: '1y', desc: 'Structure before pixels.', size: 'sm' },
  { name: 'Prototyping', years: '1y', desc: 'Test ideas, fast.', size: 'sm' },
  { name: 'Responsive Design', years: '2y', desc: 'Every screen, considered.', size: 'lg' },
];

/* Tool icons for the infinite marquee */
const TOOL_PILLS = [
  { label: 'React', icon: <SiReact size={16} /> },
  { label: 'Angular', icon: <SiAngular size={16} /> },
  { label: 'Figma', icon: <SiFigma size={16} /> },
  { label: 'GitHub', icon: <SiGithub size={16} /> },
  { label: 'Node.js', icon: <SiNodedotjs size={16} /> },
  { label: 'VS Code', icon: <FiCode size={16} /> },
  { label: 'JavaScript', icon: <SiJavascript size={16} /> },
  { label: 'TypeScript', icon: <SiTypescript size={16} /> },
  { label: 'Tailwind', icon: <SiTailwindcss size={16} /> },
];

const BG_WORDS = ['CREATE', 'DESIGN', 'BUILD'];

/* Organic column layout config for desktop (varying col-spans) */
const LAYOUT = [
  'lg:col-start-1 lg:col-span-3',
  'lg:col-start-4 lg:col-span-2',
  'lg:col-start-6 lg:col-span-3',
  'lg:col-start-9 lg:col-span-4',
  'lg:col-start-2 lg:col-span-3',
  'lg:col-start-5 lg:col-span-3',
  'lg:col-start-8 lg:col-span-3',
  'lg:col-start-11 lg:col-span-2',
  'lg:col-start-1 lg:col-span-2',
  'lg:col-start-3 lg:col-span-3',
  'lg:col-start-6 lg:col-span-2',
  'lg:col-start-8 lg:col-span-4',
  'lg:col-start-12 lg:col-span-1',
  'lg:col-start-1 lg:col-span-3',
  'lg:col-start-4 lg:col-span-3',
  'lg:col-start-7 lg:col-span-3',
  'lg:col-start-10 lg:col-span-3',
];

/* Per-card float speed/delay variance */
const FLOAT_VAR = [
  { d: '6.5s', delay: '0s' },
  { d: '8s', delay: '-2s' },
  { d: '7s', delay: '-1s' },
  { d: '9s', delay: '-3s' },
  { d: '7.5s', delay: '-0.5s' },
  { d: '8.5s', delay: '-2.5s' },
  { d: '6s', delay: '-1.5s' },
  { d: '9.5s', delay: '-4s' },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * Skills — editorial floating card wall.
 * Organic glass cards float forever at different speeds, reveal one by
 * one on scroll, glow/lift on hover with magnetic pull, giant background
 * words drift slower than foreground, and an infinite tools marquee runs
 * underneath (pauses on hover).
 */
export const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useMemo(() => prefersReducedMotion(), []);

  /* Card reveal — one by one: opacity 0→1, scale 0.8→1, y 80→0, stagger 0.12 */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-skill-card]',
        { opacity: 0, scale: 0.8, y: 80 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.12,
          scrollTrigger: { trigger: section, start: 'top 72%', once: true },
        }
      );

      gsap.from('[data-skill-title]', {
        opacity: 0,
        y: 40,
        filter: 'blur(8px)',
        duration: 0.9,
        ease: 'power4.out',
        scrollTrigger: { trigger: section, start: 'top 80%', once: true },
      });

      gsap.from('[data-marquee]', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power4.out',
        scrollTrigger: { trigger: '[data-marquee]', start: 'top 90%', once: true },
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReduced]);

  /* Background words move slower than foreground + section exit fade */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.to('[data-skill-bg]', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      });

      gsap.to('[data-skill-content]', {
        yPercent: -8,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: { trigger: section, start: '68% top', end: 'bottom top', scrub: true },
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReduced]);

  /* Magnetic cursor + soft glow that follows the mouse on each card */
  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isFinePointer()) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);

    const cx = x / rect.width - 0.5;
    const cy = y / rect.height - 0.5;
    el.style.transform = `translate(${cx * -6}px, ${cy * -6}px) rotate(${cx * 3}deg)`;
  };

  const handleLeave = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.transform = '';
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative min-h-[110vh] overflow-hidden bg-alternate"
    >
      {/* Giant background words */}
      <div className={styles.bgWords} data-skill-bg aria-hidden>
        {BG_WORDS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      {/* Content */}
      <div
        className="relative z-10 mx-auto flex min-h-[110vh] w-full max-w-[1500px] flex-col px-6 py-28 md:px-10 lg:px-16"
        data-skill-content
      >
        {/* Header */}
        <header className="mb-16 lg:mb-20" data-skill-title>
          <span className="mb-5 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-widest-2 text-accent">
            <span className="h-px w-8 bg-accent/50" />
            Skills
          </span>
          <h2 className="font-serif-display text-balance text-5xl leading-[1.02] tracking-tightest text-ink md:text-6xl lg:text-7xl">
            Tools I <em className="italic text-accent">wield</em>
          </h2>
        </header>

        {/* Organic card wall */}
        <div className="grid flex-1 grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-10">
          {SKILLS.map((skill, i) => {
            const sizeClass =
              skill.size === 'sm'
                ? styles.sizeSm
                : skill.size === 'lg'
                  ? styles.sizeLg
                  : styles.sizeMd;
            const layoutClass = LAYOUT[i % LAYOUT.length];
            const floatVar = FLOAT_VAR[i % FLOAT_VAR.length];
            const rotate = ((i % 5) - 2) * 0.7; // -1.4 to 1.4 deg

            return (
              <div
                key={skill.name}
                data-skill-card
                className={layoutClass}
                style={{ willChange: 'transform, opacity' }}
              >
                <div
                  className={styles.cardFloat}
                  style={
                    {
                      '--float-duration': floatVar.d,
                      '--float-delay': floatVar.delay,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className={`${styles.card} ${sizeClass}`}
                    style={{ '--hover-rotate': `${rotate}deg` } as React.CSSProperties}
                    onMouseMove={handleMove}
                    onMouseLeave={handleLeave}
                    data-cursor="hover"
                  >
                    <div className={styles.glow} aria-hidden />
                    <div className={styles.cardBody}>
                      <div className={styles.cardTop}>
                        <span className={styles.iconTile}>{ICON_MAP[skill.name]}</span>
                        {skill.years && <span className={styles.years}>{skill.years}</span>}
                      </div>
                      <h3 className={styles.name}>{skill.name}</h3>
                      <p className={styles.desc}>{skill.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Infinite tools marquee */}
        <div className="mt-20" data-marquee>
          <p className="mb-5 text-center text-[11px] font-medium uppercase tracking-widest-2 text-ink/50">
            A few of my everyday tools
          </p>
          <div className={styles.marquee}>
            <div className={styles.track}>
              {[...TOOL_PILLS, ...TOOL_PILLS].map((pill, i) => (
                <span key={`${pill.label}-${i}`} className={styles.pill}>
                  {pill.icon}
                  {pill.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;

