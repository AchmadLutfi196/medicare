import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    console.log('Registration API called');
    const body = await request.json();
    
    console.log('Registration body:', JSON.stringify(body, null, 2));
    
    const { email, password, firstName, lastName, phone, dateOfBirth, gender, address } = body;
    
    if (!email || !password || !firstName || !lastName || !phone) {
      console.log('Missing required fields:', { email, firstName, lastName, phone, password: !!password });
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
      gender,
      address
    });
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Registration failed'
    }, { status: 500 });
  }
}
