import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    // Handle both login and register endpoints
    const pathname = request.nextUrl.pathname;
    const isRegister = pathname.endsWith('/register');
    
    const body = await request.json();
    
    if (isRegister) {
      // Handle registration
      const { email, password, firstName, lastName, phone, dateOfBirth, gender, address } = body;
      
      if (!email || !password || !firstName || !lastName || !phone) {
        return NextResponse.json({
          success: false,
          error: 'Missing required fields'
        }, { status: 400 });
      }
      
      const result = await authService.register({
        email,
        password,
        firstName,
        lastName,
        phone,
        dateOfBirth,
        gender: gender?.toUpperCase(),
        address
      });
      
      if (!result.success) {
        return NextResponse.json(result, { status: 400 });
      }
      
      return NextResponse.json(result);
    } else {
      // Handle login
      const { email, password } = body;
      
      if (!email || !password) {
        return NextResponse.json({
          success: false,
          error: 'Email and password are required'
        }, { status: 400 });
      }
      
      const result = await authService.login(email, password);
      
      if (!result.success) {
        return NextResponse.json(result, { status: 401 });
      }
      
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Authentication failed'
    }, { status: 500 });
  }
}
