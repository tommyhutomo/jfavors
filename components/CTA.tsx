'use client';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export function CTA() {
    const { t } = useLanguage();

  return (
    <section className="section">
      <div className="container-max">
        <div className="card p-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-800">{t('cta.title')}</h3>
            <p className="subtle">{t('cta.description')}</p>
          </div>
          <div className="flex gap-3">
            <Link href="https://linktr.ee/jfavors.eo" className="btn">{t('cta.contact')}</Link>
            <Link href="/services" className="btn-outline">{t('cta.knowMore')}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
