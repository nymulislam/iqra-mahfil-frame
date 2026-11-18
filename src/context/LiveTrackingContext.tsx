'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { calculateDistanceKm } from '@/lib/geo';
import { useLanguage } from './LanguageContext';

export interface ActivityEvent {
  id: string;
  name: string;
  location: string;
  action: 'frame' | 'pledge' | 'calendar' | 'visit';
  time: number; // timestamp
}

interface LiveTrackingContextType {
  onlineVisitors: number | null;
  totalFrames: number | null;
  pledgedAttendees: number | null;
  hasPledged: boolean;
  userDistance: number | null;
  isLocating: boolean;
  locationError: string | null;
  latestToast: ActivityEvent | null;
  recordPledge: (name?: string) => void;
  recordFrameCreated: () => void;
  trackUserDistance: () => void;
  dismissToast: () => void;
}

const LiveTrackingContext = createContext<LiveTrackingContextType | undefined>(undefined);

export const LiveTrackingProvider = ({ children }: { children: ReactNode }) => {
  const { lang } = useLanguage();
  const onlineVisitors = null;
  const [totalFrames, setTotalFrames] = useState<number | null>(null);
  const pledgeRef = useRef(false);
  const framesRef = useRef(0);
  const [hasPledged, setHasPledged] = useState<boolean>(false);
  const pledgedAttendees = totalFrames === null ? null : hasPledged ? 1 : 0;

  const [userDistance, setUserDistance] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationErrorCode, setLocationErrorCode] = useState<'unsupported' | 'denied' | 'timeout' | 'unavailable' | null>(null);
  const locationMessages = {
    unsupported: { bn: 'আপনার ব্রাউজার লোকেশন সমর্থন করে না।', en: 'Your browser does not support location.' },
    denied: { bn: 'অনুগ্রহ করে ব্রাউজারে লোকেশন পারমিশন দিন।', en: 'Allow location access in your browser.' },
    timeout: { bn: 'লোকেশন পেতে সময় শেষ হয়েছে। আবার চেষ্টা করুন।', en: 'Location request timed out. Please try again.' },
    unavailable: { bn: 'দূরত্ব পরিমাপ করা সম্ভব হয়নি। আবার চেষ্টা করুন।', en: 'Location is unavailable. Please try again.' },
  };
  const locationError = locationErrorCode ? locationMessages[locationErrorCode][lang] : null;

  const [latestToast, setLatestToast] = useState<ActivityEvent | null>(null);

  // Initialize and check saved status
  useEffect(() => {
    try {
      const pledged = localStorage.getItem('iqra_has_pledged') === 'true';
      pledgeRef.current = pledged;
      setHasPledged(pledged);

      const savedFrames = Number(localStorage.getItem('iqra_local_frames_count') || '0');
      framesRef.current = Number.isSafeInteger(savedFrames) && savedFrames >= 0 ? savedFrames : 0;

      const savedDistance = localStorage.getItem('iqra_user_distance');
      const distance = Number(savedDistance);
      if (savedDistance && Number.isFinite(distance) && distance >= 0) setUserDistance(distance);
    } catch {
      // Browser storage is optional.
    } finally {
      setTotalFrames(framesRef.current);
    }
    const syncStorage = (event: StorageEvent) => {
      if (event.key === 'iqra_has_pledged') {
        pledgeRef.current = event.newValue === 'true';
        setHasPledged(pledgeRef.current);
      }
      if (event.key === 'iqra_local_frames_count') {
        const count = Number(event.newValue || '0');
        if (Number.isSafeInteger(count) && count >= 0) { framesRef.current = count; setTotalFrames(count); }
      }
    };
    window.addEventListener('storage', syncStorage);
    return () => window.removeEventListener('storage', syncStorage);
  }, []);

  const recordPledge = useCallback(() => {
    if (pledgeRef.current) return;
    pledgeRef.current = true;
    setHasPledged(true);
    try { localStorage.setItem('iqra_has_pledged', 'true'); } catch { /* Storage may be unavailable. */ }
    setLatestToast({ id: String(Date.now()), name: '', location: '', action: 'pledge', time: Date.now() });
  }, []);

  const recordFrameCreated = useCallback(() => {
    const increment = () => {
      let current = framesRef.current;
      try {
        const saved = Number(localStorage.getItem('iqra_local_frames_count'));
        if (Number.isSafeInteger(saved) && saved >= 0) current = Math.max(current, saved);
      } catch { /* Browser storage is optional. */ }
      const next = Math.min(Number.MAX_SAFE_INTEGER, current + 1);
      framesRef.current = next;
      setTotalFrames(next);
      try { localStorage.setItem('iqra_local_frames_count', String(next)); } catch { /* Browser storage is optional. */ }
    };
    if (navigator.locks) void navigator.locks.request('iqra_local_frames_count', increment).catch(increment);
    else increment();
  }, []);

  const trackUserDistance = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationErrorCode('unsupported');
      return;
    }

    setUserDistance(null);
    setIsLocating(true);
    setLocationErrorCode(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const dist = calculateDistanceKm(latitude, longitude);
        setUserDistance(dist);
        setIsLocating(false);
        try {
          localStorage.setItem('iqra_user_distance', String(dist));
        } catch {
          // ignore
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationErrorCode('denied');
        } else if (err.code === err.TIMEOUT) {
          setLocationErrorCode('timeout');
        } else {
          setLocationErrorCode('unavailable');
        }
      },
      { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
    );
  }, []);

  const dismissToast = useCallback(() => {
    setLatestToast(null);
  }, []);

  return (
    <LiveTrackingContext.Provider
      value={{
        onlineVisitors,
        totalFrames,
        pledgedAttendees,
        hasPledged,
        userDistance,
        isLocating,
        locationError,
        latestToast,
        recordPledge,
        recordFrameCreated,
        trackUserDistance,
        dismissToast,
      }}
    >
      {children}
    </LiveTrackingContext.Provider>
  );
};

export const useLiveTracking = (): LiveTrackingContextType => {
  const context = useContext(LiveTrackingContext);
  if (!context) {
    throw new Error('useLiveTracking must be used within a LiveTrackingProvider');
  }
  return context;
};
