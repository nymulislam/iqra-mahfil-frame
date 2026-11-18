'use client';

import { useEffect, useRef } from 'react';
import { PHOTO_BOUNDS } from './frameDraw';

interface GestureOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  hasPhoto: boolean;
  zoom: number;
  offsetX: number;
  offsetY: number;
  onUpdate: (updates: { zoom?: number; offsetX?: number; offsetY?: number }) => void;
  onPhotoClick?: () => void;
}

export function useFrameGestures(options: GestureOptions) {
  const latest = useRef(options);
  latest.current = options;
  const { canvasRef } = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pointers = new Map<number, { x: number; y: number }>();
    let baseline = { x: 0, y: 0, offsetX: 0, offsetY: 0, distance: 0, zoom: 1 };
    let moved = false;
    const insidePhoto = (x: number, y: number) => {
      const r = canvas.getBoundingClientRect();
      const px = (x - r.left) * canvas.width / r.width;
      const py = (y - r.top) * canvas.height / r.height;
      return px >= PHOTO_BOUNDS.x && px <= PHOTO_BOUNDS.x + PHOTO_BOUNDS.w
        && py >= PHOTO_BOUNDS.y && py <= PHOTO_BOUNDS.y + PHOTO_BOUNDS.h;
    };
    const rebase = () => {
      const points = [...pointers.values()];
      if (!points.length) return;
      const state = latest.current;
      baseline = { x: points[0].x, y: points[0].y, offsetX: state.offsetX, offsetY: state.offsetY,
        zoom: state.zoom, distance: points.length === 2
          ? Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) : 0 };
    };
    const down = (event: PointerEvent) => {
      if (event.button !== 0 || (!pointers.size && !insidePhoto(event.clientX, event.clientY))) return;
      if (!pointers.size) moved = false;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      canvas.setPointerCapture(event.pointerId);
      if (pointers.size > 1) moved = true;
      rebase();
    };
    const move = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId) || !latest.current.hasPhoto) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const points = [...pointers.values()];
      if (points.length === 2 && baseline.distance > 0) {
        const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
        latest.current.onUpdate({ zoom: Math.max(0.5, Math.min(3, baseline.zoom * distance / baseline.distance)) });
        return;
      }
      if (points.length !== 1) return;
      const dx = event.clientX - baseline.x;
      const dy = event.clientY - baseline.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      const r = canvas.getBoundingClientRect();
      latest.current.onUpdate({ offsetX: baseline.offsetX + dx * canvas.width / r.width,
        offsetY: baseline.offsetY + dy * canvas.height / r.height });
    };
    const up = (event: PointerEvent) => {
      if (!pointers.delete(event.pointerId)) return;
      if (event.type === 'pointerup' && !moved && !latest.current.hasPhoto) latest.current.onPhotoClick?.();
      rebase();
    };
    const wheel = (event: WheelEvent) => {
      if (!latest.current.hasPhoto || !insidePhoto(event.clientX, event.clientY)) return;
      event.preventDefault();
      latest.current.onUpdate({ zoom: Math.max(0.5, Math.min(3, latest.current.zoom - event.deltaY * 0.002)) });
    };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('lostpointercapture', up);
    canvas.addEventListener('wheel', wheel, { passive: false });
    return () => {
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('lostpointercapture', up);
      canvas.removeEventListener('wheel', wheel);
    };
  }, [canvasRef]);
}
