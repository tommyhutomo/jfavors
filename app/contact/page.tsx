import ContactForm from './contact-form';

export const metadata = { title: 'Contact – Pastel Events' };

export default function ContactPage() {
  return (
    <div className="pastel-gradient">
      <section className="section container-max">
        <h1 className="heading-1 mb-4">Let's Bring Your Event to Life</h1>
        <p className="subtle max-w-2xl">Tell us about your corporate event, exhibition, product launch, team building, or large-scale activation.</p>

        <ContactForm />

        <div className="mt-10 grid gap-4">
          <p className="subtle">Call us: <a className="text-brand underline" href="tel:+60143384161">+60 12 345 6789</a></p>
          <p className="subtle">Email: <a className="text-brand underline" href="mailto:hello@yourevents.co">hello@yourevents.co</a></p>
          <p className="subtle">Office: Your Office Address, City, Country</p>
        </div>
      </section>
    </div>
  );
}
