'use client';

import React, { useState, useMemo } from 'react';
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
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useTestimonials } from '../../hooks/useTestimonials';

export default function TestimonialsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch testimonials from database
  const { 
    testimonials, 
    loading, 
    error, 
    stats, 
    treatmentTypes, 
    addHelpfulVote 
  } = useTestimonials();

  // Memoized filter departments
  const departments = useMemo(() => [
    'all',
    ...treatmentTypes
  ], [treatmentTypes]);

  // Filtered testimonials based on search and filter
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter(testimonial => {
      const matchesFilter = selectedFilter === 'all' || testimonial.treatmentType === selectedFilter;
      const matchesSearch = testimonial.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           testimonial.treatmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           testimonial.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           testimonial.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [testimonials, selectedFilter, searchTerm]);

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTestimonials = filteredTestimonials.slice(startIndex, startIndex + itemsPerPage);

  // Handle helpful vote
  const handleHelpfulVote = async (testimonialId: string) => {
    await addHelpfulVote(testimonialId);
  };

  // Loading state
  if (loading) {
    return (
      <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat testimoni...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Statistics display
  const displayStats = [
    { 
      label: 'Total Testimoni', 
      value: stats?.total ? stats.total.toLocaleString() : '0', 
      icon: MessageCircle, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Rating Rata-rata', 
      value: stats?.averageRating ? `${stats.averageRating}/5` : '0/5', 
      icon: Star, 
      color: 'text-yellow-500' 
    },
    { 
      label: 'Testimoni Terverifikasi', 
      value: stats?.verified ? stats.verified.toLocaleString() : '0', 
      icon: CheckCircle, 
      color: 'text-green-600' 
    },
    { 
      label: 'Total Helpful Votes', 
      value: stats?.totalHelpfulVotes ? stats.totalHelpfulVotes.toLocaleString() : '0', 
      icon: Heart, 
      color: 'text-red-500' 
    }
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayStats.map((stat, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full bg-white ${stat.color}`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari testimoni..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
              {departments.map((department) => (
                <button
                  key={department}
                  onClick={() => setSelectedFilter(department)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === department
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {department === 'all' ? 'Semua' : department}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {paginatedTestimonials.length === 0 ? (
            <div className="text-center py-16">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada testimoni ditemukan</h3>
              <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-teal-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">{testimonial.patientName}</h3>
                        <p className="text-sm text-gray-600">Pasien</p>
                      </div>
                    </div>
                    {testimonial.isVerified && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {new Date(testimonial.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  {/* Treatment Info */}
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-teal-600 mb-1">{testimonial.treatmentType}</div>
                    <div className="text-sm text-gray-600">{testimonial.doctorName}</div>
                  </div>

                  {/* Comment */}
                  <div className="mb-4">
                    <Quote className="w-5 h-5 text-gray-300 mb-2" />
                    <p className="text-gray-700 line-clamp-4">{testimonial.comment}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => handleHelpfulVote(testimonial.id)}
                      className="flex items-center text-gray-500 hover:text-teal-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      <span className="text-sm">Membantu ({testimonial.helpfulVotes})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === i + 1
                        ? 'bg-teal-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
