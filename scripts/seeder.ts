// Database seeder for initial data
import { doctorService } from '../services/doctor.service';
import { contentService } from '../services/content.service';
import { testimonialService } from '../services/testimonial.service';
import { Doctor, Facility, Management, FAQ, Article, HospitalInfo } from '../types/database';

// Sample doctors data
const sampleDoctors: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    userId: 'doctor1',
    name: 'Dr. Andi Wijaya, Sp.JP(K)',
    specialty: 'Kardiologi Intervensi',
    experience: '25 tahun',
    education: [
      'Dokter Umum - Universitas Indonesia (1998)',
      'Spesialis Jantung - Universitas Indonesia (2003)',
      'Fellowship Kardiologi Intervensi - Mount Sinai Hospital, New York (2006)'
    ],
    certifications: [
      'Diplomate Indonesian Heart Association',
      'Advanced Cardiac Life Support (ACLS)',
      'Fellowship in Interventional Cardiology'
    ],
    languages: ['Bahasa Indonesia', 'English'],
    rating: 4.9,
    reviewCount: 245,
    price: 'Rp 350.000',
    bio: 'Dr. Andi Wijaya adalah dokter spesialis jantung berpengalaman dengan keahlian khusus dalam kardiologi intervensi. Beliau telah menangani ribuan kasus dengan tingkat keberhasilan tinggi.',
    profileImage: '/images/doctors/dr-andi.jpg',
    schedule: {
      'Monday': ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'],
      'Wednesday': ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'],
      'Friday': ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00']
    },
    consultationTypes: ['offline', 'online'],
    isAvailable: true
  },
  {
    userId: 'doctor2',
    name: 'Dr. Sari Indrawati, Sp.A(K)',
    specialty: 'Anak & Neonatologi',
    experience: '20 tahun',
    education: [
      'Dokter Umum - Universitas Gadjah Mada (2003)',
      'Spesialis Anak - Universitas Gadjah Mada (2008)',
      'Fellowship Neonatologi - RSCM Jakarta (2010)'
    ],
    certifications: [
      'Diplomate Indonesian Pediatric Society',
      'Pediatric Advanced Life Support (PALS)',
      'Neonatal Resuscitation Program (NRP)'
    ],
    languages: ['Bahasa Indonesia', 'English'],
    rating: 4.9,
    reviewCount: 189,
    price: 'Rp 300.000',
    bio: 'Dr. Sari Indrawati adalah dokter spesialis anak dengan keahlian khusus dalam neonatologi. Beliau berpengalaman menangani bayi dan anak dengan berbagai kondisi medis.',
    profileImage: '/images/doctors/dr-sari.jpg',
    schedule: {
      'Tuesday': ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
      'Thursday': ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
      'Saturday': ['08:00', '09:00', '10:00', '11:00']
    },
    consultationTypes: ['offline', 'online', 'emergency'],
    isAvailable: true
  },
  {
    userId: 'doctor3',
    name: 'Dr. Bambang Sutrisno, Sp.B(K)Onk',
    specialty: 'Bedah Onkologi',
    experience: '22 tahun',
    education: [
      'Dokter Umum - Universitas Airlangga (2001)',
      'Spesialis Bedah - Universitas Airlangga (2006)',
      'Fellowship Bedah Onkologi - MD Anderson Cancer Center, Houston (2009)'
    ],
    certifications: [
      'Diplomate Indonesian Surgical Society',
      'Advanced Trauma Life Support (ATLS)',
      'Surgical Oncology Fellowship'
    ],
    languages: ['Bahasa Indonesia', 'English'],
    rating: 4.8,
    reviewCount: 167,
    price: 'Rp 400.000',
    bio: 'Dr. Bambang Sutrisno adalah dokter spesialis bedah onkologi dengan pengalaman luas dalam operasi kanker dan prosedur bedah kompleks.',
    profileImage: '/images/doctors/dr-bambang.jpg',
    schedule: {
      'Monday': ['13:00', '14:00', '15:00', '16:00'],
      'Wednesday': ['08:00', '09:00', '10:00', '11:00'],
      'Friday': ['13:00', '14:00', '15:00', '16:00']
    },
    consultationTypes: ['offline'],
    isAvailable: true
  },
  {
    userId: 'doctor4',
    name: 'Dr. Maya Kusuma, Sp.M',
    specialty: 'Mata',
    experience: '15 tahun',
    education: [
      'Dokter Umum - Universitas Padjadjaran (2008)',
      'Spesialis Mata - Universitas Padjadjaran (2013)'
    ],
    certifications: [
      'Diplomate Indonesian Ophthalmology Society',
      'Advanced Cataract Surgery',
      'Retinal Diseases Management'
    ],
    languages: ['Bahasa Indonesia', 'English'],
    rating: 4.8,
    reviewCount: 134,
    price: 'Rp 275.000',
    bio: 'Dr. Maya Kusuma adalah dokter spesialis mata yang berpengalaman dalam berbagai kondisi mata termasuk katarak, glaukoma, dan penyakit retina.',
    profileImage: '/images/doctors/dr-maya.jpg',
    schedule: {
      'Monday': ['08:00', '09:00', '10:00', '11:00'],
      'Tuesday': ['14:00', '15:00', '16:00', '17:00'],
      'Thursday': ['08:00', '09:00', '10:00', '11:00'],
      'Friday': ['14:00', '15:00', '16:00', '17:00']
    },
    consultationTypes: ['offline', 'online'],
    isAvailable: true
  },
  {
    userId: 'doctor5',
    name: 'Dr. Rahmat Hidayat, Sp.OG',
    specialty: 'Obstetri & Ginekologi',
    experience: '18 tahun',
    education: [
      'Dokter Umum - Universitas Brawijaya (2005)',
      'Spesialis Obstetri & Ginekologi - Universitas Brawijaya (2010)'
    ],
    certifications: [
      'Diplomate Indonesian Obstetrics and Gynecology Society',
      'Advanced Life Support in Obstetrics (ALSO)',
      'Fetal Medicine Specialist'
    ],
    languages: ['Bahasa Indonesia'],
    rating: 4.7,
    reviewCount: 198,
    price: 'Rp 325.000',
    bio: 'Dr. Rahmat Hidayat adalah dokter spesialis kandungan dan kebidanan dengan pengalaman dalam menangani kehamilan risiko tinggi dan operasi ginekologi.',
    profileImage: '/images/doctors/dr-rahmat.jpg',
    schedule: {
      'Monday': ['08:00', '09:00', '10:00', '14:00', '15:00'],
      'Wednesday': ['08:00', '09:00', '10:00', '14:00', '15:00'],
      'Friday': ['08:00', '09:00', '10:00', '14:00', '15:00'],
      'Saturday': ['08:00', '09:00', '10:00']
    },
    consultationTypes: ['offline', 'emergency'],
    isAvailable: true
  }
];

