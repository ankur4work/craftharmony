'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinkItem({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return <Link href={href} className={`text-sm font-medium transition ${isActive ? 'text-cocoa' : 'text-stone-600 hover:text-cocoa'}`}>{children}</Link>;
}
