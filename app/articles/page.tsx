'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, Search, Filter, Eye, Heart, Share2 } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  publishDate: string;
  readTime: string;
  views: number;
  likes: number;
  image: string;
  featured: boolean;
}

const ArticlesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const articles: Article[] = [
    {
      id: 1,
      title: 'Tips Menjaga Kesehatan Jantung di Era Modern',
      excerpt: 'Penyakit jantung menjadi salah satu penyebab kematian tertinggi di dunia. Pelajari cara menjaga kesehatan jantung dengan gaya hidup sehat.',
      content: 'Artikel lengkap tentang cara menjaga kesehatan jantung...',
      author: 'Dr. Ahmad Wijaya, Sp.JP',
      category: 'Kardiologi',
      publishDate: '2024-01-15',
      readTime: '5 menit',
      views: 1234,
      likes: 89,
      image: '/api/placeholder/400/250',
      featured: true
    },
    {
      id: 2,
      title: 'Pentingnya Imunisasi Lengkap untuk Anak',
      excerpt: 'Imunisasi adalah investasi terbaik untuk melindungi anak dari berbagai penyakit berbahaya. Ketahui jadwal imunisasi yang tepat.',
      content: 'Panduan lengkap tentang imunisasi anak...',
      author: 'Dr. Siti Nurhaliza, Sp.A',
      category: 'Anak',
      publishDate: '2024-01-12',
      readTime: '7 menit',
      views: 987,
      likes: 76,
      image: '/api/placeholder/400/250',
      featured: false
    },
    {
      id: 3,
      title: 'Memahami Diabetes: Pencegahan dan Pengelolaan',
      excerpt: 'Diabetes mellitus dapat dicegah dan dikelola dengan baik. Pelajari tentang gejala, pencegahan, dan pengelolaan diabetes.',
      content: 'Informasi komprehensif tentang diabetes...',
      author: 'Dr. Rudi Hermawan, Sp.PD',
      category: 'Penyakit Dalam',
      publishDate: '2024-01-10',
      readTime: '8 menit',
      views: 1456,
      likes: 112,
      image: '/api/placeholder/400/250',
      featured: true
    },
    {
      id: 4,
      title: 'Perawatan Mata di Era Digital',
      excerpt: 'Penggunaan gadget yang berlebihan dapat memengaruhi kesehatan mata. Temukan tips untuk menjaga kesehatan mata di era digital.',
      content: 'Tips perawatan mata untuk pengguna gadget...',
      author: 'Dr. Lisa Maharani, Sp.M',
      category: 'Mata',
      publishDate: '2024-01-08',
      readTime: '6 menit',
      views: 823,
      likes: 65,
      image: '/api/placeholder/400/250',
      featured: false
    },
    {
      id: 5,
      title: 'Persiapan Kehamilan yang Sehat',
      excerpt: 'Persiapan kehamilan yang baik sangat penting untuk kesehatan ibu dan janin. Pelajari langkah-langkah persiapan kehamilan.',
      content: 'Panduan persiapan kehamilan yang sehat...',
      author: 'Dr. Budi Santoso, Sp.OG',
      category: 'Obstetri & Ginekologi',
      publishDate: '2024-01-05',
      readTime: '9 menit',
      views: 1123,
      likes: 94,
      image: '/api/placeholder/400/250',
      featured: false
    },
    {
      id: 6,
      title: 'Mengatasi Masalah Kulit Akibat Polusi',
      excerpt: 'Polusi udara dapat menyebabkan berbagai masalah kulit. Ketahui cara melindungi dan merawat kulit dari dampak polusi.',
      content: 'Tips perawatan kulit dari polusi...',
      author: 'Dr. Maya Indrawati, Sp.KK',
      category: 'Kulit & Kelamin',
      publishDate: '2024-01-03',
      readTime: '5 menit',
      views: 756,
      likes: 58,
      image: '/api/placeholder/400/250',
      featured: false
    },
    {
      id: 7,
      title: 'Manajemen Stres untuk Kesehatan Mental',
      excerpt: 'Stres berkepanjangan dapat berdampak negatif pada kesehatan fisik dan mental. Pelajari teknik manajemen stres yang efektif.',
      content: 'Strategi mengelola stres untuk kesehatan mental...',
      author: 'Dr. Ahmad Wijaya, Sp.JP',
      category: 'Kesehatan Mental',
      publishDate: '2024-01-01',
      readTime: '10 menit',
      views: 1887,
      likes: 156,
      image: '/api/placeholder/400/250',
      featured: true
    },
    {
      id: 8,
      title: 'Nutrisi Seimbang untuk Daya Tahan Tubuh',
      excerpt: 'Nutrisi yang seimbang adalah kunci untuk membangun daya tahan tubuh yang kuat. Ketahui makanan yang dapat meningkatkan imunitas.',
      content: 'Panduan nutrisi untuk meningkatkan imunitas...',
      author: 'Dr. Rudi Hermawan, Sp.PD',
      category: 'Gizi',
      publishDate: '2023-12-28',
      readTime: '7 menit',
      views: 1345,
      likes: 103,
      image: '/api/placeholder/400/250',
      featured: false
    }
  ];

  const categories = [
    'Semua Kategori',
    'Kardiologi',
    'Anak',
    'Penyakit Dalam',
    'Mata',
    'Obstetri & Ginekologi',
    'Kulit & Kelamin',
    'Kesehatan Mental',
    'Gizi'
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'Semua Kategori' ||
                           article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="pt-20 pb-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Artikel Kesehatan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dapatkan informasi kesehatan terpercaya dari para dokter spesialis kami
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari artikel kesehatan..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Artikel Unggulan</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredArticles.slice(0, 2).map((article) => (
                <div key={article.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                    <Heart className="w-12 h-12 text-teal-600" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-teal-100 text-teal-600 px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                      <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs font-medium">
                        Unggulan
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(article.publishDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>{article.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          <span>{article.likes}</span>
                        </div>
                      </div>
                      <Link href={`/articles/${article.id}`}>
                        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                          Baca Selengkapnya
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Articles */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {featuredArticles.length > 0 ? 'Artikel Lainnya' : 'Semua Artikel'}
            </h2>
            <p className="text-gray-600">
              Menampilkan {filteredArticles.length} artikel
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-gray-400" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      <span className="truncate">{article.author.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        <span>{article.views}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        <span>{article.likes}</span>
                      </div>
                    </div>
                    <Link href={`/articles/${article.id}`}>
                      <button className="text-teal-600 hover:text-teal-700 font-semibold text-sm transition-colors">
                        Baca →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Artikel tidak ditemukan
            </h3>
            <p className="text-gray-600">
              Coba ubah kata kunci pencarian atau filter kategori
            </p>
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className="bg-teal-600 rounded-xl p-8 text-center text-white mt-12">
          <h3 className="text-2xl font-bold mb-4">
            Berlangganan Newsletter Kesehatan
          </h3>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
            Dapatkan artikel kesehatan terbaru dan tips kesehatan langsung di email Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-teal-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors">
              Berlangganan
            </button>
          </div>
        </div>

        {/* Health Tips Quick Access */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Tips Darurat</h4>
            <p className="text-sm text-gray-600 mb-4">
              Panduan pertolongan pertama dan penanganan darurat
            </p>
            <Link href="/articles?category=Darurat">
              <button className="text-teal-600 hover:text-teal-700 font-semibold text-sm">
                Pelajari →
              </button>
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Gaya Hidup Sehat</h4>
            <p className="text-sm text-gray-600 mb-4">
              Tips menjaga kesehatan dengan pola hidup sehat
            </p>
            <Link href="/articles?category=Gaya%20Hidup">
              <button className="text-teal-600 hover:text-teal-700 font-semibold text-sm">
                Pelajari →
              </button>
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Jadwal Checkup</h4>
            <p className="text-sm text-gray-600 mb-4">
              Panduan jadwal pemeriksaan kesehatan rutin
            </p>
            <Link href="/articles?category=Checkup">
              <button className="text-teal-600 hover:text-teal-700 font-semibold text-sm">
                Pelajari →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
