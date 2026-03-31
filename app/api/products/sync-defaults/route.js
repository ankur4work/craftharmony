import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { isMongoConfigured, syncDefaultProductsToMongo } from '@/lib/inventory-store';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  // Sync is an admin-only maintenance action.
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await syncDefaultProductsToMongo();
    return NextResponse.json({
      insertedCount: result.insertedCount,
      products: result.products,
      mongoConfigured: isMongoConfigured(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Catalog sync failed',
        mongoConfigured: isMongoConfigured(),
      },
      { status: 500 }
    );
  }
}
