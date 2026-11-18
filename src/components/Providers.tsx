'use client';

import React from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { LiveTrackingProvider } from '@/context/LiveTrackingContext';
import { FrameModalProvider } from '@/context/FrameModalContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <LanguageProvider>
        <LiveTrackingProvider>
          <FrameModalProvider>
            {children}
          </FrameModalProvider>
        </LiveTrackingProvider>
      </LanguageProvider>
  );
}
