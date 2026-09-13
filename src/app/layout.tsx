import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nabrijan - Build Your Online Store',
  description: 'Launch your professional single-vendor e-commerce store in minutes with 1-click WhatsApp orders, Pathao/Steadfast courier booking, and bKash/Nagad payments.',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#063B2A',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#063B2A" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
