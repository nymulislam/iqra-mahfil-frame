'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isFrameModalOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isFrameModalOpen]);

  return (
    <FrameModalContext.Provider
      value={{ isFrameModalOpen, openFrameModal, closeFrameModal, toggleFrameModal }}
    >
      {children}
    </FrameModalContext.Provider>
  );
}

export const useFrameModal = () => useContext(FrameModalContext);
