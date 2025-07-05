// Doctor service for CRUD operations
import { where, orderBy, QueryConstraint } from 'firebase/firestore';
import { dbService } from './database.service';
import { Doctor, DoctorFilters, ApiResponse } from '../types/database';

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
    const constraints: QueryConstraint[] = [];

    if (filters) {
      if (filters.specialty) {
        constraints.push(where('specialty', '==', filters.specialty));
      }
      if (filters.availability !== undefined) {
        constraints.push(where('isAvailable', '==', filters.availability));
      }
      if (filters.rating) {
        constraints.push(where('rating', '>=', filters.rating));
      }
      if (filters.consultationType) {
        constraints.push(where('consultationTypes', 'array-contains', filters.consultationType));
      }
    }

    // Order by rating descending by default
    constraints.push(orderBy('rating', 'desc'));

    const result = await dbService.getAll<Doctor>(this.collectionName, constraints);

    // Apply client-side search filter if needed
    if (result.success && result.data && filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      result.data = result.data.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.specialty.toLowerCase().includes(searchTerm) ||
        doctor.bio.toLowerCase().includes(searchTerm)
      );
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
    const constraints: QueryConstraint[] = [];

    if (filters) {
      if (filters.specialty) {
        constraints.push(where('specialty', '==', filters.specialty));
      }
      if (filters.availability !== undefined) {
        constraints.push(where('isAvailable', '==', filters.availability));
      }
      if (filters.rating) {
        constraints.push(where('rating', '>=', filters.rating));
      }
    }

    constraints.push(orderBy('rating', 'desc'));

    return await dbService.getPaginated<Doctor>(
      this.collectionName,
      limit,
      undefined, // lastDoc would be tracked for pagination
      constraints
    );
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
