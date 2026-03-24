import ScrollReveal from '@/components/ScrollReveal';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Learn how CraftHarmony collects, uses, and safeguards customer information.',
};

const sections = [
  {
    heading: 'Information We Collect',
    body: 'We may collect personal details including your name, email address, shipping address, phone number, payment information, and order details when you browse, purchase, create an account, or contact us through the website.',
  },
  {
    heading: 'How We Use Your Information',
    body: 'Collected data is used to process and fulfill orders, provide customer support, personalize your shopping experience, communicate updates and promotional offers (with your consent), improve our website, and maintain service quality and security.',
  },
  {
    heading: 'Cookies & Tracking',
    body: 'CraftHarmony uses cookies and similar technologies to remember your preferences, analyze site traffic, and enhance functionality. You can manage cookie preferences through your browser settings. Essential cookies required for site operation cannot be disabled.',
  },
  {
    heading: 'Data Protection & Security',
    body: 'We implement industry-standard security measures including SSL encryption, secure payment processing, and access controls to protect your personal data. We regularly review our security practices and update them as needed.',
  },
  {
    heading: 'Third-Party Sharing',
    body: 'We do not sell personal data. We share information only with trusted service providers necessary to operate the business, including payment processors, shipping partners, and analytics services. All partners are contractually obligated to handle data securely.',
  },
  {
    heading: 'Your Rights',
    body: 'You have the right to access, correct, or delete your personal data at any time. You may also opt out of marketing communications. To exercise these rights, please contact us at hello@craftharmony.art and we will respond within 30 days.',
  },
  {
    heading: 'Data Retention',
    body: 'We retain personal data only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Order records are kept for a minimum period required by applicable tax and commerce laws.',
  },
  {
    heading: 'Policy Updates',
    body: 'This Privacy Policy may be updated periodically to reflect changes in our practices or applicable regulations. We will notify registered users of significant changes via email. The latest version will always be available on this page.',
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
          <h1 className="mt-4 font-serif text-4xl leading-tight text-cocoa md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-base leading-8 text-stone-500">Learn how CraftHarmony collects, uses, and safeguards customer information.</p>
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
