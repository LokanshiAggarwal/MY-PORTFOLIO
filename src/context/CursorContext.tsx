import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type CursorVariant = 'default' | 'hover' | 'text' | 'image' | 'drag' | 'hidden';

interface CursorContextValue {
  variant: CursorVariant;
  setVariant: (variant: CursorVariant) => void;
}

const CursorContext = createContext<CursorContextValue | null>(null);

/**
 * CursorContext only manages state.
 * The visual cursor (lerp tracking, stretching, hover morph, image/drag
 * labels) lives in <Cursor />.
 */
export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [variant, setVariant] = useState<CursorVariant>('default');

  const value = useMemo<CursorContextValue>(
    () => ({ variant, setVariant }),
    [variant]
  );

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
};

export const useCursor = (): CursorContextValue => {
  const ctx = useContext(CursorContext);
  if (!ctx) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return ctx;
};

export default CursorProvider;

