// Demo users for Prisma database
// This script can be run using ts-node to add demo users to the Prisma database

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Demo users data
const demoUsers = [
  {
    id: 'demo-admin-1',
    email: 'admin@medicare.com',
    firstName: 'Administrator',
    lastName: 'System',
    phone: '+62 812-3456-7890',
    role: 'ADMIN',
    isActive: true
  },
  {
    id: 'demo-patient-1', 
    email: 'patient@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+62 812-1234-5678',
    role: 'PATIENT',
    dateOfBirth: '1990-01-15',
    gender: 'MALE',
    address: 'Jl. Contoh No. 123, Jakarta',
    isActive: true
  },
  {
    id: 'demo-doctor-1',
    email: 'doctor@medicare.com',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    phone: '+62 812-9876-5432',
    role: 'DOCTOR',
    isActive: true
  }
];

// Doctor data
const doctorData = {
  id: 'demo-doctor-profile-1',
  userId: 'demo-doctor-1',
  name: 'Dr. Sarah Johnson',
  specialty: 'Cardiologist',
  experience: '12 years',
  education: JSON.stringify(['MD from Harvard Medical School', 'Cardiology Fellowship at Johns Hopkins']),
  certifications: JSON.stringify(['Board Certified in Cardiology', 'ACLS Certification']),
  languages: JSON.stringify(['English', 'Indonesian', 'Spanish']),
  price: 'Rp 500.000',
  bio: 'Experienced cardiologist with special interest in preventive cardiology and heart disease management.',
  specialties: JSON.stringify(['Heart Disease', 'Hypertension', 'Preventive Care'])
};

// Schedule data
const scheduleData = [
  {
    doctorId: 'demo-doctor-profile-1',
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true
  },
  {
    doctorId: 'demo-doctor-profile-1',
    dayOfWeek: 3, // Wednesday
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true
  },
  {
    doctorId: 'demo-doctor-profile-1',
    dayOfWeek: 5, // Friday
    startTime: '13:00',
    endTime: '18:00',
    isAvailable: true
  }
];

/**
 * Create demo users in Prisma database
 */
async function createDemoUsers() {
  console.log('Creating demo users in Prisma database...');
  
  try {
    // Create users
    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });
      
      if (!existingUser) {
        await prisma.user.create({
          data: userData
        });
        console.log(`Created user: ${userData.firstName} ${userData.lastName}`);
      } else {
        console.log(`User ${userData.email} already exists, skipping...`);
      }
    }
    
    // Create doctor profile
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: doctorData.id }
    });
    
    if (!existingDoctor) {
      await prisma.doctor.create({
        data: doctorData
      });
      console.log(`Created doctor profile: ${doctorData.name}`);
    } else {
      console.log(`Doctor profile for ${doctorData.name} already exists, skipping...`);
    }
    
    // Create schedule
    for (const schedule of scheduleData) {
      // We don't check for duplicates here for simplicity
      await prisma.schedule.create({
        data: {
          ...schedule,
          id: `${schedule.doctorId}-day-${schedule.dayOfWeek}`
        }
      });
    }
    console.log('Created doctor schedule');
    
    console.log('Demo data created successfully');
  } catch (error) {
    console.error('Error creating demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Auto-run when script is executed directly
if (require.main === module) {
  createDemoUsers();
}

export { createDemoUsers, demoUsers, doctorData, scheduleData };
