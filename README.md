# Medicare - Modern Healthcare Management System

## Description

Medicare is a comprehensive healthcare management platform designed to streamline medical services, appointment scheduling, and facility management. It connects patients with healthcare providers through an intuitive digital interface, making healthcare more accessible and manageable.

The system features separate portals for patients, doctors, and administrators, allowing each user type to access relevant functionalities while maintaining a cohesive experience across the platform.

## Technologies Used

- **Frontend**: 
  - Next.js 15.3.5 (React framework)
  - TypeScript
  - TailwindCSS
  - Lucide React (icons)
  - React Hook Form with Yup validation

- **Backend**:
  - Next.js API Routes
  - Prisma ORM
  - SQLite (development)
  - Mock database service (for offline/testing scenarios)

- **Authentication**:
  - Custom authentication system
  - JWT token-based authentication

- **Development Tools**:
  - TypeScript
  - ESLint
  - TurboRepo (for fast development)

## Features

### Patient Portal

- **Account Management**:
  - Registration and login
  - Profile management
  - Medical history tracking

- **Appointment System**:
  - Browse available doctors
  - Schedule, reschedule, and cancel appointments
  - View appointment history

- **Doctor Discovery**:
  - Find doctors by specialty
  - View doctor profiles, ratings, and availability
  - Read patient testimonials

- **Healthcare Information**:
  - Browse medical articles and resources
  - View facility information

### Doctor Portal

- **Schedule Management**:
  - Set availability hours
  - View upcoming appointments
  - Manage patient information

- **Profile Management**:
  - Update professional information
  - Manage specialties and services

### Admin Dashboard

- **User Management**:
  - Manage patient accounts
  - Onboard and manage doctors

- **Content Management**:
  - Create and edit medical articles
  - Manage facility information

- **System Administration**:
  - Monitor booking statistics
  - Database management
  - Configure system settings

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/medicare.git
   cd medicare
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up the database:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Deployment

To deploy to production:

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. For Vercel deployment:
   ```bash
   npm run prisma:generate && next build
   ```

## AI Support Explanation

This project has been enhanced with AI-assisted development in the following areas:

1. **Type Safety Implementation**:
   - AI helped identify and fix TypeScript union type handling with proper type guards
   - Enhanced code safety with the `in` operator for property checking across different facility types

2. **Mock Database Services**:
   - Implemented robust in-memory database services for development and testing
   - Created fallback mechanisms when external services are unavailable

3. **Error Handling**:
   - Enhanced UI with clear error states and fallback data
   - Improved user feedback for offline/mock mode

4. **Build and Deployment Optimization**:
   - Fixed Prisma client initialization issues on Vercel
   - Implemented proper build process to ensure database access in production

5. **Code Quality**:
   - Improved JSX structure and component organization
   - Enhanced reusability with proper hooks implementation

The AI-assisted development process helped identify and fix critical issues related to type safety, asynchronous data handling, and deployment configurations, resulting in a more stable and maintainable application.

## License

[MIT](LICENSE)

## Contact

For questions or feedback, please contact:
- Project Maintainer: [Your Name](mailto:your.email@example.com)
- Repository: [GitHub](https://github.com/your-username/medicare)
- **Notifikasi Real-time** - Alert dan update sistem

## 🎨 Design System

### Color Palette
- **Primary Color**: #0ABAB5 (Teal/Hijau Medical)
- **Mode**: Light mode only untuk kesan bersih dan profesional
- **Typography**: Geist Sans & Geist Mono
- **UI Components**: Modern, clean, dan user-friendly

### Visual Identity
- Warna hijau #0ABAB5 sebagai identitas visual utama
- Konsisten pada navigasi, tombol aksi, dan elemen penting
- Kesan tenang, profesional, dan terpercaya

## 🚀 Teknologi

- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Authentication**: Firebase Auth (konfigurasi tersedia)
- **Database**: Firebase Firestore (siap implementasi)
- **Form Handling**: React Hook Form + Yup validation
- **Responsive**: Mobile-first design

## 📦 Instalasi

1. Clone repository:
```bash
git clone [repository-url]
cd medicare
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan development server:
```bash
npm run dev
```

4. Buka browser di http://localhost:3000

## 🔐 Demo Accounts

### Admin Dashboard
- **Email**: admin@medicare.com
- **Password**: admin123
- **Akses**: http://localhost:3000/admin

### Patient Login
- **Email**: patient@gmail.com
- **Password**: patient123
- **Akses**: http://localhost:3000/login

## 📱 Struktur Halaman

```
/                 - Landing page
/doctors          - Direktori dokter
/schedule         - Jadwal praktik
/booking          - Booking online
/articles         - Artikel kesehatan
/contact          - Kontak & lokasi
/login            - Login pasien/admin
/admin            - Dashboard admin
/admin/doctors    - Manajemen dokter
/admin/bookings   - Manajemen booking
/admin/articles   - Manajemen artikel
```

## ⚙️ Konfigurasi Firebase

1. Buat project di Firebase Console
2. Enable Authentication dan Firestore
3. Update konfigurasi di `lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  // ... config lainnya
};
```

## 🔧 Customization

### Menambah Dokter Baru
Edit file `app/doctors/page.tsx` pada array `doctors`:

```typescript
const doctors: Doctor[] = [
  {
    id: 7,
    name: 'Dr. Nama Dokter, Sp.X',
    specialty: 'Spesialisasi',
    // ... properti lainnya
  }
];
```

### Menambah Jadwal Praktik
Edit file `app/schedule/page.tsx` pada array `scheduleData`.

### Menambah Artikel
Edit file `app/articles/page.tsx` pada array `articles`.

## 📈 Fitur Admin (Implementasi Lanjutan)

Dashboard admin sudah menyediakan framework untuk:
- CRUD data dokter
- Manajemen booking real-time
- Publikasi artikel
- Statistik dan monitoring
- Notifikasi sistem

## 🌐 Deployment

1. Build aplikasi:
```bash
npm run build
```

2. Deploy ke platform pilihan:
- Vercel (recommended)
- Netlify
- Digital Ocean
- AWS

## 📞 Kontak Darurat

Website ini menyediakan akses cepat ke layanan darurat:
- **IGD**: 119 (tersedia di semua halaman)
- **WhatsApp**: +62 812 3456 7890
- **Email**: info@medicare-prima.com

## 🚨 Catatan Penting

1. **Responsif**: Website dioptimalkan untuk semua ukuran perangkat
2. **SEO Friendly**: Meta tags dan struktur HTML yang baik
3. **Performance**: Optimized loading dengan Next.js
4. **Accessibility**: Mendukung screen readers dan keyboard navigation
5. **Security**: Implementasi best practices untuk keamanan data

## 📄 License

MIT License - Bebas digunakan dan dimodifikasi untuk keperluan rumah sakit.

---

**RS Medicare Prima** - Kesehatan Terbaik untuk Keluarga Anda
