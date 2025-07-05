'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, User, Phone, Mail, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  price: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface BookingForm {
  patientName: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  selectedDoctor: string;
  selectedDate: string;
  selectedTime: string;
  notes: string;
  paymentMethod: string;
}

const BookingPage = () => {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctor');
  const scheduleId = searchParams.get('schedule');

  const [step, setStep] = useState(1);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    patientName: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    selectedDoctor: doctorId || '',
    selectedDate: '',
    selectedTime: '',
    notes: '',
    paymentMethod: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  const doctors: Doctor[] = [
    { id: 1, name: 'Dr. Ahmad Wijaya, Sp.JP', specialty: 'Jantung dan Pembuluh Darah', price: 'Rp 350.000' },
    { id: 2, name: 'Dr. Siti Nurhaliza, Sp.A', specialty: 'Anak', price: 'Rp 275.000' },
    { id: 3, name: 'Dr. Budi Santoso, Sp.OG', specialty: 'Obstetri dan Ginekologi', price: 'Rp 400.000' },
    { id: 4, name: 'Dr. Lisa Maharani, Sp.M', specialty: 'Mata', price: 'Rp 300.000' },
    { id: 5, name: 'Dr. Rudi Hermawan, Sp.PD', specialty: 'Penyakit Dalam', price: 'Rp 325.000' },
    { id: 6, name: 'Dr. Maya Indrawati, Sp.KK', specialty: 'Kulit dan Kelamin', price: 'Rp 285.000' }
  ];

  const timeSlots: TimeSlot[] = [
    { id: '1', time: '08:00', available: true },
    { id: '2', time: '08:30', available: true },
    { id: '3', time: '09:00', available: false },
    { id: '4', time: '09:30', available: true },
    { id: '5', time: '10:00', available: true },
    { id: '6', time: '10:30', available: false },
    { id: '7', time: '11:00', available: true },
    { id: '8', time: '11:30', available: true },
    { id: '9', time: '13:00', available: true },
    { id: '10', time: '13:30', available: true },
    { id: '11', time: '14:00', available: false },
    { id: '12', time: '14:30', available: true },
    { id: '13', time: '15:00', available: true },
    { id: '14', time: '15:30', available: true },
    { id: '15', time: '16:00', available: true },
    { id: '16', time: '16:30', available: false }
  ];

  const paymentMethods = [
    { id: 'cash', name: 'Tunai', description: 'Bayar langsung di rumah sakit' },
    { id: 'debit', name: 'Kartu Debit', description: 'Bayar dengan kartu debit' },
    { id: 'credit', name: 'Kartu Kredit', description: 'Bayar dengan kartu kredit' },
    { id: 'insurance', name: 'BPJS/Asuransi', description: 'Gunakan asuransi kesehatan' }
  ];

  useEffect(() => {
    if (doctorId) {
      setBookingForm(prev => ({ ...prev, selectedDoctor: doctorId }));
    }
  }, [doctorId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate booking code
    const code = 'MCR' + Date.now().toString().slice(-6);
    setBookingCode(code);
    setBookingSuccess(true);
    setIsSubmitting(false);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const selectedDoctor = doctors.find(doctor => doctor.id.toString() === bookingForm.selectedDoctor);

  if (bookingSuccess) {
    return (
      <div className="pt-20 pb-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Booking Berhasil!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Terima kasih, booking janji temu Anda telah berhasil dikonfirmasi.
              </p>
              
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-teal-800 mb-4">Detail Booking:</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kode Booking:</span>
                    <span className="font-semibold text-teal-600">{bookingCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pasien:</span>
                    <span className="font-semibold">{bookingForm.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dokter:</span>
                    <span className="font-semibold">{selectedDoctor?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal:</span>
                    <span className="font-semibold">{bookingForm.selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Waktu:</span>
                    <span className="font-semibold">{bookingForm.selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya:</span>
                    <span className="font-semibold">{selectedDoctor?.price}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-left text-sm text-yellow-800">
                    <p className="font-medium mb-1">Penting untuk diingat:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Harap datang 15 menit sebelum waktu janji temu</li>
                      <li>• Bawa kartu identitas dan kartu asuransi (jika ada)</li>
                      <li>• Jika berhalangan hadir, hubungi kami minimal H-1</li>
                      <li>• Simpan kode booking untuk verifikasi</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setBookingSuccess(false);
                    setStep(1);
                    setBookingForm({
                      patientName: '',
                      email: '',
                      phone: '',
                      birthDate: '',
                      address: '',
                      selectedDoctor: '',
                      selectedDate: '',
                      selectedTime: '',
                      notes: '',
                      paymentMethod: ''
                    });
                  }}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Booking Lagi
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Booking Janji Temu
            </h1>
            <p className="text-xl text-gray-600">
              Jadwalkan konsultasi dengan dokter spesialis kami
            </p>
          </div>

          {/* Progress Steps */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= stepNum ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${step >= stepNum ? 'text-teal-600' : 'text-gray-600'}`}>
                      {stepNum === 1 && 'Pilih Dokter'}
                      {stepNum === 2 && 'Pilih Jadwal'}
                      {stepNum === 3 && 'Data Pasien'}
                      {stepNum === 4 && 'Konfirmasi'}
                    </div>
                  </div>
                  {stepNum < 4 && (
                    <div className={`h-1 w-16 mx-4 ${step > stepNum ? 'bg-teal-600' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Step 1: Select Doctor */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pilih Dokter Spesialis</h2>
                <div className="grid gap-4">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        bookingForm.selectedDoctor === doctor.id.toString()
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setBookingForm(prev => ({ ...prev, selectedDoctor: doctor.id.toString() }))}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-teal-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                            <p className="text-teal-600">{doctor.specialty}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{doctor.price}</div>
                          <div className="text-sm text-gray-600">per konsultasi</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Date and Time */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pilih Tanggal dan Waktu</h2>
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Tanggal
                    </label>
                    <input
                      type="date"
                      name="selectedDate"
                      value={bookingForm.selectedDate}
                      onChange={handleInputChange}
                      min={getMinDate()}
                      max={getMaxDate()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Waktu
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          disabled={!slot.available}
                          onClick={() => setBookingForm(prev => ({ ...prev, selectedTime: slot.time }))}
                          className={`p-3 text-sm font-medium rounded-lg transition-colors ${
                            !slot.available
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : bookingForm.selectedTime === slot.time
                              ? 'bg-teal-600 text-white'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Waktu yang berwarna abu-abu sudah tidak tersedia
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Patient Information */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Pasien</h2>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      value={bookingForm.patientName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={bookingForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="contoh@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="08123456789"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Lahir *
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={bookingForm.birthDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat *
                    </label>
                    <textarea
                      name="address"
                      value={bookingForm.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Masukkan alamat lengkap"
                      required
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keluhan/Catatan (Opsional)
                    </label>
                    <textarea
                      name="notes"
                      value={bookingForm.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Jelaskan keluhan atau catatan khusus"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Metode Pembayaran *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            bookingForm.paymentMethod === method.id
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setBookingForm(prev => ({ ...prev, paymentMethod: method.id }))}
                        >
                          <div className="flex items-center space-x-3">
                            <CreditCard className="w-5 h-5 text-gray-600" />
                            <div>
                              <div className="font-medium text-gray-900">{method.name}</div>
                              <div className="text-sm text-gray-600">{method.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Konfirmasi Booking</h2>
                <div className="space-y-6">
                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Ringkasan Booking</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dokter:</span>
                          <span className="font-medium">{selectedDoctor?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Spesialisasi:</span>
                          <span className="font-medium">{selectedDoctor?.specialty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tanggal:</span>
                          <span className="font-medium">{bookingForm.selectedDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Waktu:</span>
                          <span className="font-medium">{bookingForm.selectedTime}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pasien:</span>
                          <span className="font-medium">{bookingForm.patientName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{bookingForm.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Telepon:</span>
                          <span className="font-medium">{bookingForm.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Biaya:</span>
                          <span className="font-medium text-teal-600">{selectedDoctor?.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <input type="checkbox" className="mt-1" required />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Syarat dan Ketentuan:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Saya menyetujui kebijakan privasi dan syarat layanan</li>
                          <li>• Pembatalan booking dapat dilakukan maksimal H-1</li>
                          <li>• Keterlambatan lebih dari 15 menit dapat menyebabkan pembatalan</li>
                          <li>• Biaya konsultasi sesuai dengan tarif yang berlaku</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={step === 1}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>

              {step < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !bookingForm.selectedDoctor) ||
                    (step === 2 && (!bookingForm.selectedDate || !bookingForm.selectedTime)) ||
                    (step === 3 && (!bookingForm.patientName || !bookingForm.email || !bookingForm.phone || !bookingForm.birthDate || !bookingForm.address || !bookingForm.paymentMethod))
                  }
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selanjutnya
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Konfirmasi Booking</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
