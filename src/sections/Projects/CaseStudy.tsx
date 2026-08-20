import {
  memo,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { FiArrowUpRight, FiBookOpen, FiGithub } from 'react-icons/fi';
import { gsap } from '@/animations/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { isFinePointer, prefersReducedMotion } from '@/utils';
import type { Project } from './data';
import { techIcon } from './techIcons';
import projectStyles from './ProjectCard.module.css';
import caseStyles from './CaseStudy.module.css';
import hoverStyles from './HoverEffects.module.css';
import animStyles from './Animations.module.css';

/* ------------------------------------------------------------------ */
/* Magnetic pill button — lift, ripple, arrow slide, magnetic pull     */
/* ------------------------------------------------------------------ */

interface PillButtonProps {
  href?: string;
  onClick?: () => void;
  variant: 'solid' | 'outline';
  icon?: ReactNode;
  children: ReactNode;
  ariaLabel?: string;
}

const PillButton = memo(function PillButton({
  href,
  onClick,
  variant,
  icon,
  children,
  ariaLabel,
}: PillButtonProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const rafRef = useRef(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const onMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!isFinePointer()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    targetRef.current.x = (e.clientX - rect.left - rect.width / 2) * 0.22;
    targetRef.current.y = (e.clientY - rect.top - rect.height / 2) * 0.22;
    if (!rafRef.current) {
      const loop = () => {
        currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.16;
        currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.16;
        const anchor = ref.current;
        if (anchor) {
          anchor.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px)`;
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }
  };

  const onLeave = () => {
    targetRef.current = { x: 0, y: 0 };
  };

  const createRipple = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.1;
    const span = document.createElement('span');
    span.className = animStyles.ripple;
    span.style.width = `${size}px`;
    span.style.height = `${size}px`;
    span.style.left = `${e.clientX - rect.left - size / 2}px`;
    span.style.top = `${e.clientY - rect.top - size / 2}px`;
    el.appendChild(span);
    setTimeout(() => span.remove(), 700);
  };

  const classes = `${hoverStyles.pillButton} ${
    variant === 'solid' ? hoverStyles.solid : hoverStyles.outline
  }`;

  const content = (
    <>
      <span className={hoverStyles.sweep} aria-hidden />
      {icon}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={ariaLabel}
        data-cursor="hover"
        className={classes}
        style={{ willChange: 'transform' }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={createRipple}
      >
        {content}
      </a>
    );
  }

  return (
    <a
      ref={ref}
      href="#"
      role="button"
      aria-label={ariaLabel}
      data-cursor="hover"
      className={classes}
      style={{ willChange: 'transform' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={(e) => {
        e.preventDefault();
        createRipple(e);
        onClick?.();
      }}
    >
      {content}
    </a>
  );
});

/* ------------------------------------------------------------------ */
/* CaseStudy — one premium scene per project                           */
/* ------------------------------------------------------------------ */

interface CaseStudyProps {
  project: Project;
  onOpenCaseStudy?: (project: Project) => void;
}

export const CaseStudy = memo(function CaseStudy({
  project,
  onOpenCaseStudy,
}: CaseStudyProps) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  /* Mouse parallax + tilt on the hero image */
  useIsomorphicLayoutEffect(() => {
    const media = mediaRef.current;
    const inner = innerRef.current;
    if (!media || !inner) return;
    if (!isFinePointer() || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const xTo = gsap.quickTo(inner, 'x', { duration: 0.7, ease: 'power3.out' });
      const yTo = gsap.quickTo(inner, 'y', { duration: 0.7, ease: 'power3.out' });
      const rotXTo = gsap.quickTo(media, 'rotationX', { duration: 0.7, ease: 'power3.out' });
      const rotYTo = gsap.quickTo(media, 'rotationY', { duration: 0.7, ease: 'power3.out' });

      const onMove = (e: MouseEvent) => {
        const rect = media.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        xTo(px * 22);
        yTo(py * 16);
        rotXTo(py * -4);
        rotYTo(px * 5);
        media.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        media.style.setProperty('--my', `${e.clientY - rect.top}px`);
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
        rotXTo(0);
        rotYTo(0);
      };

      media.addEventListener('mousemove', onMove);
      media.addEventListener('mouseleave', onLeave);
      return () => {
        media.removeEventListener('mousemove', onMove);
        media.removeEventListener('mouseleave', onLeave);
      };
    }, media);

    return () => ctx.revert();
  }, []);

  /* Resolve composition classes */
  let sceneClass = projectStyles.scene;
  let mediaClass = '';
  let contentClass = '';

  if (project.layout === 'centered') {
    sceneClass = `${projectStyles.scene} ${projectStyles.sceneCentered}`;
  } else if (project.layout === 'offset') {
    sceneClass = `${projectStyles.scene} ${projectStyles.sceneOffset}`;
  } else if (project.layout === 'splitLeft') {
    mediaClass = caseStyles.splitLeftMedia;
    contentClass = caseStyles.splitLeftContent;
  } else {
    mediaClass = caseStyles.splitRightMedia;
    contentClass = caseStyles.splitRightContent;
  }

  return (
    <article className={sceneClass} data-project-scene>
      {/* ------------------------- Hero media ------------------------- */}
      <div className={`${projectStyles.mediaCol} ${mediaClass}`}>
        <div className={caseStyles.offsetFrame} aria-hidden />
        <div className={caseStyles.accentBlob} aria-hidden />

        <div className={hoverStyles.media} data-project-media ref={mediaRef} data-cursor="hover">
          <div className={hoverStyles.mediaInner} data-project-media-inner ref={innerRef}>
            <div className={caseStyles.parallaxLayer}>
              <img
                src={project.image}
                alt={`${project.title} — hero screenshot`}
                loading="lazy"
                draggable={false}
                data-project-image
              />
            </div>
          </div>
          {/* Lighting follows cursor */}
          <div className={hoverStyles.light} aria-hidden />
          {/* Subtle reflection */}
          <div className={hoverStyles.reflection} aria-hidden />

          <div className={`${caseStyles.floatChip} ${animStyles.floatSlow}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {project.category}
          </div>
        </div>
      </div>

      {/* ------------------------- Content --------------------------- */}
      <div className={`${projectStyles.contentCol} ${contentClass}`} data-project-content>
        <span className={projectStyles.number} data-project-number>
          {project.number}
        </span>

        <span className={projectStyles.category} data-cursor="hover">
          {project.category}
        </span>

        <h3 className={`${projectStyles.title} ${hoverStyles.hoverTitle}`} data-cursor="hover">
          {project.title}
        </h3>

        <p className={projectStyles.description}>{project.description}</p>

        {/* Tech chips */}
        <div className={projectStyles.techRow}>
          {project.technology.map((tech) => (
            <span key={tech} className={hoverStyles.chip} data-cursor="hover">
              {techIcon(tech)}
              {tech}
            </span>
          ))}
        </div>

        {/* Feature chips */}
        <div className={projectStyles.featureRow}>
          {project.features.map((feature) => (
            <span key={feature} className={hoverStyles.featureChip} data-cursor="hover">
              {feature}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className={projectStyles.buttonRow}>
          {project.id !== 'spotify' && (
            <PillButton href={project.liveUrl} variant="solid" icon={<FiArrowUpRight size={15} />}>
              Live Demo
            </PillButton>
          )}
          <PillButton href={project.githubUrl} variant="outline" icon={<FiGithub size={15} />}>
            GitHub
          </PillButton>
          {onOpenCaseStudy && (
            <PillButton
              variant="solid"
              icon={<FiBookOpen size={15} />}
              onClick={() => onOpenCaseStudy(project)}
            >
              View Case Study
            </PillButton>
          )}
        </div>

        {/* Compact details */}
        <div className={projectStyles.details}>
          <div className={projectStyles.detailItem}>
            <span className={projectStyles.detailLabel}>Role</span>
            <span className={projectStyles.detailValue}>{project.details.role}</span>
          </div>
          <div className={projectStyles.detailItem}>
            <span className={projectStyles.detailLabel}>Duration</span>
            <span className={projectStyles.detailValue}>{project.details.duration}</span>
          </div>
          <div className={projectStyles.detailItem}>
            <span className={projectStyles.detailLabel}>Stack</span>
            <span className={projectStyles.detailValue}>
              {project.details.technologies.join(' · ')}
            </span>
          </div>
        </div>

        {/* Gallery — stagger reveal */}
        <div className={projectStyles.gallery}>
          {project.gallery.map((src, i) => (
            <div
              key={src}
              className={projectStyles.galleryItem}
              data-project-gallery
              data-cursor="hover"
            >
              <img
                src={src}
                alt={`${project.title} — screenshot ${i + 1}`}
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
});

export default CaseStudy;

