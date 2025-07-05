import { readFileSync, existsSync } from 'fs';
import { prisma } from '../lib/prisma';
import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs,
  query,
  limit
} from 'firebase/firestore';

/**
 * Script to migrate data from Firebase to Prisma
 * 
 * Usage:
 * 1. Make sure your .env file has the correct DATABASE_URL
 * 2. Run: npx ts-node scripts/firebase-to-prisma.ts
 */
async function migrateData() {
  console.log('Starting migration from Firebase to Prisma...');
  
  try {
    // Migrate Users
    console.log('Migrating users...');
    await migrateUsers();
    
    // Migrate Doctors
    console.log('Migrating doctors...');
    await migrateDoctors();
    
    // Migrate Content (Articles)
    console.log('Migrating articles...');
    await migrateContent();
    
    // Migrate Appointments
    console.log('Migrating appointments...');
    await migrateAppointments();
    
    // Migrate Testimonials
    console.log('Migrating testimonials...');
    await migrateTestimonials();
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

async function migrateUsers() {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  let count = 0;
  
  for (const doc of usersSnapshot.docs) {
    const userData = doc.data();
    
    try {
      await prisma.user.create({
        data: {
          id: doc.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone || '',
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender?.toUpperCase() || null,
          address: userData.address,
          role: (userData.role?.toUpperCase() || 'PATIENT'),
          profileImage: userData.profileImage,
          isActive: userData.isActive ?? true,
          createdAt: userData.createdAt?.toDate() || new Date(),
          updatedAt: userData.updatedAt?.toDate() || new Date(),
        }
      });
      count++;
    } catch (error) {
      console.error(`Failed to migrate user ${doc.id}:`, error);
    }
  }
  
  console.log(`Migrated ${count} users`);
}

async function migrateDoctors() {
  const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
  let count = 0;
  
  for (const doc of doctorsSnapshot.docs) {
    const doctorData = doc.data();
    
    try {
      // Create doctor record
      await prisma.doctor.create({
        data: {
          id: doc.id,
          userId: doctorData.userId,
          name: doctorData.name,
          specialty: doctorData.specialty,
          experience: doctorData.experience,
          education: doctorData.education || [],
          certifications: doctorData.certifications || [],
          languages: doctorData.languages || [],
          rating: doctorData.rating || 0,
          reviewCount: doctorData.reviewCount || 0,
          price: doctorData.price || '0',
          bio: doctorData.bio || '',
          profileImage: doctorData.profileImage,
          specialties: doctorData.specialties || [],
        }
      });
      
      // Migrate doctor schedules if they exist
      if (doctorData.schedule) {
        for (const [day, timeSlots] of Object.entries(doctorData.schedule)) {
          // Convert day string to number (0-6 for Sunday-Saturday)
          const dayNumber = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
            .indexOf(day.toLowerCase());
          
          if (dayNumber >= 0 && Array.isArray(timeSlots)) {
            // For each time slot
            for (const slot of timeSlots as string[]) {
              // Parse slot format like "09:00-10:00"
              const [startTime, endTime] = slot.split('-');
              if (startTime && endTime) {
                await prisma.schedule.create({
                  data: {
                    doctorId: doc.id,
                    dayOfWeek: dayNumber,
                    startTime,
                    endTime,
                    isAvailable: true
                  }
                });
              }
            }
          }
        }
      }
      
      count++;
    } catch (error) {
      console.error(`Failed to migrate doctor ${doc.id}:`, error);
    }
  }
  
  console.log(`Migrated ${count} doctors`);
}

async function migrateContent() {
  const contentSnapshot = await getDocs(collection(db, 'content'));
  let count = 0;
  
  for (const doc of contentSnapshot.docs) {
    const contentData = doc.data();
    
    try {
      await prisma.content.create({
        data: {
          id: doc.id,
          title: contentData.title,
          slug: contentData.slug || doc.id,
          content: contentData.content || '',
          excerpt: contentData.excerpt,
          coverImage: contentData.coverImage,
          category: contentData.category || 'uncategorized',
          author: contentData.author || 'Admin',
          published: contentData.published ?? true,
          createdAt: contentData.createdAt?.toDate() || new Date(),
          updatedAt: contentData.updatedAt?.toDate() || new Date(),
        }
      });
      count++;
    } catch (error) {
      console.error(`Failed to migrate content ${doc.id}:`, error);
    }
  }
  
  console.log(`Migrated ${count} content items`);
}

async function migrateAppointments() {
  const appointmentsSnapshot = await getDocs(collection(db, 'appointments'));
  let count = 0;
  
  for (const doc of appointmentsSnapshot.docs) {
    const appointmentData = doc.data();
    
    try {
      // Map the status to the enum values
      const statusMap: Record<string, string> = {
        'pending': 'PENDING',
        'confirmed': 'CONFIRMED',
        'completed': 'COMPLETED',
        'cancelled': 'CANCELLED'
      };
      
      const status = statusMap[appointmentData.status?.toLowerCase()] || 'PENDING';
      
      await prisma.appointment.create({
        data: {
          id: doc.id,
          doctorId: appointmentData.doctorId,
          patientId: appointmentData.patientId,
          date: appointmentData.appointmentDate?.toDate() || new Date(),
          startTime: appointmentData.appointmentTime || '00:00',
          endTime: appointmentData.endTime || '00:30', // Default to 30 minutes if not specified
          status,
          notes: appointmentData.reason || appointmentData.notes || '',
          createdAt: appointmentData.createdAt?.toDate() || new Date(),
          updatedAt: appointmentData.updatedAt?.toDate() || new Date(),
        }
      });
      count++;
    } catch (error) {
      console.error(`Failed to migrate appointment ${doc.id}:`, error);
    }
  }
  
  console.log(`Migrated ${count} appointments`);
}

async function migrateTestimonials() {
  const testimonialsSnapshot = await getDocs(collection(db, 'testimonials'));
  let count = 0;
  
  for (const doc of testimonialsSnapshot.docs) {
    const testimonialData = doc.data();
    
    try {
      await prisma.testimonial.create({
        data: {
          id: doc.id,
          userId: testimonialData.userId,
          rating: testimonialData.rating || 5,
          comment: testimonialData.comment || '',
          approved: testimonialData.approved ?? false,
          createdAt: testimonialData.createdAt?.toDate() || new Date(),
          updatedAt: testimonialData.updatedAt?.toDate() || new Date(),
        }
      });
      count++;
    } catch (error) {
      console.error(`Failed to migrate testimonial ${doc.id}:`, error);
    }
  }
  
  console.log(`Migrated ${count} testimonials`);
}

migrateData()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
