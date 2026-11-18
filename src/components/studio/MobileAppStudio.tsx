'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useFrameModal } from '@/context/FrameModalContext';
import { useLiveTracking } from '@/context/LiveTrackingContext';
import { SITE } from '@/content/site';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PHOTO_BOUNDS,
  TEXT_BOX,
  FrameStudioState,
  renderFrame,
} from './frameDraw';
import './mobileApp.css';

const TITLES = [
  'ছাত্র',
  'শিক্ষক',
  'হাফেজ',
  'মাওলানা',
  'অভিভাবক',
  'ব্যবসায়ী',
  'মুসল্লি',
  'প্রাক্তন ছাত্র',
];

const CAPTION =
  'ইনশাআল্লাহ, আমি আসছি! ৫ ডিসেম্বর ২০২৬, শনিবার বাদ যোহর — ইক্বরা ইন্টারন্যাশনাল মাদরাসার বার্ষিক তাফসীরুল কুরআন মাহফিল, মাদরাসা সংলগ্ন বালুর মাঠ, পাটওয়ারী বাজার, ফরিদগঞ্জ, চাঁদপুর। আপনি আসছেন তো?\n\nhttps://iqra.annujum.org';

const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('পাটওয়ারী বাজার, বালিথুবা, ফরিদগঞ্জ, চাঁদপুর, বাংলাদেশ');

const CALENDAR_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
  encodeURIComponent('তাফসীরুল কুরআন মাহফিল ২০২৬') +
  '&dates=20261205T070000Z/20261205T140000Z&location=' +
  encodeURIComponent('ইক্বরা ইন্টারন্যাশনাল মাদরাসা, পাটওয়ারী বাজার, ফরিদগঞ্জ, চাঁদপুর');

const bn = (num: number | string) =>
  String(num).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);

