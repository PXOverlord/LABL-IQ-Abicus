import { Inter } from 'next/font/google';
import './globals.css';
import { AppLayout } from '../components/layout/app-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Labl IQ Shipping Intelligence',
  description: 'Professional shipping rate analysis and optimization platform',
  keywords: 'shipping, analytics, rates, Amazon, optimization, intelligence',
  authors: [{ name: 'LABL IQ Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
