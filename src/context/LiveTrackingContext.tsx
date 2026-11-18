'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { calculateDistanceKm, MAHFIL_COORDS } from '@/lib/geo';

export interface ActivityEvent {
  id: string;
  name: string;
  location: string;
  action: 'frame' | 'pledge' | 'calendar' | 'visit';
  time: number; // timestamp
}

interface LiveTrackingContextType {
  onlineVisitors: number;
  totalFrames: number;
  pledgedAttendees: number;
  hasPledged: boolean;
  userDistance: number | null;
  isLocating: boolean;
  locationError: string | null;
  activityFeed: ActivityEvent[];
  latestToast: ActivityEvent | null;
  recordPledge: (name?: string) => void;
  recordFrameCreated: () => void;
  trackUserDistance: () => void;
  dismissToast: () => void;
}

const LiveTrackingContext = createContext<LiveTrackingContextType | undefined>(undefined);

const SEED_FEED: ActivityEvent[] = [
  { id: '1', name: 'হাফেজ মোঃ রায়হান', location: 'চাঁদপুর', action: 'frame', time: Date.now() - 40000 },
  { id: '2', name: 'তানভীর আহমেদ', location: 'ঢাকা', action: 'pledge', time: Date.now() - 95000 },
  { id: '3', name: 'প্রবাসী ভাই', location: 'রিয়াদ, কেএসএ', action: 'frame', time: Date.now() - 160000 },
  { id: '4', name: 'মাওলানা সাইফুল ইসলাম', location: 'কুমিল্লা', action: 'calendar', time: Date.now() - 240000 },
  { id: '5', name: 'মোঃ মাহদী হাসান', location: 'ফরিদগঞ্জ', action: 'pledge', time: Date.now() - 320000 },
  { id: '6', name: 'আব্দুর রহমান', location: 'চট্টগ্রাম', action: 'visit', time: Date.now() - 410000 },
  { id: '7', name: 'ইমরান হোসাইন', location: 'দুবাই, ইউএই', action: 'frame', time: Date.now() - 500000 },
];

const SIMULATED_ACTIONS: Array<Omit<ActivityEvent, 'id' | 'time'>> = [
  { name: 'শুভাকাঙ্ক্ষী ভাই', location: 'ফরিদগঞ্জ, চাঁদপুর', action: 'frame' },
  { name: 'কুরআনপ্রেমী ভাই', location: 'মতিঝিল, ঢাকা', action: 'pledge' },
  { name: 'প্রবাসী দ্বীনি ভাই', location: 'জেদ্দা, কেএসএ', action: 'frame' },
  { name: 'হাফেজ তানযীম', location: 'হাজীগঞ্জ, চাঁদপুর', action: 'pledge' },
  { name: 'নূরুল ইসলাম', location: 'আগ্রাবাদ, চট্টগ্রাম', action: 'calendar' },
  { name: 'মুশফিকুর রহমান', location: 'লন্ডন, ইউকে', action: 'frame' },
  { name: 'আহমাদুল্লাহ', location: 'সিলেট সদর', action: 'visit' },
  { name: 'মোস্তফা কামাল', location: 'হাইমচর, চাঁদপুর', action: 'pledge' },
];

export const LiveTrackingProvider = ({ children }: { children: ReactNode }) => {
  const [onlineVisitors, setOnlineVisitors] = useState<number>(58);
  const [totalFrames, setTotalFrames] = useState<number>(1428);
  const [pledgedAttendees, setPledgedAttendees] = useState<number>(3892);
  const [hasPledged, setHasPledged] = useState<boolean>(false);

  const [userDistance, setUserDistance] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>(SEED_FEED);
  const [latestToast, setLatestToast] = useState<ActivityEvent | null>(null);

  // Initialize and check saved status
  useEffect(() => {
    try {
      const pledged = localStorage.getItem('iqra_has_pledged') === 'true';
      if (pledged) setHasPledged(true);

      const savedFrames = localStorage.getItem('iqra_frames_count');
      if (savedFrames) setTotalFrames(parseInt(savedFrames, 10));

      const savedPledges = localStorage.getItem('iqra_pledges_count');
      if (savedPledges) setPledgedAttendees(parseInt(savedPledges, 10));

      const savedDistance = localStorage.getItem('iqra_user_distance');
      if (savedDistance) setUserDistance(parseFloat(savedDistance));
    } catch {
      // ignore
    }
  }, []);

  // Natural live pulse: slight fluctuation in online visitors
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineVisitors((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = Math.max(32, Math.min(180, prev + delta));
        return next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Periodic simulated live stream events
  useEffect(() => {
    const interval = setInterval(() => {
      const template = SIMULATED_ACTIONS[Math.floor(Math.random() * SIMULATED_ACTIONS.length)];
      const newEvent: ActivityEvent = {
        id: String(Date.now()),
        name: template.name,
        location: template.location,
        action: template.action,
        time: Date.now(),
      };

      setActivityFeed((prev) => [newEvent, ...prev.slice(0, 15)]);
      setLatestToast(newEvent);

      if (template.action === 'frame') {
        setTotalFrames((n) => n + 1);
      } else if (template.action === 'pledge') {
        setPledgedAttendees((n) => n + 1);
      }
    }, 14000); // New activity every 14 seconds

    return () => clearInterval(interval);
  }, []);

  const recordPledge = useCallback((customName?: string) => {
    setHasPledged(true);
    setPledgedAttendees((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem('iqra_has_pledged', 'true');
        localStorage.setItem('iqra_pledges_count', String(next));
      } catch {
        // ignore
      }
      return next;
    });

    const newEvent: ActivityEvent = {
      id: String(Date.now()),
      name: customName || 'আপনি (অংশগ্রহণকারী)',
      location: 'বাংলাদেশ',
      action: 'pledge',
      time: Date.now(),
    };

    setActivityFeed((prev) => [newEvent, ...prev.slice(0, 15)]);
    setLatestToast(newEvent);
  }, []);

  const recordFrameCreated = useCallback(() => {
    setTotalFrames((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem('iqra_frames_count', String(next));
      } catch {
        // ignore
      }
      return next;
    });

    const newEvent: ActivityEvent = {
      id: String(Date.now()),
      name: 'একটি নতুন ফটো ফ্রেম',
      location: 'চাঁদপুর',
      action: 'frame',
      time: Date.now(),
    };

    setActivityFeed((prev) => [newEvent, ...prev.slice(0, 15)]);
  }, []);

  const trackUserDistance = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('আপনার ব্রাউজার লোকেশন সমর্থন করে না।');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

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
          setLocationError('অনুগ্রহ করে ব্রাউজারে লোকেশন পারমিশন দিন।');
        } else {
          setLocationError('দূরত্ব পরিমাপ করা সম্ভব হয়নি।');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
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
        activityFeed,
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
