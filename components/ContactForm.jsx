'use client';

import { useState } from 'react';

function validateContactForm(form) {
  const errors = {};
  const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!form.name.trim()) errors.name = 'Name is required';
  else if (!nameRegex.test(form.name.trim())) errors.name = 'Enter a valid name (letters only)';

  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!emailRegex.test(form.email.trim())) errors.email = 'Enter a valid email address';

  if (!form.message.trim()) errors.message = 'Message is required';
  else if (form.message.trim().length < 10) errors.message = 'Message must be at least 10 characters';

  return errors;
}

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((current) => { const next = { ...current }; delete next[name]; return next; });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = validateContactForm(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setFormErrors({});
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
            pattern="[a-zA-Z\s'\-]+"
            className={`mt-2 h-12 w-full rounded-xl border bg-white px-5 text-sm text-stone-700 outline-none transition duration-200 focus:border-cocoa focus:shadow-glow ${formErrors.name ? 'border-red-400' : 'border-cocoa/10'}`}
            required
          />
          {formErrors.name && <span className="mt-1 block text-xs text-red-500">{formErrors.name}</span>}
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={`mt-2 h-12 w-full rounded-xl border bg-white px-5 text-sm text-stone-700 outline-none transition duration-200 focus:border-cocoa focus:shadow-glow ${formErrors.email ? 'border-red-400' : 'border-cocoa/10'}`}
            required
          />
          {formErrors.email && <span className="mt-1 block text-xs text-red-500">{formErrors.email}</span>}
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Message</span>
          <textarea
            name="message"
            rows="6"
            value={form.message}
            onChange={handleChange}
            className={`mt-2 w-full rounded-2xl border bg-white px-5 py-4 text-sm text-stone-700 outline-none transition duration-200 focus:border-cocoa focus:shadow-glow ${formErrors.message ? 'border-red-400' : 'border-cocoa/10'}`}
            required
          />
          {formErrors.message && <span className="mt-1 block text-xs text-red-500">{formErrors.message}</span>}
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
