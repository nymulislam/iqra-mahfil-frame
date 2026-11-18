'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Shield,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Layers,
  X,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { SPEAKERS, ORGANIZERS } from '@/content/speakers';
import type { Speaker, Organizer } from '@/content/types';

function ScholarCard({
  spk,
  lang,
  isCenter,
  colClass = '',
  onSelect,
}: {
  spk: Speaker;
  lang: 'bn' | 'en';
  isCenter: boolean;
  colClass?: string;
  onSelect: (spk: Speaker) => void;
}) {
  return (
    <div
      key={spk.id}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(spk);
      }}
      className={`catalis-card p-4 sm:p-5 lg:p-6 flex flex-col justify-between group transition-all duration-300 cursor-pointer ${colClass} ${
        isCenter
          ? 'shadow-xl shadow-sky-950/8 border-sky-300/80 ring-1 ring-sky-400/20 hover:scale-[1.03]'
          : 'border-slate-200/60 shadow-sm hover:scale-[1.02]'
      } ${spk.highlight && isCenter ? 'ring-2 ring-sky-500/30' : ''}`}
    >
      <div>
        {/* Portrait & Role Badge Row */}
        <div className="flex items-start gap-3 sm:gap-3.5 mb-3.5">
          <div
            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center ring-2 ring-black/5"
            style={{
              backgroundColor: 'var(--bg-surface-subtle)',
              borderColor: 'var(--border-card)',
            }}
          >
            {spk.photo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={spk.photo}
                alt={spk.name[lang]}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gradient-to-br from-sky-500/10 via-cyan-500/10 to-teal-500/10">
                <div
                  className="w-10 h-10 rounded-full border flex items-center justify-center shadow-2xs"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <span className="font-serif font-bold text-base text-sky-600">
                    {spk.name.bn.split(' ').slice(-1)[0][0] || 'আ'}
                  </span>
                </div>
                <span
                  className="text-[9px] font-bold mt-0.5 uppercase tracking-wider line-clamp-1 text-sky-700"
                >
                  {spk.badge ? spk.badge[lang] : 'সম্মানিত'}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            {spk.badge && (
              <span
                className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 border ${
                  spk.highlight
                    ? 'bg-sky-500/15 text-sky-800 border-sky-400/30'
                    : 'bg-teal-500/15 text-teal-800 border-teal-400/30'
                }`}
              >
                {spk.badge[lang]}
              </span>
            )}

            <h3
              className="font-serif text-base sm:text-lg lg:text-xl font-bold transition-colors leading-tight line-clamp-1 group-hover:text-sky-600"
              style={{ color: 'var(--text-main)' }}
              title={spk.name[lang]}
            >
              {spk.name[lang]}
            </h3>

            <p className="text-xs sm:text-sm font-semibold mt-0.5 line-clamp-1 text-sky-700">
              {spk.role[lang]}
            </p>
          </div>
        </div>

        {/* Title & Organization Details */}
        <div
          className="space-y-1 mb-3 pt-2.5 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <p
            className="text-xs sm:text-sm font-medium leading-relaxed line-clamp-2"
            style={{ color: 'var(--text-main)' }}
          >
            {spk.title[lang]}
          </p>
          <p
            className="text-xs leading-relaxed line-clamp-1"
            style={{ color: 'var(--text-muted)' }}
          >
            {spk.affiliation[lang]}
          </p>
        </div>
      </div>

      {/* Topic Pill or Click to View Details */}
      <div
        className="pt-2.5 border-t flex items-center justify-between"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {spk.topic ? (
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl border w-full"
            style={{
              backgroundColor: 'var(--bg-surface-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-main)',
            }}
          >
            <BookOpen className="w-3 h-3 text-sky-600 shrink-0" />
            <span className="truncate">{spk.topic[lang]}</span>
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-sky-700 hover:text-sky-900">
            {lang === 'bn' ? 'বিস্তারিত দেখতে ক্লিক করুন →' : 'Click to view details →'}
          </span>
        )}
      </div>
    </div>
  );
}

export function Speakers() {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'speakers' | 'organizers'>('speakers');
  const [selectedProfile, setSelectedProfile] = useState<Speaker | Organizer | null>(null);

  // Desktop row index (0..3, 3 items per row)
  const [activeRow, setActiveRow] = useState<number>(0);
  // Mobile single speaker index (0..9)
  const [activeMobileIndex, setActiveMobileIndex] = useState<number>(0);

  const desktopStageRef = useRef<HTMLDivElement>(null);
  const mobileStageRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const wheelLockRef = useRef<boolean>(false);

  // 10 speakers partitioned into 4 rows for desktop (3, 3, 3, 1)
  const rows = [
    SPEAKERS.slice(0, 3),
    SPEAKERS.slice(3, 6),
    SPEAKERS.slice(6, 9),
    SPEAKERS.slice(9, 10),
  ];
  const totalRows = rows.length;
  const totalMobileSpeakers = SPEAKERS.length;

  const nextRow = useCallback(() => {
    setActiveRow((prev) => Math.min(totalRows - 1, prev + 1));
  }, [totalRows]);

  const prevRow = useCallback(() => {
    setActiveRow((prev) => Math.max(0, prev - 1));
  }, []);

  const nextMobileSpeaker = useCallback(() => {
    setActiveMobileIndex((prev) => Math.min(totalMobileSpeakers - 1, prev + 1));
  }, [totalMobileSpeakers]);

  const prevMobileSpeaker = useCallback(() => {
    setActiveMobileIndex((prev) => Math.max(0, prev - 1));
  }, []);

  // Desktop wheel listener
  useEffect(() => {
    const el = desktopStageRef.current;
    if (!el || activeTab !== 'speakers') return;

    const handleWheel = (e: WheelEvent) => {
      if (wheelLockRef.current) return;

      if (e.deltaY > 25) {
        if (activeRow < totalRows - 1) {
          e.preventDefault();
          nextRow();
          wheelLockRef.current = true;
          setTimeout(() => {
            wheelLockRef.current = false;
          }, 380);
        }
      } else if (e.deltaY < -25) {
        if (activeRow > 0) {
          e.preventDefault();
          prevRow();
          wheelLockRef.current = true;
          setTimeout(() => {
            wheelLockRef.current = false;
          }, 380);
        }
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [activeRow, totalRows, activeTab, nextRow, prevRow]);

  // Mobile wheel & touch listener
  useEffect(() => {
    const el = mobileStageRef.current;
    if (!el || activeTab !== 'speakers') return;

    const handleWheel = (e: WheelEvent) => {
      if (wheelLockRef.current) return;

      if (e.deltaY > 25) {
        if (activeMobileIndex < totalMobileSpeakers - 1) {
          e.preventDefault();
          nextMobileSpeaker();
          wheelLockRef.current = true;
          setTimeout(() => {
            wheelLockRef.current = false;
          }, 350);
        }
      } else if (e.deltaY < -25) {
        if (activeMobileIndex > 0) {
          e.preventDefault();
          prevMobileSpeaker();
          wheelLockRef.current = true;
          setTimeout(() => {
            wheelLockRef.current = false;
          }, 350);
        }
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [activeMobileIndex, totalMobileSpeakers, activeTab, nextMobileSpeaker, prevMobileSpeaker]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleMobileTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY < -35) {
      nextMobileSpeaker();
    } else if (deltaY > 35) {
      prevMobileSpeaker();
    }
    touchStartY.current = null;
  };

  return (
    <section
      id="speakers"
      className="py-16 md:py-24 relative overflow-hidden border-b transition-colors duration-500"
      style={{
        backgroundColor: 'var(--bg-page)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2
            className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.25] sm:leading-[1.2] mb-3 overflow-visible"
            style={{ color: 'var(--text-main)' }}
          >
            {lang === 'bn' ? (
              <>
                আমন্ত্রিত প্রখ্যাত মুফাসসির ও{' '}
                <span className="text-sky-700 font-bold block sm:inline-block pr-4">ওলামায়ে কেরাম</span>
              </>
            ) : (
              <>
                Distinguished Scholars &{' '}
                <span className="text-sky-700 font-bold block sm:inline-block pr-4">Eminent Guests</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {t.speakers.sectionDesc[lang]}
          </p>
        </div>

        {/* Switcher Tabs: Speakers vs Organizers */}
        <div className="flex justify-center mb-8">
          <div
            className="inline-flex p-1.5 rounded-full border shadow-2xs"
            style={{
              backgroundColor: 'var(--bg-surface-subtle)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setActiveTab('speakers')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'speakers'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'hover:opacity-100 opacity-70'
              }`}
              style={{
                color: activeTab === 'speakers' ? '#ffffff' : 'var(--text-main)',
                backgroundColor: activeTab === 'speakers' ? 'var(--accent-primary)' : 'transparent',
              }}
            >
              <Award className="w-4 h-4 text-sky-300" />
              <span>{lang === 'bn' ? 'আমন্ত্রিত আলোচকবৃন্দ' : 'Keynote Scholars'}</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full ml-1 font-mono">
                {SPEAKERS.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('organizers')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'organizers'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'hover:opacity-100 opacity-70'
              }`}
              style={{
                color: activeTab === 'organizers' ? '#ffffff' : 'var(--text-main)',
                backgroundColor: activeTab === 'organizers' ? 'var(--accent-primary)' : 'transparent',
              }}
            >
              <Shield className="w-4 h-4 text-cyan-300" />
              <span>{lang === 'bn' ? 'আয়োজক ও তত্ত্বাবধায়ক' : 'Organizers & Leadership'}</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full ml-1 font-mono">
                {ORGANIZERS.length}
              </span>
            </button>
          </div>
        </div>

        {/* --- SPEAKERS 3-LINE 3D ROLLER STAGE --- */}
        {activeTab === 'speakers' && (
          <div className="space-y-4">
            {/* ================= DESKTOP 3-LINE ROLLER STAGE (MD+) ================= */}
            <div className="hidden md:block space-y-3">
              {/* Desktop Stepper Control Bar */}
              <div className="flex items-center justify-between gap-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-sky-500/10 text-sky-700 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block leading-tight">
                      {lang === 'bn' ? 'আমন্ত্রিত ১০ জন ওলামায়ে কেরাম' : '10 Distinguished Scholars'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {lang === 'bn'
                        ? 'কার্ডে ক্লিক করে বিস্তারিত জানুন • মাউস স্ক্রল করে পরবর্তী সারি দেখুন'
                        : 'Click any scholar for full bio • Scroll to navigate rows'}
                    </span>
                  </div>
                </div>

                {/* 3D Row Stepper Buttons & Row Indicator */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-600 mr-1">
                      {lang === 'bn'
                        ? `সারি ০${activeRow + 1} / ০${totalRows}`
                        : `Row 0${activeRow + 1} / 0${totalRows}`}
                    </span>
                    {rows.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveRow(i)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          activeRow === i
                            ? 'w-5 bg-sky-600'
                            : 'w-2 bg-slate-300 hover:bg-slate-400'
                        }`}
                        title={`Go to row ${i + 1}`}
                      />
                    ))}
                  </div>

                  <div className="inline-flex items-center p-1 rounded-full bg-white border border-slate-200/90 shadow-xs">
                    <button
                      onClick={prevRow}
                      disabled={activeRow === 0}
                      className={`p-1.5 rounded-full transition-all ${
                        activeRow > 0
                          ? 'text-slate-800 hover:bg-slate-100 active:scale-90 cursor-pointer'
                          : 'text-slate-300 cursor-not-allowed opacity-40'
                      }`}
                      title={lang === 'bn' ? 'আগের সারি' : 'Previous row'}
                      aria-label="Previous row"
                    >
                      <ChevronUp className="w-4 h-4" strokeWidth={2.4} />
                    </button>

                    <button
                      onClick={nextRow}
                      disabled={activeRow === totalRows - 1}
                      className={`p-1.5 rounded-full transition-all ${
                        activeRow < totalRows - 1
                          ? 'text-sky-700 hover:bg-sky-50 active:scale-90 cursor-pointer ring-1 ring-sky-300/40'
                          : 'text-slate-300 cursor-not-allowed opacity-40'
                      }`}
                      title={lang === 'bn' ? 'পরের সারি' : 'Next row'}
                      aria-label="Next row"
                    >
                      <ChevronDown className="w-4 h-4" strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Viewport with 3-Line Depth */}
              <div
                ref={desktopStageRef}
                className="relative h-[660px] rounded-3xl border border-sky-100/90 bg-gradient-to-b from-slate-50/40 via-white to-slate-50/40 shadow-xs overflow-hidden select-none"
              >
                {/* Top Frosted Fade Mask */}
                <div className="pointer-events-none absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-[var(--bg-page)] via-[var(--bg-page)]/80 to-transparent z-30 rounded-t-3xl" />

                {/* Bottom Frosted Fade Mask */}
                <div className="pointer-events-none absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[var(--bg-page)] via-[var(--bg-page)]/80 to-transparent z-30 rounded-b-3xl" />

                {/* Peeking Next Row Floating Indicator Pill */}
                {activeRow < totalRows - 1 && (
                  <div className="pointer-events-none absolute bottom-3 inset-x-0 z-40 flex justify-center">
                    <button
                      onClick={nextRow}
                      className="pointer-events-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white text-sky-900 border border-sky-200/90 shadow-md hover:shadow-lg hover:border-sky-300 active:scale-95 transition-all animate-bounce cursor-pointer"
                    >
                      <span>{lang === 'bn' ? 'পরবর্তী সারি দেখুন (স্ক্রল করুন)' : 'Scroll or click for next row'}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-sky-600" />
                    </button>
                  </div>
                )}

                {/* 3D Stacked Rows Container */}
                <div className="relative w-full h-full flex items-center justify-center p-5">
                  {rows.map((rowItems, rowIndex) => {
                    const offset = rowIndex - activeRow;
                    if (Math.abs(offset) > 1) return null;

                    const isCenter = offset === 0;
                    const isTop = offset === -1;
                    const isBottom = offset === 1;

                    const translateY = offset * 290;
                    const scale = isCenter ? 1.0 : 0.88;
                    const opacity = isCenter ? 1.0 : 0.35;
                    const blur = isCenter ? 'blur(0px)' : 'blur(0.8px)';

                    return (
                      <motion.div
                        key={rowIndex}
                        initial={false}
                        animate={{
                          y: translateY,
                          scale: scale,
                          opacity: opacity,
                          filter: blur,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 280,
                          damping: 28,
                        }}
                        onClick={() => {
                          if (isTop) prevRow();
                          if (isBottom) nextRow();
                        }}
                        className={`absolute inset-x-5 transition-shadow ${
                          isCenter
                            ? 'z-20 pointer-events-auto'
                            : 'z-10 cursor-pointer hover:opacity-60'
                        }`}
                      >
                        <div className="grid grid-cols-3 gap-5">
                          {rowItems.map((spk) => {
                            const isSingleCard = rowItems.length === 1;
                            const colClass = isSingleCard ? 'col-start-2' : '';

                            return (
                              <ScholarCard
                                key={spk.id}
                                spk={spk}
                                lang={lang}
                                isCenter={isCenter}
                                colClass={colClass}
                                onSelect={(s) => setSelectedProfile(s)}
                              />
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ================= MOBILE 3-LINE ROLLER STAGE (< MD) ================= */}
            <div className="block md:hidden space-y-3">
              {/* Mobile Stepper Control Bar */}
              <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-700 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {lang === 'bn' ? 'আমন্ত্রিত ১০ জন বক্তা' : '10 Scholars'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-full border border-slate-200/80">
                    {lang === 'bn'
                      ? `বক্তা ০${activeMobileIndex + 1} / ১০`
                      : `${activeMobileIndex + 1} / 10`}
                  </span>

                  <div className="inline-flex items-center p-0.5 rounded-full bg-white border border-slate-200 shadow-2xs">
                    <button
                      onClick={prevMobileSpeaker}
                      disabled={activeMobileIndex === 0}
                      className={`p-1 rounded-full transition-all ${
                        activeMobileIndex > 0
                          ? 'text-slate-800 hover:bg-slate-100 active:scale-90 cursor-pointer'
                          : 'text-slate-300 opacity-40'
                      }`}
                      aria-label="Previous scholar"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={nextMobileSpeaker}
                      disabled={activeMobileIndex === totalMobileSpeakers - 1}
                      className={`p-1 rounded-full transition-all ${
                        activeMobileIndex < totalMobileSpeakers - 1
                          ? 'text-sky-700 hover:bg-sky-50 active:scale-90 cursor-pointer'
                          : 'text-slate-300 opacity-40'
                      }`}
                      aria-label="Next scholar"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Viewport with 3-Line Depth */}
              <div
                ref={mobileStageRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleMobileTouchEnd}
                className="relative h-[480px] rounded-2xl border border-sky-100/90 bg-gradient-to-b from-slate-50/40 via-white to-slate-50/40 shadow-xs overflow-hidden select-none"
              >
                {/* Top Frosted Fade Mask */}
                <div className="pointer-events-none absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[var(--bg-page)] via-[var(--bg-page)]/80 to-transparent z-30 rounded-t-2xl" />

                {/* Bottom Frosted Fade Mask */}
                <div className="pointer-events-none absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[var(--bg-page)] via-[var(--bg-page)]/80 to-transparent z-30 rounded-b-2xl" />

                {/* Peeking Next Indicator */}
                {activeMobileIndex < totalMobileSpeakers - 1 && (
                  <div className="pointer-events-none absolute bottom-2 inset-x-0 z-40 flex justify-center">
                    <button
                      onClick={nextMobileSpeaker}
                      className="pointer-events-auto inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-white text-sky-900 border border-sky-200/90 shadow-xs animate-bounce cursor-pointer"
                    >
                      <span>{lang === 'bn' ? 'পরবর্তী বক্তা (টানুন বা ক্লিক)' : 'Next scholar'}</span>
                      <ChevronDown className="w-3 h-3 text-sky-600" />
                    </button>
                  </div>
                )}

                {/* 3D Stacked Cards Container */}
                <div className="relative w-full h-full flex items-center justify-center p-3">
                  {SPEAKERS.map((spk, idx) => {
                    const offset = idx - activeMobileIndex;
                    if (Math.abs(offset) > 1) return null;

                    const isCenter = offset === 0;
                    const isTop = offset === -1;
                    const isBottom = offset === 1;

                    const translateY = offset * 215;
                    const scale = isCenter ? 1.0 : 0.88;
                    const opacity = isCenter ? 1.0 : 0.35;
                    const blur = isCenter ? 'blur(0px)' : 'blur(0.8px)';

                    return (
                      <motion.div
                        key={spk.id}
                        initial={false}
                        animate={{
                          y: translateY,
                          scale: scale,
                          opacity: opacity,
                          filter: blur,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 280,
                          damping: 28,
                        }}
                        onClick={() => {
                          if (isTop) prevMobileSpeaker();
                          if (isBottom) nextMobileSpeaker();
                        }}
                        className={`absolute inset-x-3 transition-shadow ${
                          isCenter
                            ? 'z-20 pointer-events-auto'
                            : 'z-10 cursor-pointer hover:opacity-60'
                        }`}
                      >
                        <ScholarCard
                          spk={spk}
                          lang={lang}
                          isCenter={isCenter}
                          onSelect={(s) => setSelectedProfile(s)}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- ORGANIZERS TAB --- */}
        {activeTab === 'organizers' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ORGANIZERS.map((org, idx) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedProfile(org)}
                className="catalis-card p-6 sm:p-7 flex flex-col justify-between group hover:scale-[1.03] transition-all duration-300 cursor-pointer"
              >
                <div>
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300 p-1 flex items-center justify-center"
                      style={{
                        backgroundColor: 'var(--bg-surface-subtle)',
                        borderColor: 'var(--border-subtle)',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={org.photo || '/assets/logo.png'}
                        alt={org.name[lang]}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 bg-sky-500/15 text-sky-800 border border-sky-400/30">
                        {org.role[lang]}
                      </span>

                      <h3
                        className="font-serif text-lg sm:text-xl font-bold transition-colors leading-tight group-hover:text-sky-600"
                        style={{ color: 'var(--text-main)' }}
                      >
                        {org.name[lang]}
                      </h3>

                      <p className="text-xs sm:text-sm font-semibold mt-1 text-sky-700">
                        {org.title[lang]}
                      </p>
                    </div>
                  </div>

                  <div
                    className="space-y-2 mb-2 pt-3 border-t"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <p
                      className="text-xs sm:text-sm leading-relaxed"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {org.affiliation[lang]}
                    </p>
                  </div>
                </div>

                <div
                  className="pt-3 border-t flex items-center justify-between"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <span className="text-xs font-bold text-sky-800">
                    {lang === 'bn' ? 'বিস্তারিত প্রোফাইল' : 'View Profile'}
                  </span>
                  <span className="text-xs font-bold text-sky-700">
                    {lang === 'bn' ? 'ইক্বরা ইন্টারন্যাশনাল মাদরাসা' : 'Iqra International'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ================= SCHOLAR / ORGANIZER DETAIL MODAL ================= */}
      <AnimatePresence>
        {selectedProfile && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setSelectedProfile(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-900"
            >
              {/* Modal Top Hero Area */}
              <div className="relative bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-6 sm:p-7 text-white">
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-sky-400/60 shadow-lg shrink-0 bg-slate-800 flex items-center justify-center">
                    {'photo' in selectedProfile && selectedProfile.photo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={selectedProfile.photo}
                        alt={selectedProfile.name[lang]}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <span className="font-serif font-bold text-2xl text-sky-300">
                        {selectedProfile.name.bn.split(' ').slice(-1)[0][0] || 'আ'}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    {selectedProfile.badge && (
                      <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 bg-sky-400/20 text-sky-300 border border-sky-400/40">
                        {selectedProfile.badge[lang]}
                      </span>
                    )}
                    <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight text-white">
                      {selectedProfile.name[lang]}
                    </h3>
                    <p className="text-xs sm:text-sm text-sky-300 font-semibold mt-1">
                      {selectedProfile.role[lang]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body Info */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Official Designation */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    {lang === 'bn' ? 'পদবী ও পরিচিতি' : 'Designation & Title'}
                  </span>
                  <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {selectedProfile.title[lang]}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {selectedProfile.affiliation[lang]}
                  </p>
                </div>

                {/* Keynote Topic (if Scholar) */}
                {'topic' in selectedProfile && selectedProfile.topic && (
                  <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-300/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-900 block mb-1 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                      <span>{lang === 'bn' ? 'আলোচনার মূল বিষয়' : 'Keynote Discussion Topic'}</span>
                    </span>
                    <p className="text-sm font-bold text-sky-950 leading-relaxed">
                      {selectedProfile.topic[lang]}
                    </p>
                  </div>
                )}

                {/* Event Schedule Info */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>{lang === 'bn' ? '৫ ডিসেম্বর ২০২৬, শনিবার' : 'Saturday, Dec 5, 2026'}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{lang === 'bn' ? 'মাদরাসা বালুর মাঠ' : 'Balur Math Grounds'}</span>
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-white hover:bg-black transition cursor-pointer"
                >
                  {t.calendar.close[lang]}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
