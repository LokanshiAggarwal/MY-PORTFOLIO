import { memo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiArrowUpRight, FiGithub } from 'react-icons/fi';
import { useLenis } from '@/context/LenisContext';
import type { Project } from './data';
import { techIcon } from './techIcons';
import modalStyles from './Modal.module.css';
import hoverStyles from './HoverEffects.module.css';

/* Framer Motion transition presets */
const EASE = [0.16, 1, 0.3, 1] as const;

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

/**
 * CaseStudyModal — fullscreen editorial case study.
 * Backdrop blur, large screenshots, problem → research → wireframes →
 * design → final solution → technologies → challenges → key learnings.
 */
export const CaseStudyModal = memo(function CaseStudyModal({
  project,
  onClose,
}: CaseStudyModalProps) {
  const { stop, start } = useLenis();

  /* Lock page scroll while the modal is open */
  useEffect(() => {
    if (!project) return;
    stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      start();
    };
  }, [project, onClose, stop, start]);

  if (!project) return null;

  return (
    <motion.div
      className={modalStyles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
    >
      <motion.div
        className={modalStyles.modal}
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.55, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* Close */}
        <button
          type="button"
          className={modalStyles.closeButton}
          onClick={onClose}
          aria-label="Close case study"
          data-cursor="hover"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className={modalStyles.header}>
          <div className={modalStyles.headerMedia}>
            <img src={project.image} alt={`${project.title} — hero`} loading="lazy" />
          </div>

          <div className={modalStyles.headerContent}>
            <h2 className={modalStyles.headerTitle}>{project.title}</h2>
            <div className={modalStyles.headerMeta}>
              <span className={modalStyles.headerMetaBadge}>{project.category}</span>
              <span className={modalStyles.headerMetaBadge}>{project.details.duration}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className={modalStyles.body}>
          {/* Case study sections */}
          {project.caseStudy.map((section, i) => (
            <motion.section
              key={section.title}
              className={modalStyles.section}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.08 + i * 0.05 }}
            >
              <h3 className={modalStyles.sectionTitle}>{section.title}</h3>
              <p className={modalStyles.sectionBody}>{section.body}</p>

              {section.bullets && (
                <div className={modalStyles.bullets}>
                  {section.bullets.map((bullet) => (
                    <span key={bullet} className={modalStyles.bullet}>
                      {bullet}
                    </span>
                  ))}
                </div>
              )}
            </motion.section>
          ))}

          {/* Technologies */}
          <motion.section
            className={modalStyles.section}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.08 + project.caseStudy.length * 0.05 }}
          >
            <h3 className={modalStyles.sectionTitle}>Technologies</h3>
            <div className={modalStyles.modalChips}>
              {project.technology.map((tech) => (
                <span key={tech} className={hoverStyles.chip} data-cursor="hover">
                  {techIcon(tech)}
                  {tech}
                </span>
              ))}
            </div>
          </motion.section>

          {/* Screenshots gallery */}
          <motion.section
            className={modalStyles.section}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: EASE,
              delay: 0.08 + (project.caseStudy.length + 1) * 0.05,
            }}
          >
            <h3 className={modalStyles.sectionTitle}>Screenshots</h3>
            <div className={modalStyles.modalGallery}>
              {project.gallery.map((src, i) => (
                <div key={src} className={modalStyles.modalGalleryItem} data-cursor="hover">
                  <img src={src} alt={`${project.title} — screenshot ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </motion.section>

          {/* Action row */}
          <div
            className="mt-6 flex flex-wrap gap-3"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}
          >
{project.id !== 'spotify' && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                className={`${hoverStyles.pillButton} ${hoverStyles.solid}`}
                data-cursor="hover"
              >
                <span className={hoverStyles.sweep} aria-hidden />
                <FiArrowUpRight size={15} />
                <span>Live Demo</span>
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={`${hoverStyles.pillButton} ${hoverStyles.outline}`}
              data-cursor="hover"
            >
              <span className={hoverStyles.sweep} aria-hidden />
              <FiGithub size={15} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default CaseStudyModal;

