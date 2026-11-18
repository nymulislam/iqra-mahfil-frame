'use client';

import React, { createContext, useContext, useEffect } from 'react';

export type ThemeType = 'iqra-blue';

export interface ThemeConfig {
  id: ThemeType;
  name: { bn: string; en: string };
  badge: string;
  icon: string;
  description: { bn: string; en: string };
  colorsPreview: string[];
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'iqra-blue',
    name: { bn: 'লোগো রয়্যাল ব্লু ও সায়ান', en: 'Logo Royal Blue & Cyan' },
    badge: 'অফিসিয়াল লোগো',
    icon: '🔷',
    description: {
      bn: 'ইক্বরা মাদরাসার অফিসিয়াল লোগো ও পোস্টারের রাজকীয় রয়্যাল ব্লু, স্কাই সায়ান ও ক্রিমসন',
      en: 'Official Iqra Madrasah logo & poster palette: Royal Blue, Sky Cyan & Crimson',
    },
    colorsPreview: ['#026cb6', '#0ea5e9', '#0284c7', '#ffffff'],
  },
];

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  cycleTheme: () => void;
  currentThemeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'iqra-blue',
  setTheme: () => {},
  cycleTheme: () => {},
  currentThemeConfig: THEMES[0],
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      // Clear any legacy theme from localStorage to strictly maintain the official logo theme
      localStorage.removeItem('iqra_mahfil_theme');
      document.documentElement.setAttribute('data-theme', 'iqra-blue');
    } catch {
      // ignore
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: 'iqra-blue',
        setTheme: () => {},
        cycleTheme: () => {},
        currentThemeConfig: THEMES[0],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
