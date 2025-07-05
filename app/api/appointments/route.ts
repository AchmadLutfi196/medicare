// API route for appointments CRUD operations
import { NextRequest, NextResponse } from 'next/server';
import { appointmentService } from '../../../services/appointment.service';
import { AppointmentFilters, AppointmentFormData } from '../../../types/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check if getting single appointment by ID
    const id = searchParams.get('id');
    if (id) {
      const result = await appointmentService.getAppointmentById(id);
      return NextResponse.json(result);
    }

    // Special endpoints
    const endpoint = searchParams.get('endpoint');
    
    if (endpoint === 'stats') {
      const doctorId = searchParams.get('doctorId');
      const result = await appointmentService.getAppointmentStats(doctorId || undefined);
      return NextResponse.json(result);
    }
    
    if (endpoint === 'today') {
      const result = await appointmentService.getTodayAppointments();
      return NextResponse.json(result);
    }
    
    if (endpoint === 'upcoming') {
      const patientId = searchParams.get('patientId');
      const doctorId = searchParams.get('doctorId');
      const result = await appointmentService.getUpcomingAppointments(
        patientId || undefined, 
        doctorId || undefined
      );
      return NextResponse.json(result);
    }
    
    if (endpoint === 'pending') {
      const result = await appointmentService.getPendingAppointments();
      return NextResponse.json(result);
    }

    // Parse filters from search params
    const filters: AppointmentFilters = {};
    
    const status = searchParams.get('status');
    if (status) filters.status = status;
    
    const doctorId = searchParams.get('doctorId');
    if (doctorId) filters.doctorId = doctorId;
    
    const patientId = searchParams.get('patientId');
    if (patientId) filters.patientId = patientId;
    
    const dateFrom = searchParams.get('dateFrom');
    if (dateFrom) filters.dateFrom = dateFrom;
    
    const dateTo = searchParams.get('dateTo');
    if (dateTo) filters.dateTo = dateTo;
    
    // Check if pagination is requested
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    
    if (page && limit) {
      const result = await appointmentService.getAppointmentsPaginated(
        parseInt(page), 
        parseInt(limit), 
        filters
      );
      return NextResponse.json(result);
    } else {
      const result = await appointmentService.getAllAppointments(filters);
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
    const body: AppointmentFormData = await request.json();
    const result = await appointmentService.createAppointment(body);
    
    if (result.success) {
      return NextResponse.json(result, { status: 201 });
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
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Appointment ID is required' },
        { status: 400 }
      );
    }
    
    let result;
    
    if (action === 'confirm') {
      result = await appointmentService.confirmAppointment(id);
    } else if (action === 'cancel') {
      const body = await request.json();
      result = await appointmentService.cancelAppointment(id, body.reason);
    } else if (action === 'complete') {
      const body = await request.json();
      result = await appointmentService.completeAppointment(id, body.notes);
    } else if (action === 'payment') {
      const body = await request.json();
      result = await appointmentService.updatePaymentStatus(id, body.paymentStatus);
    } else {
      const body = await request.json();
      result = await appointmentService.updateAppointment(id, body);
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
        { success: false, error: 'Appointment ID is required' },
        { status: 400 }
      );
    }
    
    const result = await appointmentService.deleteAppointment(id);
    
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
