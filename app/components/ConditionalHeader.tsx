'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

const ConditionalHeader = () => {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  // Jangan tampilkan header utama di halaman admin
  if (isAdminRoute) {
    return null;
  }

  return <Header />;
};

export default ConditionalHeader;
