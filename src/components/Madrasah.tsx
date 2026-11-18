'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Crown,
  GraduationCap,
  Mic,
  Users,
  Laptop,
  Building2,
  Video,
  Zap,
  Apple,
  PhoneCall,
  FileText,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { MADRASAH_INFO } from '@/content/madrasah';
import { SITE } from '@/content/site';

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  Crown,
  GraduationCap,
  Mic,
  Users,
  Laptop,
  Building2,
  Video,
  Zap,
  Apple,
};

export function Madrasah({
  onOpenCalendar,
  onOpenBrochure,
}: {
  onOpenCalendar: () => void;
  onOpenBrochure: () => void;
}) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'departments' | 'facilities'>('departments');

  return (
    <section
      id="madrasah"
      className="py-12 sm:py-16 md:py-20 relative overflow-hidden border-b transition-colors duration-500"
      style={{
        backgroundColor: 'var(--bg-page)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <h2
            className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug mb-2"
            style={{ color: 'var(--text-main)' }}
          >
            {t.madrasah.sectionTitle[lang]}
          </h2>

          <p className="text-xs sm:text-sm font-semibold text-sky-700 mb-1">
            {MADRASAH_INFO.slogan[lang]}
          </p>

          <p className="text-xs sm:text-sm max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            {t.madrasah.sectionDesc[lang]}
          </p>
        </div>

        {/* Admission 2027 Banner Bento Card */}
        <div
          className="catalis-card p-5 sm:p-7 mb-10 border shadow-lg backdrop-blur-sm"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-card)',
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-2xl p-1.5 shadow-sm border shrink-0 hidden sm:flex items-center justify-center bg-white"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={SITE.logo}
                  alt={SITE.name[lang]}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/15 text-sky-800 border border-sky-300/40 mb-1.5">
                  {t.madrasah.admissionBadge[lang]}
                </span>
                <h3 className="text-lg sm:text-2xl font-bold mb-1.5" style={{ color: 'var(--text-main)' }}>
                  {lang === 'bn'
                    ? 'প্লে থেকে ৫ম শ্রেণি ও আন্তর্জাতিক হিফজুল কুরআনে ভর্তি'
                    : 'Admissions Open from Play to Grade 5 & International Tahfiz'}
                </h3>
                <p className="text-xs sm:text-sm max-w-xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {lang === 'bn'
                    ? 'সন্তানের ভবিষ্যৎকে সুন্নাহসম্মত চরিত্র ও আধুনিক শিক্ষায় আলোকিত করতে ইক্বরা ইন্টারন্যাশনাল মাদরাসায় যোগাযোগ করুন।'
                    : 'Secure your child’s holistic future with sound Islamic moral values and modern academic foundations.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0 w-full sm:w-auto">
              <a
                href={`tel:${SITE.phones[0]}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold text-xs sm:text-sm bg-slate-900 hover:bg-black text-white shadow-xs active:scale-95 transition-all flex-1 sm:flex-none text-center"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono">{SITE.phones[0]}</span>
              </a>

              <button
                onClick={onOpenBrochure}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full font-semibold text-xs sm:text-sm border shadow-2xs hover:bg-slate-100/60 active:scale-95 transition-all flex-1 sm:flex-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  color: 'var(--text-main)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                <span>{t.madrasah.brochureBtn[lang]}</span>
              </button>

              <button
                onClick={onOpenCalendar}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full font-semibold text-xs sm:text-sm border shadow-2xs hover:bg-slate-100/60 active:scale-95 transition-all flex-1 sm:flex-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  color: 'var(--text-main)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>{t.hero.ctaCalendar[lang]}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Space-Saving Interactive Segmented Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div
            className="inline-flex p-1.5 rounded-full border shadow-2xs"
            style={{
              backgroundColor: 'var(--bg-surface-subtle)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setActiveTab('departments')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'departments'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'hover:opacity-100 opacity-70'
              }`}
              style={{
                color: activeTab === 'departments' ? '#ffffff' : 'var(--text-main)',
                backgroundColor: activeTab === 'departments' ? 'var(--accent-primary)' : 'transparent',
              }}
            >
              <BookOpen className="w-4 h-4 text-sky-300" />
              <span>{lang === 'bn' ? 'শিক্ষাক্রম ও বিভাগসমূহ' : 'Academic Departments'}</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full ml-1 font-mono">
                {MADRASAH_INFO.departments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('facilities')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'facilities'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'hover:opacity-100 opacity-70'
              }`}
              style={{
                color: activeTab === 'facilities' ? '#ffffff' : 'var(--text-main)',
                backgroundColor: activeTab === 'facilities' ? 'var(--accent-primary)' : 'transparent',
              }}
            >
              <Building2 className="w-4 h-4 text-cyan-300" />
              <span>{lang === 'bn' ? 'ক্যাম্পাস সুযোগ-সুবিধা' : 'Campus Facilities'}</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full ml-1 font-mono">
                {MADRASAH_INFO.facilities.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          {activeTab === 'departments' ? (
            <motion.div
              key="departments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {MADRASAH_INFO.departments.map((dept) => {
                const IconComp = ICON_MAP[dept.icon] || BookOpen;
                return (
                  <div
                    key={dept.id}
                    className="catalis-card p-5 sm:p-6 flex flex-col justify-between group shadow-xs hover:shadow-md transition-all"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-card)',
                    }}
                  >
                    <div>
                      <div
                        className="w-11 h-11 rounded-2xl border flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: 'var(--bg-surface-subtle)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--accent-primary)',
                        }}
                      >
                        <IconComp className="w-5 h-5 text-sky-600" />
                      </div>
                      <h4 className="font-serif text-base sm:text-lg font-bold mb-1.5" style={{ color: 'var(--text-main)' }}>
                        {dept.name[lang]}
                      </h4>
                      <p className="text-xs leading-relaxed mb-3.5" style={{ color: 'var(--text-muted)' }}>
                        {dept.subtitle[lang]}
                      </p>
                    </div>

                    <ul className="space-y-1.5 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                      {dept.features[lang].map((f, i) => (
                        <li key={i} className="text-xs flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="facilities"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {MADRASAH_INFO.facilities.map((fac, idx) => {
                const IconComp = ICON_MAP[fac.icon] || Building2;
                return (
                  <div
                    key={idx}
                    className="catalis-card p-4 sm:p-5 shadow-xs hover:shadow-md transition-all"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-card)',
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl border flex items-center justify-center mb-2.5"
                      style={{
                        backgroundColor: 'var(--bg-surface-subtle)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      <IconComp className="w-4 h-4 text-sky-600" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold mb-1" style={{ color: 'var(--text-main)' }}>
                      {fac.title[lang]}
                    </h4>
                    <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {fac.desc[lang]}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
