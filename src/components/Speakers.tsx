'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'motion/react';
import {
  Award,
  Shield,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Layers,
  X,
  Building2,
} from 'lucide-react';
import { formatNumber } from '@/lib/numbers';
import { useLanguage } from '@/context/LanguageContext';
import { SPEAKERS, ORGANIZERS } from '@/content/speakers';
import type { Speaker, Organizer } from '@/content/types';
import { ScrollReveal, EASE_SMOOTH } from './ScrollReveal';
import { SmartImage } from './SmartImage';
import { useScrollLock } from './SmoothScroll';

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
      className={`catalis-card p-3.5 sm:p-4 lg:p-5 flex flex-col justify-between group transition-shadow duration-300 cursor-pointer ${colClass} ${
        isCenter
          ? 'shadow-lg shadow-sky-950/6 border-sky-300/80 ring-1 ring-sky-400/20 hover:border-sky-400'
          : 'border-slate-200/70 shadow-xs'
      } ${spk.highlight && isCenter ? 'ring-2 ring-sky-500/25' : ''}`}
    >
      <div>
        {/* Portrait & Role Badge Row */}
        <div className="flex items-start gap-3 mb-2.5">
          <div
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border shadow-2xs shrink-0 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center ring-1 ring-black/5"
            style={{
              backgroundColor: 'var(--bg-surface-subtle)',
              borderColor: 'var(--border-card)',
            }}
          >
            {spk.photo ? (
              <SmartImage
                src={spk.photo}
                alt={spk.name[lang]}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-1.5 text-center bg-gradient-to-br from-sky-500/10 via-cyan-500/10 to-teal-500/10">
                <div
                  className="w-8 h-8 rounded-full border flex items-center justify-center shadow-2xs"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <span className="font-serif font-bold text-sm text-sky-600">
                    {spk.name[lang].split(' ').slice(-1)[0][0]}
                  </span>
                </div>
                <span className="text-[8px] font-bold mt-0.5 uppercase tracking-wider line-clamp-1 text-sky-700">
                  {spk.badge ? spk.badge[lang] : 'সম্মানিত'}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            {spk.badge && (
              <span
                className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 border ${
                  spk.highlight
                    ? 'bg-sky-500/15 text-sky-800 border-sky-400/30'
                    : 'bg-teal-500/15 text-sky-800 border-teal-400/30'
                }`}
              >
                {spk.badge[lang]}
              </span>
            )}

            <h3
              className="font-serif text-base sm:text-lg font-bold transition-colors leading-snug line-clamp-1 group-hover:text-sky-600"
              style={{ color: 'var(--text-main)' }}
              title={spk.name[lang]}
            >
              {spk.name[lang]}
            </h3>

            <p className="text-xs font-semibold mt-0.5 line-clamp-1 text-sky-700">
              {spk.role[lang]}
            </p>
          </div>
        </div>

        {/* Title & Organization Details */}
        <div
          className="space-y-0.5 mb-2.5 pt-2 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <p
            className="text-xs sm:text-[13px] font-medium leading-snug line-clamp-1"
            style={{ color: 'var(--text-main)' }}
            title={spk.title[lang]}
          >
            {spk.title[lang]}
          </p>
          <p
            className="text-[11.5px] leading-snug line-clamp-1"
            style={{ color: 'var(--text-muted)' }}
            title={spk.affiliation[lang]}
          >
            {spk.affiliation[lang]}
          </p>
        </div>
      </div>

      {/* Topic Pill or Click to View Details */}
      <div
        className="pt-2 border-t flex items-center justify-between"
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
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl border w-full text-sky-700 bg-sky-50/50 border-sky-100">
            <BookOpen className="w-3 h-3 text-sky-600 shrink-0" />
            <span className="truncate">
              {lang === 'bn' ? 'বিস্তারিত পরিচিতি দেখতে ট্যাপ করুন →' : 'Tap to view scholar details →'}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

// Shared hook to lock wheel & vertical touch-swipe inside a stage until its first/last item is reached
function useStageScrollLock(
  stageRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  activeIndex: number,
  maxIndex: number,
  setIndex: React.Dispatch<React.SetStateAction<number>>
) {
  const indexRef = useRef(activeIndex);
  indexRef.current = activeIndex;

  const stepLockUntilRef = useRef(0);
  const boundaryHoldUntilRef = useRef(0);
  const wheelAccumRef = useRef(0);
  const lastWheelDirRef = useRef(0);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || !enabled) return;

    const stepBy = (dir: 1 | -1, now: number) => {
      const curr = indexRef.current;
      const next = Math.max(0, Math.min(maxIndex, curr + dir));
      if (next === curr) return false;
      indexRef.current = next;
      setIndex(next);
      stepLockUntilRef.current = now + 300;
      if (next === maxIndex || next === 0) {
        boundaryHoldUntilRef.current = now + 460;
      }
      return true;
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const dir: 1 | -1 | 0 = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
      if (dir === 0) return;

      const now = Date.now();
      const curr = indexRef.current;
      const canAdvance = (dir === 1 && curr < maxIndex) || (dir === -1 && curr > 0);
      const inBoundaryHold = now < boundaryHoldUntilRef.current && dir === lastWheelDirRef.current;

      if (!canAdvance && !inBoundaryHold) {
        wheelAccumRef.current = 0;
        return; // At first/last card and hold expired -> allow smooth page scroll
      }

      // Lock page scroll completely while advancing or holding at boundary
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      (e as unknown as { lenisStopPropagation?: boolean }).lenisStopPropagation = true;

      if (!canAdvance) return;
      if (now < stepLockUntilRef.current) return;

      if (lastWheelDirRef.current !== dir) {
        wheelAccumRef.current = 0;
        lastWheelDirRef.current = dir;
      }

      wheelAccumRef.current += e.deltaY;
      if (Math.abs(wheelAccumRef.current) >= 22) {
        wheelAccumRef.current = 0;
        stepBy(dir, now);
      }
    };

    let touchState: {
      startX: number;
      startY: number;
      mode: 'undecided' | 'consume' | 'passthrough';
      dir: 1 | -1 | 0;
      stepped: boolean;
    } | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        touchState = null;
        return;
      }
      touchState = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        mode: 'undecided',
        dir: 0,
        stepped: false,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchState || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - touchState.startX;
      const dy = e.touches[0].clientY - touchState.startY;

      if (touchState.mode === 'undecided') {
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= 4) {
          touchState.mode = 'passthrough';
          return;
        }
        if (Math.abs(dy) >= 1 && Math.abs(dy) >= Math.abs(dx)) {
          // dy < 0 means bottom-to-top swipe (next card); dy > 0 means top-to-bottom swipe (prev card)
          const dir: 1 | -1 = dy < 0 ? 1 : -1;
          const curr = indexRef.current;
          const canAdvance = (dir === 1 && curr < maxIndex) || (dir === -1 && curr > 0);
          if (canAdvance) {
            // Immediately block native page scroll on the very first vertical pixel
            if (e.cancelable) e.preventDefault();
            e.stopPropagation();
            (e as unknown as { lenisStopPropagation?: boolean }).lenisStopPropagation = true;
            if (Math.abs(dy) >= 4) {
              touchState.mode = 'consume';
              touchState.dir = dir;
            }
          } else {
            touchState.mode = 'passthrough';
          }
          return;
        }
      }

      if (touchState.mode === 'consume') {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        (e as unknown as { lenisStopPropagation?: boolean }).lenisStopPropagation = true;

        if (!touchState.stepped && Math.abs(dy) >= 26) {
          const dir: 1 | -1 = dy < 0 ? 1 : -1;
          touchState.stepped = true;
          stepBy(dir, Date.now());
        }
      }
    };

    const handleTouchEnd = () => {
      touchState = null;
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [stageRef, enabled, maxIndex, setIndex]);
}

export function Speakers() {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'speakers' | 'organizers'>('speakers');
  const [selectedProfile, setSelectedProfile] = useState<Speaker | Organizer | null>(null);
  useScrollLock(Boolean(selectedProfile));

  // Desktop row index (0..3, 3 items per row)
  const [activeRow, setActiveRow] = useState<number>(0);
  // Mobile single speaker index (0..9)
  const [activeMobileIndex, setActiveMobileIndex] = useState<number>(0);

  const desktopStageRef = useRef<HTMLDivElement>(null);
  const mobileStageRef = useRef<HTMLDivElement>(null);

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

  useStageScrollLock(desktopStageRef, activeTab === 'speakers', activeRow, totalRows - 1, setActiveRow);
  useStageScrollLock(
    mobileStageRef,
    activeTab === 'speakers',
    activeMobileIndex,
    totalMobileSpeakers - 1,
    setActiveMobileIndex
  );

  const isDesktopAtEnd = activeRow === totalRows - 1;
  const isMobileAtEnd = activeMobileIndex === totalMobileSpeakers - 1;

  return (
    <section
      id="speakers"
      className="py-10 sm:py-14 md:py-16 relative overflow-hidden border-b transition-colors duration-500"
      style={{
        backgroundColor: 'var(--bg-page)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal y={14}>
        <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-7">
          <h2
            className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.25] sm:leading-[1.2] mb-2 overflow-visible"
            style={{ color: 'var(--text-main)' }}
          >
            {lang === 'bn' ? (
              <>
                আমন্ত্রিত প্রখ্যাত মুফাসসির ও{' '}
                <span className="text-sky-700 font-bold block sm:inline-block sm:pr-2">ওলামায়ে কেরাম</span>
              </>
            ) : (
              <>
                Distinguished Scholars &{' '}
                <span className="text-sky-700 font-bold block sm:inline-block sm:pr-2">Eminent Guests</span>
              </>
            )}
          </h2>

          <p className="text-xs sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {t.speakers.sectionDesc[lang]}
          </p>
        </div>
        </ScrollReveal>

        {/* Switcher Tabs: Speakers vs Organizers */}
        <ScrollReveal y={12} delay={0.04}>
        <div className="flex justify-center mb-5 sm:mb-6">
          <div
            className="grid grid-cols-2 w-full max-w-md sm:w-auto sm:max-w-none sm:inline-flex p-1 sm:p-1.5 rounded-full border shadow-2xs"
            style={{
              backgroundColor: 'var(--bg-surface-subtle)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('speakers')}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-sm font-bold leading-tight whitespace-nowrap transition-all duration-300 cursor-pointer min-w-0 ${
                activeTab === 'speakers' ? 'shadow-md' : 'hover:opacity-100 opacity-80'
              }`}
              style={{
                color: activeTab === 'speakers' ? '#ffffff' : 'var(--text-main)',
                backgroundColor: activeTab === 'speakers' ? 'var(--accent-primary)' : 'transparent',
              }}
            >
              <Award
                className={`hidden min-[380px]:block w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                  activeTab === 'speakers' ? 'text-sky-200' : 'text-sky-600'
                }`}
              />
              {lang === 'bn' ? (
                <span>আমন্ত্রিত আলোচকবৃন্দ</span>
              ) : (
                <>
                  <span className="sm:hidden">Scholars</span>
                  <span className="hidden sm:inline">Keynote Scholars</span>
                </>
              )}
              <span
                className={`text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-mono font-bold ${
                  activeTab === 'speakers'
                    ? 'bg-white/20 text-white'
                    : 'bg-sky-500/12 text-sky-800 border border-sky-300/40'
                }`}
              >
                {formatNumber(SPEAKERS.length, lang)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('organizers')}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-sm font-bold leading-tight whitespace-nowrap transition-all duration-300 cursor-pointer min-w-0 ${
                activeTab === 'organizers' ? 'shadow-md' : 'hover:opacity-100 opacity-80'
              }`}
              style={{
                color: activeTab === 'organizers' ? '#ffffff' : 'var(--text-main)',
                backgroundColor: activeTab === 'organizers' ? 'var(--accent-primary)' : 'transparent',
              }}
            >
              <Shield
                className={`hidden min-[380px]:block w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                  activeTab === 'organizers' ? 'text-cyan-200' : 'text-sky-600'
                }`}
              />
              {lang === 'bn' ? (
                <span>আয়োজক ও তত্ত্বাবধায়ক</span>
              ) : (
                <>
                  <span className="sm:hidden">Organizers</span>
                  <span className="hidden sm:inline">Organizers & Leadership</span>
                </>
              )}
              <span
                className={`text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-mono font-bold ${
                  activeTab === 'organizers'
                    ? 'bg-white/20 text-white'
                    : 'bg-sky-500/12 text-sky-800 border border-sky-300/40'
                }`}
              >
                {formatNumber(ORGANIZERS.length, lang)}
              </span>
            </button>
          </div>
        </div>
        </ScrollReveal>

        {/* --- SPEAKERS ROLLER STAGE (Compact, Top-Aligned, Zero Empty Space) --- */}
        <ScrollReveal y={16} delay={0.08}>
        {activeTab === 'speakers' && (
          <div className="space-y-2.5">
            {/* ================= DESKTOP ROLLER STAGE (MD+) ================= */}
            <div className="hidden md:block space-y-2.5">
              {/* Desktop Stepper Control Bar */}
              <div className="flex items-center justify-between gap-3 px-2">
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
                        ? 'কার্ডে ক্লিক করে বিস্তারিত জানুন • মাউস স্ক্রল করে শেষ সারি পর্যন্ত দেখুন'
                        : 'Click any scholar for full bio • Scroll inside to view all rows'}
                    </span>
                  </div>
                </div>

                {/* Row Stepper Buttons & Row Indicator */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-600 mr-1">
                      {lang === 'bn'
                        ? `সারি ${formatNumber(activeRow + 1, lang, 2, false)} / ${formatNumber(totalRows, lang, 2, false)}`
                        : `Row 0${activeRow + 1} / 0${totalRows}`}
                    </span>
                    {rows.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveRow(i)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          activeRow === i ? 'w-5 bg-sky-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                        }`}
                        title={lang === 'bn' ? `সারি ${formatNumber(i + 1, lang)}` : `Go to row ${i + 1}`}
                      />
                    ))}
                  </div>

                  <div className="inline-flex items-center p-1 rounded-full bg-white border border-slate-200/90 shadow-xs">
                    <button
                      type="button"
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
                      type="button"
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

              {/* Desktop Viewport (Top-aligned, compact height, zero wasted top space) */}
              <div
                ref={desktopStageRef}
                className="relative h-[305px] rounded-3xl border border-sky-100/90 bg-gradient-to-b from-white via-white to-slate-50/60 shadow-xs overflow-hidden select-none"
              >
                {/* Top Fade Mask (only when last row is active and previous row peeks at top) */}
                {isDesktopAtEnd && (
                  <div className="pointer-events-none absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[var(--bg-page)]/90 to-transparent z-30 rounded-t-3xl" />
                )}

                {/* Bottom Fade Mask (when next row peeks at bottom) */}
                {!isDesktopAtEnd && (
                  <div className="pointer-events-none absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[var(--bg-page)] via-[var(--bg-page)]/80 to-transparent z-30 rounded-b-3xl" />
                )}

                {/* Peeking Next / Previous Row Floating Pill */}
                {!isDesktopAtEnd ? (
                  <div className="pointer-events-none absolute bottom-2.5 inset-x-0 z-40 flex justify-center">
                    <button
                      type="button"
                      onClick={nextRow}
                      className="pointer-events-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white text-sky-900 border border-sky-200/90 shadow-md hover:shadow-lg hover:border-sky-300 active:scale-95 transition-all cursor-pointer"
                    >
                      <span>{lang === 'bn' ? 'পরবর্তী সারি দেখুন (স্ক্রল করুন)' : 'Scroll or click for next row'}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-sky-600" />
                    </button>
                  </div>
                ) : (
                  <div className="pointer-events-none absolute top-2.5 inset-x-0 z-40 flex justify-center">
                    <button
                      type="button"
                      onClick={prevRow}
                      className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-sky-900 border border-sky-200/90 shadow-sm hover:border-sky-300 active:scale-95 transition-all cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5 text-sky-600" />
                      <span>{lang === 'bn' ? 'আগের সারি দেখুন' : 'Previous row'}</span>
                    </button>
                  </div>
                )}

                {/* Stacked Rows Container */}
                <div className="relative w-full h-full px-4 pt-3.5">
                  {rows.map((rowItems, rowIndex) => {
                    const offset = rowIndex - activeRow;
                    if (Math.abs(offset) > 1) return null;

                    const isCenter = offset === 0;
                    const isTop = offset === -1;
                    const isBottom = offset === 1;

                    // When not at the end: active row sits right at top (y=0), next row peeks below (y=220).
                    // When at the final row: previous row peeks at top (y=0), final row sits cleanly at y=58.
                    const translateY = isDesktopAtEnd
                      ? isCenter
                        ? 58
                        : isTop
                          ? 0
                          : 260
                      : isCenter
                        ? 0
                        : isBottom
                          ? 220
                          : -220;

                    const scale = isCenter ? 1.0 : 0.96;
                    const opacity = isCenter
                      ? 1.0
                      : (isDesktopAtEnd && isTop) || (!isDesktopAtEnd && isBottom)
                        ? 0.42
                        : 0;

                    return (
                      <m.div
                        key={rowIndex}
                        initial={false}
                        animate={{
                          y: translateY,
                          scale,
                          opacity,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 320,
                          damping: 30,
                        }}
                        onClick={() => {
                          if (isTop) prevRow();
                          if (isBottom) nextRow();
                        }}
                        style={{ willChange: 'transform, opacity' }}
                        className={`absolute inset-x-4 top-3.5 ${
                          isCenter
                            ? 'z-20 pointer-events-auto'
                            : opacity > 0
                              ? 'z-10 cursor-pointer hover:opacity-65'
                              : 'z-0 pointer-events-none'
                        }`}
                      >
                        <div className="grid grid-cols-3 gap-4">
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
                      </m.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ================= MOBILE ROLLER STAGE (< MD) ================= */}
            <div className="block md:hidden space-y-2">
              {/* Mobile Stepper Control Bar */}
              <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-700 flex items-center justify-center shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {lang === 'bn' ? 'আমন্ত্রিত ১০ জন বক্তা' : '10 Scholars'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/80">
                    {lang === 'bn'
                      ? `বক্তা ${formatNumber(activeMobileIndex + 1, lang, 2, false)} / ${formatNumber(SPEAKERS.length, lang, 2, false)}`
                      : `${activeMobileIndex + 1} / ${SPEAKERS.length}`}
                  </span>

                  <div className="inline-flex items-center p-0.5 rounded-full bg-white border border-slate-200 shadow-2xs">
                    <button
                      type="button"
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
                      type="button"
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

              {/* Mobile Viewport (Top-aligned, compact height, zero empty top space) */}
              <div
                ref={mobileStageRef}
                className="relative h-[278px] rounded-2xl border border-sky-100/90 bg-gradient-to-b from-white via-white to-slate-50/60 shadow-xs overflow-hidden select-none"
              >
                {/* Top Fade Mask (only on final speaker when previous speaker peeks at top) */}
                {isMobileAtEnd && (
                  <div className="pointer-events-none absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[var(--bg-page)]/90 to-transparent z-30 rounded-t-2xl" />
                )}

                {/* Bottom Fade Mask (when next speaker peeks at bottom) */}
                {!isMobileAtEnd && (
                  <div className="pointer-events-none absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[var(--bg-page)] via-[var(--bg-page)]/85 to-transparent z-30 rounded-b-2xl" />
                )}

                {/* Peeking Next / Previous Indicator */}
                {!isMobileAtEnd ? (
                  <div className="pointer-events-none absolute bottom-2 inset-x-0 z-40 flex justify-center">
                    <button
                      type="button"
                      onClick={nextMobileSpeaker}
                      className="pointer-events-auto inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-white text-sky-900 border border-sky-200/90 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <span>{lang === 'bn' ? 'পরবর্তী বক্তা (উপরে সোয়াইপ বা ট্যাপ)' : 'Swipe up or tap for next'}</span>
                      <ChevronDown className="w-3 h-3 text-sky-600" />
                    </button>
                  </div>
                ) : (
                  <div className="pointer-events-none absolute top-2 inset-x-0 z-40 flex justify-center">
                    <button
                      type="button"
                      onClick={prevMobileSpeaker}
                      className="pointer-events-auto inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10.5px] font-bold bg-white/95 text-sky-900 border border-sky-200/90 shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <ChevronUp className="w-3 h-3 text-sky-600" />
                      <span>{lang === 'bn' ? 'আগের বক্তা দেখুন' : 'Previous scholar'}</span>
                    </button>
                  </div>
                )}

                {/* Stacked Cards Container */}
                <div className="relative w-full h-full px-2.5 pt-2.5">
                  {SPEAKERS.map((spk, idx) => {
                    const offset = idx - activeMobileIndex;
                    if (Math.abs(offset) > 1) return null;

                    const isCenter = offset === 0;
                    const isTop = offset === -1;
                    const isBottom = offset === 1;

                    // Top-aligned for speakers 1..9 (active at y=0, next peeking at y=200).
                    // On 10th speaker: 9th peeks at top (y=0) and 10th sits cleanly at y=50.
                    const translateY = isMobileAtEnd
                      ? isCenter
                        ? 50
                        : isTop
                          ? 0
                          : 240
                      : isCenter
                        ? 0
                        : isBottom
                          ? 200
                          : -200;

                    const scale = isCenter ? 1.0 : 0.95;
                    const opacity = isCenter
                      ? 1.0
                      : (isMobileAtEnd && isTop) || (!isMobileAtEnd && isBottom)
                        ? 0.42
                        : 0;

                    return (
                      <m.div
                        key={spk.id}
                        initial={false}
                        animate={{
                          y: translateY,
                          scale,
                          opacity,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 320,
                          damping: 30,
                        }}
                        onClick={() => {
                          if (isTop) prevMobileSpeaker();
                          if (isBottom) nextMobileSpeaker();
                        }}
                        style={{ willChange: 'transform, opacity' }}
                        className={`absolute inset-x-2.5 top-2.5 ${
                          isCenter
                            ? 'z-20 pointer-events-auto'
                            : opacity > 0
                              ? 'z-10 cursor-pointer'
                              : 'z-0 pointer-events-none'
                        }`}
                      >
                        <ScholarCard
                          spk={spk}
                          lang={lang}
                          isCenter={isCenter}
                          onSelect={(s) => setSelectedProfile(s)}
                        />
                      </m.div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Quick-Jump Progress Dots */}
              <div className="flex items-center justify-center gap-1.5 pt-0.5">
                {SPEAKERS.map((spk, i) => (
                  <button
                    key={spk.id}
                    type="button"
                    onClick={() => setActiveMobileIndex(i)}
                    aria-label={lang === 'bn' ? `বক্তা ${formatNumber(i + 1, lang)}` : `Scholar ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeMobileIndex === i ? 'w-5 bg-sky-600' : 'w-1.5 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- ORGANIZERS TAB --- */}
        {activeTab === 'organizers' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {ORGANIZERS.map((org, idx) => (
              <m.div
                key={org.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: idx * 0.05, ease: EASE_SMOOTH }}
                onClick={() => setSelectedProfile(org)}
                className="catalis-card p-5 sm:p-6 flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center ring-2 ring-black/5 ${
                        org.photo ? '' : 'p-1'
                      }`}
                      style={{
                        backgroundColor: 'var(--bg-surface-subtle)',
                        borderColor: 'var(--border-card)',
                      }}
                    >
                      <SmartImage
                        src={org.photo || '/assets/logo.png'}
                        alt={org.photo ? org.name[lang] : lang === 'bn' ? 'মাদরাসার লোগো' : 'Madrasah logo'}
                        loading="lazy"
                        decoding="async"
                        className={`w-full h-full ${org.photo ? 'object-cover object-top' : 'object-contain'}`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 bg-sky-500/15 text-sky-800 border border-sky-400/30">
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
              </m.div>
            ))}
          </div>
        )}
        </ScrollReveal>
      </div>

      {/* ================= SCHOLAR / ORGANIZER DETAIL MODAL ================= */}
      <AnimatePresence>
        {selectedProfile && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setSelectedProfile(null)}
          >
            <m.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.22, ease: EASE_SMOOTH }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md max-h-[94dvh] bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-900"
            >
              {/* Portrait Stage: square photo shown in full, face-safe focus */}
              <div className="relative w-full aspect-square max-h-[52dvh] bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 overflow-hidden shrink-0">
                {'photo' in selectedProfile && selectedProfile.photo ? (
                  <SmartImage
                    src={selectedProfile.photo}
                    alt={selectedProfile.name[lang]}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: '50% 18%' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-serif font-bold text-6xl text-sky-300/80">
                      {selectedProfile.name[lang].split(' ').slice(-1)[0][0]}
                    </span>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-950/45 to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-950/55 hover:bg-slate-950/80 backdrop-blur-md text-white border border-white/20 transition cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Compact bottom scrim keeps the face clear */}
                <div className="absolute inset-x-0 bottom-0 pt-14 pb-4 px-5 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent text-white">
                  {selectedProfile.badge && (
                    <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 bg-sky-400/25 text-sky-100 border border-sky-300/40">
                      {selectedProfile.badge[lang]}
                    </span>
                  )}
                  <h3 className="font-serif text-lg sm:text-2xl font-extrabold leading-tight text-white">
                    {selectedProfile.name[lang]}
                  </h3>
                  <p className="text-xs sm:text-sm text-sky-200 font-semibold mt-0.5">
                    {selectedProfile.role[lang]}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div
                data-lenis-prevent
                className="p-4 sm:p-5 space-y-2.5 flex-1 min-h-0 overflow-y-auto overscroll-contain bg-white"
              >
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1.5 mb-1.5">
                    <Award className="w-3.5 h-3.5 text-sky-600" />
                    {lang === 'bn' ? 'পদবী ও দায়িত্ব' : 'Title & Position'}
                  </span>
                  <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {selectedProfile.title[lang]}
                  </p>
                </div>

                {selectedProfile.affiliation[lang] && (
                  <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/70">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1.5 mb-1.5">
                      <Building2 className="w-3.5 h-3.5 text-sky-600" />
                      {lang === 'bn' ? 'পরিচিতি ও কর্মস্থল' : 'Affiliation & Distinction'}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-sky-950 leading-relaxed">
                      {selectedProfile.affiliation[lang]}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-sky-600" />
                  {'topic' in selectedProfile
                    ? (lang === 'bn' ? 'সম্মানিত আলোচক ও মেহমান' : 'Distinguished Scholar')
                    : (lang === 'bn' ? 'আয়োজক ও তত্ত্বাবধায়ক' : 'Organizer & Leadership')}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="px-5 py-2 rounded-full text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                >
                  {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
