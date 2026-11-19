'use client';

import React from 'react';
import {
  Users,
  Camera,
  CheckCircle,
  MapPin,
  Compass,
  Navigation,
  ExternalLink,
  Activity,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/context/LanguageContext';
import { useLiveTracking } from '@/context/LiveTrackingContext';
import { AnimatedNumber } from './AnimatedNumber';
import { SITE } from '@/content/site';
import { ScrollReveal, StaggerGroup, StaggerItem } from './ScrollReveal';

export function LiveTracking() {
  const { lang } = useLanguage();

  const {
    livePaused,
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
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#025ba9', '#014779', '#e0f2fe', '#026fba'],
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
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full opacity-75"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(20, 184, 166, 0.09) 0%, rgba(14, 165, 233, 0.07) 45%, transparent 72%)',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Section Header */}
        <ScrollReveal y={14}>
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-9">
            <h2
              className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight leading-[1.25] sm:leading-[1.2] mb-2 overflow-visible"
              style={{ color: 'var(--text-main)' }}
            >
              {lang === 'bn' ? (
                <>
                  আপনার অংশগ্রহণ ও{' '}
                  <span className="text-sky-700 font-bold block sm:inline-block sm:pr-4">দূরত্ব পরিমাপ</span>
                </>
              ) : (
                <>
                  Your Participation &{' '}
                  <span className="text-sky-700 font-bold block sm:inline-block sm:pr-4">Venue Distance</span>
                </>
              )}
            </h2>

            <p
              className="text-xs sm:text-sm max-w-xl mx-auto leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              {lang === 'bn'
                ? 'পুরো সাইটের লাইভ হিসাব প্রতি ৩০ সেকেন্ডে আপডেট হয়।'
                : 'Site-wide totals update every 30 seconds.'}
            </p>

            {livePaused && (
              <div className="mt-2.5 flex justify-center">
                <span
                  role="status"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-800 border border-amber-400/30"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{lang === 'bn' ? 'লাইভ আপডেট সাময়িকভাবে বন্ধ' : 'Live updates paused'}</span>
                </span>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* 3-Column HUD Metric Ribbon */}
        <StaggerGroup staggerDelay={0.07} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-7">
          {/* Metric 1: Live Online */}
          <StaggerItem className="flex">
          <div
            className="w-full catalis-card hover:translate-y-0! p-3.5 sm:p-5 flex sm:flex-col items-center sm:items-stretch justify-between gap-3 border shadow-xs"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-card)',
            }}
          >
            <div className="flex items-center justify-between sm:mb-2 order-2 sm:order-1">
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'অনলাইন দর্শক' : 'Online visitors'}
              </span>
              <span className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </span>
            </div>
            <div className="order-1 sm:order-2">
              <span className="sm:hidden text-[11px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'অনলাইন দর্শক' : 'Online visitors'}
              </span>
              <div
                className="font-serif text-xl sm:text-3xl font-extrabold tracking-tight leading-none mb-1"
                style={{ color: 'var(--text-main)' }}
              >
                <AnimatedNumber value={onlineVisitors} />
              </div>
              <span className="text-[11px] sm:text-xs font-medium block" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'গত ৯০ সেকেন্ডে সক্রিয় ব্রাউজার' : 'Active browsers in the last 90s'}
              </span>
            </div>
          </div>
          </StaggerItem>

          {/* Metric 2: Frames Built */}
          <StaggerItem className="flex">
          <div
            className="w-full catalis-card hover:translate-y-0! p-3.5 sm:p-5 flex sm:flex-col items-center sm:items-stretch justify-between gap-3 border shadow-xs"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-card)',
            }}
          >
            <div className="flex items-center justify-between sm:mb-2 order-2 sm:order-1">
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'ফ্রেম প্রস্তুতি' : 'Frame preparations'}
              </span>
              <span className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
                <Camera className="w-4 h-4" />
              </span>
            </div>
            <div className="order-1 sm:order-2">
              <span className="sm:hidden text-[11px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'ফ্রেম প্রস্তুতি' : 'Frame preparations'}
              </span>
              <div
                className="font-serif text-xl sm:text-3xl font-extrabold tracking-tight leading-none mb-1"
                style={{ color: 'var(--text-main)' }}
              >
                <AnimatedNumber value={totalFrames} />
              </div>
              <span className="text-[11px] sm:text-xs font-medium block" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'সাইটজুড়ে মোট তৈরি' : 'Across the site'}
              </span>
            </div>
          </div>
          </StaggerItem>

          {/* Metric 3: Attendees Pledged */}
          <StaggerItem className="flex">
          <div
            className="w-full catalis-card hover:translate-y-0! p-3.5 sm:p-5 flex sm:flex-col items-center sm:items-stretch justify-between gap-3 border shadow-xs"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-card)',
            }}
          >
            <div className="flex items-center justify-between sm:mb-2 order-2 sm:order-1">
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'উপস্থিতির মোট অঙ্গীকার' : 'Attendance pledges'}
              </span>
              <span className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="order-1 sm:order-2">
              <span className="sm:hidden text-[11px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'উপস্থিতির মোট অঙ্গীকার' : 'Attendance pledges'}
              </span>
              <div className="font-serif text-xl sm:text-3xl font-extrabold text-sky-700 tracking-tight leading-none mb-1">
                <AnimatedNumber value={pledgedAttendees} />
              </div>
              <span className="text-[11px] sm:text-xs font-medium block" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'ব্রাউজারপ্রতি একটি অঙ্গীকার' : 'One pledge per browser'}
              </span>
            </div>
          </div>
          </StaggerItem>

        </StaggerGroup>

        {/* 2-Column Unified Bento: Attendance Hub + Venue GPS Radar */}
        <StaggerGroup staggerDelay={0.09} className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Card A (7 Cols): Attendance Pledge Hub */}
          <StaggerItem className="lg:col-span-7 flex">
          <div
            className="w-full catalis-card hover:translate-y-0! p-5 sm:p-6 lg:p-7 flex flex-col justify-between border shadow-lg"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-card)',
            }}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3 mb-3.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-800 border border-sky-500/20">
                  <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
                  <span>{lang === 'bn' ? 'অংশগ্রহণ নিশ্চিতকরণ' : 'Attendance Pledge'}</span>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
                  {lang === 'bn' ? 'সবার জন্য উন্মুক্ত' : 'Open to All'}
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

              <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn'
                  ? 'আপনার আসার ইচ্ছা এই ব্রাউজারে মনে রাখা হবে। আয়োজকদের সাথে যোগাযোগ করতে হেল্পলাইন দেখুন।'
                  : 'Save your intention to attend on this browser. Contact the helpline to register with the organizers.'}
              </p>

              {/* Event Quick Info Box */}
              <div
                className="p-3.5 sm:p-4 rounded-2xl border space-y-2.5 mb-5"
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
                  <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>{lang === 'bn' ? '৫ ডিসেম্বর ২০২৬, শনিবার · বাদ যোহর' : 'Saturday, 5 December 2026 · After Zohr'}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <MapPin className="w-4 h-4 text-[var(--brand-blue-ink)] shrink-0 mt-0.5" />
                  <span>{SITE.locationDetails[lang]}</span>
                </div>
              </div>
            </div>

            {/* Pledge Action Button / Status */}
            <div>
              {hasPledged ? (
                <div className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-sky-800 font-bold text-xs sm:text-sm shadow-xs">
                  <CheckCircle className="w-4 h-4 text-sky-600" />
                  <span>
                    {lang === 'bn'
                      ? 'আলহামদুলিল্লাহ! এই ব্রাউজারে আপনার পছন্দ সংরক্ষিত হয়েছে'
                      : 'Alhamdulillah! Your preference is saved in this browser'}
                  </span>
                </div>
              ) : (
                <button
                  onClick={handlePledgeClick}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-md shadow-sky-950/15 hover:shadow-lg active:scale-98 transition-all cursor-pointer group"
                  style={{
                    background: 'var(--primary-gradient)',
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
          </StaggerItem>

          {/* Card B (5 Cols): Live GPS Distance & Navigation Radar */}
          <StaggerItem className="lg:col-span-5 flex">
          <div
            className="w-full catalis-card hover:translate-y-0! p-5 sm:p-6 lg:p-7 flex flex-col justify-between border shadow-lg"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-card)',
            }}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-3 mb-3.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-800 border border-sky-500/20">
                  <Compass className="w-3.5 h-3.5 text-sky-600" />
                  <span>{lang === 'bn' ? 'দূরত্ব ও দিকনির্ণয়' : 'Distance Radar'}</span>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
                  {lang === 'bn' ? 'স্মার্ট জিপিএস' : 'Smart GPS'}
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
                  ? 'জিপিএস দিয়ে মাঠের পিন থেকে আপনার আনুমানিক সরলরেখার দূরত্ব দেখুন।'
                  : 'Estimate straight-line distance to the venue pin from your current GPS location.'}
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
                  <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-sky-600">
                    {lang === 'bn' ? 'আনুমানিক সরলরেখার দূরত্ব' : 'Estimated Straight-Line Distance'}
                  </span>
                  <div className="font-serif text-3xl sm:text-4xl font-extrabold text-sky-700">
                    <AnimatedNumber value={Math.round(userDistance)} /> {lang === 'bn' ? 'কি.মি.' : 'km'}
                  </div>
                  <span className="text-[11px] mt-1 block" style={{ color: 'var(--text-muted)' }}>
                    {lang === 'bn'
                      ? 'মাদরাসা সংলগ্ন বালুর মাঠ, পাটওয়ারী বাজার, ফরিদগঞ্জ — পিন যাচাই সাপেক্ষে'
                      : 'Madrasah Sand Field, Patwari Bazar — approximate pin'}
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
                <div role="alert" className="bg-sky-500/10 border border-sky-500/20 text-sky-700 text-xs rounded-xl p-2.5 mb-3">
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
                  background: 'var(--primary-gradient)',
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
                <MapPin className="w-3.5 h-3.5 text-[var(--brand-blue-ink)]" />
                <span>{lang === 'bn' ? 'গুগল ম্যাপে দিকনির্ণয়' : 'Google Maps Directions'}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </section>
  );
}
