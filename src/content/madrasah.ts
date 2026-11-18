import { Department, Facility } from './types';

export const MADRASAH_INFO = {
  title: {
    bn: 'ইক্বরা ইন্টারন্যাশনাল মাদরাসা',
    en: 'Iqra International Madrasah',
  },
  slogan: {
    bn: 'পড় তোমার প্রভুর নামে, যিনি তোমায় সৃষ্টি করেছেন',
    en: 'Read in the name of your Lord who created',
  },
  admissionSession: {
    bn: 'ভর্তি চলছে শিক্ষাবর্ষ ২০২৭',
    en: 'Admissions Open Academic Year 2027',
  },
  departments: [
    {
      id: 'school',
      name: {
        bn: 'ইসলামিক স্কুল',
        en: 'Islamic School',
      },
      subtitle: {
        bn: 'নূরানী শরয়ী ও জেনারেল শিক্ষার যুগোপযোগী প্রাথমিক পাঠ্যক্রম',
        en: 'Modern primary curriculum combining Noorani Shariah and General education',
      },
      features: {
        bn: [
          'বিশুদ্ধ কুরআন শিক্ষা ও মাখরাজ প্রশিক্ষণ',
          'বাংলা, ইংরেজি ও গণিতের শক্তিশালী ভিত্তি',
          'দৈনন্দিন মাসনূন দোয়া ও আদব শিষ্টাচার চর্চা',
        ],
        en: [
          'Pure Quranic recitation and Makhraj training',
          'Strong foundation in Bangla, English, and Math',
          'Daily Sunnah supplications and character building',
        ],
      },
      icon: 'BookOpen',
    },
    {
      id: 'quran',
      name: {
        bn: 'কুরআন ডিপার্টমেন্ট',
        en: 'Quran Department',
      },
      subtitle: {
        bn: 'নাজেরা, আন্তর্জাতিক মানসম্পন্ন হিফজুল কুরআন ও তাজবীদে মুসহাফ্ফাহ্',
        en: 'Nazira, International-Standard Tahfizul Quran & Tajweed',
      },
      features: {
        bn: [
          'শায়খ আব্দুল হক (হাফি.)-এর অনুকরণে আন্তর্জাতিক তেলাওয়াত পদ্ধতি',
          'স্বল্প সময়ে হিফজ সমাপ্তির বিশেষ বৈজ্ঞানিক কর্মপদ্ধতি',
          'মুসহাফ যাচাই ও সার্বক্ষণিক তদারকি',
        ],
        en: [
          'International recitation style guided by Shaykh Abdul Haque',
          'Scientific and rapid memorization methodology',
          'Rigorous revision and continuous evaluation',
        ],
      },
      icon: 'Crown',
    },
    {
      id: 'general',
      name: {
        bn: 'জেনারেল বিভাগ',
        en: 'General Section',
      },
      subtitle: {
        bn: 'প্লে থেকে পঞ্চম শ্রেণি পর্যন্ত আধুনিক মানের পাঠদান',
        en: 'Play to Grade 5 with modern academic excellence',
      },
      features: {
        bn: [
          'জাতীয় শিক্ষাক্রমের সাথে সামঞ্জস্যপূর্ণ যুগোপযোগী সিলেবাস',
          'স্মার্ট ক্লাসরুম ও মাল্টিমিডিয়া ভিত্তিক সহজ শিক্ষাদান',
          'ইংরেজি কথোপকথনে বিশেষ জোর প্রদান',
        ],
        en: [
          'Comprehensive syllabus aligned with national curricula',
          'Smart interactive classrooms and visual learning',
          'Special focus on spoken English fluency',
        ],
      },
      icon: 'GraduationCap',
    },
    {
      id: 'cultural',
      name: {
        bn: 'ইসলামিক কালচারাল বিভাগ',
        en: 'Islamic Cultural Wing',
      },
      subtitle: {
        bn: 'মাতৃভাষা ভিত্তিক ক্বিরাত, নাশিদ ও আবৃত্তি প্রশিক্ষণ',
        en: 'Mother-tongue Qirat, Nasheed, and elocution training',
      },
      features: {
        bn: [
          'জাতীয় মানের হামদ-নাত ও ইসলামী সংগীত চর্চা',
          'সুস্পষ্ট বাগ্মিতা, উপস্থিত বক্তৃতা ও বিতর্ক কর্মশালা',
          'সুন্দর হস্তলিপি ও ক্যালিগ্রাফি প্রশিক্ষণ',
        ],
        en: [
          'Nasheed and soulful spiritual melodies training',
          'Public speaking, elocution, and debate workshops',
          'Arabic and Bengali calligraphy arts',
        ],
      },
      icon: 'Mic',
    },
    {
      id: 'adults',
      name: {
        bn: 'বয়স্ক দ্বীনি শিক্ষা',
        en: 'Adult Islamic Learning',
      },
      subtitle: {
        bn: 'কর্মব্যস্ত মানুষদের জন্য সান্ধ্যকালীন বিশুদ্ধ কুরআন ও দ্বীন শিক্ষা',
        en: 'Evening pure Quran and essentials for busy adults',
      },
      features: {
        bn: [
          'চাকরিজীবী ও ব্যবসায়ীদের জন্য সুবিধাজনক সান্ধ্যকালীন শিফট',
          'নামাযের বিশুদ্ধ কেরাত ও ফরজ-ওয়াজিব মাসায়েল শিক্ষা',
          'সহজ পদ্ধতিতে আরবি ভাষা ও উচ্চারণ সংশোধন',
        ],
        en: [
          'Flexible evening schedule for professionals and businessmen',
          'Pure prayer recitation and essential Fiqh rules',
          'Simple Arabic learning and phonetic correction',
        ],
      },
      icon: 'Users',
    },
    {
      id: 'skills',
      name: {
        bn: 'স্কিল ডেভেলপমেন্ট',
        en: 'Skill Development',
      },
      subtitle: {
        bn: 'কম্পিউটার প্রশিক্ষণসহ তথ্যপ্রযুক্তি ও ব্যবহারিক দক্ষতা',
        en: 'Computer training, IT literacy, and practical vocational skills',
      },
      features: {
        bn: [
          'মৌলিক কম্পিউটার জ্ঞান, টাইপিং ও অফিস অ্যাপ্লিকেশন',
          'গ্রাফিক্স ডিজাইন ও বেসিক কোডিং পরিচিতি',
          'আলেমরা যেন আত্মনির্ভরশীল ও দক্ষ মানবসম্পদ হয়ে গড়ে ওঠে',
        ],
        en: [
          'Basic computer literacy, typing, and office tools',
          'Introduction to graphic design and digital skills',
          'Empowering students to become self-reliant',
        ],
      },
      icon: 'Laptop',
    },
  ] as Department[],
  facilities: [
    {
      title: { bn: 'আবাসিক, অনাবাসিক ও ডে-কেয়ার', en: 'Residential, Non-Residential & Day-Care' },
      desc: {
        bn: 'অভিভাবকদের প্রয়োজন অনুযায়ী পূর্ণ আবাসিক, অনাবাসিক অথবা ডে-কেয়ার ব্যবস্থার সুযোগ।',
        en: 'Flexible full boarding, day scholar, or day-care arrangements tailored for parents.',
      },
      icon: 'Building2',
    },
    {
      title: { bn: 'সিসিটিভি ক্যামেরা নিরাপত্তা', en: '24/7 CCTV Camera Security' },
      desc: {
        bn: 'সম্পূর্ণ ক্যাম্পাস সার্বক্ষণিক সিসিটিভি ক্যামেরার আওতায় কঠোর নিরাপত্তায় পরিচালিত।',
        en: 'Full campus continuously monitored with high-definition CCTV security surveillance.',
      },
      icon: 'Video',
    },
    {
      title: { bn: '২৪ ঘণ্টা বিদ্যুৎ ও জেনারেটর', en: '24/7 Uninterrupted Power Backup' },
      desc: {
        bn: 'লোডশেডিং মুক্ত নিরবচ্ছিন্ন পড়াশোনা নিশ্চিত করতে স্বয়ংক্রিয় জেনারেটর ও আইপিএস সুবিধা।',
        en: 'Dedicated generator and IPS system guaranteeing uninterrupted study hours.',
      },
      icon: 'Zap',
    },
    {
      title: { bn: 'স্বাস্থ্যসম্মত সুষম খাবার', en: 'Hygienic Balanced Nutrition' },
      desc: {
        bn: 'অভিজ্ঞ পাচক দ্বারা প্রস্তুত পুষ্টিকর খাদ্য ও নিয়মিত স্বাস্থ্য পরীক্ষার সুব্যবস্থা।',
        en: 'Fresh, balanced meals cooked hygienically with routine health and hygiene checks.',
      },
      icon: 'Apple',
    },
  ] as Facility[],
};
