import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { bulkUpdateProducts, createProduct, deleteProducts, isMongoConfigured, listProducts } from '@/lib/inventory-store';

export const dynamic = 'force-dynamic';

function errorResponse(error) {
  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : 'Unknown inventory error',
      mongoConfigured: isMongoConfigured(),
    },
    { status: 500 }
  );
}

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json({ products, mongoConfigured: isMongoConfigured() });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formValues = await request.json();
    const product = await createProduct(formValues);
    return NextResponse.json({ product, mongoConfigured: true }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { ids, changes } = await request.json();
    const products = await bulkUpdateProducts(ids, changes);
    return NextResponse.json({ products, mongoConfigured: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = await deleteProducts(body?.ids || []);
    return NextResponse.json({ ...result, mongoConfigured: true });
  } catch (error) {
    return errorResponse(error);
  }
}
