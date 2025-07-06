// Database service utilities - Migrating from Firebase to Prisma
// This is a temporary implementation that doesn't use Firebase
import { ApiResponse, PaginatedResponse } from '../types/database';

// Local data storage for mock implementation
const localDb: {[collectionName: string]: {[id: string]: any}} = {
  doctors: {},
  appointments: {},
  users: {},
  testimonials: {},
  articles: {},
  facilities: {},
};

// Initialize with seed data
function initializeSeedData() {
  // Sample doctors
  const sampleDoctors = [
    {
      id: 'doc-001',
      userId: 'user-001',
      name: 'Dr. Ahmad Wijaya, Sp.JP',
      specialty: 'Kardiologi',
      experience: '15 tahun',
      education: ['Universitas Indonesia - Kedokteran', 'RS Jantung Harapan Kita - Spesialis Jantung'],
      certifications: ['Sertifikasi Spesialis Jantung', 'Angioplasti dan Stenting'],
      languages: ['Indonesia', 'Inggris'],
      rating: 4.9,
      reviewCount: 128,
      price: 'Rp. 500.000',
      bio: 'Dr. Ahmad Wijaya adalah spesialis jantung berpengalaman dengan fokus pada penyakit jantung koroner dan gangguan irama jantung.',
      profileImage: '/images/doctors/ahmad.jpg',
      schedule: {
        'Senin': ['09:00', '10:00', '11:00', '14:00', '15:00'],
        'Selasa': ['09:00', '10:00', '11:00', '14:00', '15:00'],
        'Rabu': ['13:00', '14:00', '15:00', '16:00'],
        'Kamis': ['09:00', '10:00', '11:00', '14:00', '15:00'],
        'Jumat': ['09:00', '10:00', '11:00']
      },
      consultationTypes: ['online', 'offline'],
      isAvailable: true,
      createdAt: new Date('2023-05-20'),
      updatedAt: new Date('2025-06-15')
    },
    {
      id: 'doc-002',
      userId: 'user-002',
      name: 'Dr. Siti Nurhaliza, Sp.A',
      specialty: 'Anak',
      experience: '12 tahun',
      education: ['Universitas Gadjah Mada - Kedokteran', 'RSUP Dr. Sardjito - Spesialis Anak'],
      certifications: ['Sertifikasi Dokter Spesialis Anak', 'Pediatric Advanced Life Support'],
      languages: ['Indonesia', 'Inggris', 'Melayu'],
      rating: 4.8,
      reviewCount: 96,
      price: 'Rp. 450.000',
      bio: 'Dr. Siti Nurhaliza adalah spesialis anak yang berdedikasi dengan keahlian khusus dalam perkembangan anak dan imunisasi.',
      profileImage: '/images/doctors/siti.jpg',
      schedule: {
        'Senin': ['09:00', '10:00', '11:00', '15:00', '16:00'],
        'Selasa': ['09:00', '10:00', '11:00', '15:00', '16:00'],
        'Rabu': ['09:00', '10:00', '11:00'],
        'Kamis': ['14:00', '15:00', '16:00'],
        'Sabtu': ['09:00', '10:00', '11:00']
      },
      consultationTypes: ['online', 'offline', 'emergency'],
      isAvailable: true,
      createdAt: new Date('2023-08-15'),
      updatedAt: new Date('2025-05-20')
    },
    {
      id: 'doc-003',
      userId: 'user-003',
      name: 'Dr. Lisa Maharani, Sp.M',
      specialty: 'Mata',
      experience: '8 tahun',
      education: ['Universitas Airlangga - Kedokteran', 'RSUD Dr. Soetomo - Spesialis Mata'],
      certifications: ['Sertifikasi Dokter Spesialis Mata', 'Mikroskopi Mata'],
      languages: ['Indonesia', 'Inggris'],
      rating: 4.7,
      reviewCount: 68,
      price: 'Rp. 425.000',
      bio: 'Dr. Lisa Maharani adalah spesialis mata dengan keahlian dalam diagnosis dan pengobatan gangguan retina.',
      profileImage: '/images/doctors/lisa.jpg',
      schedule: {
        'Selasa': ['09:00', '10:00', '11:00', '15:00', '16:00'],
        'Rabu': ['09:00', '10:00', '11:00', '15:00', '16:00'],
        'Kamis': ['09:00', '10:00', '11:00'],
        'Jumat': ['14:00', '15:00', '16:00'],
        'Sabtu': ['09:00', '10:00', '11:00']
      },
      consultationTypes: ['offline'],
      isAvailable: true,
      createdAt: new Date('2023-10-05'),
      updatedAt: new Date('2025-06-10')
    },
    {
      id: 'doc-004',
      userId: 'user-004',
      name: 'Dr. Rudi Hermawan, Sp.PD',
      specialty: 'Penyakit Dalam',
      experience: '20 tahun',
      education: ['Universitas Padjadjaran - Kedokteran', 'RSHS - Spesialis Penyakit Dalam'],
      certifications: ['Sertifikasi Dokter Spesialis Penyakit Dalam', 'Endoskopi Saluran Cerna'],
      languages: ['Indonesia', 'Inggris', 'Jerman'],
      rating: 4.9,
      reviewCount: 152,
      price: 'Rp. 550.000',
      bio: 'Dr. Rudi Hermawan adalah spesialis penyakit dalam senior dengan pengalaman luas dalam diabetes, hipertensi, dan penyakit autoimun.',
      profileImage: '/images/doctors/rudi.jpg',
      schedule: {
        'Senin': ['08:00', '09:00', '10:00', '14:00', '15:00'],
        'Selasa': ['08:00', '09:00', '10:00', '14:00', '15:00'],
        'Rabu': ['08:00', '09:00', '10:00'],
        'Kamis': ['14:00', '15:00', '16:00'],
        'Jumat': ['08:00', '09:00', '10:00']
      },
      consultationTypes: ['online', 'offline', 'emergency'],
      isAvailable: true,
      createdAt: new Date('2023-04-10'),
      updatedAt: new Date('2025-06-25')
    },
    {
      id: 'doc-005',
      userId: 'user-005',
      name: 'Dr. Anita Suryadi, Sp.OG',
      specialty: 'Kebidanan dan Kandungan',
      experience: '15 tahun',
      education: ['Universitas Indonesia - Kedokteran', 'RSCM - Spesialis Obstetri & Ginekologi'],
      certifications: ['Sertifikasi Dokter Spesialis Obstetri & Ginekologi', 'Ultrasonografi Obstetri'],
      languages: ['Indonesia', 'Inggris'],
      rating: 4.8,
      reviewCount: 115,
      price: 'Rp. 500.000',
      bio: 'Dr. Anita Suryadi adalah spesialis kebidanan dan kandungan dengan keahlian dalam kehamilan berisiko tinggi dan endometriosis.',
      profileImage: '/images/doctors/anita.jpg',
      schedule: {
        'Senin': ['10:00', '11:00', '13:00', '14:00', '15:00'],
        'Rabu': ['10:00', '11:00', '13:00', '14:00', '15:00'],
        'Kamis': ['10:00', '11:00', '13:00'],
        'Jumat': ['13:00', '14:00', '15:00'],
        'Sabtu': ['10:00', '11:00', '12:00']
      },
      consultationTypes: ['online', 'offline'],
      isAvailable: true,
      createdAt: new Date('2023-09-15'),
      updatedAt: new Date('2025-06-20')
    }
  ];

  // Sample users
  const sampleUsers = [
    {
      id: 'user-001',
      email: 'ahmad.wijaya@medicare.com',
      firstName: 'Ahmad',
      lastName: 'Wijaya',
      phone: '+62 813-2345-6789',
      dateOfBirth: '1975-05-15',
      gender: 'MALE',
      address: 'Jl. Sudirman No. 123, Jakarta',
      role: 'DOCTOR',
      profileImage: '/images/doctors/ahmad.jpg',
      createdAt: new Date('2023-05-20'),
      updatedAt: new Date('2025-06-15'),
      isActive: true
    },
    {
      id: 'user-002',
      email: 'siti.nurhaliza@medicare.com',
      firstName: 'Siti',
      lastName: 'Nurhaliza',
      phone: '+62 813-2345-6790',
      dateOfBirth: '1980-08-23',
      gender: 'FEMALE',
      address: 'Jl. Thamrin No. 45, Jakarta',
      role: 'DOCTOR',
      profileImage: '/images/doctors/siti.jpg',
      createdAt: new Date('2023-08-15'),
      updatedAt: new Date('2025-05-20'),
      isActive: true
    },
    {
      id: 'user-003',
      email: 'lisa.maharani@medicare.com',
      firstName: 'Lisa',
      lastName: 'Maharani',
      phone: '+62 813-2345-6791',
      dateOfBirth: '1990-10-05',
      gender: 'FEMALE',
      address: 'Jl. Gatot Subroto No. 67, Jakarta',
      role: 'DOCTOR',
      profileImage: '/images/doctors/lisa.jpg',
      createdAt: new Date('2023-10-05'),
      updatedAt: new Date('2025-06-10'),
      isActive: true
    },
    {
      id: 'user-004',
      email: 'rudi.hermawan@medicare.com',
      firstName: 'Rudi',
      lastName: 'Hermawan',
      phone: '+62 813-2345-6792',
      dateOfBirth: '1965-04-10',
      gender: 'MALE',
      address: 'Jl. Diponegoro No. 89, Bandung',
      role: 'DOCTOR',
      profileImage: '/images/doctors/rudi.jpg',
      createdAt: new Date('2023-04-10'),
      updatedAt: new Date('2025-06-25'),
      isActive: true
    },
    {
      id: 'user-005',
      email: 'anita.suryadi@medicare.com',
      firstName: 'Anita',
      lastName: 'Suryadi',
      phone: '+62 813-2345-6793',
      dateOfBirth: '1978-09-15',
      gender: 'FEMALE',
      address: 'Jl. Hayam Wuruk No. 34, Jakarta',
      role: 'DOCTOR',
      profileImage: '/images/doctors/anita.jpg',
      createdAt: new Date('2023-09-15'),
      updatedAt: new Date('2025-06-20'),
      isActive: true
    },
    {
      id: 'user-100',
      email: 'budi.santoso@gmail.com',
      firstName: 'Budi',
      lastName: 'Santoso',
      phone: '+62 812-3456-7890',
      dateOfBirth: '1985-06-12',
      gender: 'MALE',
      address: 'Jl. Merdeka No. 45, Jakarta',
      role: 'PATIENT',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2025-05-15'),
      isActive: true
    },
    {
      id: 'user-101',
      email: 'dewi.anggraini@gmail.com',
      firstName: 'Dewi',
      lastName: 'Anggraini',
      phone: '+62 812-3456-7891',
      dateOfBirth: '1990-03-25',
      gender: 'FEMALE',
      address: 'Jl. Pahlawan No. 23, Surabaya',
      role: 'PATIENT',
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2025-04-20'),
      isActive: true
    },
    {
      id: 'admin-001',
      email: 'admin@medicare.com',
      firstName: 'Admin',
      lastName: 'Medicare',
      phone: '+62 812-3456-9999',
      role: 'ADMIN',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2025-01-01'),
      isActive: true
    }
  ];
  
  // Sample testimonials
  const sampleTestimonials = [
    {
      id: 'test-001',
      patientId: 'user-100',
      doctorId: 'doc-001',
      appointmentId: 'apt-001',
      patientName: 'Budi Santoso',
      doctorName: 'Dr. Ahmad Wijaya, Sp.JP',
      rating: 5,
      comment: 'Dr. Ahmad sangat profesional dan memberikan penjelasan yang mudah dimengerti. Saya merasa sangat terbantu dengan konsultasi ini.',
      treatmentType: 'Konsultasi Jantung',
      isVerified: true,
      isPublic: true,
      helpfulVotes: 12,
      createdAt: new Date('2025-03-15'),
      updatedAt: new Date('2025-03-15')
    },
    {
      id: 'test-002',
      patientId: 'user-101',
      doctorId: 'doc-002',
      appointmentId: 'apt-003',
      patientName: 'Dewi Anggraini',
      doctorName: 'Dr. Siti Nurhaliza, Sp.A',
      rating: 5,
      comment: 'Dr. Siti sangat sabar dan ramah terhadap anak saya. Penanganannya cepat dan tepat. Terima kasih Dr. Siti!',
      treatmentType: 'Pemeriksaan Anak',
      isVerified: true,
      isPublic: true,
      helpfulVotes: 8,
      createdAt: new Date('2025-04-10'),
      updatedAt: new Date('2025-04-10')
    },
    {
      id: 'test-003',
      patientId: 'user-100',
      doctorId: 'doc-004',
      appointmentId: 'apt-002',
      patientName: 'Budi Santoso',
      doctorName: 'Dr. Rudi Hermawan, Sp.PD',
      rating: 4,
      comment: 'Dr. Rudi memberikan diagnosa yang akurat dan treatment yang efektif untuk masalah kesehatan saya. Sangat direkomendasikan!',
      treatmentType: 'Konsultasi Penyakit Dalam',
      isVerified: true,
      isPublic: true,
      helpfulVotes: 5,
      createdAt: new Date('2025-03-25'),
      updatedAt: new Date('2025-03-25')
    },
    {
      id: 'test-004',
      patientId: 'user-101',
      doctorId: 'doc-005',
      appointmentId: 'apt-004',
      patientName: 'Dewi Anggraini',
      doctorName: 'Dr. Anita Suryadi, Sp.OG',
      rating: 5,
      comment: 'Dr. Anita sangat teliti dan memberikan perhatian penuh selama konsultasi. Saya merasa nyaman dan mendapatkan informasi yang detail.',
      treatmentType: 'Konsultasi Kandungan',
      isVerified: true,
      isPublic: true,
      helpfulVotes: 10,
      createdAt: new Date('2025-05-05'),
      updatedAt: new Date('2025-05-05')
    },
    {
      id: 'test-005',
      patientId: 'user-101',
      doctorId: 'doc-003',
      appointmentId: 'apt-005',
      patientName: 'Dewi Anggraini',
      doctorName: 'Dr. Lisa Maharani, Sp.M',
      rating: 4,
      comment: 'Dr. Lisa sangat ahli dalam bidangnya. Konsultasi mata saya berjalan dengan lancar dan hasilnya memuaskan.',
      treatmentType: 'Pemeriksaan Mata',
      isVerified: true,
      isPublic: true,
      helpfulVotes: 7,
      createdAt: new Date('2025-06-01'),
      updatedAt: new Date('2025-06-01')
    }
  ];
  
  // Sample appointments
  const sampleAppointments = [
    {
      id: 'apt-001',
      patientId: 'user-100',
      doctorId: 'doc-001',
      appointmentDate: new Date('2025-03-15T09:00:00'),
      appointmentTime: '09:00',
      type: 'offline',
      status: 'completed',
      reason: 'Konsultasi rutin masalah jantung',
      notes: 'Pasien melaporkan adanya nyeri dada sesekali',
      symptoms: ['nyeri dada', 'sesak nafas ringan'],
      patientInfo: {
        name: 'Budi Santoso',
        email: 'budi.santoso@gmail.com',
        phone: '+62 812-3456-7890',
        age: 40,
        gender: 'MALE',
        emergencyContact: '+62 812-3456-7899'
      },
      doctorInfo: {
        name: 'Dr. Ahmad Wijaya, Sp.JP',
        specialty: 'Kardiologi'
      },
      consultationFee: 500000,
      paymentStatus: 'paid',
      createdAt: new Date('2025-03-10'),
      updatedAt: new Date('2025-03-15')
    },
    {
      id: 'apt-002',
      patientId: 'user-100',
      doctorId: 'doc-004',
      appointmentDate: new Date('2025-03-25T14:00:00'),
      appointmentTime: '14:00',
      type: 'online',
      status: 'completed',
      reason: 'Konsultasi masalah pencernaan',
      notes: 'Pasien melaporkan sakit perut dan mual',
      symptoms: ['mual', 'sakit perut', 'kehilangan nafsu makan'],
      patientInfo: {
        name: 'Budi Santoso',
        email: 'budi.santoso@gmail.com',
        phone: '+62 812-3456-7890',
        age: 40,
        gender: 'MALE',
        emergencyContact: '+62 812-3456-7899'
      },
      doctorInfo: {
        name: 'Dr. Rudi Hermawan, Sp.PD',
        specialty: 'Penyakit Dalam'
      },
      consultationFee: 550000,
      paymentStatus: 'paid',
      createdAt: new Date('2025-03-20'),
      updatedAt: new Date('2025-03-25')
    },
    {
      id: 'apt-003',
      patientId: 'user-101',
      doctorId: 'doc-002',
      appointmentDate: new Date('2025-04-10T10:00:00'),
      appointmentTime: '10:00',
      type: 'offline',
      status: 'completed',
      reason: 'Pemeriksaan rutin anak',
      notes: 'Anak mengalami demam ringan',
      symptoms: ['demam', 'batuk', 'pilek'],
      patientInfo: {
        name: 'Dewi Anggraini',
        email: 'dewi.anggraini@gmail.com',
        phone: '+62 812-3456-6791',
        age: 35,
        gender: 'FEMALE',
        emergencyContact: '+62 812-3456-6792'
      },
      doctorInfo: {
        name: 'Dr. Siti Nurhaliza, Sp.A',
        specialty: 'Anak'
      },
      consultationFee: 450000,
      paymentStatus: 'paid',
      createdAt: new Date('2025-04-05'),
      updatedAt: new Date('2025-04-10')
    },
    {
      id: 'apt-004',
      patientId: 'user-101',
      doctorId: 'doc-005',
      appointmentDate: new Date('2025-05-05T11:00:00'),
      appointmentTime: '11:00',
      type: 'offline',
      status: 'completed',
      reason: 'Konsultasi kandungan',
      notes: 'Pasien sedang hamil 5 bulan, pemeriksaan rutin',
      symptoms: [],
      patientInfo: {
        name: 'Dewi Anggraini',
        email: 'dewi.anggraini@gmail.com',
        phone: '+62 812-3456-6791',
        age: 35,
        gender: 'FEMALE',
        emergencyContact: '+62 812-3456-6792'
      },
      doctorInfo: {
        name: 'Dr. Anita Suryadi, Sp.OG',
        specialty: 'Kebidanan dan Kandungan'
      },
      consultationFee: 500000,
      paymentStatus: 'paid',
      createdAt: new Date('2025-04-28'),
      updatedAt: new Date('2025-05-05')
    },
    {
      id: 'apt-005',
      patientId: 'user-101',
      doctorId: 'doc-003',
      appointmentDate: new Date('2025-06-01T09:00:00'),
      appointmentTime: '09:00',
      type: 'offline',
      status: 'completed',
      reason: 'Pemeriksaan mata',
      notes: 'Pasien mengeluh penglihatan kabur',
      symptoms: ['penglihatan kabur', 'mata kering'],
      patientInfo: {
        name: 'Dewi Anggraini',
        email: 'dewi.anggraini@gmail.com',
        phone: '+62 812-3456-6791',
        age: 35,
        gender: 'FEMALE',
        emergencyContact: '+62 812-3456-6792'
      },
      doctorInfo: {
        name: 'Dr. Lisa Maharani, Sp.M',
        specialty: 'Mata'
      },
      consultationFee: 425000,
      paymentStatus: 'paid',
      createdAt: new Date('2025-05-25'),
      updatedAt: new Date('2025-06-01')
    },
    {
      id: 'apt-006',
      patientId: 'user-100',
      doctorId: 'doc-001',
      appointmentDate: new Date('2025-07-10T15:00:00'),
      appointmentTime: '15:00',
      type: 'online',
      status: 'confirmed',
      reason: 'Follow-up masalah jantung',
      symptoms: ['nyeri dada sesekali'],
      patientInfo: {
        name: 'Budi Santoso',
        email: 'budi.santoso@gmail.com',
        phone: '+62 812-3456-7890',
        age: 40,
        gender: 'MALE',
        emergencyContact: '+62 812-3456-7899'
      },
      doctorInfo: {
        name: 'Dr. Ahmad Wijaya, Sp.JP',
        specialty: 'Kardiologi'
      },
      consultationFee: 500000,
      paymentStatus: 'pending',
      createdAt: new Date('2025-06-30'),
      updatedAt: new Date('2025-06-30')
    }
  ];

  // Sample articles for health content
  const sampleArticles = [
    {
      id: 'art-001',
      title: 'Menjaga Kesehatan Jantung di Era Modern',
      slug: 'menjaga-kesehatan-jantung-di-era-modern',
      content: `<p>Penyakit jantung masih menjadi penyebab kematian nomor satu di dunia. Di tengah gaya hidup modern yang serba cepat, menjaga kesehatan jantung menjadi tantangan tersendiri.</p>
      <h2>Tips Menjaga Kesehatan Jantung</h2>
      <ul>
        <li>Konsumsi makanan sehat dengan banyak sayur dan buah</li>
        <li>Olahraga teratur minimal 30 menit setiap hari</li>
        <li>Hindari merokok dan konsumsi alkohol berlebihan</li>
        <li>Kelola stres dengan baik</li>
        <li>Lakukan pemeriksaan kesehatan jantung secara berkala</li>
      </ul>
      <p>Dengan menerapkan gaya hidup sehat, risiko penyakit jantung dapat dikurangi secara signifikan.</p>`,
      excerpt: 'Penyakit jantung masih menjadi penyebab kematian nomor satu di dunia. Simak tips menjaga kesehatan jantung di era modern.',
      authorId: 'user-001',
      authorName: 'Dr. Ahmad Wijaya',
      category: 'Kesehatan Jantung',
      tags: ['jantung', 'gaya hidup sehat', 'pencegahan'],
      featuredImage: '/images/articles/heart-health.jpg',
      isPublished: true,
      views: 1250,
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15')
    },
    {
      id: 'art-002',
      title: 'Pentingnya Imunisasi pada Anak',
      slug: 'pentingnya-imunisasi-pada-anak',
      content: `<p>Imunisasi adalah salah satu cara terbaik untuk melindungi anak-anak dari berbagai penyakit berbahaya. Namun, masih banyak orang tua yang ragu tentang manfaat imunisasi.</p>
      <h2>Mengapa Imunisasi Penting?</h2>
      <p>Imunisasi membantu sistem kekebalan tubuh anak mengenali dan melawan patogen berbahaya. Beberapa manfaat imunisasi:</p>
      <ul>
        <li>Mencegah penyakit serius yang bisa mengancam jiwa</li>
        <li>Melindungi komunitas melalui herd immunity</li>
        <li>Menghemat biaya pengobatan jangka panjang</li>
        <li>Mencegah komplikasi penyakit di masa depan</li>
      </ul>
      <p>Jadwal imunisasi yang tepat sangat penting untuk perlindungan optimal. Konsultasikan dengan dokter anak Anda untuk informasi lebih lanjut.</p>`,
      excerpt: 'Imunisasi adalah cara efektif melindungi anak dari penyakit berbahaya. Kenali pentingnya imunisasi untuk kesehatan anak Anda.',
      authorId: 'user-002',
      authorName: 'Dr. Siti Nurhaliza',
      category: 'Kesehatan Anak',
      tags: ['imunisasi', 'anak', 'pencegahan'],
      featuredImage: '/images/articles/immunization.jpg',
      isPublished: true,
      views: 980,
      createdAt: new Date('2025-02-10'),
      updatedAt: new Date('2025-02-10')
    },
    {
      id: 'art-003',
      title: 'Mengenal Gejala Diabetes dan Cara Pencegahannya',
      slug: 'mengenal-gejala-diabetes-dan-cara-pencegahannya',
      content: `<p>Diabetes adalah penyakit kronis yang ditandai dengan tingginya kadar gula dalam darah. Mengenali gejala awal diabetes sangat penting untuk penanganan yang tepat.</p>
      <h2>Gejala Awal Diabetes</h2>
      <ul>
        <li>Sering merasa haus dan buang air kecil</li>
        <li>Mudah lelah dan lemas</li>
        <li>Penurunan berat badan yang tidak direncanakan</li>
        <li>Luka yang sulit sembuh</li>
        <li>Penglihatan kabur</li>
      </ul>
      <h2>Langkah Pencegahan</h2>
      <p>Beberapa langkah yang dapat dilakukan untuk mencegah diabetes:</p>
      <ul>
        <li>Menjaga pola makan sehat dengan membatasi karbohidrat sederhana</li>
        <li>Olahraga teratur</li>
        <li>Menjaga berat badan ideal</li>
        <li>Pemeriksaan gula darah secara berkala</li>
      </ul>`,
      excerpt: 'Diabetes dapat dicegah dengan pola hidup sehat. Kenali gejala awal dan cara pencegahan diabetes untuk hidup lebih sehat.',
      authorId: 'user-004',
      authorName: 'Dr. Rudi Hermawan',
      category: 'Penyakit Dalam',
      tags: ['diabetes', 'pencegahan', 'pola hidup sehat'],
      featuredImage: '/images/articles/diabetes.jpg',
      isPublished: true,
      views: 850,
      createdAt: new Date('2025-03-05'),
      updatedAt: new Date('2025-03-05')
    }
  ];
  
  // Add sample data to localDb
  sampleDoctors.forEach(doctor => {
    localDb.doctors[doctor.id] = doctor;
  });
  
  sampleUsers.forEach(user => {
    localDb.users[user.id] = user;
  });
  
  sampleTestimonials.forEach(testimonial => {
    localDb.testimonials[testimonial.id] = testimonial;
  });
  
  sampleAppointments.forEach(appointment => {
    localDb.appointments[appointment.id] = appointment;
  });

  sampleArticles.forEach(article => {
    localDb.articles[article.id] = article;
  });
  
  console.log('Mock database initialized with sample data');
}

