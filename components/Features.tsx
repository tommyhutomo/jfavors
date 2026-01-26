'use client';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const items = [
  {
    title: 'End-to-end Management',
    desc: 'Strategy, creative, production, on-site ops, and post-event reporting.',
    color: 'bg-pastel-babyblue'
  },
  {
    title: 'Creative Design',
    desc: 'Stage, booth, motion, and content designed to match your brand.',
    color: 'bg-pastel-lavender'
  },
  {
    title: 'ROI-Focused',
    desc: 'Clear objectives, budgets, and KPIs to measure success.',
    color: 'bg-pastel-mint'
  },
  {
    title: 'Reliable Delivery',
    desc: 'Experienced show-calling and vendor orchestration to hit your cues.',
    color: 'bg-pastel-peach'
  }
];

export function Features() {
  const ref = useScrollReveal();

  return (
    <section className="section" ref={ref}>
      <div className="container-max">
        <h2 className="heading-2">Why choose us</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.title} className={`card p-6 ${it.color}`}>
              <h3 className="text-lg font-semibold text-slate-800">{it.title}</h3>
              <p className="subtle mt-2">{it.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="/about" className="btn-outline">Know More</a>
        </div>
      </div>
    </section>
  );
}
