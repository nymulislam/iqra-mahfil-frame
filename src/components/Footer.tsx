'use client';

import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  ArrowUp,
  PhoneCall,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { displayPhone, phoneHref } from '@/lib/phone';
import { SITE } from '@/content/site';

export function Footer() {
  const { lang, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: t.nav.mahfil[lang], href: '#mahfil' },
    { label: t.nav.banner[lang], href: '#banner' },
    { label: lang === 'bn' ? 'বক্তাবৃন্দ' : 'Scholars', href: '#speakers' },
    { label: t.nav.frame[lang], href: '#frame' },
    { label: t.nav.live[lang], href: '#live' },
    { label: t.nav.madrasah[lang], href: '#madrasah' },
    { label: t.nav.support[lang], href: '#support' },
    { label: lang === 'bn' ? 'স্পনসর' : 'Sponsor', href: '#sponsor' },
  ];

  return (
    <footer className="relative bg-slate-950 text-slate-300 pt-12 pb-24 md:pb-12 overflow-hidden border-t border-sky-500/20 shadow-[0_-10px_30px_rgba(2,91,169,0.13)] transition-colors duration-500">
      {/* Ambient Top Specular Light Line (Sky Cyan / Royal Blue - Official Brand) */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-sky-500/10 blur-[80px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Modern 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 mb-10">
          {/* Col 1: Madrasah Brand & Creed (5 Cols) */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl p-1 bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={SITE.logo}
                  alt={SITE.name[lang]}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-base font-bold text-white tracking-tight leading-tight">
                  {SITE.name[lang]}
                </h4>
                <span className="text-xs font-semibold text-sky-400 block mt-0.5">
                  {lang === 'bn' ? 'পাটওয়ারী বাজার, ফরিদগঞ্জ, চাঁদপুর' : 'Patwari Bazar, Faridganj'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
              {lang === 'bn'
                ? 'কুরআন-সুন্নাহর সঠিক শিক্ষায় সৎ, আদর্শ ও মানবিক গুণসম্পন্ন চরিত্র গঠনে নিবেদিত এক আদর্শ দ্বীনি বিদ্যাপীঠ।'
                : 'Dedicated to cultivating Islamic morals and authentic Quranic education for future generations.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <MapPin className="w-3.5 h-3.5 text-[var(--brand-sky)] shrink-0" />
              <span className="truncate">{SITE.locationDetails[lang]}</span>
            </div>
          </div>

          {/* Col 2: Quick Links (3 Cols) */}
          <div className="md:col-span-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-3 rounded-full bg-sky-500" />
              <span>{lang === 'bn' ? 'ওয়েবসাইট লিংক' : 'Quick Links'}</span>
            </h5>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs">
              {navLinks.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="text-slate-400 hover:text-white transition py-0.5 truncate"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: Helplines & Official Contacts (4 Cols) */}
          <div className="md:col-span-4 space-y-2.5">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-3 rounded-full bg-teal-500" />
              <span>{lang === 'bn' ? 'জরুরি হেল্পলাইন' : 'Helpline & Inquiries'}</span>
            </h5>

            {/* Helpline Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={phoneHref(SITE.phones[0])}
                className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-xs group"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <span className="font-mono font-bold text-white text-xs">{displayPhone(SITE.phones[0], lang)}</span>
                </div>
              </a>

              <a
                href={phoneHref(SITE.phones[1])}
                className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-xs group"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-mono font-bold text-white text-xs">{displayPhone(SITE.phones[1], lang)}</span>
                </div>
              </a>
            </div>

            <div className="flex items-center gap-4 text-xs pt-1 text-slate-400">
              <a href={`mailto:${SITE.email}`} className="hover:text-white transition flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">{SITE.email}</span>
              </a>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition flex items-center gap-1">
                <Facebook className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* Minimal Sub-footer Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            <span>{t.footer.copyright[lang]}</span>
            <span className="mx-2 opacity-30">•</span>
            <span className="text-xs text-slate-300">{lang === 'bn' ? 'আন-নুজুম ফাউন্ডেশন' : 'An-Nujum Foundation'}</span>
          </div>

          {/* Developer Credit Minimal Pill */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Crafted by</span>
            <span className="font-bold text-white">NAYMUL ISLAM</span>
            <span className="opacity-30">•</span>
            <a
              href="https://wa.me/8801822667737"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:underline"
            >
              WhatsApp
            </a>
            <span className="opacity-30">•</span>
            <a
              href="https://github.com/nymulislam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white"
            >
              GitHub
            </a>
          </div>

          {/* Floating Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition active:scale-95 cursor-pointer"
          >
            <span>{lang === 'bn' ? 'উপরে' : 'Top'}</span>
            <ArrowUp className="w-3 h-3 text-sky-400" />
          </button>
        </div>
      </div>
    </footer>
  );
}
