// API route for user authentication and management - SIMPLIFIED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { directLogin } from '../../../lib/auth-utils';

// Helper function to get database connection
async function getDb() {
  return open({
    filename: './prisma/dev.db',
    driver: sqlite3.Database
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check if getting single user by ID
    const id = searchParams.get('id');
    if (id) {
      try {
        const db = await getDb();
        const user = await db.get('SELECT * FROM User WHERE id = ?', [id]);
        
        if (user) {
          // Don't return sensitive information
          delete user.password;
          
          return NextResponse.json({
            success: true,
            data: user
          });
        } else {
          return NextResponse.json({
            success: false,
            error: 'User not found'
          }, { status: 404 });
        }
      } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({
          success: false,
          error: 'Database error'
        }, { status: 500 });
      }
    }

    // Special endpoints
    const endpoint = searchParams.get('endpoint');
    
    if (endpoint === 'current') {
      // Get user ID from cookies
      const cookieStore = cookies();
      const userId = cookieStore.get('userId')?.value;
      
      if (userId) {
        try {
          const db = await getDb();
          const user = await db.get('SELECT * FROM User WHERE id = ?', [userId]);
          
          if (user) {
            // Don't return sensitive information
            delete user.password;
            
            return NextResponse.json({
              success: true,
              data: user
            });
          }
        } catch (error) {
          console.error('Database error:', error);
        }
      }
      
      return NextResponse.json({
        success: false,
        error: 'No user logged in'
      }, { status: 401 });
    }
    
    // Default response for unhandled GET endpoints
    return NextResponse.json({
      success: false,
      error: 'Invalid endpoint'
    }, { status: 400 });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const body = await request.json();

    // Login action
    if (action === 'login') {
      const { email, password } = body;
      const result = await directLogin(email, password);
      
      // If login successful, set cookies
      if (result.success && result.data) {
        const userId = result.data.id;
        cookies().set('userId', userId, { 
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7 // 1 week
        });
      }
      
      return NextResponse.json(result);
    }
    
    // Logout action
    if (action === 'logout') {
      cookies().delete('userId');
      return NextResponse.json({
        success: true,
        data: { message: 'Logged out successfully' }
      });
    }

    // Default response for unhandled POST actions
    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 });
  }
}

// Handle other HTTP methods (not implemented for simplicity)
export async function PUT() {
  return NextResponse.json({ success: false, error: 'Method not implemented' }, { status: 501 });
}

export async function PATCH() {
  return NextResponse.json({ success: false, error: 'Method not implemented' }, { status: 501 });
}

export async function DELETE() {
  return NextResponse.json({ success: false, error: 'Method not implemented' }, { status: 501 });
}
