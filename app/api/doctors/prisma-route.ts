import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { transformDoctorModel, transformDoctorModels } from '@/lib/prisma-helpers';

// GET all doctors with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const specialty = searchParams.get('specialty');
    const id = searchParams.get('id');
    
    // Handle single doctor request
    if (id) {
      const doctor = await prisma.doctor.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              profileImage: true
            }
          },
          schedule: true
        }
      });
      
      if (!doctor) {
        return NextResponse.json(
          { success: false, error: 'Doctor not found' },
          { status: 404 }
        );
      }
      
      // Transform to convert JSON strings to arrays
      const transformedDoctor = transformDoctorModel(doctor);
      
      return NextResponse.json({ success: true, data: transformedDoctor });
    }
    
    // Calculate pagination parameters
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};
    if (specialty) {
      where.specialty = specialty;
    }
    
    // Get doctors and total count
    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              profileImage: true
            }
          },
          schedule: true
        },
        where,
        skip,
        take: limit,
        orderBy: {
          rating: 'desc'
        }
      }),
      prisma.doctor.count({ where })
    ]);
    
    // Transform doctors to parse JSON strings into arrays
    const transformedDoctors = transformDoctorModels(doctors);
    
    return NextResponse.json({
      success: true,
      data: transformedDoctors,
      meta: {
        page,
        limit,
        totalCount: total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

// POST - Create a new doctor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if user exists and is not already a doctor
    const existingUser = await prisma.user.findUnique({
      where: { id: body.userId },
      include: { doctor: true }
    });
    
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    if (existingUser.doctor) {
      return NextResponse.json(
        { success: false, error: 'This user is already registered as a doctor' },
        { status: 400 }
      );
    }
    
    // Create doctor profile with JSON strings for arrays
    const doctor = await prisma.doctor.create({
      data: {
        userId: body.userId,
        name: body.name || `${existingUser.firstName} ${existingUser.lastName}`,
        specialty: body.specialty,
        experience: body.experience,
        education: JSON.stringify(body.education || []),
        certifications: JSON.stringify(body.certifications || []),
        languages: JSON.stringify(body.languages || []),
        price: body.price,
        bio: body.bio || '',
        specialties: JSON.stringify(body.specialties || []),
        profileImage: body.profileImage || existingUser.profileImage
      },
      include: {
        user: true
      }
    });
    
    // Update user role if needed
    if (existingUser.role !== 'DOCTOR') {
      await prisma.user.update({
        where: { id: body.userId },
        data: { role: 'DOCTOR' }
      });
    }
    
    // Transform doctor to parse JSON strings into arrays
    const transformedDoctor = transformDoctorModel(doctor);
    
    return NextResponse.json({
      success: true,
      data: transformedDoctor
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create doctor' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing doctor
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Doctor ID is required' },
        { status: 400 }
      );
    }
    
    // Convert array fields to JSON strings
    const dataToUpdate: any = { ...updateData };
    
    if (updateData.education) {
      dataToUpdate.education = JSON.stringify(updateData.education);
    }
    
    if (updateData.certifications) {
      dataToUpdate.certifications = JSON.stringify(updateData.certifications);
    }
    
    if (updateData.languages) {
      dataToUpdate.languages = JSON.stringify(updateData.languages);
    }
    
    if (updateData.specialties) {
      dataToUpdate.specialties = JSON.stringify(updateData.specialties);
    }
    
    // Update doctor
    const doctor = await prisma.doctor.update({
      where: { id },
      data: dataToUpdate,
      include: {
        user: true,
        schedule: true
      }
    });
    
    // Transform doctor to parse JSON strings into arrays
    const transformedDoctor = transformDoctorModel(doctor);
    
    return NextResponse.json({
      success: true,
      data: transformedDoctor
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update doctor' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a doctor
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
    
    // Delete related records first
    await prisma.schedule.deleteMany({
      where: { doctorId: id }
    });
    
    // Delete the doctor
    await prisma.doctor.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete doctor' },
      { status: 500 }
    );
  }
}
