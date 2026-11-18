import { ScheduleSlot, HighlightItem } from './types';

export const MAHFIL = {
  year: '২০২৬',
  yearEn: '2026',
  title: {
    bn: 'বার্ষিক তাফসীরুল কুরআন মাহফিল ২০২৬',
    en: 'Annual Tafsirul Quran Mahfil 2026',
  },
  subtitle: {
    bn: 'কুরআনের আলো ছড়াতে এবং দ্বীনি জাগরণে এক মহা সম্মিলন',
    en: 'A grand spiritual gathering to illuminate hearts with the Holy Quran and Islamic guidance',
  },
  dateISO: '2026-12-05T14:00:00+06:00', // 5 Dec 2026 Bad Zohr
  dateDisplay: {
    bn: '৫ ডিসেম্বর ২০২৬, শনিবার',
    en: 'Saturday, December 5, 2026',
  },
  timeDisplay: {
    bn: 'বাদ যোহর হইতে মধ্যরাত পর্যন্ত',
    en: 'From Afternoon (Zohr) to Midnight',
  },
  venue: {
    bn: 'মাদরাসা সংলগ্ন বালুর মাঠ',
    en: 'Madrasah Central Grounds (Balur Math)',
  },
  location: {
    bn: 'পাটওয়ারী বাজার দক্ষিণ মাথা, ফরিদগঞ্জ, চাঁদপুর',
    en: 'South End of Patwari Bazar, Faridganj, Chandpur',
  },
  patron: {
    bn: 'উস্তাযুল হুফফাজ শায়খ আব্দুল হক',
    en: 'Ustadzul Huffaz Shaykh Abdul Haque',
  },
  patronRole: {
    bn: 'সভাপতিত্ব ও মাশকুল কুরআনের দারস প্রদান করবেন',
    en: 'President & Chief Quran Recitation Mentor',
  },
  patronTitle: {
    bn: 'চেয়ারম্যান, হুফফাজুল কুরআন ফাউন্ডেশন বাংলাদেশ ও তত্ত্বাবধায়ক, ইক্বরা ইন্টারন্যাশনাল মাদরাসা।',
    en: 'Chairman, Huffazul Quran Foundation Bangladesh & Supervisor, Iqra International Madrasah',
  },
  organizer: {
    bn: 'ইক্বরা ইন্টারন্যাশনাল মাদরাসা',
    en: 'Iqra International Madrasah',
  },
  organizerCommittee: {
    bn: 'ক্বারী সিদ্দিকুর রহমান (সভাপতি) • মুফতী আবু তাহের সিদ্দিকী (প্রতিষ্ঠাতা মুহতামীম) • হাফেজ মাওলানা আলাউদ্দীন (ভাইস প্রিন্সিপাল)',
    en: 'Qari Siddiqur Rahman (President) • Mufti Abu Taher Siddiqui (Founder Principal) • Hafiz Maulana Alauddin (Vice Principal)',
  },
  slogan: {
    bn: 'একে অপরকে দাওয়াত দিন, দলে দলে যোগ দিন।',
    en: 'Cordially inviting you and your family to join this blessed gathering.',
  },
  nextYearMahfil: {
    bn: '১৬ নভেম্বর ২০২৭ইং, মঙ্গলবার',
    en: 'Tuesday, November 16, 2027',
  },
  helplinePhone: '01797-091817',
  highlights: [
    {
      id: 'daras',
      badge: {
        bn: 'বাদ যোহর',
        en: 'Afternoon',
      },
      time: {
        bn: 'দুপুর ২:০০',
        en: '2:00 PM',
      },
      title: {
        bn: 'মাশকুল কুরআন দারস',
        en: 'Quran Masterclass',
      },
      speaker: {
        bn: 'শায়খ আব্দুল হক',
        en: 'Shaykh Abdul Haque',
      },
      desc: {
        bn: 'বিশুদ্ধ তিলাওয়াত ও মাশক প্রশিক্ষণ',
        en: 'Phonetic recitation & Tajweed practice',
      },
      icon: 'BookOpen',
    },
    {
      id: 'maghrib',
      badge: {
        bn: 'বাদ মাগরিব',
        en: 'Post-Maghrib',
      },
      time: {
        bn: 'সন্ধ্যা ৫:৪৫',
        en: '5:45 PM',
      },
      title: {
        bn: 'সান্ধ্যকালীন বয়ান',
        en: 'Evening Bayan',
      },
      speaker: {
        bn: 'মুফতী আনিসুর রহমান আশরাফী',
        en: 'Mufti Anisur Rahman Ashrafi',
      },
      desc: {
        bn: 'পবিত্র জীবন গঠন ও আত্মশুদ্ধি',
        en: 'Spiritual guidance & righteous living',
      },
      icon: 'Clock',
    },
    {
      id: 'qirat',
      badge: {
        bn: 'পবিত্র সুর',
        en: 'Sacred Melodies',
      },
      time: {
        bn: 'সন্ধ্যা ৭:১৫',
        en: '7:15 PM',
      },
      title: {
        bn: 'আন্তর্জাতিক ক্বিরাত মাহফিল',
        en: 'International Qirat Assembly',
      },
      speaker: {
        bn: 'হাফেজ নাজমুস সাকিব ও ক্বারী আবু তালহা',
        en: 'Hafiz Najmus Sakib & Qari Abu Talha',
      },
      desc: {
        bn: 'বিশ্বজয়ী ক্বারীদের সুমধুর তিলাওয়াত',
        en: 'Soul-stirring recitations by champions',
      },
      icon: 'Mic',
    },
    {
      id: 'tafsir',
      badge: {
        bn: 'মূল আকর্ষণ',
        en: 'Grand Finale',
      },
      time: {
        bn: 'রাত ৮:১৫ - মধ্যরাত',
        en: '8:15 PM - Midnight',
      },
      title: {
        bn: 'তাফসির ও আখেরী মুনাজাত',
        en: 'Grand Tafsir & Dua',
      },
      speaker: {
        bn: 'আল্লামা আশেকে এলাহী ও মুস্তাকুন্নবী কাসেমী',
        en: 'Allama Asheke Elahi & Mufti Mustaqun Nabi',
      },
      desc: {
        bn: 'সারগর্ভ তাফসির ও বিশেষ আখেরী বয়ান',
        en: 'Deep Quranic insights & closing supplication',
      },
      icon: 'Award',
    },
  ] as HighlightItem[],
  schedule: [] as ScheduleSlot[],
};
