'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  TrendingUp
} from 'lucide-react';

const ArticlesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const articles = [
    {
      id: 1,
      title: 'Tips Menjaga Kesehatan Jantung di Era Modern',
      category: 'Kardiologi',
      author: 'Dr. Ahmad Wijaya, Sp.JP',
      publishDate: '2024-01-15',
      status: 'Published',
      views: 1250,
      likes: 89,
      excerpt: 'Penyakit jantung menjadi salah satu penyebab kematian tertinggi di dunia. Artikel ini membahas cara-cara praktis menjaga kesehatan jantung...'
    },
    {
      id: 2,
      title: 'Pentingnya Imunisasi Pada Anak',
      category: 'Pediatri',
      author: 'Dr. Siti Nurhaliza, Sp.A',
      publishDate: '2024-01-14',
      status: 'Published',
      views: 980,
      likes: 67,
      excerpt: 'Imunisasi adalah cara terbaik melindungi anak dari berbagai penyakit berbahaya. Mari pelajari jadwal dan jenis imunisasi yang diperlukan...'
    },
    {
      id: 3,
      title: 'Cara Menjaga Kesehatan Mata di Era Digital',
      category: 'Oftalmologi',
      author: 'Dr. Lisa Maharani, Sp.M',
      publishDate: '2024-01-13',
      status: 'Draft',
      views: 0,
      likes: 0,
      excerpt: 'Penggunaan gadget yang berlebihan dapat merusak kesehatan mata. Pelajari tips menjaga mata tetap sehat di era digital...'
    },
    {
      id: 4,
      title: 'Mengelola Diabetes dengan Gaya Hidup Sehat',
      category: 'Penyakit Dalam',
      author: 'Dr. Rudi Hermawan, Sp.PD',
      publishDate: '2024-01-12',
      status: 'Published',
      views: 1580,
      likes: 123,
      excerpt: 'Diabetes dapat dikelola dengan baik melalui gaya hidup sehat. Artikel ini memberikan panduan lengkap mengelola diabetes...'
    },
    {
      id: 5,
      title: 'Pencegahan Osteoporosis pada Lansia',
      category: 'Ortopedi',
      author: 'Dr. Ahmad Saputra, Sp.OT',
      publishDate: '2024-01-11',
      status: 'Review',
      views: 0,
      likes: 0,
      excerpt: 'Osteoporosis adalah masalah umum pada lansia. Pelajari cara-cara efektif mencegah dan mengelola osteoporosis...'
    }
  ];

  const categories = ['Semua', 'Kardiologi', 'Pediatri', 'Oftalmologi', 'Penyakit Dalam', 'Ortopedi', 'Bedah'];
  const statuses = ['Semua', 'Published', 'Draft', 'Review', 'Archived'];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || filterCategory === 'Semua' || 
                           article.category === filterCategory;
    const matchesStatus = filterStatus === '' || filterStatus === 'Semua' || 
                         article.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
  const totalLikes = articles.reduce((sum, article) => sum + article.likes, 0);
  const publishedCount = articles.filter(article => article.status === 'Published').length;
  const draftCount = articles.filter(article => article.status === 'Draft').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Artikel</h1>
          <p className="text-gray-600">Kelola konten artikel dan edukasi kesehatan</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Tulis Artikel</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Artikel</p>
              <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Terpublikasi</p>
              <p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Draft</p>
              <p className="text-2xl font-bold text-gray-900">{draftCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cari Artikel</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari judul atau penulis..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artikel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Penulis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views/Likes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">{article.title}</div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">{article.excerpt}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm text-gray-900">{article.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {article.publishDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(article.status)}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{article.views} views</div>
                    <div>{article.likes} likes</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-teal-600 hover:text-teal-900" title="Lihat">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
