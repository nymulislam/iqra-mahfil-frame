'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Crown,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  CalendarPlus,
  Award,
  PhoneCall,
  Mic,
  Bell,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { MAHFIL } from '@/content/mahfil';
import { mahfilCalendarUrl } from '@/lib/calendar';
import { displayPhone, phoneHref } from '@/lib/phone';
import { SITE } from '@/content/site';

const ICON_MAP: Record<string, React.ElementType> = {
  Crown,
  BookOpen,
  Clock,
  Mic,
  Award,
};

export function MahfilDetails({ onOpenBanner }: { onOpenBanner?: () => void }) {
  const { lang, t } = useLanguage();

  const googleCalUrl = mahfilCalendarUrl(lang);

  return (
    <section
      id="mahfil"
      className="py-16 md:py-24 relative overflow-hidden border-b transition-colors duration-500"
      style={{
        backgroundColor: 'var(--bg-page)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Light Mesh Glows (Sky Cyan & Royal Blue - Zero Yellow) */}
      <div
        className="absolute top-1/4 right-0 w-96 h-96 blur-[130px] rounded-full pointer-events-none -z-10 opacity-20"
        style={{ backgroundColor: 'var(--accent-secondary)' }}
      />
      <div
        className="absolute bottom-10 left-0 w-80 h-80 blur-[130px] rounded-full pointer-events-none -z-10 opacity-15"
        style={{ backgroundColor: 'var(--accent-primary)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2
            className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.25] sm:leading-[1.2] mb-3 overflow-visible"
            style={{ color: 'var(--text-main)' }}
          >
            {lang === 'bn' ? (
              <>
                কুরআনের নূর ও দ্বীনি হেদায়াত,{' '}
                <span className="text-sky-700 font-bold block sm:inline-block pr-4">মাহফিল বিস্তারিত</span>
              </>
            ) : (
              <>
                Light of Quran & Guidance,{' '}
                <span className="text-sky-700 font-bold block sm:inline-block pr-4">Event Details</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {t.mahfil.sectionDesc[lang]}
          </p>
        </div>

        {/* --- Bento Grid Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {/* Bento Card 1 (Span 7 cols): Date, Time, Venue & Quick Map */}
          <div className="lg:col-span-7 bg-[var(--brand-blue-ink)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <span className="catalis-pill text-xs font-bold text-sky-800">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  {t.mahfil.dateLabel[lang]}
                </span>
                <span className="text-xs font-semibold flex items-center gap-1.5 text-white">
                  <Clock className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                  {MAHFIL.timeDisplay[lang]}
                </span>
              </div>

              <h3 className="event-date border border-white/25 font-serif text-xl sm:text-3xl font-extrabold mb-4">
                {MAHFIL.dateDisplay[lang]}
              </h3>

              <div
                className="p-4 sm:p-5 rounded-2xl border mb-6"
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[var(--brand-blue-ink)] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-base sm:text-lg mb-1" style={{ color: 'var(--text-main)' }}>
                      {MAHFIL.venue[lang]}
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {SITE.locationDetails[lang]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <a
                href={SITE.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold primary-action shadow-sm active:scale-95 transition-all"
              >
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>{t.mahfil.getDirections[lang]}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>

              <a
                href={googleCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold border shadow-2xs hover:border-sky-400 active:scale-95 transition-all"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <CalendarPlus className="w-4 h-4 text-sky-600" />
                <span>{t.mahfil.addToCalendar[lang]}</span>
              </a>
            </div>
          </div>

          {/* Bento Card 2 (Span 5 cols): Supervision & Leadership */}
          <div className="lg:col-span-5 catalis-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="catalis-pill text-xs text-sky-800 font-bold">
                  <Award className="w-3.5 h-3.5 text-sky-600" />
                  {lang === 'bn' ? 'সার্বিক তত্ত্বাবধান ও আয়োজন' : 'Supervision & Organization'}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-800 border border-sky-300/40">
                  {SITE.shortName[lang]}
                </span>
              </div>

              {/* Presidency & Chief Mentor Spotlight */}
              <div
                className="p-4 rounded-2xl border mb-4"
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <span className="text-xs font-bold uppercase tracking-wider block mb-1 text-sky-700">
                  {lang === 'bn' ? 'সভাপতিত্ব ও মাশকুল কুরআন' : 'President & Chief Mentor'}
                </span>
                <h4 className="font-serif text-lg sm:text-xl font-bold leading-snug" style={{ color: 'var(--text-main)' }}>
                  {MAHFIL.patron[lang]}
                </h4>
                <p className="text-xs sm:text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {MAHFIL.patronTitle[lang]}
                </p>
              </div>

              {/* Governing Council & Management */}
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider block mb-2 text-sky-800">
                  {lang === 'bn' ? 'পরিচালনা পরিষদ ও ব্যবস্থাপনা' : 'Governing Council & Management'}
                </span>
                <div className="space-y-1.5 text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--text-main)' }}>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                    <span>
                      {lang === 'bn' ? 'ক্বারী সিদ্দিকুর রহমান' : 'Qari Siddiqur Rahman'}{' '}
                      <span className="font-normal text-slate-500 text-xs">
                        ({lang === 'bn' ? 'সভাপতি' : 'President'})
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                    <span>
                      {lang === 'bn' ? 'মুফতী আবু তাহের সিদ্দিকী' : 'Mufti Abu Taher Siddiqui'}{' '}
                      <span className="font-normal text-slate-500 text-xs">
                        ({lang === 'bn' ? 'প্রতিষ্ঠাতা মুহতামীম' : 'Founder Principal'})
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    <span>
                      {lang === 'bn' ? 'হাফেজ মাওলানা আলাউদ্দীন' : 'Hafiz Maulana Alauddin'}{' '}
                      <span className="font-normal text-slate-500 text-xs">
                        ({lang === 'bn' ? 'ভাইস প্রিন্সিপাল' : 'Vice Principal'})
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Invitation Note & Helpline Phone */}
            <div
              className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {MAHFIL.slogan[lang]}
              </p>
              <a
                href={phoneHref(MAHFIL.helplinePhone)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-sky-500/10 hover:bg-sky-600 text-sky-800 hover:text-white border border-sky-300 transition shrink-0 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{displayPhone(MAHFIL.helplinePhone, lang)}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Feature Highlights Grid (Clean, High-Readability Editorial Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-14">
          {MAHFIL.highlights.map((item, idx) => {
            const IconComp = ICON_MAP[item.icon] || Award;
            const partLabels = [
              { bn: '১ম পর্ব', en: 'Session 1' },
              { bn: '২য় পর্ব', en: 'Session 2' },
              { bn: '৩য় পর্ব', en: 'Session 3' },
              { bn: 'মূল পর্ব', en: 'Session 4' },
            ];
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                className="catalis-card p-5 sm:p-6 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden bg-white shadow-md hover:shadow-xl hover:border-sky-300"
              >
                {/* Subtle top specular accent border */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-sky-500 to-blue-600 opacity-80 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Header: Icon + Timing & Session Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div
                      className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-sky-300 transition-all shadow-xs bg-sky-50 border-sky-100"
                    >
                      <IconComp className="w-5 h-5 text-sky-600 transition-colors" />
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                          {partLabels[idx] ? partLabels[idx][lang] : ''}
                        </span>
                        <span className="catalis-pill text-[10px] font-bold text-sky-800 px-2 py-0.5">
                          {item.badge[lang]}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 mt-1 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-sky-600" />
                        {item.time[lang]}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4
                    className="font-serif text-base sm:text-lg font-bold mb-2.5 leading-snug group-hover:text-sky-700 transition-colors text-slate-900"
                  >
                    {item.title[lang]}
                  </h4>

                  {/* Speaker Line - High-Readability Capsule */}
                  <div className="mb-2.5 p-2 rounded-xl bg-sky-50/80 border border-sky-100 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                    <span className="text-xs font-bold leading-snug text-sky-950">
                      {item.speaker[lang]}
                    </span>
                  </div>

                  {/* Focus / Description - Punchy & Legible */}
                  <p className="text-xs leading-relaxed font-normal text-slate-600">
                    {item.desc[lang]}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Next year's notice is secondary to the current event. */}
        <div className="rounded-3xl border border-[var(--border-card)] bg-[var(--surface-sky)] text-[var(--brand-blue-ink)] p-5 sm:p-6">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-[var(--brand-blue-ink)] border border-[var(--border-subtle)]">
                <Bell className="w-3.5 h-3.5" />
                <span>
                  {lang === 'bn' ? 'অফিসিয়াল ঘোষণা • পরবর্তী মাহফিল ২০২৭' : 'Official Notice • Next Year Mahfil 2027'}
                </span>
              </div>
              <h4 className="font-serif text-base sm:text-lg font-bold">
                {lang === 'bn' ? 'ইনশাআল্লাহ আগামী বছর বার্ষিক মাহফিল' : "InshaAllah Next Year's Grand Mahfil"}
              </h4>
              <p className="font-serif text-lg sm:text-xl font-bold">
                {MAHFIL.nextYearMahfil[lang]}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 font-medium pt-1">
                {MAHFIL.slogan[lang]}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href={phoneHref(MAHFIL.helplinePhone)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-white text-[var(--brand-primary)] hover:bg-[var(--surface-sky)] active:scale-95 transition-all border border-sky-400/30 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{lang === 'bn' ? `হেল্পলাইন: ${displayPhone(MAHFIL.helplinePhone, lang)}` : `Helpline: ${displayPhone(MAHFIL.helplinePhone, lang)}`}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
