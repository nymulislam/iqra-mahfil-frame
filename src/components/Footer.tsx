'use client';

import React from 'react';
import {
  Mail,
  MapPin,
  Facebook,
  ArrowUp,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { SITE } from '@/content/site';
import { useSmoothScroll } from './SmoothScroll';

export function Footer() {
  const { lang, t } = useLanguage();
  const { scrollToTop } = useSmoothScroll();

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
    <footer className="relative bg-slate-950 text-slate-300 pt-8 pb-22 md:py-10 overflow-hidden border-t border-sky-500/20 shadow-[0_-10px_30px_rgba(2,91,169,0.13)] transition-colors duration-500">
      {/* Subtle Top Specular Highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[520px] h-28 rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.14) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier: Brand Identity + Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 pb-6 border-b border-white/10">
          {/* Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl p-1 bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SITE.logo}
                alt={SITE.name[lang]}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
                {SITE.name[lang]}
              </h4>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-400 mt-0.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{SITE.location[lang]}</span>
              </span>
            </div>
          </div>

          {/* Contact & Top Button */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition min-w-0"
            >
              <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">{SITE.email}</span>
            </a>

            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-blue-400 transition shrink-0"
            >
              <Facebook className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Facebook</span>
            </a>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold text-slate-200 hover:text-white bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/25 transition active:scale-95 cursor-pointer ml-auto sm:ml-0 shrink-0"
            >
              <span>{lang === 'bn' ? 'উপরে' : 'Top'}</span>
              <ArrowUp className="w-3.5 h-3.5 text-sky-300" />
            </button>
          </div>
        </div>

        {/* Middle Tier: Clean Inline Navigation Strip */}
        <nav
          aria-label={lang === 'bn' ? 'ফুটার নেভিগেশন' : 'Footer navigation'}
          className="py-4 border-b border-white/10 flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-xs"
        >
          {navLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="text-slate-400 hover:text-white transition font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Bottom Tier: Copyright & Credit */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-400">
          <div className="text-center sm:text-left">
            <span>{t.footer.copyright[lang]}</span>
            <span className="mx-1.5 opacity-30">•</span>
            <span className="text-slate-300 whitespace-nowrap">
              {lang === 'bn' ? 'আন-নুজুম ফাউন্ডেশন' : 'An-Nujum Foundation'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
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
        </div>
      </div>
    </footer>
  );
}
