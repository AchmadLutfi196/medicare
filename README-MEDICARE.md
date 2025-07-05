# RS Medicare Prima - Hospital Website

Website rumah sakit modern yang dirancang untuk memberikan akses mudah, informatif, dan interaktif bagi pasien, pengunjung, maupun staf internal rumah sakit.

## 🏥 Fitur Utama

### Untuk Pasien & Pengunjung
- **Landing Page** - Informasi umum rumah sakit, visi-misi, dan layanan unggulan
- **Direktori Dokter** - Daftar dokter spesialis dengan jadwal praktik
- **Jadwal Poliklinik** - Tabel interaktif jadwal layanan setiap poli
- **Booking Online** - Sistem booking janji temu dengan dokter
- **Artikel Kesehatan** - Konten edukatif dan berita kesehatan
- **Kontak & Lokasi** - Informasi lengkap dengan peta interaktif
- **Login Pasien** - Akses ke akun personal

### Untuk Admin/Staff
- **Dashboard Admin** - Panel kontrol dengan statistik dan monitoring
- **Manajemen Dokter** - CRUD data dokter dan jadwal praktik
- **Manajemen Booking** - Kelola reservasi dan janji temu pasien
- **Manajemen Artikel** - Publikasi dan edit artikel kesehatan
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
