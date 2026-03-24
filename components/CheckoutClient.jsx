'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ImageWithFallback from '@/components/ImageWithFallback';
import ScrollReveal from '@/components/ScrollReveal';

export default function CheckoutClient() {
  const { cartItems, totalPrice, clearCart, isHydrated } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  if (!isHydrated) {
    return (
      <section className="container-shell py-16">
        <div className="premium-panel h-64 skeleton-shimmer" />
      </section>
    );
  }

  if (orderPlaced) {
    return (
      <section className="container-shell py-16">
        <ScrollReveal>
          <div className="premium-panel mx-auto max-w-2xl p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h1 className="mt-6 font-serif text-4xl text-cocoa">Order Confirmed</h1>
            <p className="mt-4 text-stone-500">Thank you for supporting artisan craftsmanship. Your order is being prepared with care.</p>
            <p className="mt-2 text-sm text-stone-400">This is a demo — no real payment was processed.</p>
            <Link href="/products" className="button-primary mt-8">Continue Shopping</Link>
          </div>
        </ScrollReveal>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="container-shell py-16">
        <div className="premium-panel mx-auto max-w-2xl p-12 text-center">
          <h1 className="font-serif text-4xl text-cocoa">Nothing to checkout</h1>
          <p className="mt-4 text-stone-500">Your cart is empty. Add some handcrafted pieces first.</p>
          <Link href="/products" className="button-primary mt-8">Browse Products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-shell py-10 md:py-16">
      <ScrollReveal>
        <p className="eyebrow">
          <span className="inline-block h-px w-8 bg-terracotta" />
          Checkout
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-none text-cocoa md:text-5xl">Complete your order</h1>
      </ScrollReveal>

      <form onSubmit={handlePlaceOrder} className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Form */}
        <ScrollReveal delay={100}>
          <div className="space-y-6">
            {/* Contact */}
            <div className="premium-panel p-6 md:p-8">
              <h2 className="font-serif text-2xl text-cocoa">Contact Information</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">First Name</span>
                  <input type="text" required className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Last Name</span>
                  <input type="text" required className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Email</span>
                  <input type="email" required className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Phone</span>
                  <input type="tel" className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
                </label>
              </div>
            </div>

            {/* Shipping */}
            <div className="premium-panel p-6 md:p-8">
              <h2 className="font-serif text-2xl text-cocoa">Shipping Address</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Address</span>
                  <input type="text" required className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">City</span>
                  <input type="text" required className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">State / Province</span>
                  <input type="text" className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">ZIP / Postal Code</span>
                  <input type="text" required className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Country</span>
                  <input type="text" required className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
                </label>
              </div>
            </div>

            {/* Payment (demo) */}
            <div className="premium-panel p-6 md:p-8">
              <h2 className="font-serif text-2xl text-cocoa">Payment</h2>
              <p className="mt-2 text-xs text-stone-400">Demo only — no real payment will be processed.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Card Number</span>
                  <input type="text" placeholder="4242 4242 4242 4242" className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Expiry</span>
                  <input type="text" placeholder="MM/YY" className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">CVC</span>
                  <input type="text" placeholder="123" className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
                </label>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Order Summary Sidebar */}
        <ScrollReveal delay={200}>
          <div className="premium-panel h-fit p-8 lg:sticky lg:top-28">
            <h2 className="font-serif text-2xl text-cocoa">Order Summary</h2>
            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <ImageWithFallback src={item.images[0]} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-cocoa text-[10px] font-bold text-white">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-cocoa">{item.name}</p>
                    <p className="text-xs text-stone-400">{item.artisan}</p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-cocoa">${item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 border-t border-cocoa/8 pt-6 text-sm">
              <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
              <div className="flex justify-between text-stone-500"><span>Shipping</span><span>Free</span></div>
              <div className="flex justify-between text-stone-500"><span>Tax</span><span>$0.00</span></div>
            </div>
            <div className="mt-4 border-t border-cocoa/8 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Total</span>
                <span className="font-serif text-3xl text-cocoa">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button type="submit" className="button-primary mt-8 w-full justify-center">Place Order</button>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {['Secure', 'Encrypted', 'Protected'].map((badge) => (
                <span key={badge} className="flex items-center gap-1 text-[10px] uppercase tracking-[0.1em] text-stone-400">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-forest"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </form>
    </section>
  );
}
