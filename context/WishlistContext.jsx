'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'craftharmony-wishlist';
const WishlistContext = createContext();

function getStored() {
  if (typeof window === 'undefined') return [];
  try {
    const data = window.localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setStored(items) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(getStored());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) setStored(items);
  }, [items, isHydrated]);

  const addToWishlist = (productId) => {
    setItems((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
  };

  const removeFromWishlist = (productId) => {
    setItems((prev) => prev.filter((id) => id !== productId));
  };

  const toggleWishlist = (productId) => {
    setItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId) => items.includes(productId);
  const wishlistCount = useMemo(() => items.length, [items]);

  return (
    <WishlistContext.Provider value={{ wishlistItems: items, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, wishlistCount, isHydrated }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
}
