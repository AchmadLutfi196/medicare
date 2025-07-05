// Testimonial service for patient reviews and feedback
import { where, orderBy, QueryConstraint } from 'firebase/firestore';
import { dbService } from './database.service';
import { Testimonial, TestimonialFilters, TestimonialFormData, ApiResponse } from '../types/database';

export class TestimonialService {
  private static instance: TestimonialService;
  private collectionName = 'testimonials';

  static getInstance(): TestimonialService {
    if (!TestimonialService.instance) {
      TestimonialService.instance = new TestimonialService();
    }
    return TestimonialService.instance;
  }

  async createTestimonial(testimonialData: TestimonialFormData, patientName: string): Promise<ApiResponse<Testimonial & { id: string }>> {
    const testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'> = {
      patientId: '', // This would come from auth context
      doctorId: testimonialData.doctorId,
      appointmentId: testimonialData.appointmentId,
      patientName: patientName,
      doctorName: '', // This would be fetched from doctor service
      rating: testimonialData.rating,
      comment: testimonialData.comment,
      treatmentType: testimonialData.treatmentType,
      isVerified: false, // Admin would verify testimonials
      isPublic: testimonialData.isPublic,
      helpfulVotes: 0
    };

    return await dbService.create<Testimonial>(this.collectionName, testimonial);
  }

  async getTestimonialById(id: string): Promise<ApiResponse<Testimonial>> {
    return await dbService.getById<Testimonial>(this.collectionName, id);
  }

  async updateTestimonial(id: string, testimonialData: Partial<Testimonial>): Promise<ApiResponse<void>> {
    return await dbService.update<Testimonial>(this.collectionName, id, testimonialData);
  }

  async deleteTestimonial(id: string): Promise<ApiResponse<void>> {
    return await dbService.delete(this.collectionName, id);
  }

  async getAllTestimonials(filters?: TestimonialFilters): Promise<ApiResponse<Testimonial[]>> {
    const constraints: QueryConstraint[] = [];

    if (filters) {
      if (filters.doctorId) {
        constraints.push(where('doctorId', '==', filters.doctorId));
      }
      if (filters.rating) {
        constraints.push(where('rating', '>=', filters.rating));
      }
      if (filters.verified !== undefined) {
        constraints.push(where('isVerified', '==', filters.verified));
      }
      if (filters.treatmentType) {
        constraints.push(where('treatmentType', '==', filters.treatmentType));
      }
    }

    // Order by creation date descending
    constraints.push(orderBy('createdAt', 'desc'));

    return await dbService.getAll<Testimonial>(this.collectionName, constraints);
  }

  async getPublicTestimonials(filters?: TestimonialFilters): Promise<ApiResponse<Testimonial[]>> {
    const publicFilters = { ...filters, verified: true };
    const constraints: QueryConstraint[] = [
      where('isPublic', '==', true),
      where('isVerified', '==', true)
    ];

    if (filters) {
      if (filters.doctorId) {
        constraints.push(where('doctorId', '==', filters.doctorId));
      }
      if (filters.rating) {
        constraints.push(where('rating', '>=', filters.rating));
      }
      if (filters.treatmentType) {
        constraints.push(where('treatmentType', '==', filters.treatmentType));
      }
    }

    constraints.push(orderBy('createdAt', 'desc'));

    return await dbService.getAll<Testimonial>(this.collectionName, constraints);
  }

  async getDoctorTestimonials(doctorId: string): Promise<ApiResponse<Testimonial[]>> {
    return await this.getPublicTestimonials({ doctorId });
  }

  async getFeaturedTestimonials(limit: number = 6): Promise<ApiResponse<Testimonial[]>> {
    const constraints: QueryConstraint[] = [
      where('isPublic', '==', true),
      where('isVerified', '==', true),
      where('rating', '>=', 4),
      orderBy('helpfulVotes', 'desc'),
      orderBy('createdAt', 'desc')
    ];

    const result = await dbService.getAll<Testimonial>(this.collectionName, constraints);
    
    if (result.success && result.data) {
      // Limit results
      result.data = result.data.slice(0, limit);
    }

    return result;
  }

  async verifyTestimonial(id: string, isVerified: boolean): Promise<ApiResponse<void>> {
    return await this.updateTestimonial(id, { isVerified });
  }

  async toggleTestimonialVisibility(id: string, isPublic: boolean): Promise<ApiResponse<void>> {
    return await this.updateTestimonial(id, { isPublic });
  }

  async addHelpfulVote(id: string): Promise<ApiResponse<void>> {
    const testimonial = await this.getTestimonialById(id);
    
    if (testimonial.success && testimonial.data) {
      const newHelpfulVotes = testimonial.data.helpfulVotes + 1;
      return await this.updateTestimonial(id, { helpfulVotes: newHelpfulVotes });
    }

    return {
      success: false,
      error: 'Testimonial not found'
    };
  }

  // Get testimonial statistics
  async getTestimonialStats(doctorId?: string): Promise<ApiResponse<{
    total: number;
    verified: number;
    public: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
    totalHelpfulVotes: number;
    treatmentTypes: { [key: string]: number };
  }>> {
    try {
      const filters: TestimonialFilters = {};
      if (doctorId) filters.doctorId = doctorId;

      const allTestimonials = await this.getAllTestimonials(filters);
      if (!allTestimonials.success || !allTestimonials.data) {
        throw new Error(allTestimonials.error || 'Failed to get testimonials');
      }

      const testimonials = allTestimonials.data;
      
      // Calculate statistics
      const total = testimonials.length;
      const verified = testimonials.filter(t => t.isVerified).length;
      const publicCount = testimonials.filter(t => t.isPublic && t.isVerified).length;
      
      const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
      const averageRating = total > 0 ? totalRating / total : 0;
      
      const ratingDistribution: { [key: number]: number } = {};
      for (let i = 1; i <= 5; i++) {
        ratingDistribution[i] = testimonials.filter(t => t.rating === i).length;
      }
      
      const totalHelpfulVotes = testimonials.reduce((sum, t) => sum + t.helpfulVotes, 0);
      
      const treatmentTypes: { [key: string]: number } = {};
      testimonials.forEach(t => {
        treatmentTypes[t.treatmentType] = (treatmentTypes[t.treatmentType] || 0) + 1;
      });

      return {
        success: true,
        data: {
          total,
          verified,
          public: publicCount,
          averageRating: Math.round(averageRating * 10) / 10,
          ratingDistribution,
          totalHelpfulVotes,
          treatmentTypes
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Get recent testimonials
  async getRecentTestimonials(limit: number = 10): Promise<ApiResponse<Testimonial[]>> {
    const constraints: QueryConstraint[] = [
      where('isPublic', '==', true),
      where('isVerified', '==', true),
      orderBy('createdAt', 'desc')
    ];

    const result = await dbService.getAll<Testimonial>(this.collectionName, constraints);
    
    if (result.success && result.data) {
      result.data = result.data.slice(0, limit);
    }

    return result;
  }

  // Get testimonials by rating
  async getTestimonialsByRating(rating: number): Promise<ApiResponse<Testimonial[]>> {
    return await this.getPublicTestimonials({ rating });
  }

  // Get testimonials by treatment type
  async getTestimonialsByTreatment(treatmentType: string): Promise<ApiResponse<Testimonial[]>> {
    return await this.getPublicTestimonials({ treatmentType });
  }

  // Get testimonials with pagination
  async getTestimonialsPaginated(page: number = 1, limit: number = 10, filters?: TestimonialFilters) {
    const constraints: QueryConstraint[] = [];

    // Always show only public and verified testimonials for public pages
    constraints.push(where('isPublic', '==', true));
    constraints.push(where('isVerified', '==', true));

    if (filters) {
      if (filters.doctorId) {
        constraints.push(where('doctorId', '==', filters.doctorId));
      }
      if (filters.rating) {
        constraints.push(where('rating', '>=', filters.rating));
      }
      if (filters.treatmentType) {
        constraints.push(where('treatmentType', '==', filters.treatmentType));
      }
    }

    constraints.push(orderBy('createdAt', 'desc'));

    return await dbService.getPaginated<Testimonial>(
      this.collectionName,
      limit,
      undefined,
      constraints
    );
  }

  // Get all unique treatment types
  async getTreatmentTypes(): Promise<ApiResponse<string[]>> {
    const result = await this.getPublicTestimonials();
    if (result.success && result.data) {
      const treatmentTypes = [...new Set(result.data.map(t => t.treatmentType))];
      return {
        success: true,
        data: treatmentTypes.sort()
      };
    }
    return {
      success: false,
      error: result.error || 'Failed to get treatment types'
    };
  }

  // Batch operations for admin
  async batchVerifyTestimonials(ids: string[], isVerified: boolean): Promise<ApiResponse<void>> {
    try {
      const promises = ids.map(id => this.verifyTestimonial(id, isVerified));
      const results = await Promise.all(promises);
      
      const failed = results.filter(r => !r.success);
      if (failed.length > 0) {
        return {
          success: false,
          error: `${failed.length} out of ${ids.length} testimonials failed to update`
        };
      }

      return {
        success: true,
        message: `Successfully updated ${ids.length} testimonials`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export const testimonialService = TestimonialService.getInstance();
