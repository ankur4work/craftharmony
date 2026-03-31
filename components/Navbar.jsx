'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import NavLinkItem from '@/components/NavLinkItem';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/products' },
  { label: 'Orders', path: '/orders' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const policyItems = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Refund Policy', path: '/refund-policy' },
  { label: 'Terms & Conditions', path: '/terms-and-conditions' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartLabel = useMemo(() => (cartCount > 9 ? '9+' : cartCount), [cartCount]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`sticky top-0 z-50 px-3 pt-3 transition-all duration-300 sm:px-4 ${scrolled ? 'pt-2' : ''}`}>
      <div className="container-shell">
        <div className={`rounded-[2rem] border border-cocoa/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,248,241,0.88))] shadow-soft backdrop-blur-xl transition-all duration-300 ${scrolled ? 'shadow-soft-lg' : ''}`}>
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-6">
            <Link href="/" className="min-w-0 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cocoa/10 bg-cocoa font-serif text-lg text-white shadow-sm">C</div>
              <div className="min-w-0">
                <p className="truncate font-serif text-xl leading-none text-cocoa sm:text-2xl">CraftHarmony</p>
                <p className="mt-1 hidden text-[10px] uppercase tracking-[0.28em] text-stone-400 sm:block">curated craft objects from india</p>
              </div>
            </Link>

            <div className="hidden flex-1 items-center justify-center xl:flex">
              <nav className="flex items-center gap-2 rounded-full border border-cocoa/8 bg-white/70 p-1.5">
                {navItems.map((item) => (
                  <NavLinkItem key={item.path} href={item.path}>{item.label}</NavLinkItem>
                ))}
                <div className="relative" onMouseEnter={() => setShowPolicies(true)} onMouseLeave={() => setShowPolicies(false)}>
                  <button
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${policyItems.some((item) => item.path === pathname) ? 'bg-cocoa text-white shadow-sm' : 'text-stone-600 hover:bg-sand/70 hover:text-cocoa'}`}
                  >
                    Policies
                  </button>
                  {showPolicies && (
                    <div className="absolute right-0 top-12 w-64 rounded-2xl border border-cocoa/10 bg-white p-2 shadow-soft-lg">
                      {policyItems.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`block rounded-xl px-4 py-2.5 text-sm transition ${pathname === item.path ? 'bg-sand text-cocoa font-medium' : 'text-stone-600 hover:bg-sand/60 hover:text-cocoa'}`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </nav>
            </div>

            <div className="hidden items-center gap-2 xl:flex">
              <Link
                href="/wishlist"
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-cocoa/10 bg-white text-cocoa transition duration-200 hover:bg-sand"
                aria-label="Wishlist"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="button-primary px-5 py-2.5 text-xs normal-case tracking-wide">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                Cart
                {cartCount > 0 && <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">{cartLabel}</span>}
              </Link>
            </div>

            <div className="flex items-center gap-2 xl:hidden">
              <Link
                href="/wishlist"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cocoa/10 bg-white text-cocoa transition hover:bg-sand"
                aria-label="Wishlist"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-terracotta text-[9px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cocoa/10 bg-white text-cocoa transition hover:bg-sand"
                aria-label="Cart"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-cocoa text-[9px] font-bold text-white">
                    {cartLabel}
                  </span>
                )}
              </Link>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-cocoa/10 bg-white px-3.5 py-2 text-sm font-medium text-cocoa transition hover:bg-sand"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Toggle navigation"
              >
                <div className="flex w-4 flex-col gap-1">
                  <span className={`block h-0.5 w-full rounded bg-cocoa transition-all duration-300 ${isOpen ? 'translate-y-[3px] rotate-45' : ''}`} />
                  <span className={`block h-0.5 w-full rounded bg-cocoa transition-all duration-300 ${isOpen ? '-translate-y-[3px] -rotate-45' : ''}`} />
                </div>
                <span>{isOpen ? 'Close' : 'Menu'}</span>
              </button>
            </div>
          </div>

          <div className={`overflow-hidden transition-all duration-300 xl:hidden ${isOpen ? 'max-h-[720px] border-t border-cocoa/8 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-4 px-4 py-4 sm:px-5">
              <div className="rounded-[1.6rem] bg-[linear-gradient(135deg,rgba(255,250,245,0.95),rgba(232,214,200,0.68))] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-stone-400">Curated Craft</p>
                <h2 className="mt-2 font-serif text-3xl leading-none text-cocoa">Objects with history, scaled for modern living.</h2>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${pathname === item.path ? 'bg-cocoa text-white shadow-sm' : 'border border-cocoa/8 bg-white/80 text-stone-600 hover:bg-sand/60 hover:text-cocoa'}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="rounded-[1.5rem] border border-cocoa/8 bg-white/70 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400">Policies</p>
                <div className="mt-3 flex flex-col gap-2">
                  {policyItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`rounded-xl px-3 py-2.5 text-sm transition ${pathname === item.path ? 'bg-sand text-cocoa font-medium' : 'text-stone-500 hover:bg-sand/60 hover:text-cocoa'}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/cart" className="button-primary w-full justify-center text-xs normal-case tracking-wide">
                View Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
