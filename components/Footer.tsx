export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/70 bg-white/70 backdrop-blur">
      <div className="container-max py-10 grid gap-6 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            <span>JFavour</span>
          </div>
          <p className="subtle mt-4 max-w-sm">We craft corporate events, exhibitions, product launches, team building, and large-scale activations.</p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800">Company</h4>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li><a className="hover:text-brand" href="/about">About</a></li>
            <li><a className="hover:text-brand" href="/services">Services</a></li>
            <li><a className="hover:text-brand" href="/portfolio">Portfolio</a></li>
            <li><a className="hover:text-brand" href="/contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800">Contact</h4>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li>+60 12 345 6789</li>
            <li>hello@yourevents.co</li>
            <li>Your Office Address, City</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200/70">
        <div className="container-max py-4 text-sm text-slate-500 flex justify-between">
          <span>© {new Date().getFullYear()} JFavour</span>
          <span>Built with heart and coffee</span>
        </div>
      </div>
    </footer>
  );
}
