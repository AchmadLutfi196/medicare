import { NextRequest, NextResponse } from 'next/server';
import { directLogin } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    console.log('Direct login endpoint called');
    
    const body = await request.json();
    console.log('Login attempt for email:', body.email);
    
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email dan password wajib diisi'
      }, { status: 400 });
    }
    
    const result = await directLogin(email, password);
    console.log('Direct login result:', { success: result.success });
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Email atau password salah'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Login gagal karena kesalahan sistem'
    }, { status: 500 });
  }
}
