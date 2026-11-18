'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Download,
  Maximize2,
  Share2,
  Calendar,
  MapPin,
  Check,
  FileCheck,
  Eye,
  ArrowUpRight,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BannerPreviewProps {
  onOpenLightbox: () => void;
}

export function BannerPreview({ onOpenLightbox }: BannerPreviewProps) {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const shareData = {
        title: lang === 'bn' ? 'ইক্বরা মাহফিল ২০২৬ অফিসিয়াল পোস্টার' : 'Iqra Mahfil 2026 Official Poster',
        text:
          lang === 'bn'
            ? 'বার্ষিক তাফসীরুল কুরআন মাহফিল ২০২৬ — ৫ ডিসেম্বর, বাদ যোহর। ইক্বরা ইন্টারন্যাশনাল মাদরাসা, ফরিদগঞ্জ, চাঁদপুর।'
            : 'Annual Tafsirul Quran Mahfil 2026 — 5 December. Iqra International Madrasah, Faridganj, Chandpur.',
        url: typeof window !== 'undefined' ? window.location.origin + '#banner' : 'https://iqra.annujum.org',
      };
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      // User dismissed share dialog
    }
  };

  return (
    <section
      id="banner"
      className="py-12 sm:py-16 md:py-20 relative overflow-hidden border-b transition-colors duration-500"
      style={{
        backgroundColor: 'var(--bg-page)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Background Decorative Ambient Radial Glow (Sky Blue & Cyan) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-teal-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2
            className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight leading-[1.25] sm:leading-[1.2] mb-2 overflow-visible"
            style={{ color: 'var(--text-main)' }}
          >
            {lang === 'bn' ? (
              <>
                মাহফিলের অফিসিয়াল{' '}
                <span className="text-sky-700 font-bold block sm:inline-block pr-4">পোস্টার ও ব্যানার</span>
              </>
            ) : (
              <>
                Official Mahfil{' '}
                <span className="text-sky-700 font-bold block sm:inline-block pr-4">Poster & Banner</span>
              </>
            )}
          </h2>

          <p
            className="text-xs sm:text-sm max-w-xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {lang === 'bn'
              ? 'সম্মানিত ওলামায়ে কেরামের তালিকা ও মাহফিলের বিস্তারিত তথ্য সংবলিত মূল পোস্টার।'
              : 'Official high-resolution poster featuring the full line-up of distinguished scholars.'}
          </p>
        </div>

        {/* Ultra-Premium Compact Bento Showcase (Dual Pane) */}
        <div
          className="catalis-card p-4 sm:p-6 lg:p-7 shadow-xl border overflow-hidden backdrop-blur-sm"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-card)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Quick Action & Spec Hub */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5 order-2 lg:order-1">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-sky-500/10 text-sky-800 border border-sky-500/20">
                    <FileCheck className="w-3 h-3 text-sky-600" />
                    <span>{lang === 'bn' ? 'ফুল এইচডি প্রিন্ট কপি' : 'Ultra-HD Print Ready'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-teal-500/10 text-teal-700 border border-teal-500/20">
                    <span>{lang === 'bn' ? '৪K রেজ্যুলেশন' : '4K Resolution'}</span>
                  </span>
                </div>

                <h3
                  className="font-serif text-lg sm:text-xl font-bold leading-snug mb-2"
                  style={{ color: 'var(--text-main)' }}
                >
                  {lang === 'bn'
                    ? 'বার্ষিক তাফসীরুল কুরআন মাহফিল ২০২৬'
                    : 'Annual Tafsirul Quran Mahfil 2026'}
                </h3>

                <p
                  className="text-xs leading-relaxed mb-4"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {lang === 'bn'
                    ? 'পোস্টারটি ফুলস্ক্রিনে বিস্তারিত পড়ুন, প্রিন্ট করতে বা সোশ্যাল মিডিয়ায় দাওয়াত ছড়াতে ডাউনলোড ও শেয়ার করুন।'
                    : 'Inspect full scholar details in fullscreen, or download the ultra-clear image to invite family and friends.'}
                </p>

                {/* Quick Info Grid */}
                <div
                  className="p-3.5 rounded-2xl border space-y-2 mb-1"
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold" style={{ color: 'var(--text-main)' }}>
                    <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>{lang === 'bn' ? '৫ ডিসেম্বর ২০২৬, শনিবার (বাদ যোহর)' : 'Saturday, 5 December 2026 (After Zohr)'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{lang === 'bn' ? 'মাদরাসা সংলগ্ন বালুর মাঠ, পাটোয়ারী বাজার, ফরিদগঞ্জ' : 'Madrasah Sand Field, Patwari Bazar, Faridganj'}</span>
                  </div>
                </div>
              </div>

              {/* Direct Access Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {/* Primary Button: Open Fullscreen Lightbox */}
                <button
                  onClick={onOpenLightbox}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-md shadow-sky-950/15 hover:shadow-lg active:scale-98 transition-all cursor-pointer group"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                  }}
                >
                  <Maximize2 className="w-4 h-4 text-sky-200 group-hover:scale-110 transition-transform" />
                  <span>{lang === 'bn' ? 'সম্পূর্ণ পোস্টার দেখুন (ফুলস্ক্রিন)' : 'View Fullscreen Poster'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 ml-auto" />
                </button>

                {/* Secondary Row: Download HD & Share */}
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href="/assets/posters/mahfil-banner.jpg"
                    download="iqra-mahfil-2026-banner.jpg"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-black text-white shadow-xs active:scale-95 transition-all text-center"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-400" />
                    <span>{lang === 'bn' ? 'এইচডি ডাউনলোড' : 'Download HD'}</span>
                  </a>

                  <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs border shadow-2xs hover:bg-slate-100/60 active:scale-95 transition-all cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-main)',
                    }}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">{lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-sky-600" />
                        <span>{lang === 'bn' ? 'শেয়ার করুন' : 'Share'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Acrylic Poster Frame */}
            <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center">
              <div
                onClick={onOpenLightbox}
                className="group relative w-full max-w-md sm:max-w-lg cursor-pointer rounded-2xl overflow-hidden border border-slate-200/90 shadow-lg hover:shadow-2xl transition-all duration-300 bg-slate-100 flex items-center justify-center"
              >
                {/* Poster Preview Image */}
                <div className="relative w-full h-[320px] sm:h-[380px] overflow-hidden flex items-center justify-center bg-gradient-to-b from-sky-950/5 via-transparent to-sky-950/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/posters/mahfil-banner.jpg"
                    alt="Iqra Mahfil 2026 Official Poster"
                    className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />

                  {/* Gradient Fade to imply more content */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/70 via-slate-950/30 to-transparent pointer-events-none" />

                  {/* Floating Compact Click-to-Expand Badge */}
                  <div className="absolute bottom-3 inset-x-0 flex justify-center px-4 pointer-events-none">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 text-slate-900 text-xs font-bold shadow-xl backdrop-blur-md border border-white/60 transform group-hover:scale-105 transition-all">
                      <Eye className="w-3.5 h-3.5 text-sky-600" />
                      <span>{lang === 'bn' ? 'সম্পূর্ণ দেখতে ক্লিক করুন (জুম)' : 'Click to View Full Poster'}</span>
                    </span>
                  </div>

                  {/* Quick Corner Tag */}
                  <div className="absolute top-3 right-3 pointer-events-none">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md border border-white/20 shadow-xs">
                      <span>{lang === 'bn' ? 'অফিসিয়াল' : 'Official'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
