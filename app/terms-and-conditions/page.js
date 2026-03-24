import ScrollReveal from '@/components/ScrollReveal';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'Review the terms that govern the use of CraftHarmony and all website purchases.',
};

const sections = [
  {
    heading: 'Acceptance of Terms',
    body: 'By accessing or using CraftHarmony (craftharmony.art), you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please discontinue use of the website immediately.',
  },
  {
    heading: 'Use of the Website',
    body: 'You agree to access the website lawfully, not misuse the platform, interfere with its operations, or provide false information during purchase, account creation, or inquiry. Unauthorized use may result in account suspension.',
  },
  {
    heading: 'Product Authenticity & Variation',
    body: 'Our products are handmade in small batches by independent artisans. Slight variations in glaze, weave, carving, texture, color, and dimensions are natural and should be expected as part of authentic craftsmanship. These are not defects but markers of genuine handmade quality.',
  },
  {
    heading: 'Orders & Availability',
    body: 'All orders are subject to acceptance and availability. CraftHarmony reserves the right to limit quantities, correct pricing errors, or cancel orders when stock, fulfillment, or pricing issues occur. You will be notified promptly if your order is affected.',
  },
  {
    heading: 'Pricing & Payment',
    body: 'All prices are listed in USD and include applicable taxes where required. We accept major credit cards, debit cards, and select digital payment methods. Payment is processed securely through our trusted payment partners at the time of order placement.',
  },
  {
    heading: 'Intellectual Property',
    body: 'All content on CraftHarmony — including text, images, product descriptions, logos, and design — is the intellectual property of CraftHarmony or its content suppliers. Reproduction, distribution, or modification without written permission is prohibited.',
  },
  {
    heading: 'Shipping & Delivery',
    body: 'Estimated delivery times are provided at checkout and may vary based on destination and product availability. CraftHarmony is not responsible for delays caused by customs, weather, or carrier issues. Risk of loss passes to the buyer upon delivery.',
  },
  {
    heading: 'Limitation of Liability',
    body: 'CraftHarmony is not liable for indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount paid for the specific product in question.',
  },
  {
    heading: 'Governing Law',
    body: 'These terms are governed by the laws of India. Any disputes arising from these terms or use of the website shall be resolved through arbitration or in the courts of Jaipur, Rajasthan.',
  },
  {
    heading: 'Changes to Terms',
    body: 'CraftHarmony reserves the right to modify these terms at any time. Changes will be posted on this page with an updated revision date. Continued use of the website constitutes acceptance of the revised terms.',
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
          <h1 className="mt-4 font-serif text-4xl leading-tight text-cocoa md:text-5xl">Terms & Conditions</h1>
          <p className="mt-4 text-base leading-8 text-stone-500">Review the terms that govern the use of CraftHarmony and all website purchases.</p>
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
