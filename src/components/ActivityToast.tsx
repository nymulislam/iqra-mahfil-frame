'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Camera, Calendar, UserCheck } from 'lucide-react';
import { useLiveTracking } from '@/context/LiveTrackingContext';
import { useLanguage } from '@/context/LanguageContext';

export function ActivityToast() {
  const { latestToast, dismissToast } = useLiveTracking();
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!latestToast) return;

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      dismissToast();
    }, 4500);

    return () => clearTimeout(timer);
  }, [latestToast, dismissToast]);

  if (!latestToast) return null;

  const getActionText = (action: string) => {
    if (action === 'frame') {
      return lang === 'bn' ? 'ফটো ফ্রেম তৈরি করেছেন' : 'created a photo frame';
    }
    if (action === 'pledge') {
      return lang === 'bn' ? 'এই ব্রাউজারে' : 'In this browser';
    }
    if (action === 'calendar') {
      return lang === 'bn' ? 'ক্যালেন্ডার সংগ্রহ করেছেন' : 'downloaded calendar';
    }
    return lang === 'bn' ? 'পোর্টালে যুক্ত হয়েছেন' : 'joined the portal';
  };

  const getIcon = (action: string) => {
    if (action === 'frame') return Camera;
    if (action === 'pledge') return CheckCircle;
    if (action === 'calendar') return Calendar;
    return UserCheck;
  };

  const IconComp = getIcon(latestToast.action);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-20 md:bottom-6 left-4 z-40 max-w-sm bg-white/95 backdrop-blur-xl border border-teal-300 rounded-2xl p-3 shadow-2xl flex items-center gap-3 text-xs text-slate-900 ring-1 ring-slate-900/5"
        >
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-sky-700 flex items-center justify-center shrink-0 border border-teal-200">
            <IconComp className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 truncate">
              <span>{lang === 'bn' ? 'আপনার পছন্দ সংরক্ষিত হয়েছে' : 'Your preference was saved'}</span>

            </div>
            <p className="text-[11px] text-sky-700 font-medium truncate">
              {getActionText(latestToast.action)}
            </p>
          </div>

          <button
            onClick={() => {
              setVisible(false);
              dismissToast();
            }}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition shrink-0"
            aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Dismiss'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
