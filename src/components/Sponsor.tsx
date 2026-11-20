'use client';

import React from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Plane,
  Eye,
  Award,
} from 'lucide-react';
import { displayPhone, phoneHref } from '@/lib/phone';
import { useLanguage } from '@/context/LanguageContext';
import { SPONSOR_DATA } from '@/content/sponsor';
import { ScrollReveal } from './ScrollReveal';
import { SmartImage } from './SmartImage';

interface SponsorProps {
  onOpenCard?: () => void;
}

export function Sponsor({ onOpenCard }: SponsorProps) {
  const { lang } = useLanguage();
  const sponsor = SPONSOR_DATA;

  return (
    <section
      id="sponsor"
      className="py-10 sm:py-16 md:py-20 relative overflow-hidden border-b transition-colors duration-500"
      style={{
        backgroundColor: 'var(--bg-page)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Subtle Sky / Emerald Ambient Radial Glow */}
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
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <h2
              className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight leading-[1.25] sm:leading-[1.2] mb-1.5 sm:mb-2 overflow-visible"
              style={{ color: 'var(--text-main)' }}
            >
              {sponsor.name[lang]}{' '}
              <span className="text-sky-700 font-bold block sm:inline-block sm:pr-4">
                {lang === 'bn' ? '• হজ্ব ও উমরাহ' : '• Hajj & Umrah'}
              </span>
            </h2>

            <p
              className="hidden sm:block text-sm max-w-xl mx-auto leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              {sponsor.desc[lang]}
            </p>
          </div>
        </ScrollReveal>

        {/* Ultra-Premium Dual-Pane Sponsor Bento Card */}
        <ScrollReveal y={16}>
          <div
            className="catalis-card hover:translate-y-0! p-4 sm:p-7 lg:p-8 border shadow-xl overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-card)',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
              {/* Left Column: Agency Brand, Services & Quick Contacts (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-3.5 sm:space-y-5">
              <div>
                {/* Agency Brand Bar with Logo */}
                <div className="flex items-center gap-3 sm:gap-4 mb-3.5 sm:mb-4">
                  <div
                    className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-2xl p-1.5 border shadow-sm shrink-0 flex items-center justify-center bg-white"
                    style={{ borderColor: 'var(--border-card)' }}
                  >
                    <SmartImage
                      src={sponsor.logo}
                      alt={sponsor.name[lang]}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/10 text-sky-800 border border-teal-500/20 mb-1">
                      <Plane className="w-3 h-3 text-sky-600" />
                      <span>{lang === 'bn' ? 'বিশ্বস্ত হজ্ব কাফেলা' : 'Trusted Pilgrimage Agency'}</span>
                    </span>
                    <h3
                      className="font-serif text-base sm:text-2xl font-bold leading-tight truncate"
                      style={{ color: 'var(--text-main)' }}
                    >
                      {sponsor.name[lang]}
                    </h3>
                    <p className="hidden sm:block text-xs text-sky-700 font-semibold mt-0.5">
                      {lang === 'bn' ? 'সঠিকভাবে হজ্ব ও উমরাহ পালনের বিশ্বস্ত সহযোগী' : 'Hajj & Umrah Pilgrim Services'}
                    </p>
                  </div>
                </div>

                {/* Service Bullet Chips */}
                <div
                  className="p-3 sm:p-4 rounded-2xl border mb-3 sm:mb-4"
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <span className="text-[11px] font-bold block mb-1.5 sm:mb-2" style={{ color: 'var(--text-main)' }}>
                    {lang === 'bn' ? 'প্রধান সেবাসমূহ:' : 'Core Services:'}
                  </span>
                  <div className="grid grid-cols-2 gap-x-2.5 gap-y-1.5 sm:gap-2 text-[11px] sm:text-xs">
                    {sponsor.services[lang].map((srv, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 sm:gap-2 min-w-0" style={{ color: 'var(--text-muted)' }}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="truncate">{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Office Address & Email */}
                <div className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs" style={{ color: 'var(--text-muted)' }}>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[var(--brand-blue-ink)] shrink-0 mt-0.5" />
                    <span className="leading-snug">{sponsor.contacts.address[lang]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <a
                      href={`mailto:${sponsor.contacts.email}`}
                      className="hover:underline text-slate-700 font-medium truncate"
                    >
                      {sponsor.contacts.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct Calling Hotline Bar */}
              <div className="pt-2.5 border-t grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5" style={{ borderColor: 'var(--border-subtle)' }}>
                <a
                  href={phoneHref(sponsor.contacts.mobile1)}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-[11px] sm:text-xs bg-sky-600 hover:bg-sky-700 text-white shadow-xs active:scale-95 transition cursor-pointer min-w-0"
                >
                  <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{displayPhone(sponsor.contacts.mobile1, lang)}</span>
                </a>

                <a
                  href={phoneHref(sponsor.contacts.mobile2)}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-[11px] sm:text-xs bg-slate-900 hover:bg-black text-white shadow-xs active:scale-95 transition cursor-pointer min-w-0"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">{displayPhone(sponsor.contacts.mobile2, lang)}</span>
                </a>

                {onOpenCard && (
                  <button
                    onClick={onOpenCard}
                    className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-xl font-semibold text-xs border shadow-2xs hover:bg-slate-100/60 active:scale-95 transition cursor-pointer sm:ml-auto"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-main)',
                    }}
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-600" />
                    <span>{lang === 'bn' ? 'ভিজিটিং কার্ড দেখুন' : 'Visiting Card'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Director Profile Card (5 Cols) */}
            <div className="lg:col-span-5">
              <div
                className="p-4 sm:p-6 rounded-2xl border shadow-md relative overflow-hidden group"
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderColor: 'var(--border-card)',
                }}
              >
                {/* Director Header Badge */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-sky-500/15 text-sky-800 border border-sky-400/30">
                    <Award className="w-3.5 h-3.5 text-sky-600" />
                    <span>{lang === 'bn' ? 'স্পনসর ও পরিচালক' : 'Sponsor & Director'}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {lang === 'bn' ? 'ইক্বরা শুভাকাঙ্ক্ষী' : 'Patron'}
                  </span>
                </div>

                <div className="flex flex-row items-center sm:items-start gap-3.5 sm:gap-4 mb-3.5 sm:mb-4 text-left">
                  {/* Director Portrait with Specular Sky Ring */}
                  <div className="relative w-20 h-24 sm:w-28 sm:h-32 rounded-2xl overflow-hidden border shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300 ring-2 ring-sky-500/30 bg-slate-900">
                    <SmartImage
                      src={sponsor.director.photo}
                      alt={sponsor.director.name[lang]}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Director Info */}
                  <div className="min-w-0 flex-1">
                    <h4
                      className="font-serif text-sm sm:text-lg font-bold leading-snug mb-0.5 sm:mb-1"
                      style={{ color: 'var(--text-main)' }}
                    >
                      {sponsor.director.name[lang]}
                    </h4>
                    <p className="text-[11px] sm:text-xs font-semibold text-sky-800 mb-1 sm:mb-2">
                      {lang === 'bn' ? 'পরিচালক, আর রহমান ট্রাভেলস' : 'Director, Ar-Rahman Travels'}
                    </p>
                    <p className="text-[11px] leading-relaxed line-clamp-3 sm:line-clamp-none" style={{ color: 'var(--text-muted)' }}>
                      {sponsor.director.designation[lang]}
                    </p>
                  </div>
                </div>

                {/* Direct Action Bar */}
                <div className="pt-3 border-t flex items-center justify-between gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[11px] font-medium text-slate-500">
                    {lang === 'bn' ? 'টেলিফোন: +৮৮০ ২ ৪১০৭১৩৬৩' : 'Tel: +880 2 41071363'}
                  </span>
                  <a
                    href={`https://wa.me/8801824803545?text=${encodeURIComponent(
                      'আসসালামু আলাইকুম মুফতী সাহেব, আর রহমান ট্রাভেলসের হজ্ব/উমরাহ সম্পর্কে জানতে চাই।'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-teal-500/15 text-sky-700 hover:bg-sky-600 hover:text-white transition cursor-pointer"
                  >
                    <span>WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
