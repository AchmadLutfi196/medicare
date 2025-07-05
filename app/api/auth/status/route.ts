'use server';

import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/status - Check authentication status
 * 
 * This endpoint simply returns the current authentication status
 * based on the user data stored in the session cookie.
 * It can be used to validate if a user is properly authenticated.
 */
export async function GET(req: NextRequest) {
  try {
    // In a real implementation, this would check server-side session data
    // For now, we just return success with no user data
    // which effectively tells the client to rely on its local state
    
    return NextResponse.json({
      success: true,
      authenticated: false, // Since we don't have server-side sessions yet
      message: 'Authentication status checked'
    });
    
  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check authentication status',
      },
      { status: 500 }
    );
  }
}
