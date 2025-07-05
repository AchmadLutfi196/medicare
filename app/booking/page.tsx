'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Heart,
  Shield,
  Star,
  ArrowLeft
} from 'lucide-react';

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    complaint: '',
    insurance: ''
  });

  const doctors = [
    {
      id: 1,
      name: 'Dr. Andi Wijaya, Sp.JP(K)',
      specialty: 'Kardiologi Intervensi',
      rating: 4.9,
      experience: '25 tahun',
      price: 'Rp 350.000',
      schedule: {
        'Monday': ['08:00', '09:00', '10:00', '11:00'],
        'Wednesday': ['14:00', '15:00', '16:00', '17:00'],
        'Friday': ['08:00', '09:00', '10:00', '11:00']
      }
    },
    {
      id: 2,
      name: 'Dr. Sari Indrawati, Sp.A(K)',
      specialty: 'Anak & Neonatologi',
      rating: 4.9,
      experience: '20 tahun',
      price: 'Rp 300.000',
      schedule: {
        'Tuesday': ['09:00', '10:00', '11:00', '13:00'],
        'Thursday': ['14:00', '15:00', '16:00', '18:00'],
        'Saturday': ['08:00', '09:00', '10:00', '12:00']
      }
    },
    {
      id: 3,
      name: 'Dr. Bambang Sutrisno, Sp.B(K)Onk',
      specialty: 'Bedah Onkologi',
      rating: 4.8,
      experience: '22 tahun',
      price: 'Rp 400.000',
      schedule: {
        'Monday': ['13:00', '14:00', '15:00', '17:00'],
        'Wednesday': ['08:00', '09:00', '10:00', '12:00'],
        'Friday': ['13:00', '14:00', '15:00', '17:00']
      }
    }
  ];

  const steps = [
    { number: 1, title: 'Pilih Dokter', icon: Stethoscope },
    { number: 2, title: 'Pilih Jadwal', icon: Calendar },
    { number: 3, title: 'Data Pasien', icon: User },
    { number: 4, title: 'Konfirmasi', icon: Check }
  ];

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('id-ID', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' })
      });
    }
    return dates;
  };

  const getAvailableTimes = () => {
    if (!selectedDoctor || !selectedDate) return [];
    
    const date = new Date(selectedDate);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    return selectedDoctor.schedule[dayName] || [];
  };

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <Link href="/" className="text-teal-100 hover:text-white mr-4">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-4xl font-bold">Booking Konsultasi</h1>
            </div>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto">
              Jadwalkan konsultasi dengan dokter spesialis terbaik kami
            </p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  currentStep >= step.number 
                    ? 'text-teal-600' 
                    : 'text-gray-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.number 
                      ? 'bg-teal-600 border-teal-600 text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="font-semibold hidden sm:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Step 1: Choose Doctor */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Pilih Dokter Spesialis</h2>
                <p className="text-gray-600">Pilih dokter sesuai dengan kebutuhan konsultasi Anda</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <div 
                    key={doctor.id}
                    className={`bg-white rounded-xl p-6 shadow-lg cursor-pointer transition-all duration-300 ${
                      selectedDoctor?.id === doctor.id 
                        ? 'ring-2 ring-teal-500 bg-teal-50' 
                        : 'hover:shadow-xl hover:scale-105'
                    }`}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Stethoscope className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{doctor.name}</h3>
                      <p className="text-teal-600 font-semibold mb-3">{doctor.specialty}</p>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{doctor.rating}</span>
                        </div>
                        <div>Pengalaman: {doctor.experience}</div>
                        <div className="text-lg font-bold text-teal-600">{doctor.price}</div>
                      </div>
                      
                      {selectedDoctor?.id === doctor.id && (
                        <div className="flex items-center justify-center text-teal-600">
                          <Check className="w-5 h-5 mr-1" />
                          <span className="font-semibold">Dipilih</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Schedule */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Pilih Jadwal Konsultasi</h2>
                <p className="text-gray-600">Pilih tanggal dan waktu yang sesuai dengan jadwal Anda</p>
              </div>

              {selectedDoctor && (
                <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                  <h3 className="font-bold text-gray-900 mb-2">Dokter Terpilih:</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-semibold">{selectedDoctor.name}</div>
                      <div className="text-sm text-teal-600">{selectedDoctor.specialty}</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Date Selection */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Pilih Tanggal</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {generateDateOptions().map((date) => (
                      <div
                        key={date.value}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedDate === date.value
                            ? 'bg-teal-600 text-white'
                            : 'bg-white border border-gray-200 hover:bg-teal-50'
                        }`}
                        onClick={() => setSelectedDate(date.value)}
                      >
                        <div className="font-semibold">{date.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Pilih Waktu</h3>
                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-3">
                      {getAvailableTimes().map((time) => (
                        <button
                          key={time}
                          className={`p-3 rounded-lg font-semibold transition-colors ${
                            selectedTime === time
                              ? 'bg-teal-600 text-white'
                              : 'bg-white border border-gray-200 hover:bg-teal-50 text-gray-700'
                          }`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-8">
                      Pilih tanggal terlebih dahulu
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Patient Information */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Pasien</h2>
                <p className="text-gray-600">Lengkapi data diri untuk proses booking</p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Masukkan nomor telepon"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Masukkan email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Asuransi</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={formData.insurance}
                      onChange={(e) => handleInputChange('insurance', e.target.value)}
                    >
                      <option value="">Pilih asuransi</option>
                      <option value="bpjs">BPJS Kesehatan</option>
                      <option value="swasta">Asuransi Swasta</option>
                      <option value="umum">Umum/Cash</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Keluhan/Gejala</label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-24 resize-none"
                      placeholder="Jelaskan keluhan atau gejala yang dialami"
                      value={formData.complaint}
                      onChange={(e) => handleInputChange('complaint', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Konfirmasi Booking</h2>
                <p className="text-gray-600">Periksa kembali detail booking Anda</p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="space-y-6">
                  {/* Doctor Info */}
                  <div className="border-b pb-6">
                    <h3 className="font-bold text-gray-900 mb-4">Detail Dokter</h3>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <Stethoscope className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{selectedDoctor?.name}</div>
                        <div className="text-teal-600">{selectedDoctor?.specialty}</div>
                        <div className="text-sm text-gray-600">Biaya: {selectedDoctor?.price}</div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Info */}
                  <div className="border-b pb-6">
                    <h3 className="font-bold text-gray-900 mb-4">Jadwal Konsultasi</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-teal-600" />
                        <span>{selectedDate && new Date(selectedDate).toLocaleDateString('id-ID', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-teal-600" />
                        <span>{selectedTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Data Pasien</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div><span className="font-semibold">Nama:</span> {formData.name}</div>
                      <div><span className="font-semibold">Telepon:</span> {formData.phone}</div>
                      <div><span className="font-semibold">Email:</span> {formData.email}</div>
                      <div><span className="font-semibold">Asuransi:</span> {formData.insurance || 'Tidak ada'}</div>
                      {formData.complaint && (
                        <div className="md:col-span-2">
                          <span className="font-semibold">Keluhan:</span> {formData.complaint}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">Informasi Penting</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Harap datang 15 menit sebelum jadwal konsultasi</li>
                      <li>• Bawa kartu identitas dan kartu asuransi (jika ada)</li>
                      <li>• Pembatalan dapat dilakukan maksimal 2 jam sebelum jadwal</li>
                      <li>• Konfirmasi booking akan dikirim via WhatsApp dan email</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentStep === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Sebelumnya</span>
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !selectedDoctor) ||
                  (currentStep === 2 && (!selectedDate || !selectedTime)) ||
                  (currentStep === 3 && (!formData.name || !formData.phone || !formData.email))
                }
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  (currentStep === 1 && !selectedDoctor) ||
                  (currentStep === 2 && (!selectedDate || !selectedTime)) ||
                  (currentStep === 3 && (!formData.name || !formData.phone || !formData.email))
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
                <Check className="w-5 h-5" />
                <span>Konfirmasi Booking</span>
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
