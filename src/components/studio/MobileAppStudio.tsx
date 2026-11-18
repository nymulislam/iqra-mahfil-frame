'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useFrameModal } from '@/context/FrameModalContext';
import { useLiveTracking } from '@/context/LiveTrackingContext';
import { MAHFIL } from '@/content/mahfil';
import { mahfilCalendarUrl } from '@/lib/calendar';
import { displayPhone, phoneHref } from '@/lib/phone';
import { usePhoneCopy } from '@/lib/usePhoneCopy';
import { useLanguage } from '@/context/LanguageContext';
import { studioText } from '@/content/studio';
import { formatNumber } from '@/lib/numbers';
import { SITE } from '@/content/site';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PHOTO_BOUNDS,
  TEXT_BOX,
  FrameStudioState,
  renderFrame,
} from './frameDraw';
import { useFrameTemplates } from './useFrameTemplates';
import { readPhoto, exportFrame, downloadBlob } from './frameExport';
import { OFFICIAL_POSTER, sharePoster } from '@/lib/poster';
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

const CAPTION_BN =
  'ইনশাআল্লাহ, আমি আসছি! ৫ ডিসেম্বর ২০২৬, শনিবার বাদ যোহর — ইক্বরা ইন্টারন্যাশনাল মাদরাসার বার্ষিক তাফসীরুল কুরআন মাহফিল, মাদরাসা সংলগ্ন বালুর মাঠ, পাটওয়ারী বাজার, ফরিদগঞ্জ, চাঁদপুর। আপনি আসছেন তো?\n\nhttps://iqra.annujum.org';

