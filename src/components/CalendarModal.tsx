'use client';

import React, { useEffect, useRef, useState } from 'react';
import { OFFICIAL_POSTER } from '@/lib/poster';
import { m, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  Calendar,
  FileText,
  Image as ImageIcon,
  Briefcase,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useScrollLock } from './SmoothScroll';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'calendar' | 'brochure' | 'banner' | 'sponsor';
}

const BROCHURE_PDF_SRC = '/assets/posters/admission-brouchure.pdf';
const BROCHURE_PDF_FILENAME = 'iqra-madrasah-admission-brochure-2027.pdf';
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.5;

export function CalendarModal({ isOpen, onClose, type }: ModalProps) {
  const { lang, t } = useLanguage();

  const panel = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{ active: boolean; moved: boolean; startX: number; startY: number; scrollLeft: number; scrollTop: number }>({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    setZoomLevel(1);
    setIsDragging(false);
    setImageError(false);
    setPdfLoaded(false);
    const img = imgRef.current;
    setImageLoaded(Boolean(img && img.complete && img.naturalWidth > 0));
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const controls = panel.current?.querySelectorAll<HTMLElement>('button, a[href]');
      if (!controls?.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel.current)) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('keydown', key);
      previous?.focus();
    };
  }, [isOpen, onClose, type]);

  if (!isOpen) return null;

  let imageSrc = OFFICIAL_POSTER.src;
  let downloadFileName = OFFICIAL_POSTER.filename;
  let title =
    lang === 'bn'
      ? 'বার্ষিক তাফসীরুল কুরআন মাহফিল ২০২৬ অফিসিয়াল ব্যানার'
      : 'Annual Tafsirul Quran Mahfil 2026 Official Banner';
  let subtitle =
    lang === 'bn'
      ? '৫ ডিসেম্বর ২০২৬, শনিবার • বাদ যোহর • মাদরাসা সংলগ্ন বালুর মাঠ'
      : 'Saturday, December 5, 2026 • After Zohr • Balur Math Grounds';

  if (type === 'calendar') {
    imageSrc = '/assets/posters/calendar-2027.jpg';
    downloadFileName = 'iqra-madrasah-calendar-2026.jpg';
    title = t.calendar.modalTitle[lang];
    subtitle = t.calendar.modalDesc[lang];
  } else if (type === 'brochure') {
    title =
      lang === 'bn'
        ? 'ইক্বরা মাদরাসা ভর্তি প্রসপেক্টাস'
        : 'Iqra Madrasah Admission Brochure';
    subtitle =
      lang === 'bn'
        ? '৮ পৃষ্ঠার সম্পূর্ণ ভর্তি প্রসপেক্টাস (PDF)'
        : 'Complete 8-Page Admission Prospectus (PDF)';
  } else if (type === 'sponsor') {
    imageSrc = '/assets/sponsor/ar-rahman-card.jpg';
    downloadFileName = 'ar-rahman-travels-card.jpg';
    title =
      lang === 'bn'
        ? 'আর রহমান ট্রাভেলস অফিসিয়াল কার্ড'
        : 'Ar-Rahman Travels Official Visiting Card';
    subtitle =
      lang === 'bn'
        ? 'হজ্ব ও উমরাহ কাফেলা • পরিচালক: হাফেজ মাওলানা মুফতী মুহাম্মদ ইসমাইল'
        : 'Official Travel Partner • Director: Hafiz Maulana Mufti Muhammad Ismail';
  }

  const isPdfView = type === 'brochure';

  const applyZoom = (nextZoom: number) => {
    const clamped = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Number(nextZoom.toFixed(2))));
    setZoomLevel(clamped);
    if (clamped === 1 && viewportRef.current) {
      viewportRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoomLevel <= 1 || e.pointerType === 'touch') return;
    const el = viewportRef.current;
    if (!el) return;
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
    };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || !viewportRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) + Math.abs(dy) > 4) dragRef.current.moved = true;
    viewportRef.current.scrollLeft = dragRef.current.scrollLeft - dx;
    viewportRef.current.scrollTop = dragRef.current.scrollTop - dy;
  };

  const handlePointerUp = () => {
    dragRef.current.active = false;
    setIsDragging(false);
  };

  const handleImageClick = () => {
    if (dragRef.current.moved) {
      dragRef.current.moved = false;
      return;
    }
    applyZoom(zoomLevel > 1 ? 1 : 2);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md"
        onClick={onClose}
      >
        <m.div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="poster-modal-title"
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative max-h-[96vh] bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-900 ${
            isPdfView
              ? 'w-full max-w-[95vw] sm:max-w-2xl md:max-w-4xl'
              : 'w-auto max-w-[94vw] sm:max-w-xl md:max-w-3xl'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100 bg-white shrink-0">
            <div className="min-w-0 pr-2">
              <h3 id="poster-modal-title" className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 truncate">
                {type === 'calendar' ? (
                  <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                ) : type === 'brochure' ? (
                  <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                ) : type === 'sponsor' ? (
                  <Briefcase className="w-4 h-4 text-sky-600 shrink-0" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-sky-600 shrink-0" />
                )}
                <span className="truncate">{title}</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate mt-0.5">{subtitle}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isPdfView && (
                <a
                  href={BROCHURE_PDF_SRC}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-sky-700 hover:bg-sky-50 transition"
                >
                  <span>{lang === 'bn' ? 'নতুন ট্যাবে খুলুন' : 'Open in new tab'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition shrink-0 cursor-pointer"
                aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body: PDF-only Brochure Reader OR Upgraded Smooth Zoom/Pan Image Viewer */}
          {isPdfView ? (
            <div data-lenis-prevent className="min-h-0 flex-1 overflow-auto overscroll-contain p-3 sm:p-4 bg-slate-100/80">
              {/* Desktop Inline PDF Viewer */}
              <div className="hidden md:block relative">
                {!pdfLoaded && (
                  <div className="absolute inset-0 z-10 rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl skeleton-shimmer" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-48 rounded-md skeleton-shimmer" />
                          <div className="h-3 w-32 rounded-md skeleton-shimmer" />
                        </div>
                      </div>
                      <div className="h-52 w-full rounded-xl skeleton-shimmer" />
                      <div className="space-y-2">
                        <div className="h-3.5 w-full rounded skeleton-shimmer" />
                        <div className="h-3.5 w-5/6 rounded skeleton-shimmer" />
                        <div className="h-3.5 w-4/6 rounded skeleton-shimmer" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-sky-700 pt-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === 'bn' ? '৮ পৃষ্ঠার প্রসপেক্টাস PDF লোড হচ্ছে…' : 'Loading 8-page PDF prospectus…'}</span>
                    </div>
                  </div>
                )}
                <iframe
                  src={`${BROCHURE_PDF_SRC}#view=FitH`}
                  title={title}
                  onLoad={() => setPdfLoaded(true)}
                  className="w-full h-[68vh] min-h-[440px] rounded-xl border border-slate-200 bg-white shadow-inner"
                />
              </div>

              {/* Mobile / Touch Smart PDF Card */}
              <div className="md:hidden flex flex-col items-center text-center bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shadow-xs">
                  <FileText className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                    <span>{lang === 'bn' ? 'PDF • ৮ পৃষ্ঠার সম্পূর্ণ প্রসপেক্টাস' : 'PDF • 8-Page Prospectus'}</span>
                  </span>
                  <h4 className="font-serif text-base font-bold text-slate-900 pt-1">
                    {lang === 'bn' ? 'ইক্বরা ইন্টারন্যাশনাল মাদরাসা' : 'Iqra International Madrasah'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    {lang === 'bn'
                      ? 'সবগুলো বিভাগ, ভর্তি নিয়মাবলি, ইউনিফর্ম ও শিক্ষকদের পূর্ণ তালিকা পড়তে নিচের বাটনে ট্যাপ করুন।'
                      : 'Tap below to read all 8 pages smoothly in your device’s native PDF reader.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5 w-full">
                  <a
                    href={BROCHURE_PDF_SRC}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs primary-action text-white shadow-sm active:scale-95 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'PDF রিডারে পূর্ণ ৮ পৃষ্ঠা পড়ুন' : 'Open Full 8-Page PDF'}</span>
                  </a>
                  <a
                    href={BROCHURE_PDF_SRC}
                    download={BROCHURE_PDF_FILENAME}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white active:scale-95 transition"
                  >
                    <Download className="w-4 h-4 text-sky-400" />
                    <span>{lang === 'bn' ? 'PDF ডাউনলোড করুন' : 'Download PDF'}</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative min-h-0 flex-1 bg-slate-900/5 flex flex-col">
              <div
                ref={viewportRef}
                data-lenis-prevent
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={`min-h-0 flex-1 overflow-auto overscroll-contain p-2 sm:p-3 pb-14 flex ${
                  zoomLevel > 1
                    ? `items-start justify-start ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`
                    : 'items-center justify-center'
                }`}
                style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
              >
                {!imageLoaded && !imageError && (
                  <div
                    aria-hidden="true"
                    className="w-[74vw] sm:w-[420px] h-[54vh] rounded-xl skeleton-shimmer border border-slate-200/70 flex items-center justify-center"
                  >
                    <Loader2 className="w-6 h-6 text-sky-600/70 animate-spin" />
                  </div>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={imageSrc}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  onClick={handleImageClick}
                  draggable={false}
                  alt={title}
                  style={
                    zoomLevel > 1
                      ? { width: `${zoomLevel * 100}%`, maxWidth: 'none' }
                      : undefined
                  }
                  className={`select-none rounded-xl transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'
                  } ${
                    zoomLevel > 1
                      ? 'h-auto shrink-0 transition-[width] duration-200 ease-out'
                      : 'w-auto h-auto max-w-full max-h-[68vh] object-contain cursor-zoom-in shadow-sm'
                  }`}
                />
              </div>

              {imageError && (
                <p role="alert" className="p-3 text-sm text-rose-600 text-center">
                  {lang === 'bn' ? 'ছবি লোড হয়নি। আবার চেষ্টা করুন।' : 'Image failed to load. Please try again.'}
                </p>
              )}

              {/* Floating Glass Zoom Toolbar */}
              <div className="pointer-events-none absolute bottom-3 inset-x-0 flex justify-center px-3">
                <div className="pointer-events-auto inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900/85 text-white backdrop-blur-md border border-white/15 shadow-xl">
                  <button
                    type="button"
                    onClick={() => applyZoom(zoomLevel - ZOOM_STEP)}
                    disabled={zoomLevel <= ZOOM_MIN}
                    aria-label={lang === 'bn' ? 'জুম আউট' : 'Zoom out'}
                    className="p-1.5 rounded-full hover:bg-white/15 disabled:opacity-35 transition cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>

                  <span className="px-2 text-[11px] font-mono font-bold tabular-nums min-w-[44px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>

                  <button
                    type="button"
                    onClick={() => applyZoom(zoomLevel + ZOOM_STEP)}
                    disabled={zoomLevel >= ZOOM_MAX}
                    aria-label={lang === 'bn' ? 'জুম ইন' : 'Zoom in'}
                    className="p-1.5 rounded-full hover:bg-white/15 disabled:opacity-35 transition cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>

                  {zoomLevel > 1 && (
                    <button
                      type="button"
                      onClick={() => applyZoom(1)}
                      aria-label={lang === 'bn' ? 'স্বাভাবিক আকার' : 'Reset zoom'}
                      className="ml-0.5 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/15 hover:bg-white/25 text-[11px] font-semibold transition cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{lang === 'bn' ? 'রিসেট' : 'Fit'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Compact Footer Controls */}
          <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-2 sm:gap-3 shrink-0">
            <span className="text-[11px] text-slate-500 hidden lg:inline font-medium">
              {isPdfView
                ? lang === 'bn'
                  ? '৮ পৃষ্ঠার সম্পূর্ণ ভর্তি প্রসপেক্টাস (PDF)'
                  : 'Complete 8-page admission prospectus (PDF)'
                : lang === 'bn'
                ? 'ছবিতে ক্লিক বা নিচের +/− দিয়ে জুম করুন'
                : 'Click image or use +/− controls to zoom'}
            </span>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
              {isPdfView ? (
                <a
                  href={BROCHURE_PDF_SRC}
                  download={BROCHURE_PDF_FILENAME}
                  className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl font-bold text-xs sm:text-sm primary-action text-white shadow-sm transition active:scale-95 flex-1 sm:flex-none cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'PDF ডাউনলোড (৮ পৃষ্ঠা)' : 'Download PDF (8p)'}</span>
                </a>
              ) : (
                <a
                  href={imageSrc}
                  download={downloadFileName}
                  className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl font-bold text-xs sm:text-sm primary-action text-white shadow-sm transition active:scale-95 flex-1 sm:flex-none cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'এইচডি ডাউনলোড' : 'Download HD'}</span>
                </a>
              )}

              <button
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition shrink-0 cursor-pointer"
              >
                {t.calendar.close[lang]}
              </button>
            </div>
          </div>
        </m.div>
      </div>
    </AnimatePresence>
  );
}
