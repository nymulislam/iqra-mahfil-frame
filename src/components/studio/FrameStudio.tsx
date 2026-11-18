'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
import { useFrameTemplates } from './useFrameTemplates';
import { readPhoto, exportFrame, downloadBlob } from './frameExport';
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
  const roleLabel = (value: string) => {
    const index = Math.max(QUICK_ROLES_BN.indexOf(value), QUICK_ROLES_EN.indexOf(value));
    return index < 0 ? value : (lang === 'bn' ? QUICK_ROLES_BN : QUICK_ROLES_EN)[index];
  };
  const { recordFrameCreated } = useLiveTracking();
  const { openFrameModal } = useFrameModal();

  const desktopCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { templates: templateImagesRef, status: templateStatus, retry: retryTemplates } = useFrameTemplates();
  const photoRequest = useRef(0);
  const exporting = useRef(false);
  const [isReadingPhoto, setIsReadingPhoto] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');

  const snapshot = useMemo(() => ({ frameIndex, userImage, zoom, offsetX, offsetY, name, designation: roleLabel(designation), language: lang }),
    [frameIndex, userImage, zoom, offsetX, offsetY, name, designation, lang]);
  const latestSnapshot = useRef(snapshot);
  latestSnapshot.current = snapshot;

  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<'photo' | 'name' | 'designation' | null>(null);

  const uploadBtnRef = useRef<HTMLButtonElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const designationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (validationError === 'photo' && userImage) setValidationError(null);
    if (validationError === 'name' && name.trim()) setValidationError(null);
    if (validationError === 'designation' && designation.trim()) setValidationError(null);
  }, [validationError, userImage, name, designation]);

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

  const draw = useCallback(() => {
    const currentState: FrameStudioState = {
      frameIndex,
      userImage,
      zoom,
      offsetX,
      offsetY,
      name,
      designation: roleLabel(designation),
      language: lang,
    };
    if (desktopCanvasRef.current) {
      renderFrame(desktopCanvasRef.current, currentState, templateImagesRef.current);
    }
  }, [frameIndex, userImage, zoom, offsetX, offsetY, name, designation, lang]);

  useEffect(() => {
    draw();
  }, [draw, templateStatus]);

  useEffect(() => {
    setFallbackUrl(null);
  }, [snapshot]);
  useEffect(() => () => {
    if (fallbackUrl) URL.revokeObjectURL(fallbackUrl);
  }, [fallbackUrl]);
  useEffect(() => () => { photoRequest.current += 1; }, []);

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

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const request = ++photoRequest.current;
    setIsReadingPhoto(true);
    try {
      const image = await readPhoto(file);
      if (request !== photoRequest.current) return;
      setUserImage(image);
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
      showToast(lang === 'bn' ? 'ছবি যুক্ত হয়েছে!' : 'Photo added!');
    } catch {
      if (request === photoRequest.current) showToast(lang === 'bn'
        ? 'ছবিটি খোলা যায়নি। JPEG, PNG বা WebP ছবি বেছে নিন।'
        : 'Cannot open this photo. Choose a JPEG, PNG or WebP image.');
    } finally {
      if (request === photoRequest.current) setIsReadingPhoto(false);
    }
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
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#025ba9', '#014779', '#e0f2fe', '#026fba'],
    });
  };

  const prepareExport = async () => {
    const current = snapshot;
    const blob = await exportFrame(current, templateImagesRef.current);
    if (latestSnapshot.current !== current) return null;
    recordFrameCreated();
    return blob;
  };

  const validateReady = (): boolean => {
    if (!userImage) {
      setValidationError('photo');
      uploadBtnRef.current?.focus();
      showToast(
        lang === 'bn'
          ? 'প্রথমে ফ্রেমে বসানোর জন্য আপনার একটি ছবি যোগ করুন।'
          : 'Please upload your photo first.'
      );
      return false;
    }
    if (!name.trim()) {
      setValidationError('name');
      nameInputRef.current?.focus();
      showToast(
        lang === 'bn'
          ? 'অনুগ্রহ করে আপনার নাম লিখুন।'
          : 'Please enter your full name.'
      );
      return false;
    }
    if (!designation.trim()) {
      setValidationError('designation');
      designationInputRef.current?.focus();
      showToast(
        lang === 'bn'
          ? 'অনুগ্রহ করে আপনার পদবী বা পরিচয় লিখুন অথবা নিচ থেকে বাছুন।'
          : 'Please enter or choose your designation.'
      );
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleDownload = async () => {
    if (exporting.current || isReadingPhoto) return;
    if (!validateReady()) return;
    exporting.current = true;
    setIsDownloading(true);
    try {
      const blob = await prepareExport();
      if (!blob) return;
      const safeName = (name.trim() || 'iqra-mahfil-2026').replace(/\s+/g, '-');
      downloadBlob(blob, safeName + '-frame.png');
      setFallbackUrl(URL.createObjectURL(blob));
      triggerConfetti();
      showToast(lang === 'bn' ? 'ডাউনলোড শুরু হয়েছে। প্রিভিউ থেকেও সেভ করতে পারেন।' : 'Download started. You can also save the preview.');
    } catch {
      showToast(lang === 'bn' ? 'ফ্রেম তৈরি করা যায়নি। আবার চেষ্টা করুন।' : 'Frame export failed. Please try again.');
    } finally {
      exporting.current = false;
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (exporting.current || isReadingPhoto) return;
    if (!validateReady()) return;
    exporting.current = true;
    setIsDownloading(true);
    try {
      const blob = await prepareExport();
      if (!blob) return;
      setFallbackUrl(URL.createObjectURL(blob));
      const file = new File([blob], 'iqra-mahfil-frame.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text: lang === 'bn'
            ? 'আমি আসছি, আপনি আসছেন তো? ৫ ডিসেম্বর ২০২৬ — ইক্বরা মাহফিল। https://iqra.annujum.org'
            : 'Join Iqra Mahfil on 5 December 2026. https://iqra.annujum.org' });
          return;
        } catch (error) {
          if ((error as Error).name === 'AbortError') return;
        }
      }
      showToast(lang === 'bn' ? 'নিচের ছবিটি সেভ করে শেয়ার করুন।' : 'Save the image below to share it.');
    } catch {
      showToast(lang === 'bn' ? 'ফ্রেম তৈরি করা যায়নি। আবার চেষ্টা করুন।' : 'Frame export failed. Please try again.');
    } finally {
      exporting.current = false;
      setIsDownloading(false);
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

      <div role="status" className="text-center text-sm px-4">
        {isReadingPhoto ? (lang === 'bn' ? 'ছবি খোলা হচ্ছে…' : 'Opening photo…')
          : templateStatus[frameIndex] === 'loading' ? (lang === 'bn' ? 'ফ্রেম লোড হচ্ছে…' : 'Loading frame…') : ''}
        {templateStatus[frameIndex] === 'error' && <button type="button" onClick={retryTemplates}>
          {lang === 'bn' ? 'ফ্রেম লোড হয়নি। আবার চেষ্টা করুন' : 'Frame failed to load. Retry'}
        </button>}
      </div>
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
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-ocean)] to-[var(--brand-blue-ink)]" />

            {/* Template Toggle Pills - Clean Light Brand Styling (Zero Dark Mode Bleed) */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex p-1 rounded-full bg-sky-50/90 border border-sky-200/90 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setFrameIndex(0)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    frameIndex === 0
                      ? 'bg-[var(--brand-primary)] text-white shadow-xs'
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
                      ? 'bg-[var(--brand-primary)] text-white shadow-xs'
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
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                {lang === 'bn' ? 'আল্ট্রা-এইচডি' : 'Ultra HD'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-sky-800">
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                {lang === 'bn' ? 'পিঞ্চ ও জুম' : 'Pinch & Zoom'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-sky-700 font-extrabold">
                {lang === 'bn' ? '১০০% ফ্রি' : '100% Free'}
              </span>
            </div>

            {/* Big Prominent App-Style CTA Button */}
            <button
              type="button"
              onClick={openFrameModal}
              className="w-full py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 cursor-pointer"
              style={{
                background: 'var(--primary-gradient)',
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
                      className="p-1.5 hover:bg-sky-50 text-sky-600 rounded-lg transition cursor-pointer border border-transparent hover:border-sky-200"
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
                    <span>{lang === 'bn' ? '১. ফ্রেমের ডিজাইন নির্বাচন করুন' : '1. Choose frame design'}</span>
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
                        <span>{lang === 'bn' ? 'ফ্রেম ১' : 'Frame 1'}</span>
                      </span>
                      <span className="text-xs text-slate-500 font-medium mt-1">{lang === 'bn' ? 'রয়েল ব্লু ও টিল' : 'Royal Blue & Teal'}</span>
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
                        <span>{lang === 'bn' ? 'ফ্রেম ২' : 'Frame 2'}</span>
                      </span>
                      <span className="text-xs text-slate-500 font-medium mt-1">{lang === 'bn' ? 'পোস্টার থিম' : 'Poster theme'}</span>
                    </button>
                  </div>
                </div>

                {/* Step 2: Photo Upload Button */}
                <div>
                  <label className="text-xs font-bold text-sky-900 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-600" />
                    <span>{lang === 'bn' ? '২. আপনার ছবি দিন' : '2. Add your photo'}</span>
                  </label>
                  <button
                    ref={uploadBtnRef}
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer shadow-2xs border ${
                      validationError === 'photo'
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-400 ring-2 ring-rose-500/20'
                        : 'bg-sky-50 hover:bg-sky-100 text-sky-900 border-sky-200'
                    }`}
                  >
                    <Camera className={`w-4 h-4 ${validationError === 'photo' ? 'text-rose-600' : 'text-sky-600'}`} />
                    <span>{userImage ? t.studio.changePhoto[lang] : t.studio.uploadPhoto[lang]}</span>
                  </button>
                  {validationError === 'photo' && (
                    <p className="mt-1.5 text-[11px] font-semibold text-rose-600">
                      {lang === 'bn'
                        ? 'ফ্রেম ডাউনলোড বা শেয়ার করার আগে আপনার একটি ছবি বাছুন।'
                        : 'Select a photo before downloading or sharing your frame.'}
                    </p>
                  )}
                </div>

                {/* Step 3: Real-Time Name & Designation Inputs */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-sky-900 uppercase tracking-wider block flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-600" />
                    <span>{lang === 'bn' ? '৩. নাম ও পদবী (লাইভ প্রিভিউ)' : '3. Name and designation (preview)'}</span>
                  </label>
                  <div>
                    <input
                      ref={nameInputRef}
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
                      placeholder={t.studio.namePlaceholder[lang]}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold text-slate-900 bg-slate-50/50 focus:ring-2 ${
                        validationError === 'name'
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/40'
                          : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                      }`}
                    />
                    {validationError === 'name' && (
                      <p className="mt-1 text-[11px] font-semibold text-rose-600">
                        {lang === 'bn'
                          ? 'অনুগ্রহ করে আপনার নাম লিখুন।'
                          : 'Please enter your full name.'}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      ref={designationInputRef}
                      type="text"
                      value={roleLabel(designation)}
                      onChange={(e) => {
                        setDesignation(e.target.value);
                        try {
                          localStorage.setItem('iqra_designation', e.target.value);
                        } catch {
                          // ignore
                        }
                      }}
                      placeholder={t.studio.rolePlaceholder[lang]}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold text-slate-900 bg-slate-50/50 focus:ring-2 ${
                        validationError === 'designation'
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/40'
                          : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                      }`}
                    />
                    {validationError === 'designation' && (
                      <p className="mt-1 text-[11px] font-semibold text-rose-600">
                        {lang === 'bn'
                          ? 'পদবী বা পরিচয় লিখুন অথবা নিচের অপশন থেকে বাছুন।'
                          : 'Enter a designation or choose one below.'}
                      </p>
                    )}
                  </div>

                  {/* Quick Role Suggestion Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {QUICK_ROLES_BN.slice(0, 6).map((role) => (
                      <button
                        key={roleLabel(role)}
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
                          roleLabel(designation) === roleLabel(role)
                            ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] font-bold shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        {roleLabel(role)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 4: Primary Actions (Download & Share) */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading || isReadingPhoto || templateStatus[frameIndex] !== 'ready'}
                    className="w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-lg flex items-center justify-center gap-2 active:scale-98 hover:brightness-105 transition-all duration-200 disabled:opacity-60 cursor-pointer"
                    style={{
                      background: 'var(--primary-gradient)',
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
                    disabled={isDownloading || isReadingPhoto || templateStatus[frameIndex] !== 'ready'}
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
        {fallbackUrl && <div className="hidden md:block max-w-md mx-auto p-4 text-center">
          <p>{lang === 'bn' ? 'ছবিতে রাইট ক্লিক বা চেপে ধরে সেভ করুন।' : 'Right-click or hold the image to save it.'}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fallbackUrl} alt={lang === 'bn' ? 'তৈরি করা ফ্রেম' : 'Generated frame'} className="w-full" />
          <a href={fallbackUrl} download="iqra-mahfil-frame.png">{lang === 'bn' ? 'ছবি সেভ করুন' : 'Save image'}</a>
        </div>}
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
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[var(--brand-primary)] focus:bg-white text-sm font-semibold"
                  />
                </div>

                {/* Designation Input */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.studio.roleLabel[lang]}
                  </label>
                  <input
                    type="text"
                    value={roleLabel(designation)}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder={t.studio.rolePlaceholder[lang]}
                    maxLength={36}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[var(--brand-primary)] focus:bg-white text-sm font-semibold"
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
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm primary-action text-white shadow-md shadow-sky-600/20 transition active:scale-95 flex items-center justify-center gap-2 mt-2 cursor-pointer"
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
              role="status" className="fixed bottom-20 left-1/2 -translate-x-1/2 z-70 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs sm:text-sm font-bold flex items-center gap-2 pointer-events-none"
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
