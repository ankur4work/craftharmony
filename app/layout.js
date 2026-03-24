import './globals.css';
import LayoutShell from '@/components/LayoutShell';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';

export const metadata = {
  metadataBase: new URL('https://craftharmony.art'),
  title: { default: 'CraftHarmony | Luxury Handmade Marketplace', template: '%s | CraftHarmony' },
  description: 'India\'s premier handmade luxury marketplace. 45+ curated masterpieces from 25+ artisan studios — pottery, textiles, woodcraft, metalwork, jewelry, lighting, and more.',
  keywords: ['Indian handicrafts', 'luxury handmade', 'artisan decor', 'handmade pottery', 'Indian textiles', 'brass metalwork', 'Kashmiri woodcraft', 'CraftHarmony'],
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'CraftHarmony',
    title: 'CraftHarmony | Luxury Handmade Marketplace',
    description: 'Discover rare, story-driven handicrafts shaped by artisans, textured by culture, and curated for elevated living.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <LayoutShell>{children}</LayoutShell>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
