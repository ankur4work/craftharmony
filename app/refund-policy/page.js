import ScrollReveal from '@/components/ScrollReveal';

export const metadata = {
  title: 'Refund Policy',
  description: 'Understand returns, exchanges, and refund processing for CraftHarmony orders.',
};

const sections = [
  {
    heading: 'Returns Window',
    body: 'Eligible items may be returned within 14 days of delivery when unused, undamaged, and in original packaging. To initiate a return, please contact our support team at hello@craftharmony.art before shipping any item back.',
  },
  {
    heading: 'Refund Processing',
    body: 'Once the returned piece is received and inspected, approved refunds are issued to the original payment method within 5 to 10 business days. You will receive an email confirmation once the refund has been initiated.',
  },
  {
    heading: 'Shipping Costs',
    body: 'Original shipping fees are non-refundable unless the item arrived damaged, defective, or incorrect. For approved returns, return shipping is the responsibility of the customer. We recommend using a trackable shipping service.',
  },
  {
    heading: 'Exchanges',
    body: 'We process exchanges for items of equal or greater value (with the difference paid by the customer). Exchange requests follow the same 14-day window and condition requirements as standard returns.',
  },
  {
    heading: 'Non-Returnable Items',
    body: 'Customized, made-to-order, final sale, or heavily discounted items are not eligible for return unless there is a manufacturing defect or transit damage. Perishable items and gift cards are also non-returnable.',
  },
  {
    heading: 'Damaged or Defective Items',
    body: 'If your item arrives damaged or defective, please contact us within 48 hours of delivery with photos of the damage and packaging. We will arrange a replacement or full refund at no additional cost to you.',
  },
  {
    heading: 'Cancellations',
    body: 'Orders can be cancelled within 12 hours of placement for a full refund. After this window, the order may already be in preparation and will follow the standard return process once delivered.',
  },
];

export default function PolicyPage() {
  return (
    <section className="container-shell py-10 md:py-16">
      <ScrollReveal>
        <div className="mx-auto max-w-4xl premium-panel p-8 md:p-12">
          <p className="eyebrow">
            <span className="inline-block h-px w-8 bg-terracotta" />
            Policies
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-cocoa md:text-5xl">Refund Policy</h1>
          <p className="mt-4 text-base leading-8 text-stone-500">Understand returns, exchanges, and refund processing for CraftHarmony orders.</p>
          <p className="mt-2 text-xs text-stone-400">Last updated: January 2026</p>
          <div className="mt-10 space-y-6">
            {sections.map((section, i) => (
              <ScrollReveal key={section.heading} delay={i * 60}>
                <div className="rounded-2xl border border-cocoa/6 bg-white/60 p-6">
                  <h2 className="font-serif text-2xl text-cocoa">{section.heading}</h2>
                  <p className="mt-3 text-sm leading-8 text-stone-500">{section.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
