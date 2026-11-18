import { MAHFIL } from '@/content/mahfil';
import { SITE } from '@/content/site';
import { Language } from '@/content/types';

export function mahfilCalendarUrl(lang: Language): string {
  const calendarDate = (iso: string) => new Date(iso)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: MAHFIL.title[lang],
    dates: `${calendarDate(MAHFIL.dateISO)}/${calendarDate(MAHFIL.endDateISO)}`,
    ctz: 'Asia/Dhaka',
    details: MAHFIL.subtitle[lang],
    location: `${SITE.name[lang]}, ${SITE.locationDetails[lang]}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
