import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import SplitType from 'split-type';
import { AnimatePresence } from 'framer-motion';
import { gsap } from '@/animations/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { isFinePointer, prefersReducedMotion } from '@/utils';
import { PROJECTS } from './data';
import { CaseStudy } from './CaseStudy';
import { CaseStudyModal } from './CaseStudyModal';
import styles from './Projects.module.css';

/* Intro copy — revealed line by line */
const INTRO_LINES = [
  'A collection of carefully crafted projects that combine thoughtful design,',
  'clean code and meaningful user experiences.',
];

const BG_WORDS = ['BUILD', 'CREATE', 'DESIGN', 'EXPERIENCE'];

/**
 * Projects — cinematic luxury-agency showcase.
 * Desktop: the stage pins while scroll scrubs through each project scene
 * (clip-path image reveal, blur dissolve, scene-change scale/fade).
 * Tablet / mobile / reduced-motion: scenes stack vertically with
 * per-scene scroll reveals. Giant background words drift slower than the
 * foreground throughout.
 */
export const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<(typeof PROJECTS)[number] | null>(null);

  const isDesktop = useIsDesktop();
  const prefersReduced = useMemo(() => prefersReducedMotion(), []);
  const stacked = !isDesktop || prefersReduced;

  const openCaseStudy = useCallback(
    (project: (typeof PROJECTS)[number]) => setActiveProject(project),
    []
  );
  const closeCaseStudy = useCallback(() => setActiveProject(null), []);

  /* Intro — SplitType word reveal + label + paragraph lines */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const titleEl = section.querySelector<HTMLElement>('[data-project-title]');
      if (!titleEl) return;

      const split = new SplitType(titleEl, { types: 'words' });
      const words = (split.words as HTMLElement[]) || [];
      const masks: HTMLSpanElement[] = [];

      /* Wrap each word in a mask so they slide up from behind */
      words.forEach((word) => {
        const mask = document.createElement('span');
        mask.className = styles.titleWord;
        word.classList.add(styles.titleWordInner);
        mask.appendChild(word);
        titleEl.appendChild(mask);
        masks.push(mask);
      });

      gsap.set(words, { opacity: 0, y: '110%', rotateX: 40, filter: 'blur(14px)' });
      gsap.to(words, {
        opacity: 1,
        y: '0%',
        rotateX: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: { trigger: section, start: 'top 70%', once: true },
      });

      gsap.from('[data-project-label]', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power4.out',
        scrollTrigger: { trigger: section, start: 'top 75%', once: true },
      });

      gsap.utils.toArray<HTMLElement>('[data-project-paraline]').forEach((line) => {
        gsap.from(line, {
          opacity: 0,
          y: 40,
          filter: 'blur(8px)',
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: { trigger: line, start: 'top 88%', once: true },
        });
      });

      /* Cleanup — restore the original title DOM for StrictMode safety */
      return () => {
        split.revert();
        masks.forEach((mask) => mask.remove());
      };
    }, section);

    return () => ctx.revert();
  }, [prefersReduced]);

  /* Pinned cinematic stage — desktop only */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    if (stacked) return;

    const scenes = Array.from(stage.querySelectorAll<HTMLElement>('[data-project-scene]'));
    if (scenes.length === 0) return;

    const ctx = gsap.context(() => {
/* Hide all scenes initially (they overlap inside the pinned stage).
         Use autoAlpha so visibility toggles to hidden at opacity 0 —
         otherwise invisible overlapping scenes still intercept pointer
         events and block clicks on the buttons of the visible scene. */
      gsap.set(scenes, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=420%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      scenes.forEach((scene, i) => {
        const media = scene.querySelector<HTMLElement>('[data-project-media]');
        const image = scene.querySelector<HTMLElement>('[data-project-image]');
        const content = scene.querySelector<HTMLElement>('[data-project-content]');
        const number = scene.querySelector<HTMLElement>('[data-project-number]');
        const gallery = scene.querySelectorAll<HTMLElement>('[data-project-gallery]');
        const pos = i * 1.0;

        /* Enter — film scene fades/scales in (autoAlpha restores visibility) */
        tl.fromTo(
          scene,
          { autoAlpha: 0, scale: 0.92, yPercent: 5 },
          { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.5 },
          pos
        );

        /* Hero image — clip-path reveal + scale 1.15→1 + blur 12→0 */
        if (media && image) {
          tl.fromTo(
            media,
            { clipPath: 'inset(0 0 100% 0)' },
            { clipPath: 'inset(0 0 0% 0)', duration: 0.34 },
            pos + 0.1
          );
          tl.fromTo(
            image,
            { scale: 1.15, opacity: 0, filter: 'blur(12px)' },
            { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.3 },
            pos + 0.12
          );
        }

        /* Content — slides up, number slides in from left */
        if (content) {
          tl.fromTo(
            content,
            { opacity: 0, y: 70 },
            { opacity: 1, y: 0, duration: 0.4 },
            pos + 0.2
          );
        }
        if (number) {
          tl.fromTo(
            number,
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.3 },
            pos + 0.18
          );
        }

        /* Gallery — staggered reveal */
        if (gallery.length > 0) {
          tl.fromTo(
            gallery,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.25, stagger: 0.06 },
            pos + 0.4
          );
        }

        /* Exit — current scene scales down + fades (scene change) */
        tl.to(scene, { opacity: 0, scale: 0.9, yPercent: -4, duration: 0.35 }, pos + 0.62);
      });

      /* Progress rail */
      gsap.fromTo(
        '[data-project-progress]',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: '+=420%',
            scrub: true,
          },
        }
      );
    }, stage);

    return () => ctx.revert();
  }, [stacked]);

  /* Stacked per-scene reveals — tablet / mobile / reduced motion */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    if (!stacked) return;

    const ctx = gsap.context(() => {
      const scenes = Array.from(stage.querySelectorAll<HTMLElement>('[data-project-scene]'));

      scenes.forEach((scene) => {
        const media = scene.querySelector<HTMLElement>('[data-project-media]');
        const image = scene.querySelector<HTMLElement>('[data-project-image]');
        const content = scene.querySelector<HTMLElement>('[data-project-content]');
        const gallery = scene.querySelectorAll<HTMLElement>('[data-project-gallery]');

        const tl = gsap.timeline({
          scrollTrigger: { trigger: scene, start: 'top 72%', once: true },
        });

        if (media && image) {
          tl.fromTo(
            media,
            { clipPath: 'inset(0 0 100% 0)' },
            { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.out' },
            0
          );
          tl.fromTo(
            image,
            { scale: 1.15, opacity: 0, filter: 'blur(12px)' },
            { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power4.out' },
            0.1
          );
        }
        if (content) {
          tl.fromTo(
            content,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out' },
            0.25
          );
        }
        if (gallery.length > 0) {
          tl.fromTo(
            gallery,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power4.out', stagger: 0.1 },
            0.5
          );
        }
      });
    }, stage);

    return () => ctx.revert();
  }, [stacked]);

  /* Background words drift slower + mouse parallax on foreground layers */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.to('[data-project-bgwords]', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      if (isFinePointer() && isDesktop) {
        const layers = Array.from(section.querySelectorAll<HTMLElement>('[data-parallax]'));
        if (layers.length === 0) return;

        const xTo = layers.map((el) =>
          gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' })
        );
        const yTo = layers.map((el) =>
          gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' })
        );

        const onMove = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((el, i) => {
            const depth = parseFloat(el.dataset.parallax || '10');
            xTo[i](nx * depth);
            yTo[i](ny * depth);
          });
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
      }
    }, section);

    return () => ctx.revert();
  }, [prefersReduced, isDesktop]);

  return (
    <section id="projects" ref={sectionRef} className={styles.section}>
      {/* Progress rail */}
      <div className={styles.progress} aria-hidden>
        <div className={styles.progressFill} data-project-progress />
      </div>

      {/* Grain */}
      <div className={styles.grain} aria-hidden />

      {/* Giant background words */}
      <div className={styles.bgWords} data-project-bgwords aria-hidden>
        {BG_WORDS.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </div>

      {/* Intro */}
      <header className={styles.intro}>
        <span className={styles.label} data-project-label>
          Selected Work
        </span>

        <h2 className={styles.title} data-project-title>
          Projects
        </h2>

        <p className={styles.paragraph}>
          {INTRO_LINES.map((line, i) => (
            <span key={i} className={styles.paraLine}>
              <span className={styles.paraLineInner} data-project-paraline>
                {line}
              </span>
            </span>
          ))}
        </p>
      </header>

      {/* Stage — pinned on desktop, stacked on mobile/tablet */}
      <div
        className={`${styles.stage} ${stacked ? styles.stageStacked : ''}`}
        ref={stageRef}
      >
        {PROJECTS.map((project) => (
          <div key={project.id} className={styles.sceneWrap}>
            <div data-parallax={project.layout === 'splitLeft' ? 12 : 8}>
              <CaseStudy project={project} onOpenCaseStudy={openCaseStudy} />
            </div>
          </div>
        ))}
      </div>

      {/* Case study modal */}
      <AnimatePresence>
        {activeProject && (
          <CaseStudyModal project={activeProject} onClose={closeCaseStudy} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;

