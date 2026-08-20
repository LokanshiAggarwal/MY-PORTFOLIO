import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import SplitType from 'split-type';
import {
  FiMail,
  FiLinkedin,
  FiGithub,
  FiMapPin,
  FiDownload,
  FiCheck,
  FiSend,
} from 'react-icons/fi';
import { gsap } from '@/animations/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { prefersReducedMotion } from '@/utils';
import { Magnetic } from '@/components/Magnetic/Magnetic';
import { cn } from '@/utils/cn';
import styles from './Contact.module.css';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const HEADING_LINES = ['Let\u2019s Build', 'Something', 'Meaningful.'];

const DESCRIPTION =
  "Whether it's a freelance opportunity, internship, collaboration or simply a conversation about design and technology, I'd love to hear from you.";

const CONTACT_DETAILS = [
  {
    label: 'Email',
value: 'lokanshii@gmail.com',
    href: 'mailto:lokanshii@gmail.com',
    icon: <FiMail size={16} />,
  },
  {
label: 'LinkedIn',
    value: 'linkedin.com/in/lokanshi-aggarwal',
    href: 'https://www.linkedin.com/in/lokanshi-aggarwal-b31b7234a/',
    icon: <FiLinkedin size={16} />,
  },
  {
    label: 'GitHub',
    value: 'github.com/LokanshiAggarwal',
    href: 'https://github.com/LokanshiAggarwal',
    icon: <FiGithub size={16} />,
  },
  {
    label: 'Location',
    value: 'India — working globally',
    href: undefined,
    icon: <FiMapPin size={16} />,
  },
];

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/LokanshiAggarwal', icon: <FiGithub size={18} /> },
{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/lokanshi-aggarwal-b31b7234a/', icon: <FiLinkedin size={18} /> },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldName = 'name' | 'email' | 'subject' | 'message';
type FieldValue = Record<FieldName, string>;
type FieldErrors = Partial<Record<FieldName, string>>;
type SubmitState = 'idle' | 'loading' | 'success' | 'error';

const INITIAL_VALUES: FieldValue = { name: '', email: '', subject: '', message: '' };

/* ------------------------------------------------------------------ */
/* Small field component                                               */
/* ------------------------------------------------------------------ */

interface FieldProps {
  name: FieldName;
  label: string;
  type?: string;
  textarea?: boolean;
  value: string;
  error?: string;
  onChange: (name: FieldName, value: string) => void;
}

const Field = ({ name, label, type = 'text', textarea, value, error, onChange }: FieldProps) => {
  const filled = value.length > 0;

  const sharedProps = {
    name,
    id: `contact-${name}`,
    value,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `contact-${name}-error` : undefined,
    className: cn(styles.fieldInput, filled && styles.fieldFilled),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(name, e.target.value),
  };

  return (
    <div>
      <div
        className={cn(
          styles.field,
          textarea && styles.fieldTextarea,
          error && styles.fieldError
        )}
        data-field
      >
        <span className={styles.fieldBorder} aria-hidden />
        {textarea ? (
          <textarea {...sharedProps} rows={4} />
        ) : (
          <input {...sharedProps} type={type} autoComplete="off" />
        )}
        <label htmlFor={`contact-${name}`} className={styles.fieldLabel}>
          {label}
        </label>
      </div>

      <p
        id={`contact-${name}-error`}
        role="alert"
        className={cn(styles.error, error && styles.errorVisible)}
      >
        {error && <FiCheck size={12} />}
        {error}
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * Contact — premium editorial split layout on #EFE8DF.
 * Left: GET IN TOUCH label, SplitType headline (opacity/blur/y per line),
 * 520px description, contact details with underline reveal, magnetic
 * social icons and a resume button.
 * Right: elegant glass form with floating labels, real-time validation,
 * animated errors, a rotating gradient focus border, loading spinner and
 * a success checkmark. Giant 2% "CONTACT" word drifts slower than the
 * foreground on scroll.
 */
export const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useMemo(() => prefersReducedMotion(), []);

  const [values, setValues] = useState<FieldValue>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  /* ---- Entrance timeline: label fade-up, SplitType heading, description ---- */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const label = section.querySelector<HTMLElement>('[data-contact-label]');
      const description = section.querySelector<HTMLElement>('[data-contact-desc]');
      const details = section.querySelectorAll<HTMLElement>('[data-contact-detail]');
      const socials = section.querySelectorAll<HTMLElement>('[data-contact-social]');

      gsap.set(label, { opacity: 0, y: 26 });
      gsap.set(description, { opacity: 0, y: 30, filter: 'blur(8px)' });
      gsap.set(details, { opacity: 0, y: 24 });
      gsap.set(socials, { opacity: 0, y: 18 });

      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        scrollTrigger: { trigger: section, start: 'top 68%', once: true },
      });

      /* SplitType heading — each line reveals with opacity + blur + y */
      let split: SplitType | undefined;
      const headingEl = section.querySelector<HTMLElement>('[data-contact-heading]');
      if (headingEl) {
        split = new SplitType(headingEl, { types: 'lines' });
        const lines = (split.lines as HTMLElement[]) || [];
        gsap.set(lines, {
          opacity: 0,
          y: 80,
          filter: 'blur(16px)',
          transformOrigin: '0% 50%',
        });
        tl.to(lines, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.15,
          stagger: 0.14,
        });
      }

      tl.to(label, { opacity: 1, y: 0, duration: 0.7 }, 0.1)
        .to(description, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85 }, '-=0.5')
        .to(details, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, '-=0.55')
        .to(socials, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 }, '-=0.45');

      /* Form card — soft rise + blur */
      const form = section.querySelector<HTMLElement>('[data-contact-form]');
      if (form) {
        gsap.set(form, { opacity: 0, y: 60, filter: 'blur(12px)' });
        tl.to(form, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 }, 0.2);
      }

      /* Cleanup — restore the original title DOM for StrictMode safety */
      return () => {
        split?.revert();
      };
    }, section);

    return () => ctx.revert();
  }, [prefersReduced]);

  /* ---- Background parallax: giant word + blurred circles drift ---- */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.to('[data-contact-bgword]', {
        yPercent: 22,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      });

      gsap.to('[data-contact-blob="0"]', {
        xPercent: 14,
        yPercent: -12,
        scale: 1.15,
        duration: 21,
        ease: 'linear',
        repeat: -1,
        yoyo: true,
      });
      gsap.to('[data-contact-blob="1"]', {
        xPercent: -16,
        yPercent: 14,
        scale: 0.9,
        duration: 26,
        ease: 'linear',
        repeat: -1,
        yoyo: true,
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReduced]);

  /* ---- Form logic ---- */

  const validateField = useCallback((name: FieldName, value: string): string | undefined => {
    if (name === 'name' && value.trim().length < 2) {
      return 'Please enter your name.';
    }
    if (name === 'email') {
      if (!value.trim()) return 'Please enter your email.';
      if (!EMAIL_RE.test(value.trim())) return 'That email address looks invalid.';
    }
    if (name === 'subject' && value.trim().length < 2) {
      return 'Please add a short subject.';
    }
    if (name === 'message' && value.trim().length < 10) {
      return 'Message should be at least 10 characters.';
    }
    return undefined;
  }, []);

  const handleChange = useCallback(
    (name: FieldName, value: string) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      // Live validation once the field has content
      if (value.trim().length > 0) {
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
[validateField]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const nextErrors: FieldErrors = {};
      (Object.keys(values) as FieldName[]).forEach((key) => {
        const err = validateField(key, values[key]);
        if (err) nextErrors[key] = err;
      });
      setErrors(nextErrors);

      if (Object.values(nextErrors).some(Boolean)) return;
      if (submitState !== 'idle') return;

setSubmitState('loading');

      try {
        // POST to the server-side email endpoint (Netlify function / Vercel API /
        // local Vite middleware). The Gmail credentials stay on the server.
        const res = await fetch('/api/send-enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            subject: values.subject,
            message: values.message,
          }),
        });

        const payload = (await res.json().catch(() => ({}))) as { error?: string };

        if (!res.ok) {
          throw new Error(payload.error || `Request failed with status ${res.status}`);
        }

        setSubmitState('success');
      } catch (err) {
        // Log the full error so we can identify the real problem.
        console.error('SEND-ENQUIRY ERROR:', err);
        setSubmitState('error');
      }
    },
    [validateField, values, submitState]
  );

  useEffect(() => {
    if (submitState === 'success') {
      const id = window.setTimeout(() => {
        setSubmitState('idle');
        setValues(INITIAL_VALUES);
        setErrors({});
      }, 4000);
      return () => window.clearTimeout(id);
    }
    if (submitState === 'error') {
      const id = window.setTimeout(() => setSubmitState('idle'), 5000);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [submitState]);

  const formMarkup = useMemo<ReactNode>(
    () => (
      <form onSubmit={handleSubmit} noValidate data-contact-form className={styles.form}>
        <div className={styles.formInner}>
          <Field
            name="name"
            label="Your Name"
            value={values.name}
            error={errors.name}
            onChange={handleChange}
          />
          <Field
            name="email"
            label="Email Address"
            type="email"
            value={values.email}
            error={errors.email}
            onChange={handleChange}
          />
          <Field
            name="subject"
            label="Subject"
            value={values.subject}
            error={errors.subject}
            onChange={handleChange}
          />
          <Field
            name="message"
            label="Your Message"
            textarea
            value={values.message}
            error={errors.message}
            onChange={handleChange}
          />

          <Magnetic className="mt-1" strength={0.18}>
            <button
              type="submit"
              disabled={submitState !== 'idle'}
              className={styles.submitBtn}
              data-cursor="hover"
            >
              {submitState === 'idle' && (
                <>
                  Send Message
                  <FiSend size={15} />
                </>
              )}
              {submitState === 'loading' && (
                <>
                  Sending
                  <span className={styles.spinner} aria-hidden />
                </>
              )}
              {submitState === 'success' && (
                <>
                  Message Sent
                  <span className={styles.checkmark} aria-hidden>
                    <FiCheck size={14} />
                  </span>
                </>
              )}
              {submitState === 'error' && <>Something went wrong — try again</>}
            </button>
          </Magnetic>

          {submitState === 'success' && (
            <p className={styles.successNote} role="status">
              <FiCheck size={15} />
              Thanks for reaching out — I&rsquo;ll get back to you within 24 hours.
            </p>
          )}

          {submitState === 'error' && (
            <p className={styles.errorNote} role="alert">
              There was a problem sending your message. Please try again.
            </p>
          )}
        </div>
      </form>
    ),
    [values, errors, handleChange, handleSubmit, submitState]
  );

  return (
    <section id="contact" ref={sectionRef} className={styles.section}>
      {/* Giant background typography — 2% opacity, slow parallax */}
      <div className={styles.bgWord} data-contact-bgword aria-hidden>
        CONTACT
      </div>

      {/* Floating blurred circles */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className={cn(styles.blob, 'left-[-6%] top-[8%] h-[380px] w-[380px]')} data-contact-blob="0" style={{ background: 'rgba(139,58,58,0.14)' }} />
        <div className={cn(styles.blob, 'right-[-8%] bottom-[6%] h-[440px] w-[440px]')} data-contact-blob="1" style={{ background: 'rgba(26,26,26,0.08)' }} />
      </div>

      {/* Split layout */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col justify-center gap-16 px-6 py-28 md:px-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-14 lg:px-16">
        {/* ------------------------- Left — typography ------------------------- */}
        <div className="lg:col-span-6">
          <span className={styles.label} data-contact-label>
            Get in touch
          </span>

          <h2 className={styles.heading} data-contact-heading>
            {HEADING_LINES.map((line, i) => (
              <span key={line} className={styles.headingLine}>
                {line}
                {i < HEADING_LINES.length - 1 && <span aria-hidden> </span>}
              </span>
            ))}
          </h2>

          <p className={cn(styles.description, 'mt-8')} data-contact-desc>
            {DESCRIPTION}
          </p>

          {/* Contact details */}
          <div className="mt-10 grid max-w-md gap-1" data-contact-details>
            {CONTACT_DETAILS.map((item) => {
              const content = (
                <>
                  <span className={styles.detailIcon} aria-hidden>
                    {item.icon}
                  </span>
                  <span>
                    <span className={styles.detailLabel}>{item.label}</span>
                    <span className={styles.detailValue}>{item.value}</span>
                  </span>
                </>
              );
              return (
                <span key={item.label} data-contact-detail className="block">
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                      className={styles.detailItem}
                      data-cursor="hover"
                    >
                      {content}
                    </a>
                  ) : (
                    <span className={styles.detailItem}>{content}</span>
                  )}
                </span>
              );
            })}
          </div>

          {/* Social icons + resume */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            {SOCIALS.map((social) => (
              <span key={social.label} data-contact-social>
                <Magnetic strength={0.35}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className={styles.socialIcon}
                    data-cursor="hover"
                  >
                    {social.icon}
                  </a>
                </Magnetic>
              </span>
            ))}
            <span data-contact-social className="ml-1">
              <Magnetic strength={0.25}>
                <a href="/resume.png" download="Lokanshi-Resume.png" className={styles.resumeBtn} data-cursor="hover">
                  Resume
                  <FiDownload size={14} />
                </a>
              </Magnetic>
            </span>
          </div>
        </div>

        {/* ------------------------- Right — form ------------------------- */}
        <div className="lg:col-span-6">
          <div className="mx-auto w-full max-w-xl lg:ml-auto">{formMarkup}</div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

