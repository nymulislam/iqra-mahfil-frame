'use client';

import React, { useState } from 'react';
import {
  Download,
  Share2,
  Calendar,
  MapPin,
  Check,
  FileCheck,
  Eye,
} from 'lucide-react';
import { OFFICIAL_POSTER, sharePoster } from '@/lib/poster';
import { useLanguage } from '@/context/LanguageContext';

interface BannerPreviewProps {
  onOpenLightbox: () => void;
}

export function BannerPreview({ onOpenLightbox }: BannerPreviewProps) {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [imageError, setImageError] = useState(false);

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    setFeedback('');
    try {
      const result = await sharePoster(lang);
      setCopied(result === 'copied');
      setFeedback(result === 'copied' ? (lang === 'bn' ? 'পোস্টারের লিংক কপি হয়েছে' : 'Poster link copied')
        : (lang === 'bn' ? 'পোস্টার শেয়ার হয়েছে' : 'Poster shared'));
    } catch (error) {
      if ((error as Error).name !== 'AbortError') setFeedback(lang === 'bn'
        ? 'শেয়ার করা যায়নি। পোস্টার ডাউনলোড করে শেয়ার করুন।'
        : 'Sharing failed. Download the poster to share it.');
    } finally {
      setSharing(false);
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
      <p role="status" className="text-center text-sm px-4">{feedback}</p>
      {/* Background Decorative Ambient Radial Glow (Sky Blue & Cyan) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full opacity-70"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.14) 0%, rgba(6, 182, 212, 0.08) 45%, transparent 72%)',
          }}
        />
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
          className="catalis-card hover:translate-y-0! p-4 sm:p-6 lg:p-7 shadow-xl border overflow-hidden"
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
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-[var(--surface-sky)] text-[var(--brand-blue-ink)] border border-sky-500/20">
                    <FileCheck className="w-3 h-3 text-sky-600" />
                    <span>{lang === 'bn' ? 'অফিসিয়াল পোস্টার' : 'Official Poster'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-teal-500/10 text-[var(--brand-blue-ink)] border border-teal-500/20">
                    <span>{lang === 'bn' ? '১০৬৬ × ১৬০০ পিক্সেল' : '1066 × 1600 pixels'}</span>
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
                    <Calendar className="w-4 h-4 text-[var(--brand-gold-ink)] shrink-0" />
                    <span>{lang === 'bn' ? '৫ ডিসেম্বর ২০২৬, শনিবার (বাদ যোহর)' : 'Saturday, 5 December 2026 (After Zohr)'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <MapPin className="w-4 h-4 text-[var(--brand-blue-ink)] shrink-0" />
                    <span>{lang === 'bn' ? 'মাদরাসা সংলগ্ন বালুর মাঠ, পাটওয়ারী বাজার, ফরিদগঞ্জ, চাঁদপুর' : 'Madrasah Sand Field, Patwari Bazar, Faridganj, Chandpur'}</span>
                  </div>
                </div>
              </div>

              {/* Direct Access Action Buttons */}
              <div className="pt-1">
                {/* Download HD & Share */}
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={OFFICIAL_POSTER.src}
                    download={OFFICIAL_POSTER.filename}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-black text-white shadow-xs active:scale-95 transition-all text-center"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-400" />
                    <span>{lang === 'bn' ? 'এইচডি ডাউনলোড' : 'Download HD'}</span>
                  </a>

                  <button
                    onClick={handleShare}
                    disabled={sharing}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs border shadow-2xs hover:bg-slate-100/60 active:scale-95 transition-all cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-main)',
                    }}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-sky-600" />
                        <span className="text-sky-600">{lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!'}</span>
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
                    src={OFFICIAL_POSTER.src}
              width={OFFICIAL_POSTER.width} height={OFFICIAL_POSTER.height}
                    onError={() => setImageError(true)}
                    alt="Iqra Mahfil 2026 Official Poster"
                    className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />

                  {/* Gradient Fade to imply more content */}
                  {imageError && <p role="alert" className="absolute inset-0 grid place-content-center bg-white p-4 text-center">
                    {lang === 'bn' ? 'পোস্টার লোড হয়নি। পেজটি আবার খুলুন।' : 'Poster failed to load. Reload the page.'}
                  </p>}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/70 via-slate-950/30 to-transparent pointer-events-none" />

                  {/* Floating Compact Click-to-Expand Badge */}
                  <div className="absolute bottom-3 inset-x-0 flex justify-center px-4 pointer-events-none">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 text-slate-900 text-xs font-bold shadow-xl border border-white/60 transform group-hover:scale-105 transition-transform">
                      <Eye className="w-3.5 h-3.5 text-sky-600" />
                      <span>{lang === 'bn' ? 'সম্পূর্ণ দেখতে ক্লিক করুন (জুম)' : 'Click to View Full Poster'}</span>
                    </span>
                  </div>

                  {/* Quick Corner Tag */}
                  <div className="absolute top-3 right-3 pointer-events-none">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/85 text-white border border-white/20 shadow-xs">
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
