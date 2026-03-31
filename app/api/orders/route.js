import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { getOrdersCollection } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const ORDER_STATUSES = ['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

function mapDocument(doc) {
  if (!doc) return null;
  const { _id, ...order } = doc;
  return order;
}

// GET /api/orders — fetch orders
// Admin: returns all orders
// Customer: requires ?email= query param, returns matching orders
export async function GET(request) {
  try {
    const collection = await getOrdersCollection();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const isAdmin = isAdminRequest(request);

    if (!isAdmin && !email) {
      return NextResponse.json({ error: 'Email is required to look up orders' }, { status: 400 });
    }

    const query = isAdmin ? {} : { 'customer.email': email.toLowerCase().trim() };
    const docs = await collection.find(query).sort({ placedAt: -1 }).toArray();
    return NextResponse.json({ orders: docs.map(mapDocument) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders — place a new order (public, from checkout)
export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, shippingAddress, items, total } = body;

    if (!customer?.email || !items?.length) {
      return NextResponse.json({ error: 'Missing required order data' }, { status: 400 });
    }

    const stamp = Date.now().toString().slice(-8);
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();

    const order = {
      id: `CH-${stamp}-${suffix}`,
      status: 'Placed',
      placedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer: {
        firstName: customer.firstName?.trim() || '',
        lastName: customer.lastName?.trim() || '',
        email: customer.email.toLowerCase().trim(),
        phone: customer.phone?.trim() || '',
      },
      shippingAddress: {
        addressLine1: shippingAddress?.addressLine1?.trim() || '',
        addressLine2: shippingAddress?.addressLine2?.trim() || '',
        city: shippingAddress?.city?.trim() || '',
        state: shippingAddress?.state?.trim() || '',
        postalCode: shippingAddress?.postalCode?.trim() || '',
        country: shippingAddress?.country?.trim() || '',
      },
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '',
        artisan: item.artisan || '',
      })),
      total: Number(total) || 0,
    };

    const collection = await getOrdersCollection();
    await collection.insertOne(order);

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to place order' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders — admin updates order status
export async function PATCH(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId and status are required' }, { status: 400 });
    }

    if (!ORDER_STATUSES.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${ORDER_STATUSES.join(', ')}` }, { status: 400 });
    }

    const collection = await getOrdersCollection();
    const result = await collection.updateOne(
      { id: orderId },
      { $set: { status, updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updated = await collection.findOne({ id: orderId });
    return NextResponse.json({ order: mapDocument(updated) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update order' },
      { status: 500 }
    );
  }
}
