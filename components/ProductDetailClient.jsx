'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ImageWithFallback from '@/components/ImageWithFallback';
import ScrollReveal from '@/components/ScrollReveal';
import { useCart } from '@/context/CartContext';
import { useInventory } from '@/context/InventoryContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

export default function ProductDetailClient({ productId }) {
  const router = useRouter();
  const { isHydrated, products } = useInventory();
  const product = useMemo(() => products.find((item) => item.id === productId), [productId, products]);
  const [activeImage, setActiveImage] = useState(product?.images?.[0] || '');
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const imgRef = useRef(null);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const relatedProducts = useMemo(
    () => products.filter((item) => item.id !== productId && item.category === product?.category).slice(0, 4),
    [product, productId, products]
  );

  useEffect(() => {
    if (product?.images?.length) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  if (!product && !isHydrated) {
    return (
      <section className="container-shell py-16">
        <div className="premium-panel mx-auto h-[680px] max-w-6xl skeleton-shimmer" />
      </section>
    );
  }

  if (!product) {
    return (
      <section className="container-shell py-16">
        <div className="premium-panel mx-auto max-w-2xl p-12 text-center">
          <h1 className="font-serif text-5xl text-cocoa">Product not found</h1>
          <p className="mt-4 text-stone-500">The piece you are looking for may no longer be available.</p>
          <Link href="/products" className="button-primary mt-8">Return to Shop</Link>
        </div>
      </section>
    );
  }

  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (product.stock < 1) {
      addToast(`${product.name} is currently out of stock`, 'error');
      return;
    }

    addToCart(product);
    addToast(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (product.stock < 1) {
      addToast(`${product.name} is currently out of stock`, 'error');
      return;
    }

    addToCart(product);
    router.push('/cart');
  };

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <>
      <section className="container-shell py-10 md:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-stone-400">
          <Link href="/" className="transition hover:text-cocoa">Home</Link>
          <span>/</span>
          <Link href="/products" className="transition hover:text-cocoa">Shop</Link>
          <span>/</span>
          <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="transition hover:text-cocoa">{product.category}</Link>
          <span>/</span>
          <span className="text-cocoa">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Image Gallery */}
          <ScrollReveal>
            <div className="space-y-4">
              <div
                ref={imgRef}
                className="group relative cursor-zoom-in overflow-hidden rounded-[2rem] bg-white shadow-soft"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
              >
                <ImageWithFallback
                  src={activeImage}
                  alt={product.name}
                  className="h-[320px] w-full object-cover transition duration-500 sm:h-[500px] md:h-[580px]"
                  style={isZooming ? { transform: 'scale(1.6)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
                />
                <div className={`pointer-events-none absolute inset-0 bg-black/5 transition duration-300 ${isZooming ? 'opacity-100' : 'opacity-0'}`} />
                {/* Zoom indicator */}
                <div className={`pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs text-stone-500 backdrop-blur transition-opacity duration-300 ${isZooming ? 'opacity-0' : 'opacity-100'}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
                  Hover to zoom
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    className={`overflow-hidden rounded-2xl border-2 transition-all duration-200 ${activeImage === image ? 'border-cocoa shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <ImageWithFallback src={image} alt={`${product.name} view ${index + 1}`} className="h-28 w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Product Info */}
          <ScrollReveal delay={150}>
            <div className="premium-panel h-fit p-8 md:p-10 lg:sticky lg:top-28">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">{product.category}</p>
                  <h1 className="mt-3 font-serif text-4xl leading-tight text-cocoa md:text-5xl">{product.name}</h1>
                </div>
                <button
                  type="button"
                  onClick={() => { toggleWishlist(product.id); addToast(wishlisted ? 'Removed from wishlist' : `${product.name} saved to wishlist`); }}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition duration-200 ${wishlisted ? 'border-terracotta/30 bg-terracotta/10 text-terracotta' : 'border-cocoa/10 text-stone-400 hover:bg-sand hover:text-cocoa'}`}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="font-serif text-4xl text-cocoa">${product.price}</span>
                <span className="flex items-center gap-1 rounded-full bg-sand px-3 py-1.5 text-xs font-semibold text-cocoa">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-terracotta"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  {product.rating}
                </span>
                <span className="rounded-full border border-cocoa/10 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-stone-500">{product.material}</span>
                <span className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] ${product.stock > 5 ? 'bg-forest/10 text-forest' : product.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-terracotta/10 text-terracotta'}`}>
                  {product.stock > 5 ? 'In stock' : product.stock > 0 ? 'Low stock' : 'Out of stock'}
                </span>
              </div>

              <p className="mt-6 text-base leading-8 text-stone-600">{product.description}</p>

              <div className="mt-6 rounded-2xl bg-sand/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">The Story Behind</p>
                <p className="mt-2 text-sm leading-7 text-stone-600">{product.story}</p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" className="button-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60" onClick={handleAddToCart} disabled={product.stock < 1}>Add to Cart</button>
                <button type="button" className="button-secondary flex-1 disabled:cursor-not-allowed disabled:opacity-60" onClick={handleBuyNow} disabled={product.stock < 1}>Buy Now</button>
              </div>

              {/* Artisan Info */}
              <div className="mt-8 grid gap-5 border-t border-cocoa/8 pt-7 sm:grid-cols-2">
                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Made by Artisan
                  </p>
                  <p className="mt-2 font-medium text-cocoa">{product.artisan}</p>
                  <p className="text-sm text-stone-500">{product.origin}</p>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                    Details
                  </p>
                  <p className="mt-2 text-sm text-stone-600">{product.dimensions}</p>
                  <p className="text-sm text-stone-500">Small-batch handcrafted finish</p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 flex flex-wrap gap-3">
                {['Handmade', 'Ethically Sourced', 'Secure Checkout', 'Free Returns'].map((badge) => (
                  <span key={badge} className="flex items-center gap-1.5 rounded-full border border-cocoa/8 px-3 py-1.5 text-xs text-stone-500">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-forest"><polyline points="20 6 9 17 4 12"/></svg>
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-[#f4ece5] py-16">
          <div className="container-shell">
            <ScrollReveal>
              <div className="max-w-3xl">
                <p className="eyebrow">Related Products</p>
                <h2 className="mt-3 font-serif text-4xl leading-none text-cocoa md:text-5xl">More from this craft story</h2>
              </div>
            </ScrollReveal>
            <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 100}>
                  <ProductCard product={item} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
