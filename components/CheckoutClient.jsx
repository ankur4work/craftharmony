'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import ImageWithFallback from '@/components/ImageWithFallback';
import ScrollReveal from '@/components/ScrollReveal';

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
};

const INITIAL_ERRORS = {};

function validateCheckoutForm(form) {
  const errors = {};
  const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneRegex = /^\+?[\d\s()-]{7,15}$/;
  const postalRegex = /^[a-zA-Z0-9\s-]{3,10}$/;

  if (!form.firstName.trim()) errors.firstName = 'First name is required';
  else if (!nameRegex.test(form.firstName.trim())) errors.firstName = 'Enter a valid name (letters only)';

  if (!form.lastName.trim()) errors.lastName = 'Last name is required';
  else if (!nameRegex.test(form.lastName.trim())) errors.lastName = 'Enter a valid name (letters only)';

  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!emailRegex.test(form.email.trim())) errors.email = 'Enter a valid email address';

  if (!form.phone.trim()) errors.phone = 'Phone number is required';
  else if (!phoneRegex.test(form.phone.trim())) errors.phone = 'Enter a valid phone number (digits only, 7-15 characters)';

  if (!form.addressLine1.trim()) errors.addressLine1 = 'Address is required';
  else if (form.addressLine1.trim().length < 5) errors.addressLine1 = 'Address must be at least 5 characters';

  if (!form.city.trim()) errors.city = 'City is required';
  else if (!nameRegex.test(form.city.trim())) errors.city = 'Enter a valid city name';

  if (!form.state.trim()) errors.state = 'State is required';
  else if (!nameRegex.test(form.state.trim())) errors.state = 'Enter a valid state name';

  if (!form.postalCode.trim()) errors.postalCode = 'Postal code is required';
  else if (!postalRegex.test(form.postalCode.trim())) errors.postalCode = 'Enter a valid postal code';

  if (!form.country.trim()) errors.country = 'Country is required';
  else if (!nameRegex.test(form.country.trim())) errors.country = 'Enter a valid country name';

  return errors;
}

