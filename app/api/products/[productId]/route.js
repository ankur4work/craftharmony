import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { isMongoConfigured, updateProduct } from '@/lib/inventory-store';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formValues = await request.json();
    const product = await updateProduct(params.productId, formValues);
    return NextResponse.json({ product, mongoConfigured: isMongoConfigured() });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown inventory error',
        mongoConfigured: isMongoConfigured(),
      },
      { status: 500 }
    );
  }
}
