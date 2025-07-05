'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageSquare } from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactPage = () => {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false);
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Alamat',
      content: 'Jl. Kesehatan No. 123\nJakarta Pusat, DKI Jakarta 10110',
      action: 'Lihat di Maps',
      link: 'https://maps.google.com'
    },
    {
      icon: Phone,
      title: 'Telepon',
      content: '+62 21 1234 5678\n+62 21 8765 4321',
      action: 'Hubungi Sekarang',
      link: 'tel:+622112345678'
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      content: '+62 812 3456 7890\nChat 24/7 tersedia',
      action: 'Chat WhatsApp',
      link: 'https://wa.me/628123456789'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@medicare-prima.com\ncs@medicare-prima.com',
      action: 'Kirim Email',
      link: 'mailto:info@medicare-prima.com'
    }
  ];

  const operatingHours = [
    { day: 'Senin - Jumat', hours: '07:00 - 20:00 WIB' },
    { day: 'Sabtu', hours: '08:00 - 18:00 WIB' },
    { day: 'Minggu', hours: '08:00 - 16:00 WIB' },
    { day: 'IGD (24 Jam)', hours: 'Selalu Buka' }
  ];

  const departments = [
    'Informasi Umum',
    'Pendaftaran & Booking',
    'Layanan Pasien',
    'Billing & Asuransi',
    'Keluhan & Saran',
    'Kerjasama',
    'Lainnya'
  ];

  return (
    <div className="pt-20 pb-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hubungi Kami
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kami siap membantu Anda. Hubungi kami melalui berbagai cara di bawah ini
            atau kunjungi langsung rumah sakit kami.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-600 text-sm mb-4 whitespace-pre-line">
                  {info.content}
                </p>
                <a href={info.link} target="_blank" rel="noopener noreferrer">
                  <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                    {info.action}
                  </button>
                </a>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Kirim Pesan
            </h2>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Pesan Terkirim!
                </h3>
                <p className="text-gray-600">
                  Terima kasih atas pesan Anda. Tim kami akan segera menghubungi Anda.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="contoh@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="08123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subjek *
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Pilih subjek</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Tuliskan pesan Anda di sini..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Pesan</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Operating Hours & Map */}
          <div className="space-y-8">
            {/* Operating Hours */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Jam Operasional
              </h3>
              <div className="space-y-4">
                {operatingHours.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="font-medium text-gray-700">{schedule.day}</span>
                    </div>
                    <span className={`font-semibold ${
                      schedule.day === 'IGD (24 Jam)' ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-1">Layanan Darurat 24 Jam</h4>
                    <p className="text-red-700 text-sm mb-2">
                      Untuk kondisi darurat, hubungi:
                    </p>
                    <a href="tel:119" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm inline-block">
                      IGD: 119
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Lokasi Kami</h3>
                <p className="text-gray-600 mt-1">RS Medicare Prima</p>
              </div>
              
              {/* Map Placeholder */}
              <div className="h-64 bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-teal-600 mx-auto mb-3" />
                  <p className="text-teal-700 font-medium">Peta Interaktif</p>
                  <p className="text-teal-600 text-sm">Jl. Kesehatan No. 123, Jakarta</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Dekat dengan Stasiun MRT Bundaran HI</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>5 menit dari Mall Grand Indonesia</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Parkir luas tersedia (gratis 3 jam pertama)</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Buka di Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Pertanyaan Umum</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Bagaimana cara booking online?</h4>
                <p className="text-gray-600 text-sm">
                  Anda dapat melakukan booking melalui website kami di menu "Booking" atau hubungi customer service di +62 21 1234 5678.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Apakah menerima BPJS?</h4>
                <p className="text-gray-600 text-sm">
                  Ya, kami menerima BPJS Kesehatan dan berbagai asuransi swasta lainnya.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Apakah ada layanan ambulans?</h4>
                <p className="text-gray-600 text-sm">
                  Ya, kami menyediakan layanan ambulans 24 jam. Hubungi 119 untuk layanan darurat.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Bagaimana cara pembatalan booking?</h4>
                <p className="text-gray-600 text-sm">
                  Pembatalan dapat dilakukan maksimal H-1 melalui customer service atau WhatsApp kami.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Apakah ada fasilitas parkir?</h4>
                <p className="text-gray-600 text-sm">
                  Ya, tersedia parkir luas dengan kapasitas 200 mobil dan 500 motor. Gratis 3 jam pertama.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Bagaimana cara mendapatkan hasil lab?</h4>
                <p className="text-gray-600 text-sm">
                  Hasil lab dapat diambil langsung atau dikirim via email/WhatsApp sesuai permintaan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
