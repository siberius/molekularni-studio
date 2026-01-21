// Kořenový layout aplikace Molekulární Studio
// Definuje základní strukturu HTML a metadata

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Načtení fontu Inter pro celé UI
const inter = Inter({ subsets: ['latin', 'latin-ext'] });

// Force dynamic rendering pro správnou konfiguraci metadat
export const dynamic = 'force-dynamic';

// Metadata aplikace pro SEO a social sharing
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
  title: 'Molekulární Studio | 3D Vizualizér Molekul',
  description: 'Interaktivní 3D vizualizér molekul s AI vyhledáváním. Prozkoumejte chemické struktury v moderním rozhraní.',
  keywords: ['molekuly', '3D', 'vizualizace', 'chemie', 'AI', 'věda'],
  authors: [{ name: 'Molekulární Studio Team' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    title: 'Molekulární Studio | 3D Vizualizér Molekul',
    description: 'Interaktivní 3D vizualizér molekul s AI vyhledáváním',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Molekulární Studio',
    description: 'Interaktivní 3D vizualizér molekul s AI vyhledáváním',
    images: ['/og-image.png'],
  },
};

/**
 * Kořenový layout aplikace
 * Obsahuje základní HTML strukturu a globální styly
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Potlačení hydračních chyb */}
        <style dangerouslySetInnerHTML={{ __html: `[data-hydration-error] { display: none !important; }` }} />
        {children}
      </body>
    </html>
  );
}