// Sample hospital info
const hospitalInfo: Omit<HospitalInfo, 'id' | 'updatedAt'> = {
  name: 'RS Medicare Prima',
  description: 'Rumah sakit terpercaya dengan pelayanan kesehatan berkualitas tinggi dan teknologi medis terdepan.',
  mission: 'Memberikan pelayanan kesehatan yang berkualitas, terjangkau, dan mudah diakses untuk semua kalangan.',
  vision: 'Menjadi rumah sakit pilihan utama yang memberikan pelayanan kesehatan terbaik dengan standar internasional.',
  values: [
    'Profesionalisme dalam setiap pelayanan',
    'Kepedulian terhadap pasien dan keluarga',
    'Inovasi dalam teknologi medis',
    'Integritas dalam setiap tindakan',
    'Kerjasama tim yang solid'
  ],
  history: 'RS Medicare Prima didirikan pada tahun 1995 dengan visi menjadi pusat pelayanan kesehatan terbaik. Selama lebih dari 25 tahun, kami telah melayani jutaan pasien dengan dedikasi tinggi.',
  address: 'Jl. Kesehatan Raya No. 123, Jakarta Pusat 10350',
  phone: '+62 21 1234 5678',
  email: 'info@medicareprima.com',
  website: 'www.medicareprima.com',
  emergencyNumber: '119',
  establishedYear: 1995,
  bedCapacity: 350,
  departments: [
    'Kardiologi', 'Neurologi', 'Onkologi', 'Anak', 'Obstetri & Ginekologi',
    'Bedah', 'Mata', 'THT', 'Penyakit Dalam', 'Radiologi', 'Laboratorium'
  ],
  accreditations: [
    'Akreditasi KARS Tingkat Paripurna',
    'ISO 9001:2015',
    'ISO 14001:2015',
    'OHSAS 18001:2007'
  ],
  awards: [
    'Best Hospital Service 2023',
    'Patient Safety Excellence Award 2022',
    'Innovation in Healthcare Technology 2021'
  ],
  socialMedia: {
    facebook: 'facebook.com/medicareprima',
    instagram: 'instagram.com/medicareprima',
    twitter: 'twitter.com/medicareprima',
    youtube: 'youtube.com/medicareprima'
  },
  operatingHours: {
    'Monday': '24 Jam',
    'Tuesday': '24 Jam',
    'Wednesday': '24 Jam',
    'Thursday': '24 Jam',
    'Friday': '24 Jam',
    'Saturday': '24 Jam',
    'Sunday': '24 Jam'
  }
};

