'use client';
import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-slate-200/60">
      <div className="container-max flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
          <span>JFavour</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-slate-700">
          <Link href="/" className="hover:text-brand">Home</Link>
          <Link href="/services" className="hover:text-brand">Services</Link>
          <Link href="/portfolio" className="hover:text-brand">Portfolio</Link>
          <Link href="/about" className="hover:text-brand">About</Link>
          <Link href="/contact" className="btn">Contact</Link>
        </nav>
        <button className="md:hidden rounded-lg p-2 hover:bg-slate-100" onClick={() => setOpen(!open)} aria-label="Toggle Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-200">
          <div className="container-max py-3 flex flex-col gap-3">
            <Link href="/" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/services" onClick={() => setOpen(false)}>Services</Link>
            <Link href="/portfolio" onClick={() => setOpen(false)}>Portfolio</Link>
            <Link href="/about" onClick={() => setOpen(false)}>About</Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="btn w-fit">Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
}
