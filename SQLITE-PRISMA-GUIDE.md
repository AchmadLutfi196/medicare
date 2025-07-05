# Panduan SQLite dengan Prisma di Medicare

Dokumen ini berisi panduan untuk menggunakan SQLite dengan Prisma pada proyek Medicare.

## Mengapa SQLite + Prisma?

SQLite adalah pilihan database yang baik untuk pengembangan karena:

- Tidak memerlukan server database terpisah
- Database disimpan dalam file lokal di proyek
- Mudah di-setup tanpa konfigurasi kompleks
- Performa yang baik untuk pengembangan

Prisma memberikan keuntungan:

- Type safety dengan TypeScript
- Kueri database yang intuitif
- Migrasi database otomatis
- Studio GUI untuk melihat dan mengedit data

## Struktur Project

```
medicare/
├── prisma/                # Folder Prisma
│   ├── schema.prisma      # Skema database
│   ├── migrations/        # Migrasi database
│   ├── dev.db             # File database SQLite
│   └── seed.ts            # Script untuk mengisi data awal
├── lib/
│   ├── prisma.ts          # Client Prisma
│   └── prisma-helpers.ts  # Helper untuk menangani konversi data
└── app/
    └── api/               # API routes yang menggunakan Prisma
```

## Memulai

1. **Setup Database**

   SQLite tidak memerlukan server terpisah. Database akan dibuat otomatis oleh Prisma.

2. **Menjalankan Migrasi**

   ```bash
   npx prisma migrate dev --name init
   ```

   Perintah ini akan membuat database SQLite dan menerapkan skema.

3. **Mengisi Data Awal**

   ```bash
   cd prisma && npx ts-node --project tsconfig.json seed.ts
   ```

   Atau bisa juga menjalankan:

   ```bash
   npx prisma db seed
   ```

4. **Melihat Data dengan Prisma Studio**

   ```bash
   npx prisma studio
   ```

   Buka browser di http://localhost:5555

## Penggunaan dengan SQLite

### 1. Penanganan Array

SQLite tidak mendukung tipe array secara native, jadi kita menyimpannya sebagai string JSON:

```typescript
// Menyimpan array
const doctor = await prisma.doctor.create({
  data: {
    // ...
    education: JSON.stringify(['MD Harvard', 'Cardiology Fellowship']),
    // ...
  }
});

// Membaca array
import { parseJsonArray } from '@/lib/prisma-helpers';
const educationArray = parseJsonArray(doctor.education);
```

### 2. Helper untuk Transformasi Data

File `lib/prisma-helpers.ts` berisi fungsi untuk membantu transformasi data:

```typescript
// Mengubah doctor dari database dengan array JSON ke object dengan array sebenarnya
const doctorWithArrays = transformDoctorModel(doctorFromDb);

// Mengubah list dokter
const doctorsWithArrays = transformDoctorModels(doctorsFromDb);
```

## API Endpoints

Prisma API endpoints tersedia di:

- `GET /api/doctors/prisma-route` - Mendapatkan daftar dokter
- `GET /api/doctors/prisma-route?id=123` - Mendapatkan detail dokter
- `POST /api/doctors/prisma-route` - Menambah dokter baru
- `PUT /api/doctors/prisma-route` - Memperbarui dokter
- `DELETE /api/doctors/prisma-route?id=123` - Menghapus dokter

## Command Prisma yang Berguna

```bash
# Melihat database dengan GUI
npx prisma studio

# Memperbarui skema dan menerapkan migrasi
npx prisma migrate dev

# Memperbarui client setelah perubahan skema
npx prisma generate

# Reset database dan migrasi ulang
npx prisma migrate reset
```

## Tips Penggunaan SQLite

1. **Backup Database**: Karena database disimpan sebagai file, lakukan backup secara teratur dengan menyalin file `prisma/dev.db`

2. **Batasan SQLite**: SQLite memiliki beberapa batasan dibanding database lain, seperti tidak mendukung beberapa operasi ALTER TABLE dan tidak mendukung konkurensi tinggi

3. **Produksi**: SQLite cocok untuk pengembangan, tetapi untuk produksi dengan traffic tinggi, pertimbangkan untuk migrasi ke PostgreSQL atau MySQL