export default function CheckoutClient() {
  const { cartItems, totalPrice, clearCart, isHydrated } = useCart();
  const { placeOrder } = useOrders();
  const [formState, setFormState] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState(INITIAL_ERRORS);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((current) => { const next = { ...current }; delete next[name]; return next; });
    }
  };

  const handleFieldBlur = (event) => {
    const { name } = event.target;
    const errors = validateCheckoutForm(formState);
    if (errors[name]) {
      setFormErrors((current) => ({ ...current, [name]: errors[name] }));
    }
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    const errors = validateCheckoutForm(formState);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await placeOrder({
        customer: {
          firstName: formState.firstName.trim(),
          lastName: formState.lastName.trim(),
          email: formState.email.trim(),
          phone: formState.phone.trim(),
        },
        shippingAddress: {
          addressLine1: formState.addressLine1.trim(),
          addressLine2: formState.addressLine2.trim(),
          city: formState.city.trim(),
          state: formState.state.trim(),
          postalCode: formState.postalCode.trim(),
          country: formState.country.trim(),
        },
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || '',
          artisan: item.artisan,
        })),
        total: totalPrice,
      });

      setOrderPlaced(order);
      clearCart();
      setFormState(INITIAL_FORM);
      setFormErrors(INITIAL_ERRORS);
    } catch {
      setFormErrors({ submit: 'Failed to place order. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h1 className="mt-6 font-serif text-4xl text-cocoa">Order Confirmed</h1>
            <p className="mt-4 text-stone-500">Thank you! Your order has been placed successfully.</p>
            <p className="mt-3 text-sm text-stone-500">
              Order ID: <span className="font-semibold text-cocoa">{orderPlaced.id}</span>
            </p>
            <p className="mt-2 text-sm text-stone-400">
              Shipping to {orderPlaced.shippingAddress.city}, {orderPlaced.shippingAddress.country}
            </p>
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
        <h1 className="mt-3 font-serif text-4xl leading-none text-cocoa md:text-5xl">Place your order</h1>
        <p className="mt-4 max-w-2xl text-stone-500">
          Add your contact and shipping address to complete the order.
        </p>
      </ScrollReveal>

      <form onSubmit={handlePlaceOrder} className="mt-10 grid gap-6 lg:gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <ScrollReveal delay={100}>
          <div className="space-y-6">
            <div className="premium-panel p-6 md:p-8">
              <h2 className="font-serif text-2xl text-cocoa">Contact Information</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">First Name</span>
                  <input name="firstName" value={formState.firstName} onChange={handleFieldChange} onBlur={handleFieldBlur} type="text" autoComplete="given-name" required className={`mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa ${formErrors.firstName ? 'border-red-400 bg-red-50/30' : 'border-cocoa/10'}`} />
                  {formErrors.firstName && <span className="mt-1 block text-xs text-red-500">{formErrors.firstName}</span>}
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Last Name</span>
                  <input name="lastName" value={formState.lastName} onChange={handleFieldChange} onBlur={handleFieldBlur} type="text" autoComplete="family-name" required className={`mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa ${formErrors.lastName ? 'border-red-400 bg-red-50/30' : 'border-cocoa/10'}`} />
                  {formErrors.lastName && <span className="mt-1 block text-xs text-red-500">{formErrors.lastName}</span>}
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Email</span>
                  <input name="email" value={formState.email} onChange={handleFieldChange} onBlur={handleFieldBlur} type="email" autoComplete="email" required className={`mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa ${formErrors.email ? 'border-red-400 bg-red-50/30' : 'border-cocoa/10'}`} />
                  {formErrors.email && <span className="mt-1 block text-xs text-red-500">{formErrors.email}</span>}
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Phone</span>
                  <input name="phone" value={formState.phone} onChange={handleFieldChange} onBlur={handleFieldBlur} type="tel" autoComplete="tel" required className={`mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa ${formErrors.phone ? 'border-red-400 bg-red-50/30' : 'border-cocoa/10'}`} />
                  {formErrors.phone && <span className="mt-1 block text-xs text-red-500">{formErrors.phone}</span>}
                </label>
              </div>
            </div>

            <div className="premium-panel p-6 md:p-8">
              <h2 className="font-serif text-2xl text-cocoa">Shipping Address</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Address Line 1</span>
                  <input name="addressLine1" value={formState.addressLine1} onChange={handleFieldChange} onBlur={handleFieldBlur} type="text" autoComplete="address-line1" required className={`mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa ${formErrors.addressLine1 ? 'border-red-400 bg-red-50/30' : 'border-cocoa/10'}`} />
                  {formErrors.addressLine1 && <span className="mt-1 block text-xs text-red-500">{formErrors.addressLine1}</span>}
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Address Line 2</span>
                  <input name="addressLine2" value={formState.addressLine2} onChange={handleFieldChange} type="text" autoComplete="address-line2" className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">City</span>
                  <input name="city" value={formState.city} onChange={handleFieldChange} onBlur={handleFieldBlur} type="text" autoComplete="address-level2" required className={`mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa ${formErrors.city ? 'border-red-400 bg-red-50/30' : 'border-cocoa/10'}`} />
                  {formErrors.city && <span className="mt-1 block text-xs text-red-500">{formErrors.city}</span>}
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">State / Province</span>
                  <input name="state" value={formState.state} onChange={handleFieldChange} onBlur={handleFieldBlur} type="text" autoComplete="address-level1" required className={`mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa ${formErrors.state ? 'border-red-400 bg-red-50/30' : 'border-cocoa/10'}`} />
                  {formErrors.state && <span className="mt-1 block text-xs text-red-500">{formErrors.state}</span>}
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">ZIP / Postal Code</span>
                  <input name="postalCode" value={formState.postalCode} onChange={handleFieldChange} onBlur={handleFieldBlur} type="text" autoComplete="postal-code" required className={`mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa ${formErrors.postalCode ? 'border-red-400 bg-red-50/30' : 'border-cocoa/10'}`} />
                  {formErrors.postalCode && <span className="mt-1 block text-xs text-red-500">{formErrors.postalCode}</span>}
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Country</span>
                  <input name="country" value={formState.country} onChange={handleFieldChange} onBlur={handleFieldBlur} type="text" autoComplete="country-name" required className={`mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa ${formErrors.country ? 'border-red-400 bg-red-50/30' : 'border-cocoa/10'}`} />
                  {formErrors.country && <span className="mt-1 block text-xs text-red-500">{formErrors.country}</span>}
                </label>
              </div>
            </div>
          </div>
        </ScrollReveal>

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
                  <div className="min-w-0 flex-1">
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
            <button type="submit" className="button-primary mt-8 w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed" disabled={isSubmitting}>
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
            {Object.keys(formErrors).length > 0 && (
              <p className="mt-3 text-center text-xs text-red-500">Please fix the errors above before placing your order.</p>
            )}
          </div>
        </ScrollReveal>
      </form>
    </section>
  );
}
