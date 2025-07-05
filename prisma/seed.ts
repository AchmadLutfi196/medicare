import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@medicare.com' },
    update: {},
    create: {
      email: 'admin@medicare.com',
      firstName: 'Admin',
      lastName: 'User',
      phone: '123456789',
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log('Created admin user:', admin)

  // Create some example doctors
  const doctor1 = await prisma.doctor.create({
    data: {
      user: {
        create: {
          email: 'doctor1@medicare.com',
          firstName: 'John',
          lastName: 'Smith',
          phone: '1234567890',
          role: 'DOCTOR',
          gender: 'MALE',
          isActive: true,
        }
      },
      name: 'Dr. John Smith',
      specialty: 'Cardiology',
      experience: '10 years',
      education: JSON.stringify(['MD from Harvard Medical School', 'Cardiology Residency at Mayo Clinic']),
      certifications: JSON.stringify(['Board Certified in Cardiology', 'Advanced Cardiac Life Support']),
      languages: JSON.stringify(['English', 'Spanish']),
      price: '$200',
      bio: 'Experienced cardiologist specializing in preventive cardiology and heart disease management.',
      specialties: JSON.stringify(['Heart Disease', 'Hypertension', 'Cardiac Rehabilitation']),
    },
  })

  console.log('Created doctor:', doctor1)

  const doctor2 = await prisma.doctor.create({
    data: {
      user: {
        create: {
          email: 'doctor2@medicare.com',
          firstName: 'Sarah',
          lastName: 'Johnson',
          phone: '0987654321',
          role: 'DOCTOR',
          gender: 'FEMALE',
          isActive: true,
        }
      },
      name: 'Dr. Sarah Johnson',
      specialty: 'Pediatrics',
      experience: '8 years',
      education: JSON.stringify(['MD from Johns Hopkins University']),
      certifications: JSON.stringify(['Board Certified in Pediatrics']),
      languages: JSON.stringify(['English', 'French']),
      price: '$180',
      bio: 'Dedicated pediatrician with a focus on childhood development and preventive care.',
      specialties: JSON.stringify(['Child Development', 'Preventive Care', 'Newborn Care']),
    },
  })

  console.log('Created doctor:', doctor2)

  // Create sample patient
  const patient = await prisma.user.create({
    data: {
      email: 'patient@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '5556667777',
      dateOfBirth: '1990-01-15',
      gender: 'FEMALE',
      address: '123 Main St, Anytown, USA',
      role: 'PATIENT',
      isActive: true,
    }
  })

  console.log('Created patient:', patient)

  // Create schedule for doctors
  const scheduleItems = [
    {
      doctorId: doctor1.id,
      dayOfWeek: 1, // Monday
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true
    },
    {
      doctorId: doctor1.id,
      dayOfWeek: 3, // Wednesday
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true
    },
    {
      doctorId: doctor1.id,
      dayOfWeek: 5, // Friday
      startTime: '09:00',
      endTime: '13:00',
      isAvailable: true
    },
    {
      doctorId: doctor2.id,
      dayOfWeek: 2, // Tuesday
      startTime: '08:00',
      endTime: '16:00',
      isAvailable: true
    },
    {
      doctorId: doctor2.id,
      dayOfWeek: 4, // Thursday
      startTime: '08:00',
      endTime: '16:00',
      isAvailable: true
    }
  ]

  for (const item of scheduleItems) {
    await prisma.schedule.create({ data: item })
  }

  console.log('Created schedule items')

  // Create sample appointments
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)

  // AppointmentStatus is an enum in Prisma, so we need to use the exact values
  const appointments = [
    {
      doctorId: doctor1.id,
      patientId: patient.id,
      date: tomorrow,
      startTime: '10:00',
      endTime: '10:30',
      status: 'CONFIRMED' as const, // Type assertion to match the enum
      notes: 'Regular checkup',
    },
    {
      doctorId: doctor2.id,
      patientId: patient.id,
      date: nextWeek,
      startTime: '14:00',
      endTime: '14:30',
      status: 'PENDING' as const, // Type assertion to match the enum
      notes: 'Follow-up appointment',
    }
  ]

  for (const appt of appointments) {
    await prisma.appointment.create({ data: appt })
  }

  console.log('Created appointments')

  // Create sample articles/content
  const articles = [
    {
      title: 'Understanding Heart Health',
      slug: 'understanding-heart-health',
      content: `
        # Understanding Heart Health
        
        Heart disease is the leading cause of death worldwide. Understanding how to maintain good heart health is essential for everyone.
        
        ## Risk Factors
        
        - High blood pressure
        - High cholesterol
        - Smoking
        - Diabetes
        - Obesity
        - Physical inactivity
        
        ## Prevention Tips
        
        Regular exercise, a balanced diet, and avoiding smoking are the keys to maintaining a healthy heart.
      `,
      excerpt: 'Learn about maintaining a healthy heart and preventing heart disease.',
      coverImage: 'https://example.com/heart-health.jpg',
      category: 'Cardiology',
      author: 'Dr. John Smith',
      published: true
    },
    {
      title: 'Childhood Vaccination Guide',
      slug: 'childhood-vaccination-guide',
      content: `
        # Childhood Vaccination Guide
        
        Vaccinations are crucial for protecting children against serious diseases. This guide explains the vaccination schedule and importance.
        
        ## Common Vaccines
        
        - MMR (Measles, Mumps, Rubella)
        - DTaP (Diphtheria, Tetanus, Pertussis)
        - Polio
        - Hepatitis B
        - Varicella (Chickenpox)
        
        ## Vaccination Schedule
        
        Follow your pediatrician's recommended schedule to ensure your child is protected at the right times.
      `,
      excerpt: 'A comprehensive guide to childhood vaccinations and their importance.',
      coverImage: 'https://example.com/vaccinations.jpg',
      category: 'Pediatrics',
      author: 'Dr. Sarah Johnson',
      published: true
    }
  ]

  for (const article of articles) {
    await prisma.content.create({ data: article })
  }

  console.log('Created content articles')

  // Create testimonials
  const testimonials = [
    {
      userId: patient.id,
      rating: 5,
      comment: 'Dr. Smith was excellent! Very knowledgeable and took the time to explain everything.',
      approved: true
    },
    {
      userId: patient.id,
      rating: 4.5,
      comment: 'Dr. Johnson was very good with my child. Made the whole experience comfortable.',
      approved: true
    }
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial })
  }

  console.log('Created testimonials')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
