'use client';

import Link from 'next/link';
import { useInventory } from '@/context/InventoryContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';

export default function WishlistClient() {
  const { wishlistItems, isHydrated } = useWishlist();
  const { products } = useInventory();
  const wishlistProducts = products.filter((p) => wishlistItems.includes(p.id));

  return (
    <section className="container-shell py-10 md:py-16">
      <ScrollReveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              <span className="inline-block h-px w-8 bg-terracotta" />
              Wishlist
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-none text-cocoa md:text-5xl">Your saved pieces</h1>
          </div>
          <Link href="/products" className="button-secondary text-xs">Continue Shopping</Link>
        </div>
      </ScrollReveal>

      {!isHydrated ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card h-[520px] skeleton-shimmer" />
          ))}
        </div>
      ) : wishlistProducts.length === 0 ? (
        <ScrollReveal>
          <div className="mt-10 premium-panel p-12 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-stone-300"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <h2 className="mt-5 font-serif text-3xl text-cocoa">No saved pieces yet</h2>
            <p className="mt-3 text-stone-500">Browse our collection and save pieces that speak to you.</p>
            <Link href="/products" className="button-primary mt-8">Browse Products</Link>
          </div>
        </ScrollReveal>
      ) : (
        <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {wishlistProducts.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 80}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}
