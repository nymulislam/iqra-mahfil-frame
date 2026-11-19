'use client';

import React from 'react';
import { MotionConfig, LazyMotion, domMax } from 'motion/react';
import { LanguageProvider } from '@/context/LanguageContext';
import { LiveTrackingProvider } from '@/context/LiveTrackingContext';
import { FrameModalProvider } from '@/context/FrameModalContext';
import { SmoothScrollProvider } from './SmoothScroll';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domMax} strict>
        <SmoothScrollProvider>
          <LanguageProvider>
            <LiveTrackingProvider>
              <FrameModalProvider>
                {children}
              </FrameModalProvider>
            </LiveTrackingProvider>
          </LanguageProvider>
        </SmoothScrollProvider>
      </LazyMotion>
    </MotionConfig>
  );
}
