'use client';

import React from 'react';
import {
  BookOpen,
  Bell,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Users,
  GraduationCap,
  PhoneCall,
  Volume2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { MAHFIL } from '@/content/mahfil';
import { displayPhone, phoneHref } from '@/lib/phone';
import { SITE } from '@/content/site';

export function Ticker() {
  const { lang } = useLanguage();

  const items = [
    {
      icon: <BookOpen className="w-3.5 h-3.5 text-sky-300 shrink-0" />,
      tag: lang === 'bn' ? 'ঐতিহাসিক সম্মেলন' : 'Grand Conference',
      text: MAHFIL.title[lang],
      highlight: true,
      href: '#mahfil',
    },
    {
      icon: <Bell className="w-3.5 h-3.5 text-sky-300 shrink-0" />,
      tag: lang === 'bn' ? 'দাওয়াত' : 'Invitation',
      text: MAHFIL.slogan[lang],
      highlight: true,
      href: '#mahfil',
    },
    {
      icon: <Calendar className="w-3.5 h-3.5 shrink-0" />,
      dateStyle: 'next-event',
      tag: lang === 'bn' ? 'পরবর্তী মাহফিল ২০২৭' : 'Next Year 2027',
      text: lang === 'bn' ? `ইনশাআল্লাহ আগামী বছর মাহফিল: ${MAHFIL.nextYearMahfil.bn}` : `Next Year Annual Mahfil: ${MAHFIL.nextYearMahfil.en}`,
      highlight: true,
      href: '#mahfil',
    },
    {
      icon: <Calendar className="w-3.5 h-3.5 shrink-0" />,
      dateStyle: 'event-date border-white/30',
      tag: lang === 'bn' ? 'তারিখ' : 'Date',
      text: MAHFIL.dateDisplay[lang],
      highlight: false,
      href: '#mahfil',
    },
    {
      icon: <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />,
      tag: lang === 'bn' ? 'সময়' : 'Time',
      text: MAHFIL.timeDisplay[lang],
      highlight: false,
      href: '#mahfil',
    },
    {
      icon: <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />,
      tag: lang === 'bn' ? 'স্থান' : 'Venue',
      text: `${MAHFIL.venue[lang]} (${SITE.location[lang]})`,
      highlight: false,
      href: SITE.mapUrl,
      external: true,
    },
    {
      icon: <Users className="w-3.5 h-3.5 text-sky-300 shrink-0" />,
      tag: lang === 'bn' ? 'প্রধান মেহমানবৃন্দ' : 'Key Scholars',
      text:
        lang === 'bn'
          ? 'শায়খ আব্দুল হক, পীর সাহেব উজানী আল্লামা আশেকে এলাহী ও প্রখ্যাত ওলামায়ে কেরাম'
          : 'Shaykh Abdul Haque, Pir Shaheb Ujani Allama Asheke Elahi & Scholars',
      highlight: true,
      href: '#speakers',
    },
    {
      icon: <Camera className="w-3.5 h-3.5 text-teal-300 shrink-0" />,
      tag: lang === 'bn' ? 'ফটো ফ্রেম' : 'Photo Frame',
      text:
        lang === 'bn'
          ? 'আপনার ছবি দিয়ে নিজস্ব মাহফিল ফ্রেম বানিয়ে সরাসরি শেয়ার করুন'
          : 'Generate personalized frame with your photo and share',
      highlight: true,
      href: '#frame',
    },
    {
      icon: <GraduationCap className="w-3.5 h-3.5 text-teal-300 shrink-0" />,
      tag: lang === 'bn' ? 'ভর্তি বিজ্ঞপ্তি ২০২৭' : 'Admission 2027',
      text:
        lang === 'bn'
          ? 'ইক্বরা মাদরাসায় প্লে থেকে ৫ম ও হিফজ বিভাগে ভর্তি চলছে'
          : 'Admissions open for Play to Grade 5 and Tahfiz',
      highlight: false,
      href: '#madrasah',
    },
    {
      icon: <PhoneCall className="w-3.5 h-3.5 text-sky-300 shrink-0" />,
      tag: lang === 'bn' ? 'যোগাযোগ' : 'Helpline',
      text: `${displayPhone(SITE.phones[0], lang)} | ${displayPhone(SITE.phones[1], lang)}`,
      highlight: false,
      href: phoneHref(SITE.phones[0]),
    },
  ];

  return (
    <div
      className="relative overflow-hidden py-2.5 border-y select-none transition-colors duration-500 shadow-sm"
      style={{
        backgroundColor: 'var(--ticker-bg)',
        color: 'var(--ticker-text)',
        borderColor: 'var(--border-subtle)',
      }}
      aria-label="Mahfil Announcements Ticker"
    >
      <div className="flex items-center">
        {/* Fixed Left Badge: Live News Pill */}
        <div
          className="relative z-10 shrink-0 flex items-center gap-1.5 sm:gap-2 pl-2.5 sm:pl-5 pr-3 sm:pr-4 py-1 border-r shadow-md"
          style={{
            backgroundColor: 'var(--ticker-bg)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full brand-live-dot opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 brand-live-dot"></span>
          </span>
          <span className="font-extrabold text-[11px] sm:text-xs tracking-wider uppercase text-white flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-sky-300 shrink-0" />
            <span>{lang === 'bn' ? 'ঘোষণা' : 'Notice'}</span>
          </span>
        </div>

        {/* Marquee Glide Track */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee flex items-center">
            {/* Set 1 */}
            <div className="flex items-center gap-5 pr-5 shrink-0">
              {items.map((item, idx) => (
                <a
                  key={`a-${idx}`}
                  href={item.href}
                  target={item.external ? '_blank' : '_self'}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-transform hover:scale-105 ${
                    item.dateStyle ?? (item.highlight
                      ? 'bg-white/10 text-white border-white/20 shadow-xs'
                      : 'bg-black/20 text-slate-200 border-white/10')
                  }`}
                >
                  {item.icon}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-current/25 uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <span>{item.text}</span>
                </a>
              ))}
            </div>

            {/* Set 2 for seamless continuous infinite loop */}
            <div className="flex items-center gap-5 pr-5 shrink-0" aria-hidden="true">
              {items.map((item, idx) => (
                <a
                  key={`b-${idx}`}
                  href={item.href}
                  tabIndex={-1}
                  target={item.external ? '_blank' : '_self'}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-transform hover:scale-105 ${
                    item.dateStyle ?? (item.highlight
                      ? 'bg-white/10 text-white border-white/20 shadow-xs'
                      : 'bg-black/20 text-slate-200 border-white/10')
                  }`}
                >
                  {item.icon}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-current/25 uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <span>{item.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
