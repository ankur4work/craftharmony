export const CART_STORAGE_KEY = 'craftharmony-cart';

export const getStoredCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    const data = window.localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const setStoredCart = (cartItems) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch {}
};
