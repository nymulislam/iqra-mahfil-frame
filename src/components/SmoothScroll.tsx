'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

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
            anchors: { offset: -70 },
            lerp: 0.16,
            smoothWheel: true,
            syncTouch: false,
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
