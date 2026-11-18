import { MAHFIL_COORDS } from '@/lib/geo';

const CONTACT_PHONES = ['01710-516985', '01797-091817'];

export const SITE = {
  name: {
    bn: 'ইক্বরা ইন্টারন্যাশনাল মাদরাসা',
    en: 'Iqra International Madrasah',
  },
  shortName: {
    bn: 'ইক্বরা মাদরাসা',
    en: 'Iqra Madrasah',
  },
  tagline: {
    bn: 'শারয়ী ও জেনারেল শিক্ষার সমন্বয়ে যুগোপযোগী শিক্ষা প্রদান',
    en: 'A Modern Educational Mission Combining Shariah & Academic Excellence',
  },
  location: {
    bn: 'পাটওয়ারী বাজার, ফরিদগঞ্জ, চাঁদপুর',
    en: 'Patwari Bazar, Faridganj, Chandpur',
  },
  locationDetails: {
    bn: 'মাদরাসা সংলগ্ন বালুর মাঠ, পাটওয়ারী বাজার দক্ষিণ মাথা, ফরিদগঞ্জ, চাঁদপুর।',
    en: 'Madrasah Central Grounds (Balur Math), South End of Patwari Bazar, Faridganj, Chandpur.',
  },
  phones: CONTACT_PHONES,
  email: 'iqramadrasa25@gmail.com',
  facebook: 'https://facebook.com/iqramadrasa25',
  mapUrl: `https://www.google.com/maps/dir/?api=1&destination=${MAHFIL_COORDS.latitude},${MAHFIL_COORDS.longitude}`,
  url: 'https://iqra.annujum.org',
  logo: '/assets/logo.png',
  donation: {
    bkash: CONTACT_PHONES[0],
    nagad: CONTACT_PHONES[1],
    accountType: {
      bn: 'পার্সোনাল (Send Money)',
      en: 'Personal (Send Money)',
    },
    note: {
      bn: 'রেফারেন্সে "Mahfil" বা "Madrasah" লিখুন',
      en: 'Enter "Mahfil" or "Madrasah" as reference',
    },
  },
};