// Call initialization when the module is loaded
initializeSeedData();

export class DatabaseService {
  private static instance: DatabaseService;

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Mock CRUD operations using in-memory storage
  async create<T>(collectionName: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<T & { id: string }>> {
    try {
      console.warn("Firebase has been removed. Using mock database implementation.");
      
      // Create a new ID - in a real app this would be handled by the database
      const id = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Prepare document with timestamps
      const now = new Date();
      // Use type assertion with unknown to fix TypeScript error
      const newDoc = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now
      } as unknown as T & { id: string };
      
      // Store in local mock DB
      if (!localDb[collectionName]) {
        localDb[collectionName] = {};
      }
      localDb[collectionName][id] = newDoc;

      return {
        success: true,
        data: newDoc
      };
    } catch (error) {
      console.error('Error creating document:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getById<T>(collectionName: string, id: string): Promise<ApiResponse<T>> {
    try {
      console.warn("Firebase has been removed. Using mock database implementation.");
      
      // Check if collection and document exist
      if (localDb[collectionName] && localDb[collectionName][id]) {
        return {
          success: true,
          data: localDb[collectionName][id] as T
        };
      } else {
        return {
          success: false,
          error: 'Document not found'
        };
      }
    } catch (error) {
      console.error('Error getting document:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async update<T>(collectionName: string, id: string, data: Partial<T>): Promise<ApiResponse<void>> {
    try {
      console.warn("Firebase has been removed. Using mock database implementation.");
      
      // Check if collection and document exist
      if (localDb[collectionName] && localDb[collectionName][id]) {
        // Update document
        localDb[collectionName][id] = {
          ...localDb[collectionName][id],
          ...data,
          updatedAt: new Date()
        };
        
        return {
          success: true
        };
      } else {
        return {
          success: false,
          error: 'Document not found'
        };
      }
    } catch (error) {
      console.error('Error updating document:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async delete(collectionName: string, id: string): Promise<ApiResponse<void>> {
    try {
      console.warn("Firebase has been removed. Using mock database implementation.");
      
      // Check if collection and document exist
      if (localDb[collectionName] && localDb[collectionName][id]) {
        // Delete the document from local mock DB
        delete localDb[collectionName][id];
        
        return {
          success: true
        };
      } else {
        return {
          success: false,
          error: 'Document not found'
        };
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getAll<T>(
    collectionName: string, 
    constraints: any[] = [] // Keep parameter for API compatibility
  ): Promise<ApiResponse<T[]>> {
    try {
      console.warn("Firebase has been removed. Using mock database implementation.");
      
      // Get all documents from local mock DB for the collection
      if (!localDb[collectionName]) {
        localDb[collectionName] = {};
      }
      
      const data = Object.values(localDb[collectionName]) as T[];
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error getting documents:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getPaginated<T>(
    collectionName: string,
    pageSize: number = 10,
    lastDoc?: any, // Keep parameter for API compatibility
    constraints: any[] = [] // Keep parameter for API compatibility
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    try {
      console.warn("Firebase has been removed. Using mock database implementation.");

      // Get all documents from mock DB
      if (!localDb[collectionName]) {
        localDb[collectionName] = {};
      }
      
      const allData = Object.values(localDb[collectionName]) as T[];
      const total = allData.length;
      
      // Calculate page from lastDoc (this is simplified)
      const page = 1; // Default to first page
      
      // Calculate start and end index for pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, total);
      
      // Get items for current page
      const paginatedItems = allData.slice(startIndex, endIndex);
      
      // Match the PaginatedResponse type format
      const result = {
        success: true,
        data: paginatedItems,
        meta: {
          page,
          limit: pageSize,
          totalCount: total,
          totalPages: Math.ceil(total / pageSize)
        }
      };

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error getting paginated documents:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async search<T>(
    collectionName: string,
    field: string,
    searchTerm: string,
    constraints: any[] = [] // Keep parameter for API compatibility
  ): Promise<ApiResponse<T[]>> {
    try {
      console.warn("Firebase has been removed. Using mock database implementation with client-side search.");

      // Get all documents from mock DB
      if (!localDb[collectionName]) {
        localDb[collectionName] = {};
      }
      
      const allData = Object.values(localDb[collectionName]) as any[];
      
      // Filter by search term (case-insensitive prefix search)
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filteredData = allData.filter(item => {
        if (!item[field]) return false;
        
        const fieldValue = String(item[field]).toLowerCase();
        return fieldValue.startsWith(lowerSearchTerm);
      }) as T[];

      return {
        success: true,
        data: filteredData
      };
    } catch (error) {
      console.error('Error searching documents:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Utility methods for date handling (Firebase Timestamp replacement)
  createTimestamp(date?: Date): Date {
    return date || new Date();
  }

  timestampToDate(timestamp: any): Date {
    // In our mock implementation, we're using regular Date objects
    if (timestamp instanceof Date) {
      return timestamp;
    }
    // Handle string or number timestamps
    return new Date(timestamp);
  }

  // Batch operations
  async batchCreate<T>(collectionName: string, dataArray: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<ApiResponse<string[]>> {
    try {
      const promises = dataArray.map(data => this.create<T>(collectionName, data));
      const results = await Promise.all(promises);
      
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (failed.length > 0) {
        return {
          success: false,
          error: `${failed.length} out of ${dataArray.length} documents failed to create`
        };
      }

      return {
        success: true,
        data: successful.map(r => r.data!.id)
      };
    } catch (error) {
      console.error('Error in batch create:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export const dbService = DatabaseService.getInstance();
