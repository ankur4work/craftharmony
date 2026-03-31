'use client';

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import SectionHeader from '@/components/SectionHeader';
import ScrollReveal from '@/components/ScrollReveal';
import ImageWithFallback from '@/components/ImageWithFallback';
import NewsletterForm from '@/components/NewsletterForm';
import { useInventory } from '@/context/InventoryContext';

export default function HomePageClient() {
  const { categories, collectionHighlights, inventoryStats, products } = useInventory();

  const featuredProducts = products.filter((product) => product.featured).slice(0, 8);
  const bestSellers = products.filter((product) => product.bestSeller).slice(0, 8);
  const newArrivals = products.filter((product) => product.isNew).slice(0, 4);
  const shopCategories = categories.filter((item) => item !== 'All');

  return (
    <>
      <section className="container-shell py-8 md:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollReveal>
            <div className="premium-panel h-full overflow-hidden bg-[linear-gradient(135deg,rgba(255,250,245,0.95),rgba(232,214,200,0.75))] p-8 md:p-12">
              <p className="eyebrow">
                <span className="inline-block h-px w-8 bg-terracotta" />
                India's Finest Handmade Craft
              </p>
              <h1 className="mt-6 max-w-3xl font-serif text-3xl leading-[0.95] text-cocoa sm:text-5xl md:text-7xl">
                Where Ancient Hands Shape Modern Heirlooms
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-stone-500 md:text-lg">
                Curated pottery, textiles, woodcraft, metalwork, lighting, and more. Every object carries a story older than the marketplace itself.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/products" className="button-primary">Explore the Collection</Link>
                <Link href="/about" className="button-secondary">Our Artisan Story</Link>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  [`${inventoryStats.totalProducts}+`, 'Curated Pieces', `${shopCategories.length} craft categories`],
                  ['25+', 'Artisan Studios', 'Across India'],
                  [`${inventoryStats.totalUnits}+`, 'Units in Stock', 'Managed in real time'],
                  ['4.8/5', 'Collector Rating', 'Trusted by designers'],
                ].map(([value, label, sublabel]) => (
                  <div key={label} className="rounded-2xl border border-white/60 bg-white/65 p-4 backdrop-blur-sm">
                    <p className="font-serif text-3xl text-cocoa">{value}</p>
                    <p className="mt-1 text-sm font-medium text-cocoa">{label}</p>
                    <p className="mt-0.5 text-xs text-stone-400">{sublabel}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <ScrollReveal delay={100}>
              <div className="zoom-container premium-panel overflow-hidden p-3">
                <ImageWithFallback
                  src="https://cdn.pixabay.com/photo/2016/02/24/15/36/clay-1220105_1280.jpg"
                  alt="Indian artisan hand-painting traditional pottery in a sunlit workshop"
                  className="h-[320px] w-full rounded-[1.6rem] object-cover md:h-[360px]"
                />
              </div>
            </ScrollReveal>
            <div className="grid gap-6 sm:grid-cols-2">
              <ScrollReveal delay={200}>
                <div className="zoom-container premium-panel overflow-hidden p-3">
                  <ImageWithFallback
                    src="https://cdn.pixabay.com/photo/2017/10/26/10/03/diwali-2890605_1280.jpg"
                    alt="Ornate brass diyas and traditional Indian metalwork"
                    className="h-44 w-full rounded-[1.4rem] object-cover"
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <div className="zoom-container premium-panel overflow-hidden p-3">
                  <ImageWithFallback
                    src="https://cdn.pixabay.com/photo/2015/04/22/15/08/saree-734917_1280.jpg"
                    alt="Handwoven Indian textiles with rich indigo block-print patterns"
                    className="h-44 w-full rounded-[1.4rem] object-cover"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-12">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Just Arrived"
            title="Fresh from the artisan's workshop"
            description="The newest additions to our collection, ready to be discovered and collected."
          />
        </ScrollReveal>
        <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {newArrivals.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 100}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-[#f4ece5] py-16">
        <div className="container-shell">
          <ScrollReveal>
            <SectionHeader
              eyebrow="Curated Collections"
              title="Every craft tells a different chapter of India's story"
              description="Collections stay in sync with the live inventory, so category pages and hero counts update together."
              centered
            />
          </ScrollReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {collectionHighlights.map((collection, index) => (
              <ScrollReveal key={collection.id} delay={index * 80}>
                <Link href={`/products?category=${encodeURIComponent(collection.title)}`} className="group block">
                  <div className="premium-panel overflow-hidden p-3 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft-lg">
                    <div className="zoom-container overflow-hidden rounded-[1.6rem]">
                      <ImageWithFallback src={collection.image} alt={collection.title} className="h-56 w-full object-cover" />
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-terracotta">{collection.subtitle}</p>
                      <h3 className="mt-1 font-serif text-2xl text-cocoa transition group-hover:text-terracotta">{collection.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-stone-500 line-clamp-2">{collection.description}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-cocoa transition group-hover:gap-2">
                        {collection.productCount} Pieces
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Featured Pieces"
            title="Collector-worthy objects chosen by our curators"
            description="Featured and best-seller pieces bring together exceptional craftsmanship, rich materiality, and strong storytelling."
          />
        </ScrollReveal>
        <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.slice(0, 4).map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 100}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-6 grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.slice(4, 8).map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 100}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal>
          <div className="mt-10 text-center">
            <Link href="/products" className="button-secondary">View Full Catalog</Link>
          </div>
        </ScrollReveal>
      </section>

      <section className="container-shell py-8">
        <ScrollReveal>
          <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-cocoa px-8 py-12 text-white md:grid-cols-[0.9fr_1.1fr] md:px-14">
            <div>
              <p className="eyebrow text-white/60">
                <span className="inline-block h-px w-8 bg-terracotta" />
                Our Story
              </p>
              <h2 className="mt-4 font-serif text-5xl leading-none">Crafted slowly. Collected thoughtfully.</h2>
              <p className="mt-6 text-4xl font-serif leading-tight text-white/40">A living catalog shaped by artisan stories and careful merchandising.</p>
            </div>
            <div>
              <p className="text-base leading-8 text-white/75">
                CraftHarmony is not just a marketplace. It is a way to present heritage craft with the polish of a modern brand while keeping the maker's story at the center.
              </p>
              <p className="mt-4 text-base leading-8 text-white/75">
                Each piece is merchandised with care, balancing artisan heritage, visual richness, and modern home appeal.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="container-shell py-16">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Shop by Craft"
            title="Browse every live category in the catalog"
            description="Each category brings a distinct material language, making tradition, and design mood."
          />
        </ScrollReveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shopCategories.map((category, index) => (
            <ScrollReveal key={category} delay={index * 60}>
              <Link
                href={`/products?category=${encodeURIComponent(category)}`}
                className="premium-panel group flex h-full flex-col p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cocoa font-serif text-sm text-white shadow-sm">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="mt-5 font-serif text-2xl text-cocoa transition group-hover:text-terracotta">{category}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-stone-500">Handcrafted pieces rooted in centuries of Indian artisan heritage.</p>
                <span className="mt-auto flex items-center gap-1 pt-5 text-xs font-semibold uppercase tracking-[0.1em] text-cocoa transition group-hover:gap-2">
                  Browse Collection
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-[#f4ece5] py-16">
        <div className="container-shell">
          <ScrollReveal>
          <SectionHeader
            eyebrow="Best Sellers"
            title="The pieces our collectors can't stop recommending"
            description="These are the pieces customers, designers, and gift buyers return to again and again."
            centered
          />
          </ScrollReveal>
          <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {bestSellers.slice(0, 4).map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 100}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-6 grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {bestSellers.slice(4, 8).map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 100}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-12">
        <ScrollReveal>
          <div className="premium-panel grid gap-6 overflow-hidden p-8 md:grid-cols-3 md:p-12">
            {[
              [`${inventoryStats.totalProducts}`, 'Products Live', 'Visible across the storefront'],
              [`${inventoryStats.totalUnits}`, 'Units in Stock', 'Across all active items'],
              [`$${Math.round(inventoryStats.totalValue).toLocaleString()}`, 'Inventory Value', 'Calculated from price and stock'],
            ].map((stat) => (
              <div key={stat[1]} className="text-center">
                <p className="font-serif text-5xl text-terracotta md:text-6xl">{stat[0]}</p>
                <p className="mt-2 font-semibold text-cocoa">{stat[1]}</p>
                <p className="mt-1 text-sm text-stone-500">{stat[2]}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="container-shell py-16">
        <ScrollReveal>
          <div className="premium-panel overflow-hidden px-8 py-12 md:px-14">
            <div className="grid items-center gap-8 md:grid-cols-[1fr_0.95fr]">
              <div>
                <p className="eyebrow">
                  <span className="inline-block h-px w-8 bg-terracotta" />
                  The Artisan Journal
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-tight text-cocoa md:text-5xl">
                  New arrivals, artisan spotlights, and the stories behind the craft.
                </h2>
                <p className="mt-4 text-stone-500">Join collectors and design lovers who follow every new addition to the catalog.</p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
