import { products as seedProducts } from '@/data/products';
import { getInventoryCollection } from '@/lib/mongodb';
import { buildProductPayload, normalizeInventory } from '@/utils/inventory';

function mapDocument(document) {
  if (!document) return null;
  const { _id, ...product } = document;
  return product;
}

export function isMongoConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

async function ensureSeededInventory() {
  const collection = await getInventoryCollection();
  const count = await collection.countDocuments();

  if (count === 0) {
    const defaultInventory = normalizeInventory(seedProducts);
    if (defaultInventory.length > 0) {
      await collection.insertMany(defaultInventory);
    }
  }

  return collection;
}

export async function syncDefaultProductsToMongo() {
  if (!isMongoConfigured()) {
    return { insertedCount: 0, products: normalizeInventory(seedProducts) };
  }

  const collection = await getInventoryCollection();
  const existingDocuments = await collection.find({}, { projection: { id: 1 } }).toArray();
  const existingIds = new Set(existingDocuments.map((document) => document.id).filter(Boolean));
  const defaultInventory = normalizeInventory(seedProducts);
  const missingProducts = defaultInventory.filter((product) => !existingIds.has(product.id));

  if (missingProducts.length > 0) {
    await collection.insertMany(missingProducts);
  }

  const products = await listProducts();
  return { insertedCount: missingProducts.length, products };
}

export async function listProducts() {
  if (!isMongoConfigured()) {
    return normalizeInventory(seedProducts);
  }

  const collection = await ensureSeededInventory();
  const documents = await collection.find({}).sort({ updatedAt: -1, createdAt: -1 }).toArray();
  return normalizeInventory(documents.map(mapDocument));
}

export async function createProduct(formValues) {
  const collection = await ensureSeededInventory();
  const existingProducts = await listProducts();
  const product = buildProductPayload(formValues, existingProducts);

  await collection.insertOne(product);
  return product;
}

export async function updateProduct(productId, formValues) {
  const collection = await ensureSeededInventory();
  const existingProducts = await listProducts();
  const product = buildProductPayload(formValues, existingProducts, productId);

  await collection.updateOne({ id: productId }, { $set: product });
  return product;
}

export async function deleteProducts(productIds = []) {
  const ids = productIds.filter(Boolean);
  if (ids.length === 0) return { deletedCount: 0 };

  const collection = await ensureSeededInventory();
  const result = await collection.deleteMany({ id: { $in: ids } });
  return { deletedCount: result.deletedCount || 0 };
}

export async function bulkUpdateProducts(productIds = [], changes = {}) {
  const ids = productIds.filter(Boolean);
  if (ids.length === 0) return [];

  const allowedChanges = {};

  ['featured', 'bestSeller', 'isNew'].forEach((key) => {
    if (typeof changes[key] === 'boolean') {
      allowedChanges[key] = changes[key];
    }
  });

  if (Object.keys(allowedChanges).length === 0) return listProducts();

  const collection = await ensureSeededInventory();

  await collection.updateMany(
    { id: { $in: ids } },
    {
      $set: {
        ...allowedChanges,
        updatedAt: new Date().toISOString(),
      },
    }
  );

  return listProducts();
}
