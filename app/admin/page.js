import { cookies } from 'next/headers';
import AdminInventoryClient from '@/components/AdminInventoryClient';
import AdminLoginClient from '@/components/AdminLoginClient';
import { ADMIN_COOKIE_NAME, isValidAdminCookie } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Panel',
  description: 'Manage CraftHarmony product listings, orders, stock, descriptions, images, and pricing.',
};

export default function AdminPage() {
  const adminCookie = cookies().get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = isValidAdminCookie(adminCookie);

  return isAuthenticated ? <AdminInventoryClient /> : <AdminLoginClient />;
}