export function MobileAppStudio() {
  const { isFrameModalOpen, closeFrameModal } = useFrameModal();
  const { recordFrameCreated } = useLiveTracking();

  // Root & Canvas Refs
  const appRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const avatarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const templateImagesRef = useRef<(HTMLImageElement | null)[]>([null, null]);

  // Pointer state for touch gestures
  const pointersRef = useRef<Map<number, [number, number]>>(new Map());
  const pinchDistRef = useRef<number>(0);
  const movedRef = useRef<boolean>(false);

  // Editor State
  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');

  // UI Flow State
  const [activeSheet, setActiveSheet] = useState<'none' | 'info' | 'result' | 'poster'>('none');
  const [dialogState, setDialogState] = useState<'none' | 'contact' | 'delete' | 'prompt-photo'>('none');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isPosterZoomed, setIsPosterZoomed] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string | null>(null);
  const [showTip, setShowTip] = useState<boolean>(false);
  const [isZoomOn, setIsZoomOn] = useState<boolean>(false);
  const [countdownText, setCountdownText] = useState<string>('১৭ দিন বাকি');

  // Load Saved Name / Designation
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('iqra_name') || localStorage.getItem('nm') || '';
      const savedDes = localStorage.getItem('iqra_designation') || localStorage.getItem('ds') || '';
      if (savedName) setName(savedName);
      if (savedDes) setDesignation(savedDes);
    } catch {
      // ignore
    }
  }, []);

  const toast = useCallback((msg: string) => {
    setToastText(msg);
    setTimeout(() => {
      setToastText((curr) => (curr === msg ? null : curr));
    }, 2400);
  }, []);

  // Countdown Calculator matching live fx.js
  useEffect(() => {
    const target = new Date(2026, 11, 5, 14, 0, 0).getTime();
    const updateCountdown = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setCountdownText('মাহফিল সম্পন্ন');
        return;
      }
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (days > 1) {
        setCountdownText(`${bn(days)} দিন বাকি`);
      } else if (days === 1) {
        setCountdownText('আগামীকাল মাহফিল');
      } else {
        setCountdownText('আজ বাদ যোহর');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  // Background floating stars loop
  useEffect(() => {
    if (!isFrameModalOpen) return;
    const canvas = fxCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    const PAL = ['27,143,157', '63,196,212', '143,220,240', '169,235,220'];
    const stars: Array<{ x: number; y: number; r: number; v: number; a: number; w: number; c: string }> = [];
    for (let i = 0; i < 16; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: 6 + Math.random() * 12,
        v: 0.00005 + Math.random() * 0.00012,
        a: Math.random() * 6,
        w: (Math.random() - 0.5) * 0.01,
        c: PAL[Math.floor(Math.random() * PAL.length)],
      });
    }

    const drawStar = (r: number) => {
      ctx.beginPath();
      ctx.rect(-r / 2, -r / 2, r, r);
      ctx.rotate(Math.PI / 4);
      ctx.rect(-r / 2, -r / 2, r, r);
      ctx.fill();
    };

    const loop = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const s of stars) {
        s.y -= s.v * 16;
        s.a += s.w;
        if (s.y < -0.05) {
          s.y = 1.05;
          s.x = Math.random();
        }
        ctx.fillStyle = `rgba(${s.c},0.05)`;
        ctx.save();
        ctx.translate(s.x * window.innerWidth, s.y * window.innerHeight);
        ctx.rotate(s.a);
        drawStar(s.r);
        ctx.restore();
      }
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [isFrameModalOpen]);

  // Dynamic layout calculation for stage sizing matching layout.js
  const updateLayout = useCallback(() => {
    if (!stageRef.current || !appRef.current) return;
    const s = stageRef.current.getBoundingClientRect();
    if (!s.width || !s.height) return;
    const maxW = Math.floor(s.width - 12);
    const reservedH = isZoomOn && userImage ? 86 : 46;
    const maxH = Math.floor(s.height - reservedH);
    const M = Math.min(maxW, maxH, 480);
    appRef.current.style.setProperty('--M', `${Math.max(150, M)}px`);
  }, [isZoomOn, userImage]);

  useEffect(() => {
    if (!isFrameModalOpen) return;
    updateLayout();

    const observer = new ResizeObserver(updateLayout);
    if (stageRef.current) observer.observe(stageRef.current);

    const handleVisualViewport = () => {
      if (window.visualViewport && appRef.current) {
        const h = Math.round(window.visualViewport.height);
        document.documentElement.style.setProperty('--vh', `${h}px`);
        appRef.current.style.setProperty('--vh', `${h}px`);
        updateLayout();
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewport);
      window.visualViewport.addEventListener('scroll', handleVisualViewport);
      handleVisualViewport();
    }

    window.addEventListener('resize', updateLayout);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateLayout);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewport);
        window.visualViewport.removeEventListener('scroll', handleVisualViewport);
      }
    };
  }, [isFrameModalOpen, updateLayout]);

  // Draw main frame canvas
  const draw = useCallback(() => {
    if (!canvasRef.current) return;
    const currentState: FrameStudioState = {
      frameIndex,
      userImage,
      zoom,
      offsetX,
      offsetY,
      name,
      designation,
    };
    renderFrame(canvasRef.current, currentState, templateImagesRef.current);
  }, [frameIndex, userImage, zoom, offsetX, offsetY, name, designation]);

  // Preload new PNG frame templates (Frame 1: Royal Blue & Teal, Frame 2: Poster Theme)
  useEffect(() => {
    const f1 = new Image();
    f1.src = '/assets/frames/frame-1.png';
    f1.onload = () => {
      templateImagesRef.current[0] = f1;
      draw();
    };

    const f2 = new Image();
    f2.src = '/assets/frames/frame-2.png';
    f2.onload = () => {
      templateImagesRef.current[1] = f2;
      draw();
    };
  }, [draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Re-draw on visibility or focus return
  useEffect(() => {
    const handleVis = () => {
      if (!document.hidden) draw();
    };
    document.addEventListener('visibilitychange', handleVis);
    window.addEventListener('focus', handleVis);
    return () => {
      document.removeEventListener('visibilitychange', handleVis);
      window.removeEventListener('focus', handleVis);
    };
  }, [draw]);

  // Draw avatar circle in panel
  useEffect(() => {
    if (!avatarCanvasRef.current) return;
    const ctx = avatarCanvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 140, 140);
    if (userImage) {
      const s = Math.max(140 / userImage.width, 140 / userImage.height);
      ctx.drawImage(
        userImage,
        (140 - userImage.width * s) / 2,
        (140 - userImage.height * s) / 2,
        userImage.width * s,
        userImage.height * s
      );
    }
  }, [userImage]);

  const triggerBurst = () => {
    confetti({
      particleCount: 26,
      spread: 60,
      origin: { y: 0.45 },
      colors: ['#085d69', '#0d9488', '#0284c7', '#c8102e', '#3fe0f2'],
    });
  };

  // Image File Upload
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setUserImage(img);
        setZoom(1);
        setOffsetX(0);
        // Initial center with slight vertical offset matching photo.js
        const s = Math.max(PHOTO_BOUNDS.w / img.width, PHOTO_BOUNDS.h / img.height);
        const my = (img.height * s - PHOTO_BOUNDS.h) / 2;
        setOffsetY(Math.max(0, my) * 0.6);

        setIsZoomOn(true);
        setShowTip(true);
        setTimeout(() => setShowTip(false), 3500);
        triggerBurst();
        toast('ছবি শুধু আপনার ফোনেই থাকে, কোথাও আপলোড হয় না');
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Pointer Handlers on Canvas (1-finger pan, 2-finger pinch-to-zoom)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    movedRef.current = false;
    if (!userImage) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointersRef.current.size === 2) {
      const pts = [...pointersRef.current.values()];
      pinchDistRef.current = Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]) || 1;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pointersRef.current.has(e.pointerId) || !userImage) return;
    const oldPos = pointersRef.current.get(e.pointerId)!;
    pointersRef.current.set(e.pointerId, [e.clientX, e.clientY]);

    if (Math.abs(e.clientX - oldPos[0]) + Math.abs(e.clientY - oldPos[1]) > 4) {
      movedRef.current = true;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const k = CANVAS_WIDTH / canvas.getBoundingClientRect().width;

    if (pointersRef.current.size === 1) {
      const dx = (e.clientX - oldPos[0]) * k;
      const dy = (e.clientY - oldPos[1]) * k;
      setOffsetX((ox) => ox + dx);
      setOffsetY((oy) => oy + dy);
    } else if (pointersRef.current.size === 2) {
      const pts = [...pointersRef.current.values()];
      const dist = Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]) || 1;
      if (pinchDistRef.current) {
        setZoom((z) => Math.max(1, Math.min(3, (z * dist) / pinchDistRef.current)));
      }
      pinchDistRef.current = dist;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointersRef.current.delete(e.pointerId);
    pinchDistRef.current = 0;
    setTimeout(() => {
      movedRef.current = false;
    }, 120);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (!userImage) return;
    e.preventDefault();
    setZoom((z) => Math.max(1, Math.min(3, z - e.deltaY * 0.002)));
  };

  // Canvas Click: Name box -> #info-sheet, Photo window -> file picker
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const kX = CANVAS_WIDTH / rect.width;
    const kY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * kX;
    const y = (e.clientY - rect.top) * kY;

    // 1. Click on Name & Designation box
    const B = TEXT_BOX;
    if (x >= B.x - 25 && x <= B.x + B.w + 25 && y >= B.y - 25 && y <= B.y + B.h + 30) {
      setActiveSheet('info');
      return;
    }

    // 2. Click on Photo Window
    const R = PHOTO_BOUNDS;
    if (x >= R.x - 20 && x <= R.x + R.w + 20 && y >= R.y - 20 && y <= R.y + R.h + 20) {
      fileInputRef.current?.click();
      return;
    }

    // 3. If no photo, click anywhere on canvas opens file picker
    if (!userImage) {
      fileInputRef.current?.click();
    }
  };

  // Switch Frame Theme
  const handleSelectFrame = (index: number) => {
    setFrameIndex(index);
    triggerBurst();
    if (navigator.vibrate) navigator.vibrate(12);
  };

  const handleResetZoom = () => {
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    toast('জুম স্বাভাবিক (১x) করা হয়েছে');
  };

  const handleDeletePhotoConfirm = () => {
    setUserImage(null);
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setIsZoomOn(false);
    setDialogState('none');
    toast('ছবি মুছে ফেলা হয়েছে');
  };

  const handleSaveInfo = () => {
    try {
      localStorage.setItem('iqra_name', name);
      localStorage.setItem('nm', name);
      localStorage.setItem('iqra_designation', designation);
      localStorage.setItem('ds', designation);
    } catch {
      // ignore
    }
    setActiveSheet('none');
    if (name.trim() && designation.trim()) {
      triggerBurst();
      toast('তথ্য সংরক্ষিত হয়েছে');
    }
  };

  // Validation before Download/Share
  const validateReady = (): boolean => {
    if (!userImage) {
      setDialogState('prompt-photo');
      return false;
    }
    if (!name.trim()) {
      setActiveSheet('info');
      toast('অনুগ্রহ করে আপনার নাম লিখুন');
      return false;
    }
    if (!designation.trim()) {
      setActiveSheet('info');
      toast('অনুগ্রহ করে আপনার পদবী বা পরিচয় বাছুন');
      return false;
    }
    return true;
  };

  // Render Double Resolution Frame (2160x2156)
  const renderDoubleResBlob = async (): Promise<Blob | null> => {
    const c = document.createElement('canvas');
    c.width = CANVAS_WIDTH * 2;
    c.height = CANVAS_HEIGHT * 2;
    const ctx = c.getContext('2d');
    if (!ctx) return null;

    ctx.save();
    ctx.scale(2, 2);
    renderFrame(
      c,
      {
        frameIndex,
        userImage,
        zoom,
        offsetX,
        offsetY,
        name,
        designation,
      },
      templateImagesRef.current
    );
    ctx.restore();

    return new Promise((resolve) => {
      c.toBlob((blob) => resolve(blob), 'image/png', 0.95);
    });
  };

  const handleDownloadClick = async () => {
    if (!validateReady()) return;
    const blob = await renderDoubleResBlob();
    if (!blob) return;

    if (resultUrl) URL.revokeObjectURL(resultUrl);
    const url = URL.createObjectURL(blob);
    setResultBlob(blob);
    setResultUrl(url);
    setActiveSheet('result');
    triggerBurst();
    recordFrameCreated();
    if (navigator.vibrate) navigator.vibrate([12, 40, 12]);
  };

  const handleDirectDownload = () => {
    if (!resultBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(resultBlob);
    a.download = `iqra-mahfil-2026-frame-${frameIndex + 1}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast('ডাউনলোড শুরু হয়েছে');
  };

  const handleShareClick = async () => {
    if (!validateReady()) return;
    const blob = resultBlob || (await renderDoubleResBlob());
    if (!blob) return;

    const file = new File([blob], `iqra-mahfil-2026-frame-${frameIndex + 1}.png`, {
      type: 'image/png',
    });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          text: CAPTION,
        });
        recordFrameCreated();
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          handleFallbackShare();
        }
      }
    } else {
      handleFallbackShare();
    }
  };

  const handleFallbackShare = async () => {
    try {
      await navigator.clipboard.writeText(CAPTION);
      toast('টেক্সট কপি হয়েছে — ছবি ডাউনলোড করে শেয়ার করুন');
    } catch {
      toast('ছবি ডাউনলোড করে শেয়ার করুন');
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(CAPTION);
      toast('ক্যাপশন কপি হয়েছে — পোস্টে পেস্ট করুন');
    } catch {
      toast('কপি করা যায়নি');
    }
  };

  if (!isFrameModalOpen) return null;

  const isFormComplete = !!(userImage && name.trim() && designation.trim());

  return (
    <div
      ref={appRef}
      className={`mobile-frame-app ${frameIndex === 1 ? 'theme-frame-1' : ''}`}
      id="app"
    >
      {/* SVG Symbols definition matching live site */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <symbol id="i-cam" viewBox="0 0 24 24">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" />
            <circle cx="12" cy="13" r="3.2" />
          </symbol>
          <symbol id="i-user" viewBox="0 0 24 24">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </symbol>
          <symbol id="i-badge" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <circle cx="9" cy="11" r="2" />
            <path d="M15 9h3M15 13h3M6 17c.6-1.6 1.8-2 3-2s2.4.4 3 2" />
          </symbol>
          <symbol id="i-dl" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </symbol>
          <symbol id="i-sh" viewBox="0 0 24 24">
            <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13" />
          </symbol>
          <symbol id="i-ph" viewBox="0 0 24 24">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
          </symbol>
          <symbol id="i-img" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="3.5" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
          </symbol>
          <symbol id="i-tr" viewBox="0 0 24 24">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
          </symbol>
          <symbol id="i-ok" viewBox="0 0 24 24">
            <path d="M20 6 9 17l-5-5" />
          </symbol>
          <symbol id="i-x" viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" />
          </symbol>
          <symbol id="i-cp" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2.5" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </symbol>
          <symbol id="i-clock" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 15 15" />
          </symbol>
          <symbol id="i-edit" viewBox="0 0 24 24">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </symbol>
          <symbol id="i-st" viewBox="0 0 24 24">
            <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />
          </symbol>
          <symbol id="i-pin" viewBox="0 0 24 24">
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
            <circle cx="12" cy="10" r="3" />
          </symbol>
          <symbol id="i-cal" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="3" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </symbol>
          <symbol id="i-fb" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </symbol>
          <symbol id="i-wa" viewBox="0 0 24 24">
            <path d="M3 21l1.7-5A9 9 0 1 1 8 19.3z" />
            <path d="M9 9.5c.3 1.6 1.9 3.3 3.5 3.8l1-1.1 1.9.9v1.3c-3.5.6-8-3.5-7.4-7.2h1.3l.9 1.9z" />
          </symbol>
          <symbol id="i-code" viewBox="0 0 24 24">
            <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
          </symbol>
          <symbol id="i-gh" viewBox="0 0 24 24">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1-.3-3 1-2.6-.5-5.4-.5-8 0-2-1.3-3-1-3-1-.28 1.15-.28 2.35 0 3.5a5.4 5.4 0 0 0-1 3.5c0 3.5 3 5.5 6 5.5a4.8 4.8 0 0 0-1 3.5v4" />
            <path d="M9 18c-4.5 1.5-5-2.5-7-3" />
          </symbol>
        </defs>
      </svg>

      {/* Floating Stars Background */}
      <canvas id="fx" ref={fxCanvasRef} />
      <canvas id="fb" />

      {/* Top Brand Navbar matching website brand header */}
      <div className="bar">
        <div className="logo" title={SITE.name.bn}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SITE.logo} alt="ইক্বরা লোগো" className="logo-img" />
        </div>
        <div className="tt">
          <div className="tt-brand">
            <span className="t-dark">ইক্বরা</span>
            <span className="t-accent">ইন্টারন্যাশনাল</span>
            <span className="t-dark">মাদরাসা</span>
          </div>
          <div className="sub-row">
            <span className="sub-date">৫ ডিসেম্বর · বাদ যোহর</span>
            <span className="cd-box" id="sub">
              <svg className="ic cd-ic">
                <use href="#i-clock" />
              </svg>
              <span id="cd-txt">
                <b>{countdownText.split(' ')[0]}</b> {countdownText.split(' ').slice(1).join(' ')}
              </span>
            </span>
          </div>
        </div>
        <div className="nv">
          <button
            type="button"
            className="ib"
            id="np"
            aria-label="পোস্টার"
            title="মাহফিলের পোস্টার"
            onClick={() => setActiveSheet('poster')}
          >
            <svg className="ic">
              <use href="#i-img" />
            </svg>
          </button>
          <button
            type="button"
            className="ib ib-call"
            id="nc"
            aria-label="যোগাযোগ"
            title="যোগাযোগ ও হেল্পলাইন"
            onClick={() => setDialogState('contact')}
          >
            <svg className="ic">
              <use href="#i-ph" />
            </svg>
            <span className="pulse-dot" />
          </button>
          <button
            type="button"
            className="ib"
            id="app-close"
            aria-label="বন্ধ করুন"
            onClick={closeFrameModal}
            title="সাইটে ফিরুন"
          >
            <svg className="ic">
              <use href="#i-x" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stage Area */}
      <div className="stage" id="stage" ref={stageRef}>
        <div className={`tip ${showTip ? 'on' : ''}`} id="tip">
          টেনে সরান · দুই আঙুলে জুম করুন
        </div>

        <div className="frame-wrap" id="fwrap">
          <canvas
            className="fc"
            id="c0"
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={handleCanvasClick}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
          />
        </div>

        {/* Frame Tabs */}
        <div className="frame-tabs" id="ftabs">
          <button
            type="button"
            className={`ftab tab-1 ${frameIndex === 0 ? 'on' : ''}`}
            id="tab0"
            onClick={() => handleSelectFrame(0)}
          >
            <span className="tab-dot dot-1" />🔷 ফ্রেম ১ (রয়েল ব্লু)
          </button>
          <button
            type="button"
            className={`ftab tab-2 ${frameIndex === 1 ? 'on' : ''}`}
            id="tab1"
            onClick={() => handleSelectFrame(1)}
          >
            <span className="tab-dot dot-2" />💠 ফ্রেম ২ (পোস্টার থিম)
          </button>
        </div>

        {/* Zoom Slider Row */}
        {isZoomOn && userImage && (
          <div className="zr on" id="zr">
            <button
              type="button"
              className="zr-lbl-btn"
              id="zm-reset"
              onClick={handleResetZoom}
              title="স্বাভাবিক আকারে ফিরতে ট্যাপ করুন"
            >
              জুম:
            </button>
            <input
              type="range"
              id="zm"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              aria-label="ছবি বড়-ছোট"
            />
            <span className="zr-sep" />
            <button
              type="button"
              className="zr-del"
              id="rst"
              onClick={() => setDialogState('delete')}
              aria-label="ছবি মুছুন"
              title="ছবি মুছে ফেলুন"
            >
              <svg className="ic">
                <use href="#i-tr" />
              </svg>
              <span>মুছুন</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Panel */}
      <div className="panel">
        <div className="action-card">
          {/* Avatar Clicker */}
          <label
            className={`av ${userImage ? 'has' : ''}`}
            id="pick"
            htmlFor="app-file"
            aria-label="ছবি বাছুন"
            onClick={() => fileInputRef.current?.click()}
          >
            <canvas id="av" ref={avatarCanvasRef} width="140" height="140" />
            <div className="av-empty">
              <svg className="ic">
                <use href="#i-cam" />
              </svg>
              <span>ছবি দিন</span>
            </div>
            <i className="av-edit">
              <svg className="ic">
                <use href="#i-cam" />
              </svg>
            </i>
          </label>

          {/* Info Trigger Card */}
          <div
            className={`info-trigger ${name.trim() && designation.trim() ? 'ok' : ''}`}
            id="open-info"
            role="button"
            tabIndex={0}
            aria-label="নাম ও পদবী পরিবর্তন করুন"
            onClick={() => setActiveSheet('info')}
          >
            <div className="info-text">
              <div className="info-nm-row">
                <svg className="ic ic-sm">
                  <use href="#i-user" />
                </svg>
                <b id="prev-nm">{name.trim() ? name : 'আপনার নাম লিখুন'}</b>
              </div>
              <div className="info-ds-row">
                <svg className="ic ic-sm">
                  <use href="#i-badge" />
                </svg>
                <span id="prev-ds">{designation.trim() ? designation : 'পদবী / পরিচয় দিন'}</span>
              </div>
            </div>
            <div className="edit-pill">
              <svg className="ic">
                <use href="#i-edit" />
              </svg>
              <span>লিখুন</span>
            </div>
          </div>
        </div>

        {/* Hidden Native File Input */}
        <input
          type="file"
          id="app-file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handlePhotoSelect}
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', left: -9 }}
        />

        {/* Main Action Buttons */}
        <div className="row">
          <button
            type="button"
            className={`btn ${!isFormComplete ? 'dim' : ''}`}
            id="dl"
            onClick={handleDownloadClick}
          >
            <svg className="ic">
              <use href="#i-dl" />
            </svg>
            ডাউনলোড
          </button>
          <button
            type="button"
            className={`btn warm ${!isFormComplete ? 'dim' : ''}`}
            id="sh"
            onClick={handleShareClick}
          >
            <svg className="ic">
              <use href="#i-sh" />
            </svg>
            শেয়ার
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          BOTTOM SHEET 1: Info Sheet (নাম ও পদবী দিন)
          ------------------------------------------------------------------------- */}
      <div className={`sheet ${activeSheet === 'info' ? 'on' : ''}`} id="info-sheet">
        <div className="shc">
          <div className="sh">
            <button
              type="button"
              className="ib"
              id="info-cl"
              aria-label="বন্ধ"
              onClick={() => setActiveSheet('none')}
            >
              <svg className="ic">
                <use href="#i-x" />
              </svg>
            </button>
            <b>নাম ও পদবী দিন</b>
            <button
              type="button"
              className="btn-text-done"
              id="info-done-top"
              onClick={handleSaveInfo}
            >
              <svg className="ic ic-xs">
                <use href="#i-ok" />
              </svg>
              সম্পন্ন
            </button>
          </div>
          <div className="sc pad">
            <div className={`f ${name.trim() ? 'ok' : ''}`} id="fn">
              <svg className="ic">
                <use href="#i-user" />
              </svg>
              <input
                id="nm"
                type="text"
                maxLength={40}
                placeholder="আপনার পুরো নাম লিখুন"
                autoComplete="name"
                enterKeyHint="next"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    document.getElementById('ds')?.focus();
                  }
                }}
              />
            </div>
            <div className={`f ${designation.trim() ? 'ok' : ''}`} id="fd" style={{ marginTop: 12 }}>
              <svg className="ic">
                <use href="#i-badge" />
              </svg>
              <input
                id="ds"
                type="text"
                maxLength={46}
                placeholder="পদবী বা পরিচয় (বা নিচে বাছুন)"
                autoComplete="off"
                enterKeyHint="done"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSaveInfo();
                  }
                }}
              />
            </div>
            <div className="chips-title">দ্রুত পদবী নির্বাচন করুন:</div>
            <div className="chips on" id="chips">
              {TITLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  className={designation === role ? 'sel' : ''}
                  onClick={() => setDesignation(role)}
                >
                  {role}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn"
              id="info-done-btn"
              style={{ width: '100%', marginTop: 16 }}
              onClick={handleSaveInfo}
            >
              <svg className="ic">
                <use href="#i-ok" />
              </svg>
              তথ্য সেভ করুন
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          BOTTOM SHEET 2: Result Sheet (আপনার ফ্রেম তৈরি হয়েছে)
          ------------------------------------------------------------------------- */}
      <div className={`sheet ${activeSheet === 'result' ? 'on' : ''}`} id="rs">
        <div className="shc">
          <div className="sh">
            <button
              type="button"
              className="ib"
              id="rcl"
              aria-label="বন্ধ"
              onClick={() => setActiveSheet('none')}
            >
              <svg className="ic">
                <use href="#i-x" />
              </svg>
            </button>
            <b>আপনার ফ্রেম তৈরি হয়েছে</b>
          </div>
          <div className="sc">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {resultUrl && <img id="rimg" src={resultUrl} alt="আপনার ফটো ফ্রেম" />}
            <p className="hint">ছবিতে চেপে ধরে সেভ করলেও গ্যালারিতে যাবে</p>
            <div className="iab on" id="iab">
              ফেসবুক/মেসেঞ্জারের ব্রাউজারে সেভ বাটন কাজ নাও করতে পারে। ছবিতে চেপে ধরে সেভ করুন, অথবা উপরের ⋮ মেনু থেকে “ব্রাউজারে খুলুন” চাপুন।
            </div>
            <div className="row" style={{ marginTop: 12 }}>
              <button type="button" className="btn" id="rsv" onClick={handleDirectDownload}>
                <svg className="ic">
                  <use href="#i-dl" />
                </svg>
                সেভ
              </button>
              <button type="button" className="btn warm" id="rsh" onClick={handleShareClick}>
                <svg className="ic">
                  <use href="#i-sh" />
                </svg>
                শেয়ার
              </button>
            </div>
            <button
              type="button"
              className="btn ghost"
              id="rcp"
              style={{ width: '100%', marginTop: 9 }}
              onClick={handleCopyCaption}
            >
              <svg className="ic">
                <use href="#i-cp" />
              </svg>
              ক্যাপশন কপি
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          BOTTOM SHEET 3: Poster Sheet (মাহফিলের পোস্টার)
          ------------------------------------------------------------------------- */}
      <div className={`sheet ${activeSheet === 'poster' ? 'on' : ''}`} id="ps">
        <div className="shc">
          <div className="sh">
            <button
              type="button"
              className="ib"
              id="pcl"
              aria-label="বন্ধ"
              onClick={() => setActiveSheet('none')}
            >
              <svg className="ic">
                <use href="#i-x" />
              </svg>
            </button>
            <b>মাহফিলের পোস্টার</b>
            <a
              href="/assets/poster.jpg"
              download="iqra-mahfil-2026-poster.jpg"
              className="ib"
              id="pd"
              aria-label="ডাউনলোড"
            >
              <svg className="ic">
                <use href="#i-dl" />
              </svg>
            </a>
            <button
              type="button"
              className="ib"
              id="psh"
              aria-label="শেয়ার"
              onClick={async () => {
                try {
                  const res = await fetch('/assets/poster.jpg');
                  const blob = await res.blob();
                  const file = new File([blob], 'iqra-mahfil-2026-poster.jpg', { type: 'image/jpeg' });
                  if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({ files: [file], text: CAPTION });
                  } else {
                    handleFallbackShare();
                  }
                } catch {
                  handleFallbackShare();
                }
              }}
            >
              <svg className="ic">
                <use href="#i-sh" />
              </svg>
            </button>
          </div>
          <div className="sc">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              id="pm"
              src="/assets/poster.jpg"
              alt="মাহফিলের পোস্টার"
              className={isPosterZoomed ? 'zoom' : ''}
              onClick={() => setIsPosterZoomed((z) => !z)}
            />
            <p className="hint">ছোট লেখা পড়তে পোস্টারে ট্যাপ করে জুম করুন</p>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          POPUP DIALOG 4: Overlays & Modals (#ov)
          ------------------------------------------------------------------------- */}
      <div
        className={`ov ${dialogState !== 'none' ? 'on' : ''}`}
        id="ov"
        onClick={(e) => {
          if ((e.target as HTMLElement).id === 'ov') setDialogState('none');
        }}
      >
        {dialogState === 'contact' && (
          <div className="dg" id="dg">
            <div className="dic">
              <svg className="ic">
                <use href="#i-ph" />
              </svg>
            </div>
            <h3 id="dt">যোগাযোগ</h3>
            <p id="dp">প্রয়োজনে সরাসরি কল বা আর্থিক সহযোগিতা পাঠাতে পারেন</p>
            <div className="contact-box">
              <div className="contact-num-row">
                <div className="contact-phone">01797-091817</div>
                <div className="contact-pay">
                  <span className="pay bk">বিকাশ</span>
                  <span className="pay ng">নগদ</span>
                  <span className="pay-sub">পার্সোনাল</span>
                </div>
              </div>
              <div className="contact-grid">
                <a
                  className="fbk"
                  href="https://www.facebook.com/iqramadrasah25"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="ic">
                    <use href="#i-fb" />
                  </svg>
                  <span>ফেসবুক পেজ</span>
                </a>
                <a
                  className="fbk"
                  href={MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="ic">
                    <use href="#i-pin" />
                  </svg>
                  <span>গুগল ম্যাপ</span>
                </a>
                <a
                  className="fbk"
                  href={CALENDAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="ic">
                    <use href="#i-cal" />
                  </svg>
                  <span>ক্যালেন্ডার</span>
                </a>
                <a
                  className="fbk"
                  href="https://wa.me/8801797091817"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="ic">
                    <use href="#i-wa" />
                  </svg>
                  <span>হোয়াটসঅ্যাপ</span>
                </a>
              </div>
            </div>
            <div className="dx">
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  try {
                    navigator.clipboard.writeText('01797091817');
                    toast('নম্বর কপি হয়েছে');
                  } catch {
                    // ignore
                  }
                  setDialogState('none');
                }}
              >
                <svg className="ic">
                  <use href="#i-cp" />
                </svg>
                কপি
              </button>
              <a href="tel:01797091817" className="btn" onClick={() => setDialogState('none')}>
                <svg className="ic">
                  <use href="#i-ph" />
                </svg>
                কল করুন
              </a>
            </div>
            <div className="dev">
              <svg className="ic">
                <use href="#i-code" />
              </svg>
              <span>
                Made by <b>NAYMUL ISLAM</b>
              </span>
              <a
                href={
                  'https://wa.me/8801822667737?text=' +
                  encodeURIComponent(
                    'আসসালামু আলাইকুম, ইক্বরা মাহফিল ২০২৬ ফটো ফ্রেম ওয়েবসাইটটি দেখলাম। আপনার সাথে কথা বলতে চাই।'
                  )
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <svg className="ic">
                  <use href="#i-wa" />
                </svg>
              </a>
              <a
                href="https://github.com/nymulislam"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <svg className="ic">
                  <use href="#i-gh" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {dialogState === 'delete' && (
          <div className="dg" id="dg">
            <div className="dic warm">
              <svg className="ic">
                <use href="#i-tr" />
              </svg>
            </div>
            <h3 id="dt">ছবি মুছে ফেলবেন?</h3>
            <p id="dp">ফ্রেম থেকে আপনার ছবি সরে যাবে। চাইলে আবার নতুন ছবি দিতে পারবেন।</p>
            <div className="dx">
              <button
                type="button"
                className="btn ghost"
                onClick={() => setDialogState('none')}
              >
                থাক
              </button>
              <button
                type="button"
                className="btn warm"
                onClick={handleDeletePhotoConfirm}
              >
                মুছুন
              </button>
            </div>
          </div>
        )}

        {dialogState === 'prompt-photo' && (
          <div className="dg" id="dg">
            <div className="dic warm">
              <svg className="ic">
                <use href="#i-cam" />
              </svg>
            </div>
            <h3 id="dt">ছবি যোগ করুন</h3>
            <p id="dp">ফ্রেমে বসানোর জন্য আপনার একটি ছবি বেছে নিন।</p>
            <div className="dx">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setDialogState('none');
                  fileInputRef.current?.click();
                }}
              >
                ছবি বাছুন
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification identical to live site */}
      <div className={`toast ${toastText ? 'on' : ''}`} id="ts">
        {toastText}
      </div>
    </div>
  );
}
