'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 600);
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-forest/10 px-6 py-4">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-forest"><polyline points="20 6 9 17 4 12"/></svg>
        <p className="text-sm font-medium text-forest">You're subscribed! Welcome to the artisan journal.</p>
      </div>
    );
  }

  return (
    <div>
      <form className="flex flex-col gap-4 sm:flex-row" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          placeholder="Enter your email"
          className={`h-14 flex-1 rounded-full border bg-white px-6 text-stone-700 outline-none transition duration-200 focus:border-cocoa focus:shadow-glow ${error ? 'border-red-400' : 'border-cocoa/10'}`}
          required
        />
        <button type="submit" className="button-primary shrink-0 whitespace-nowrap" disabled={status === 'loading'}>
          {status === 'loading' ? 'Subscribing...' : 'Join Newsletter'}
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
