'use client';

import React from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Clock,
  Heart,
  Activity,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      name: 'Total Pasien Hari Ini',
      value: '127',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Booking Aktif',
      value: '89',
      change: '+5%',
      changeType: 'increase',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      name: 'Artikel Dipublish',
      value: '24',
      change: '+3%',
      changeType: 'increase',
      icon: FileText,
      color: 'bg-yellow-500'
    },
    {
      name: 'Rating Kepuasan',
      value: '4.8',
      change: '+0.2',
      changeType: 'increase',
      icon: Heart,
      color: 'bg-red-500'
    }
  ];

  const recentBookings = [
    {
      id: 'MCR001234',
      patient: 'Ahmad Santoso',
      doctor: 'Dr. Ahmad Wijaya, Sp.JP',
      time: '09:00',
      status: 'Confirmed',
      type: 'Konsultasi'
    },
    {
      id: 'MCR001235',
      patient: 'Siti Aminah',
      doctor: 'Dr. Siti Nurhaliza, Sp.A',
      time: '10:30',
      status: 'Waiting',
      type: 'Checkup'
    },
    {
      id: 'MCR001236',
      patient: 'Budi Raharjo',
      doctor: 'Dr. Lisa Maharani, Sp.M',
      time: '11:00',
      status: 'In Progress',
      type: 'Konsultasi'
    },
    {
      id: 'MCR001237',
      patient: 'Maya Sari',
      doctor: 'Dr. Rudi Hermawan, Sp.PD',
      time: '13:00',
      status: 'Confirmed',
      type: 'Follow Up'
    }
  ];

  const doctorSchedule = [
    {
      name: 'Dr. Ahmad Wijaya, Sp.JP',
      specialty: 'Kardiologi',
      status: 'Available',
      nextPatient: '09:00',
      totalToday: 8
    },
    {
      name: 'Dr. Siti Nurhaliza, Sp.A',
      specialty: 'Anak',
      status: 'Busy',
      nextPatient: '10:30',
      totalToday: 12
    },
    {
      name: 'Dr. Lisa Maharani, Sp.M',
      specialty: 'Mata',
      status: 'Available',
      nextPatient: '11:00',
      totalToday: 6
    },
    {
      name: 'Dr. Rudi Hermawan, Sp.PD',
      specialty: 'Penyakit Dalam',
      status: 'Break',
      nextPatient: '13:00',
      totalToday: 9
    }
  ];

  const alerts = [
    {
      type: 'warning',
      message: 'Stok obat Paracetamol hampir habis',
      time: '10 menit yang lalu'
    },
    {
      type: 'info',
      message: 'Maintenance sistem dijadwalkan malam ini',
      time: '1 jam yang lalu'
    },
    {
      type: 'success',
      message: 'Backup data berhasil dilakukan',
      time: '2 jam yang lalu'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Busy':
        return 'bg-red-100 text-red-800';
      case 'Break':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <AlertCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Selamat datang di panel admin RS Medicare Prima</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${item.color} rounded-lg p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{item.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                    <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                      item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      <span className="sr-only">
                        {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                      </span>
                      {item.change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Booking Terbaru</h3>
          </div>
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pasien
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dokter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{booking.patient}</div>
                          <div className="text-sm text-gray-500">{booking.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.doctor}</div>
                        <div className="text-sm text-gray-500">{booking.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Doctor Schedule */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Status Dokter</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {doctorSchedule.map((doctor, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{doctor.name}</p>
                      <p className="text-sm text-gray-500">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doctor.status)}`}>
                      {doctor.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Next: {doctor.nextPatient} | Total: {doctor.totalToday}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Alerts */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Notifikasi Sistem</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Aksi Cepat</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700">
                <Users className="w-4 h-4 mr-2" />
                Tambah Dokter
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Calendar className="w-4 h-4 mr-2" />
                Kelola Jadwal
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <FileText className="w-4 h-4 mr-2" />
                Tulis Artikel
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Activity className="w-4 h-4 mr-2" />
                Lihat Laporan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
