'use client';

import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'motion/react';
import {
  PhoneCall,
  Camera,
  BookOpen,
  Users,
  GraduationCap,
  Heart,
  Image as ImageIcon,
  ChevronDown,
  Phone,
  MapPin,
  X,
  Award,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { displayPhone, phoneHref } from '@/lib/phone';
import { SITE } from '@/content/site';

export function Nav() {
  const { lang, setLang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showHelpline, setShowHelpline] = useState(false);
  const helplineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // When near top (Hero / Countdown area), NO section should be active
      const mahfilEl = document.getElementById('mahfil');
      if (!mahfilEl || scrollY < mahfilEl.offsetTop - 280) {
        setActiveSection('');
        return;
      }

      // Check sections from bottom to top for accurate highlight
      const sections = ['sponsor', 'support', 'madrasah', 'live', 'frame', 'speakers', 'banner', 'mahfil'];
      const scrollPos = scrollY + 220;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            return;
          }
        }
      }

      setActiveSection('');
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close helpline popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (helplineRef.current && !helplineRef.current.contains(event.target as Node)) {
        setShowHelpline(false);
      }
    };
    if (!showHelpline) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowHelpline(false);
        helplineRef.current?.querySelector('button')?.focus();
      }
    };
    document.addEventListener('keydown', escape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', escape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHelpline]);

  const navLinks = [
    { id: 'mahfil', label: t.nav.mahfil[lang], href: '#mahfil', icon: BookOpen },
    { id: 'banner', label: t.nav.banner[lang], href: '#banner', icon: ImageIcon },
    { id: 'speakers', label: t.nav.speakers[lang], href: '#speakers', icon: Users },
    { id: 'frame', label: t.nav.frame[lang], href: '#frame', icon: Camera },
    { id: 'madrasah', label: t.nav.madrasah[lang], href: '#madrasah', icon: GraduationCap },
    { id: 'support', label: t.nav.support[lang], href: '#support', icon: Heart },
    { id: 'sponsor', label: lang === 'bn' ? 'স্পনসর' : 'Sponsor', href: '#sponsor', icon: Award },
  ];

  return (
    <header
      className={`portal-header fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? 'pt-2.5 sm:pt-3 px-3 sm:px-6 pointer-events-none'
          : 'pt-0 px-4 sm:px-6 lg:px-8 bg-transparent'
      }`}
    >
      <div
        className={`nav-glass relative w-full transition-all duration-500 ease-out pointer-events-auto ${
          isScrolled
            ? 'w-[96%] max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 h-13 sm:h-16 rounded-full flex items-center justify-between gap-2 sm:gap-4'
            : 'max-w-7xl mx-auto h-14 sm:h-16 lg:h-20 flex items-center justify-between gap-2 px-2 sm:px-4 rounded-b-2xl'
        }`}
      >
        {/* Brand: Iqra International Madrasah */}
        <a
          href="#"
          className="flex items-center gap-2.5 sm:gap-3 group min-w-0 lg:shrink-0"
          title={SITE.name[lang]}
        >
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-2xl overflow-hidden p-0.5 border border-[var(--brand-indigo)] bg-white shadow-sm flex items-center justify-center group-hover:scale-105 group-hover:shadow-md transition-all duration-300 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SITE.logo}
              alt={SITE.name[lang]}
              className="w-full h-full object-contain"
            />
            {/* Subtle corner sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-sky-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex flex-col min-w-0 overflow-hidden">
            <div className="hidden min-[400px]:flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-sky-700 transition-colors">
                {lang === 'bn' ? 'ইক্বরা' : 'Iqra'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[var(--brand-primary)] font-sans leading-none">
                {lang === 'bn' ? 'ইন্টারন্যাশনাল' : 'International'}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-sky-700 transition-colors">
                {lang === 'bn' ? 'মাদরাসা' : 'Madrasah'}
              </span>
            </div>
            <span className="min-[400px]:hidden text-xs font-bold leading-tight text-[var(--brand-blue-ink)]">
              {SITE.shortName[lang]}
            </span>
            {/* Subtitle hides on scrolled state unless large desktop, keeping floating pill balanced */}
            <span
              className={`text-xs font-semibold text-slate-500 tracking-wide mt-0.5 whitespace-nowrap transition-all duration-300 ${
                isScrolled ? 'hidden xl:block' : 'hidden min-[400px]:block'
              }`}
            >
              {lang === 'bn' ? '৫ ডিসেম্বর ২০২৬ • বাদ যোহর' : '5 December 2026 • After Zohr'}
            </span>
          </div>
        </a>

        {/* Center: 3D Fluid Animated Navigation Dock (Responsive, no text wrap) */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-1 rounded-full bg-slate-900/5 backdrop-blur-md border border-slate-200/60 shrink-0">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = Boolean(activeSection) && activeSection === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setActiveSection(item.id)}
                className={`relative px-1.5 xl:px-2.5 2xl:px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap select-none ${
                  isActive
                    ? 'text-sky-950 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 font-semibold'
                }`}
              >
                {isActive && (
                  <m.div
                    layoutId="activeNavTabPill"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-b from-white via-white to-sky-50/90 border border-sky-300/60 shadow-[0_3px_10px_rgba(2,108,182,0.18),0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,1)]"
                    style={{ zIndex: -1 }}
                  />
                )}
                <Icon
                  className={`hidden min-[1370px]:block w-3.5 h-3.5 shrink-0 transition-colors ${
                    isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Suite: Smart 3D Helpline Button + 3D Segmented Language Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Smart Helpline Dropdown Pill */}
          <div className="sm:relative" ref={helplineRef}>
            <button
              onClick={() => setShowHelpline(!showHelpline)}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-bold bg-gradient-to-b from-white to-slate-50 hover:to-white text-slate-800 border border-slate-200/90 shadow-[0_2px_6px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_4px_12px_rgba(2,108,182,0.12)] transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
              title={lang === 'bn' ? 'মাদরাসা সার্বিক হেল্পলাইন' : 'Madrasah Direct Helpline'}
              aria-expanded={showHelpline}
              aria-controls="helpline-panel"
            >
              <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-2xs shrink-0">
                <PhoneCall className="w-2.5 h-2.5" strokeWidth={2.2} />
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
              </span>
              <span className="font-bold text-slate-800 hidden xs:inline sm:inline lg:hidden xl:inline">
                {lang === 'bn' ? 'হেল্পলাইন' : 'Helpline'}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ${
                  showHelpline ? 'rotate-180' : ''
                }`}
                strokeWidth={2}
              />
            </button>

            {/* Smart Helpline 3D Popover Card */}
            <AnimatePresence>
              {showHelpline && (
                <m.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  id="helpline-panel" data-lenis-prevent
                  className="absolute inset-x-0 top-full mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain sm:left-auto sm:right-0 sm:w-84 rounded-3xl p-4 bg-white/95 backdrop-blur-2xl border border-sky-200/70 shadow-[0_20px_35px_-5px_rgba(2,108,182,0.15),0_10px_10px_-5px_rgba(0,0,0,0.04)] ring-1 ring-white/90 z-50"
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-sky-600">
                        <Phone className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {lang === 'bn' ? 'মাদরাসা জরুরি হেল্পলাইন' : 'Madrasah Direct Helpline'}
                        </h4>
                        <span className="text-[10px] text-sky-600 font-semibold flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          {lang === 'bn' ? 'সরাসরি সেবা সক্রিয়' : 'Lines Active'}
                        </span>
                      </div>
                    </div>
                    <button
                      aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close helpline'}
                      onClick={() => { setShowHelpline(false); helplineRef.current?.querySelector('button')?.focus(); }}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Phone Option 1: Principal */}
                  <div className="space-y-2 mb-3">
                    <div className="p-2.5 rounded-2xl bg-gradient-to-r from-sky-50/80 to-blue-50/40 border border-sky-100/80 flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] font-bold text-sky-800 uppercase tracking-wider">
                          {lang === 'bn' ? 'মুহতামীম / প্রিন্সিপাল' : 'Principal Office'}
                        </span>
                        <span className="block text-xs font-bold font-mono text-slate-900 mt-0.5">
                          {displayPhone(SITE.phones[0], lang)}
                        </span>
                      </div>
                      <a
                        href={phoneHref(SITE.phones[0])}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold primary-action text-white shadow-sm hover:shadow active:scale-95 transition"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{lang === 'bn' ? 'কল' : 'Call'}</span>
                      </a>
                    </div>

                    {/* Phone Option 2: General Coordination */}
                    <div className="p-2.5 rounded-2xl bg-gradient-to-r from-sky-50/80 to-blue-50/40 border border-sky-100/80 flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] font-bold text-sky-800 uppercase tracking-wider">
                          {lang === 'bn' ? 'তথ্য ও সমন্বয়' : 'Info & Coordination'}
                        </span>
                        <span className="block text-xs font-bold font-mono text-slate-900 mt-0.5">
                          {displayPhone(SITE.phones[1], lang)}
                        </span>
                      </div>
                      <a
                        href={phoneHref(SITE.phones[1])}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold primary-action text-white shadow-sm hover:shadow active:scale-95 transition"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{lang === 'bn' ? 'কল' : 'Call'}</span>
                      </a>
                    </div>
                  </div>

                  {/* Footer note */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[var(--brand-blue-ink)]" />
                      {lang === 'bn' ? 'পাটওয়ারী বাজার, ফরিদগঞ্জ, চাঁদপুর' : 'Faridganj, Chandpur'}
                    </span>
                    <span className="font-semibold text-slate-600">
                      {lang === 'bn' ? 'সকাল ৯টা - রাত ১০টা' : '9 AM - 10 PM'}
                    </span>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3D Segmented Language Toggle Pill */}
          <div
            className="relative inline-flex items-center p-0.5 rounded-full bg-slate-100/90 border border-slate-200/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] backdrop-blur-md shrink-0"
            role="group"
            aria-label="Language Selector"
          >
            <button
              onClick={() => lang !== 'bn' && setLang('bn')}
              className={`relative px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors duration-200 select-none cursor-pointer whitespace-nowrap ${
                lang === 'bn' ? 'text-sky-950 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {lang === 'bn' && (
                <m.div
                  layoutId="activeLangIndicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-b from-white to-slate-50 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)]"
                  style={{ zIndex: -1 }}
                />
              )}
              বাং
            </button>
            <button
              onClick={() => lang !== 'en' && setLang('en')}
              className={`relative px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors duration-200 select-none cursor-pointer whitespace-nowrap ${
                lang === 'en' ? 'text-sky-950 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {lang === 'en' && (
                <m.div
                  layoutId="activeLangIndicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-b from-white to-slate-50 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)]"
                  style={{ zIndex: -1 }}
                />
              )}
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
