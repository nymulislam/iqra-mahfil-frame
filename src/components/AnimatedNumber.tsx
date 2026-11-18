'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function AnimatedNumber({
  value,
  className = '',
}: {
  value: number;
  className?: string;
}) {
  const { lang } = useLanguage();
  const [current, setCurrent] = useState<number>(0);
  const fromRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = fromRef.current;
    const target = value;
    const duration = 1200; // ms
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(start + (target - start) * ease);

      setCurrent(val);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(update);
      } else {
        fromRef.current = target;
        setCurrent(target);
      }
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  const toBanglaNum = (n: number) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(n)
      .split('')
      .map((d) => bnDigits[parseInt(d, 10)] || d)
      .join('');
  };

  const formatted =
    lang === 'bn'
      ? toBanglaNum(current).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : current.toLocaleString();

  return <span className={className} suppressHydrationWarning>{formatted}</span>;
}
