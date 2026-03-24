'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import NavLinkItem from '@/components/NavLinkItem';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/products' },
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
  const menuRef = useRef(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`sticky top-0 z-50 px-3 pt-3 transition-all duration-300 sm:px-4 ${scrolled ? 'pt-2' : ''}`}>
      <div className="container-shell">
        <div className={`premium-panel relative flex items-center justify-between px-5 py-3.5 transition-all duration-300 sm:px-6 ${scrolled ? 'bg-white/90 shadow-soft-lg' : ''}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cocoa/10 bg-cocoa font-serif text-lg text-white">C</div>
            <div>
              <p className="font-serif text-2xl leading-none text-cocoa">CraftHarmony</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.3em] text-stone-400">craftharmony.art</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <NavLinkItem key={item.path} href={item.path}>{item.label}</NavLinkItem>
            ))}
            <div className="relative" onMouseEnter={() => setShowPolicies(true)} onMouseLeave={() => setShowPolicies(false)}>
              <button
                type="button"
                className={`text-sm font-medium transition duration-200 ${policyItems.some((item) => item.path === pathname) ? 'text-cocoa' : 'text-stone-500 hover:text-cocoa'}`}
              >
                Policies
              </button>
              {showPolicies && (
                <div className="absolute right-0 top-8 w-64 animate-slide-down rounded-2xl border border-cocoa/10 bg-white p-2 shadow-soft">
                  {policyItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`block rounded-xl px-4 py-2.5 text-sm transition duration-200 ${pathname === item.path ? 'bg-sand text-cocoa font-medium' : 'text-stone-600 hover:bg-sand/60 hover:text-cocoa'}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/wishlist"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-cocoa/10 bg-white text-cocoa transition duration-200 hover:bg-sand"
              aria-label="Wishlist"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-[10px] font-bold text-white">{wishlistCount}</span>
              )}
            </Link>
            <Link href="/cart" className="button-primary px-5 py-2.5 text-xs normal-case tracking-wide">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Cart
              {cartCount > 0 && <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">{cartLabel}</span>}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-cocoa/10 bg-white px-4 py-2.5 text-sm font-medium text-cocoa transition hover:bg-sand lg:hidden"
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

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`overflow-hidden transition-all duration-400 ease-in-out lg:hidden ${isOpen ? 'mt-3 max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="premium-panel p-4">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition duration-200 ${pathname === item.path ? 'bg-sand text-cocoa' : 'text-stone-600 hover:bg-sand/60'}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-cocoa/8 p-3">
              <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400">Policies</p>
              <div className="mt-2 flex flex-col gap-1">
                {policyItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`rounded-lg px-3 py-2 text-sm transition duration-200 ${pathname === item.path ? 'bg-sand text-cocoa font-medium' : 'text-stone-500 hover:bg-sand/60 hover:text-cocoa'}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Link href="/wishlist" className="flex h-12 w-12 items-center justify-center rounded-full border border-cocoa/10 bg-white text-cocoa transition hover:bg-sand">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </Link>
              <Link href="/cart" className="button-primary flex-1 justify-center text-center text-xs normal-case tracking-wide">
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
