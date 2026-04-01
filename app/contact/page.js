import SectionHeader from '@/components/SectionHeader';
import ContactForm from '@/components/ContactForm';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata = {
  title: 'Contact CraftHarmony',
  description: 'Reach CraftHarmony for product inquiries, collaborations, and customer support.',
};

export default function ContactPage() {
  return (
    <section className="container-shell py-10 md:py-16">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Contact"
          title="Let's help you find the right handcrafted piece"
          description="For product questions, styling guidance, gifting requests, or collaborations, send us a note and our team will respond with care."
        />
      </ScrollReveal>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <ScrollReveal delay={100}>
          <ContactForm />
        </ScrollReveal>
        <div className="space-y-5">
          <ScrollReveal delay={200}>
            <div className="premium-panel p-8 md:p-10">
              <p className="eyebrow">
                <span className="inline-block h-px w-8 bg-terracotta" />
                Studio
              </p>
              <h3 className="mt-3 font-serif text-3xl text-cocoa">CraftHarmony</h3>
              <div className="mt-5 space-y-3 text-sm text-stone-500">
                <p className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-cocoa"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  hello@craftharmony.art
                </p>
                <p className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-cocoa"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Singapore · Shipping globally
                </p>
                <p className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-cocoa"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Response within 1–2 business days
                </p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="premium-panel overflow-hidden p-2.5">
              <iframe
                title="CraftHarmony location map"
                src="https://www.google.com/maps?q=Singapore&z=12&output=embed"
                className="h-[320px] w-full rounded-[1.6rem] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
