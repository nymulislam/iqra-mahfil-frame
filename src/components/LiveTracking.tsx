'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Camera,
  CheckCircle,
  MapPin,
  Compass,
  Navigation,
  Globe2,
  ExternalLink,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/context/LanguageContext';
import { useLiveTracking } from '@/context/LiveTrackingContext';
import { AnimatedNumber } from './AnimatedNumber';
import { SITE } from '@/content/site';

const TOP_REGIONS_MINI = [
  { name: { bn: 'চাঁদপুর (স্বাগতিক)', en: 'Chandpur (Host)' }, count: 1840, pct: 95, flag: '🇧🇩' },
  { name: { bn: 'ঢাকা ও পার্শ্ববর্তী এলাকা', en: 'Dhaka & Surroundings' }, count: 1120, pct: 72, flag: '🇧🇩' },
  { name: { bn: 'সৌদি আরব ও মধ্যপ্রাচ্য প্রবাসী', en: 'Saudi Arabia & Gulf' }, count: 860, pct: 64, flag: '🇸🇦' },
];

export function LiveTracking() {
  const { lang } = useLanguage();

  const {
    onlineVisitors,
    totalFrames,
    pledgedAttendees,
    hasPledged,
    userDistance,
    isLocating,
    locationError,
    recordPledge,
    trackUserDistance,
  } = useLiveTracking();

  const handlePledgeClick = () => {
    recordPledge();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10b981', '#0d9488', '#0284c7', '#026cb6', '#ef4444'],
    });
  };

  return (
    <section
      id="live"
      className="py-12 sm:py-16 md:py-20 relative overflow-hidden border-b transition-colors duration-500"
      style={{
        backgroundColor: 'var(--bg-page)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Ambient Radial Lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-500/8 via-teal-500/8 to-sky-500/8 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2
            className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight leading-[1.25] sm:leading-[1.2] mb-2 overflow-visible"
            style={{ color: 'var(--text-main)' }}
          >
            {lang === 'bn' ? (
              <>
                কমিউনিটি লাইভ পাল্স ও{' '}
                <span className="text-sky-700 font-bold block sm:inline-block pr-4">উপস্থিতি রাডার</span>
              </>
            ) : (
              <>
                Community Live Pulse &{' '}
                <span className="text-sky-700 font-bold block sm:inline-block pr-4">Presence Radar</span>
              </>
            )}
          </h2>

          <p
            className="text-xs sm:text-sm max-w-xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {lang === 'bn'
              ? 'দেশ-বিদেশ থেকে সরাসরি যুক্ত হওয়া অংশগ্রহণকারীদের লাইভ পরিসংখ্যান ও দূরত্ব পরিমাপ।'
              : 'Real-time telemetry showing online attendees, personalized frames, and venue GPS distance.'}
          </p>
        </div>

        {/* 4 Catalis-Style HUD Metric Ribbon (Compact Glass Row) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Metric 1: Live Online */}
          <div
            className="catalis-card p-4 sm:p-5 flex flex-col justify-between border shadow-xs"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-card)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'সক্রিয় অনলাইন' : 'Live Online'}
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div
                className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight"
                style={{ color: 'var(--text-main)' }}
              >
                <AnimatedNumber value={onlineVisitors} />
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'এই মুহূর্তে ওয়েবসাইটে' : 'Active on site now'}
              </span>
            </div>
          </div>

          {/* Metric 2: Frames Built */}
          <div
            className="catalis-card p-4 sm:p-5 flex flex-col justify-between border shadow-xs"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-card)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'ফ্রেম তৈরি' : 'Frames Built'}
              </span>
              <Camera className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <div
                className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight"
                style={{ color: 'var(--text-main)' }}
              >
                <AnimatedNumber value={totalFrames} />+
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'তৈরিকৃত ফটো ফ্রেম' : 'Custom frames made'}
              </span>
            </div>
          </div>

          {/* Metric 3: Attendees Pledged */}
          <div
            className="catalis-card p-4 sm:p-5 flex flex-col justify-between border shadow-xs"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-card)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'উপস্থিতি নিশ্চিত' : 'Pledged'}
              </span>
              <Users className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-sky-700 tracking-tight">
                <AnimatedNumber value={pledgedAttendees} />+
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'মাহফিলে আসবেন' : 'Confirmed attendees'}
              </span>
            </div>
          </div>

          {/* Metric 4: Active Regions */}
          <div
            className="catalis-card p-4 sm:p-5 flex flex-col justify-between border shadow-xs"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-card)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'অঞ্চল ও জেলা' : 'Active Regions'}
              </span>
              <Globe2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div
                className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight"
                style={{ color: 'var(--text-main)' }}
              >
                <AnimatedNumber value={28} />+
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'জেলা ও প্রবাসী কমিউনিটি' : 'Districts & Expatriates'}
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Unified Bento: Attendance Hub + Venue GPS Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Card A (7 Cols): Attendance Pledge Hub & Top Regions */}
          <div
            className="lg:col-span-7 catalis-card p-5 sm:p-6 lg:p-7 flex flex-col justify-between border shadow-lg backdrop-blur-sm"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-card)',
            }}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-800 border border-sky-500/20">
                  <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
                  <span>{lang === 'bn' ? 'অংশগ্রহণ নিশ্চিতকরণ' : 'Attendance Pledge'}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? '৩,৯০০+ নিশ্চিত' : '3,900+ pledged'}</span>
                </span>
              </div>

              <h3
                className="font-serif text-lg sm:text-2xl font-bold leading-snug mb-2"
                style={{ color: 'var(--text-main)' }}
              >
                {lang === 'bn'
                  ? 'আপনি কি ৫ ডিসেম্বর মাহফিলে উপস্থিত থাকছেন?'
                  : 'Are you attending the Grand Mahfil on 5 December?'}
              </h3>

              <p className="text-xs sm:text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn'
                  ? 'আপনার অংশগ্রহণ নিশ্চিত করুন এবং লাইভ কাউন্টারে নিজেকে যুক্ত করে অন্যদের দ্বীনি মাহফিলে আসার উৎসাহ দিন।'
                  : 'Confirm your intention to attend this blessed Quranic gathering and inspire your brothers and sisters.'}
              </p>

              {/* Integrated Top 3 Regions Mini Bars */}
              <div
                className="p-3.5 sm:p-4 rounded-2xl border space-y-2.5 mb-5"
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center justify-between text-xs font-bold" style={{ color: 'var(--text-main)' }}>
                  <span>{lang === 'bn' ? 'শীর্ষ অংশগ্রহণকারী অঞ্চল' : 'Top Participating Regions'}</span>
                  <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>
                    {lang === 'bn' ? 'লাইভ উপস্থিতি অনুপাত' : 'Live distribution'}
                  </span>
                </div>

                {TOP_REGIONS_MINI.map((reg, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                        <span>{reg.flag}</span>
                        <span>{reg.name[lang]}</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-600">
                        <AnimatedNumber value={reg.count} />+
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200/70 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${reg.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pledge Action Button / Status */}
            <div>
              {hasPledged ? (
                <div className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 font-bold text-xs sm:text-sm shadow-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>
                    {lang === 'bn'
                      ? 'আলহামদুলিল্লাহ! আপনার অংশগ্রহণ তালিকাভুক্ত হয়েছে'
                      : 'Alhamdulillah! You are confirmed for Mahfil 2026'}
                  </span>
                </div>
              ) : (
                <button
                  onClick={handlePledgeClick}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-md shadow-sky-950/15 hover:shadow-lg active:scale-98 transition-all cursor-pointer group"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                  }}
                >
                  <span className="text-base group-hover:scale-125 transition-transform">✋</span>
                  <span>{lang === 'bn' ? 'আমিও মাহফিলে আসছি ইনশাআল্লাহ' : "I Am Attending InshaAllah"}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full ml-1">
                    {lang === 'bn' ? '১-ক্লিকে সম্মতি' : '1-click'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Card B (5 Cols): Live GPS Distance & Navigation Radar */}
          <div
            className="lg:col-span-5 catalis-card p-5 sm:p-6 lg:p-7 flex flex-col justify-between border shadow-lg backdrop-blur-sm"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-card)',
            }}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-800 border border-sky-500/20">
                  <Compass className="w-3.5 h-3.5 text-sky-600" />
                  <span>{lang === 'bn' ? 'দূরত্ব ও দিকনির্ণয়' : 'Distance Radar'}</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  {lang === 'bn' ? 'স্মার্ট জিপিএস' : 'GPS Telemetry'}
                </span>
              </div>

              <h3
                className="font-serif text-lg sm:text-2xl font-bold leading-snug mb-2"
                style={{ color: 'var(--text-main)' }}
              >
                {lang === 'bn'
                  ? 'আপনার অবস্থান থেকে মাহফিলের দূরত্ব'
                  : 'Calculate Venue Distance'}
              </h3>

              <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn'
                  ? 'স্মার্টফোনের জিপিএস দিয়ে সরাসরি দেখুন আপনি পাটওয়ারী বাজার মাঠ থেকে কত দূরে আছেন।'
                  : 'Check aerial/driving distance in kilometers directly from your current GPS location.'}
              </p>

              {/* Distance Result Radar Card */}
              {userDistance !== null ? (
                <div
                  className="p-4 rounded-2xl border text-center my-4"
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-emerald-600">
                    {lang === 'bn' ? 'পরিমাপকৃত আনুমানিক দূরত্ব' : 'Calculated Distance'}
                  </span>
                  <div className="font-serif text-3xl sm:text-4xl font-extrabold text-emerald-700">
                    <AnimatedNumber value={Math.round(userDistance)} /> {lang === 'bn' ? 'কি.মি.' : 'km'}
                  </div>
                  <span className="text-[11px] mt-1 block" style={{ color: 'var(--text-muted)' }}>
                    {lang === 'bn'
                      ? 'মাদরাসা সংলগ্ন বালুর মাঠ, পাটওয়ারী বাজার, ফরিদগঞ্জ'
                      : 'Madrasah Sand Field, Patwari Bazar, Faridganj'}
                  </span>
                </div>
              ) : (
                <div
                  className="p-4 rounded-2xl border text-center my-4"
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div className="w-10 h-10 rounded-full mx-auto mb-2 bg-sky-500/10 text-sky-600 flex items-center justify-center">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold block" style={{ color: 'var(--text-main)' }}>
                    {lang === 'bn' ? 'দূরত্ব এখনো পরিমাপ করা হয়নি' : 'Distance not calculated yet'}
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {lang === 'bn' ? 'নিচের বোতাম চেপে ১-ক্লিকে দূরত্ব জানুন' : 'Click below to detect distance'}
                  </span>
                </div>
              )}

              {locationError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs rounded-xl p-2.5 mb-3">
                  {locationError}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={trackUserDistance}
                disabled={isLocating}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-xs active:scale-98 transition-all cursor-pointer"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                }}
              >
                <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                <span>
                  {isLocating
                    ? lang === 'bn'
                      ? 'দূরত্ব হিসাব হচ্ছে...'
                      : 'Calculating distance...'
                    : lang === 'bn'
                    ? 'আমার দূরত্ব মাপুন'
                    : 'Check My Distance'}
                </span>
              </button>

              <a
                href={SITE.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs border shadow-2xs hover:bg-slate-100/60 active:scale-98 transition-all text-center"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-main)',
                }}
              >
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>{lang === 'bn' ? 'গুগল ম্যাপে দিকনির্ণয়' : 'Google Maps Directions'}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
