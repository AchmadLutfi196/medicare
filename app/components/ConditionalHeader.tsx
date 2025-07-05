'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

const ConditionalHeader = () => {
  const pathname = usePathname();
  
  // Routes where header should not be shown
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  
  // Don't show main header on admin routes or auth routes (login/register)
  if (isAdminRoute || isAuthRoute) {
    return null;
  }

  return <Header />;
};

export default ConditionalHeader;
