import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    console.log('Registration debug route called');
    
    const body = await request.json();
    console.log('Registration body received:', JSON.stringify(body, null, 2));
    
    // Extract registration data
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      dateOfBirth, 
      gender, 
      address 
    } = body;
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone) {
      console.log('Registration failed - Missing required fields:', { 
        email: !!email, 
        password: !!password,
        firstName: !!firstName, 
        lastName: !!lastName, 
        phone: !!phone 
      });
      
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }
    
    // Ensure gender is one of the expected values
    let validatedGender = gender;
    if (gender && !['MALE', 'FEMALE', 'OTHER'].includes(gender)) {
      console.log(`Invalid gender value: ${gender}, defaulting to null`);
      validatedGender = undefined;
    }
    
    console.log('Calling auth service with validated data:', {
      email, 
      firstName, 
      lastName,
      phone,
      dateOfBirth: dateOfBirth || null,
      gender: validatedGender,
      hasAddress: !!address
    });
    
    // Direct Prisma test for debugging
    try {
      const prismaClient = await import('@/lib/prisma').then(m => m.default);
      
      console.log('Testing direct Prisma connection...');
      const userCount = await prismaClient.user.count();
      console.log('Current user count:', userCount);
      
      // Directly test if we can create a user with Prisma
      console.log('Testing direct Prisma user creation...');
      try {
        const userData = {
          email,
          firstName,
          lastName,
          phone,
          password,
          dateOfBirth: dateOfBirth || undefined,
          gender: validatedGender as any,
          address: address || undefined,
          role: 'PATIENT',
          isActive: true
        };
        
        console.log('User creation data:', {
          ...userData,
          password: '********'
        });
        
        // Register the user
        console.log('Calling auth service register with validated data');
        const result = await authService.register({
          email,
          password,
          firstName,
          lastName,
          phone,
          dateOfBirth,
          gender: validatedGender,
          address
        });
        
        console.log('Auth service register returned:', {
          success: result.success,
          error: result.error,
          hasData: !!result.data
        });
        
        return NextResponse.json(result);
      } catch (dbError) {
        console.error('Direct Prisma error:', dbError);
        
        let errorMessage = 'Failed to create user account. Please try again.';
        if (dbError instanceof Error) {
          errorMessage = `Database error: ${dbError.message}`;
          console.error('Error details:', dbError);
        }
        
        return NextResponse.json({
          success: false,
          error: errorMessage
        }, { status: 500 });
      }
    } catch (e) {
      console.error('Direct API error:', e);
      return NextResponse.json({
        success: false,
        error: e instanceof Error ? e.message : 'Unknown error occurred'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Registration failed due to server error'
    }, { status: 500 });
  }
}
