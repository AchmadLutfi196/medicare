// Middleware to prevent accessing the login and register pages when already logged in
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check auth status from cookie (for SSR compatibility)
  const currentUser = request.cookies.get('medicare_user');
  
  // For client-side navigation, we also want to respect localStorage
  // But this can only be done client-side in the respective pages
  
  const pathname = request.nextUrl.pathname;

  // If user is logged in and trying to access login or register pages,
  // redirect them to the homepage
  if (currentUser && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Only run middleware on login and register pages
export const config = {
  matcher: ['/login', '/login/', '/register'],
};
