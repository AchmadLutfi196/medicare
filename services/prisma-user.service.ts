// Prisma User service for user management
import prisma from '@/lib/prisma';
import { User, ApiResponse } from '../types/database';

export class PrismaUserService {
  private static instance: PrismaUserService;
  
  static getInstance(): PrismaUserService {
    if (!PrismaUserService.instance) {
      PrismaUserService.instance = new PrismaUserService();
    }
    return PrismaUserService.instance;
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
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
      console.error('Error getting user by ID:', error);
      return {
        success: false,
        error: 'Failed to retrieve user'
      };
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
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
      console.error('Error getting user by email:', error);
      return {
        success: false,
        error: 'Failed to retrieve user'
      };
    }
  }

  /**
   * Get all users with optional filtering
   */
  async getUsers(options?: { role?: string, isActive?: boolean }): Promise<ApiResponse<User[]>> {
    try {
      const where: any = {};
      
      if (options?.role) {
        where.role = options.role;
      }
      
      if (options?.isActive !== undefined) {
        where.isActive = options.isActive;
      }
      
      const users = await prisma.user.findMany({ where });
      
      return {
        success: true,
        data: users
      };
    } catch (error) {
      console.error('Error getting users:', error);
      return {
        success: false,
        error: 'Failed to retrieve users'
      };
    }
  }

  /**
   * Update a user
   */
  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      // Don't allow updating these fields directly
      const { id: userId, createdAt, updatedAt, ...updateData } = userData as any;
      
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData
      });
      
      return {
        success: true,
        data: updatedUser
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: 'Failed to update user'
      };
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    try {
      // In a real app, consider soft delete or checking for related data
      await prisma.user.delete({
        where: { id }
      });
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        error: 'Failed to delete user'
      };
    }
  }
}

export const prismaUserService = PrismaUserService.getInstance();
