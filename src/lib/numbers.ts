import { Language } from '@/content/types';

export function formatNumber(value: number | null, lang: Language, minimumDigits = 1, grouped = true): string {
  if (value === null || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-US', {
    minimumIntegerDigits: minimumDigits,
    useGrouping: grouped,
    maximumFractionDigits: 1,
  }).format(value);
}
