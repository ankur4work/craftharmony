'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/components/ImageWithFallback';
import ScrollReveal from '@/components/ScrollReveal';

const STATUS_STEPS = ['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

function getStatusIndex(status) {
  const idx = STATUS_STEPS.indexOf(status);
  return idx === -1 ? 0 : idx;
}

function formatTimestamp(value) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return '';
  }
}

function StatusTracker({ status }) {
  const currentIndex = getStatusIndex(status);
  const isCancelled = status === 'Cancelled';

  if (isCancelled) {
    return (
      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 text-sm font-bold">✕</div>
        <div>
          <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
          <p className="text-xs text-red-500">This order has been cancelled. Contact support for help.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        {STATUS_STEPS.map((step, i) => {
          const isCompleted = i <= currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={step} className="flex flex-1 flex-col items-center">
              <div className="relative flex w-full items-center">
                {i > 0 && (
                  <div className={`absolute left-0 right-1/2 top-1/2 h-0.5 -translate-y-1/2 ${i <= currentIndex ? 'bg-forest' : 'bg-stone-200'}`} />
                )}
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`absolute left-1/2 right-0 top-1/2 h-0.5 -translate-y-1/2 ${i < currentIndex ? 'bg-forest' : 'bg-stone-200'}`} />
                )}
                <div className={`relative z-10 mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-forest text-white shadow-sm'
                    : 'border-2 border-stone-200 bg-white text-stone-400'
                } ${isCurrent ? 'ring-4 ring-forest/20' : ''}`}>
                  {isCompleted ? '✓' : i + 1}
                </div>
              </div>
              <p className={`mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.1em] sm:text-xs ${isCompleted ? 'text-forest' : 'text-stone-400'}`}>
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrderTrackingClient() {
  const [searchValue, setSearchValue] = useState('');
  const [orders, setOrders] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async (e) => {
    e.preventDefault();
    const value = searchValue.trim();
    if (!value) { setError('Please enter an email or order ID'); return; }

    const isOrderId = value.toUpperCase().startsWith('CH-');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!isOrderId && !emailRegex.test(value)) {
      setError('Please enter a valid email address or order ID (e.g. CH-XXXXXXXX-XXXX)');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const param = isOrderId
        ? `orderId=${encodeURIComponent(value)}`
        : `email=${encodeURIComponent(value)}`;
      const res = await fetch(`/api/orders?${param}`, { cache: 'no-store' });
      if (!res.ok) {
        setError('Could not fetch orders. Please try again.');
        return;
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container-shell py-10 md:py-16">
      <ScrollReveal>
        <p className="eyebrow">
          <span className="inline-block h-px w-8 bg-terracotta" />
          Order Tracking
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-none text-cocoa md:text-5xl">Track your orders</h1>
        <p className="mt-4 max-w-2xl text-stone-500">
          Enter your email address or order ID (e.g. CH-XXXXXXXX-XXXX) to view your order history and track delivery status.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <form onSubmit={handleLookup} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex-1">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => { setSearchValue(e.target.value); setError(''); }}
              placeholder="Enter email address or order ID"
              required
              className={`h-14 w-full rounded-2xl border bg-white/80 px-6 text-sm text-stone-700 shadow-soft outline-none transition focus:border-cocoa focus:shadow-glow ${error ? 'border-red-400' : 'border-cocoa/10'}`}
            />
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          </div>
          <button type="submit" className="button-primary shrink-0" disabled={isLoading}>
            {isLoading ? 'Looking up...' : 'Track Orders'}
          </button>
        </form>
      </ScrollReveal>

      {orders !== null && (
        <div className="mt-10">
          {orders.length === 0 ? (
            <ScrollReveal>
              <div className="premium-panel p-12 text-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-stone-300"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
                <h2 className="mt-5 font-serif text-3xl text-cocoa">No orders found</h2>
                <p className="mt-3 text-stone-500">We couldn't find any orders with this email. Check the spelling or try a different email.</p>
                <Link href="/products" className="button-primary mt-8">Start Shopping</Link>
              </div>
            </ScrollReveal>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-stone-500">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
              {orders.map((order, i) => (
                <ScrollReveal key={order.id} delay={i * 80}>
                  <div className="premium-panel overflow-hidden">
                    <div className="border-b border-cocoa/8 bg-sand/30 px-6 py-4 sm:px-8">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Order ID</p>
                          <p className="mt-1 font-serif text-2xl text-cocoa">{order.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Placed on</p>
                          <p className="mt-1 text-sm text-cocoa">{formatTimestamp(order.placedAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Total</p>
                          <p className="mt-1 font-serif text-2xl text-cocoa">${Number(order.total).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-6 sm:px-8">
                      <StatusTracker status={order.status} />

                      {order.trackingNumber && (
                        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-cocoa/8 bg-sand/30 p-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cocoa/10 text-cocoa">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Tracking Number</p>
                            <p className="mt-1 font-mono text-sm font-semibold text-cocoa">{order.trackingNumber}</p>
                          </div>
                        </div>
                      )}

                      <div className="mt-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Items</p>
                        <div className="mt-3 space-y-3">
                          {order.items.map((item) => (
                            <div key={`${order.id}-${item.id}`} className="flex items-center gap-4 rounded-2xl border border-cocoa/8 bg-sand/20 p-3">
                              <ImageWithFallback src={item.image || '/images/placeholder-craft.svg'} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
                              <div className="min-w-0 flex-1">
                                <Link href={`/products/${item.id}`} className="truncate text-sm font-medium text-cocoa transition hover:text-terracotta">{item.name}</Link>
                                <p className="text-xs text-stone-400">{item.artisan}</p>
                              </div>
                              <div className="text-right text-sm">
                                <p className="text-stone-500">Qty {item.quantity}</p>
                                <p className="font-semibold text-cocoa">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-cocoa/8 bg-sand/20 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Shipping Address</p>
                          <p className="mt-2 text-sm text-cocoa">
                            {order.shippingAddress.addressLine1}
                            {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                          </p>
                          <p className="text-sm text-stone-500">
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                          </p>
                          <p className="text-sm text-stone-500">{order.shippingAddress.country}</p>
                        </div>
                        <div className="rounded-2xl border border-cocoa/8 bg-sand/20 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Contact</p>
                          <p className="mt-2 text-sm text-cocoa">{order.customer.firstName} {order.customer.lastName}</p>
                          <p className="text-sm text-stone-500">{order.customer.email}</p>
                          <p className="text-sm text-stone-500">{order.customer.phone}</p>
                        </div>
                      </div>

                      {order.updatedAt && order.updatedAt !== order.placedAt && (
                        <p className="mt-4 text-xs text-stone-400">Last updated: {formatTimestamp(order.updatedAt)}</p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
