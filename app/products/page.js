import { Suspense } from 'react';
import ProductsClient from '@/components/ProductsClient';

export const metadata = {
  title: 'Shop CraftHarmony',
  description: 'Browse 45+ luxury handmade pieces — pottery, textiles, woodcraft, metalwork, jewelry, lighting, and more.',
};

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsClient />
    </Suspense>
  );
}
