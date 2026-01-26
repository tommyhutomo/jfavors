'use client';
import { LanguageProvider } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Footer } from '@/components/Footer';
import { SocialFloat } from '@/components/SocialFloat';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <LanguageSwitcher />
      <main className="flex-1">{children}</main>
      <Footer />
      <SocialFloat />
    </LanguageProvider>
  );
}
