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
    <footer className="border-t border-cocoa/8 bg-[#f5ede6]">
      <div className="container-shell grid gap-10 py-16 md:grid-cols-[1.3fr_0.7fr_0.7fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cocoa font-serif text-base text-white">C</div>
            <p className="font-serif text-2xl text-cocoa">CraftHarmony</p>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-7 text-stone-500">India's premier handmade luxury marketplace. 45+ curated pieces from 25+ artisan studios across 20+ legendary craft cities.</p>
          <p className="mt-6 text-xs uppercase tracking-[0.26em] text-stone-400">Ancient Hands, Modern Heirlooms</p>
        </div>
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-cocoa">{title}</h4>
            <div className="mt-5 flex flex-col gap-3">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-stone-500 transition duration-200 hover:text-cocoa">{link.label}</Link>
              ))}
            </div>
          </div>
        ))}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-cocoa">Studio Contact</h4>
          <div className="mt-5 space-y-2 text-sm text-stone-500">
            <p className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              hello@craftharmony.art
            </p>
            <p className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Jaipur, India · Shipping globally
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
