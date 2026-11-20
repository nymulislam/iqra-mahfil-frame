'use client';

import React, { useState, useEffect, useRef } from 'react';
import { m, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { EASE_SMOOTH } from './ScrollReveal';
import {
  Clock,
  MapPin,
  ArrowRight,
  Camera,
  BookOpen,
  CalendarDays,
  Users,
  Compass,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useLiveTracking } from '@/context/LiveTrackingContext';
import { useFrameModal } from '@/context/FrameModalContext';
import { MAHFIL } from '@/content/mahfil';
import { formatNumber } from '@/lib/numbers';
import { SITE } from '@/content/site';
import { SPEAKERS } from '@/content/speakers';
import { SmartImage } from './SmartImage';

export function Hero({
  onOpenCalendar,
}: {
  onOpenCalendar?: () => void;
  onOpenBanner?: () => void;
}) {
  const { lang, t } = useLanguage();
  const { onlineVisitors, livePaused } = useLiveTracking();
  const { openFrameModal } = useFrameModal();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [eventState, setEventState] = useState<'pending' | 'upcoming' | 'live' | 'ended'>('pending');

  useEffect(() => {
    const target = new Date(MAHFIL.dateISO).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);
      setEventState(now < target ? 'upcoming' : now < new Date(MAHFIL.endDateISO).getTime() ? 'live' : 'ended');

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (value: number | null) => formatNumber(value, lang, 2, false);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const archY = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const reduceMotion = useReducedMotion();

  return (
    <section
      ref={heroRef}
      className="mahfil-hero relative pt-20 sm:pt-24 pb-8 md:pt-32 md:pb-16 overflow-hidden bg-islamic-pattern transition-colors duration-500"
    >
      <m.div
        aria-hidden="true"
        style={reduceMotion ? undefined : { y: archY, willChange: 'transform' }}
        className="pointer-events-none absolute inset-0"
      >
        <svg className="hero-arch" viewBox="0 0 800 600" preserveAspectRatio="none" aria-hidden="true">
          <path d="M28 600V310C28 162 245 146 400 12C555 146 772 162 772 310V600" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <path d="M46 600V313C46 176 256 155 400 35C544 155 754 176 754 313V600" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      </m.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
          <m.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.04, ease: EASE_SMOOTH }}
            className="mb-6 grid gap-2 text-center font-serif font-bold text-[var(--text-main)] sm:mb-8"
          >
            <span className="text-balance font-sans text-[13px] font-semibold uppercase tracking-wide text-sky-700 sm:text-base">
              {lang === 'bn' ? 'ইক্বরা ইন্টারন্যাশনাল মাদরাসার উদ্যোগে' : 'Iqra International Madrasah Presents'}
            </span>
            <span className="text-2xl font-bold leading-tight sm:text-3xl">
              {lang === 'bn' ? 'বার্ষিক' : 'Annual'}
            </span>
            <span className="text-balance text-[clamp(2.2rem,10.5vw,3.75rem)] sm:text-[clamp(2.25rem,5.4vw,4.25rem)] font-extrabold leading-[1.25] tracking-tight">
              <span className="italic-serif accent-shimmer hero-event-name">
                {lang === 'bn' ? 'তাফসীরুল কুরআন মাহফিল' : 'Tafsirul Quran Mahfil'}
              </span>{'\u00a0'}
              <span>{lang === 'bn' ? '২০২৬' : '2026'}</span>
            </span>
          </m.h1>

          {/* Action Buttons */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.46, delay: 0.12, ease: EASE_SMOOTH }}
            className="mx-auto mb-5 grid w-full max-w-xs gap-2.5 sm:mb-7 sm:flex sm:max-w-none sm:justify-center sm:gap-4"
          >
            {/* Primary Action Button with Specular Glow */}
            <a
              href="#frame"
              onClick={(e) => {
                if (window.innerWidth < 768) {
                  e.preventDefault();
                  openFrameModal();
                }
              }}
              className="primary-action inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold text-white shadow-lg shadow-sky-600/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Camera className="w-4 h-4 text-sky-100" />
              <span>{t.hero.ctaFrame[lang]}</span>
              <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Secondary Action Button */}
            <a
              href="#mahfil"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              style={{
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>{t.hero.ctaDetails[lang]}</span>
            </a>
          </m.div>

          {/* Real-time Status Micro-bar */}
          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.18, ease: EASE_SMOOTH }}
            className="inline-grid max-w-full justify-items-center gap-1.5 rounded-2xl border px-4 py-2 text-xs lg:inline-flex lg:items-center lg:gap-3 lg:rounded-full"
            style={{
              backgroundColor: 'var(--bg-surface-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            <span className="hidden items-center gap-1.5 font-medium md:flex">
              <span className="w-2 h-2 rounded-full bg-[var(--brand-blue-ink)]" />
              <span className="font-bold" style={{ color: 'var(--text-main)' }}>
                {formatNumber(onlineVisitors, lang)}
              </span>{' '}
              {livePaused ? (lang === 'bn' ? 'লাইভ আপডেট সাময়িকভাবে বন্ধ' : 'Live updates paused') : (lang === 'bn' ? 'এখন অনলাইনে' : 'Online now')}
            </span>
            <span aria-hidden="true" className="hidden opacity-40 lg:inline">|</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[var(--brand-blue-ink)]" />
              <span>{SITE.location[lang]}</span>
            </span>
            <span aria-hidden="true" className="hidden opacity-40 lg:inline">|</span>
            <span className="hidden sm:inline font-semibold text-sky-700">
              {MAHFIL.timeDisplay[lang]}
            </span>
          </m.div>
        </div>

        {/* --- 4-Card Hero Showcase Strip (Smooth Snap Carousel on Mobile, 4-Col Grid on Desktop) --- */}
        <div className="relative mb-8 sm:mb-10">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 scrollbar-none">
            {/* Card 1: Live Dynamic Countdown & Add to Calendar */}
            <m.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.46, delay: 0.18, ease: EASE_SMOOTH }}
              className="countdown-card catalis-card p-4 sm:p-5 flex flex-col justify-between w-[84vw] max-w-[295px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="catalis-pill text-xs font-bold text-sky-800">
                    <Clock className="w-3.5 h-3.5 text-[var(--brand-gold-ink)]" />
                    {({pending: {bn: 'সময় হিসাব হচ্ছে…', en: 'Loading countdown…'}, upcoming: {bn: 'মাহফিল শুরু বাকি', en: 'Event Countdown'}, live: {bn: 'মাহফিল চলছে', en: 'Event in progress'}, ended: {bn: 'মাহফিল সম্পন্ন', en: 'Event ended'}})[eventState][lang]}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[var(--brand-gold)]" />
                </div>
                <p className="text-xs font-medium mb-2.5 text-white">
                  {lang === 'bn' ? '৫ ডিসেম্বর ২০২৬, শনিবার বাদ যোহর' : 'Saturday, Dec 5, 2026 • After Zohr'}
                </p>
                {/* Condensed Numbers Grid */}
                <div className="grid grid-cols-4 gap-1.5 text-center mb-3">
                  {[
                    { label: t.hero.days[lang], val: timeLeft?.days ?? null },
                    { label: t.hero.hours[lang], val: timeLeft?.hours ?? null },
                    { label: t.hero.minutes[lang], val: timeLeft?.minutes ?? null },
                    { label: t.hero.seconds[lang], val: timeLeft?.seconds ?? null },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="border rounded-lg py-1.5"
                      style={{
                        backgroundColor: 'var(--bg-surface-subtle)',
                        borderColor: 'var(--border-subtle)',
                      }}
                    >
                      <span
                        className="block font-serif text-base sm:text-lg font-bold leading-none"
                        style={{ color: 'var(--text-main)' }}
                        suppressHydrationWarning
                      >
                        {formatNum(item.val)}
                      </span>
                      <span className="block text-[9px] sm:text-[10px] font-bold uppercase mt-1" style={{ color: 'var(--text-muted)' }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Open 2026 Calendar Preview */}
              <button
                type="button"
                onClick={onOpenCalendar}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer hover:border-sky-300"
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  color: 'var(--text-main)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <CalendarDays className="w-3.5 h-3.5 text-sky-600" />
                <span>{t.hero.ctaCalendar[lang]}</span>
              </button>
            </m.div>

            {/* Card 2: Invited Key Scholars */}
            <m.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.46, delay: 0.24, ease: EASE_SMOOTH }}
              className="catalis-card p-4 sm:p-5 flex flex-col justify-between w-[84vw] max-w-[295px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="catalis-pill text-xs font-bold text-sky-800">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    {lang === 'bn' ? 'আমন্ত্রিত আলোচক' : 'Key Scholars'}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-[var(--surface-sky)] text-[var(--brand-blue-ink)] border-sky-300/40">
                    {lang === 'bn' ? '১০ জন মেহমান' : '10 Scholars'}
                  </span>
                </div>
                {/* Stacked Scholar Avatars */}
                <div className="flex items-center -space-x-2 mb-2.5 pl-1">
                  {SPEAKERS.slice(0, 5).map((spk, idx) => (
                    <div
                      key={idx}
                      className="w-9 h-9 rounded-full border-2 border-white shadow-xs overflow-hidden shrink-0 flex items-center justify-center font-serif text-xs font-bold"
                      style={{
                        backgroundColor: 'var(--bg-surface-subtle)',
                        color: 'var(--accent-primary)',
                      }}
                      title={spk.name[lang]}
                    >
                      {spk.photo ? (
                        <SmartImage
                          src={spk.photo}
                          alt={spk.name[lang]}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span>{spk.name.bn.split(' ').slice(-1)[0][0] || 'আ'}</span>
                      )}
                    </div>
                  ))}
                  <div
                    className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs"
                    style={{
                      background: 'var(--primary-gradient)',
                      color: '#ffffff',
                    }}
                  >
                    +{formatNumber(Math.max(0, SPEAKERS.length - 5), lang)}
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-semibold line-clamp-1 mb-0.5" style={{ color: 'var(--text-main)' }}>
                  {SPEAKERS[0].name[lang]}
                </p>
                <p className="text-xs line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                  {SPEAKERS[0].title[lang]}
                </p>
              </div>
              <a
                href="#speakers"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-colors mt-2 hover:border-sky-300"
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  color: 'var(--text-main)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <span>{lang === 'bn' ? 'বক্তাদের তালিকা দেখুন →' : 'View Scholars →'}</span>
              </a>
            </m.div>

            {/* Card 3: Keepsake Photo Frame Studio Teaser */}
            <m.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.46, delay: 0.3, ease: EASE_SMOOTH }}
              className="catalis-card p-4 sm:p-5 flex flex-col justify-between w-[84vw] max-w-[295px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="catalis-pill text-xs font-bold text-sky-800">
                    <Camera className="w-3.5 h-3.5 text-sky-600" />
                    {lang === 'bn' ? 'ফটো ফ্রেম স্টুডিও' : 'Frame Studio'}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-800 border border-sky-300/40">
                    {lang === 'bn' ? '২টি ডিজাইন' : '2 Designs'}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold mb-1" style={{ color: 'var(--text-main)' }}>
                  {lang === 'bn' ? 'নিজের ছবি দিয়ে ফ্রেম তৈরি' : 'Personalized Photo Frame'}
                </h4>
                <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-muted)' }}>
                  {lang === 'bn'
                    ? 'সহজেই নিজের নাম ও ছবি দিয়ে ফ্রেম বানিয়ে ফেসবুকে শেয়ার করুন।'
                    : 'Design custom social media keepsake frames in high definition.'}
                </p>
              </div>
              <a
                href="#frame"
                onClick={(e) => {
                  if (window.innerWidth < 768) {
                    e.preventDefault();
                    openFrameModal();
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer"
                style={{
                  background: 'var(--primary-gradient)',
                }}
              >
                <Camera className="w-3.5 h-3.5 text-sky-100" />
                <span>{lang === 'bn' ? 'ফ্রেম তৈরি করুন →' : 'Build Frame →'}</span>
              </a>
            </m.div>

            {/* Card 4: Location & Venue Map */}
            <m.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.46, delay: 0.36, ease: EASE_SMOOTH }}
              className="catalis-card p-4 sm:p-5 flex flex-col justify-between w-[84vw] max-w-[295px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="catalis-pill text-xs font-bold text-[var(--brand-blue-ink)]">
                    <MapPin className="w-3.5 h-3.5 text-[var(--brand-blue-ink)]" />
                    {lang === 'bn' ? 'মাহফিলের স্থান' : 'Venue'}
                  </span>
                  <Compass className="w-3.5 h-3.5 text-[var(--brand-blue-ink)] opacity-60" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold mb-1 line-clamp-1" style={{ color: 'var(--text-main)' }}>
                  {MAHFIL.venue[lang]}
                </h4>
                <p className="text-xs mb-2 leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                  {MAHFIL.location[lang]}
                </p>
              </div>
              <a
                href={SITE.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-colors hover:border-sky-300"
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  color: 'var(--text-main)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                <span>{lang === 'bn' ? 'গুগল ম্যাপে দিকনির্ণয়' : 'Google Maps'}</span>
              </a>
            </m.div>
          </div>

          {/* Mobile Swipe Hint Pill */}
          <div className="sm:hidden flex items-center justify-center gap-1.5 text-[11px] font-bold text-sky-800/80 pt-1">
            <span>{lang === 'bn' ? 'সোয়াইপ করে সবগুলো কার্ড দেখুন' : 'Swipe to view all cards'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
