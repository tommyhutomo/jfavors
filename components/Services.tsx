'use client';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLanguage } from '../context/LanguageContext';

const services = [
  { name: 'Wedding', desc: 'Theme design, décor styling, coordination, catering experience.' },
  { name: 'Training', desc: 'Workshops, skill‑building sessions, facilitation, learning materials.' },
  { name: 'Corporate Events', desc: 'Townhalls, gala dinners, conferences, roadshows.' },
  { name: 'Exhibitions', desc: 'Booth design & build, visitor engagement, lead capture.' },
  { name: 'Product Launches', desc: 'Creative concepts, run of show, media staging.' },
  { name: 'Team Building', desc: 'Offsites, experiential games, facilitation.' },
];

export function Services() {
  const ref = useScrollReveal();
  const { t } = useLanguage();

  return (
    <section className="section" ref={ref}>
      <div className="container-max">
        <h2 className="heading-2">{t('services.title')}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div key={t(`services.item-1-title`)} className="card p-6">
              <div className="h-2 w-10 rounded-full bg-brand mb-4" />
              <h3 className="text-lg font-semibold text-slate-800">{t(`services.item-1-title`)}</h3>
              <p className="subtle mt-2">{t(`services.item-1-desc`)}</p>
            </div>
            <div key={t(`services.item-2-title`)} className="card p-6">
              <div className="h-2 w-10 rounded-full bg-brand mb-4" />
              <h3 className="text-lg font-semibold text-slate-800">{t(`services.item-2-title`)}</h3>
              <p className="subtle mt-2">{t(`services.item-2-desc`)}</p>
            </div>
            <div key={t(`services.item-3-title`)} className="card p-6">
              <div className="h-2 w-10 rounded-full bg-brand mb-4" />
              <h3 className="text-lg font-semibold text-slate-800">{t(`services.item-3-title`)}</h3>
              <p className="subtle mt-2">{t(`services.item-3-desc`)}</p>
            </div>
            <div key={t(`services.item-4-title`)} className="card p-6">
              <div className="h-2 w-10 rounded-full bg-brand mb-4" />
              <h3 className="text-lg font-semibold text-slate-800">{t(`services.item-4-title`)}</h3>
              <p className="subtle mt-2">{t(`services.item-4-desc`)}</p>
            </div>
            <div key={t(`services.item-5-title`)} className="card p-6">
              <div className="h-2 w-10 rounded-full bg-brand mb-4" />
              <h3 className="text-lg font-semibold text-slate-800">{t(`services.item-5-title`)}</h3>
              <p className="subtle mt-2">{t(`services.item-5-desc`)}</p>
            </div>
            <div key={t(`services.item-6-title`)} className="card p-6">
              <div className="h-2 w-10 rounded-full bg-brand mb-4" />
              <h3 className="text-lg font-semibold text-slate-800">{t(`services.item-6-title`)}</h3>
              <p className="subtle mt-2">{t(`services.item-6-desc`)}</p>
            </div>
        </div>
        <div className="mt-8 text-center">
          <a href="/services" className="btn-outline">{t(`services.knowMore`)}</a>
        </div>
      </div>
    </section>
  );
}
