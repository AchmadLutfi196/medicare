// API route for user authentication and management
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../services/user.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check if getting single user by ID
    const id = searchParams.get('id');
    if (id) {
      const result = await userService.getUserById(id);
      return NextResponse.json(result);
    }

    // Special endpoints
    const endpoint = searchParams.get('endpoint');
    
    if (endpoint === 'current') {
      const currentUser = userService.getCurrentUser();
      if (currentUser) {
        return NextResponse.json({
          success: true,
          data: currentUser
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'No user logged in'
        }, { status: 401 });
      }
    }
    
    if (endpoint === 'stats') {
      const result = await userService.getUserStats();
      return NextResponse.json(result);
    }

    // Get users by role or all users
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    
    if (search) {
      const result = await userService.searchUsers(
        search, 
        role as any || undefined
      );
      return NextResponse.json(result);
    }
    
    // Check if pagination is requested
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    
    if (page && limit) {
      const result = await userService.getUsersPaginated(
        parseInt(page), 
        parseInt(limit), 
        role as any || undefined
      );
      return NextResponse.json(result);
    } else {
      const result = await userService.getAllUsers(role as any || undefined);
      return NextResponse.json(result);
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const body = await request.json();
    
    let result;
    
    if (action === 'register') {
      const { email, password, firstName, lastName, phone, role, dateOfBirth, gender, address } = body;
      result = await userService.register(email, password, firstName, lastName, phone, role, dateOfBirth, gender, address);
    } else if (action === 'login') {
      const { email, password } = body;
      result = await userService.login(email, password);
    } else if (action === 'logout') {
      result = await userService.logout();
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }
    
    if (result.success) {
      return NextResponse.json(result, { 
        status: action === 'register' ? 201 : 200 
      });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');
    
    if (!id && action !== 'profile') {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    let result;
    
    if (action === 'profile') {
      result = await userService.updateProfile(body);
    } else if (action === 'activate') {
      result = await userService.activateUser(id!);
    } else if (action === 'deactivate') {
      result = await userService.deactivateUser(id!);
    } else if (action === 'profile-image') {
      result = await userService.updateProfileImage(body.imageUrl);
    } else {
      result = await userService.updateUser(id!, body);
    }
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const result = await userService.deleteUser(id);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
