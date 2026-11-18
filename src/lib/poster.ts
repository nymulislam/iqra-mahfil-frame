import { SITE } from '@/content/site';
import { Language } from '@/content/types';

export const OFFICIAL_POSTER = {
  src: '/assets/posters/mahfil-banner.jpg',
  filename: 'iqra-mahfil-2026-poster.jpg',
  width: 1066,
  height: 1600,
};

export async function sharePoster(lang: Language): Promise<'shared' | 'copied'> {
  const response = await fetch(OFFICIAL_POSTER.src);
  if (!response.ok) throw new Error('Poster unavailable');
  const blob = await response.blob();
  if (!blob.type.startsWith('image/')) throw new Error('Invalid poster response');
  const file = new File([blob], OFFICIAL_POSTER.filename, { type: blob.type });
  const title = lang === 'bn' ? 'ইক্বরা মাহফিল ২০২৬ অফিসিয়াল পোস্টার' : 'Iqra Mahfil 2026 Official Poster';
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title });
    return 'shared';
  }
  const url = `${SITE.url}${OFFICIAL_POSTER.src}`;
  if (navigator.share) {
    await navigator.share({ title, url });
    return 'shared';
  }
  await navigator.clipboard.writeText(url);
  return 'copied';
}
