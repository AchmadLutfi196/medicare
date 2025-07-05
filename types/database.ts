// Database types and interfaces for Medicare Prima

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN' | 'STAFF';
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Doctor {
  id: string;
  userId: string; // Reference to User
  name: string;
  specialty: string;
  experience: string;
  education: string[];
  certifications: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  price: string;
  bio: string;
  profileImage: string;
  schedule: {
    [key: string]: string[]; // day: available times
  };
  consultationTypes: ('online' | 'offline' | 'emergency')[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: Date;
  appointmentTime: string;
  type: 'online' | 'offline' | 'emergency';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  symptoms?: string[];
  patientInfo: {
    name: string;
    email: string;
    phone: string;
    age: number;
    gender: string;
    emergencyContact?: string;
  };
  doctorInfo: {
    name: string;
    specialty: string;
  };
  consultationFee: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  patientName: string;
  doctorName: string;
  rating: number;
  comment: string;
  treatmentType: string;
  isVerified: boolean;
  isPublic: boolean;
  helpfulVotes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
  featuredImage: string;
  isPublished: boolean;
  views: number;
  likes: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  order: number;
  views: number;
  helpful: number;
  notHelpful: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  type: 'patient' | 'visitor' | 'emergency' | 'admission' | 'discharge' | 'general';
  icon: string;
  steps: string[];
  documents?: string[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyContact {
  id: string;
  name: string;
  department: string;
  phone: string;
  email: string;
  description: string;
  isActive: boolean;
  priority: number;
  availableHours: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  images: string[];
  capacity?: number;
  location?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HospitalInfo {
  id: string;
  name: string;
  description: string;
  mission: string;
  vision: string;
  values: string[];
  history: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  emergencyNumber: string;
  establishedYear: number;
  bedCapacity: number;
  departments: string[];
  accreditations: string[];
  awards: string[];
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  operatingHours: {
    [key: string]: string; // day: hours
  };
  updatedAt: Date;
}

export interface Management {
  id: string;
  name: string;
  position: string;
  department: string;
  education: string[];
  experience: string;
  bio: string;
  profileImage: string;
  email: string;
  phone?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
  };
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Form data types
export interface AppointmentFormData {
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  type: 'online' | 'offline' | 'emergency';
  reason: string;
  symptoms: string[];
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  emergencyContact?: string;
  notes?: string;
}

export interface TestimonialFormData {
  doctorId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  treatmentType: string;
  isPublic: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

// Paginated response
export interface PaginatedResponse<T = any> {
  success: boolean;
  data?: T[];
  meta: PaginationMeta;
  error?: string;
}

// Filter and query types
export interface DoctorFilters {
  specialty?: string;
  availability?: boolean;
  rating?: number;
  consultationType?: 'online' | 'offline' | 'emergency';
  search?: string;
}

export interface AppointmentFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  doctorId?: string;
  patientId?: string;
}

export interface TestimonialFilters {
  doctorId?: string;
  rating?: number;
  verified?: boolean;
  treatmentType?: string;
}
