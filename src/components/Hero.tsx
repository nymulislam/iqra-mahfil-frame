'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
import { SITE } from '@/content/site';
import { SPEAKERS } from '@/content/speakers';

export function Hero({
  onOpenBanner,
}: {
  onOpenCalendar?: () => void;
  onOpenBanner?: () => void;
}) {
  const { lang, t } = useLanguage();
  const { onlineVisitors } = useLiveTracking();
  const { openFrameModal } = useFrameModal();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(MAHFIL.dateISO).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

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

  const toBanglaNum = (n: number) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(n)
      .padStart(2, '0')
      .split('')
      .map((d) => bnDigits[parseInt(d, 10)] || d)
      .join('');
  };

  const formatNum = (n: number) => {
    return lang === 'bn' ? toBanglaNum(n) : String(n).padStart(2, '0');
  };

  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    MAHFIL.title[lang]
  )}&dates=20261205T080000Z/20261205T180000Z&details=${encodeURIComponent(
    MAHFIL.subtitle[lang]
  )}&location=${encodeURIComponent(SITE.locationDetails[lang])}`;

  return (
    <section
      className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden bg-islamic-pattern transition-colors duration-500"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      {/* Layered Sacred Atmospheric Lighting (Official Logo Blue & Cyan) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,var(--accent-blue-glow),transparent_70%)] pointer-events-none" />
      <div
        className="absolute top-1/4 right-10 w-96 h-96 -z-10 rounded-full blur-[140px] pointer-events-none opacity-25"
        style={{ backgroundColor: 'var(--accent-secondary)' }}
      />
      <div
        className="absolute top-1/4 left-10 w-96 h-96 -z-10 rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{ backgroundColor: 'var(--accent-primary)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Top Center: Streamlined 2-Line Hero Header (Main Title from Poster + Highlighted Info) --- */}
        <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
          {/* Line 1: Main Grand Title directly from the Official Poster */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.25] sm:leading-[1.2] mb-3.5 overflow-visible"
            style={{ color: 'var(--text-main)' }}
          >
            {lang === 'bn' ? (
              <>
                <span className="block text-sky-700 text-xs sm:text-base md:text-lg font-bold font-sans tracking-wider uppercase mb-2">
                  ইক্বরা ইন্টারন্যাশনাল মাদরাসার উদ্যোগে
                </span>
                বার্ষিক{' '}
                <span className="italic-serif accent-shimmer font-bold pr-3">
                  তাফসীরুল কুরআন মাহফিল
                </span>{' '}
                ২০২৬
              </>
            ) : (
              <>
                <span className="block text-sky-700 text-xs sm:text-base md:text-lg font-bold font-sans tracking-wider uppercase mb-2">
                  Iqra International Madrasah Presents
                </span>
                Annual{' '}
                <span className="italic-serif accent-shimmer font-bold pr-3">
                  Tafsirul Quran Mahfil
                </span>{' '}
                2026
              </>
            )}
          </motion.h1>

          {/* Line 2: High-Priority Highlighted Event Details (Date • Time • Venue) */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="text-xs sm:text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-6 font-semibold"
            style={{ color: 'var(--text-muted)' }}
          >
            {lang === 'bn' ? (
              <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                <span className="text-slate-900 font-bold">৫ ডিসেম্বর ২০২৬, শনিবার</span>
                <span className="text-sky-400 font-normal">•</span>
                <span className="text-sky-800 font-bold">বাদ যোহর হইতে মধ্যরাত</span>
                <span className="text-sky-400 font-normal">•</span>
                <span className="text-slate-800 font-medium">মাদরাসা সংলগ্ন বালুর মাঠ, ফরিদগঞ্জ, চাঁদপুর</span>
              </span>
            ) : (
              <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                <span className="text-slate-900 font-bold">Saturday, 5 December 2026</span>
                <span className="text-sky-400 font-normal">•</span>
                <span className="text-sky-800 font-bold">After Zohr to Midnight</span>
                <span className="text-sky-400 font-normal">•</span>
                <span className="text-slate-800 font-medium">Madrasah Central Grounds, Faridganj, Chandpur</span>
              </span>
            )}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-7"
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
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold text-white shadow-lg shadow-sky-600/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer relative group overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0384dc 100%)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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
          </motion.div>

          {/* Real-time Status Micro-bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="inline-flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 px-4 py-2 rounded-full border text-xs"
            style={{
              backgroundColor: 'var(--bg-surface-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold" style={{ color: 'var(--text-main)' }}>
                {formatNum(onlineVisitors)}
              </span>{' '}
              {lang === 'bn' ? 'জন ভিজিটর লাইভ' : 'Active Visitors Online'}
            </span>
            <span className="opacity-40">|</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{SITE.location[lang]}</span>
            </span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span className="hidden sm:inline font-semibold text-sky-700">
              {MAHFIL.timeDisplay[lang]}
            </span>
          </motion.div>
        </div>

        {/* --- 4-Card Hero Showcase Strip (Smooth Snap Carousel on Mobile, 4-Col Grid on Desktop) --- */}
        <div className="relative mb-8 sm:mb-10">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 scrollbar-none">
            {/* Card 1: Live Dynamic Countdown & Add to Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="catalis-card p-4 sm:p-5 flex flex-col justify-between w-[84vw] max-w-[295px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="catalis-pill text-xs font-bold text-sky-800">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    {lang === 'bn' ? 'মাহফিল শুরু বাকি' : 'Event Countdown'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <p className="text-xs font-medium mb-2.5" style={{ color: 'var(--text-muted)' }}>
                  {lang === 'bn' ? '৫ ডিসেম্বর ২০২৬, শনিবার বাদ যোহর' : 'Saturday, Dec 5, 2026 • After Zohr'}
                </p>
                {/* Condensed Numbers Grid */}
                <div className="grid grid-cols-4 gap-1.5 text-center mb-3">
                  {[
                    { label: t.hero.days[lang], val: timeLeft.days },
                    { label: t.hero.hours[lang], val: timeLeft.hours },
                    { label: t.hero.minutes[lang], val: timeLeft.minutes },
                    { label: t.hero.seconds[lang], val: timeLeft.seconds },
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
                      <span className="block text-[9px] sm:text-[10px] font-bold uppercase mt-1 opacity-70" style={{ color: 'var(--text-muted)' }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Directly Add to Google Calendar */}
              <a
                href={googleCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer hover:border-sky-300"
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  color: 'var(--text-main)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <CalendarDays className="w-3.5 h-3.5 text-sky-600" />
                <span>{t.hero.ctaCalendar[lang]}</span>
              </a>
            </motion.div>

            {/* Card 2: Invited Key Scholars */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="catalis-card p-4 sm:p-5 flex flex-col justify-between w-[84vw] max-w-[295px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="catalis-pill text-xs font-bold text-sky-800">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    {lang === 'bn' ? 'আমন্ত্রিত আলোচক' : 'Key Scholars'}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-sky-500/10 text-sky-800 border-sky-300/40">
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
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
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
                      backgroundColor: 'var(--accent-primary)',
                      color: '#ffffff',
                    }}
                  >
                    +৫
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
            </motion.div>

            {/* Card 3: Keepsake Photo Frame Studio Teaser */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
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
                  backgroundColor: 'var(--accent-primary)',
                }}
              >
                <Camera className="w-3.5 h-3.5 text-sky-100" />
                <span>{lang === 'bn' ? 'ফ্রেম তৈরি করুন →' : 'Build Frame →'}</span>
              </a>
            </motion.div>

            {/* Card 4: Location & Venue Map */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="catalis-card p-4 sm:p-5 flex flex-col justify-between w-[84vw] max-w-[295px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="catalis-pill text-xs font-bold text-rose-700">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    {lang === 'bn' ? 'মাহফিলের স্থান' : 'Venue'}
                  </span>
                  <Compass className="w-3.5 h-3.5 text-rose-500 opacity-60" />
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
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'bn' ? 'গুগল ম্যাপে দিকনির্ণয়' : 'Google Maps'}</span>
              </a>
            </motion.div>
          </div>

          {/* Mobile Swipe Hint Pill */}
          <div className="sm:hidden flex items-center justify-center gap-1.5 text-[11px] font-bold text-sky-800/80 pt-1">
            <span>👈 সোয়াইপ করে সবগুলো কার্ড দেখুন 👉</span>
          </div>
        </div>
      </div>
    </section>
  );
}
