import { useEffect, useRef, useState, type CSSProperties, type ImgHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface ProgressiveImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /** Final image source */
  src: string;
  /** Required alt text for accessibility */
  alt: string;
  /** Aspect ratio in the format 'width / height' — prevents layout shift */
  aspectRatio?: string;
  /** Blur-up placeholder background colour */
  placeholderColor?: string;
  /** Additional class for the wrapper (e.g. rounded corners / overflow) */
  wrapperClassName?: string;
  /** Load eagerly instead of lazily */
  eager?: boolean;
}

/**
 * ProgressiveImage — blur-up placeholder + lazy loading.
 * A softly tinted wrapper reserves the exact aspect ratio (no layout
 * shift), the image fades in with a blur dissolve once decoded, and
 * IntersectionObserver lazy-loads it as it approaches the viewport.
 */
export const ProgressiveImage = ({
  src,
  alt,
  aspectRatio = '4 / 5',
  placeholderColor = '#e6ddd2',
  wrapperClassName,
  eager = false,
  className,
  style,
  ...rest
}: ProgressiveImageProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete) {
      setLoaded(true);
      return;
    }
    const onLoad = () => setLoaded(true);
    img.addEventListener('load', onLoad);
    return () => img.removeEventListener('load', onLoad);
  }, [src]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img || eager) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src = src;
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '300px 0px' }
    );
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [src, eager]);

  return (
    <div
      ref={wrapRef}
      className={cn('relative overflow-hidden', wrapperClassName)}
      style={
        {
          aspectRatio,
          backgroundColor: placeholderColor,
          ...style,
        } as CSSProperties
      }
    >
      {!eager && (
        <img
          ref={imgRef}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={cn(
            'h-full w-full object-cover transition-[opacity,filter,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-xl scale-105',
            className
          )}
          {...rest}
        />
      )}
      {eager && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          className={cn(
            'h-full w-full object-cover transition-[opacity,filter,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-xl scale-105',
            className
          )}
          {...rest}
        />
      )}
    </div>
  );
};

export default ProgressiveImage;

