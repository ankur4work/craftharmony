'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import ImageWithFallback from '@/components/ImageWithFallback';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const wishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock < 1;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      addToast(`${product.name} is currently out of stock`, 'error');
      return;
    }

    addToCart(product);
    addToast(`${product.name} added to cart`);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    addToast(wishlisted ? `Removed from wishlist` : `${product.name} saved to wishlist`);
  };

  return (
    <div className="group glass-card flex h-full flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft-lg">
      <Link href={`/products/${product.id}`} className="zoom-container relative block">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          className="h-72 w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-cocoa backdrop-blur-sm">
          {product.category}
        </span>
        {product.isNew && (
          <span className="absolute left-4 top-4 rounded-full bg-terracotta px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-sm">
            New
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute right-4 top-4 rounded-full bg-cocoa px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-sm">
            Out of Stock
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/products/${product.id}`} className="block font-serif text-2xl leading-tight text-cocoa transition hover:text-terracotta">
            {product.name}
          </Link>
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition duration-200 ${wishlisted ? 'border-terracotta/30 bg-terracotta/10 text-terracotta' : 'border-cocoa/10 text-stone-400 hover:bg-sand hover:text-cocoa'}`}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
        <p className="mt-3 text-sm leading-7 text-stone-500">{product.shortDescription}</p>
        <div className="mt-4 flex items-center gap-3 text-xs text-stone-400">
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {product.artisan}
          </span>
          <span className="h-3 w-px bg-stone-300" />
          <span>{product.material}</span>
        </div>
        <div className="mt-auto pt-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-serif text-3xl text-cocoa">${product.price}</span>
            <span className="flex items-center gap-1 rounded-full bg-sand px-3 py-1 text-xs font-semibold text-cocoa">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-terracotta"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              {product.rating}
            </span>
          </div>
          <div className="mb-3 text-xs uppercase tracking-[0.16em] text-stone-400">
            {isOutOfStock ? 'Currently unavailable' : `${product.stock} ready to ship`}
          </div>
          <button type="button" className="button-primary w-full text-xs disabled:cursor-not-allowed disabled:opacity-60" onClick={handleAddToCart} disabled={isOutOfStock}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
