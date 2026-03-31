import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, getAdminSessionValue, isValidAdminCredentials } from '@/lib/admin-auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!isValidAdminCredentials(username, password)) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE_NAME, getAdminSessionValue(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
