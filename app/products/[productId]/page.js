import { products } from '@/data/products';
import ProductDetailClient from '@/components/ProductDetailClient';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return products.map((product) => ({ productId: product.id }));
}

export function generateMetadata({ params }) {
  const product = products.find((item) => item.id === params.productId);
  if (!product) return { title: 'Product not found' };
  return { title: product.name, description: product.description };
}

export default function ProductDetailPage({ params }) {
  const exists = products.some((item) => item.id === params.productId);
  if (!exists) notFound();
  return <ProductDetailClient productId={params.productId} />;
}
