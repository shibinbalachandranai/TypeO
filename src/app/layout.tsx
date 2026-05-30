import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TypeO — Type Fast, Score Big!',
  description: 'TypeO is a free typing game for kids. Blast falling letters and numbers before they escape! Improve keyboard speed, accuracy, and reaction time while having fun. Play now — no download needed.',
  keywords: [
    'typing game for kids',
    'kids keyboard game',
    'learn to type',
    'typing speed game',
    'letter blast game',
    'educational typing game',
    'free typing game online',
    'improve typing speed',
    'alphabet game for children',
    'keyboard reaction game',
    'TypeO game',
    'typing practice for beginners',
  ],
  authors: [{ name: 'Shibin Balachandran', url: 'https://shibinbalachandran.in' }],
  creator: 'Shibin Balachandran',
  metadataBase: new URL('https://typeo.vercel.app'),
  openGraph: {
    title: 'TypeO — Type Fast, Score Big!',
    description: 'Blast falling letters before they escape! A fun typing game for kids that builds keyboard speed and accuracy.',
    url: 'https://typeo.vercel.app',
    siteName: 'TypeO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TypeO — Type Fast, Score Big!',
    description: 'Blast falling letters before they escape! A fun typing game for kids.',
    creator: '@shibinbalachandran',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
