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

export function useFrameGestures({
  canvasRef,
  hasPhoto,
  zoom,
  offsetX,
  offsetY,
  onUpdate,
  onPhotoClick,
}: GestureOptions) {
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startOffsetRef = useRef({ x: 0, y: 0 });
  const initialPinchDistRef = useRef<number | null>(null);
  const initialZoomRef = useRef(zoom);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Helper to calculate canvas coordinates from client (pointer/touch)
    const getCanvasPoint = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    };

    const isInsidePhoto = (pt: { x: number; y: number }) => {
      const R = PHOTO_BOUNDS;
      return pt.x >= R.x && pt.x <= R.x + R.w && pt.y >= R.y && pt.y <= R.y + R.h;
    };

    // Touch Handlers
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const pt = getCanvasPoint(e.touches[0].clientX, e.touches[0].clientY);
        if (isInsidePhoto(pt)) {
          isDraggingRef.current = true;
          hasMovedRef.current = false;
          startPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          startOffsetRef.current = { x: offsetX, y: offsetY };
        }
      } else if (e.touches.length === 2 && hasPhoto) {
        isDraggingRef.current = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistRef.current = Math.hypot(dx, dy);
        initialZoomRef.current = zoom;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current && hasPhoto) {
        e.preventDefault();
        const dx = e.touches[0].clientX - startPosRef.current.x;
        const dy = e.touches[0].clientY - startPosRef.current.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          hasMovedRef.current = true;
        }

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        onUpdate({
          offsetX: startOffsetRef.current.x + dx * scaleX,
          offsetY: startOffsetRef.current.y + dy * scaleY,
        });
      } else if (e.touches.length === 2 && initialPinchDistRef.current && hasPhoto) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const scaleRatio = dist / initialPinchDistRef.current;
        const newZoom = Math.min(4, Math.max(0.5, initialZoomRef.current * scaleRatio));
        onUpdate({ zoom: Number(newZoom.toFixed(2)) });
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!hasMovedRef.current && isDraggingRef.current && !hasPhoto) {
        // Tapped on photo area without moving -> open photo selector
        onPhotoClick?.();
      }
      isDraggingRef.current = false;
      initialPinchDistRef.current = null;
    };

    // Mouse Handlers
    const onMouseDown = (e: MouseEvent) => {
      const pt = getCanvasPoint(e.clientX, e.clientY);
      if (isInsidePhoto(pt)) {
        isDraggingRef.current = true;
        hasMovedRef.current = false;
        startPosRef.current = { x: e.clientX, y: e.clientY };
        startOffsetRef.current = { x: offsetX, y: offsetY };
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current && hasPhoto) {
        e.preventDefault();
        const dx = e.clientX - startPosRef.current.x;
        const dy = e.clientY - startPosRef.current.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          hasMovedRef.current = true;
        }

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        onUpdate({
          offsetX: startOffsetRef.current.x + dx * scaleX,
          offsetY: startOffsetRef.current.y + dy * scaleY,
        });
      }
    };

    const onMouseUp = () => {
      if (!hasMovedRef.current && isDraggingRef.current && !hasPhoto) {
        onPhotoClick?.();
      }
      isDraggingRef.current = false;
    };

    // Wheel zoom
    const onWheel = (e: WheelEvent) => {
      const pt = getCanvasPoint(e.clientX, e.clientY);
      if (isInsidePhoto(pt) && hasPhoto) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.min(4, Math.max(0.5, zoom + delta));
        onUpdate({ zoom: Number(newZoom.toFixed(2)) });
      }
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [canvasRef, hasPhoto, zoom, offsetX, offsetY, onUpdate, onPhotoClick]);
}
