'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Users, 
  Calendar, 
  Clock, 
  Phone, 
  MapPin, 
  CheckCircle,
  Star,
  ChevronRight,
  Activity,
  Shield,
  Award,
  Stethoscope,
  Plus
} from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const services = [
    {
      title: 'Instalasi Gawat Darurat',
      description: 'Layanan 24 jam untuk kondisi darurat medis',
      icon: Heart,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Rawat Jalan',
      description: 'Konsultasi dengan dokter spesialis terpercaya',
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Rawat Inap',
      description: 'Fasilitas kamar yang nyaman dan lengkap',
      icon: Activity,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Medical Check Up',
      description: 'Pemeriksaan kesehatan menyeluruh',
      icon: Shield,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const features = [
    'Dokter spesialis berpengalaman',
    'Fasilitas medis modern',
    'Layanan 24 jam',
    'Akreditasi KARS',
    'Asuransi kesehatan diterima',
    'Laboratorium lengkap'
  ];

  const testimonials = [
    {
      name: 'Budi Santoso',
      role: 'Pasien',
      content: 'Pelayanan yang sangat memuaskan. Dokter dan perawat sangat profesional dan ramah.',
      rating: 5
    },
    {
      name: 'Siti Aminah',
      role: 'Keluarga Pasien',
      content: 'Fasilitas rumah sakit sangat lengkap dan bersih. Proses administrasi juga mudah.',
      rating: 5
    },
    {
      name: 'Ahmad Rizki',
      role: 'Pasien',
      content: 'Booking online sangat memudahkan. Tidak perlu antri lama di rumah sakit.',
      rating: 5
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Medical Icons */}
          <div className="absolute top-20 left-10 opacity-10 animate-bounce delay-1000">
            <Heart className="w-16 h-16 text-teal-500" />
          </div>
          <div className="absolute top-40 right-20 opacity-10 animate-bounce delay-2000">
            <Stethoscope className="w-20 h-20 text-blue-500" />
          </div>
          <div className="absolute bottom-32 left-20 opacity-10 animate-bounce delay-3000">
            <Shield className="w-14 h-14 text-green-500" />
          </div>
          <div className="absolute bottom-20 right-32 opacity-10 animate-bounce delay-500">
            <Plus className="w-12 h-12 text-red-500" />
          </div>

          {/* Gradient Orbs */}
          <div 
            className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-teal-200/30 to-cyan-300/30 blur-3xl"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          ></div>
          <div 
            className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-r from-blue-200/20 to-purple-300/20 blur-3xl"
            style={{
              transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-teal-200">
                <Award className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-800">Terakreditasi KARS</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[0.9]">
                  <span className="block">Kesehatan</span>
                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Terbaik
                  </span>
                  <span className="block text-4xl md:text-5xl font-medium text-gray-700">
                    untuk Keluarga Anda
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Memberikan pelayanan kesehatan berkualitas tinggi dengan teknologi modern 
                  dan tim medis profesional berpengalaman.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/booking" className="group">
                  <button className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl group-hover:scale-105">
                    <Calendar className="w-5 h-5" />
                    <span>Booking Sekarang</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/doctors" className="group">
                  <button className="w-full sm:w-auto border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105">
                    <Users className="w-5 h-5" />
                    <span>Lihat Dokter</span>
                  </button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center group cursor-default">
                  <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    50+
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Dokter Spesialis</div>
                </div>
                <div className="text-center group cursor-default">
                  <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    15+
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Tahun Pengalaman</div>
                </div>
                <div className="text-center group cursor-default">
                  <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    24/7
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Layanan IGD</div>
                </div>
              </div>
            </div>

            {/* Right Content - Emergency Card */}
            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              {/* Emergency Services Card */}
              <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full opacity-10 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-full opacity-10 animate-pulse delay-1000"></div>

                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-4">
                      <Heart className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Layanan Darurat</h3>
                    <p className="text-gray-600">Siaga 24 jam untuk kondisi darurat medis</p>
                  </div>
                  
                  <div className="space-y-4">
                    <Link href="tel:119" className="block group">
                      <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 group-hover:scale-105 shadow-lg">
                        <Phone className="w-6 h-6 animate-pulse" />
                        <span>IGD: 119</span>
                      </button>
                    </Link>
                    
                    <Link href="https://wa.me/628123456789" className="block group">
                      <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 group-hover:scale-105 shadow-lg">
                        <Phone className="w-6 h-6" />
                        <span>WhatsApp</span>
                      </button>
                    </Link>
                  </div>

                  {/* Quick Info */}
                  <div className="border-t pt-6 space-y-3">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>Jl. Kesehatan No. 123, Jakarta</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Buka 24 jam setiap hari</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Trust Badges */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-4 animate-bounce delay-2000">
                <div className="flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">ISO 9001</div>
                    <div className="text-xs text-gray-600">Certified</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-lg p-4 animate-bounce delay-1500">
                <div className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-yellow-500" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Best Service</div>
                    <div className="text-xs text-gray-600">2024</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-teal-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-teal-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Hospital Profile Section */}
      <section className="py-20 bg-gradient-to-r from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-teal-200 mb-6">
              <Award className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-800">Tentang Kami</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              RS Medicare Prima
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rumah sakit swasta terdepan dengan komitmen memberikan pelayanan kesehatan 
              berkualitas internasional sejak tahun 2008
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Visi Kami</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Menjadi rumah sakit rujukan terdepan di Indonesia yang memberikan 
                  pelayanan kesehatan berkualitas internasional dengan pendekatan 
                  holistik dan teknologi modern.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Komitmen Kami</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span>Pelayanan kesehatan yang aman dan bermutu</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span>Teknologi medis terdepan dan modern</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span>Tim medis profesional berpengalaman</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span>Pelayanan 24 jam setiap hari</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              {/* Statistics */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="text-3xl font-bold text-teal-600 mb-2">16+</div>
                  <div className="text-gray-600">Tahun Pengalaman</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="text-3xl font-bold text-teal-600 mb-2">150K+</div>
                  <div className="text-gray-600">Pasien Dilayani</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="text-3xl font-bold text-teal-600 mb-2">120+</div>
                  <div className="text-gray-600">Dokter Spesialis</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="text-3xl font-bold text-teal-600 mb-2">98.5%</div>
                  <div className="text-gray-600">Tingkat Kepuasan</div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Sertifikasi & Penghargaan</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Award className="w-6 h-6 text-yellow-500" />
                    <span className="text-gray-700">Akreditasi KARS Paripurna</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-blue-500" />
                    <span className="text-gray-700">JCI Accredited Hospital</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">ISO 9001:2015 Certified</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="w-6 h-6 text-red-500" />
                    <span className="text-gray-700">Top Hospital Award 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA to Profile Page */}
          <div className="text-center">
            <Link href="/profile" className="group">
              <button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-2 mx-auto group-hover:scale-105 shadow-lg hover:shadow-xl">
                <span>Pelajari Lebih Lanjut</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan Unggulan Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kami menyediakan berbagai layanan kesehatan yang komprehensif untuk memenuhi kebutuhan Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Mengapa Memilih RS Medicare Prima?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Kami berkomitmen memberikan pelayanan kesehatan terbaik dengan standar internasional 
                dan teknologi medis terdepan.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/about">
                  <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                    <span>Selengkapnya</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Jam Operasional</h3>
                  <p className="text-gray-600">Kami siap melayani Anda</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-900">IGD (24 Jam)</span>
                    <span className="text-teal-600 font-semibold">Selalu Buka</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-900">Rawat Jalan</span>
                    <span className="text-gray-600">08:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-900">Laboratorium</span>
                    <span className="text-gray-600">06:00 - 22:00</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-medium text-gray-900">Farmasi</span>
                    <span className="text-gray-600">24 Jam</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Testimoni Pasien
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kepuasan pasien adalah prioritas utama kami
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">&quot;{testimonial.content}&quot;</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap untuk Memulai Perjalanan Kesehatan Anda?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Booking konsultasi sekarang dan dapatkan pelayanan kesehatan terbaik dari tim medis profesional kami
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <button className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Booking Sekarang</span>
              </button>
            </Link>
            <Link href="/contact">
              <button className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Hubungi Kami</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
