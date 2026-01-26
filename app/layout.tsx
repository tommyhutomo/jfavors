import type { Metadata } from 'next';
import './globals.css';
import { ClientLayout } from './ClientLayout';

export const metadata: Metadata = {
  title: 'JFavour – Events that feel effortless and look unforgettable',
  description: 'A pastel-themed events/agency template built with Next.js + Tailwind CSS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
