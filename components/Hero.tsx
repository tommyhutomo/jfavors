'use client';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="pt-6 sm:pt-8 lg:pt-12 pb-16 sm:pb-24 lg:pb-32 relative overflow-hidden">
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/background.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300/30 via-purple-300/20 to-blue-300/30 -z-10" />
      <div className="container-max grid items-center gap-16 lg:grid-cols-1 relative z-10">
        <div className="max-w-4xl pt-16 sm:pt-20 lg:pt-24">
          <p className="text-brand font-semibold text-5xl mb-4">{t('hero.brand')}</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            {t('hero.title').split(t('hero.titleHighlight'))[0]}
            <span className="text-brand">{t('hero.titleHighlight')}</span>
            {t('hero.title').split(t('hero.titleHighlight'))[1]}
          </h1>
          <p className="text-white mt-6 text-lg">{t('hero.description')}</p>
          <div className="mt-10 flex gap-4">
            <Link href="https://linktr.ee/jfavors.eo" className="btn">{t('hero.cta1')}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
