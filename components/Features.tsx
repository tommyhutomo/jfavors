'use client';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLanguage } from '../context/LanguageContext';

const items = [
  {
    title: 'Creative',
    desc: 'We create unique, imaginative designs that transform ordinary events into unforgettable experiences.',
    color: 'bg-pastel-babyblue'
  },
  {
    title: 'Reliable',
    desc: 'Reliable, precise, and professional—ensuring smooth, stress‑free events every time',
    color: 'bg-pastel-lavender'
  },
  {
    title: 'Affordable',
    desc: 'Affordable, high‑quality event planning with transparent pricing and customizable packages.',
    color: 'bg-pastel-mint'
  },
  {
    title: 'Memorable',
    desc: 'Memorable events crafted with beautiful styling, seamless coordination, and meaningful details.',
    color: 'bg-pastel-peach'
  }
];

export function Features() {
  const ref = useScrollReveal();
  const { t } = useLanguage();

  return (
    <section className="section" ref={ref}>
      <div className="container-max">
        <h2 className="heading-2">{t('features.title')}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div key={t(`features.item-1-title`)} className={`card p-6 ${items[0].color}`}>
              <h3 className="text-lg font-semibold text-slate-800">{t(`features.item-1-title`)}</h3>
              <p className="subtle mt-2">{t(`features.item-1-desc`)}</p>
            </div>
            <div key={t(`features.item-2-title`)} className={`card p-6 ${items[0].color}`}>
              <h3 className="text-lg font-semibold text-slate-800">{t(`features.item-2-title`)}</h3>
              <p className="subtle mt-2">{t(`features.item-2-desc`)}</p>
            </div>
            <div key={t(`features.item-3-title`)} className={`card p-6 ${items[0].color}`}>
              <h3 className="text-lg font-semibold text-slate-800">{t(`features.item-3-title`)}</h3>
              <p className="subtle mt-2">{t(`features.item-3-desc`)}</p>
            </div>
            <div key={t(`features.item-4-title`)} className={`card p-6 ${items[0].color}`}>
              <h3 className="text-lg font-semibold text-slate-800">{t(`features.item-4-title`)}</h3>
              <p className="subtle mt-2">{t(`features.item-4-desc`)}</p>
            </div>
        </div>
        <div className="mt-8 text-center">
          <a href="/about" className="btn-outline">{t(`features.know-more`)}</a>
        </div>
      </div>
    </section>
  );
}
