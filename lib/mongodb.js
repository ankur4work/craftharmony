import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

function getDatabaseName() {
  if (process.env.MONGODB_DB) return process.env.MONGODB_DB;
  if (!uri) return 'craftharmony';

  const match = uri.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/i);
  return match?.[1] || 'craftharmony';
}

function getGlobalCache() {
  if (!globalThis.__craftharmonyMongo) {
    globalThis.__craftharmonyMongo = { client: null, promise: null };
  }

  return globalThis.__craftharmonyMongo;
}

export async function getMongoClient() {
  if (!uri) {
    throw new Error('MONGODB_URI is not configured');
  }

  const cache = getGlobalCache();

  if (cache.client) {
    return cache.client;
  }

  if (!cache.promise) {
    const client = new MongoClient(uri);
    cache.promise = client.connect().then((connectedClient) => {
      cache.client = connectedClient;
      return connectedClient;
    });
  }

  return cache.promise;
}

export async function getInventoryCollection() {
  const mongoClient = await getMongoClient();
  return mongoClient.db(getDatabaseName()).collection('products');
}
