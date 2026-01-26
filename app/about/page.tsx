export const metadata = { title: 'About – Pastel Events' };

export default function AboutPage() {
  return (
    <div className="pastel-gradient">
      <section className="section container-max">
        <h1 className="heading-1 mb-4">About Us</h1>
        <p className="subtle max-w-2xl">We are an integrated events team passionate about crafting human-centered experiences. Our approach blends strategy, design, and flawless execution.</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10">
          {['Strategy', 'Creative & Design', 'Production', 'Talent & Programming', 'On-site Ops', 'Post-Event Analytics'].map((item) => (
            <div key={item} className="card p-6">
              <h3 className="text-lg font-semibold text-slate-800">{item}</h3>
              <p className="subtle mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque facilisis fermentum nunc.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
