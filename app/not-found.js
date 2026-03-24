import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-shell flex min-h-[60vh] items-center justify-center py-16">
      <div className="glass-card mx-auto max-w-2xl p-12 text-center">
        <p className="font-serif text-8xl text-cocoa/20">404</p>
        <h1 className="mt-4 font-serif text-4xl text-cocoa">This page wandered off</h1>
        <p className="mt-4 text-base leading-8 text-stone-500">
          The destination you are looking for doesn't exist, but there are plenty of beautiful handmade pieces waiting in the shop.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="button-primary">Back to Home</Link>
          <Link href="/products" className="button-secondary">Browse Shop</Link>
        </div>
      </div>
    </section>
  );
}
