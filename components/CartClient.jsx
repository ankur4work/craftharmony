'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import ImageWithFallback from '@/components/ImageWithFallback';
import ScrollReveal from '@/components/ScrollReveal';

export default function CartClient() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, isHydrated } = useCart();
  const { addToast } = useToast();

  const handleRemove = (item) => {
    removeFromCart(item.id);
    addToast(`${item.name} removed from cart`);
  };

  return (
    <section className="container-shell py-10 md:py-16">
      <ScrollReveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              <span className="inline-block h-px w-8 bg-terracotta" />
              Cart
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-none text-cocoa md:text-5xl">Your curated selection</h1>
          </div>
          <Link href="/products" className="button-secondary text-xs">Continue Shopping</Link>
        </div>
      </ScrollReveal>

      {!isHydrated ? (
        <div className="mt-10 premium-panel h-48 skeleton-shimmer" />
      ) : cartItems.length === 0 ? (
        <ScrollReveal>
          <div className="mt-10 premium-panel p-12 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-stone-300"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <h2 className="mt-5 font-serif text-3xl text-cocoa">Your cart is empty</h2>
            <p className="mt-3 text-stone-500">Add a few artisan-made pieces to begin your collection.</p>
            <Link href="/products" className="button-primary mt-8">Browse Products</Link>
          </div>
        </ScrollReveal>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {cartItems.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 80}>
                <div className="premium-panel flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:p-5">
                  <Link href={`/products/${item.id}`} className="zoom-container shrink-0 overflow-hidden rounded-2xl">
                    <ImageWithFallback src={item.images[0]} alt={item.name} className="h-28 w-full object-cover sm:h-28 sm:w-32" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400">{item.category}</p>
                    <Link href={`/products/${item.id}`}>
                      <h2 className="mt-1 font-serif text-2xl leading-tight text-cocoa transition hover:text-terracotta">{item.name}</h2>
                    </Link>
                    <p className="mt-1 text-xs text-stone-400">{item.artisan} · {item.material}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-full border border-cocoa/10 bg-white">
                        <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-cocoa transition hover:bg-sand" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                        <span className="min-w-[2rem] text-center text-sm font-medium text-cocoa">{item.quantity}</span>
                        <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-cocoa transition hover:bg-sand" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <button type="button" className="text-xs font-medium text-stone-400 underline-offset-4 transition hover:text-cocoa hover:underline" onClick={() => handleRemove(item)}>Remove</button>
                    </div>
                  </div>
                  <div className="font-serif text-2xl text-cocoa sm:text-3xl">${item.price * item.quantity}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={200}>
            <div className="premium-panel h-fit p-8 lg:sticky lg:top-28">
              <h2 className="font-serif text-3xl text-cocoa">Order Summary</h2>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between text-stone-500">
                  <span>Subtotal ({cartItems.reduce((t, i) => t + i.quantity, 0)} items)</span>
                  <span className="font-medium text-cocoa">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-stone-500">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex items-center justify-between text-stone-500">
                  <span>Taxes</span>
                  <span>Applied where relevant</span>
                </div>
              </div>
              <div className="mt-6 border-t border-cocoa/8 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Total</span>
                  <span className="font-serif text-3xl text-cocoa">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/checkout" className="button-primary mt-8 w-full justify-center">Proceed to Checkout</Link>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {['Secure Checkout', 'Free Returns', 'Handmade Quality'].map((badge) => (
                  <span key={badge} className="flex items-center gap-1 text-[10px] uppercase tracking-[0.1em] text-stone-400">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-forest"><polyline points="20 6 9 17 4 12"/></svg>
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      )}
    </section>
  );
}
