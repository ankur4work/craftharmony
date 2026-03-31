'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  deriveCategories,
  deriveCollectionHighlights,
  deriveMaterials,
  getDefaultInventory,
  getInventoryStats,
  normalizeInventory,
} from '@/utils/inventory';

const InventoryContext = createContext();

async function parseResponse(response) {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || 'Inventory request failed');
  }

  return payload;
}

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState(() => getDefaultInventory());
  const [isHydrated, setIsHydrated] = useState(false);
  const [mongoConfigured, setMongoConfigured] = useState(false);

  const refreshProducts = useCallback(async () => {
    const response = await fetch('/api/products', { cache: 'no-store' });
    const payload = await parseResponse(response);

    setProducts(normalizeInventory(payload.products || []));
    setMongoConfigured(Boolean(payload.mongoConfigured));
    return payload.products || [];
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' });
        const payload = await parseResponse(response);

        if (!isMounted) return;

        setProducts(normalizeInventory(payload.products || []));
        setMongoConfigured(Boolean(payload.mongoConfigured));
      } catch {
        if (!isMounted) return;
        setProducts(getDefaultInventory());
        setMongoConfigured(false);
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const upsertProduct = useCallback(
    async (formValues, currentId = '') => {
      const response = await fetch(currentId ? `/api/products/${currentId}` : '/api/products', {
        method: currentId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });

      const payload = await parseResponse(response);
      const savedProduct = payload.product;

      setProducts((currentProducts) => {
        const inventory = normalizeInventory(currentProducts);
        const exists = inventory.some((item) => item.id === currentId);

        if (!exists) {
          return normalizeInventory([savedProduct, ...inventory]);
        }

        return normalizeInventory(inventory.map((item) => (item.id === currentId ? savedProduct : item)));
      });
      setMongoConfigured(Boolean(payload.mongoConfigured));

      return savedProduct;
    },
    []
  );

  const deleteProduct = useCallback(async (productId) => {
    const response = await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [productId] }),
    });

    const payload = await parseResponse(response);

    setProducts((currentProducts) => currentProducts.filter((item) => item.id !== productId));
    setMongoConfigured(Boolean(payload.mongoConfigured));
    return payload;
  }, []);

  const bulkDeleteProducts = useCallback(async (productIds) => {
    const response = await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: productIds }),
    });

    const payload = await parseResponse(response);

    setProducts((currentProducts) => currentProducts.filter((item) => !productIds.includes(item.id)));
    setMongoConfigured(Boolean(payload.mongoConfigured));
    return payload;
  }, []);

  const bulkUpdateProducts = useCallback(async (productIds, changes) => {
    const response = await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: productIds, changes }),
    });

    const payload = await parseResponse(response);

    setProducts(normalizeInventory(payload.products || []));
    setMongoConfigured(Boolean(payload.mongoConfigured));
    return payload.products || [];
  }, []);

  const value = useMemo(() => {
    const inventory = normalizeInventory(products);

    return {
      products: inventory,
      categories: deriveCategories(inventory),
      materials: deriveMaterials(inventory),
      collectionHighlights: deriveCollectionHighlights(inventory),
      inventoryStats: getInventoryStats(inventory),
      getProductById: (productId) => inventory.find((product) => product.id === productId),
      upsertProduct,
      deleteProduct,
      bulkDeleteProducts,
      bulkUpdateProducts,
      refreshProducts,
      isHydrated,
      mongoConfigured,
    };
  }, [bulkDeleteProducts, bulkUpdateProducts, deleteProduct, isHydrated, mongoConfigured, products, refreshProducts, upsertProduct]);

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);

  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }

  return context;
}
