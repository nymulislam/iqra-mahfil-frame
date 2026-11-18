'use client';

import React from 'react';
import { Copy, Check, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { displayPhone } from '@/lib/phone';
import { usePhoneCopy } from '@/lib/usePhoneCopy';
import { SITE } from '@/content/site';

export function Support() {
  const { lang, t } = useLanguage();
  const { status, copyPhone } = usePhoneCopy();

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
                <span className="text-base font-bold text-sky-700">
                  {lang === 'bn' ? 'বিকাশ' : 'bKash'}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-700 border border-sky-300/40">
                  {SITE.donation.accountType[lang]}
                </span>
              </div>
              <p className="text-3xl font-black font-mono tracking-normal select-all mb-2" style={{ color: 'var(--text-main)' }}>
                {displayPhone(SITE.donation.bkash, lang)}
              </p>
              <p className="text-xs mb-6 font-medium" style={{ color: 'var(--text-muted)' }}>
                {SITE.donation.note[lang]}
              </p>
            </div>

            <button
              disabled={status?.state === 'pending'}
              onClick={() => copyPhone(SITE.donation.bkash, 'bkash')}
              className="w-full py-3 px-6 rounded-full font-bold text-xs sm:text-sm bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition flex items-center justify-center gap-2 active:scale-95 shadow-2xs"
            >
              {status?.key === 'bkash' && status.state === 'copied' ? (
                <>
                  <Check className="w-4 h-4 text-sky-600" />
                  <span className="text-sky-700">{t.support.copied[lang]}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{status?.state === 'pending' ? (lang === 'bn' ? 'কপি হচ্ছে…' : 'Copying…') : t.support.copyBtn[lang]}</span>
                </>
              )}
            </button>
          </div>

          {/* Nagad */}
          <div className="catalis-card p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-bold text-sky-700">
                  {lang === 'bn' ? 'নগদ' : 'Nagad'}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-700 border border-sky-300/40">
                  {SITE.donation.accountType[lang]}
                </span>
              </div>
              <p className="text-3xl font-black font-mono tracking-normal select-all mb-2" style={{ color: 'var(--text-main)' }}>
                {displayPhone(SITE.donation.nagad, lang)}
              </p>
              <p className="text-xs mb-6 font-medium" style={{ color: 'var(--text-muted)' }}>
                {SITE.donation.note[lang]}
              </p>
            </div>

            <button
              disabled={status?.state === 'pending'}
              onClick={() => copyPhone(SITE.donation.nagad, 'nagad')}
              className="w-full py-3 px-6 rounded-full font-bold text-xs sm:text-sm bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition flex items-center justify-center gap-2 active:scale-95 shadow-2xs cursor-pointer"
            >
              {status?.key === 'nagad' && status.state === 'copied' ? (
                <>
                  <Check className="w-4 h-4 text-sky-600" />
                  <span className="text-sky-700">{t.support.copied[lang]}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{status?.state === 'pending' ? (lang === 'bn' ? 'কপি হচ্ছে…' : 'Copying…') : t.support.copyBtn[lang]}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p role="status" className="text-sm text-center mb-4" style={{ color: 'var(--brand-blue-ink)' }}>
          {status?.state === 'copied' && t.support.copied[lang]}
          {status?.state === 'error' && (lang === 'bn'
            ? 'কপি করা যায়নি। উপরের নম্বরটি চেপে ধরে নির্বাচন করে কপি করুন।'
            : 'Copy failed. Select the number above and copy it manually.')}
        </p>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <ShieldCheck className="w-4 h-4 text-sky-600" />
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
