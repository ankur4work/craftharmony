'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getStoredOrders, setStoredOrders } from '@/utils/storage';

const OrderContext = createContext();

function createOrderId() {
  const stamp = Date.now().toString().slice(-8);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CH-${stamp}-${suffix}`;
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setOrders(getStoredOrders());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    setStoredOrders(orders);
  }, [isHydrated, orders]);

  const placeOrder = (orderPayload) => {
    const order = {
      id: createOrderId(),
      status: 'Placed',
      placedAt: new Date().toISOString(),
      ...orderPayload,
    };

    setOrders((current) => [order, ...current]);
    return order;
  };

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
    <OrderContext.Provider value={{ orders, orderStats, placeOrder, isHydrated }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
}
