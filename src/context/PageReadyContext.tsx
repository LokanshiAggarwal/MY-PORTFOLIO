import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface PageReadyContextValue {
  /** Becomes true once the loader completes and the page is interactive. */
  ready: boolean;
  setReady: (value: boolean) => void;
}

const PageReadyContext = createContext<PageReadyContextValue | null>(null);

/**
 * Coordinates the post-loader entrance of the Navbar and the Hero timeline.
 * The Loader flips `ready = true` when it finishes so both can animate in sync —
 * loader ends → navbar enters → hero reveals.
 */
export const PageReadyProvider = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(false);

  const value = useMemo<PageReadyContextValue>(
    () => ({ ready, setReady }),
    [ready]
  );

  return (
    <PageReadyContext.Provider value={value}>
      {children}
    </PageReadyContext.Provider>
  );
};

export const usePageReady = (): PageReadyContextValue => {
  const ctx = useContext(PageReadyContext);
  if (!ctx) {
    throw new Error('usePageReady must be used within a PageReadyProvider');
  }
  return ctx;
};

export default PageReadyProvider;

