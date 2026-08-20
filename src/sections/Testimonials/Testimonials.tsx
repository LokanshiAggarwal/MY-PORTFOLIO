import { motion } from 'framer-motion';
import { SectionTitle } from '@/components/SectionTitle/SectionTitle';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Lokanshi has a rare ability to translate complex user needs into elegant, intuitive interfaces. Every pixel feels intentional.',
    name: 'Design Mentor',
    role: 'Senior UI Designer',
    initials: 'SM',
  },
  {
    quote: 'The attention to micro-interactions and motion design in her work sets it apart. She thinks like both a designer and an engineer.',
    name: 'Project Collaborator',
    role: 'Frontend Developer',
    initials: 'PC',
  },
  {
    quote: 'Working with Lokanshi on the portfolio project was seamless. Her code is clean, well-structured, and a joy to extend.',
    name: 'Peer Developer',
    role: 'CS Student',
    initials: 'PD',
  },
];

/**
 * Testimonials — editorial quotes with soft cards and hover lift.
 */
export const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="relative scroll-mt-24 overflow-hidden bg-alternate py-24 md:py-36"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionTitle
          eyebrow="Testimonials"
          align="center"
          title={
            <>
              Kind <em className="italic text-accent">words</em>
            </>
          }
          description="What people say about working with me."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-2xl border border-line bg-card p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-card"
            >
              {/* Quote mark */}
              <span className="font-serif-display text-4xl leading-none text-accent/30">
                &ldquo;
              </span>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                {item.quote}
              </p>
              <span className="font-serif-display text-4xl leading-none text-accent/30">
                &rdquo;
              </span>

              <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-alternate text-xs font-medium text-ink">
                  {item.initials}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-[11px] text-ink/50">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
