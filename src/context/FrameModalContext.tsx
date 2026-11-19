'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useScrollLock } from '@/components/SmoothScroll';

interface FrameModalContextType {
  isFrameModalOpen: boolean;
  openFrameModal: () => void;
  closeFrameModal: () => void;
  toggleFrameModal: () => void;
}

const FrameModalContext = createContext<FrameModalContextType>({
  isFrameModalOpen: false,
  openFrameModal: () => {},
  closeFrameModal: () => {},
  toggleFrameModal: () => {},
});

export function FrameModalProvider({ children }: { children: React.ReactNode }) {
  const [isFrameModalOpen, setIsFrameModalOpen] = useState(false);

  const openFrameModal = useCallback(() => {
    setIsFrameModalOpen(true);
  }, []);

  const closeFrameModal = useCallback(() => {
    setIsFrameModalOpen(false);
  }, []);

  const toggleFrameModal = useCallback(() => {
    setIsFrameModalOpen((prev) => !prev);
  }, []);

  useScrollLock(isFrameModalOpen);

  return (
    <FrameModalContext.Provider
      value={{ isFrameModalOpen, openFrameModal, closeFrameModal, toggleFrameModal }}
    >
      {children}
    </FrameModalContext.Provider>
  );
}

export const useFrameModal = () => useContext(FrameModalContext);
