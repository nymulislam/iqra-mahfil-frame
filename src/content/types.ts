export type Language = 'bn' | 'en';

export interface Speaker {
  id: string;
  name: { bn: string; en: string };
  title: { bn: string; en: string };
  role: { bn: string; en: string };
  affiliation: { bn: string; en: string };
  photo?: string;
  topic?: { bn: string; en: string };
  badge?: { bn: string; en: string };
  highlight?: boolean;
}

export interface Organizer {
  id: string;
  name: { bn: string; en: string };
  role: { bn: string; en: string };
  title: { bn: string; en: string };
  affiliation: { bn: string; en: string };
  photo?: string;
  badge?: { bn: string; en: string };
}

export interface ScheduleSlot {
  time: { bn: string; en: string };
  title: { bn: string; en: string };
  speaker?: { bn: string; en: string };
  description?: { bn: string; en: string };
}

export interface HighlightItem {
  id: string;
  badge: { bn: string; en: string };
  time: { bn: string; en: string };
  title: { bn: string; en: string };
  speaker: { bn: string; en: string };
  desc: { bn: string; en: string };
  icon: string;
}

export interface Department {
  id: string;
  name: { bn: string; en: string };
  subtitle: { bn: string; en: string };
  features: { bn: string[]; en: string[] };
  icon: string;
}

export interface Facility {
  title: { bn: string; en: string };
  desc: { bn: string; en: string };
  icon: string;
}
