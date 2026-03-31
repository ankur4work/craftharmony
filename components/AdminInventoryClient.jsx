'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ImageWithFallback from '@/components/ImageWithFallback';
import ScrollReveal from '@/components/ScrollReveal';
import { useInventory } from '@/context/InventoryContext';
import { useOrders } from '@/context/OrderContext';
import { useToast } from '@/context/ToastContext';

const EMPTY_FORM = {
  name: '',
  category: '',
  material: '',
  price: '0',
  rating: '4.8',
  stock: '0',
  sku: '',
  artisan: '',
  origin: '',
  dimensions: '',
  shortDescription: '',
  description: '',
  story: '',
  imagesText: '',
  featured: false,
  bestSeller: false,
  isNew: true,
};

function buildFormState(product) {
  if (!product) return EMPTY_FORM;

  return {
    name: product.name,
    category: product.category,
    material: product.material,
    price: String(product.price),
    rating: String(product.rating),
    stock: String(product.stock),
    sku: product.sku,
    artisan: product.artisan,
    origin: product.origin,
    dimensions: product.dimensions,
    shortDescription: product.shortDescription,
    description: product.description,
    story: product.story,
    imagesText: product.images.join('\n'),
    featured: product.featured,
    bestSeller: product.bestSeller,
    isNew: product.isNew,
  };
}

