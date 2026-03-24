'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getStoredCart, setStoredCart } from '@/utils/storage';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setCartItems(getStoredCart());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) setStoredCart(cartItems);
  }, [cartItems, isHydrated]);

  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === product.id);
      if (existing) return currentItems.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    setCartItems((currentItems) => currentItems.map((item) => item.id === productId ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId) => setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  const clearCart = () => setCartItems([]);

  const cartCount = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);
  const totalPrice = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);

  return <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, totalPrice, isHydrated }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
