import { Suspense, lazy, useCallback, useState } from 'react';
import { registerGsapPlugins } from '@/animations/gsap';
import { LenisProvider } from '@/context/LenisContext';
import { CursorProvider } from '@/context/CursorContext';
import { PageReadyProvider, usePageReady } from '@/context/PageReadyContext';
import { NavigationProvider } from '@/context/NavigationContext';
import { Navbar } from '@/components/Navbar/Navbar';
import { Cursor } from '@/components/Cursor/Cursor';
import { Loader } from '@/components/Loader/Loader';
import { PageTransition } from '@/components/PageTransition/PageTransition';
import { ScrollProgress } from '@/components/ScrollProgress/ScrollProgress';
import { BackToTop } from '@/components/BackToTop/BackToTop';
import { Hero } from '@/sections/Hero/Hero';

/* Below-the-fold sections are code-split for faster first paint. */
const About = lazy(() => import('@/sections/About/About'));
const Skills = lazy(() => import('@/sections/Skills/Skills'));
const Experience = lazy(() => import('@/sections/Experience/Experience'));
const Projects = lazy(() => import('@/sections/Projects/Projects'));
const Testimonials = lazy(() => import('@/sections/Testimonials/Testimonials'));
const Contact = lazy(() => import('@/sections/Contact/Contact'));
const Footer = lazy(() => import('@/components/Footer/Footer'));

// Register GSAP plugins once at the module level
registerGsapPlugins();

/** Minimal fallback while a lazy section streams in. */
const SectionFallback = () => (
  <div
    className="flex min-h-[40vh] items-center justify-center"
    aria-hidden
  >
    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
  </div>
);

/**
 * AppContent — lives inside all providers, so it can safely consume
 * PageReadyContext (this fixes the previous provider-order bug where
 * usePageReady was called from <App /> outside its provider).
 */
function AppContent() {
  const [loading, setLoading] = useState(true);
  const { setReady } = usePageReady();

  const handleLoaderComplete = useCallback(() => {
    setLoading(false);
    setReady(true);
  }, [setReady]);

  return (
    <>
      {/* Custom cursor (hidden on touch devices) */}
      <Cursor />

      {/* Premium loading screen */}
      <Loader duration={2.2} onComplete={handleLoaderComplete} />

      {/* Route-style transition veil */}
      <PageTransition />

      {/* Global scroll progress (vertical, right edge) */}
      <ScrollProgress />

      {/* Skip link for keyboard users */}
      <a
        href="#main"
        className="fixed left-4 top-4 z-[10001] -translate-y-24 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-background transition-transform duration-300 focus:translate-y-0"
      >
        Skip to content
      </a>

      {/* Main content — hidden until loader fades out */}
      <div
        className={`relative min-h-screen transition-opacity duration-700 ease-power3 ${
          loading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Navbar />

        <main id="main">
          <Hero />
          <Suspense fallback={<SectionFallback />}>
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Testimonials />
            <Contact />
          </Suspense>
        </main>

        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </div>

      {/* Floating back-to-top button */}
      <BackToTop />
    </>
  );
}

/**
 * Root application component.
 * Wraps the page in context providers (Lenis → Cursor → PageReady →
 * Navigation), which the sections consume for smooth scrolling, the
 * custom cursor, loader coordination, and cinematic page transitions.
 */
function App() {
  return (
    <LenisProvider>
      <CursorProvider>
        <PageReadyProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </PageReadyProvider>
      </CursorProvider>
    </LenisProvider>
  );
}

export default App;

