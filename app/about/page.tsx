export const metadata = { title: 'About – Pastel Events' };

export default function AboutPage() {
  return (
    <div className="pastel-gradient">
      <section className="section container-max">
        <h1 className="heading-1 mb-4">How We Make a Difference</h1>
        <p className="subtle max-w-2xl">We are an integrated events team passionate about crafting human-centered experiences. Our approach blends strategy, design, and flawless execution.</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10">
          <div key="Creative" className="card p-6">
              <h3 className="text-lg font-semibold text-slate-800">Creative</h3>
              <p className="subtle mt-2">Your events stand out because you bring fresh, original, and imaginative ideas to life. Every design choice—whether décor, theme, or overall event concept—is crafted uniquely for each client. Our creativity transforms ordinary gatherings into extraordinary experiences that feel personalized, exciting, and visually unforgettable.</p>
          </div>
          <div key="Reliable" className="card p-6">
              <h3 className="text-lg font-semibold text-slate-800">Reliable</h3>
              <p className="subtle mt-2">Clients can trust that every detail will be handled with precision and professionalism. From planning to execution, our team consistently delivers on time, meets expectations, and ensures smooth operations. Reliability builds confidence, allowing customers to enjoy their event stress‑free, knowing everything is fully taken care of.</p>
          </div>
          <div key="Affordable" className="card p-6">
              <h3 className="text-lg font-semibold text-slate-800">Affordable</h3>
              <p className="subtle mt-2">We offer high‑quality event planning, décor, and catering at prices that make sense for different budgets. Customers appreciate transparent costs, customizable packages, and value‑driven services that don’t compromise on excellence. Being affordable allows more people to enjoy premium-quality events without financial strain.</p>
          </div>
          <div key="Memorable" className="card p-6">
              <h3 className="text-lg font-semibold text-slate-800">Memorable</h3>
              <p className="subtle mt-2">Your events are crafted to leave lasting impressions, creating moments people will talk about long after the celebration ends. From beautiful styling to seamless coordination and great food, everything is designed to delight guests. Our focus on meaningful details that turn celebrations into cherished memories.</p>
          </div>
          <div key="Stylish" className="card p-6">
              <h3 className="text-lg font-semibold text-slate-800">Stylish</h3>
              <p className="subtle mt-2">Every event reflects modern trends, aesthetic harmony, and refined taste. With a strong eye for beauty and balance, we elevate any space into something Instagram-worthy. Whether elegant, rustic, romantic, or contemporary, our stylish approach ensures each event looks stunning and feels perfectly curated.</p>
          </div>
          <div key="Professional" className="card p-6">
              <h3 className="text-lg font-semibold text-slate-800">Professional</h3>
              <p className="subtle mt-2">Our team brings expertise, organization, and industry experience to every project. We communicate clearly, manage timelines efficiently, and handle challenges gracefully. Professionalism gives clients peace of mind, they know they’re working with skilled people who deliver quality results while maintaining high standards across design, decoration, and catering.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
