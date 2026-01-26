'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(payload) });
      const json = await res.json();
      setStatus(json?.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 grid gap-4 max-w-2xl card p-6">
      <div className="grid gap-1">
        <label className="text-sm font-medium">Name</label>
        <input name="name" required className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-brand/50" />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Phone</label>
        <input name="phone" className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-brand/50" />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Email</label>
        <input name="email" type="email" required className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-brand/50" />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Company</label>
        <input name="company" className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-brand/50" />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Message</label>
        <textarea name="message" rows={5} className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-brand/50" />
      </div>
      <div className="flex items-center gap-3">
        <button className="btn" type="submit">Submit</button>
        {status === 'sending' && <span className="subtle">Sending…</span>}
        {status === 'sent' && <span className="text-green-700">Thanks! We'll be in touch.</span>}
        {status === 'error' && <span className="text-red-600">Something went wrong. Please try again.</span>}
      </div>
    </form>
  );
}
