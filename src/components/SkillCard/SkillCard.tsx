import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface Skill {
  name: string;
  level: number; // 0-100
  category?: string;
  icon?: React.ReactNode;
}

interface SkillCardProps {
  skill: Skill;
  index?: number;
  className?: string;
}

/**
 * SkillCard — clean skill chip/bar with animated fill and hover lift.
 */
export const SkillCard = ({ skill, index = 0, className }: SkillCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (index % 6) * 0.06 }}
      className={cn(
        'group rounded-2xl border border-line bg-card p-5 transition-all duration-500 ease-power4 hover:-translate-y-1.5 hover:rotate-[0.5deg] hover:border-accent/40 hover:shadow-card',
        className
      )}
      data-cursor="hover"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {skill.icon && (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-alternate text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-background">
              {skill.icon}
            </span>
          )}
          <span className="font-serif-display text-lg font-medium text-ink">
            {skill.name}
          </span>
        </div>
        <span className="text-xs font-medium tabular-nums text-ink/50">
          {skill.level}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-px w-full overflow-hidden bg-line">
        <motion.div
          className="h-full origin-left bg-accent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: skill.level / 100 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 + (index % 6) * 0.05 }}
        />
      </div>
    </motion.div>
  );
};

export default SkillCard;

