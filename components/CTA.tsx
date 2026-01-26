import Link from 'next/link';

export function CTA() {
  return (
    <section className="section">
      <div className="container-max">
        <div className="card p-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-800">Have an idea brewing?</h3>
            <p className="subtle">Let’s plan your next event together.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/contact" className="btn">Contact Us</Link>
            <Link href="/services" className="btn-outline">Know More</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
