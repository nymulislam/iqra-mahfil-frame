import { Language } from '@/content/types';

export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function phoneHref(phone: string): string {
  const digits = phoneDigits(phone);
  return `tel:+${digits.startsWith('0') ? `88${digits}` : digits}`;
}

export function displayPhone(phone: string, lang: Language): string {
  return lang === 'bn'
    ? phone.replace(/\d/g, digit => '০১২৩৪৫৬৭৮৯'[Number(digit)])
    : phone;
}
