import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { SmoothScroll } from '@/components/SmoothScroll';

export const metadata: Metadata = {
  metadataBase: new URL('https://iqra.annujum.org'),
  title: 'ইক্বরা মাহফিল ২০২৬ ও ফটো ফ্রেম — ইক্বরা ইন্টারন্যাশনাল মাদরাসা',
  description:
    'বার্ষিক তাফসীরুল কুরআন মাহফিল ২০২৬ — ৫ ডিসেম্বর, শনিবার, বাদ যোহর। ইক্বরা ইন্টারন্যাশনাল মাদরাসা, পাটওয়ারী বাজার, ফরিদগঞ্জ, চাঁদপুর। আপনার ছবি দিয়ে আকর্ষণীয় ফ্রেম তৈরি করুন।',
  keywords: [
    'ইক্বরা ইন্টারন্যাশনাল মাদরাসা',
    'তাফসীরুল কুরআন মাহফিল ২০২৬',
    'মাহফিল ফটো ফ্রেম',
    'ফরিদগঞ্জ চাঁদপুর মাহফিল',
    'Iqra International Madrasah',
    'Iqra Mahfil Frame 2026',
  ],
  authors: [{ name: 'Naymul Islam' }],
  openGraph: {
    title: 'ইক্বরা মাহফিল ২০২৬ ও ফটো ফ্রেম — ইক্বরা ইন্টারন্যাশনাল মাদরাসা',
    description:
      'বার্ষিক তাফসীরুল কুরআন মাহফিল ২০২৬ — ৫ ডিসেম্বর বাদ যোহর। আপনার ছবি দিয়ে আকর্ষণীয় ফ্রেম তৈরি করুন ও শেয়ার করুন।',
    url: 'https://iqra.annujum.org',
    siteName: 'ইক্বরা ইন্টারন্যাশনাল মাদরাসা',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ইক্বরা মাহফিল ২০২৬',
      },
    ],
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ইক্বরা মাহফিল ২০২৬ ও ফটো ফ্রেম',
    description: '৫ ডিসেম্বর বাদ যোহর — বার্ষিক তাফসীরুল কুরআন মাহফিল ২০২৬',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/assets/logo.png',
    shortcut: '/assets/logo.png',
    apple: '/assets/logo.png',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#f0f9ff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" data-theme="iqra-blue" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-sky-600 selection:text-white transition-colors duration-500">
        <Providers>
          <SmoothScroll />
          {children}
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  const isLocal = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '[::1]' ||
                    window.location.hostname.endsWith('.local');

                  if (isLocal) {
                    navigator.serviceWorker.getRegistrations().then((regs) => {
                      for (const reg of regs) {
                        reg.unregister();
                      }
                    });
                    if ('caches' in window) {
                      caches.keys().then((keys) => {
                        for (const key of keys) {
                          caches.delete(key);
                        }
                      });
                    }
                    return;
                  }

                  navigator.serviceWorker.register('/sw.js').then((reg) => {
                    reg.update();
                  }).catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
