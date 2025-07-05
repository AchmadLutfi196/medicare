import { NextRequest, NextResponse } from 'next/server';
import { createUser, checkUserExists } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    console.log('Direct registration endpoint called');
    
    // Parse request body
    const body = await request.json();
    console.log('Registration data received:', {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      hasPassword: !!body.password
    });
    
    // Extract and normalize registration data
    const { 
      email: rawEmail, 
      password, 
      firstName, 
      lastName, 
      phone, 
      dateOfBirth, 
      gender, 
      address 
    } = body;
    
    // Always normalize email (trim whitespace and convert to lowercase)
    const email = rawEmail ? rawEmail.trim().toLowerCase() : rawEmail;
    console.log('Normalized email for registration:', email);
    
    // Log for debugging
    if (email !== rawEmail) {
      console.log('Email was normalized from:', rawEmail, 'to:', email);
    }
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone) {
      console.log('Registration failed - Missing required fields');
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }
    
    try {
      // Check if user already exists
      console.log('Checking if user exists with email:', email);
      const userExists = await checkUserExists(email);
      
      if (userExists) {
        console.log('Registration failed: Email already in use', email);
        return NextResponse.json({
          success: false,
          error: 'Email sudah terdaftar. Silakan gunakan email lain.'
        }, { status: 400 });
      }

      // Create user with direct SQL approach (bypassing Prisma client)
      console.log('Creating user with direct SQL implementation');
      const result = await createUser({
        email,
        firstName,
        lastName,
        phone,
        password,
        dateOfBirth,
        gender,
        address
      });
      
      console.log('User created successfully:', result.data?.id);
      return NextResponse.json(result);
    } catch (dbError) {
      console.error('Direct database error:', dbError);
      
      let errorMessage = 'Failed to create user account. Please try again.';
      let statusCode = 500;
      
      if (dbError instanceof Error) {
        console.error('Database error details:', dbError);
        
        // Make error messages more specific and user-friendly
        if (dbError.message.includes('Email already in use')) {
          errorMessage = 'Email sudah terdaftar. Silakan gunakan email lain.';
          statusCode = 400;
        } else if (dbError.message.includes('UNIQUE constraint failed')) {
          errorMessage = 'Email sudah terdaftar. Silakan gunakan email lain.';
          statusCode = 400;
        } else if (dbError.message.includes('no such table')) {
          errorMessage = 'Database error: Database structure needs to be updated.';
        } else {
          // Keep technical details in logs but show user-friendly message
          console.error('Detailed error:', dbError.message);
          errorMessage = 'Terjadi masalah saat membuat akun. Silakan coba lagi nanti.';
        }
      }
      
      return NextResponse.json({
        success: false,
        error: errorMessage
      }, { status: statusCode });
    }
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Registration failed due to server error'
    }, { status: 500 });
  }
}
