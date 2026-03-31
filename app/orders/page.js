import OrderTrackingClient from '@/components/OrderTrackingClient';

export const metadata = {
  title: 'Track Your Orders — CraftHarmony',
  description: 'Look up and track the status of your CraftHarmony orders.',
};

export default function OrdersPage() {
  return <OrderTrackingClient />;
}
