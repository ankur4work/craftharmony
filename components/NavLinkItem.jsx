'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinkItem({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        isActive ? 'bg-cocoa text-white shadow-sm' : 'text-stone-600 hover:bg-sand/70 hover:text-cocoa'
      }`}
    >
      {children}
    </Link>
  );
}
