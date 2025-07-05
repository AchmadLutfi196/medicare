'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  MapPin
} from 'lucide-react';

const BookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const bookings = [
    {
      id: 'MCR001234',
      patient: 'Ahmad Santoso',
      phone: '+62 813-2345-6789',
      doctor: 'Dr. Ahmad Wijaya, Sp.JP',
      specialty: 'Kardiologi',
      date: '2024-01-15',
      time: '09:00',
      type: 'Konsultasi',
      status: 'Confirmed',
      room: 'Ruang 201',
      notes: 'Kontrol rutin jantung'
    },
    {
      id: 'MCR001235',
      patient: 'Siti Aminah',
      phone: '+62 813-2345-6790',
      doctor: 'Dr. Siti Nurhaliza, Sp.A',
      specialty: 'Anak',
      date: '2024-01-15',
      time: '10:30',
      type: 'Checkup',
      status: 'Waiting',
      room: 'Ruang 105',
      notes: 'Imunisasi anak'
    },
    {
      id: 'MCR001236',
      patient: 'Budi Raharjo',
      phone: '+62 813-2345-6791',
      doctor: 'Dr. Lisa Maharani, Sp.M',
      specialty: 'Mata',
      date: '2024-01-15',
      time: '11:00',
      type: 'Konsultasi',
      status: 'In Progress',
      room: 'Ruang 301',
      notes: 'Keluhan penglihatan kabur'
    },
    {
      id: 'MCR001237',
      patient: 'Maya Sari',
      phone: '+62 813-2345-6792',
      doctor: 'Dr. Rudi Hermawan, Sp.PD',
      specialty: 'Penyakit Dalam',
      date: '2024-01-15',
      time: '13:00',
      type: 'Follow Up',
      status: 'Confirmed',
      room: 'Ruang 205',
      notes: 'Kontrol diabetes'
    },
    {
      id: 'MCR001238',
      patient: 'Andi Wijaya',
      phone: '+62 813-2345-6793',
      doctor: 'Dr. Ahmad Wijaya, Sp.JP',
      specialty: 'Kardiologi',
      date: '2024-01-15',
      time: '14:30',
      type: 'Emergency',
      status: 'Cancelled',
      room: '-',
      notes: 'Dibatalkan oleh pasien'
    }
  ];

  const statusOptions = ['Semua', 'Confirmed', 'Waiting', 'In Progress', 'Completed', 'Cancelled'];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'waiting':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in progress':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || filterStatus === 'Semua' || 
                         booking.status === filterStatus;
    const matchesDate = filterDate === '' || booking.date === filterDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const todayBookings = bookings.filter(booking => booking.date === '2024-01-15');
  const confirmedToday = todayBookings.filter(booking => booking.status === 'Confirmed').length;
  const waitingToday = todayBookings.filter(booking => booking.status === 'Waiting').length;
  const inProgressToday = todayBookings.filter(booking => booking.status === 'In Progress').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Booking</h1>
          <p className="text-gray-600">Kelola jadwal dan booking pasien</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Booking Baru</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Hari Ini</p>
              <p className="text-2xl font-bold text-gray-900">{todayBookings.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Terkonfirmasi</p>
              <p className="text-2xl font-bold text-gray-900">{confirmedToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Menunggu</p>
              <p className="text-2xl font-bold text-gray-900">{waitingToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Berlangsung</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressToday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cari Booking</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari pasien, dokter, atau ID..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pasien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dokter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jadwal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ruangan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{booking.patient}</div>
                        <div className="text-sm text-gray-500">{booking.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.doctor}</div>
                    <div className="text-sm text-gray-500">{booking.specialty}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.date}</div>
                    <div className="text-sm text-gray-500">{booking.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {booking.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(booking.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.room}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-teal-600 hover:text-teal-900" title="Lihat Detail">
                        <Calendar className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900" title="Hubungi Pasien">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Konfirmasi">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Batalkan">
                        <XCircle className="w-4 h-4" />
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

export default BookingsPage;
