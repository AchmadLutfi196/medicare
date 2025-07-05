// Authentication service using Prisma
import prisma from '@/lib/prisma';
import { User } from '../types/database';

interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface RegisterData {
  email: string;
  password: string; // Note: In a real app, you'd hash this password
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
}

export class AuthService {
  private static instance: AuthService;
  
  private constructor() {}
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<AuthResponse<User>> {
    try {
      console.log('Auth service register function called with:', { 
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        hasPassword: !!userData.password,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth,
        hasAddress: !!userData.address,
        phone: userData.phone
      });
      
      // Validate required fields again
      if (!userData.email || !userData.password || !userData.firstName || 
          !userData.lastName || !userData.phone) {
        console.log('Missing required fields in auth service');
        return {
          success: false,
          error: 'Missing required registration fields'
        };
      }
      
      // Check if user exists
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: userData.email }
        });
        
        if (existingUser) {
          console.log('Registration failed: Email already in use', userData.email);
          return {
            success: false,
            error: 'Email already in use'
          };
        }
      } catch (findError) {
        console.error('Error checking for existing user:', findError);
      }
      
      // Create user with simplified approach
      try {
        console.log('Creating user with data:', {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          hasPassword: !!userData.password,
          phone: userData.phone
        });
        
        // Create the most basic user object first
        const createData: any = {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          password: userData.password,
          role: 'PATIENT', // This should match one of the enum values in the schema
          isActive: true
        };
        
        // Add optional fields separately to avoid undefined issues
        if (userData.dateOfBirth) createData.dateOfBirth = userData.dateOfBirth;
        if (userData.gender) createData.gender = userData.gender;
        if (userData.address) createData.address = userData.address;
        
        console.log('Final user data being sent to Prisma:', {
          ...createData,
          password: '********' // Don't log the actual password
        });
        
        const newUser = await prisma.user.create({
          data: createData
        });
        
        // Hide password from returned user object
        const userWithoutPassword = { ...newUser, password: undefined };
        
        console.log('User created successfully:', userWithoutPassword.id);
        return {
          success: true,
          data: userWithoutPassword
        };
      } catch (dbError) {
        console.error('Database error during user creation:', dbError);
        
        let errorMessage = 'Failed to create user account. Please try again.';
        if (dbError instanceof Error) {
          console.error('Error details:', dbError.message);
          
          if (dbError.message.includes('Unique constraint')) {
            errorMessage = 'Email already exists. Please use a different email address.';
          } else {
            // Include error message details for debugging
            errorMessage = `Database error: ${dbError.message}`;
          }
        }
        
        return {
          success: false,
          error: errorMessage
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Failed to register user'
      };
    }
  }

  /**
   * Login a user
   */
  async login(email: string, password: string): Promise<AuthResponse<User>> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }
      
      // Check password (in production, use proper password hashing)
      // For now we'll just do a direct comparison
      if (user.password !== password) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }
      
      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          error: 'Account is not active'
        };
      }
      
      // Hide password from returned user object
      const userWithoutPassword = { ...user, password: undefined };
      
      return {
        success: true,
        data: userWithoutPassword
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Failed to login'
      };
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<AuthResponse<User>> {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }
      
      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Get user error:', error);
      return {
        success: false,
        error: 'Failed to get user'
      };
    }
  }
}

export const authService = AuthService.getInstance();
