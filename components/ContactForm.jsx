'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    }, 700);
  };

  return (
    <form onSubmit={handleSubmit} className="premium-panel p-8 md:p-10">
      <h3 className="font-serif text-2xl text-cocoa">Send us a message</h3>
      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-5 text-sm text-stone-700 outline-none transition duration-200 focus:border-cocoa focus:shadow-glow"
            required
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-5 text-sm text-stone-700 outline-none transition duration-200 focus:border-cocoa focus:shadow-glow"
            required
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Message</span>
          <textarea
            name="message"
            rows="6"
            value={form.message}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-cocoa/10 bg-white px-5 py-4 text-sm text-stone-700 outline-none transition duration-200 focus:border-cocoa focus:shadow-glow"
            required
          />
        </label>
        <button
          type="submit"
          className="button-primary"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
        {status === 'success' && (
          <div className="flex items-center gap-2 rounded-xl bg-forest/8 px-4 py-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-forest"><polyline points="20 6 9 17 4 12"/></svg>
            <p className="text-sm font-medium text-forest">Thanks for reaching out. We'll be in touch soon.</p>
          </div>
        )}
      </div>
    </form>
  );
}
