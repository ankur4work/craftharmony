'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import SectionHeader from '@/components/SectionHeader';
import ScrollReveal from '@/components/ScrollReveal';
import { categories, materials, products } from '@/data/products';

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedMaterial, setSelectedMaterial] = useState('All Materials');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  useEffect(() => {
    setStatus('loading');
    const timer = setTimeout(() => setStatus('ready'), 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedMaterial, selectedPrice, searchQuery, sortBy]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
      const materialMatch = selectedMaterial === 'All Materials' || product.material === selectedMaterial;
      const priceMatch =
        selectedPrice === 'all' ||
        (selectedPrice === 'under75' && product.price < 75) ||
        (selectedPrice === '75to150' && product.price >= 75 && product.price <= 150) ||
        (selectedPrice === '150to300' && product.price > 150 && product.price <= 300) ||
        (selectedPrice === '300plus' && product.price > 300);
      const searchMatch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.artisan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.material.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && materialMatch && priceMatch && searchMatch;
    });

    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [selectedCategory, selectedMaterial, selectedPrice, searchQuery, sortBy]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'All') params.delete('category');
    else params.set('category', category);
    const query = params.toString();
    router.replace(query ? `/products?${query}` : '/products');
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedMaterial('All Materials');
    setSelectedPrice('all');
    setSearchQuery('');
    setSortBy('default');
    router.replace('/products');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedMaterial !== 'All Materials' || selectedPrice !== 'all' || searchQuery;

  return (
    <section className="container-shell py-10 md:py-16">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Shop"
          title="A premium edit of handcrafted pieces"
          description="Filter by category, material, and price to discover objects that feel rare, tactile, and intentionally made."
        />
      </ScrollReveal>

      {/* Search + Filters */}
      <ScrollReveal delay={100}>
        <div className="mt-10 space-y-5">
          {/* Search Bar */}
          <div className="relative">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, artisan, or material..."
              className="h-14 w-full rounded-2xl border border-cocoa/10 bg-white/80 pl-12 pr-6 text-sm text-stone-700 shadow-soft outline-none transition duration-200 focus:border-cocoa focus:shadow-glow"
            />
          </div>

          {/* Filter Row */}
          <div className="grid gap-4 rounded-2xl border border-cocoa/10 bg-white/70 p-5 shadow-soft md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition duration-200 ${selectedCategory === category ? 'bg-cocoa text-white shadow-sm' : 'bg-sand/60 text-cocoa hover:bg-sand'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Material
                <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)} className="mt-2.5 h-10 w-full rounded-xl border border-cocoa/10 bg-white px-3 text-sm text-cocoa outline-none transition focus:border-cocoa">
                  {materials.map((material) => <option key={material}>{material}</option>)}
                </select>
              </label>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Price
                <select value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)} className="mt-2.5 h-10 w-full rounded-xl border border-cocoa/10 bg-white px-3 text-sm text-cocoa outline-none transition focus:border-cocoa">
                  <option value="all">All Prices</option>
                  <option value="under75">Under $75</option>
                  <option value="75to150">$75 – $150</option>
                  <option value="150to300">$150 – $300</option>
                  <option value="300plus">$300+</option>
                </select>
              </label>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Sort By
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="mt-2.5 h-10 w-full rounded-xl border border-cocoa/10 bg-white px-3 text-sm text-cocoa outline-none transition focus:border-cocoa">
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name">Name A–Z</option>
                </select>
              </label>
            </div>
          </div>

          {/* Active Filters Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-stone-400">{filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}</span>
              <button type="button" onClick={clearFilters} className="rounded-full border border-cocoa/10 px-3 py-1 text-xs font-medium text-cocoa transition hover:bg-sand">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Products Grid */}
      {status === 'loading' ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="glass-card h-[520px] skeleton-shimmer" />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.length ? (
            filteredProducts.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 60}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))
          ) : (
            <div className="premium-panel col-span-full p-12 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-stone-300"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <h3 className="mt-5 font-serif text-3xl text-cocoa">No pieces matched your filters</h3>
              <p className="mt-3 text-stone-500">Try another category, material, or price range.</p>
              <button type="button" onClick={clearFilters} className="button-secondary mt-6">Clear All Filters</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
