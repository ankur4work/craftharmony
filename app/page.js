import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import SectionHeader from '@/components/SectionHeader';
import ScrollReveal from '@/components/ScrollReveal';
import ImageWithFallback from '@/components/ImageWithFallback';
import NewsletterForm from '@/components/NewsletterForm';
import { categories, collectionHighlights, products, testimonials } from '@/data/products';

export const metadata = {
  title: 'CraftHarmony | India\'s Premier Handmade Luxury Marketplace',
  description: 'Discover 45+ handcrafted masterpieces from India\'s finest artisans — pottery, textiles, woodcraft, metalwork, jewelry, lighting, and more. Every piece tells a story.',
};

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const shopCategories = categories.filter((item) => item !== 'All');

  return (
    <>
      {/* ── Hero ── */}
      <section className="container-shell py-8 md:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollReveal>
            <div className="premium-panel h-full overflow-hidden bg-[linear-gradient(135deg,rgba(255,250,245,0.95),rgba(232,214,200,0.75))] p-8 md:p-12">
              <p className="eyebrow">
                <span className="inline-block h-px w-8 bg-terracotta" />
                India's Finest Handmade Craft
              </p>
              <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[0.95] text-cocoa md:text-7xl">
                Where Ancient Hands Shape Modern Heirlooms
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-stone-500 md:text-lg">
                45+ museum-worthy pieces from Jaipur's jewellers, Kashmir's woodcarvers, Varanasi's brass smiths, and Kutch's master weavers. Every object carries a story older than the marketplace itself.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/products" className="button-primary">Explore All 45+ Pieces</Link>
                <Link href="/about" className="button-secondary">Our Artisan Story</Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-4">
                {[
                  ['45+', 'Curated Pieces', '8 craft categories'],
                  ['25+', 'Artisan Studios', 'Across 20+ Indian cities'],
                  ['100%', 'Handcrafted', 'No machines, no shortcuts'],
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

      {/* ── New Arrivals ── */}
      <section className="container-shell py-12">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Just Arrived"
            title="Fresh from the artisan's workshop"
            description="The newest additions to our collection — still warm from the kiln, loom, and forge."
          />
        </ScrollReveal>
        <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {newArrivals.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 100}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Collections ── */}
      <section className="bg-[#f4ece5] py-16">
        <div className="container-shell">
          <ScrollReveal>
            <SectionHeader
              eyebrow="8 Curated Collections"
              title="Every craft tells a different chapter of India's story"
              description="From Khurja's kilns to Kashmir's walnut groves, from Moradabad's brass foundries to Varanasi's silk looms — explore collections shaped by centuries of mastery."
              centered
            />
          </ScrollReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {collectionHighlights.map((collection, i) => (
              <ScrollReveal key={collection.id} delay={i * 80}>
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Pieces ── */}
      <section className="container-shell py-16">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Featured Pieces"
            title="Collector-worthy objects chosen by our curators"
            description="Handpicked for their exceptional craftsmanship, rich materiality, and the power to transform any space they inhabit."
          />
        </ScrollReveal>
        <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.slice(0, 4).map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 100}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-6 grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.slice(4, 8).map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 100}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal>
          <div className="mt-10 text-center">
            <Link href="/products" className="button-secondary">View All 45+ Pieces</Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Brand Story ── */}
      <section className="container-shell py-8">
        <ScrollReveal>
          <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-cocoa px-8 py-12 text-white md:grid-cols-[0.9fr_1.1fr] md:px-14">
            <div>
              <p className="eyebrow text-white/60">
                <span className="inline-block h-px w-8 bg-terracotta" />
                Our Story
              </p>
              <h2 className="mt-4 font-serif text-5xl leading-none">Crafted slowly. Collected thoughtfully.</h2>
              <p className="mt-6 text-4xl font-serif leading-tight text-white/40">25+ artisan studios. 20+ cities. Thousands of years of heritage.</p>
            </div>
            <div>
              <p className="text-base leading-8 text-white/75">
                CraftHarmony is not just a marketplace — it's a movement to keep India's endangered craft traditions alive. We work directly with artisan cooperatives, family workshops, and master craftspeople whose methods haven't changed in centuries.
              </p>
              <p className="mt-4 text-base leading-8 text-white/75">
                From the Kundan jewellers of Jaipur's Johari Bazaar to the walnut woodcarvers of Srinagar's old city, from the brass smiths of Moradabad to the tarakasi silversmiths of Cuttack — every purchase sustains a living tradition and the families who keep it breathing.
              </p>
              <Link href="/about" className="button-secondary mt-8 border-white/15 bg-white/8 text-white hover:bg-white/15 hover:text-white">Read the Full Story</Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Shop by Category ── */}
      <section className="container-shell py-16">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Shop by Craft"
            title="Eight ancient traditions, one curated destination"
            description="Each category represents a distinct Indian craft tradition with its own materials, techniques, and centuries of cultural memory."
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
                  0{index + 1}
                </div>
                <h3 className="mt-5 font-serif text-2xl text-cocoa transition group-hover:text-terracotta">{category}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-stone-500">Handcrafted pieces rooted in centuries of Indian artisan heritage.</p>
                <span className="mt-auto flex items-center gap-1 pt-5 text-xs font-semibold uppercase tracking-[0.1em] text-cocoa transition group-hover:gap-2">
                  Browse Collection
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="bg-[#f4ece5] py-16">
        <div className="container-shell">
          <ScrollReveal>
            <SectionHeader
              eyebrow="Best Sellers"
              title="The pieces our collectors can't stop recommending"
              description="Chosen again and again by interior designers, architects, gift buyers, and craft enthusiasts worldwide."
              centered
            />
          </ScrollReveal>
          <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {bestSellers.slice(0, 4).map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 100}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-6 grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {bestSellers.slice(4, 8).map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 100}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Craft Heritage Banner ── */}
      <section className="container-shell py-12">
        <ScrollReveal>
          <div className="premium-panel grid gap-6 overflow-hidden p-8 md:grid-cols-3 md:p-12">
            {[
              {
                value: '5,000+',
                label: 'Years of Craft Heritage',
                desc: 'India\'s artisan traditions predate recorded history',
              },
              {
                value: '200M+',
                label: 'Artisan Livelihoods',
                desc: 'India has the world\'s largest artisan economy',
              },
              {
                value: '₹0',
                label: 'Middlemen Markup',
                desc: 'We source directly from makers and cooperatives',
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-5xl text-terracotta md:text-6xl">{stat.value}</p>
                <p className="mt-2 font-semibold text-cocoa">{stat.label}</p>
                <p className="mt-1 text-sm text-stone-500">{stat.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-[#f4ece5] py-16">
        <div className="container-shell">
          <ScrollReveal>
            <SectionHeader
              eyebrow="What Collectors Say"
              title="Trusted by designers, architects, and craft lovers worldwide"
              description="Real stories from the people who bring CraftHarmony into their homes, projects, and celebrations."
              centered
            />
          </ScrollReveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 100}>
                <div className="premium-panel flex h-full flex-col p-8">
                  <div className="flex gap-1 text-terracotta">
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <svg key={idx} width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ))}
                  </div>
                  <p className="mt-5 flex-1 text-base leading-8 text-stone-600">"{item.text}"</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-cocoa/8 pt-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cocoa font-serif text-sm text-white">{item.avatar}</div>
                    <div>
                      <p className="font-semibold text-cocoa">{item.name}</p>
                      <p className="text-xs text-stone-400">{item.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
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
                <p className="mt-4 text-stone-500">Join 2,000+ collectors and design lovers who receive our weekly dispatch.</p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
