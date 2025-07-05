'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  Quote, 
  ThumbsUp, 
  CheckCircle, 
  Heart,
  Users,
  TrendingUp,
  Award,
  Filter,
  Search,
  Calendar,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';

export default function TestimonialsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const testimonials = [
    {
      id: 1,
      name: 'Ibu Sari Dewi',
      age: 45,
      treatment: 'Operasi Jantung',
      department: 'Kardiologi',
      doctor: 'Dr. Andi Wijaya, Sp.JP(K)',
      rating: 5,
      date: '2024-01-15',
      comment: 'Pelayanan sangat profesional dan fasilitas sangat lengkap. Tim medis yang sangat berpengalaman membuat saya merasa aman. Proses operasi berjalan lancar dan pemulihan saya sangat baik berkat perawatan yang optimal.',
      helpful: 156,
      verified: true,
      avatar: '/api/placeholder/60/60'
    },
    {
      id: 2,
      name: 'Bapak Ahmad Rizki',
      age: 52,
      treatment: 'Perawatan Kanker',
      department: 'Onkologi',
      doctor: 'Dr. Bambang Sutrisno, Sp.B(K)Onk',
      rating: 5,
      date: '2024-02-20',
      comment: 'Terima kasih kepada seluruh tim onkologi RS Medicare Prima. Perawatan yang diberikan sangat komprehensif dan penuh empati. Saya sangat terbantu dengan program support group yang disediakan rumah sakit.',
      helpful: 142,
      verified: true,
      avatar: '/api/placeholder/60/60'
    },
    {
      id: 3,
      name: 'Ibu Maya Sartika',
      age: 28,
      treatment: 'Persalinan Caesar',
      department: 'Obstetri & Ginekologi',
      doctor: 'Dr. Lisa Maharani, Sp.OG',
      rating: 5,
      date: '2024-03-10',
      comment: 'Pengalaman melahirkan yang sangat berkesan. Dokter dan bidan sangat ramah, fasilitas NICU terbaik untuk si kecil. Kamar bersalin sangat nyaman dan bersih. Pelayanan 24 jam sangat membantu.',
      helpful: 198,
      verified: true,
      avatar: '/api/placeholder/60/60'
    },
    {
      id: 4,
      name: 'Bapak Dedi Kurniawan',
      age: 35,
      treatment: 'Operasi Tulang Belakang',
      department: 'Ortopedi',
      doctor: 'Dr. Rudi Hermawan, Sp.OT',
      rating: 5,
      date: '2024-03-25',
      comment: 'Setelah bertahun-tahun menderita sakit punggung, akhirnya saya mendapat solusi terbaik di RS Medicare Prima. Operasi berjalan sukses dan sekarang saya bisa beraktivitas normal kembali.',
      helpful: 87,
      verified: true,
      avatar: '/api/placeholder/60/60'
    },
    {
      id: 5,
      name: 'Ibu Rina Permata',
      age: 38,
      treatment: 'Perawatan Diabetes',
      department: 'Endokrinologi',
      doctor: 'Dr. Maya Indrawati, Sp.PD',
      rating: 5,
      date: '2024-04-05',
      comment: 'Program edukasi diabetes di RS Medicare Prima sangat membantu saya memahami cara mengelola penyakit ini. Tim medis sangat sabar dalam memberikan penjelasan dan support yang dibutuhkan.',
      helpful: 134,
      verified: true,
      avatar: '/api/placeholder/60/60'
    },
    {
      id: 6,
      name: 'Bapak Hendra Wijaya',
      age: 42,
      treatment: 'Medical Check Up',
      department: 'Kesehatan Umum',
      doctor: 'Dr. Siti Nurhaliza, Sp.PD',
      rating: 5,
      date: '2024-04-18',
      comment: 'Medical check up yang sangat komprehensif dengan peralatan canggih. Hasil pemeriksaan dijelaskan dengan detail dan saya mendapat rekomendasi gaya hidup yang sangat bermanfaat.',
      helpful: 76,
      verified: true,
      avatar: '/api/placeholder/60/60'
    },
    {
      id: 7,
      name: 'Ibu Lestari Ningrum',
      age: 29,
      treatment: 'Perawatan Anak',
      department: 'Pediatri',
      doctor: 'Dr. Sari Indrawati, Sp.A(K)',
      rating: 5,
      date: '2024-04-22',
      comment: 'Anak saya mendapat perawatan terbaik di unit pediatri. Dokter anak sangat sabar dan ramah dengan anak-anak. Fasilitas bermain di ruang tunggu membuat anak tidak takut ke rumah sakit.',
      helpful: 203,
      verified: true,
      avatar: '/api/placeholder/60/60'
    },
    {
      id: 8,
      name: 'Bapak Yoga Pratama',
      age: 31,
      treatment: 'Operasi Mata',
      department: 'Oftalmologi',
      doctor: 'Dr. Lisa Maharani, Sp.M',
      rating: 5,
      date: '2024-05-01',
      comment: 'Operasi katarak berjalan sangat lancar. Teknologi laser yang digunakan sangat canggih dan hasilnya memuaskan. Penglihatan saya kembali jernih dan saya sangat bersyukur.',
      helpful: 89,
      verified: true,
      avatar: '/api/placeholder/60/60'
    }
  ];

  const departments = [
    'all',
    'Kardiologi',
    'Onkologi', 
    'Obstetri & Ginekologi',
    'Ortopedi',
    'Endokrinologi',
    'Kesehatan Umum',
    'Pediatri',
    'Oftalmologi'
  ];

  const stats = [
    { label: 'Total Testimoni', value: '15,482', icon: MessageCircle, color: 'text-blue-600' },
    { label: 'Rating Rata-rata', value: '4.9/5', icon: Star, color: 'text-yellow-500' },
    { label: 'Tingkat Kepuasan', value: '98.5%', icon: ThumbsUp, color: 'text-green-600' },
    { label: 'Pasien Merekomendasikan', value: '96.2%', icon: Heart, color: 'text-red-500' }
  ];

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesFilter = selectedFilter === 'all' || testimonial.department === selectedFilter;
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.comment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTestimonials = filteredTestimonials.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <Link href="/" className="text-teal-100 hover:text-white mr-4">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-5xl font-bold">Testimoni Pasien</h1>
            </div>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Cerita nyata dari ribuan pasien yang telah merasakan pelayanan terbaik RS Medicare Prima
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center shadow-lg`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari testimoni..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Department Filter */}
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedFilter(dept)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    selectedFilter === dept
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-teal-100'
                  }`}
                >
                  {dept === 'all' ? 'Semua Departemen' : dept}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">Usia {testimonial.age} tahun</p>
                    </div>
                  </div>
                  {testimonial.verified && (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(testimonial.date).toLocaleDateString('id-ID')}
                  </div>
                </div>

                {/* Treatment Info */}
                <div className="mb-4">
                  <div className="text-sm font-semibold text-teal-600 mb-1">{testimonial.treatment}</div>
                  <div className="text-sm text-gray-600">{testimonial.department} • {testimonial.doctor}</div>
                </div>

                {/* Comment */}
                <div className="mb-4">
                  <Quote className="w-6 h-6 text-teal-300 mb-2" />
                  <p className="text-gray-700 italic">&quot;{testimonial.comment}&quot;</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">Membantu ({testimonial.helpful})</span>
                  </button>
                  <div className="text-xs text-gray-400">
                    ID: #{testimonial.id.toString().padStart(4, '0')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sebelumnya
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === index + 1
                      ? 'bg-teal-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Write Review CTA */}
      <section className="py-16 bg-teal-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              Bagikan Pengalaman Anda
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              Ceritakan pengalaman Anda bersama RS Medicare Prima untuk membantu pasien lainnya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Tulis Testimoni</span>
              </button>
              <Link href="/contact">
                <button className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Hubungi Kami</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
