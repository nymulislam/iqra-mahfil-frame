'use client';

import { useEffect, useRef, useState } from 'react';

const SOURCES = ['/assets/frames/frame-1.png?v=3', '/assets/frames/frame-2.png?v=3'];

export function useFrameTemplates(enabled = true) {
  const templates = useRef<(HTMLImageElement | null)[]>([null, null]);
  const [status, setStatus] = useState<('loading' | 'ready' | 'error')[]>(['loading', 'loading']);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const images = SOURCES.map((src, index) => {
      if (templates.current[index]) return null;
      setStatus(current => current.map((value, i) => i === index ? 'loading' : value));
      const image = new Image();
      image.onload = () => {
        if (!active) return;
        templates.current[index] = image;
        setStatus(current => current.map((value, i) => i === index ? 'ready' : value));
      };
      image.onerror = () => {
        if (active) setStatus(current => current.map((value, i) => i === index ? 'error' : value));
      };
      image.src = src;
      return image;
    });
    return () => {
      active = false;
      images.forEach(image => {
        if (image) image.onload = image.onerror = null;
      });
    };
  }, [enabled, attempt]);

  return { templates, status, retry: () => setAttempt(value => value + 1) };
}
