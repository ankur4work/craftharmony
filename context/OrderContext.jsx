'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const fetchAllOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      // silent fail — admin-only fetch
    }
  }, []);

  const fetchOrdersByEmail = useCallback(async (email) => {
    if (!email) return [];
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`, { cache: 'no-store' });
      if (!res.ok) return [];
      const data = await res.json();
      return data.orders || [];
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    fetchAllOrders().finally(() => setIsHydrated(true));
  }, [fetchAllOrders]);

  const placeOrder = useCallback(async (orderPayload) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to place order');
    }

    const data = await res.json();
    setOrders((current) => [data.order, ...current]);
    return data.order;
  }, []);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    const res = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update order');
    }

    const data = await res.json();
    setOrders((current) =>
      current.map((o) => (o.id === orderId ? data.order : o))
    );
    return data.order;
  }, []);

  const orderStats = useMemo(() => {
    return orders.reduce(
      (stats, order) => {
        stats.totalOrders += 1;
        stats.totalRevenue += order.total || 0;
        stats.totalItems += order.items?.reduce((count, item) => count + item.quantity, 0) || 0;
        if (order.status === 'Placed') stats.pendingOrders += 1;
        return stats;
      },
      { totalOrders: 0, totalRevenue: 0, totalItems: 0, pendingOrders: 0 }
    );
  }, [orders]);

  return (
    <OrderContext.Provider value={{
      orders,
      orderStats,
      placeOrder,
      updateOrderStatus,
      fetchOrdersByEmail,
      refreshOrders: fetchAllOrders,
      isHydrated,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
}
