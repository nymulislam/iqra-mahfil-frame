'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { formatNumber } from '@/lib/numbers';

export function AnimatedNumber({ value, className = '' }: { value: number | null; className?: string }) {
  const { lang } = useLanguage();
  return <span className={`tabular-nums ${className}`}>{formatNumber(value, lang)}</span>;
}
