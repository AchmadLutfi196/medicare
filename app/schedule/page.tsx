'use client';

import React, { useState } from 'react';
import { Clock, MapPin, Calendar, Filter, User } from 'lucide-react';
import Link from 'next/link';

interface ScheduleItem {
  id: number;
  doctor: string;
  specialty: string;
  day: string;
  time: string;
  location: string;
  availability: 'Available' | 'Limited' | 'Full';
  maxPatients: number;
  currentPatients: number;
}

const SchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const scheduleData: ScheduleItem[] = [
    {
      id: 1,
      doctor: 'Dr. Ahmad Wijaya, Sp.JP',
      specialty: 'Jantung dan Pembuluh Darah',
      day: 'Senin',
      time: '08:00 - 12:00',
      location: 'Lantai 3, Ruang 301',
      availability: 'Available',
      maxPatients: 20,
      currentPatients: 5
    },
    {
      id: 2,
      doctor: 'Dr. Siti Nurhaliza, Sp.A',
      specialty: 'Anak',
      day: 'Senin',
      time: '13:00 - 17:00',
      location: 'Lantai 2, Ruang 205',
      availability: 'Limited',
      maxPatients: 15,
      currentPatients: 12
    },
    {
      id: 3,
      doctor: 'Dr. Budi Santoso, Sp.OG',
      specialty: 'Obstetri dan Ginekologi',
      day: 'Senin',
      time: '08:00 - 12:00',
      location: 'Lantai 4, Ruang 401',
      availability: 'Available',
      maxPatients: 18,
      currentPatients: 8
    },
    {
      id: 4,
      doctor: 'Dr. Ahmad Wijaya, Sp.JP',
      specialty: 'Jantung dan Pembuluh Darah',
      day: 'Selasa',
      time: '08:00 - 12:00',
      location: 'Lantai 3, Ruang 301',
      availability: 'Full',
      maxPatients: 20,
      currentPatients: 20
    },
    {
      id: 5,
      doctor: 'Dr. Lisa Maharani, Sp.M',
      specialty: 'Mata',
      day: 'Selasa',
      time: '13:00 - 17:00',
      location: 'Lantai 2, Ruang 210',
      availability: 'Available',
      maxPatients: 16,
      currentPatients: 3
    },
    {
      id: 6,
      doctor: 'Dr. Maya Indrawati, Sp.KK',
      specialty: 'Kulit dan Kelamin',
      day: 'Selasa',
      time: '08:00 - 12:00',
      location: 'Lantai 2, Ruang 208',
      availability: 'Limited',
      maxPatients: 12,
      currentPatients: 10
    },
    {
      id: 7,
      doctor: 'Dr. Ahmad Wijaya, Sp.JP',
      specialty: 'Jantung dan Pembuluh Darah',
      day: 'Rabu',
      time: '13:00 - 17:00',
      location: 'Lantai 3, Ruang 301',
      availability: 'Available',
      maxPatients: 20,
      currentPatients: 7
    },
    {
      id: 8,
      doctor: 'Dr. Rudi Hermawan, Sp.PD',
      specialty: 'Penyakit Dalam',
      day: 'Rabu',
      time: '08:00 - 12:00',
      location: 'Lantai 3, Ruang 305',
      availability: 'Available',
      maxPatients: 22,
      currentPatients: 9
    },
    {
      id: 9,
      doctor: 'Dr. Lisa Maharani, Sp.M',
      specialty: 'Mata',
      day: 'Rabu',
      time: '08:00 - 12:00',
      location: 'Lantai 2, Ruang 210',
      availability: 'Limited',
      maxPatients: 16,
      currentPatients: 14
    },
    {
      id: 10,
      doctor: 'Dr. Siti Nurhaliza, Sp.A',
      specialty: 'Anak',
      day: 'Kamis',
      time: '08:00 - 12:00',
      location: 'Lantai 2, Ruang 205',
      availability: 'Available',
      maxPatients: 15,
      currentPatients: 4
    },
    {
      id: 11,
      doctor: 'Dr. Budi Santoso, Sp.OG',
      specialty: 'Obstetri dan Ginekologi',
      day: 'Kamis',
      time: '13:00 - 17:00',
      location: 'Lantai 4, Ruang 401',
      availability: 'Limited',
      maxPatients: 18,
      currentPatients: 15
    },
    {
      id: 12,
      doctor: 'Dr. Maya Indrawati, Sp.KK',
      specialty: 'Kulit dan Kelamin',
      day: 'Kamis',
      time: '08:00 - 12:00',
      location: 'Lantai 2, Ruang 208',
      availability: 'Available',
      maxPatients: 12,
      currentPatients: 6
    },
    {
      id: 13,
      doctor: 'Dr. Ahmad Wijaya, Sp.JP',
      specialty: 'Jantung dan Pembuluh Darah',
      day: 'Jumat',
      time: '08:00 - 12:00',
      location: 'Lantai 3, Ruang 301',
      availability: 'Available',
      maxPatients: 20,
      currentPatients: 11
    },
    {
      id: 14,
      doctor: 'Dr. Rudi Hermawan, Sp.PD',
      specialty: 'Penyakit Dalam',
      day: 'Jumat',
      time: '13:00 - 17:00',
      location: 'Lantai 3, Ruang 305',
      availability: 'Limited',
      maxPatients: 22,
      currentPatients: 19
    },
    {
      id: 15,
      doctor: 'Dr. Lisa Maharani, Sp.M',
      specialty: 'Mata',
      day: 'Jumat',
      time: '08:00 - 12:00',
      location: 'Lantai 2, Ruang 210',
      availability: 'Available',
      maxPatients: 16,
      currentPatients: 8
    },
    {
      id: 16,
      doctor: 'Dr. Siti Nurhaliza, Sp.A',
      specialty: 'Anak',
      day: 'Sabtu',
      time: '08:00 - 12:00',
      location: 'Lantai 2, Ruang 205',
      availability: 'Limited',
      maxPatients: 15,
      currentPatients: 13
    },
    {
      id: 17,
      doctor: 'Dr. Maya Indrawati, Sp.KK',
      specialty: 'Kulit dan Kelamin',
      day: 'Sabtu',
      time: '13:00 - 17:00',
      location: 'Lantai 2, Ruang 208',
      availability: 'Available',
      maxPatients: 12,
      currentPatients: 5
    }
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

  const specialties = [
    'Semua Spesialisasi',
    'Jantung dan Pembuluh Darah',
    'Anak',
    'Obstetri dan Ginekologi',
    'Mata',
    'Penyakit Dalam',
    'Kulit dan Kelamin'
  ];

  const filteredSchedule = scheduleData.filter(item => {
    const matchesDay = selectedDay === '' || selectedDay === 'Semua Hari' || item.day === selectedDay;
    const matchesSpecialty = selectedSpecialty === '' || selectedSpecialty === 'Semua Spesialisasi' || item.specialty === selectedSpecialty;
    return matchesDay && matchesSpecialty;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Limited':
        return 'bg-yellow-100 text-yellow-800';
      case 'Full':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'Tersedia';
      case 'Limited':
        return 'Terbatas';
      case 'Full':
        return 'Penuh';
      default:
        return 'Tidak Diketahui';
    }
  };

  // Group schedule by day for better organization
  const groupedSchedule = days.filter(day => day !== 'Semua Hari').reduce((acc, day) => {
    acc[day] = filteredSchedule.filter(item => item.day === day);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  return (
    <div className="pt-20 pb-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Jadwal Praktik Dokter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Lihat jadwal praktik dokter spesialis kami dan rencanakan kunjungan Anda
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Day Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
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
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Keterangan Status:</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 rounded-full"></div>
              <span className="text-sm text-gray-600">Tersedia - Masih banyak slot</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 rounded-full"></div>
              <span className="text-sm text-gray-600">Terbatas - Slot hampir penuh</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 rounded-full"></div>
              <span className="text-sm text-gray-600">Penuh - Tidak ada slot tersisa</span>
            </div>
          </div>
        </div>

        {/* Schedule Display */}
        {selectedDay === '' || selectedDay === 'Semua Hari' ? (
          // Show all days grouped
          <div className="space-y-8">
            {Object.entries(groupedSchedule).map(([day, schedules]) => (
              schedules.length > 0 && (
                <div key={day} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-teal-600 text-white p-4">
                    <h2 className="text-xl font-semibold">{day}</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {schedules.map((schedule) => (
                      <div key={schedule.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-teal-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                  {schedule.doctor}
                                </h3>
                                <p className="text-teal-600 font-medium mb-2">
                                  {schedule.specialty}
                                </p>
                                <div className="flex flex-col space-y-1 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>{schedule.time}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span>{schedule.location}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                            <div className="text-center lg:text-right">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(schedule.availability)}`}>
                                {getAvailabilityText(schedule.availability)}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {schedule.currentPatients}/{schedule.maxPatients} pasien
                              </div>
                            </div>

                            <div className="flex space-x-3">
                              {schedule.availability !== 'Full' && (
                                <Link href={`/booking?schedule=${schedule.id}`}>
                                  <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                                    Booking
                                  </button>
                                </Link>
                              )}
                              <Link href={`/doctors?search=${encodeURIComponent(schedule.doctor)}`}>
                                <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                                  Info Dokter
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          // Show selected day only
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-teal-600 text-white p-4">
              <h2 className="text-xl font-semibold">{selectedDay}</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredSchedule.map((schedule) => (
                <div key={schedule.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {schedule.doctor}
                          </h3>
                          <p className="text-teal-600 font-medium mb-2">
                            {schedule.specialty}
                          </p>
                          <div className="flex flex-col space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{schedule.time}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{schedule.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                      <div className="text-center lg:text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(schedule.availability)}`}>
                          {getAvailabilityText(schedule.availability)}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {schedule.currentPatients}/{schedule.maxPatients} pasien
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        {schedule.availability !== 'Full' && (
                          <Link href={`/booking?schedule=${schedule.id}`}>
                            <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                              Booking
                            </button>
                          </Link>
                        )}
                        <Link href={`/doctors?search=${encodeURIComponent(schedule.doctor)}`}>
                          <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                            Info Dokter
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredSchedule.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tidak ada jadwal praktik
            </h3>
            <p className="text-gray-600">
              Tidak ada jadwal yang sesuai dengan filter yang dipilih
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
