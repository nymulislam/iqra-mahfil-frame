export interface SponsorInfo {
  name: { bn: string; en: string };
  tagline: { bn: string; en: string };
  badge: { bn: string; en: string };
  desc: { bn: string; en: string };
  director: {
    name: { bn: string; en: string };
    designation: { bn: string; en: string };
    photo: string;
  };
  logo: string;
  cardImage: string;
  contacts: {
    mobile1: string;
    mobile2: string;
    telephone: string;
    email: string;
    address: { bn: string; en: string };
  };
  services: { bn: string[]; en: string[] };
}

export const SPONSOR_DATA: SponsorInfo = {
  name: {
    bn: 'আর রহমান ট্রাভেলস',
    en: 'Ar-Rahman Travels',
  },
  tagline: {
    bn: 'সততাই মূল পুঁজি',
    en: 'Honesty is Our Foundation',
  },
  badge: {
    bn: 'অফিসিয়াল স্পনসর • হজ্ব ও উমরাহ',
    en: 'Official Sponsor • Hajj & Umrah',
  },
  desc: {
    bn: 'সঠিকভাবে হজ্ব ও উমরাহ পালনের একটি অত্যন্ত নির্ভরযোগ্য এবং বিশ্বস্ত কাফেলা। অভিজ্ঞ ওলামায়ে কেরামের সার্বিক তত্ত্বাবধানে সুন্নাহসম্মত সেবা।',
    en: 'A trusted and reliable agency for authentic Hajj and Umrah pilgrimage under the direct guidance of experienced Islamic scholars.',
  },
  director: {
    name: {
      bn: 'হাফেজ মাওলানা মুফতী মুহাম্মদ ইসমাইল',
      en: 'Hafiz Maulana Mufti Muhammad Ismail',
    },
    designation: {
      bn: 'পরিচালক, আর রহমান ট্রাভেলস • ইমাম, শতাব্দী সেন্টার, মতিঝিল, ঢাকা',
      en: 'Director, Ar-Rahman Travels • Imam, Shatabdi Center, Motijheel, Dhaka',
    },
    photo: '/assets/sponsor/mufti-ismail.jpg',
  },
  logo: '/assets/sponsor/ar-rahman-logo.jpg',
  cardImage: '/assets/sponsor/ar-rahman-card.jpg',
  contacts: {
    mobile1: '+8801824803545',
    mobile2: '+8801974803545',
    telephone: '+880241071363',
    email: 'muftiismailmunshi@gmail.com',
    address: {
      bn: '৭৭/২, শুক্কুর পাগলা লেন, ফকিরাপুল, মতিঝিল, ঢাকা- ১০০০',
      en: '77/2, Shukkur Pagla Lane, Fakirapool, Motijheel, Dhaka-1000',
    },
  },
  services: {
    bn: [
      'ভিআইপি ও সাধারণ হজ্ব প্যাকেজ',
      'সারাবছর নিয়মিত উমরাহ কাফেলা',
      'বিমান টিকিট ও ভিসা প্রসেসিং',
      'মক্কা-মদিনায় অভিজ্ঞ আলেমের গাইডেন্স',
    ],
    en: [
      'VIP & Standard Hajj Packages',
      'Year-round Umrah Delegations',
      'Air Ticketing & Visa Processing',
      'Direct Guidance by Scholars in Makkah & Madinah',
    ],
  },
};
