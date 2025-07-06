// Doctor service for CRUD operations
import { DatabaseService } from './database.service';
import { Doctor, DoctorFilters, ApiResponse } from '../types/database';

const dbService = DatabaseService.getInstance();

export class DoctorService {
  private static instance: DoctorService;
  private collectionName = 'doctors';

  static getInstance(): DoctorService {
    if (!DoctorService.instance) {
      DoctorService.instance = new DoctorService();
    }
    return DoctorService.instance;
  }

  async createDoctor(doctorData: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Doctor & { id: string }>> {
    return await dbService.create<Doctor>(this.collectionName, doctorData);
  }

  async getDoctorById(id: string): Promise<ApiResponse<Doctor>> {
    return await dbService.getById<Doctor>(this.collectionName, id);
  }

  async updateDoctor(id: string, doctorData: Partial<Doctor>): Promise<ApiResponse<void>> {
    return await dbService.update<Doctor>(this.collectionName, id, doctorData);
  }

  async deleteDoctor(id: string): Promise<ApiResponse<void>> {
    return await dbService.delete(this.collectionName, id);
  }

  async getAllDoctors(filters?: DoctorFilters): Promise<ApiResponse<Doctor[]>> {
    console.warn("Firebase constraints have been removed. Using mock database implementation with client-side filtering.");
    
    // Get all doctors from the mock database
    const result = await dbService.getAll<Doctor>(this.collectionName);
    
    // Apply client-side filters
    if (result.success && result.data && result.data.length > 0) {
      if (filters) {
        // Filter by specialty
        if (filters.specialty) {
          result.data = result.data.filter(doctor => 
            doctor.specialty === filters.specialty
          );
        }
        
        // Filter by availability
        if (filters.availability !== undefined) {
          result.data = result.data.filter(doctor => 
            doctor.isAvailable === filters.availability
          );
        }
        
        // Filter by rating
        if (filters.rating) {
          result.data = result.data.filter(doctor => 
            doctor.rating >= (filters.rating || 0)
          );
        }
        
        // Filter by consultation type
        if (filters.consultationType) {
          result.data = result.data.filter(doctor => 
            doctor.consultationTypes && 
            doctor.consultationTypes.includes(filters.consultationType as any)
          );
        }
        
        // Filter by search term
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          result.data = result.data.filter(doctor => 
            doctor.name.toLowerCase().includes(searchTerm) ||
            doctor.specialty.toLowerCase().includes(searchTerm) ||
            (doctor.bio && doctor.bio.toLowerCase().includes(searchTerm))
          );
        }
      }
      
      // Sort by rating descending
      result.data.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }

  async getDoctorsBySpecialty(specialty: string): Promise<ApiResponse<Doctor[]>> {
    return await this.getAllDoctors({ specialty });
  }

  async getAvailableDoctors(): Promise<ApiResponse<Doctor[]>> {
    return await this.getAllDoctors({ availability: true });
  }

  async searchDoctors(searchTerm: string): Promise<ApiResponse<Doctor[]>> {
    return await this.getAllDoctors({ search: searchTerm });
  }

  async updateDoctorRating(doctorId: string, newRating: number, reviewCount: number): Promise<ApiResponse<void>> {
    return await this.updateDoctor(doctorId, { 
      rating: newRating, 
      reviewCount: reviewCount 
    });
  }

  async toggleDoctorAvailability(doctorId: string, isAvailable: boolean): Promise<ApiResponse<void>> {
    return await this.updateDoctor(doctorId, { isAvailable });
  }

  async getDoctorSchedule(doctorId: string): Promise<ApiResponse<Doctor['schedule']>> {
    const result = await this.getDoctorById(doctorId);
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.schedule
      };
    }
    return {
      success: false,
      error: result.error || 'Doctor not found'
    };
  }

  async updateDoctorSchedule(doctorId: string, schedule: Doctor['schedule']): Promise<ApiResponse<void>> {
    return await this.updateDoctor(doctorId, { schedule });
  }

  // Get doctors with pagination
  async getDoctorsPaginated(page: number = 1, limit: number = 10, filters?: DoctorFilters) {
    console.warn("Firebase constraints have been removed. Using mock database implementation with client-side pagination.");
    
    // First get all doctors with filters applied
    const result = await this.getAllDoctors(filters);

    // Implement client-side pagination
    if (result.success && result.data) {
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const items = result.data.slice(startIndex, endIndex);
      const total = result.data.length;
      
      return {
        success: true,
        data: {
          items,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    }
    
    return result;
  }

  // Get unique specialties
  async getSpecialties(): Promise<ApiResponse<string[]>> {
    const result = await this.getAllDoctors();
    if (result.success && result.data) {
      const specialties = [...new Set(result.data.map(doctor => doctor.specialty))];
      return {
        success: true,
        data: specialties.sort()
      };
    }
    return {
      success: false,
      error: result.error || 'Failed to get specialties'
    };
  }

  // Batch operations
  async createMultipleDoctors(doctorsData: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<ApiResponse<string[]>> {
    return await dbService.batchCreate<Doctor>(this.collectionName, doctorsData);
  }
}

export const doctorService = DoctorService.getInstance();
