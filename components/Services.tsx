'use client';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const services = [
  { name: 'Corporate Events', desc: 'Townhalls, gala dinners, conferences, roadshows.' },
  { name: 'Exhibitions', desc: 'Booth design & build, visitor engagement, lead capture.' },
  { name: 'Product Launches', desc: 'Creative concepts, run of show, media staging.' },
  { name: 'Team Building', desc: 'Offsites, experiential games, facilitation, swag.' },
  { name: 'Brand Activations', desc: 'Pop-ups, mall activations, field marketing.' },
  { name: 'Talent & Entertainment', desc: 'Emcees, live bands, dancers, creators.' },
];

export function Services() {
  const ref = useScrollReveal();

  return (
    <section className="section" ref={ref}>
      <div className="container-max">
        <h2 className="heading-2">Services</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.name} className="card p-6">
              <div className="h-2 w-10 rounded-full bg-brand mb-4" />
              <h3 className="text-lg font-semibold text-slate-800">{s.name}</h3>
              <p className="subtle mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="/services" className="btn-outline">Know More</a>
        </div>
      </div>
    </section>
  );
}
