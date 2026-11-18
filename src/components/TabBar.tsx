'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Camera, Users, Image as ImageIcon, Radio, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useFrameModal } from '@/context/FrameModalContext';

export function TabBar() {
  const { lang, t } = useLanguage();
  const { isFrameModalOpen, openFrameModal } = useFrameModal();
  const [activeTab, setActiveTab] = useState<string>('mahfil');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['sponsor', 'support', 'madrasah', 'live', 'frame', 'speakers', 'banner', 'mahfil'];
      const scrollY = window.scrollY + 200;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          setActiveTab(id);
          return;
        }
      }
      setActiveTab('mahfil');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When modal is open on mobile, hide the bottom TabBar so it feels 100% like a native app
  if (isFrameModalOpen) return null;

  const tabs = [
    { id: 'mahfil', label: t.nav.mahfil[lang], icon: BookOpen, href: '#mahfil' },
    { id: 'speakers', label: t.nav.speakers[lang], icon: Users, href: '#speakers' },
    { id: 'frame', label: t.nav.frame[lang], icon: Camera, href: '#frame', isCenter: true },
    { id: 'live', label: t.nav.live[lang], icon: Radio, href: '#live' },
    { id: 'sponsor', label: lang === 'bn' ? 'স্পনসর' : 'Sponsor', icon: Award, href: '#sponsor' },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-1 pointer-events-none"
      aria-label="Mobile Bottom Navigation"
    >
      <div
        className="max-w-md mx-auto nav-glass rounded-3xl p-1.5 pointer-events-auto flex items-center justify-around"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  openFrameModal();
                }}
                className="flex flex-col items-center justify-center py-1.5 px-3.5 rounded-2xl transition-all duration-300 relative shadow-md active:scale-95 text-white cursor-pointer"
                style={{
                  background: 'var(--primary-gradient)',
                  boxShadow: '0 4px 14px var(--accent-blue-glow)',
                }}
                aria-label={tab.label}
              >
                <Icon className="w-5 h-5" strokeWidth={1.8} />
                <span className="text-[11px] font-bold tracking-tight mt-0.5 whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <a
              key={tab.id}
              href={tab.href}
              className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 relative"
              style={{
                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
              }}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} strokeWidth={1.8} />
              <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[64px]">
                {tab.label}
              </span>
              {isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full mt-0.5"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                ></span>
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
