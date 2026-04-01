import Link from 'next/link';

const footerLinks = {
  Explore: [
    { label: 'Shop', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Wishlist', href: '/wishlist' },
  ],
  Policies: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-cocoa/8 bg-[linear-gradient(180deg,#f7efe8,#efe2d5)]">
      <div className="container-shell grid gap-8 py-14 md:grid-cols-[1.2fr_0.7fr_0.8fr_1fr] md:py-16">
        <div className="rounded-[2rem] border border-white/60 bg-white/60 p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cocoa font-serif text-base text-white shadow-sm">C</div>
            <div>
              <p className="font-serif text-2xl text-cocoa">CraftHarmony</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.24em] text-stone-400">Ancient Hands, Modern Heirlooms</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-7 text-stone-500">
            Singapore's handmade luxury marketplace, bringing collector-worthy craft objects, meaningful stories, and thoughtful gifting into one polished destination.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['Curated in Singapore', 'Global Shipping', 'Artisan-led'].map((badge) => (
              <span key={badge} className="rounded-full border border-cocoa/10 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cocoa">
                {badge}
              </span>
            ))}
          </div>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-cocoa">{title}</h4>
            <div className="mt-5 flex flex-col gap-3">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-stone-500 transition duration-200 hover:text-cocoa">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-cocoa">Studio Contact</h4>
          <div className="mt-5 space-y-3 text-sm text-stone-500">
            <p className="flex items-start gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-1 shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              hello@craftharmony.art
            </p>
            <p className="flex items-start gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-1 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              Singapore · Shipping globally
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-cocoa/8 py-6">
        <div className="container-shell flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-stone-400">© {new Date().getFullYear()} CraftHarmony. All rights reserved.</p>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Crafted for meaningful living</p>
        </div>
      </div>
    </footer>
  );
}
