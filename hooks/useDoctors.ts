// Specific hooks for doctors API
import { useApi, useMutation, usePagination, apiCall } from './useApi';
import { Doctor, DoctorFilters, ApiResponse } from '../types/database';

// Get all doctors with filters
export function useDoctors(filters?: DoctorFilters) {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.specialty) queryParams.append('specialty', filters.specialty);
    if (filters.availability !== undefined) queryParams.append('availability', filters.availability.toString());
    if (filters.rating) queryParams.append('rating', filters.rating.toString());
    if (filters.consultationType) queryParams.append('consultationType', filters.consultationType);
    if (filters.search) queryParams.append('search', filters.search);
  }
  
  const url = `/api/doctors${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return useApi<Doctor[]>(url);
}

// Get single doctor by ID
export function useDoctor(id: string) {
  const url = `/api/doctors?id=${id}`;
  return useApi<Doctor>(url);
}

// Get doctors with pagination
export function useDoctorsPaginated(filters?: DoctorFilters, initialPage = 1, initialLimit = 10) {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.specialty) queryParams.append('specialty', filters.specialty);
    if (filters.availability !== undefined) queryParams.append('availability', filters.availability.toString());
    if (filters.rating) queryParams.append('rating', filters.rating.toString());
    if (filters.consultationType) queryParams.append('consultationType', filters.consultationType);
    if (filters.search) queryParams.append('search', filters.search);
  }
  
  const baseUrl = `/api/doctors${queryParams.toString() ? `?${queryParams.toString()}&` : '?'}`;
  return usePagination<Doctor>(baseUrl, initialPage, initialLimit);
}

// Get specialties
export function useSpecialties() {
  return useApi<string[]>('/api/doctors?endpoint=specialties');
}

// Create doctor
export function useCreateDoctor() {
  return useMutation<Doctor>('/api/doctors', 'POST');
}

// Update doctor
export function useUpdateDoctor(id: string) {
  return useMutation<void>(`/api/doctors?id=${id}`, 'PUT');
}

// Delete doctor
export function useDeleteDoctor(id: string) {
  return useMutation<void>(`/api/doctors?id=${id}`, 'DELETE');
}

// Utility functions for direct API calls
export const doctorApi = {
  getAll: (filters?: DoctorFilters) => {
    const queryParams = new URLSearchParams();
    if (filters) {
      if (filters.specialty) queryParams.append('specialty', filters.specialty);
      if (filters.availability !== undefined) queryParams.append('availability', filters.availability.toString());
      if (filters.rating) queryParams.append('rating', filters.rating.toString());
      if (filters.consultationType) queryParams.append('consultationType', filters.consultationType);
      if (filters.search) queryParams.append('search', filters.search);
    }
    const url = `/api/doctors${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiCall<Doctor[]>(url);
  },

  getById: (id: string) => apiCall<Doctor>(`/api/doctors?id=${id}`),

  create: (data: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiCall<Doctor>('/api/doctors', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (id: string, data: Partial<Doctor>) => 
    apiCall<void>(`/api/doctors?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (id: string) => 
    apiCall<void>(`/api/doctors?id=${id}`, {
      method: 'DELETE'
    }),

  updateRating: (id: string, rating: number, reviewCount: number) =>
    apiCall<void>(`/api/doctors?id=${id}&action=rating`, {
      method: 'PUT',
      body: JSON.stringify({ rating, reviewCount })
    }),

  toggleAvailability: (id: string, isAvailable: boolean) =>
    apiCall<void>(`/api/doctors?id=${id}&action=availability`, {
      method: 'PUT',
      body: JSON.stringify({ isAvailable })
    }),

  updateSchedule: (id: string, schedule: Doctor['schedule']) =>
    apiCall<void>(`/api/doctors?id=${id}&action=schedule`, {
      method: 'PUT',
      body: JSON.stringify({ schedule })
    })
};
