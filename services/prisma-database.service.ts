// Database service utilities for Prisma
import { prisma } from '../lib/prisma';
import { ApiResponse, PaginatedResponse } from '../types/database';
import { 
  Prisma, 
  PrismaClient 
} from '@prisma/client';

export class DatabaseService {
  private static instance: DatabaseService;

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Generic methods for CRUD operations
  async create<T>(model: string, data: any): Promise<ApiResponse<T>> {
    try {
      const result = await (prisma as any)[model].create({
        data,
      });
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error(`Error creating ${model}:`, error);
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  async getById<T>(model: string, id: string): Promise<ApiResponse<T>> {
    try {
      const result = await (prisma as any)[model].findUnique({
        where: { id },
      });
      
      if (!result) {
        return {
          success: false,
          error: `${model} not found`,
        };
      }
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error(`Error getting ${model}:`, error);
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  async update<T>(model: string, id: string, data: any): Promise<ApiResponse<T>> {
    try {
      const result = await (prisma as any)[model].update({
        where: { id },
        data,
      });
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error(`Error updating ${model}:`, error);
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  async delete<T>(model: string, id: string): Promise<ApiResponse<T>> {
    try {
      const result = await (prisma as any)[model].delete({
        where: { id },
      });
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error(`Error deleting ${model}:`, error);
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  async list<T>(
    model: string, 
    options: {
      page?: number;
      limit?: number;
      where?: Record<string, any>;
      orderBy?: Record<string, 'asc' | 'desc'>;
      include?: Record<string, boolean>;
    } = {}
  ): Promise<PaginatedResponse<T>> {
    try {
      const {
        page = 1,
        limit = 10,
        where = {},
        orderBy = { createdAt: 'desc' },
        include = {},
      } = options;
      
      const skip = (page - 1) * limit;
      
      const [items, totalCount] = await Promise.all([
        (prisma as any)[model].findMany({
          where,
          orderBy,
          include,
          skip,
          take: limit,
        }),
        (prisma as any)[model].count({ where }),
      ]);
      
      return {
        success: true,
        data: items,
        meta: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    } catch (error) {
      console.error(`Error listing ${model}:`, error);
      return {
        success: false,
        error: this.handleError(error),
        meta: {
          page: options.page || 1,
          limit: options.limit || 10,
          totalCount: 0,
          totalPages: 0,
        },
      };
    }
  }

  // Helper to handle Prisma errors
  private handleError(error: unknown): string {
    const prismaError = error as any;
    
    if (prismaError && prismaError.code) {
      // Handle Prisma error codes
      if (prismaError.code === 'P2002') {
        return `A record with this unique constraint already exists`;
      }
      if (prismaError.code === 'P2025') {
        return `Record not found`;
      }
    }
    return error instanceof Error ? error.message : 'An unknown error occurred';
  }
}