// Sample facilities
const sampleFacilities: Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Unit Gawat Darurat (UGD)',
    description: 'Pelayanan gawat darurat 24 jam dengan tim medis berpengalaman dan peralatan medis terkini.',
    category: 'Emergency',
    features: [
      'Pelayanan 24/7',
      'Tim dokter jaga berpengalaman',
      'Ambulans siaga',
      'Ruang resusitasi lengkap',
      'Fasilitas trauma center'
    ],
    images: ['/images/facilities/ugd-1.jpg', '/images/facilities/ugd-2.jpg'],
    capacity: 20,
    location: 'Lantai 1, Gedung Utama',
    isActive: true,
    order: 1
  },
  {
    name: 'Ruang Operasi',
    description: 'Ruang operasi dengan teknologi terdepan dan standar sterilisasi internasional.',
    category: 'Surgery',
    features: [
      '8 ruang operasi modern',
      'Sistem ventilasi HEPA filter',
      'Lampu operasi LED canggih',
      'Monitor vital sign terkini',
      'Backup power supply'
    ],
    images: ['/images/facilities/or-1.jpg', '/images/facilities/or-2.jpg'],
    capacity: 8,
    location: 'Lantai 3, Gedung Utama',
    isActive: true,
    order: 2
  },
  {
    name: 'Intensive Care Unit (ICU)',
    description: 'Perawatan intensif dengan monitoring 24 jam dan peralatan life support terlengkap.',
    category: 'Critical Care',
    features: [
      'Monitoring 24/7',
      'Ventilator canggih',
      'Nurse station terintegrasi',
      'Sistem isolasi lengkap',
      'Family room tersedia'
    ],
    images: ['/images/facilities/icu-1.jpg', '/images/facilities/icu-2.jpg'],
    capacity: 16,
    location: 'Lantai 4, Gedung Utama',
    isActive: true,
    order: 3
  }
];

// Seeder functions
export const seedDoctors = async () => {
  try {
    console.log('Seeding doctors...');
    for (const doctor of sampleDoctors) {
      const result = await doctorService.createDoctor(doctor);
      if (result.success) {
        console.log(`✓ Created doctor: ${doctor.name}`);
      } else {
        console.error(`✗ Failed to create doctor ${doctor.name}:`, result.error);
      }
    }
    console.log('✓ Doctors seeding completed');
  } catch (error) {
    console.error('Error seeding doctors:', error);
  }
};

export const seedHospitalInfo = async () => {
  try {
    console.log('Seeding hospital info...');
    const result = await contentService.updateHospitalInfo(hospitalInfo);
    if (result.success) {
      console.log('✓ Hospital info created/updated');
    } else {
      console.error('✗ Failed to create hospital info:', result.error);
    }
  } catch (error) {
    console.error('Error seeding hospital info:', error);
  }
};

export const seedFacilities = async () => {
  try {
    console.log('Seeding facilities...');
    for (const facility of sampleFacilities) {
      const result = await contentService.createFacility(facility);
      if (result.success) {
        console.log(`✓ Created facility: ${facility.name}`);
      } else {
        console.error(`✗ Failed to create facility ${facility.name}:`, result.error);
      }
    }
    console.log('✓ Facilities seeding completed');
  } catch (error) {
    console.error('Error seeding facilities:', error);
  }
};

// Main seeder function
export const runSeeder = async () => {
  console.log('🌱 Starting database seeding...');
  
  await seedHospitalInfo();
  await seedDoctors();
  await seedFacilities();
  
  console.log('🎉 Database seeding completed!');
};

// For development - run if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  runSeeder().catch(console.error);
}
