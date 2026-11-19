'use client';

import React from 'react';
import { m, useScroll, useSpring, useReducedMotion } from 'motion/react';
import { useFrameModal } from '@/context/FrameModalContext';

export function ScrollProgressBar() {
  const { isFrameModalOpen } = useFrameModal();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    restDelta: 0.001,
  });
  const reduceMotion = useReducedMotion();

  if (isFrameModalOpen) return null;

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX: reduceMotion ? scrollYProgress : smoothProgress }}
      className="fixed top-0 inset-x-0 z-[55] h-[2.5px] origin-left pointer-events-none bg-gradient-to-r from-sky-400 via-[var(--brand-primary)] to-[var(--brand-blue-ink)]"
    />
  );
}
