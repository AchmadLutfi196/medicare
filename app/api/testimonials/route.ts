// API route for testimonials CRUD operations
import { NextRequest, NextResponse } from 'next/server';
import { testimonialService } from '../../../services/testimonial.service';
import { TestimonialFilters, TestimonialFormData } from '../../../types/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check if getting single testimonial by ID
    const id = searchParams.get('id');
    if (id) {
      const result = await testimonialService.getTestimonialById(id);
      return NextResponse.json(result);
    }

    // Special endpoints
    const endpoint = searchParams.get('endpoint');
    
    if (endpoint === 'stats') {
      const doctorId = searchParams.get('doctorId');
      const result = await testimonialService.getTestimonialStats(doctorId || undefined);
      return NextResponse.json(result);
    }
    
    if (endpoint === 'featured') {
      const limit = searchParams.get('limit');
      const result = await testimonialService.getFeaturedTestimonials(
        limit ? parseInt(limit) : 6
      );
      return NextResponse.json(result);
    }
    
    if (endpoint === 'recent') {
      const limit = searchParams.get('limit');
      const result = await testimonialService.getRecentTestimonials(
        limit ? parseInt(limit) : 10
      );
      return NextResponse.json(result);
    }
    
    if (endpoint === 'public') {
      const filters: TestimonialFilters = {};
      
      const doctorId = searchParams.get('doctorId');
      if (doctorId) filters.doctorId = doctorId;
      
      const rating = searchParams.get('rating');
      if (rating) filters.rating = parseFloat(rating);
      
      const treatmentType = searchParams.get('treatmentType');
      if (treatmentType) filters.treatmentType = treatmentType;
      
      const result = await testimonialService.getPublicTestimonials(filters);
      return NextResponse.json(result);
    }
    
    if (endpoint === 'treatment-types') {
      const result = await testimonialService.getTreatmentTypes();
      return NextResponse.json(result);
    }

    // Parse filters from search params
    const filters: TestimonialFilters = {};
    
    const doctorId = searchParams.get('doctorId');
    if (doctorId) filters.doctorId = doctorId;
    
    const rating = searchParams.get('rating');
    if (rating) filters.rating = parseFloat(rating);
    
    const verified = searchParams.get('verified');
    if (verified !== null) filters.verified = verified === 'true';
    
    const treatmentType = searchParams.get('treatmentType');
    if (treatmentType) filters.treatmentType = treatmentType;
    
    // Check if pagination is requested
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    
    if (page && limit) {
      const result = await testimonialService.getTestimonialsPaginated(
        parseInt(page), 
        parseInt(limit), 
        filters
      );
      return NextResponse.json(result);
    } else {
      const result = await testimonialService.getAllTestimonials(filters);
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
    const body: TestimonialFormData & { patientName: string } = await request.json();
    const { patientName, ...testimonialData } = body;
    
    const result = await testimonialService.createTestimonial(testimonialData, patientName);
    
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
        { success: false, error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }
    
    let result;
    
    if (action === 'verify') {
      const body = await request.json();
      result = await testimonialService.verifyTestimonial(id, body.isVerified);
    } else if (action === 'toggle-visibility') {
      const body = await request.json();
      result = await testimonialService.toggleTestimonialVisibility(id, body.isPublic);
    } else if (action === 'helpful') {
      result = await testimonialService.addHelpfulVote(id);
    } else {
      const body = await request.json();
      result = await testimonialService.updateTestimonial(id, body);
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
        { success: false, error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }
    
    const result = await testimonialService.deleteTestimonial(id);
    
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
