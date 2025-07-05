// Specific hooks for appointments API
import { useApi, useMutation, usePagination, apiCall } from './useApi';
import { Appointment, AppointmentFilters, AppointmentFormData } from '../types/database';

// Get all appointments with filters
export function useAppointments(filters?: AppointmentFilters) {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.doctorId) queryParams.append('doctorId', filters.doctorId);
    if (filters.patientId) queryParams.append('patientId', filters.patientId);
    if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
  }
  
  const url = `/api/appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return useApi<Appointment[]>(url);
}

// Get single appointment by ID
export function useAppointment(id: string) {
  const url = `/api/appointments?id=${id}`;
  return useApi<Appointment>(url);
}

// Get appointments with pagination
export function useAppointmentsPaginated(filters?: AppointmentFilters, initialPage = 1, initialLimit = 10) {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.doctorId) queryParams.append('doctorId', filters.doctorId);
    if (filters.patientId) queryParams.append('patientId', filters.patientId);
    if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
  }
  
  const baseUrl = `/api/appointments${queryParams.toString() ? `?${queryParams.toString()}&` : '?'}`;
  return usePagination<Appointment>(baseUrl, initialPage, initialLimit);
}

// Get appointment statistics
export function useAppointmentStats(doctorId?: string) {
  const url = `/api/appointments?endpoint=stats${doctorId ? `&doctorId=${doctorId}` : ''}`;
  return useApi<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  }>(url);
}

// Get today's appointments
export function useTodayAppointments() {
  return useApi<Appointment[]>('/api/appointments?endpoint=today');
}

// Get upcoming appointments
export function useUpcomingAppointments(patientId?: string, doctorId?: string) {
  const queryParams = new URLSearchParams();
  if (patientId) queryParams.append('patientId', patientId);
  if (doctorId) queryParams.append('doctorId', doctorId);
  
  const url = `/api/appointments?endpoint=upcoming${queryParams.toString() ? `&${queryParams.toString()}` : ''}`;
  return useApi<Appointment[]>(url);
}

// Get pending appointments
export function usePendingAppointments() {
  return useApi<Appointment[]>('/api/appointments?endpoint=pending');
}

// Create appointment
export function useCreateAppointment() {
  return useMutation<Appointment, AppointmentFormData>('/api/appointments', 'POST');
}

// Update appointment
export function useUpdateAppointment(id: string) {
  return useMutation<void>(`/api/appointments?id=${id}`, 'PUT');
}

// Confirm appointment
export function useConfirmAppointment(id: string) {
  return useMutation<void>(`/api/appointments?id=${id}&action=confirm`, 'PUT');
}

// Cancel appointment
export function useCancelAppointment(id: string) {
  return useMutation<void, { reason?: string }>(`/api/appointments?id=${id}&action=cancel`, 'PUT');
}

// Complete appointment
export function useCompleteAppointment(id: string) {
  return useMutation<void, { notes?: string }>(`/api/appointments?id=${id}&action=complete`, 'PUT');
}

// Delete appointment
export function useDeleteAppointment(id: string) {
  return useMutation<void>(`/api/appointments?id=${id}`, 'DELETE');
}

// Utility functions for direct API calls
export const appointmentApi = {
  getAll: (filters?: AppointmentFilters) => {
    const queryParams = new URLSearchParams();
    if (filters) {
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.doctorId) queryParams.append('doctorId', filters.doctorId);
      if (filters.patientId) queryParams.append('patientId', filters.patientId);
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
    }
    const url = `/api/appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiCall<Appointment[]>(url);
  },

  getById: (id: string) => apiCall<Appointment>(`/api/appointments?id=${id}`),

  create: (data: AppointmentFormData) => 
    apiCall<Appointment>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (id: string, data: Partial<Appointment>) => 
    apiCall<void>(`/api/appointments?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  confirm: (id: string) => 
    apiCall<void>(`/api/appointments?id=${id}&action=confirm`, {
      method: 'PUT'
    }),

  cancel: (id: string, reason?: string) => 
    apiCall<void>(`/api/appointments?id=${id}&action=cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    }),

  complete: (id: string, notes?: string) => 
    apiCall<void>(`/api/appointments?id=${id}&action=complete`, {
      method: 'PUT',
      body: JSON.stringify({ notes })
    }),

  delete: (id: string) => 
    apiCall<void>(`/api/appointments?id=${id}`, {
      method: 'DELETE'
    }),

  updatePayment: (id: string, paymentStatus: Appointment['paymentStatus']) =>
    apiCall<void>(`/api/appointments?id=${id}&action=payment`, {
      method: 'PUT',
      body: JSON.stringify({ paymentStatus })
    }),

  checkSlotAvailability: (doctorId: string, date: string, time: string) =>
    apiCall<boolean>(`/api/appointments/check-slot?doctorId=${doctorId}&date=${date}&time=${time}`),

  getStats: (doctorId?: string) => {
    const url = `/api/appointments?endpoint=stats${doctorId ? `&doctorId=${doctorId}` : ''}`;
    return apiCall<{
      total: number;
      pending: number;
      confirmed: number;
      completed: number;
      cancelled: number;
      today: number;
      thisWeek: number;
      thisMonth: number;
    }>(url);
  },

  getToday: () => apiCall<Appointment[]>('/api/appointments?endpoint=today'),

  getUpcoming: (patientId?: string, doctorId?: string) => {
    const queryParams = new URLSearchParams();
    if (patientId) queryParams.append('patientId', patientId);
    if (doctorId) queryParams.append('doctorId', doctorId);
    
    const url = `/api/appointments?endpoint=upcoming${queryParams.toString() ? `&${queryParams.toString()}` : ''}`;
    return apiCall<Appointment[]>(url);
  },

  getPending: () => apiCall<Appointment[]>('/api/appointments?endpoint=pending')
};
