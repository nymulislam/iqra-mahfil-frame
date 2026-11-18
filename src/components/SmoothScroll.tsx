'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function SmoothScroll() {
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;

    const sync = () => {
      lenis?.destroy();
      lenis = media.matches
        ? null
        : new Lenis({
            autoRaf: true,
            anchors: { offset: -76 },
            lerp: 0.12,
            smoothWheel: true,
            wheelMultiplier: 1,
            syncTouch: false,
            allowNestedScroll: true,
          });
    };

    sync();
    media.addEventListener('change', sync);
    return () => {
      media.removeEventListener('change', sync);
      lenis?.destroy();
    };
  }, []);

  return null;
}
