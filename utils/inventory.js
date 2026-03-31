import { categories as defaultCategories, collectionHighlights, materials as defaultMaterials, products as seedProducts } from '@/data/products';

export const INVENTORY_STORAGE_KEY = 'craftharmony-inventory';

const DEFAULT_STOCK = 12;
const DEFAULT_RATING = 4.8;

function sanitizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function sanitizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function ensureArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => sanitizeText(item)).filter(Boolean);
}

export function slugify(value) {
  return sanitizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createUniqueProductId(name, existingIds = [], currentId = '') {
  const reservedIds = new Set(existingIds.filter((id) => id && id !== currentId));
  const baseId = slugify(name) || 'product-item';

  if (!reservedIds.has(baseId)) return baseId;

  let suffix = 2;
  while (reservedIds.has(`${baseId}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseId}-${suffix}`;
}

export function normalizeProduct(product, index = 0) {
  const name = sanitizeText(product?.name) || `Untitled Product ${index + 1}`;
  const id = sanitizeText(product?.id) || createUniqueProductId(name);
  const images = ensureArray(product?.images);

  return {
    id,
    name,
    category: sanitizeText(product?.category) || 'Uncategorized',
    material: sanitizeText(product?.material) || 'Mixed Materials',
    price: sanitizeNumber(product?.price, 0),
    rating: Math.min(5, Math.max(0, sanitizeNumber(product?.rating, DEFAULT_RATING))),
    stock: Math.max(0, Math.round(sanitizeNumber(product?.stock, DEFAULT_STOCK))),
    sku: sanitizeText(product?.sku) || `CH-${id.slice(0, 8).toUpperCase()}`,
    origin: sanitizeText(product?.origin) || 'Origin not specified',
    artisan: sanitizeText(product?.artisan) || 'CraftHarmony Studio',
    dimensions: sanitizeText(product?.dimensions) || 'Made to order',
    shortDescription: sanitizeText(product?.shortDescription) || 'Handcrafted product from CraftHarmony.',
    description: sanitizeText(product?.description) || 'Description coming soon.',
    story: sanitizeText(product?.story) || 'Every piece carries a story of craft and care.',
    images: images.length ? images : ['/images/placeholder-craft.svg'],
    featured: Boolean(product?.featured),
    bestSeller: Boolean(product?.bestSeller),
    isNew: Boolean(product?.isNew),
    createdAt: sanitizeText(product?.createdAt) || new Date().toISOString(),
    updatedAt: sanitizeText(product?.updatedAt) || new Date().toISOString(),
  };
}

export function normalizeInventory(items = []) {
  return items.map((item, index) => normalizeProduct(item, index));
}

export function getDefaultInventory() {
  return normalizeInventory(seedProducts);
}

export function getStoredInventory() {
  if (typeof window === 'undefined') return getDefaultInventory();

  try {
    const raw = window.localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!raw) return getDefaultInventory();

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return getDefaultInventory();

    return normalizeInventory(parsed);
  } catch {
    return getDefaultInventory();
  }
}

export function setStoredInventory(items) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(normalizeInventory(items)));
  } catch {}
}

export function deriveCategories(items) {
  const dynamicCategories = Array.from(
    new Set(
      normalizeInventory(items)
        .map((product) => product.category)
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));

  const preferredOrder = defaultCategories.filter((item) => item !== 'All');
  const ordered = [
    ...preferredOrder.filter((item) => dynamicCategories.includes(item)),
    ...dynamicCategories.filter((item) => !preferredOrder.includes(item)),
  ];

  return ['All', ...ordered];
}

export function deriveMaterials(items) {
  const dynamicMaterials = Array.from(
    new Set(
      normalizeInventory(items)
        .map((product) => product.material)
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));

  const preferredOrder = defaultMaterials.filter((item) => item !== 'All Materials');
  const ordered = [
    ...preferredOrder.filter((item) => dynamicMaterials.includes(item)),
    ...dynamicMaterials.filter((item) => !preferredOrder.includes(item)),
  ];

  return ['All Materials', ...ordered];
}

export function deriveCollectionHighlights(items) {
  const inventory = normalizeInventory(items);
  const productCountByCategory = inventory.reduce((accumulator, product) => {
    accumulator[product.category] = (accumulator[product.category] || 0) + 1;
    return accumulator;
  }, {});

  const imageByCategory = inventory.reduce((accumulator, product) => {
    if (!accumulator[product.category]) {
      accumulator[product.category] = product.images[0];
    }
    return accumulator;
  }, {});

  const baseHighlights = collectionHighlights
    .map((highlight) => ({
      ...highlight,
      productCount: productCountByCategory[highlight.title] || 0,
      image: imageByCategory[highlight.title] || highlight.image,
    }))
    .filter((highlight) => highlight.productCount > 0);

  const existingTitles = new Set(baseHighlights.map((item) => item.title));

  const extraHighlights = Object.entries(productCountByCategory)
    .filter(([category]) => !existingTitles.has(category))
    .map(([category, productCount]) => ({
      id: slugify(category),
      title: category,
      subtitle: 'New Collection',
      description: 'Freshly added products from the CraftHarmony admin collection.',
      image: imageByCategory[category] || '/images/placeholder-craft.svg',
      productCount,
    }));

  return [...baseHighlights, ...extraHighlights];
}

export function buildProductPayload(formValues, existingProducts = [], currentId = '') {
  const id = createUniqueProductId(formValues.name, existingProducts.map((item) => item.id), currentId);
  const existingProduct = existingProducts.find((item) => item.id === currentId);

  return normalizeProduct({
    ...existingProduct,
    ...formValues,
    id,
    images: formValues.images,
    updatedAt: new Date().toISOString(),
    createdAt: existingProduct?.createdAt || new Date().toISOString(),
  });
}

export function getInventoryStats(items) {
  const inventory = normalizeInventory(items);

  return inventory.reduce(
    (stats, product) => {
      stats.totalProducts += 1;
      stats.totalUnits += product.stock;
      stats.totalValue += product.price * product.stock;
      if (product.stock === 0) stats.outOfStock += 1;
      if (product.stock > 0 && product.stock <= 5) stats.lowStock += 1;
      return stats;
    },
    { totalProducts: 0, totalUnits: 0, totalValue: 0, outOfStock: 0, lowStock: 0 }
  );
}
