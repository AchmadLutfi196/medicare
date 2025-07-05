// Appointment service for booking and management
import { where, orderBy, QueryConstraint, Timestamp } from 'firebase/firestore';
import { dbService } from './database.service';
import { Appointment, AppointmentFilters, AppointmentFormData, ApiResponse } from '../types/database';

export class AppointmentService {
  private static instance: AppointmentService;
  private collectionName = 'appointments';

  static getInstance(): AppointmentService {
    if (!AppointmentService.instance) {
      AppointmentService.instance = new AppointmentService();
    }
    return AppointmentService.instance;
  }

  async createAppointment(appointmentData: AppointmentFormData): Promise<ApiResponse<Appointment & { id: string }>> {
    // Convert form data to appointment object
    const appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> = {
      patientId: '', // This would come from auth context
      doctorId: appointmentData.doctorId,
      appointmentDate: new Date(appointmentData.appointmentDate),
      appointmentTime: appointmentData.appointmentTime,
      type: appointmentData.type,
      status: 'pending',
      reason: appointmentData.reason,
      symptoms: appointmentData.symptoms,
      notes: appointmentData.notes,
      patientInfo: {
        name: appointmentData.patientName,
        email: appointmentData.patientEmail,
        phone: appointmentData.patientPhone,
        age: appointmentData.patientAge,
        gender: appointmentData.patientGender,
        emergencyContact: appointmentData.emergencyContact
      },
      doctorInfo: {
        name: '', // This would be fetched from doctor service
        specialty: '' // This would be fetched from doctor service
      },
      consultationFee: 0, // This would be calculated based on doctor's price
      paymentStatus: 'pending'
    };

    return await dbService.create<Appointment>(this.collectionName, appointment);
  }

  async getAppointmentById(id: string): Promise<ApiResponse<Appointment>> {
    return await dbService.getById<Appointment>(this.collectionName, id);
  }

  async updateAppointment(id: string, appointmentData: Partial<Appointment>): Promise<ApiResponse<void>> {
    return await dbService.update<Appointment>(this.collectionName, id, appointmentData);
  }

  async deleteAppointment(id: string): Promise<ApiResponse<void>> {
    return await dbService.delete(this.collectionName, id);
  }

  async getAllAppointments(filters?: AppointmentFilters): Promise<ApiResponse<Appointment[]>> {
    const constraints: QueryConstraint[] = [];

    if (filters) {
      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }
      if (filters.doctorId) {
        constraints.push(where('doctorId', '==', filters.doctorId));
      }
      if (filters.patientId) {
        constraints.push(where('patientId', '==', filters.patientId));
      }
      if (filters.dateFrom) {
        constraints.push(where('appointmentDate', '>=', new Date(filters.dateFrom)));
      }
      if (filters.dateTo) {
        constraints.push(where('appointmentDate', '<=', new Date(filters.dateTo)));
      }
    }

    // Order by appointment date descending
    constraints.push(orderBy('appointmentDate', 'desc'));

    return await dbService.getAll<Appointment>(this.collectionName, constraints);
  }

  async getPatientAppointments(patientId: string): Promise<ApiResponse<Appointment[]>> {
    return await this.getAllAppointments({ patientId });
  }

  async getDoctorAppointments(doctorId: string): Promise<ApiResponse<Appointment[]>> {
    return await this.getAllAppointments({ doctorId });
  }

  async getTodayAppointments(): Promise<ApiResponse<Appointment[]>> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.getAllAppointments({
      dateFrom: today.toISOString(),
      dateTo: tomorrow.toISOString()
    });
  }

  async getUpcomingAppointments(patientId?: string, doctorId?: string): Promise<ApiResponse<Appointment[]>> {
    const today = new Date();
    const filters: AppointmentFilters = {
      dateFrom: today.toISOString()
    };

    if (patientId) filters.patientId = patientId;
    if (doctorId) filters.doctorId = doctorId;

    return await this.getAllAppointments(filters);
  }

  async getPendingAppointments(): Promise<ApiResponse<Appointment[]>> {
    return await this.getAllAppointments({ status: 'pending' });
  }

  async confirmAppointment(id: string): Promise<ApiResponse<void>> {
    return await this.updateAppointment(id, { 
      status: 'confirmed',
      updatedAt: new Date()
    });
  }

  async cancelAppointment(id: string, reason?: string): Promise<ApiResponse<void>> {
    const updateData: Partial<Appointment> = { 
      status: 'cancelled',
      updatedAt: new Date()
    };

    if (reason) {
      updateData.notes = reason;
    }

    return await this.updateAppointment(id, updateData);
  }

  async completeAppointment(id: string, notes?: string): Promise<ApiResponse<void>> {
    const updateData: Partial<Appointment> = { 
      status: 'completed',
      updatedAt: new Date()
    };

    if (notes) {
      updateData.notes = notes;
    }

    return await this.updateAppointment(id, updateData);
  }

  async updatePaymentStatus(id: string, paymentStatus: Appointment['paymentStatus']): Promise<ApiResponse<void>> {
    return await this.updateAppointment(id, { paymentStatus });
  }

  // Check if appointment slot is available
  async isSlotAvailable(doctorId: string, date: string, time: string): Promise<ApiResponse<boolean>> {
    const constraints: QueryConstraint[] = [
      where('doctorId', '==', doctorId),
      where('appointmentDate', '==', new Date(date)),
      where('appointmentTime', '==', time),
      where('status', 'in', ['pending', 'confirmed'])
    ];

    const result = await dbService.getAll<Appointment>(this.collectionName, constraints);

    if (result.success) {
      return {
        success: true,
        data: result.data!.length === 0
      };
    }

    return {
      success: false,
      error: result.error
    };
  }

  // Get appointment statistics
  async getAppointmentStats(doctorId?: string): Promise<ApiResponse<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  }>> {
    try {
      const filters: AppointmentFilters = {};
      if (doctorId) filters.doctorId = doctorId;

      const allAppointments = await this.getAllAppointments(filters);
      if (!allAppointments.success || !allAppointments.data) {
        throw new Error(allAppointments.error || 'Failed to get appointments');
      }

      const appointments = allAppointments.data;
      const today = new Date();
      const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      const stats = {
        total: appointments.length,
        pending: appointments.filter(a => a.status === 'pending').length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
        today: appointments.filter(a => {
          const appointmentDate = new Date(a.appointmentDate);
          return appointmentDate.toDateString() === today.toDateString();
        }).length,
        thisWeek: appointments.filter(a => {
          const appointmentDate = new Date(a.appointmentDate);
          return appointmentDate >= weekStart;
        }).length,
        thisMonth: appointments.filter(a => {
          const appointmentDate = new Date(a.appointmentDate);
          return appointmentDate >= monthStart;
        }).length
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Get appointments with pagination
  async getAppointmentsPaginated(page: number = 1, limit: number = 10, filters?: AppointmentFilters) {
    const constraints: QueryConstraint[] = [];

    if (filters) {
      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }
      if (filters.doctorId) {
        constraints.push(where('doctorId', '==', filters.doctorId));
      }
      if (filters.patientId) {
        constraints.push(where('patientId', '==', filters.patientId));
      }
    }

    constraints.push(orderBy('appointmentDate', 'desc'));

    return await dbService.getPaginated<Appointment>(
      this.collectionName,
      limit,
      undefined,
      constraints
    );
  }
}

export const appointmentService = AppointmentService.getInstance();
