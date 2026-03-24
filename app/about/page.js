import Link from 'next/link';
import ImageWithFallback from '@/components/ImageWithFallback';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata = {
  title: 'About CraftHarmony | Our Mission & Artisan Partners',
  description: 'CraftHarmony connects India\'s finest artisans with conscious collectors worldwide. Learn about our mission, process, and the 25+ studios we partner with.',
};

const values = [
  {
    eyebrow: 'Mission',
    title: 'Sustain living traditions',
    copy: 'We create a premium digital stage for India\'s endangered craft traditions — ensuring master artisans earn fair value while their techniques survive for future generations.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    ),
  },
  {
    eyebrow: 'Vision',
    title: 'Indian craft, global homes',
    copy: 'From a Bandra apartment to a Brooklyn brownstone, from a London townhouse to a Tokyo loft — CraftHarmony makes India\'s artisan heritage accessible to design-conscious spaces worldwide.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
    ),
  },
  {
    eyebrow: 'Impact',
    title: 'Zero middlemen, full transparency',
    copy: 'Every rupee you spend goes directly to the artisan cooperative or studio. No agents, no wholesalers, no exploitation. We publish origin stories, artisan names, and fair-trade documentation for every piece.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    ),
  },
];

const processSteps = [
  { step: '01', title: 'Scout', description: 'We travel to artisan clusters across India — from Jaipur\'s Johari Bazaar to Srinagar\'s old city, from Moradabad\'s brass foundries to Kutch\'s weaver villages — seeking masters whose craft carries cultural weight and material integrity.' },
  { step: '02', title: 'Curate', description: 'Only 1 in 20 pieces we evaluate makes it to the collection. Each is selected for exceptional craftsmanship, compelling provenance, and the ability to transform a modern living space.' },
  { step: '03', title: 'Document', description: 'We photograph each piece in natural light, record the artisan\'s story, detail the materials and techniques, and trace the craft tradition\'s history. Every listing reads like a museum exhibit.' },
  { step: '04', title: 'Deliver', description: 'Custom packaging designed for each product category — ceramic cradles, textile acid-free wraps, brass tarnish-proof sleeves. Your piece arrives exactly as it left the artisan\'s hands.' },
];

const craftCities = [
  { city: 'Jaipur', craft: 'Block printing, Kundan jewelry, blue pottery' },
  { city: 'Srinagar', craft: 'Walnut woodcarving, papier-mâché, pashmina' },
  { city: 'Moradabad', craft: 'Brassware, copper hammering, metalwork' },
  { city: 'Varanasi', craft: 'Silk weaving, brass diyas, Banarasi brocade' },
  { city: 'Kutch', craft: 'Ajrakh printing, mirror embroidery, Rogan art' },
  { city: 'Cuttack', craft: 'Tarakasi silver filigree' },
  { city: 'Lucknow', craft: 'Zardozi embroidery, chikankari' },
  { city: 'Channapatna', craft: 'Lacquerware, wooden toys' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="container-shell py-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <ScrollReveal>
            <div>
              <p className="eyebrow">
                <span className="inline-block h-px w-8 bg-terracotta" />
                About CraftHarmony
              </p>
              <h1 className="mt-4 font-serif text-5xl leading-[0.95] text-cocoa md:text-6xl">
                India's craft heritage deserves more than a dusty shelf in a tourist market.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-stone-500">
                We partner with 25+ artisan studios across 20+ Indian cities to bring you museum-worthy handmade objects at fair prices. No middlemen. No mass production. No compromise.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/products" className="button-primary">Shop the Collection</Link>
                <Link href="/contact" className="button-secondary">Partner With Us</Link>
              </div>
            </div>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2">
            <ScrollReveal delay={100}>
              <div className="zoom-container overflow-hidden rounded-[2rem] shadow-soft">
                <ImageWithFallback src="https://cdn.pixabay.com/photo/2015/02/03/16/14/potter-622708_1280.jpg" alt="Artisan shaping clay on a traditional potter's wheel" className="h-full min-h-[320px] w-full object-cover" />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="zoom-container overflow-hidden rounded-[2rem] shadow-soft">
                <ImageWithFallback src="https://cdn.pixabay.com/photo/2012/02/23/10/39/loom-16026_1280.jpg" alt="Hands weaving intricate textile patterns on a handloom" className="h-full min-h-[320px] w-full object-cover" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#f4ece5] py-16">
        <div className="container-shell grid gap-6 md:grid-cols-3">
          {values.map((item, i) => (
            <ScrollReveal key={item.eyebrow} delay={i * 100}>
              <div className="premium-panel flex h-full flex-col p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sand text-cocoa">{item.icon}</div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">{item.eyebrow}</p>
                <h2 className="mt-2 font-serif text-3xl text-cocoa">{item.title}</h2>
                <p className="mt-4 leading-8 text-stone-500">{item.copy}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="container-shell py-16">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Our Process</p>
            <h2 className="mt-3 font-serif text-4xl text-cocoa md:text-5xl">From artisan's hands to your home</h2>
            <p className="mt-4 text-base leading-8 text-stone-500">Every piece on CraftHarmony follows a rigorous journey. Only 5% of what we see makes it to your screen.</p>
          </div>
        </ScrollReveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((item, i) => (
            <ScrollReveal key={item.step} delay={i * 100}>
              <div className="premium-panel flex h-full flex-col p-6">
                <span className="font-serif text-4xl text-terracotta/40">{item.step}</span>
                <h3 className="mt-3 font-serif text-2xl text-cocoa">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-500">{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Craft Cities */}
      <section className="bg-[#f4ece5] py-16">
        <div className="container-shell">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">Our Artisan Network</p>
              <h2 className="mt-3 font-serif text-4xl text-cocoa md:text-5xl">Sourced from India's legendary craft cities</h2>
              <p className="mt-4 text-base leading-8 text-stone-500">Each city has shaped its own unique craft identity over centuries. We bring the best of each to you.</p>
            </div>
          </ScrollReveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {craftCities.map((item, i) => (
              <ScrollReveal key={item.city} delay={i * 60}>
                <div className="premium-panel p-6">
                  <h3 className="font-serif text-2xl text-cocoa">{item.city}</h3>
                  <p className="mt-2 text-sm leading-7 text-stone-500">{item.craft}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Artisan First */}
      <section className="container-shell py-16">
        <ScrollReveal>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="zoom-container overflow-hidden rounded-[2rem] shadow-soft">
              <ImageWithFallback src="https://cdn.pixabay.com/photo/2013/07/25/10/12/pottery-166798_1280.jpg" alt="Artisan hands working on detailed brass engraving" className="h-full min-h-[380px] w-full object-cover" />
            </div>
            <div className="premium-panel p-8 md:p-10">
              <p className="eyebrow">
                <span className="inline-block h-px w-8 bg-terracotta" />
                Artisan First, Always
              </p>
              <h3 className="mt-4 font-serif text-4xl leading-tight text-cocoa md:text-5xl">The maker's name matters more than the brand's.</h3>
              <p className="mt-5 leading-8 text-stone-500">Every product page on CraftHarmony names the artisan, their studio, their city, and the craft tradition they represent. We believe transparency builds trust, and trust builds lasting relationships between makers and collectors.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ['Fair Trade', 'Direct payments, no middlemen'],
                  ['Small Batch', 'Limited runs, never mass-produced'],
                  ['Story Driven', 'Every piece has documented provenance'],
                ].map(([title, copy]) => (
                  <div key={title} className="rounded-2xl bg-sand/60 p-4">
                    <p className="font-semibold text-cocoa">{title}</p>
                    <p className="mt-2 text-sm text-stone-500">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
