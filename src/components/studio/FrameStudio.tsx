'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Check,
  X,
  User,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/context/LanguageContext';
import { useLiveTracking } from '@/context/LiveTrackingContext';
import { useFrameModal } from '@/context/FrameModalContext';
import { SITE } from '@/content/site';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  FrameStudioState,
  renderFrame,
} from './frameDraw';
import { useFrameGestures } from './useFrameGestures';
import { MobileAppStudio } from './MobileAppStudio';

const QUICK_ROLES_BN = [
  'হাফেজ',
  'ছাত্র',
  'শিক্ষক',
  'মুহতামিম',
  'মুসুল্লি',
  'শুভাকাঙ্ক্ষী',
  'প্রবাসী',
  'অভিভাবক',
];

const QUICK_ROLES_EN = [
  'Hafiz',
  'Student',
  'Teacher',
  'Principal',
  'Musalli',
  'Well-wisher',
  'Expatriate',
  'Guardian',
];

export function FrameStudio() {
  const { lang, t } = useLanguage();
  const { recordFrameCreated } = useLiveTracking();
  const { isFrameModalOpen, openFrameModal, closeFrameModal } = useFrameModal();

  const desktopCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const templateImagesRef = useRef<(HTMLImageElement | null)[]>([null, null]);

  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');

  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedName = localStorage.getItem('iqra_name') || '';
      const savedDes = localStorage.getItem('iqra_designation') || '';
      if (savedName) setName(savedName);
      if (savedDes) setDesignation(savedDes);
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
  }, []);

  const draw = useCallback(() => {
    const currentState: FrameStudioState = {
      frameIndex,
      userImage,
      zoom,
      offsetX,
      offsetY,
      name,
      designation,
    };
    if (desktopCanvasRef.current) {
      renderFrame(desktopCanvasRef.current, currentState, templateImagesRef.current);
    }
    if (modalCanvasRef.current) {
      renderFrame(modalCanvasRef.current, currentState, templateImagesRef.current);
    }
  }, [frameIndex, userImage, zoom, offsetX, offsetY, name, designation]);

  useEffect(() => {
    draw();
  }, [draw]);

  // When modal opens, re-trigger draw once modal canvas is mounted
  useEffect(() => {
    if (isFrameModalOpen) {
      const timer = setTimeout(() => {
        draw();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isFrameModalOpen, draw]);

  // Desktop Gestures
  useFrameGestures({
    canvasRef: desktopCanvasRef,
    hasPhoto: !!userImage,
    zoom,
    offsetX,
    offsetY,
    onUpdate: (updates) => {
      if (updates.zoom !== undefined) setZoom(updates.zoom);
      if (updates.offsetX !== undefined) setOffsetX(updates.offsetX);
      if (updates.offsetY !== undefined) setOffsetY(updates.offsetY);
    },
    onPhotoClick: () => {
      fileInputRef.current?.click();
    },
  });

  // Modal / Mobile Gestures
  useFrameGestures({
    canvasRef: modalCanvasRef,
    hasPhoto: !!userImage,
    zoom,
    offsetX,
    offsetY,
    onUpdate: (updates) => {
      if (updates.zoom !== undefined) setZoom(updates.zoom);
      if (updates.offsetX !== undefined) setOffsetX(updates.offsetX);
      if (updates.offsetY !== undefined) setOffsetY(updates.offsetY);
    },
    onPhotoClick: () => {
      fileInputRef.current?.click();
    },
  });

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setUserImage(img);
        setZoom(1);
        setOffsetX(0);
        setOffsetY(0);
        showToast(lang === 'bn' ? 'ছবি যুক্ত হয়েছে!' : 'Photo added successfully!');
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleReset = () => {
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleClearPhoto = () => {
    setUserImage(null);
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleSaveDetails = () => {
    try {
      localStorage.setItem('iqra_name', name);
      localStorage.setItem('iqra_designation', designation);
    } catch {
      // ignore
    }
    setIsSheetOpen(false);
    showToast(lang === 'bn' ? 'তথ্য সংরক্ষিত হয়েছে!' : 'Details saved!');
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0d9488', '#0284c7', '#026cb6', '#c8102e', '#0ea5e9'],
    });
  };

  const getActiveCanvas = () => {
    if (isFrameModalOpen && modalCanvasRef.current) return modalCanvasRef.current;
    return desktopCanvasRef.current || modalCanvasRef.current;
  };

  const handleDownload = async () => {
    const canvas = getActiveCanvas();
    if (!canvas) return;
    setIsDownloading(true);

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png', 0.95)
      );

      if (!blob) throw new Error('Blob generation failed');

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = (name.trim() || 'iqra-mahfil-2026').replace(/\s+/g, '-');
      a.download = `${safeName}-frame.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      triggerConfetti();
      recordFrameCreated();
      showToast(lang === 'bn' ? 'ফ্রেম সফলভাবে ডাউনলোড হয়েছে!' : 'Frame downloaded successfully!');
    } catch (err) {
      console.error(err);
      showToast(lang === 'bn' ? 'ডাউনলোড ব্যর্থ হয়েছে!' : 'Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const canvas = getActiveCanvas();
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png', 0.95)
      );

      if (!blob) throw new Error('Blob failed');

      const shareText =
        lang === 'bn'
          ? 'আমি আসছি, আপনি আসছেন তো? ৫ ডিসেম্বর ২০২৬ — বার্ষিক তাফসীরুল কুরআন মাহফিল, ইক্বরা ইন্টারন্যাশনাল মাদরাসা, পাটওয়ারী বাজার, ফরিদগঞ্জ, চাঁদপুর।'
          : 'I am attending the Annual Tafsirul Quran Mahfil 2026 at Iqra International Madrasah on 5 December 2026. Join us!';

      const file = new File([blob], 'iqra-mahfil-frame.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: lang === 'bn' ? 'ইক্বরা মাহফিল ২০২৬ ফটো ফ্রেম' : 'Iqra Mahfil 2026 Frame',
          text: shareText,
          url: 'https://iqra.annujum.org',
        });
        triggerConfetti();
        recordFrameCreated();
      } else if (navigator.share) {
        await navigator.share({
          title: lang === 'bn' ? 'ইক্বরা মাহফিল ২০২৬ ফটো ফ্রেম' : 'Iqra Mahfil 2026 Frame',
          text: shareText,
          url: 'https://iqra.annujum.org',
        });
        triggerConfetti();
        recordFrameCreated();
      } else {
        await navigator.clipboard.writeText('https://iqra.annujum.org');
        showToast(lang === 'bn' ? 'লিঙ্ক কপি হয়েছে!' : 'Website link copied!');
      }
    } catch (err) {
      console.log('Share dismissed', err);
    }
  };

  return (
    <section
      id="frame"
      className="relative py-16 md:py-24 overflow-hidden border-b transition-colors duration-500"
      style={{
        backgroundColor: 'var(--bg-page)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Hidden File Input for Native File Chooser */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoSelect}
        className="hidden"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.25] sm:leading-[1.2] mb-3 overflow-visible"
            style={{ color: 'var(--text-main)' }}
          >
            {lang === 'bn' ? (
              <>
                আপনার ছবি দিয়ে তৈরি করুন{' '}
                <span className="italic-serif accent-shimmer block sm:inline-block font-bold pr-4">
                  মাহফিল ফটো ফ্রেম
                </span>
              </>
            ) : (
              <>
                Personalize & Generate Your{' '}
                <span className="italic-serif accent-shimmer block sm:inline-block font-bold pr-4">
                  Official Mahfil Frame
                </span>
              </>
            )}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-xs sm:text-sm max-w-xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {t.studio.sectionDesc[lang]}
          </motion.p>
        </div>

        {/* =========================================================================
            MOBILE VIEW (md:hidden): Ultra-Premium App Preview Card with Instant Pop-up Trigger
           ========================================================================= */}
        <div className="block md:hidden">
          <div
            className="catalis-card p-5 sm:p-6 rounded-3xl shadow-xl border relative overflow-hidden bg-white"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            {/* Top Accent Shimmer Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-sky-500 to-blue-600" />

            {/* Template Toggle Pills - Clean Light Brand Styling (Zero Dark Mode Bleed) */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex p-1 rounded-full bg-sky-50/90 border border-sky-200/90 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setFrameIndex(0)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    frameIndex === 0
                      ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-sky-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  <span>{t.studio.frame1Name[lang]}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFrameIndex(1)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    frameIndex === 1
                      ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-sky-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-sky-300"></span>
                  <span>{t.studio.frame2Name[lang]}</span>
                </button>
              </div>
            </div>

            {/* Visual Frame Showcase Card - Pristine High-Resolution View */}
            <div
              onClick={openFrameModal}
              className="relative max-w-[290px] mx-auto aspect-square rounded-2xl overflow-hidden shadow-lg ring-1 ring-sky-950/10 bg-slate-50 group cursor-pointer transition-transform active:scale-98"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={frameIndex === 0 ? '/assets/frames/frame-1.png' : '/assets/frames/frame-2.png'}
                alt="Frame Mockup"
                className="w-full h-full object-contain pointer-events-none"
              />

              {/* Bottom Subtle Glass Tag */}
              <div className="absolute bottom-2.5 inset-x-2.5 py-1.5 px-3 rounded-xl bg-white/92 backdrop-blur-md border border-sky-200/80 shadow-md flex items-center justify-center gap-1.5 text-center pointer-events-none">
                <Camera className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="text-xs font-bold text-sky-950 truncate">
                  {lang === 'bn' ? 'ট্যাপ করে নিজের ছবি বসান' : 'Tap to personalize'}
                </span>
              </div>
            </div>

            {/* Feature Value Pills */}
            <div className="flex items-center justify-center gap-2 pt-4 pb-3.5 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1 text-sky-800">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                {lang === 'bn' ? 'আল্ট্রা-এইচডি' : 'Ultra HD'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-sky-800">
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                {lang === 'bn' ? 'পিঞ্চ ও জুম' : 'Pinch & Zoom'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-extrabold">
                {lang === 'bn' ? '১০০% ফ্রি' : '100% Free'}
              </span>
            </div>

            {/* Big Prominent App-Style CTA Button */}
            <button
              type="button"
              onClick={openFrameModal}
              className="w-full py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0284c7 50%, var(--accent-secondary) 100%)',
                boxShadow: '0 8px 24px var(--accent-blue-glow)',
              }}
            >
              <Camera className="w-4 h-4 text-sky-100" />
              <span>{lang === 'bn' ? 'ছবি দিয়ে ফ্রেম তৈরি করুন' : 'Create Custom Frame'}</span>
              <Sparkles className="w-3.5 h-3.5 text-sky-200" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            DESKTOP VIEW (hidden md:block): Modern 2-Column Creative Studio
           ========================================================================= */}
        <div className="hidden md:block">
          <div className="catalis-card p-6 lg:p-8 max-w-5xl mx-auto shadow-2xl border border-sky-100 bg-white/95 backdrop-blur-xl relative rounded-3xl">
            <div className="grid grid-cols-12 gap-8 items-center">
              {/* Left Column (7 cols): The Live Interactive Canvas Stage */}
              <div className="col-span-12 lg:col-span-7 flex flex-col items-center">
                {/* Canvas wrapper with 2.5D elevation and specular border */}
                <div className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden shadow-2xl ring-1 ring-sky-950/10 bg-slate-50 flex items-center justify-center group">
                  <canvas
                    ref={desktopCanvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="w-full h-full object-contain cursor-grab active:cursor-grabbing touch-none select-none"
                  />
                  {/* Touch / Drag hint when photo is loaded */}
                  {userImage && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[11px] text-slate-700 font-semibold px-3 py-1 rounded-full border border-sky-200/80 shadow-xs pointer-events-none flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                      <span>{t.studio.touchHint[lang]}</span>
                    </div>
                  )}
                </div>

                {/* Live Zoom & Clear Controller Bar when photo is loaded */}
                {userImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[420px] mt-4 flex items-center gap-3 bg-sky-50/80 px-4 py-2.5 rounded-2xl border border-sky-200/80"
                  >
                    <ZoomOut className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      aria-label="Zoom"
                    />
                    <ZoomIn className="w-4 h-4 text-slate-500 shrink-0" />
                    <button
                      onClick={handleReset}
                      title={t.studio.reset[lang]}
                      className="p-1.5 hover:bg-white rounded-lg text-slate-600 hover:text-slate-900 transition cursor-pointer border border-transparent hover:border-slate-200"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleClearPhoto}
                      title="Remove Photo"
                      className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition cursor-pointer border border-transparent hover:border-rose-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Right Column (5 cols): The Studio Command Deck */}
              <div className="col-span-12 lg:col-span-5 flex flex-col justify-between space-y-4">
                {/* Step 1: Frame Theme Selection */}
                <div>
                  <label className="text-xs font-bold text-sky-900 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-600" />
                    <span>১. ফ্রেমের ডিজাইন নির্বাচন করুন</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFrameIndex(0)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        frameIndex === 0
                          ? 'border-sky-600 bg-sky-50/90 ring-2 ring-sky-500/30 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                        <span>ফ্রেম ১</span>
                      </span>
                      <span className="text-xs text-slate-500 font-medium mt-1">রয়েল ব্লু ও টিল</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFrameIndex(1)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        frameIndex === 1
                          ? 'border-sky-600 bg-sky-50/90 ring-2 ring-sky-500/30 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                        <span>ফ্রেম ২</span>
                      </span>
                      <span className="text-xs text-slate-500 font-medium mt-1">পোস্টার থিম</span>
                    </button>
                  </div>
                </div>

                {/* Step 2: Photo Upload Button */}
                <div>
                  <label className="text-xs font-bold text-sky-900 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-600" />
                    <span>২. আপনার ছবি দিন</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer shadow-2xs"
                  >
                    <Camera className="w-4 h-4 text-sky-600" />
                    <span>{userImage ? t.studio.changePhoto[lang] : t.studio.uploadPhoto[lang]}</span>
                  </button>
                </div>

                {/* Step 3: Real-Time Name & Designation Inputs */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-sky-900 uppercase tracking-wider block flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-600" />
                    <span>৩. নাম ও পদবী (লাইভ প্রিভিউ)</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        try {
                          localStorage.setItem('iqra_name', e.target.value);
                        } catch {
                          // ignore
                        }
                      }}
                      placeholder="আপনার পূর্ণ নাম (যেমন: মোঃ আব্দুল্লাহ)"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => {
                        setDesignation(e.target.value);
                        try {
                          localStorage.setItem('iqra_designation', e.target.value);
                        } catch {
                          // ignore
                        }
                      }}
                      placeholder="আপনার পদবী / পরিচয় (যেমন: শিক্ষার্থী / শিক্ষক)"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 bg-slate-50/50"
                    />
                  </div>

                  {/* Quick Role Suggestion Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {QUICK_ROLES_BN.slice(0, 6).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setDesignation(role);
                          try {
                            localStorage.setItem('iqra_designation', role);
                          } catch {
                            // ignore
                          }
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          designation === role
                            ? 'bg-sky-600 text-white border-sky-600 font-bold shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 4: Primary Actions (Download & Share) */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-lg flex items-center justify-center gap-2 active:scale-98 hover:brightness-105 transition-all duration-200 disabled:opacity-60 cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0284c7 50%, var(--accent-secondary) 100%)',
                      boxShadow: '0 8px 24px var(--accent-blue-glow)',
                    }}
                  >
                    <Download className="w-4 h-4 text-sky-100" />
                    <span>{isDownloading ? t.studio.downloading[lang] : t.studio.downloadBtn[lang]}</span>
                    <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>{t.studio.shareBtn[lang]}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            GLOBAL MOBILE APP STUDIO POPUP MODAL
            100% Identical Replica of https://iqra.annujum.org/
           ========================================================================= */}
        <MobileAppStudio />

        {/* Modal / Bottom Sheet for Name & Designation (Works both in Desktop & Mobile Modal) */}
        <AnimatePresence>
          {isSheetOpen && (
            <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/70 backdrop-blur-md">
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-lg bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl text-slate-900 relative max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-sky-600" />
                    <h3 className="text-lg font-bold text-slate-900">{t.studio.editDetails[lang]}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSheetOpen(false)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Name Input */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.studio.nameLabel[lang]}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.studio.namePlaceholder[lang]}
                    maxLength={32}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white text-sm font-semibold"
                  />
                </div>

                {/* Designation Input */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.studio.roleLabel[lang]}
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder={t.studio.rolePlaceholder[lang]}
                    maxLength={36}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white text-sm font-semibold"
                  />

                  {/* Quick Role Suggestions */}
                  <div className="mt-2.5">
                    <span className="text-[11px] text-slate-500 block mb-1.5 font-bold">
                      {lang === 'bn' ? 'দ্রুত নির্বাচন করুন:' : 'Quick suggestions:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(lang === 'bn' ? QUICK_ROLES_BN : QUICK_ROLES_EN).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setDesignation(item)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                            designation === item
                              ? 'bg-sky-100 text-sky-900 border-sky-300 font-bold'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSaveDetails}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-600 via-sky-600 to-blue-600 hover:brightness-110 text-white shadow-md shadow-sky-600/20 transition active:scale-95 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{t.studio.saveSheet[lang]}</span>
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Global Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-20 left-1/2 -translate-x-1/2 z-70 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs sm:text-sm font-bold flex items-center gap-2 pointer-events-none"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