function parseImages(value) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatTimestamp(value) {
  if (!value) return 'Just now';

  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return 'Just now';
  }
}

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export default function AdminInventoryClient() {
  const router = useRouter();
  const {
    bulkDeleteProducts,
    bulkUpdateProducts,
    categories,
    inventoryStats,
    isHydrated,
    materials,
    products,
    deleteProduct,
    refreshProducts,
    upsertProduct,
  } = useInventory();
  const { isHydrated: ordersHydrated, orders, orderStats, updateOrderStatus, refreshOrders } = useOrders();
  const { addToast } = useToast();
  const [activeProductId, setActiveProductId] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [stockFilter, setStockFilter] = useState('all');
  const [showOrders, setShowOrders] = useState(true);
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [catalogPanelHeight, setCatalogPanelHeight] = useState(null);
  const productWorkspaceRef = useRef(null);
  const productNameInputRef = useRef(null);
  const productFormRef = useRef(null);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.refresh();
    router.replace('/admin');
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const query = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.artisan.toLowerCase().includes(query);

        const matchesStock =
          stockFilter === 'all' ||
          (stockFilter === 'in-stock' && product.stock > 5) ||
          (stockFilter === 'low-stock' && product.stock > 0 && product.stock <= 5) ||
          (stockFilter === 'out-of-stock' && product.stock === 0);

        return matchesQuery && matchesStock;
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [products, searchQuery, stockFilter]);

  const activeProduct = useMemo(
    () => products.find((product) => product.id === activeProductId) || null,
    [activeProductId, products]
  );

  const previewImages = useMemo(() => parseImages(formState.imagesText), [formState.imagesText]);
  const allVisibleSelected = filteredProducts.length > 0 && filteredProducts.every((product) => selectedIds.includes(product.id));

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => products.some((product) => product.id === id)));
  }, [products]);

  useEffect(() => {
    if (!isHydrated) return;

    if (activeProduct) {
      setFormState(buildFormState(activeProduct));
      return;
    }

    if (filteredProducts.length > 0 && !activeProductId && !isCreatingNew) {
      setActiveProductId(filteredProducts[0].id);
      return;
    }

    if (products.length === 0) {
      setFormState(EMPTY_FORM);
    }
  }, [activeProduct, activeProductId, filteredProducts, isCreatingNew, isHydrated, products.length]);

  useEffect(() => {
    const formElement = productFormRef.current;
    if (!formElement || typeof window === 'undefined') return undefined;

    const syncCatalogHeight = () => {
      if (window.innerWidth < 1280) {
        setCatalogPanelHeight(null);
        return;
      }

      setCatalogPanelHeight(formElement.getBoundingClientRect().height);
    };

    syncCatalogHeight();

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => syncCatalogHeight())
      : null;

    resizeObserver?.observe(formElement);
    window.addEventListener('resize', syncCatalogHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', syncCatalogHeight);
    };
  }, [activeProductId, formState, isCreatingNew, previewImages.length]);

  const handleFieldChange = (event) => {
    const { checked, name, type, value } = event.target;
    setFormState((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setActiveProductId('');
    setFormState(EMPTY_FORM);
    window.requestAnimationFrame(() => {
      productWorkspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => productNameInputRef.current?.focus(), 220);
    });
  };

  const handleEditProduct = (productId) => {
    setIsCreatingNew(false);
    setActiveProductId(productId);
    window.requestAnimationFrame(() => {
      productWorkspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const toggleSelectedId = (productId) => {
    setSelectedIds((current) => (
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    ));
  };

  const handleToggleAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((current) => current.filter((id) => !filteredProducts.some((product) => product.id === id)));
      return;
    }

    setSelectedIds((current) => Array.from(new Set([...current, ...filteredProducts.map((product) => product.id)])));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formState.name.trim()) { addToast('Product name is required', 'error'); return; }
    if (!formState.category.trim()) { addToast('Category is required', 'error'); return; }
    if (!formState.material.trim()) { addToast('Material is required', 'error'); return; }
    if (Number(formState.price) <= 0) { addToast('Price must be greater than 0', 'error'); return; }
    if (!formState.shortDescription.trim()) { addToast('Short description is required', 'error'); return; }
    if (!formState.description.trim()) { addToast('Full description is required', 'error'); return; }

    setIsSaving(true);

    try {
      const payload = {
        ...formState,
        images: parseImages(formState.imagesText),
      };

      const savedProduct = await upsertProduct(payload, activeProductId);
      addToast(activeProductId ? 'Product updated successfully' : 'New product added to inventory', 'success');
      setIsCreatingNew(false);
      setActiveProductId(savedProduct.id);
      setFormState(buildFormState(savedProduct));
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Could not save product', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activeProduct) return;

    const shouldDelete = window.confirm(`Delete "${activeProduct.name}" from inventory?`);
    if (!shouldDelete) return;

    setIsSaving(true);

    try {
      await deleteProduct(activeProduct.id);
      addToast('Product removed from inventory', 'success');
      setActiveProductId('');
      setIsCreatingNew(false);
      setFormState(EMPTY_FORM);
      setSelectedIds((current) => current.filter((id) => id !== activeProduct.id));
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Could not delete product', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const shouldDelete = window.confirm(`Delete ${selectedIds.length} selected products?`);
    if (!shouldDelete) return;

    setIsSaving(true);

    try {
      await bulkDeleteProducts(selectedIds);
      addToast(`${selectedIds.length} products removed`);
      setSelectedIds([]);

      if (selectedIds.includes(activeProductId)) {
        setActiveProductId('');
        setIsCreatingNew(false);
        setFormState(EMPTY_FORM);
      }
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Could not delete selected products', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkFlagUpdate = async (changes, message) => {
    if (selectedIds.length === 0) return;
    setIsSaving(true);

    try {
      await bulkUpdateProducts(selectedIds, changes);
      addToast(message);
      setSelectedIds([]);
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Could not update selected products', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isHydrated || !ordersHydrated) {
    return (
      <section className="container-shell py-10 md:py-16">
        <div className="premium-panel h-[720px] skeleton-shimmer" />
      </section>
    );
  }

  return (
    <section className="container-shell py-10 md:py-16">
      <ScrollReveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              <span className="inline-block h-px w-8 bg-terracotta" />
              Inventory Workspace
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-none text-cocoa md:text-5xl">Manage products, stock, pricing, and imagery</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-stone-500">
              Oversee the catalog, update inventory, review orders, and keep the storefront presentation sharp across every collection.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <a href="#product-workspace" onClick={handleCreateNew} className="button-secondary text-xs">
              New Product
            </a>
            <button type="button" onClick={async () => {
              try {
                const res = await fetch('/api/products/sync-defaults', { method: 'POST' });
                if (res.ok) {
                  await refreshProducts();
                  addToast('Catalog synced with default products', 'success');
                } else {
                  addToast('Sync failed', 'error');
                }
              } catch { addToast('Sync failed', 'error'); }
            }} className="rounded-full border border-cocoa/12 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-cocoa transition hover:bg-sand">
              Sync Catalog
            </button>
            <button type="button" onClick={handleLogout} className="rounded-full border border-cocoa/12 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-cocoa transition hover:bg-sand">
              Logout
            </button>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="mt-8 rounded-[2rem] border border-cocoa/10 bg-cocoa p-6 text-white shadow-soft">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
            {[
              [`${inventoryStats.totalProducts}`, 'Products'],
              [`${inventoryStats.totalUnits}`, 'Units in stock'],
              [`${inventoryStats.lowStock}`, 'Low stock'],
              [`${inventoryStats.outOfStock}`, 'Out of stock'],
              [`${orderStats.totalOrders}`, 'Orders'],
              [`${orderStats.pendingOrders}`, 'Pending'],
              [`${orderStats.totalItems}`, 'Items sold'],
              [formatCurrency(orderStats.totalRevenue), 'Revenue'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="font-serif text-4xl">{value}</p>
                <p className="mt-1 text-sm uppercase tracking-[0.18em] text-white/60">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <p>
              Estimated inventory value: <span className="font-semibold text-white">${inventoryStats.totalValue.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </ScrollReveal>

      <div>
        <div className="mt-10 premium-panel p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">Order Management</p>
              <h2 className="mt-2 font-serif text-4xl text-cocoa">Customer orders</h2>
              <p className="mt-2 text-sm text-stone-500">Manage order status — customers see updates in real time on their tracking page.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-cocoa/10 bg-sand/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cocoa">
                {orderStats.totalOrders} total orders
              </div>
              <button type="button" onClick={() => refreshOrders()} className="rounded-full border border-cocoa/12 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cocoa transition hover:bg-sand">
                Refresh
              </button>
              <button
                type="button"
                onClick={() => setShowOrders((current) => !current)}
                className="rounded-full border border-cocoa/12 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cocoa transition hover:bg-sand"
              >
                {showOrders ? 'Hide Orders' : 'Show Orders'}
              </button>
            </div>
          </div>

          {showOrders && (orders.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-cocoa/15 bg-sand/20 p-8 text-center">
              <p className="font-serif text-2xl text-cocoa">No orders yet</p>
              <p className="mt-2 text-sm text-stone-500">Orders placed from checkout will appear here.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {orders.map((order) => {
                const statusColor = {
                  Placed: 'bg-amber-100 text-amber-700',
                  Confirmed: 'bg-blue-50 text-blue-700',
                  Shipped: 'bg-indigo-50 text-indigo-700',
                  'Out for Delivery': 'bg-purple-50 text-purple-700',
                  Delivered: 'bg-forest/10 text-forest',
                  Cancelled: 'bg-red-50 text-red-600',
                }[order.status] || 'bg-sand text-cocoa';

                return (
                <div key={order.id} className="rounded-[1.75rem] border border-cocoa/10 bg-white/70 p-5 shadow-soft">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-serif text-2xl text-cocoa sm:text-3xl">{order.id}</h3>
                        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusColor}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-stone-500">
                        {order.customer.firstName} {order.customer.lastName} · {order.customer.email} · {order.customer.phone}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        {order.shippingAddress.addressLine1}
                        {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                        {`, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Placed</p>
                      <p className="mt-1 text-sm text-cocoa">{formatTimestamp(order.placedAt)}</p>
                      <p className="mt-3 font-serif text-3xl text-cocoa">{formatCurrency(order.total)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Update Status:</span>
                    {['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={order.status === s || isSaving}
                        onClick={async () => {
                          setIsSaving(true);
                          try {
                            await updateOrderStatus(order.id, s);
                            addToast(`Order ${order.id} marked as ${s}`, 'success');
                          } catch (err) {
                            addToast(err.message || 'Failed to update', 'error');
                          } finally {
                            setIsSaving(false);
                          }
                        }}
                        className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] transition ${order.status === s ? 'bg-cocoa text-white' : 'border border-cocoa/10 bg-white text-cocoa hover:bg-sand disabled:opacity-40'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.id}`} className="flex items-center gap-4 rounded-[1.25rem] border border-cocoa/8 bg-sand/20 p-3">
                        <ImageWithFallback src={item.image || '/images/placeholder-craft.svg'} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-cocoa">{item.name}</p>
                          <p className="text-xs text-stone-400">{item.artisan}</p>
                        </div>
                        <div className="text-right text-sm text-cocoa">
                          <p>Qty {item.quantity}</p>
                          <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div id="product-workspace" ref={productWorkspaceRef} className="mt-10 grid gap-6 lg:gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="xl:h-full">
          <div
            className="premium-panel p-5 md:p-6 xl:flex xl:flex-col xl:overflow-hidden"
            style={catalogPanelHeight ? { height: `${catalogPanelHeight}px` } : undefined}
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">Products</p>
                <h2 className="mt-2 font-serif text-4xl text-cocoa">Catalog management</h2>
                <p className="mt-2 text-sm text-stone-500">Browse live products, search quickly, and open any item for editing.</p>
              </div>
              <div className="rounded-full border border-cocoa/10 bg-sand/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cocoa">
                {filteredProducts.length} visible items
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, SKU, artisan, or category"
                className="mt-5 h-12 flex-1 rounded-2xl border border-cocoa/10 bg-white px-4 text-sm text-cocoa outline-none transition focus:border-cocoa"
              />
              <select
                value={stockFilter}
                onChange={(event) => setStockFilter(event.target.value)}
                className="mt-5 h-12 rounded-2xl border border-cocoa/10 bg-white px-4 text-sm text-cocoa outline-none transition focus:border-cocoa"
              >
                <option value="all">All stock</option>
                <option value="in-stock">In stock</option>
                <option value="low-stock">Low stock</option>
                <option value="out-of-stock">Out of stock</option>
              </select>
            </div>

            <div className="mt-4 rounded-[1.5rem] border border-cocoa/8 bg-sand/30 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-cocoa">
                  <input type="checkbox" checked={allVisibleSelected} onChange={handleToggleAllVisible} className="h-4 w-4 accent-[#5d4336]" />
                  Select all visible
                </label>
                <span className="text-sm text-stone-500">{selectedIds.length} selected</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => handleBulkFlagUpdate({ featured: true }, 'Selected products marked as featured')} className="rounded-full border border-cocoa/12 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cocoa transition hover:bg-sand" disabled={selectedIds.length === 0 || isSaving}>
                  Set Featured
                </button>
                <button type="button" onClick={() => handleBulkFlagUpdate({ bestSeller: true }, 'Selected products marked as best sellers')} className="rounded-full border border-cocoa/12 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cocoa transition hover:bg-sand" disabled={selectedIds.length === 0 || isSaving}>
                  Set Best Seller
                </button>
                <button type="button" onClick={() => handleBulkFlagUpdate({ isNew: true }, 'Selected products marked as new arrivals')} className="rounded-full border border-cocoa/12 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cocoa transition hover:bg-sand" disabled={selectedIds.length === 0 || isSaving}>
                  Set New
                </button>
                <button type="button" onClick={handleBulkDelete} className="rounded-full border border-terracotta/20 bg-terracotta/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-terracotta transition hover:bg-terracotta/15" disabled={selectedIds.length === 0 || isSaving}>
                  Delete Selected
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-3 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:pr-2">
              {filteredProducts.map((product) => {
                const isActive = product.id === activeProductId;
                const isSelected = selectedIds.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className={`rounded-[1.5rem] border p-3 transition ${isActive ? 'border-cocoa bg-sand/70 shadow-soft' : 'border-cocoa/8 bg-white/70 hover:border-cocoa/20 hover:bg-sand/40'}`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectedId(product.id)}
                        className="mt-2 h-4 w-4 accent-[#5d4336]"
                        aria-label={`Select ${product.name}`}
                      />
                      <button type="button" onClick={() => handleEditProduct(product.id)} className="flex flex-1 items-center gap-4 text-left">
                        <ImageWithFallback src={product.images[0]} alt={product.name} className="h-16 w-16 rounded-[1rem] object-cover sm:h-20 sm:w-20 sm:rounded-[1.2rem]" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate font-serif text-2xl leading-none text-cocoa">{product.name}</p>
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${product.stock > 5 ? 'bg-forest/10 text-forest' : product.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-terracotta/10 text-terracotta'}`}>
                              {product.stock > 5 ? 'Healthy stock' : product.stock > 0 ? 'Low stock' : 'Out'}
                            </span>
                          </div>
                          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-stone-400">{product.category}</p>
                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-stone-500">
                            <span>{product.sku}</span>
                            <span>${product.price}</span>
                            <span>{product.stock} units</span>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="mt-5 rounded-[1.5rem] border border-dashed border-cocoa/15 bg-sand/30 p-8 text-center">
                <p className="font-serif text-2xl text-cocoa">No matching products</p>
                <p className="mt-2 text-sm text-stone-500">Try a different search or create a new listing.</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <form ref={productFormRef} onSubmit={handleSubmit} className="premium-panel p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                  {activeProduct ? 'Editing Existing Product' : 'Create New Product'}
                </p>
                <h2 className="mt-2 font-serif text-4xl text-cocoa">
                  {activeProduct ? activeProduct.name : 'New inventory item'}
                </h2>
                <p className="mt-2 text-sm text-stone-500">
                  {activeProduct ? `Last updated ${formatTimestamp(activeProduct.updatedAt)}` : 'Add pricing, descriptions, imagery, and stock details.'}
                </p>
              </div>
              {activeProduct && (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Link href={`/products/${activeProduct.id}`} className="button-secondary px-4 py-2.5 text-xs sm:px-5 sm:py-3">View Live</Link>
                  <button type="button" onClick={handleDelete} className="rounded-full border border-terracotta/20 bg-terracotta/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-terracotta transition hover:bg-terracotta/15 sm:px-5 sm:py-3" disabled={isSaving}>
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Product Name</span>
                <input ref={productNameInputRef} name="name" value={formState.name} onChange={handleFieldChange} required className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">SKU</span>
                <input name="sku" value={formState.sku} onChange={handleFieldChange} placeholder="Auto-generated if empty" className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Category</span>
                <input name="category" value={formState.category} onChange={handleFieldChange} list="admin-categories" required className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Material</span>
                <input name="material" value={formState.material} onChange={handleFieldChange} list="admin-materials" required className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Price</span>
                <input name="price" type="number" min="0" step="0.01" value={formState.price} onChange={handleFieldChange} required className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Rating</span>
                <input name="rating" type="number" min="0" max="5" step="0.1" value={formState.rating} onChange={handleFieldChange} className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Stock Units</span>
                <input name="stock" type="number" min="0" step="1" value={formState.stock} onChange={handleFieldChange} required className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Dimensions</span>
                <input name="dimensions" value={formState.dimensions} onChange={handleFieldChange} className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Artisan / Studio</span>
                <input name="artisan" value={formState.artisan} onChange={handleFieldChange} required className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Origin</span>
                <input name="origin" value={formState.origin} onChange={handleFieldChange} required className="mt-2 h-12 w-full rounded-xl border border-cocoa/10 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-cocoa" />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Short Description</span>
              <textarea name="shortDescription" value={formState.shortDescription} onChange={handleFieldChange} rows={3} required className="mt-2 w-full rounded-2xl border border-cocoa/10 bg-white px-4 py-3 text-sm leading-7 text-stone-700 outline-none transition focus:border-cocoa" />
            </label>

            <label className="mt-5 block">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Full Description</span>
              <textarea name="description" value={formState.description} onChange={handleFieldChange} rows={5} required className="mt-2 w-full rounded-2xl border border-cocoa/10 bg-white px-4 py-3 text-sm leading-7 text-stone-700 outline-none transition focus:border-cocoa" />
            </label>

            <label className="mt-5 block">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Craft Story</span>
              <textarea name="story" value={formState.story} onChange={handleFieldChange} rows={4} required className="mt-2 w-full rounded-2xl border border-cocoa/10 bg-white px-4 py-3 text-sm leading-7 text-stone-700 outline-none transition focus:border-cocoa" />
            </label>

            <label className="mt-5 block">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Image URLs</span>
              <textarea
                name="imagesText"
                value={formState.imagesText}
                onChange={handleFieldChange}
                rows={5}
                placeholder="One image URL per line"
                className="mt-2 w-full rounded-2xl border border-cocoa/10 bg-white px-4 py-3 text-sm leading-7 text-stone-700 outline-none transition focus:border-cocoa"
              />
            </label>

            {previewImages.length > 0 && (
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {previewImages.slice(0, 3).map((image, index) => (
                  <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.5rem] border border-cocoa/10 bg-white p-2">
                    <ImageWithFallback src={image} alt={`Preview ${index + 1}`} className="h-36 w-full rounded-[1rem] object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ['featured', 'Featured'],
                ['bestSeller', 'Best Seller'],
                ['isNew', 'New Arrival'],
              ].map(([name, label]) => (
                <label key={name} className="flex items-center gap-3 rounded-2xl border border-cocoa/10 bg-white/70 px-4 py-3 text-sm text-cocoa">
                  <input type="checkbox" name={name} checked={formState[name]} onChange={handleFieldChange} className="h-4 w-4 accent-[#5d4336]" />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button type="submit" className="button-primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : activeProduct ? 'Save Product Changes' : 'Add Product to Inventory'}
              </button>
              <button type="button" onClick={handleCreateNew} className="button-secondary" disabled={isSaving}>
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>

      <datalist id="admin-categories">
        {categories.filter((item) => item !== 'All').map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>
      <datalist id="admin-materials">
        {materials.filter((item) => item !== 'All Materials').map((material) => (
          <option key={material} value={material} />
        ))}
      </datalist>
    </section>
  );
}
