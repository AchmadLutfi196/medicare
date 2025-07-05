// Direct login debugger endpoint - for testing purposes only
import { NextRequest, NextResponse } from 'next/server';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export async function POST(request: NextRequest) {
  try {
    console.log('Direct login debug endpoint called');
    
    const body = await request.json();
    console.log('Checking credentials for email:', body.email);
    
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email dan password wajib diisi'
      }, { status: 400 });
    }
    
    // Open database connection
    const db = await open({
      filename: './prisma/dev.db',
      driver: sqlite3.Database
    });

    try {
      // Normalize email
      const normalizedEmail = email.toLowerCase().trim();
      console.log('Normalized email:', normalizedEmail);
      
      // Get raw user data from database
      const user = await db.get(
        'SELECT id, email, password FROM User WHERE LOWER(email) = ?',
        [normalizedEmail]
      );
      
      if (!user) {
        console.log('User not found with email:', normalizedEmail);
        return NextResponse.json({
          success: false,
          error: 'User not found',
          debug: { emailUsed: normalizedEmail }
        });
      }
      
      // Check password
      const passwordMatch = user.password === password;
      console.log('Password check:', {
        storedPassword: user.password,
        enteredPassword: password,
        match: passwordMatch
      });
      
      return NextResponse.json({
        success: true,
        debug: {
          userFound: true,
          id: user.id,
          email: user.email,
          storedPasswordLength: user.password.length,
          enteredPasswordLength: password.length,
          passwordsMatch: passwordMatch,
          storedPassword: user.password, // Only include in development environment
          enteredPassword: password, // Only include in development environment
        }
      });
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('Login debug API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Error in debug endpoint'
    }, { status: 500 });
  }
}
