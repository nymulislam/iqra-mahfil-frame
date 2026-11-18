'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/content/types';
import { I18N } from '@/content/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: typeof I18N;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'iqra_lang_preference';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>('bn');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved === 'bn' || saved === 'en') {
        setLangState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch {
      // ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === 'bn' ? 'en' : 'bn');
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t: I18N }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
