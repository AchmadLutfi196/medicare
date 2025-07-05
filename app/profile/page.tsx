'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  Award, 
  Heart, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Globe,
  Calendar,
  Stethoscope,
  Activity,
  Shield,
  Star,
  ChevronRight,
  CheckCircle,
  Target,
  Eye,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Hospital,
  Camera,
  Play,
  Quote,
  ThumbsUp,
  ExternalLink,
  Download,
  FileText,
  ImageIcon,
  Video,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useContent } from '../../hooks/useContent';
import { useDoctors } from '../../hooks/useDoctors';
import { useTestimonials } from '../../hooks/useTestimonials';

export default function HospitalProfile() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch data from database
  const { 
    hospitalInfo, 
    guides,
    loading: contentLoading, 
    error: contentError 
  } = useContent();
  
  const { 
    data: doctorsData, 
    loading: doctorsLoading, 
    error: doctorsError 
  } = useDoctors();
  
  const { 
    testimonials: testimonialsData, 
    loading: testimonialsLoading, 
    error: testimonialsError 
  } = useTestimonials();

  const loading = contentLoading || doctorsLoading || testimonialsLoading;
  const error = contentError || doctorsError || testimonialsError;

  if (loading) {
    return (
      <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat profil rumah sakit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Gagal memuat profil rumah sakit</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Featured doctors (top rated)
  const dynamicFeaturedDoctors = doctorsData
    ? doctorsData.sort((a: any, b: any) => b.rating - a.rating).slice(0, 8)
    : [];

  // Featured testimonials
  const dynamicTestimonials = testimonialsData
    ? testimonialsData.filter((t: any) => t.rating >= 4).slice(0, 6)
    : [];

  // Fallback data for achievements and certifications
  const achievements = hospitalInfo?.awards?.map((award, index) => ({
    icon: [Award, Shield, Star, CheckCircle][index % 4] || Award,
    title: award,
    description: 'Standar pelayanan kesehatan terbaik',
    year: '2023'
  })) || [
    {
      icon: Award,
      title: 'Akreditasi KARS Paripurna',
      description: 'Standar pelayanan kesehatan terbaik',
      year: '2023'
    },
    {
      icon: Shield,
      title: 'ISO 9001:2015',
      description: 'Sistem manajemen mutu internasional',
      year: '2022'
    },
    {
      icon: Star,
      title: 'Top Hospital Award',
      description: 'Penghargaan rumah sakit terbaik Jakarta',
      year: '2024'
    },
    {
      icon: Heart,
      title: 'JCI Accredited',
      description: 'Joint Commission International',
      year: '2023'
    }
  ];

  const facilities = [
    {
      category: 'Pelayanan Medis',
      items: [
        'Instalasi Gawat Darurat 24 Jam',
        'Intensive Care Unit (ICU)',
        'Neonatal Intensive Care Unit (NICU)',
        'Cardiac Care Unit (CCU)',
        'High Care Unit (HCU)',
        'Kamar Operasi Modern',
        'Unit Hemodialisa',
        'Unit Endoskopi'
      ]
    },
    {
      category: 'Penunjang Medis',
      items: [
        'Laboratorium Patologi Klinik',
        'Radiologi & Imaging',
        'CT Scan 128 Slice',
        'MRI 1.5 Tesla',
        'USG 4D',
        'Mammografi Digital',
        'Cathlab',
        'Farmasi 24 Jam'
      ]
    },
    {
      category: 'Fasilitas Umum',
      items: [
        'Ruang Tunggu Nyaman',
        'Food Court',
        'Mushola',
        'ATM Center',
        'Apotek',
        'Parkir Luas',
        'WiFi Gratis',
        'Ambulance Siaga'
      ]
    }
  ];

  const leadership = [
    {
      name: 'Dr. Prof. Andi Wijaya, Sp.JP(K)',
      position: 'Direktur Utama',
      experience: '25 tahun',
      education: 'S3 Kedokteran UI, Fellowship Harvard Medical School',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Dr. Sari Indrawati, Sp.A(K)',
      position: 'Direktur Medis',
      experience: '20 tahun',
      education: 'S3 Kedokteran UGM, Fellowship Johns Hopkins',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Ir. Bambang Sutrisno, MM',
      position: 'Direktur Operasional',
      experience: '18 tahun',
      education: 'S2 Manajemen RS UI, Certified Hospital Executive',
      image: '/api/placeholder/150/150'
    }
  ];

  const statistics = [
    { label: 'Pasien Dilayani/Tahun', value: '150,000+', icon: Users },
    { label: 'Dokter Spesialis', value: '120+', icon: Stethoscope },
    { label: 'Tenaga Medis', value: '800+', icon: Heart },
    { label: 'Tempat Tidur', value: '350', icon: Hospital },
    { label: 'Tahun Berdiri', value: '2008', icon: Calendar },
    { label: 'Tingkat Kepuasan', value: '98.5%', icon: Star }
  ];

  const milestones = [
    { year: '2008', event: 'Pendirian RS Medicare Prima' },
    { year: '2010', event: 'Akreditasi KARS tingkat dasar' },
    { year: '2012', event: 'Penambahan gedung rawat inap' },
    { year: '2015', event: 'Akreditasi KARS tingkat utama' },
    { year: '2018', event: 'Sertifikasi ISO 9001:2015' },
    { year: '2020', event: 'Pembukaan unit jantung dan pembuluh darah' },
    { year: '2022', event: 'Akreditasi JCI' },
    { year: '2023', event: 'Akreditasi KARS Paripurna' },
    { year: '2024', event: 'Penghargaan Top Hospital Award' }
  ];

  const galleryImages = [
    { id: 1, title: 'Lobby Utama', category: 'interior', image: '/api/placeholder/400/300' },
    { id: 2, title: 'Ruang Operasi Modern', category: 'medical', image: '/api/placeholder/400/300' },
    { id: 3, title: 'ICU & NICU', category: 'medical', image: '/api/placeholder/400/300' },
    { id: 4, title: 'Kamar VIP', category: 'interior', image: '/api/placeholder/400/300' },
    { id: 5, title: 'Laboratorium', category: 'medical', image: '/api/placeholder/400/300' },
    { id: 6, title: 'Radiologi & CT Scan', category: 'medical', image: '/api/placeholder/400/300' },
    { id: 7, title: 'Farmasi 24 Jam', category: 'facility', image: '/api/placeholder/400/300' },
    { id: 8, title: 'Emergency Room', category: 'medical', image: '/api/placeholder/400/300' },
    { id: 9, title: 'Taman Healing Garden', category: 'exterior', image: '/api/placeholder/400/300' }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Ibu Sari Dewi',
      treatment: 'Operasi Jantung',
      rating: 5,
      comment: 'Pelayanan sangat profesional dan fasilitas sangat lengkap. Tim medis yang sangat berpengalaman membuat saya merasa aman.',
      date: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      name: 'Bapak Ahmad Rizki',
      treatment: 'Perawatan Kanker',
      rating: 5,
      comment: 'Terima kasih kepada seluruh tim onkologi RS Medicare Prima. Perawatan yang diberikan sangat komprehensif dan penuh empati.',
      date: '2024-02-20',
      verified: true
    },
    {
      id: 3,
      name: 'Ibu Maya Sartika',
      treatment: 'Persalinan Caesar',
      rating: 5,
      comment: 'Pengalaman melahirkan yang sangat berkesan. Dokter dan bidan sangat ramah, fasilitas NICU terbaik untuk si kecil.',
      date: '2024-03-10',
      verified: true
    }
  ];

  const featuredDoctors = [
    {
      id: 1,
      name: 'Dr. Andi Wijaya, Sp.JP(K)',
      specialty: 'Kardiologi Intervensi',
      experience: '25 tahun',
      education: 'S3 Kedokteran UI, Fellowship Harvard Medical School',
      image: '/api/placeholder/200/200',
      rating: 4.9,
      patients: '2000+',
      schedule: ['Senin: 08:00-12:00', 'Rabu: 14:00-17:00', 'Jumat: 08:00-12:00']
    },
    {
      id: 2,
      name: 'Dr. Sari Indrawati, Sp.A(K)',
      specialty: 'Anak & Neonatologi',
      experience: '20 tahun',
      education: 'S3 Kedokteran UGM, Fellowship Johns Hopkins',
      image: '/api/placeholder/200/200',
      rating: 4.9,
      patients: '1800+',
      schedule: ['Selasa: 09:00-13:00', 'Kamis: 14:00-18:00', 'Sabtu: 08:00-12:00']
    },
    {
      id: 3,
      name: 'Dr. Bambang Sutrisno, Sp.B(K)Onk',
      specialty: 'Bedah Onkologi',
      experience: '22 tahun',
      education: 'S3 Kedokteran UNAIR, Fellowship Mayo Clinic',
      image: '/api/placeholder/200/200',
      rating: 4.8,
      patients: '1500+',
      schedule: ['Senin: 13:00-17:00', 'Rabu: 08:00-12:00', 'Jumat: 13:00-17:00']
    }
  ];

  const certifications = [
    {
      title: 'Akreditasi KARS Paripurna',
      issuer: 'Komisi Akreditasi Rumah Sakit Indonesia',
      year: '2023',
      validUntil: '2026',
      description: 'Standar pelayanan kesehatan tertinggi di Indonesia',
      document: '/certificates/kars-paripurna.pdf'
    },
    {
      title: 'JCI Accreditation',
      issuer: 'Joint Commission International',
      year: '2022',
      validUntil: '2025',
      description: 'Standar internasional keselamatan dan kualitas pasien',
      document: '/certificates/jci-accreditation.pdf'
    },
    {
      title: 'ISO 9001:2015',
      issuer: 'International Organization for Standardization',
      year: '2022',
      validUntil: '2025',
      description: 'Sistem manajemen mutu internasional',
      document: '/certificates/iso-9001.pdf'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Profil Umum', icon: Building2 },
    { id: 'leadership', label: 'Manajemen', icon: Users },
    { id: 'facilities', label: 'Fasilitas', icon: Hospital },
    { id: 'gallery', label: 'Galeri & Virtual Tour', icon: Camera },
    { id: 'testimonials', label: 'Testimoni', icon: Quote },
    { id: 'doctors', label: 'Tim Dokter', icon: Stethoscope },
    { id: 'achievements', label: 'Prestasi', icon: Award },
    { id: 'history', label: 'Sejarah', icon: Clock }
  ];

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Building2 className="w-5 h-5" />
              <span className="font-medium">Tentang Kami</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {hospitalInfo?.name || 'RS Medicare Prima'}
            </h1>
            <p className="text-xl md:text-2xl text-teal-100 mb-8">
              {hospitalInfo?.description || 'Rumah Sakit Swasta Terdepan dengan Pelayanan Kesehatan Berkualitas Internasional'}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {(hospitalInfo?.accreditations || ['Akreditasi KARS Paripurna', 'JCI Accredited', 'ISO 9001:2015']).slice(0, 3).map((accreditation, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {[Award, Shield, Star][index] && React.createElement([Award, Shield, Star][index], { className: "w-5 h-5" })}
                  <span>{accreditation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 text-teal-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-16">
              {/* Vision & Mission */}
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <Eye className="w-8 h-8 text-teal-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Visi</h3>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Menjadi rumah sakit rujukan terdepan di Indonesia yang memberikan 
                    pelayanan kesehatan berkualitas internasional dengan pendekatan 
                    holistik dan berbasis teknologi modern.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <Target className="w-8 h-8 text-teal-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Misi</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Memberikan pelayanan kesehatan yang aman, bermutu, dan terjangkau</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Mengembangkan teknologi medis terdepan</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Meningkatkan kualitas SDM secara berkelanjutan</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Berkontribusi pada kesehatan masyarakat Indonesia</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Values */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Nilai-Nilai Kami</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: 'Compassion', desc: 'Peduli dan empati pada setiap pasien', icon: Heart },
                    { title: 'Excellence', desc: 'Komitmen pada kualitas terbaik', icon: Star },
                    { title: 'Integrity', desc: 'Kejujuran dan transparansi', icon: Shield },
                    { title: 'Innovation', desc: 'Inovasi berkelanjutan', icon: TrendingUp }
                  ].map((value, index) => (
                    <div key={index} className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 text-teal-600 rounded-full mb-4">
                        <value.icon className="w-8 h-8" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{value.title}</h4>
                      <p className="text-gray-600 text-sm">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Informasi Kontak</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-6 h-6 text-teal-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Alamat</h4>
                      <p className="text-gray-600">Jl. Kesehatan No. 123<br />Jakarta Selatan 12560</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="w-6 h-6 text-teal-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Telepon</h4>
                      <p className="text-gray-600">(021) 1234-5678<br />IGD: 119</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="w-6 h-6 text-teal-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-600">info@medicareprima.com<br />cs@medicareprima.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Globe className="w-6 h-6 text-teal-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Website</h4>
                      <p className="text-gray-600">www.medicareprima.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leadership Tab */}
          {activeTab === 'leadership' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Tim Manajemen</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Dipimpin oleh profesional berpengalaman dengan dedikasi tinggi pada pelayanan kesehatan
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {leadership.map((leader, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                    <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Users className="w-16 h-16 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{leader.name}</h3>
                    <p className="text-teal-600 font-semibold mb-2">{leader.position}</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-center space-x-2">
                        <Briefcase className="w-4 h-4" />
                        <span>Pengalaman: {leader.experience}</span>
                      </div>
                      <div className="flex items-start justify-center space-x-2">
                        <GraduationCap className="w-4 h-4 mt-0.5" />
                        <span className="text-center">{leader.education}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link href="/profile/management">
                  <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto">
                    <span>Lihat Detail Manajemen</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Facilities Tab */}
          {activeTab === 'facilities' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Fasilitas Lengkap</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Dilengkapi dengan teknologi medis terdepan dan fasilitas penunjang modern
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {facilities.map((facility, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">{facility.category}</h3>
                    <ul className="space-y-3">
                      {facility.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Prestasi & Sertifikasi</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Pengakuan atas komitmen kami terhadap kualitas pelayanan kesehatan
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                          <achievement.icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{achievement.title}</h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {achievement.year}
                          </span>
                        </div>
                        <p className="text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Sejarah & Milestone</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Perjalanan kami dalam memberikan pelayanan kesehatan terbaik
                </p>
              </div>

              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-teal-200"></div>
                <div className="space-y-8">
                  {milestones.map((milestone, index) => (
                    <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                          <div className="text-2xl font-bold text-teal-600 mb-2">{milestone.year}</div>
                          <p className="text-gray-700">{milestone.event}</p>
                        </div>
                      </div>
                      <div className="relative z-10">
                        <div className="w-6 h-6 bg-teal-600 rounded-full border-4 border-white shadow-lg"></div>
                      </div>
                      <div className="w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Gallery & Virtual Tour Tab */}
          {activeTab === 'gallery' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Galeri & Virtual Tour</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Jelajahi fasilitas modern RS Medicare Prima melalui galeri foto dan virtual tour interaktif
                </p>
              </div>

              {/* Virtual Tour Video */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <Video className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Virtual Tour 360°</h3>
                  <p className="text-gray-600 mb-6">Rasakan pengalaman berkeliling rumah sakit secara virtual</p>
                </div>
                
                <div className="relative bg-gray-200 rounded-xl aspect-video flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer group">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-700 transition-colors">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    <p className="text-gray-700 font-semibold">Mulai Virtual Tour</p>
                  </div>
                </div>
              </div>

              {/* Gallery Categories */}
              <div>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {['Semua', 'Medical', 'Interior', 'Exterior', 'Facility'].map((category) => (
                    <button
                      key={category}
                      className="px-6 py-2 rounded-full border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="group relative overflow-hidden rounded-xl aspect-[4/3] bg-gray-200 gallery-hover hover:shadow-lg transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h4 className="font-semibold text-lg">{image.title}</h4>
                        <p className="text-sm text-gray-200 capitalize">{image.category}</p>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Testimoni Pasien</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Cerita nyata dari pasien yang telah merasakan pelayanan terbaik kami
                </p>
              </div>

              {/* Patient Satisfaction Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">98.5%</div>
                  <div className="text-gray-700">Tingkat Kepuasan</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">4.9/5</div>
                  <div className="text-gray-700">Rating Pasien</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">15,000+</div>
                  <div className="text-gray-700">Ulasan Positif</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
                  <div className="text-gray-700">Rekomendasi</div>
                </div>
              </div>

              {/* Testimonials Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(dynamicTestimonials.length > 0 ? dynamicTestimonials : testimonials).map((testimonial: any, index: number) => (
                  <div key={testimonial.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-teal-500 testimonial-card" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex text-yellow-400 star-rating">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-current star" />
                        ))}
                      </div>
                      {testimonial.isVerified && (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <Quote className="w-8 h-8 text-teal-300 mb-2" />
                      <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="font-semibold text-gray-900">{testimonial.patientName || testimonial.name}</div>
                      <div className="text-sm text-teal-600">{testimonial.treatmentType || testimonial.treatment}</div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(testimonial.createdAt || testimonial.date).toLocaleDateString('id-ID')}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto">
                  <span>Lihat Semua Testimoni</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Doctors Team Tab */}
          {activeTab === 'doctors' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Tim Dokter Spesialis</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Dokter berpengalaman dengan keahlian internasional dan dedikasi tinggi
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(dynamicFeaturedDoctors.length > 0 ? dynamicFeaturedDoctors : featuredDoctors).map((doctor: any, index: number) => (
                  <div key={doctor.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 doctor-card" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="relative">
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <Users className="w-20 h-20 text-gray-400" />
                      </div>
                      <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                        <div className="flex items-center text-sm font-semibold text-yellow-600">
                          <Star className="w-4 h-4 fill-current mr-1" />
                          {doctor.rating}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
                      <p className="text-teal-600 font-semibold mb-3">{doctor.specialty}</p>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="w-4 h-4" />
                          <span>Pengalaman: {doctor.experience}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>Pasien: {doctor.patients}</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <GraduationCap className="w-4 h-4 mt-0.5" />
                          <span>{doctor.education}</span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Jadwal Praktek
                        </h4>
                        <div className="space-y-1">
                          {(doctor.schedule && typeof doctor.schedule === 'object' 
                            ? Object.entries(doctor.schedule).map(([day, times]: [string, any], index: number) => (
                                <div key={index} className="text-sm text-gray-600">{day}: {Array.isArray(times) ? times.join(', ') : times}</div>
                              ))
                            : doctor.schedule?.map((schedule: any, index: number) => (
                                <div key={index} className="text-sm text-gray-600">{schedule}</div>
                              )) || []
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-semibold transition-colors btn-primary">
                          Buat Janji
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Tim Medis Lengkap</h3>
                <p className="text-gray-600 mb-6">
                  Kami memiliki lebih dari 120 dokter spesialis dan sub-spesialis dengan berbagai keahlian
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">25+</div>
                    <div className="text-sm text-gray-600">Spesialisasi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">120+</div>
                    <div className="text-sm text-gray-600">Dokter Spesialis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">24/7</div>
                    <div className="text-sm text-gray-600">Pelayanan</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">15+</div>
                    <div className="text-sm text-gray-600">Tahun Rata-rata Pengalaman</div>
                  </div>
                </div>
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  Lihat Semua Dokter
                </button>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Prestasi & Penghargaan</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Komitmen kami pada kualitas telah diakui oleh berbagai institusi nasional dan internasional
                </p>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-teal-600" />
                  Sertifikasi & Akreditasi
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {certifications.map((cert, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-teal-500 certification-card" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-2">{cert.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{cert.issuer}</p>
                          <p className="text-xs text-gray-500">{cert.description}</p>
                        </div>
                        <div className="flex flex-col items-end text-xs text-gray-500">
                          <span className="font-semibold text-teal-600">{cert.year}</span>
                          <span>Valid until {cert.validUntil}</span>
                        </div>
                      </div>
                      <button className="flex items-center text-teal-600 hover:text-teal-700 text-sm font-semibold btn-primary">
                        <Download className="w-4 h-4 mr-1" />
                        Download Sertifikat
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Awards */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Award className="w-6 h-6 mr-3 text-teal-600" />
                  Penghargaan & Prestasi
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300 award-card" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <achievement.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                      <div className="text-xs font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full inline-block">
                        {achievement.year}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Sejarah RS Medicare Prima</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Perjalanan panjang dalam memberikan pelayanan kesehatan terbaik sejak tahun 2008
                </p>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-teal-200"></div>
                <div className="space-y-8">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="relative flex items-center timeline-item" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="absolute left-6 w-4 h-4 bg-teal-600 rounded-full border-4 border-white shadow-lg"></div>
                      <div className="ml-16 bg-white rounded-xl p-6 shadow-lg flex-1 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-2">{milestone.event}</h3>
                            <p className="text-sm text-gray-600">
                              Langkah penting dalam perjalanan RS Medicare Prima menuju pelayanan kesehatan yang semakin baik
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-teal-600">{milestone.year}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vision for Future */}
              <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Visi ke Depan</h3>
                <p className="text-lg text-teal-100 mb-6">
                  Menuju 2030, RS Medicare Prima berkomitmen menjadi pusat kesehatan rujukan regional dengan teknologi AI dan telemedicine terdepan
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">2025</div>
                    <div className="text-sm text-teal-100">Robot Surgery Center</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">2027</div>
                    <div className="text-sm text-teal-100">AI Diagnostic Center</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">2030</div>
                    <div className="text-sm text-teal-100">Regional Medical Hub</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Bergabunglah dengan Keluarga Besar Medicare Prima
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Jadilah bagian dari misi kami dalam memberikan pelayanan kesehatan terbaik
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <button className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Konsultasi Sekarang</span>
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
