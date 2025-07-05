'use client';

import React, { useState } from 'react';
import { Search, Filter, Clock, MapPin, Star, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image: string;
  experience: string;
  rating: number;
  reviews: number;
  schedule: string[];
  location: string;
  price: string;
  education: string;
  languages: string[];
}

const DoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Ahmad Wijaya, Sp.JP',
      specialty: 'Jantung dan Pembuluh Darah',
      image: '/api/placeholder/150/150',
      experience: '15 tahun',
      rating: 4.9,
      reviews: 127,
      schedule: ['Senin', 'Rabu', 'Jumat'],
      location: 'Lantai 3, Ruang 301',
      price: 'Rp 350.000',
      education: 'Universitas Indonesia',
      languages: ['Indonesia', 'English']
    },
    {
      id: 2,
      name: 'Dr. Siti Nurhaliza, Sp.A',
      specialty: 'Anak',
      image: '/api/placeholder/150/150',
      experience: '12 tahun',
      rating: 4.8,
      reviews: 98,
      schedule: ['Selasa', 'Kamis', 'Sabtu'],
      location: 'Lantai 2, Ruang 205',
      price: 'Rp 275.000',
      education: 'Universitas Gadjah Mada',
      languages: ['Indonesia', 'English']
    },
    {
      id: 3,
      name: 'Dr. Budi Santoso, Sp.OG',
      specialty: 'Obstetri dan Ginekologi',
      image: '/api/placeholder/150/150',
      experience: '18 tahun',
      rating: 4.9,
      reviews: 156,
      schedule: ['Senin', 'Selasa', 'Kamis'],
      location: 'Lantai 4, Ruang 401',
      price: 'Rp 400.000',
      education: 'Universitas Airlangga',
      languages: ['Indonesia', 'English', 'Mandarin']
    },
    {
      id: 4,
      name: 'Dr. Lisa Maharani, Sp.M',
      specialty: 'Mata',
      image: '/api/placeholder/150/150',
      experience: '10 tahun',
      rating: 4.7,
      reviews: 89,
      schedule: ['Rabu', 'Jumat', 'Sabtu'],
      location: 'Lantai 2, Ruang 210',
      price: 'Rp 300.000',
      education: 'Universitas Padjadjaran',
      languages: ['Indonesia', 'English']
    },
    {
      id: 5,
      name: 'Dr. Rudi Hermawan, Sp.PD',
      specialty: 'Penyakit Dalam',
      image: '/api/placeholder/150/150',
      experience: '20 tahun',
      rating: 4.8,
      reviews: 134,
      schedule: ['Senin', 'Rabu', 'Jumat'],
      location: 'Lantai 3, Ruang 305',
      price: 'Rp 325.000',
      education: 'Universitas Indonesia',
      languages: ['Indonesia', 'English']
    },
    {
      id: 6,
      name: 'Dr. Maya Indrawati, Sp.KK',
      specialty: 'Kulit dan Kelamin',
      image: '/api/placeholder/150/150',
      experience: '8 tahun',
      rating: 4.6,
      reviews: 67,
      schedule: ['Selasa', 'Kamis', 'Sabtu'],
      location: 'Lantai 2, Ruang 208',
      price: 'Rp 285.000',
      education: 'Universitas Brawijaya',
      languages: ['Indonesia', 'English']
    }
  ];

  const specialties = [
    'Semua Spesialisasi',
    'Jantung dan Pembuluh Darah',
    'Anak',
    'Obstetri dan Ginekologi',
    'Mata',
    'Penyakit Dalam',
    'Kulit dan Kelamin'
  ];

  const days = [
    'Semua Hari',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu'
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === '' || selectedSpecialty === 'Semua Spesialisasi' ||
                            doctor.specialty === selectedSpecialty;
    const matchesDay = selectedDay === '' || selectedDay === 'Semua Hari' ||
                      doctor.schedule.includes(selectedDay);
    
    return matchesSearch && matchesSpecialty && matchesDay;
  });

  return (
    <div className="pt-20 pb-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Direktori Dokter Spesialis
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Temukan dokter spesialis terbaik kami dengan jadwal praktik yang fleksibel
            sesuai kebutuhan Anda
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama dokter atau spesialisasi..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Specialty Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Day Filter */}
            <div className="relative">
              <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Menampilkan {filteredDoctors.length} dari {doctors.length} dokter
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6">
              {/* Doctor Image and Basic Info */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-semibold text-lg">
                    {doctor.name.split(' ')[1]?.[0] || 'D'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-teal-600 font-medium mb-2">
                    {doctor.specialty}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700 ml-1">
                        {doctor.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({doctor.reviews} ulasan)
                    </span>
                  </div>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Pengalaman: {doctor.experience}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{doctor.location}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Jadwal: </span>
                  {doctor.schedule.join(', ')}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-teal-600">
                    Tarif Konsultasi: {doctor.price}
                  </span>
                </div>
              </div>

              {/* Languages */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {doctor.languages.map((language) => (
                    <span
                      key={language}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link href={`/booking?doctor=${doctor.id}`} className="flex-1">
                  <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Booking</span>
                  </button>
                </Link>
                <Link href={`/doctors/${doctor.id}`}>
                  <button className="px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-colors">
                    Detail
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Dokter tidak ditemukan
            </h3>
            <p className="text-gray-600">
              Coba ubah kata kunci pencarian atau filter yang dipilih
            </p>
          </div>
        )}

        {/* Emergency Section */}
        <div className="mt-12 bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-red-800 mb-2">
              Kondisi Darurat?
            </h3>
            <p className="text-red-700 mb-4">
              Untuk kondisi darurat medis, segera hubungi IGD kami
            </p>
            <Link href="tel:119">
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 mx-auto">
                <MapPin className="w-5 h-5" />
                <span>Hubungi IGD: 119</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
