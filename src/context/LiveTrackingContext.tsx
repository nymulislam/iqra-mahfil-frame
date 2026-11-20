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

type CountryCount = { country: string; count: number };

interface LiveTrackingContextType {
  totalVisitors: number | null;
  countries: CountryCount[];
  livePaused: boolean;
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
  const [totals, setTotals] = useState<{totalVisitors: number; countries: CountryCount[]; onlineVisitors: number; totalFrames: number; pledgedAttendees: number} | null>(null);
  const [livePaused, setLivePaused] = useState(false);
  const [hasPledged, setHasPledged] = useState(false);
  const pledgeRef = useRef(false);
  const pendingFrames = useRef(new Set<string>());
  const refresh = useRef(() => {});
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

  useEffect(() => {
    const prefix = 'iqra_pending_frame:';
    let disposed = false;
    let running = false;
    let again = false;
    let ready = false;
    const post = (route: string, body: unknown) => fetch('/api/live/' + route, {
      method: 'POST', credentials: 'same-origin', cache: 'no-store',
      headers: {'Content-Type':'application/json'}, body: JSON.stringify(body),
      signal: AbortSignal.timeout(12000),
    });
    try {
      pledgeRef.current = localStorage.getItem('iqra_has_pledged') === 'true';
      setHasPledged(pledgeRef.current);
      const saved = localStorage.getItem('iqra_user_distance');
      if (saved && Number.isFinite(Number(saved)) && Number(saved) >= 0) setUserDistance(Number(saved));
    } catch { /* Storage is optional. */ }

    const sync = async () => {
      if (disposed || document.hidden) return;
      if (running) { again = true; return; }
      running = true;
      try {
        const work = async () => {
          if (disposed || document.hidden) return;
          if (!ready) {
            const session = await post('session', {});
            if (!session.ok) throw new Error('Session unavailable');
            ready = true;
          }
          try {
            for (const key of Object.keys(localStorage)) {
              if (key.startsWith(prefix)) pendingFrames.current.add(key.slice(prefix.length));
            }
            if (localStorage.getItem('iqra_has_pledged') === 'true') pledgeRef.current = true;
          } catch { /* In-memory events can still sync. */ }
          const frames = Array.from(pendingFrames.current).slice(0,50);
          const response = await post('sync', {frames, pledge: pledgeRef.current});
          if (response.status === 401) ready = false;
          if (!response.ok) throw new Error('Counters unavailable');
          const data = await response.json();
          if (![data.onlineVisitors,data.totalFrames,data.pledgedAttendees].every(n => Number.isSafeInteger(n) && n >= 0)) throw new Error('Invalid totals');
          for (const id of frames) {
            pendingFrames.current.delete(id);
            try { localStorage.removeItem(prefix + id); } catch { /* Retry is idempotent. */ }
          }
          if (disposed) return;
          setTotals(data);
          setLivePaused(false);
          if (data.hasPledged) { pledgeRef.current = true; setHasPledged(true); }
          if (pendingFrames.current.size) again = true;
        };
        if (navigator.locks) await navigator.locks.request('iqra-live-session', work);
        else await work();
      } catch { if (!disposed) setLivePaused(true); }
      finally {
        running = false;
        if (again && !disposed) { again = false; void sync(); }
      }
    };
    const offline = () => setLivePaused(true);
    refresh.current = sync;
    void sync();
    const timer = window.setInterval(sync, 30000);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('online', sync);
    window.addEventListener('offline', offline);
    return () => {
      disposed = true;
      refresh.current = () => {};
      clearInterval(timer);
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', offline);
    };
  }, []);

  const recordPledge = useCallback(() => {
    pledgeRef.current = true;
    setHasPledged(true);
    try { localStorage.setItem('iqra_has_pledged','true'); } catch { /* Storage is optional. */ }
    refresh.current();
    setLatestToast({id:String(Date.now()),name:'',location:'',action:'pledge',time:Date.now()});
  }, []);

  const recordFrameCreated = useCallback(() => {
    const id = crypto.randomUUID();
    pendingFrames.current.add(id);
    try { localStorage.setItem('iqra_pending_frame:' + id,'1'); } catch { /* Keep it in memory. */ }
    refresh.current();
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
        livePaused,
        totalVisitors: totals?.totalVisitors ?? null,
        countries: totals?.countries ?? [],
        onlineVisitors: totals?.onlineVisitors ?? null,
        totalFrames: totals?.totalFrames ?? null,
        pledgedAttendees: totals?.pledgedAttendees ?? null,
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
