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
    bn: 'ভর্তি চলছে • শিক্ষাবর্ষ ২০২৭',
    en: 'Admissions Open • Academic Session 2027',
  },
  departments: [
    {
      id: 'school',
      name: {
        bn: 'ইসলামিক স্কুল',
        en: 'Islamic School',
      },
      subtitle: {
        bn: 'নূরানী ও জেনারেল শিক্ষার সমন্বয়ে যুগোপযোগী প্রাথমিক পাঠ্যক্রম',
        en: 'Modern primary curriculum blending Noorani and general education',
      },
      features: {
        bn: [
          'বিশুদ্ধ কুরআন তিলাওয়াত ও মাখরাজ প্রশিক্ষণ',
          'বাংলা, ইংরেজি ও গণিতের মজবুত ভিত্তি তৈরি',
          'দৈনন্দিন মাসনূন দোয়া ও ইসলামী আদব-শিষ্টাচার চর্চা',
        ],
        en: [
          'Authentic Quran recitation and Makhraj training',
          'Strong foundation in Bangla, English, and Mathematics',
          'Daily Masnoon supplications and Islamic etiquette practice',
        ],
      },
      icon: 'BookOpen',
    },
    {
      id: 'quran',
      name: {
        bn: 'কুরআন ও হিফজ বিভাগ',
        en: 'Quran & Tahfiz Section',
      },
      subtitle: {
        bn: 'নাজেরা, আন্তর্জাতিক মানসম্পন্ন হিফজুল কুরআন ও তাজবীদে শিক্ষা',
        en: 'Nazira, International-Standard Tahfizul Quran & Tajweed',
      },
      features: {
         bn: [
          'শায়খ আব্দুল হক (হাফি.)-এর নির্দেশিত পদ্ধতিতে আন্তর্জাতিক মানের তিলাওয়াত অনুশীলন',
          'স্বল্প সময়ে নিখুঁতভাবে হিফজ সম্পন্ন করার সুশৃঙ্খল কর্মপদ্ধতি',
          'নিয়মিত সবক ও আমুখতা যাচাই এবং শিক্ষকদের সার্বক্ষণিক তদারকি',
        ],
        en: [
          'International recitation training following Shaykh Abdul Haque’s methodology',
          'Structured and effective system for timely Hifz completion',
          'Daily revision tracking and continuous teacher supervision',
        ],
      },
      icon: 'Crown',
    },
    {
      id: 'general',
      name: {
        bn: 'জেনারেল শিক্ষা বিভাগ',
        en: 'General Education',
      },
      subtitle: {
        bn: 'প্লে থেকে পঞ্চম শ্রেণি পর্যন্ত আধুনিক মানসম্মত পাঠদান',
        en: 'Quality modern academics from Playgroup to Grade 5',
      },
      features: {
         bn: [
          'জাতীয় শিক্ষাক্রমের সাথে সামঞ্জস্যপূর্ণ যুগোপযোগী সিলেবাস',
          'স্মার্ট ক্লাসরুম ও মাল্টিমিডিয়ার মাধ্যমে আনন্দময় পাঠদান',
          'শিশুদের সাবলীল ইংরেজি কথোপকথনে (Spoken English) বিশেষ গুরুত্ব',
        ],
        en: [
          'Updated syllabus aligned with the national curriculum',
          'Interactive smart classrooms and visual learning tools',
          'Special emphasis on fluent Spoken English for children',
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
        bn: 'বিশুদ্ধ ক্বিরাত, ইসলামী সংগীত (নাশিদ) ও শুদ্ধ আবৃত্তি প্রশিক্ষণ',
        en: 'Melodious Qirat, Islamic Nasheed, and elocution training',
      },
      features: {
         bn: [
          'সুললিত কণ্ঠে হামদ-নাত ও ইসলামী সংগীত চর্চা',
          'শুদ্ধ উচ্চারণ, উপস্থিত বক্তৃতা ও বিতর্ক কর্মশালা',
          'আরবি ও বাংলা সুন্দর হাতের লেখা এবং ক্যালিগ্রাফি প্রশিক্ষণ',
        ],
        en: [
          'Training in soulful Hamd, Naat, and Islamic Nasheeds',
          'Clear pronunciation, public speaking, and debate workshops',
          'Neat handwriting and Arabic-Bangla calligraphy training',
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
        bn: 'কর্মব্যস্ত মানুষদের জন্য সান্ধ্যকালীন বিশুদ্ধ কুরআন ও জরুরি দ্বীন শিক্ষা',
        en: 'Evening Quran and essentials Islamic studies for busy adults',
      },
      features: {
        bn: [
          'চাকরিজীবী ও ব্যবসায়ীদের জন্য সুবিধাজনক সান্ধ্যকালীন শিফট',
          'নামাযের বিশুদ্ধ ক্বিরাত ও নিত্যপ্রয়োজনীয় মাসআলা-মাসায়েল শিক্ষা',
          'সহজ পদ্ধতিতে কুরআনের তাজবীদ ও আরবি উচ্চারণ সংশোধন',
        ],
        en: [
          'Convenient evening batch for professionals and entrepreneurs',
          'Authentic prayer recitation and essential everyday Fiqh rules',
          'Easy Tajweed learning and Arabic pronunciation correction',
        ],
      },
      icon: 'Users',
    },
    {
      id: 'skills',
      name: {
        bn: 'স্কিল ডেভেলপমেন্ট',
        en: 'IT & Skill Development',
      },
      subtitle: {
        bn: 'কম্পিউটার প্রশিক্ষণসহ তথ্যপ্রযুক্তি ও ব্যবহারিক দক্ষতা উন্নয়ন',
        en: 'Computer literacy, IT traning, and practical life skills',
      },
      features: {
       bn: [
          'মৌলিক কম্পিউটার পরিচালনা, দ্রুত টাইপিং ও অফিস অ্যাপ্লিকেশন',
          'গ্রাফিক ডিজাইন ও প্রোগ্রামিংয়ের প্রাথমিক ধারণা',
          'ভবিষ্যৎ প্রজন্মকে প্রযুক্তিনির্ভর ও আত্মনির্ভরশীল হিসেবে গড়ে তোলা',
        ],
        en: [
          'Basic computer operations, typing, and office applications',
          'Foundational concepts of graphic design and coding',
          'Preparing students to become tech-savvy and self-reliant',
        ],
      },
      icon: 'Laptop',
    },
  ] as Department[],
  facilities: [
    {
      title: { bn: 'আবাসিক, অনাবাসিক ও ডে-কেয়ার', en: 'Residential, Non-Residential & Day-Care' },
      desc: {
       bn: 'অভিভাবকদের সুবিধা অনুযায়ী পূর্ণ আবাসিক, অনাবাসিক অথবা ডে-কেয়ার ব্যবস্থায় পড়াশোনার সুযোগ।',
        en: 'Flexible full-boarding, day-scholar, or day-care options tailored to parents’ needs.',
      },
      icon: 'Building2',
    },
    {
      title: { bn: 'সার্বক্ষণিক সিসিটিভি নিরাপত্তা', en: '24/7 CCTV Security' },
      desc: {
        bn: 'শিক্ষার্থীদের শতভাগ নিরাপত্তা নিশ্চিতে সম্পূর্ণ ক্যাম্পাস সার্বক্ষণিক সিসিটিভি ক্যামেরায় পর্যবেক্ষণকৃত।',
        en: 'Entire campus monitored round-the-clock under strict CCTV surveillance for student safety.',
      },
      icon: 'Video',
    },
    {
      title: { bn: '২৪ ঘণ্টা নিরবচ্ছিন্ন বিদ্যুৎ', en: '24/7 Power Backup' },
      desc: {
        bn: 'লোডশেডিংমুক্ত পড়াশোনা ও আরামদায়ক পরিবেশ নিশ্চিত করতে নিজস্ব জেনারেটর ও আইপিএস সুবিধা।',
        en: 'Dedicated generator and IPS backup ensuring uninterrupted study and comfort.',
      },
      icon: 'Zap',
    },
    {
      title: { bn: 'স্বাস্থ্যসম্মত ও পুষ্টিকর খাবার', en: 'Hygienic & Nutrition Mearls' },
      desc: {
         bn: 'নিজস্ব তত্ত্বাবধানে পরিচ্ছন্ন পরিবেশে প্রস্তুতকৃত সুষম খাবার এবং নিয়মিত স্বাস্থ্য পরীক্ষার ব্যবস্থা।',
        en: 'Fresh, balanced meals prepared hygienically under supervision, with routine health checkups.',
      },
      icon: 'Apple',
    },
  ] as Facility[],
};
