'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.error || 'Could not sign in');
        return;
      }

      window.location.href = searchParams.get('next') || '/admin';
    } catch {
      setError('Could not sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container-shell py-12 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-[2.5rem] bg-cocoa px-8 py-10 text-white shadow-soft-lg md:px-10 md:py-12">
          <p className="eyebrow text-white/60">
            <span className="inline-block h-px w-8 bg-terracotta" />
            Private Access
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-[0.92] md:text-6xl">CraftHarmony Admin Suite</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/75">
            Sign in to manage inventory, review customer orders, and keep the storefront polished without exposing admin tools to public visitors.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ['Inventory', 'Edit products, pricing, stock, and imagery'],
              ['Orders', 'Track placed orders and shipping details'],
              ['Protected', 'Credential-protected access for catalog operations'],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[1.75rem] border border-white/10 bg-white/8 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-white/65">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="premium-panel p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Admin Login</p>
          <h2 className="mt-3 font-serif text-4xl text-cocoa md:text-5xl">Sign in to continue</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-stone-500">
            Use your admin credentials to access inventory controls, order management, and catalog operations.
          </p>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Username</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                type="text"
                required
                className="mt-2 h-12 w-full rounded-2xl border border-cocoa/10 bg-white px-4 text-sm text-cocoa outline-none transition focus:border-cocoa"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Password</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                required
                className="mt-2 h-12 w-full rounded-2xl border border-cocoa/10 bg-white px-4 text-sm text-cocoa outline-none transition focus:border-cocoa"
              />
            </label>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-terracotta/20 bg-terracotta/8 px-4 py-3 text-sm text-terracotta">
              {error}
            </div>
          )}

          <button type="submit" className="button-primary mt-8 w-full justify-center" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In...' : 'Enter Admin Panel'}
          </button>
        </form>
      </div>
    </section>
  );
}
