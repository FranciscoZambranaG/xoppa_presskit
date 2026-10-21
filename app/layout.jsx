import { Archivo } from 'next/font/google';
import './globals.css';
import { site } from '@/lib/site';

const display = Archivo({ subsets: ['latin'], axes: ['wdth'], weight: 'variable', variable: '--f-display', display: 'swap' });

export const metadata = {
  title: `${site.name} | ${site.tagline} Press Kit`,
  description: `Presskit y booking de ${site.name}. ${site.genres.join(', ')}.`,
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#0a0a0a' };

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={display.variable}>
      <body>{children}</body>
    </html>
  );
}
