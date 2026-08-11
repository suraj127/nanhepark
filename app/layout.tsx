import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/LanguageContext';

export const metadata: Metadata = {
  title: 'Nanhey Park Civic Watch • Multi-Department Official Reporting',
  description: 'Single-email civic complaint generator with automatic multi-department routing, GPS watermarking, and bilingual (English + Hindi) support.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