export function MobileAppStudio() {
  const { isFrameModalOpen, closeFrameModal } = useFrameModal();
  const { recordFrameCreated } = useLiveTracking();
  const { lang } = useLanguage();
  const text = (value: string) => studioText(value, lang);
  const caption = lang === 'bn' ? CAPTION_BN : 'InshaAllah, I am attending Iqra Mahfil on 5 December 2026, after Zohr, at the Madrasah Sand Field, Patwari Bazar, Faridganj, Chandpur. Join us!\n\nhttps://iqra.annujum.org';
  const { status: copyStatus, copyPhone } = usePhoneCopy();

  // Root & Canvas Refs
  const appRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const avatarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const { templates: templateImagesRef, status: templateStatus, retry: retryTemplates } = useFrameTemplates(isFrameModalOpen);
  const photoRequest = useRef(0);
  const exportInProgress = useRef(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSharingPoster, setIsSharingPoster] = useState(false);
  const [isReadingPhoto, setIsReadingPhoto] = useState(false);

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

  const snapshot = useMemo(() => ({ frameIndex, userImage, zoom, offsetX, offsetY, name, designation: studioText(designation, lang), language: lang }),
    [frameIndex, userImage, zoom, offsetX, offsetY, name, designation, lang]);
  const latestSnapshot = useRef<FrameStudioState | null>(snapshot);
  latestSnapshot.current = isFrameModalOpen ? snapshot : null;

  // UI Flow State
  const [activeSheet, setActiveSheet] = useState<'none' | 'info' | 'result' | 'poster'>('none');
  const [dialogState, setDialogState] = useState<'none' | 'contact' | 'delete' | 'prompt-photo'>('none');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isPosterZoomed, setIsPosterZoomed] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string | null>(null);
  const [showTip, setShowTip] = useState<boolean>(false);
  const [isZoomOn, setIsZoomOn] = useState<boolean>(false);
  const [countdownText, setCountdownText] = useState<string>('…');

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

  // Event times use Bangladesh time regardless of the visitor's timezone.
  useEffect(() => {
    const target = new Date(MAHFIL.dateISO).getTime();
    const updateCountdown = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setCountdownText(now < new Date(MAHFIL.endDateISO).getTime() ? (lang === 'bn' ? 'মাহফিল চলছে' : 'Event in progress') : (lang === 'bn' ? 'মাহফিল সম্পন্ন' : 'Event ended'));
        return;
      }
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (days > 1) {
        setCountdownText(lang === 'bn' ? `${formatNumber(days, lang)} দিন বাকি` : `${formatNumber(days, lang)} days remaining`);
      } else if (days === 1) {
        setCountdownText(lang === 'bn' ? '২৪ ঘণ্টার মধ্যে মাহফিল' : 'Event within 24 hours');
      } else {
        setCountdownText(lang === 'bn' ? 'আজ বাদ যোহর' : 'Today after Zohr');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [lang]);

  // Background floating stars loop
  useEffect(() => {
    if (!isFrameModalOpen || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
      designation: studioText(designation, lang),
      language: lang,
    };
    renderFrame(canvasRef.current, currentState, templateImagesRef.current);
  }, [frameIndex, userImage, zoom, offsetX, offsetY, name, designation, lang]);

  useEffect(() => {
    if (isFrameModalOpen) draw();
  }, [isFrameModalOpen, draw, templateStatus]);

  useEffect(() => {
    setResultBlob(null);
    setResultUrl(null);
  }, [snapshot]);

  useEffect(() => () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [resultUrl]);

  useEffect(() => () => { photoRequest.current += 1; }, []);

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
  }, [userImage, isFrameModalOpen]);

  const triggerBurst = () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    confetti({
      particleCount: 26,
      spread: 60,
      origin: { y: 0.45 },
      colors: ['#025ba9', '#014779', '#e0f2fe', '#026fba'],
    });
  };

  // Image File Upload
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const request = ++photoRequest.current;
    setIsReadingPhoto(true);
    try {
      const image = await readPhoto(file);
      if (photoRequest.current !== request) return;
      setUserImage(image);
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
      setIsZoomOn(true);
      setShowTip(true);
      setTimeout(() => setShowTip(false), 3500);
      toast(lang === 'bn' ? 'ছবি যুক্ত হয়েছে' : 'Photo added');
    } catch {
      if (photoRequest.current === request) toast(lang === 'bn'
        ? 'ছবিটি খোলা যায়নি। JPEG, PNG বা WebP ছবি বেছে নিন।'
        : 'Cannot open this photo. Choose a JPEG, PNG or WebP image.');
    } finally {
      if (photoRequest.current === request) setIsReadingPhoto(false);
    }
  };

  // Pointer Handlers on Canvas (1-finger pan, 2-finger pinch-to-zoom)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (pointersRef.current.size === 0) movedRef.current = false;
    if (!userImage) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointersRef.current.size === 2) {
      movedRef.current = true;
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
        const ratio = dist / pinchDistRef.current;
        setZoom(z => Math.max(1, Math.min(3, z * ratio)));
      }
      pinchDistRef.current = dist;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchDistRef.current = 0;
    setTimeout(() => {
      movedRef.current = false;
    }, 120);
  };

  useEffect(() => {
    if (!isFrameModalOpen) {
      pointersRef.current.clear();
      pinchDistRef.current = 0;
      movedRef.current = false;
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas || !userImage) return;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      setZoom(value => Math.max(1, Math.min(3, value - event.deltaY * 0.002)));
    };
    canvas.addEventListener('wheel', wheel, { passive: false });
    return () => canvas.removeEventListener('wheel', wheel);
  }, [isFrameModalOpen, userImage]);

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
    toast(text("জুম স্বাভাবিক (১x) করা হয়েছে"));
  };

  const handleDeletePhotoConfirm = () => {
    setUserImage(null);
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setIsZoomOn(false);
    setDialogState('none');
    toast(text("ছবি মুছে ফেলা হয়েছে"));
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
      toast(text("তথ্য সংরক্ষিত হয়েছে"));
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
      toast(text("অনুগ্রহ করে আপনার নাম লিখুন"));
      return false;
    }
    if (!designation.trim()) {
      setActiveSheet('info');
      toast(text("অনুগ্রহ করে আপনার পদবী বা পরিচয় বাছুন"));
      return false;
    }
    return true;
  };

  const prepareResult = async () => {
    const current = snapshot;
    const blob = resultBlob || await exportFrame(current, templateImagesRef.current, 2);
    if (latestSnapshot.current !== current) return null;
    if (!resultBlob) {
      recordFrameCreated();
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
    }
    return blob;
  };

  const handleDownloadClick = async () => {
    if (exportInProgress.current || isReadingPhoto || !validateReady()) return;
    exportInProgress.current = true;
    setIsPreparing(true);
    try {
      if (!await prepareResult()) return;
      setActiveSheet('result');
      triggerBurst();
    } catch {
      toast(lang === 'bn' ? 'ফ্রেম তৈরি করা যায়নি। আবার চেষ্টা করুন।' : 'Frame export failed. Please try again.');
    } finally {
      exportInProgress.current = false;
      setIsPreparing(false);
    }
  };

  const handleDirectDownload = () => {
    if (!resultBlob) return;
    downloadBlob(resultBlob, `iqra-mahfil-2026-frame-${frameIndex + 1}.png`);
    toast(lang === 'bn' ? 'ডাউনলোড শুরু হয়েছে। ছবিতে চেপে ধরেও সেভ করতে পারেন।' : 'Download started. You can also save the preview image.');
  };

  const handleShareClick = async () => {
    if (exportInProgress.current || isReadingPhoto || !validateReady()) return;
    exportInProgress.current = true;
    setIsPreparing(true);
    try {
      const blob = await prepareResult();
      if (!blob) return;
      const file = new File([blob], `iqra-mahfil-2026-frame-${frameIndex + 1}.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text: caption });
          return;
        } catch (error) {
          if ((error as Error).name === 'AbortError') return;
        }
      }
      setActiveSheet('result');
      toast(lang === 'bn' ? 'ছবিটি সেভ করে শেয়ার করুন। নিচে ক্যাপশন কপি করতে পারেন।' : 'Save the image to share it. You can copy the caption below.');
    } catch {
      toast(lang === 'bn' ? 'ফ্রেম তৈরি করা যায়নি। আবার চেষ্টা করুন।' : 'Frame export failed. Please try again.');
    } finally {
      exportInProgress.current = false;
      setIsPreparing(false);
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      toast(text("ক্যাপশন কপি হয়েছে — পোস্টে পেস্ট করুন"));
    } catch {
      toast(text("কপি করা যায়নি"));
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
          <img src={SITE.logo} alt={text("ইক্বরা লোগো")} className="logo-img" />
        </div>
        <div className="tt">
          <div className="tt-brand">
            <span className="t-dark">{text("ইক্বরা")}</span>
            <span className="t-accent">{text("ইন্টারন্যাশনাল")}</span>
            <span className="t-dark">{text("মাদরাসা")}</span>
          </div>
          <div className="sub-row">
            <span className="sub-date">{text("৫ ডিসেম্বর · বাদ যোহর")}</span>
          </div>
        </div>
        <div className="nv">
          <button
            type="button"
            className="ib ib-call"
            id="nc"
            aria-label={text("যোগাযোগ")}
            title={text("যোগাযোগ ও হেল্পলাইন")}
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
            aria-label={text("বন্ধ করুন")}
            onClick={closeFrameModal}
            title={text("সাইটে ফিরুন")}
          >
            <svg className="ic">
              <use href="#i-x" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stage Area */}
      <p role="status" className="text-sm text-center px-3">
        {isPreparing ? (lang === 'bn' ? 'ফ্রেম তৈরি হচ্ছে…' : 'Preparing frame…')
          : isReadingPhoto ? (lang === 'bn' ? 'ছবি খোলা হচ্ছে…' : 'Opening photo…')
          : templateStatus[frameIndex] === 'loading' ? (lang === 'bn' ? 'ফ্রেম লোড হচ্ছে…' : 'Loading frame…') : ''}
        {templateStatus[frameIndex] === 'error' && <button type="button" onClick={retryTemplates}>
          {lang === 'bn' ? 'ফ্রেম লোড হয়নি। আবার চেষ্টা করুন' : 'Frame failed to load. Retry'}
        </button>}
      </p>
      <div className="stage" id="stage" ref={stageRef}>
        <div className={`tip ${showTip ? 'on' : ''}`} id="tip">{text("টেনে সরান · দুই আঙুলে জুম করুন")}</div>

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
            onLostPointerCapture={handlePointerUp}
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
            <span className="tab-dot dot-1" />
            <span>{text("ফ্রেম ১")}</span>
          </button>
          <button
            type="button"
            className={`ftab tab-2 ${frameIndex === 1 ? 'on' : ''}`}
            id="tab1"
            onClick={() => handleSelectFrame(1)}
          >
            <span className="tab-dot dot-2" />
            <span>{text("ফ্রেম ২")}</span>
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
              title={text("স্বাভাবিক আকারে ফিরতে ট্যাপ করুন")}
            >{text("জুম:")}</button>
            <input
              type="range"
              id="zm"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              aria-label={text("ছবি বড়-ছোট")}
            />
            <span className="zr-sep" />
            <button
              type="button"
              className="zr-del"
              id="rst"
              onClick={() => setDialogState('delete')}
              aria-label={text("ছবি মুছুন")}
              title={text("ছবি মুছে ফেলুন")}
            >
              <svg className="ic">
                <use href="#i-tr" />
              </svg>
              <span>{text("মুছুন")}</span>
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
            aria-label={text("ছবি বাছুন")}
            onClick={() => fileInputRef.current?.click()}
          >
            <canvas id="av" ref={avatarCanvasRef} width="140" height="140" />
            <div className="av-empty">
              <svg className="ic">
                <use href="#i-cam" />
              </svg>
              <span>{text("ছবি দিন")}</span>
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
            aria-label={text("নাম ও পদবী পরিবর্তন করুন")}
            onClick={() => setActiveSheet('info')}
          >
            <div className="info-text">
              <div className="info-nm-row">
                <svg className="ic ic-sm">
                  <use href="#i-user" />
                </svg>
                <b id="prev-nm">{name.trim() ? name : text("আপনার নাম লিখুন")}</b>
              </div>
              <div className="info-ds-row">
                <svg className="ic ic-sm">
                  <use href="#i-badge" />
                </svg>
                <span id="prev-ds">{designation.trim() ? text(designation) : text("পদবী / পরিচয় দিন")}</span>
              </div>
            </div>
            <div className="edit-pill">
              <svg className="ic">
                <use href="#i-edit" />
              </svg>
              <span>{text("লিখুন")}</span>
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
            id="dl" disabled={isPreparing || isReadingPhoto || templateStatus[frameIndex] !== 'ready'}
            onClick={handleDownloadClick}
          >
            <svg className="ic">
              <use href="#i-dl" />
            </svg>{text("ডাউনলোড")}</button>
          <button
            type="button"
            className={`btn warm ${!isFormComplete ? 'dim' : ''}`}
            id="sh" disabled={isPreparing || isReadingPhoto || templateStatus[frameIndex] !== 'ready'}
            onClick={handleShareClick}
          >
            <svg className="ic">
              <use href="#i-sh" />
            </svg>{text("শেয়ার")}</button>
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
              aria-label={text("বন্ধ")}
              onClick={() => setActiveSheet('none')}
            >
              <svg className="ic">
                <use href="#i-x" />
              </svg>
            </button>
            <b>{text("নাম ও পদবী দিন")}</b>
            <button
              type="button"
              className="btn-text-done"
              id="info-done-top"
              onClick={handleSaveInfo}
            >
              <svg className="ic ic-xs">
                <use href="#i-ok" />
              </svg>{text("সম্পন্ন")}</button>
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
                placeholder={text("আপনার পুরো নাম লিখুন")}
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
                placeholder={text("পদবী বা পরিচয় (বা নিচে বাছুন)")}
                autoComplete="off"
                enterKeyHint="done"
                value={text(designation)}
                onChange={(e) => setDesignation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSaveInfo();
                  }
                }}
              />
            </div>
            <div className="chips-title">{text("দ্রুত পদবী নির্বাচন করুন:")}</div>
            <div className="chips on" id="chips">
              {TITLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  className={designation === role ? 'sel' : ''}
                  onClick={() => setDesignation(role)}
                >
                  {text(role)}
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
              </svg>{text("তথ্য সেভ করুন")}</button>
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
              aria-label={text("বন্ধ")}
              onClick={() => setActiveSheet('none')}
            >
              <svg className="ic">
                <use href="#i-x" />
              </svg>
            </button>
            <b>{text("আপনার ফ্রেম তৈরি হয়েছে")}</b>
          </div>
          <div className="sc">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {resultUrl && <img id="rimg" src={resultUrl} alt={text("আপনার ফটো ফ্রেম")} />}
            <p className="hint">{text("ছবিতে চেপে ধরে সেভ করলেও গ্যালারিতে যাবে")}</p>
            <div className="iab on" id="iab">{text("ফেসবুক/মেসেঞ্জারের ব্রাউজারে সেভ বাটন কাজ নাও করতে পারে। ছবিতে চেপে ধরে সেভ করুন, অথবা উপরের ⋮ মেনু থেকে “ব্রাউজারে খুলুন” চাপুন।")}</div>
            <div className="row" style={{ marginTop: 12 }}>
              <button type="button" className="btn" id="rsv" onClick={handleDirectDownload}>
                <svg className="ic">
                  <use href="#i-dl" />
                </svg>{text("সেভ")}</button>
              <button type="button" className="btn warm" id="rsh" disabled={isPreparing || isReadingPhoto || templateStatus[frameIndex] !== 'ready'} onClick={handleShareClick}>
                <svg className="ic">
                  <use href="#i-sh" />
                </svg>{text("শেয়ার")}</button>
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
              </svg>{text("ক্যাপশন কপি")}</button>
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
              aria-label={text("বন্ধ")}
              onClick={() => setActiveSheet('none')}
            >
              <svg className="ic">
                <use href="#i-x" />
              </svg>
            </button>
            <b>{text("মাহফিলের পোস্টার")}</b>
            <a
              href={OFFICIAL_POSTER.src}
              download={OFFICIAL_POSTER.filename}
              className="ib"
              id="pd"
              aria-label={text("ডাউনলোড")}
            >
              <svg className="ic">
                <use href="#i-dl" />
              </svg>
            </a>
            <button
              type="button"
              className="ib"
              id="psh" disabled={isSharingPoster}
              aria-label={text("শেয়ার")}
              onClick={async () => {
                setIsSharingPoster(true);
                try {
                  const result = await sharePoster(lang);
                  toast(result === 'copied'
                    ? (lang === 'bn' ? 'পোস্টারের লিংক কপি হয়েছে' : 'Poster link copied')
                    : (lang === 'bn' ? 'পোস্টার শেয়ার হয়েছে' : 'Poster shared'));
                } catch (error) {
                  if ((error as Error).name !== 'AbortError') toast(lang === 'bn'
                    ? 'শেয়ার করা যায়নি। ডাউনলোড করুন বা ছবিতে চেপে ধরে সেভ করুন।'
                    : 'Sharing failed. Download or save the poster image.');
                } finally {
                  setIsSharingPoster(false);
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
              src={OFFICIAL_POSTER.src}
              width={OFFICIAL_POSTER.width} height={OFFICIAL_POSTER.height}
              onError={() => toast(lang === 'bn' ? 'পোস্টার লোড হয়নি। আবার খুলে দেখুন।' : 'Poster failed to load. Please reopen it.')}
              alt={text("মাহফিলের পোস্টার")}
              className={isPosterZoomed ? 'zoom' : ''}
              onClick={() => setIsPosterZoomed((z) => !z)}
            />
            <p className="hint">{text("ছোট লেখা পড়তে পোস্টারে ট্যাপ করে জুম করুন")}</p>
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
          <div className="dg max-h-[calc(100dvh-32px)] overflow-y-auto" id="dg">
            <div className="dic">
              <svg className="ic">
                <use href="#i-ph" />
              </svg>
            </div>
            <h3 id="dt">{text("যোগাযোগ")}</h3>
            <p id="dp">{text("প্রয়োজনে সরাসরি কল বা আর্থিক সহযোগিতা পাঠাতে পারেন")}</p>
            <div className="contact-box">
              {(['bkash', 'rocket'] as const).map(service => (
                <div className="contact-num-row mb-4" key={service}>
                  <div className="contact-phone select-all">
                    {service === 'rocket' ? (
                      <>
                        {displayPhone(SITE.donation.bkash, lang)}
                        <span className="text-sky-700">{lang === 'bn' ? '-৪' : '-4'}</span>
                      </>
                    ) : (
                      displayPhone(SITE.donation[service], lang)
                    )}
                  </div>
                  <div className="contact-pay">
                    <span className={`pay ${service === 'bkash' ? 'bk' : 'ng'}`}>
                      {service === 'bkash' ? (lang === 'bn' ? 'বিকাশ' : 'bKash') : (lang === 'bn' ? 'রকেট' : 'Rocket')}
                    </span>
                    <span className="pay-sub">
                      {service === 'rocket'
                        ? (lang === 'bn' ? 'পার্সোনাল (বারো ডিজিট, শেষে ৪)' : 'Personal (12-digit, ends with 4)')
                        : SITE.donation.accountType[lang]}
                    </span>
                    <button type="button" className="fbk" disabled={copyStatus?.state === 'pending'}
                      onClick={() => copyPhone(SITE.donation[service], service)}>
                      {lang === 'bn' ? 'কপি' : 'Copy'}
                    </button>
                  </div>
                </div>
              ))}
              <p role="status" className="text-sm mb-3">
                {copyStatus?.state === 'copied' && (lang === 'bn' ? 'নম্বর কপি হয়েছে' : 'Number copied')}
                {copyStatus?.state === 'error' && (lang === 'bn'
                  ? 'কপি করা যায়নি। নম্বরটি চেপে ধরে নির্বাচন করে কপি করুন।'
                  : 'Copy failed. Select the number and copy it manually.')}
              </p>
              <div className="contact-grid">
                <a
                  className="fbk"
                  href={SITE.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="ic">
                    <use href="#i-fb" />
                  </svg>
                  <span>{text("ফেসবুক পেজ")}</span>
                </a>
                <a
                  className="fbk"
                  href={SITE.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="ic">
                    <use href="#i-pin" />
                  </svg>
                  <span>{text("গুগল ম্যাপ")}</span>
                </a>
                <a
                  className="fbk"
                  href={mahfilCalendarUrl(lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="ic">
                    <use href="#i-cal" />
                  </svg>
                  <span>{text("ক্যালেন্ডার")}</span>
                </a>
                <a
                  className="fbk"
                  href={`https://wa.me/${MAHFIL.helplinePhone.replace(/\D/g, '').replace(/^0/, '880')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="ic">
                    <use href="#i-wa" />
                  </svg>
                  <span>{text("হোয়াটসঅ্যাপ")}</span>
                </a>
              </div>
            </div>
            <div className="dx">
              <a href={phoneHref(MAHFIL.helplinePhone)} className="btn" onClick={() => setDialogState('none')}>
                <svg className="ic">
                  <use href="#i-ph" />
                </svg>{text("কল করুন")}</a>
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
            <h3 id="dt">{text("ছবি মুছে ফেলবেন?")}</h3>
            <p id="dp">{text("ফ্রেম থেকে আপনার ছবি সরে যাবে। চাইলে আবার নতুন ছবি দিতে পারবেন।")}</p>
            <div className="dx">
              <button
                type="button"
                className="btn ghost"
                onClick={() => setDialogState('none')}
              >{text("থাক")}</button>
              <button
                type="button"
                className="btn warm"
                onClick={handleDeletePhotoConfirm}
              >{text("মুছুন")}</button>
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
            <h3 id="dt">{text("ছবি যোগ করুন")}</h3>
            <p id="dp">{text("ফ্রেমে বসানোর জন্য আপনার একটি ছবি বেছে নিন।")}</p>
            <div className="dx">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setDialogState('none');
                  fileInputRef.current?.click();
                }}
              >{text("ছবি বাছুন")}</button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification identical to live site */}
      <div role="status" className={`toast ${toastText ? 'on' : ''}`} id="ts">
        {toastText}
      </div>
    </div>
  );
}
