import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    console.log('Login debug route called');
    
    const body = await request.json();
    console.log('Login attempt for email:', body.email);
    
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }
    
    const result = await authService.login(email, password);
    console.log('Login result:', { success: result.success, error: result.error });
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Invalid credentials'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Login failed due to server error'
    }, { status: 500 });
  }
}
