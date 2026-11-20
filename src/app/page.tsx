'use client';

import React, { useState } from 'react';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Ticker } from '@/components/Ticker';
import { FrameStudio } from '@/components/studio/FrameStudio';
import { MahfilDetails } from '@/components/MahfilDetails';
import { BannerPreview } from '@/components/BannerPreview';
import { LiveTracking } from '@/components/LiveTracking';
import { ActivityToast } from '@/components/ActivityToast';
import { Speakers } from '@/components/Speakers';
import { Madrasah } from '@/components/Madrasah';
import { Support } from '@/components/Support';
import { Sponsor } from '@/components/Sponsor';
import { Footer } from '@/components/Footer';
import { TabBar } from '@/components/TabBar';
import { CalendarModal } from '@/components/CalendarModal';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';

export default function HomePage() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'calendar' | 'brochure' | 'banner' | 'sponsor';
  }>({
    isOpen: false,
    type: 'calendar',
  });

  const openCalendar = () => {
    setModalState({ isOpen: true, type: 'calendar' });
  };

  const openBrochure = () => {
    setModalState({ isOpen: true, type: 'brochure' });
  };

  const openBanner = () => {
    setModalState({ isOpen: true, type: 'banner' });
  };

  const openSponsorCard = () => {
    setModalState({ isOpen: true, type: 'sponsor' });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-500"
      style={{
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-main)',
      }}
    >
      {/* Top Scroll Reading Progress Bar */}
      <ScrollProgressBar />

      {/* Top Sticky Fluid Glass Navbar */}
      <Nav />

      {/* Main Content Sections with Streamlined Storytelling */}
      <main className="flex-1">
        {/* 1. Grand Hero Header with Real-time Countdown & Spec Ribbon */}
        <Hero onOpenCalendar={openCalendar} onOpenBanner={openBanner} />

        {/* Seamless Scrolling Ticker Strip */}
        <Ticker />

        {/* 2. Highlighted Mahfil Overview Bento (Date, Venue & Supervision) */}
        <MahfilDetails onOpenBanner={openBanner} onOpenCalendar={openCalendar} />

        {/* 3. Official Mahfil Banner & Poster Dual-Pane Showcase */}
        <BannerPreview onOpenLightbox={openBanner} />

        {/* 4. Invited Keynote Scholars & Organizers */}
        <Speakers />

        {/* 5. Viral Keepsake Frame Studio */}
        <FrameStudio />

        {/* 6. Ultra-Premium Live Community Pulse & GPS Distance Radar */}
        <LiveTracking />

        {/* 7. Madrasah Departments & Admissions 2027 */}
        <Madrasah onOpenBrochure={openBrochure} onOpenCalendar={openCalendar} />

        {/* 8. Sadaqah Jariyah & Support */}
        <Support />

        {/* 9. Official Travel Partner & Sponsor: Ar-Rahman Travels (Hajj & Umrah) */}
        <Sponsor onOpenCard={openSponsorCard} />
      </main>

      {/* Minimal & Ultra-Modern Footer */}
      <ScrollReveal y={14}>
        <Footer />
      </ScrollReveal>

      {/* Mobile Floating Bottom TabBar */}
      <TabBar />

      {/* Floating Real-Time Activity Toast */}
      <ActivityToast />

      {/* Fullscreen Lightbox Modal for Calendar, Brochure, Banner & Sponsor Card */}
      <CalendarModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
      />
    </div>
  );
}
