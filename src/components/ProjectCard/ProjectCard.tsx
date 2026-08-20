import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard/GlassCard';
import { cn } from '@/utils/cn';

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  year: string;
  image: string;
  link?: string;
}

interface ProjectCardProps {
  project: Project;
  index?: number;
  className?: string;
}

/**
 * ProjectCard — editorial card with clip-path image reveal,
 * float on scroll (parallax), and hover lift + arrow.
 */
export const ProjectCard = ({ project, index = 0, className }: ProjectCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Parallax float based on scroll progress within the card
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const rotate = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -1 : 1, 0]);

  return (
    <motion.article
      ref={ref}
      style={{ y, rotate }}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (index % 2) * 0.1 }}
      className={cn('group', className)}
    >
      <GlassCard className="overflow-hidden">
        {/* Image */}
        <div className="relative overflow-hidden">
          <div className="aspect-[4/3] w-full overflow-hidden bg-alternate">
            <motion.img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1.2s] ease-power4 group-hover:scale-105"
              initial={{ scale: 1.15, opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
              whileInView={{ scale: 1, opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            />
          </div>
          {/* Category chip */}
          <span className="absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1 text-[11px] font-medium uppercase tracking-widest-2 text-ink/70 backdrop-blur-md">
            {project.category}
          </span>
          {/* Year */}
          <span className="absolute right-4 top-4 font-serif-display text-sm italic text-ink/60">
            {project.year}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 md:p-7">
          <div className="mb-3 flex items-start justify-between gap-4">
            <h3 className="font-serif-display text-2xl font-medium text-ink md:text-[28px]">
              {project.title}
            </h3>
            <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink/50 transition-all duration-500 ease-power4 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-background">
              <ArrowUpRight size={16} strokeWidth={1.75} />
            </span>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-ink/60">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line px-3 py-1 text-[11px] font-medium text-ink/60 transition-colors duration-300 group-hover:border-accent/30 group-hover:text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.article>
  );
};

export default ProjectCard;

