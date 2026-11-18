'use client';

import React, { useState } from 'react';
import { Heart, Copy, Check, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { SITE } from '@/content/site';

export function Support() {
  const { lang, t } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <section
      id="support"
      className="py-20 md:py-28 relative overflow-hidden border-t transition-colors duration-500"
      style={{
        backgroundColor: 'var(--bg-page)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2
            className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] mb-4"
            style={{ color: 'var(--text-main)' }}
          >
            {t.support.sectionTitle[lang]}
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            {t.support.sectionDesc[lang]}
          </p>
        </div>

        {/* Donation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto">
          {/* bKash */}
          <div className="catalis-card p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-bold text-pink-700">
                  {t.support.bkashLabel[lang]}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-700 border border-pink-300/40">
                  {SITE.donation.accountType[lang]}
                </span>
              </div>
              <p className="text-3xl font-black font-mono tracking-wider mb-2" style={{ color: 'var(--text-main)' }}>
                {SITE.donation.bkash}
              </p>
              <p className="text-xs mb-6 font-medium" style={{ color: 'var(--text-muted)' }}>
                {SITE.donation.note[lang]}
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(SITE.donation.bkash, 'bkash')}
              className="w-full py-3 px-6 rounded-full font-bold text-xs sm:text-sm bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 transition flex items-center justify-center gap-2 active:scale-95 shadow-2xs"
            >
              {copiedKey === 'bkash' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">{t.support.copied[lang]}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.support.copyBtn[lang]}</span>
                </>
              )}
            </button>
          </div>

          {/* Nagad */}
          <div className="catalis-card p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-bold text-rose-700">
                  {t.support.nagadLabel[lang]}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-700 border border-rose-300/40">
                  {SITE.donation.accountType[lang]}
                </span>
              </div>
              <p className="text-3xl font-black font-mono tracking-wider mb-2" style={{ color: 'var(--text-main)' }}>
                {SITE.donation.nagad}
              </p>
              <p className="text-xs mb-6 font-medium" style={{ color: 'var(--text-muted)' }}>
                {SITE.donation.note[lang]}
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(SITE.donation.nagad, 'nagad')}
              className="w-full py-3 px-6 rounded-full font-bold text-xs sm:text-sm bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition flex items-center justify-center gap-2 active:scale-95 shadow-2xs cursor-pointer"
            >
              {copiedKey === 'nagad' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">{t.support.copied[lang]}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.support.copyBtn[lang]}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            {lang === 'bn'
              ? 'সকল অনুদান সরাসরি মাদরাসা ও মাহফিলের দায়িত্বশীলদের অ্যাকাউন্টে গৃহীত হয়।'
              : 'All donations are directly received by the madrasah authorities.'}
          </span>
        </div>
      </div>
    </section>
  );
}
