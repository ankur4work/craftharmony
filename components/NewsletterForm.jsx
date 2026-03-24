'use client';

export default function NewsletterForm() {
  return (
    <form className="flex flex-col gap-4 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="Enter your email"
        className="h-14 flex-1 rounded-full border border-cocoa/10 bg-white px-6 text-stone-700 outline-none transition duration-200 focus:border-cocoa focus:shadow-glow"
        required
      />
      <button type="submit" className="button-primary shrink-0 whitespace-nowrap">Join Newsletter</button>
    </form>
  );
}
