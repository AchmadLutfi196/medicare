'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft,
  Hospital,
  Activity,
  Heart,
  Stethoscope,
  Shield,
  Zap,
  Wifi,
  Car,
  Coffee,
  MapPin,
  Clock,
  CheckCircle,
  Star,
  Users,
  Monitor,
  Microscope,
  Pill
} from 'lucide-react';
import { 
  Facility,
  MedicalFacility,
  SupportFacility,
  GeneralFacility,
  TechnologyFacility,
  isMedicalFacility,
  isSupportFacility,
  isGeneralFacility,
  isTechnologyFacility
} from './typeguards';

export default function FacilitiesPage() {
  const [activeCategory, setActiveCategory] = useState('medical');

  const facilityCategories = [
    { id: 'medical', name: 'Pelayanan Medis', icon: Heart, color: 'text-red-600 bg-red-100' },
    { id: 'support', name: 'Penunjang Medis', icon: Microscope, color: 'text-blue-600 bg-blue-100' },
    { id: 'general', name: 'Fasilitas Umum', icon: Hospital, color: 'text-green-600 bg-green-100' },
    { id: 'technology', name: 'Teknologi', icon: Monitor, color: 'text-purple-600 bg-purple-100' }
  ];

  const medicalFacilities = [
    {
      name: 'Instalasi Gawat Darurat (IGD)',
      description: 'Pelayanan darurat 24 jam dengan tim medis siaga',
      features: ['24 jam operasional', 'Trauma center', 'Ambulance siaga', 'Resusitasi unit'],
      capacity: '50 bed',
      staff: '30 petugas medis',
      certification: 'Emergency Medicine Certified'
    },
    {
      name: 'Intensive Care Unit (ICU)',
      description: 'Perawatan intensif dengan monitoring ketat',
      features: ['Ventilator canggih', 'Central monitoring', 'Isolasi HEPA', '24 jam specialist'],
      capacity: '20 bed',
      staff: '15 intensivist',
      certification: 'ICU Accredited'
    },
    {
      name: 'Cardiac Care Unit (CCU)',
      description: 'Unit perawatan jantung dengan teknologi terdepan',
      features: ['Cardiac monitoring', 'Defibrillator', 'ECMO ready', 'Cath lab access'],
      capacity: '12 bed',
      staff: '10 cardiologist',
      certification: 'Cardiovascular Excellence'
    },
    {
      name: 'Neonatal ICU (NICU)',
      description: 'Perawatan bayi prematur dan kritis',
      features: ['Incubator transport', 'Phototherapy', 'Ventilator neonatal', 'Isolette'],
      capacity: '15 bed',
      staff: '12 neonatologist',
      certification: 'NICU Level III'
    },
    {
      name: 'Kamar Operasi',
      description: 'Ruang bedah modern dengan teknologi terdepan',
      features: ['Laminar air flow', 'Surgical navigation', 'Endoscopic surgery', 'Robotic surgery'],
      capacity: '12 kamar operasi',
      staff: '25 surgeon',
      certification: 'Surgical Excellence'
    },
    {
      name: 'Unit Hemodialisa',
      description: 'Terapi cuci darah dengan mesin modern',
      features: ['Online hemodiafiltration', 'Water treatment RO', 'Monitoring realtime', 'Infection control'],
      capacity: '20 mesin',
      staff: '8 nephrologist',
      certification: 'Nephrology Certified'
    }
  ];

  const supportFacilities = [
    {
      name: 'Laboratorium Patologi Klinik',
      description: 'Pemeriksaan laboratorium lengkap 24 jam',
      features: ['Automated analyzer', 'Point of care testing', 'Rapid test', 'Molecular diagnostic'],
      capacity: '5000 sampel/hari',
      staff: '20 lab technologist',
      certification: 'ISO 15189'
    },
    {
      name: 'Radiologi & Imaging',
      description: 'Pemeriksaan radiologi dengan teknologi digital',
      features: ['Digital radiography', 'Computed radiography', 'PACS system', 'Teleradiology'],
      capacity: '300 pemeriksaan/hari',
      staff: '8 radiologist',
      certification: 'ACR Accredited'
    },
    {
      name: 'CT Scan 128 Slice',
      description: 'Pemeriksaan CT scan resolusi tinggi',
      features: ['Low dose radiation', 'Cardiac CT', 'CT angiography', '3D reconstruction'],
      capacity: '50 pemeriksaan/hari',
      staff: '4 radiologist',
      certification: 'CT Excellence'
    },
    {
      name: 'MRI 1.5 Tesla',
      description: 'Magnetic Resonance Imaging canggih',
      features: ['High resolution', 'Functional MRI', 'MR angiography', 'Whole body scan'],
      capacity: '30 pemeriksaan/hari',
      staff: '3 radiologist',
      certification: 'MRI Certified'
    },
    {
      name: 'Farmasi Rumah Sakit',
      description: 'Pelayanan farmasi 24 jam',
      features: ['Unit dose dispensing', 'Clinical pharmacy', 'Drug information', 'TPN preparation'],
      capacity: '2000 resep/hari',
      staff: '15 pharmacist',
      certification: 'Pharmacy Accredited'
    },
    {
      name: 'Catheterization Laboratory',
      description: 'Laboratorium kateterisasi jantung',
      features: ['Coronary angiography', 'PCI procedure', 'Pacemaker implant', 'Balloon angioplasty'],
      capacity: '10 procedure/hari',
      staff: '5 interventional cardiologist',
      certification: 'Interventional Excellence'
    }
  ];

  const generalFacilities = [
    {
      name: 'Ruang Rawat Inap',
      description: 'Kamar perawatan nyaman dengan fasilitas lengkap',
      features: ['AC individual', 'TV LED', 'WiFi gratis', 'Nurse call system'],
      capacity: '350 tempat tidur',
      types: ['VIP', 'Kelas I', 'Kelas II', 'Kelas III']
    },
    {
      name: 'Food Court & Cafeteria',
      description: 'Area makan dengan berbagai pilihan makanan sehat',
      features: ['Menu halal', 'Diet khusus', 'Catering service', 'Takeaway'],
      capacity: '200 seats',
      types: ['Restaurant', 'Coffee shop', 'Fast food', 'Healthy food']
    },
    {
      name: 'Parkir Bertingkat',
      description: 'Area parkir luas dan aman',
      features: ['Security 24 jam', 'CCTV monitoring', 'Valet parking', 'Disabled access'],
      capacity: '500 kendaraan',
      types: ['Mobil', 'Motor', 'Ambulance', 'VIP parking']
    },
    {
      name: 'Mushola & Spiritual Care',
      description: 'Fasilitas ibadah dan pelayanan rohani',
      features: ['Mushola luas', 'Tempat wudhu', 'Spiritual counseling', 'Religious service'],
      capacity: '100 jamaah',
      types: ['Mushola utama', 'Mushola lantai', 'Ruang doa', 'Konseling']
    },
    {
      name: 'Apotek & Retail',
      description: 'Apotek dan toko retail untuk kebutuhan pasien',
      features: ['Obat lengkap', 'Alat kesehatan', 'Konsultasi farmasis', 'Home delivery'],
      capacity: '24 jam operasional',
      types: ['Apotek', 'Medical store', 'Gift shop', 'Convenience store']
    },
    {
      name: 'ATM & Banking',
      description: 'Fasilitas perbankan untuk kemudahan transaksi',
      features: ['ATM 24 jam', 'Mobile banking', 'Payment gateway', 'Insurance claim'],
      capacity: '5 ATM machines',
      types: ['BCA', 'Mandiri', 'BRI', 'BNI']
    }
  ];

  const technologyFacilities = [
    {
      name: 'Hospital Information System (HIS)',
      description: 'Sistem informasi rumah sakit terintegrasi',
      features: ['Electronic medical record', 'Digital prescription', 'Lab integration', 'Billing system'],
      coverage: '100% digital',
      benefits: ['Paperless', 'Real-time data', 'Patient safety', 'Efficiency']
    },
    {
      name: 'Telemedicine Platform',
      description: 'Konsultasi online dengan dokter spesialis',
      features: ['Video consultation', 'Mobile app', 'Prescription delivery', 'Follow-up care'],
      coverage: '24/7 availability',
      benefits: ['Remote access', 'Social distancing', 'Convenience', 'Cost effective']
    },
    {
      name: 'WiFi Hospital Network',
      description: 'Jaringan internet berkecepatan tinggi',
      features: ['Free WiFi', 'High bandwidth', 'Secure connection', 'Patient portal'],
      coverage: '100% area',
      benefits: ['Stay connected', 'Information access', 'Entertainment', 'Communication']
    },
    {
      name: 'Mobile Health App',
      description: 'Aplikasi mobile untuk kemudahan akses layanan',
      features: ['Online booking', 'Health records', 'Appointment reminder', 'Health tips'],
      coverage: 'iOS & Android',
      benefits: ['Easy booking', 'Health tracking', 'Notifications', 'Health education']
    },
    {
      name: 'Digital Signage System',
      description: 'Sistem informasi digital di seluruh area rumah sakit',
      features: ['Queue management', 'Wayfinding', 'Health information', 'Emergency alerts'],
      coverage: '50+ displays',
      benefits: ['Clear direction', 'Reduced waiting', 'Information access', 'Modern experience']
    },
    {
      name: 'CCTV & Security System',
      description: 'Sistem keamanan terintegrasi 24 jam',
      features: ['HD cameras', 'Access control', 'Panic button', 'Central monitoring'],
      coverage: '100% coverage',
      benefits: ['Patient safety', 'Asset protection', 'Staff security', 'Incident prevention']
    }
  ];

  const getCurrentFacilities = (): Facility[] => {
    switch (activeCategory) {
      case 'medical': return medicalFacilities as MedicalFacility[];
      case 'support': return supportFacilities as SupportFacility[];
      case 'general': return generalFacilities as GeneralFacility[];
      case 'technology': return technologyFacilities as TechnologyFacility[];
      default: return medicalFacilities as MedicalFacility[];
    }
  };

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Beranda</Link>
            <span className="text-gray-300">/</span>
            <Link href="/profile" className="text-gray-500 hover:text-gray-700">Profile</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">Fasilitas</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/profile" className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span>Kembali ke Profile</span>
        </Link>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Hospital className="w-5 h-5" />
            <span className="font-medium">Fasilitas Lengkap</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Fasilitas RS Medicare Prima
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            Dilengkapi dengan teknologi medis terdepan dan fasilitas penunjang modern untuk pelayanan kesehatan terbaik
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {facilityCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeCategory === category.id
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {getCurrentFacilities().map((facility, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{facility.name}</h3>
                      <p className="text-gray-600">{facility.description}</p>
                    </div>
                    <div className={`p-3 rounded-full ${facilityCategories.find(c => c.id === activeCategory)?.color}`}>
                      {React.createElement(facilityCategories.find(c => c.id === activeCategory)?.icon || Hospital, { className: "w-6 h-6" })}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Fitur Unggulan</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {facility.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 gap-4">
                      {/* Capacity property - explicitly check facility types that have capacity property */}
                      {/* TypeScript needs explicit type narrowing with type guards to properly type-check this */}
                      {(isGeneralFacility(facility) || isMedicalFacility(facility) || isSupportFacility(facility)) && facility.capacity && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-600">Kapasitas</span>
                          <span className="text-sm font-bold text-gray-900">{facility.capacity}</span>
                        </div>
                      )}
                      
                      {/* Properties for Medical and Support facilities */}
                      {(isMedicalFacility(facility) || isSupportFacility(facility)) && facility.staff && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-600">Tenaga Ahli</span>
                          <span className="text-sm font-bold text-gray-900">{facility.staff}</span>
                        </div>
                      )}

                      {(isMedicalFacility(facility) || isSupportFacility(facility)) && facility.certification && (
                        <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                          <span className="text-sm font-medium text-teal-600">Sertifikasi</span>
                          <span className="text-sm font-bold text-teal-900">{facility.certification}</span>
                        </div>
                      )}

                      {/* Properties for Technology facilities */}
                      {isTechnologyFacility(facility) && facility.coverage && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium text-blue-600">Cakupan</span>
                          <span className="text-sm font-bold text-blue-900">{facility.coverage}</span>
                        </div>
                      )}

                      {/* Properties for General facilities */}
                      {isGeneralFacility(facility) && facility.types && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 block mb-2">Jenis Layanan</span>
                          <div className="flex flex-wrap gap-2">
                            {facility.types.map((type, typeIndex) => (
                              <span key={typeIndex} className="text-xs bg-white px-2 py-1 rounded text-gray-700">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Properties for Technology facilities */}
                      {isTechnologyFacility(facility) && facility.benefits && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 block mb-2">Manfaat</span>
                          <div className="flex flex-wrap gap-2">
                            {facility.benefits.map((benefit, benefitIndex) => (
                              <span key={benefitIndex} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Summary */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Ringkasan Fasilitas</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-red-50 rounded-2xl">
              <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-red-600 mb-2">25+</div>
              <div className="text-sm text-gray-600">Unit Pelayanan Medis</div>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-2xl">
              <Microscope className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-sm text-gray-600">Penunjang Medis</div>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-2xl">
              <Hospital className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-green-600 mb-2">20+</div>
              <div className="text-sm text-gray-600">Fasilitas Umum</div>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-2xl">
              <Monitor className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-purple-600 mb-2">10+</div>
              <div className="text-sm text-gray-600">Sistem Teknologi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Tour */}
      <section className="py-16 bg-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ingin Melihat Fasilitas Langsung?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Hubungi kami untuk mengatur kunjungan dan tour fasilitas rumah sakit
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Atur Kunjungan</span>
              </button>
            </Link>
            <Link href="tel:+622112345678">
              <button className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Hubungi Sekarang</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
