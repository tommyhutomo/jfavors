import { EventPackage } from '@/components/EventPackage';

export const metadata = { title: 'Services – Pastel Events' };

export default function ServicesPage() {
  return (
    <div className="pastel-gradient">
      <section className="section container-max">
        <h1 className="heading-1 mb-4">Our Services</h1>
        <p className="subtle max-w-2xl">From intimate product launches to large-scale brand activations, we manage your event end-to-end with creative, measurable outcomes.</p>
      </section>
        <EventPackage />
    </div>
  );
}
