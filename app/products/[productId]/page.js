import ProductDetailClient from '@/components/ProductDetailClient';
import { products } from '@/data/products';

export function generateStaticParams() {
  return products.map((product) => ({ productId: product.id }));
}

export function generateMetadata({ params }) {
  const product = products.find((item) => item.id === params.productId);
  if (!product) {
    return {
      title: 'Product Details',
      description: 'View a handcrafted piece from the CraftHarmony collection.',
    };
  }

  return { title: product.name, description: product.description };
}

export default function ProductDetailPage({ params }) {
  return <ProductDetailClient productId={params.productId} />;
}
