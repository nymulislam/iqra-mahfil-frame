'use client';

import React, { useEffect, useRef, useState } from 'react';
import { OFFICIAL_POSTER } from '@/lib/poster';
import { m, AnimatePresence } from 'motion/react';
import { X, Download, Calendar, FileText, Image as ImageIcon, Briefcase } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useScrollLock } from './SmoothScroll';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'calendar' | 'brochure' | 'banner' | 'sponsor';
}

export function CalendarModal({ isOpen, onClose, type }: ModalProps) {
  const { lang, t } = useLanguage();

  const panel = useRef<HTMLDivElement | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    setZoomed(false);
    setImageError(false);
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
    downloadFileName = 'iqra-madrasah-calendar-2027.jpg';
    title = t.calendar.modalTitle[lang];
    subtitle = t.calendar.modalDesc[lang];
  } else if (type === 'brochure') {
    imageSrc = '/assets/posters/admission-brochure.jpg';
    downloadFileName = 'iqra-madrasah-admission-brochure.jpg';
    title =
      lang === 'bn'
        ? 'ইক্বরা মাদরাসা ভর্তি প্রসপেক্টাস ২০২৭'
        : 'Iqra Madrasah Admission Brochure 2027';
    subtitle =
      lang === 'bn'
        ? 'প্লে থেকে ৫ম শ্রেণি ও হিফজুল কুরআন বিভাগে ভর্তি তথ্য'
        : 'Admissions Open: Play to Grade 5 & Tahfizul Quran';
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

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md"
        onClick={onClose}
      >
        <m.div
          ref={panel} role="dialog" aria-modal="true" aria-labelledby="poster-modal-title" tabIndex={-1}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-auto max-w-[94vw] sm:max-w-xl md:max-w-2xl max-h-[96vh] bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-900"
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

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition shrink-0 cursor-pointer"
              aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form-fitting Scrollable Image Container with Minimal Padding */}
          <div data-lenis-prevent className="min-h-0 flex-1 overflow-auto overscroll-contain p-1.5 sm:p-2.5 bg-slate-900/5" style={{ touchAction: 'pan-x pan-y pinch-zoom' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              onError={() => setImageError(true)}
              alt={title}
              className={zoomed ? 'max-w-none w-[1066px] h-auto' : 'w-auto h-auto max-w-full mx-auto rounded-xl object-contain max-h-[70vh]'}
            />
          </div>

          {imageError && <p role="alert" className="p-3 text-sm">{lang === 'bn' ? 'ছবি লোড হয়নি। আবার চেষ্টা করুন।' : 'Image failed to load. Please try again.'}</p>}
          <button type="button" onClick={() => setZoomed(value => !value)} className="px-4 py-2 text-sm">
            {zoomed ? (lang === 'bn' ? 'স্বাভাবিক আকার' : 'Fit image') : (lang === 'bn' ? 'বড় করে দেখুন' : 'Zoom image')}
          </button>
          {/* Compact Footer Controls */}
          <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
            <span className="text-[11px] text-slate-500 hidden sm:inline font-medium">
              {lang === 'bn'
                ? 'পূর্ণ রেজোলিউশনে দেখতে ডাউনলোড করুন'
                : 'Download for full HD print quality'}
            </span>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
              <a
                href={imageSrc}
                download={downloadFileName}
                className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl font-bold text-xs sm:text-sm primary-action text-white shadow-sm transition active:scale-95 w-full sm:w-auto cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'bn' ? 'এইচডি ডাউনলোড' : 'Download HD'}</span>
              </a>

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
