// API route for doctors CRUD operations
import { NextRequest, NextResponse } from 'next/server';
import { doctorService } from '../../../services/doctor.service';
import { Doctor, DoctorFilters } from '../../../types/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check if getting single doctor by ID
    const id = searchParams.get('id');
    if (id) {
      const result = await doctorService.getDoctorById(id);
      return NextResponse.json(result);
    }

    // Parse filters from search params
    const filters: DoctorFilters = {};
    
    const specialty = searchParams.get('specialty');
    if (specialty) filters.specialty = specialty;
    
    const availability = searchParams.get('availability');
    if (availability) filters.availability = availability === 'true';
    
    const rating = searchParams.get('rating');
    if (rating) filters.rating = parseFloat(rating);
    
    const consultationType = searchParams.get('consultationType');
    if (consultationType) filters.consultationType = consultationType as any;
    
    const search = searchParams.get('search');
    if (search) filters.search = search;
    
    // Check if pagination is requested
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    
    if (page && limit) {
      const result = await doctorService.getDoctorsPaginated(
        parseInt(page), 
        parseInt(limit), 
        filters
      );
      return NextResponse.json(result);
    } else {
      const result = await doctorService.getAllDoctors(filters);
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
    const body = await request.json();
    const result = await doctorService.createDoctor(body);
    
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
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Doctor ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const result = await doctorService.updateDoctor(id, body);
    
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
        { success: false, error: 'Doctor ID is required' },
        { status: 400 }
      );
    }
    
    const result = await doctorService.deleteDoctor(id);
    
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
