'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

interface SmoothScrollContextValue {
  scrollToTop: () => void;
  lockScroll: () => void;
  unlockScroll: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollToTop: () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  lockScroll: () => {},
  unlockScroll: () => {},
});

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const lockCountRef = useRef(0);
  const savedOverflowRef = useRef<string | null>(null);

  const lockScroll = useCallback(() => {
    const prev = lockCountRef.current;
    lockCountRef.current = prev + 1;
    if (prev === 0 && typeof document !== 'undefined') {
      savedOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      lenisRef.current?.stop();
    }
  }, []);

  const unlockScroll = useCallback(() => {
    if (lockCountRef.current <= 0) return;
    lockCountRef.current -= 1;
    if (lockCountRef.current === 0 && typeof document !== 'undefined') {
      document.body.style.overflow = savedOverflowRef.current ?? '';
      savedOverflowRef.current = null;
      lenisRef.current?.start();
    }
  }, []);

  const scrollToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.05 });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => {
      lenisRef.current?.destroy();
      if (media.matches) {
        lenisRef.current = null;
        return;
      }
      const instance = new Lenis({
        autoRaf: true,
        anchors: { offset: -76 },
        lerp: 0.12,
        smoothWheel: true,
        wheelMultiplier: 1,
        syncTouch: false,
        allowNestedScroll: true,
      });
      if (lockCountRef.current > 0) {
        instance.stop();
      }
      lenisRef.current = instance;
    };

    sync();
    media.addEventListener('change', sync);
    return () => {
      media.removeEventListener('change', sync);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      if (lockCountRef.current > 0 && typeof document !== 'undefined') {
        document.body.style.overflow = savedOverflowRef.current ?? '';
        savedOverflowRef.current = null;
        lockCountRef.current = 0;
      }
    };
  }, []);

  const value = useMemo(
    () => ({ scrollToTop, lockScroll, unlockScroll }),
    [scrollToTop, lockScroll, unlockScroll]
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export function useScrollLock(active: boolean) {
  const { lockScroll, unlockScroll } = useSmoothScroll();

  useEffect(() => {
    if (!active) return;
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [active, lockScroll, unlockScroll]);
}
