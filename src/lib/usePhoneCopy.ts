'use client';

import { useEffect, useRef, useState } from 'react';
import { phoneDigits } from './phone';

export function usePhoneCopy() {
  const [status, setStatus] = useState<{ key: string; state: 'pending' | 'copied' | 'error' } | null>(null);
  const request = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    request.current += 1;
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copyPhone = async (phone: string, key: string) => {
    const current = ++request.current;
    if (timer.current) clearTimeout(timer.current);
    setStatus({ key, state: 'pending' });
    try {
      await navigator.clipboard.writeText(phoneDigits(phone));
      if (request.current !== current) return;
      setStatus({ key, state: 'copied' });
    } catch {
      if (request.current !== current) return;
      setStatus({ key, state: 'error' });
    }
    timer.current = setTimeout(() => setStatus(null), 4000);
  };

  return { status, copyPhone };
}
