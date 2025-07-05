'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  ChevronLeft,
  Briefcase,
  GraduationCap,
  Award,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Building2,
  Star,
  TrendingUp
} from 'lucide-react';

export default function ManagementPage() {
  const boardOfDirectors = [
    {
      name: 'Dr. Prof. Andi Wijaya, Sp.JP(K)',
      position: 'Direktur Utama',
      experience: '25 tahun',
      education: 'S3 Kedokteran UI, Fellowship Harvard Medical School',
      specialization: 'Jantung dan Pembuluh Darah',
      achievements: [
        'Fellow American College of Cardiology',
        'Dokter Terbaik Indonesia 2023',
        'Penulis 150+ jurnal internasional'
      ],
      contact: {
        email: 'direktur@medicareprima.com',
        phone: '(021) 1234-5678 ext. 101'
      }
    },
    {
      name: 'Dr. Sari Indrawati, Sp.A(K)',
      position: 'Direktur Medis',
      experience: '20 tahun',
      education: 'S3 Kedokteran UGM, Fellowship Johns Hopkins',
      specialization: 'Anak dan Neonatologi',
      achievements: [
        'Board Certified Pediatric Intensivist',
        'Penghargaan Dokter Anak Terbaik 2022',
        'Konsultan WHO untuk Asia Tenggara'
      ],
      contact: {
        email: 'medis@medicareprima.com',
        phone: '(021) 1234-5678 ext. 102'
      }
    },
    {
      name: 'Ir. Bambang Sutrisno, MM',
      position: 'Direktur Operasional',
      experience: '18 tahun',
      education: 'S2 Manajemen RS UI, Certified Hospital Executive',
      specialization: 'Manajemen Rumah Sakit',
      achievements: [
        'Certified Healthcare Executive (CHE)',
        'Indonesia Hospital Management Award',
        'Lean Six Sigma Black Belt'
      ],
      contact: {
        email: 'operasional@medicareprima.com',
        phone: '(021) 1234-5678 ext. 103'
      }
    }
  ];

  const departments = [
    {
      name: 'Departemen Medis',
      head: 'Dr. Ahmad Rahman, Sp.PD',
      responsibilities: [
        'Koordinasi pelayanan medis',
        'Standar prosedur medis',
        'Pengembangan kompetensi dokter',
        'Quality assurance medis'
      ]
    },
    {
      name: 'Departemen Keperawatan',
      head: 'Ns. Maria Sari, S.Kep, M.Kep',
      responsibilities: [
        'Manajemen asuhan keperawatan',
        'Pengembangan SDM perawat',
        'Standar praktik keperawatan',
        'Patient safety'
      ]
    },
    {
      name: 'Departemen Penunjang Medis',
      head: 'Dr. Budi Hartono, Sp.Rad',
      responsibilities: [
        'Laboratorium dan radiologi',
        'Farmasi rumah sakit',
        'Rekam medis',
        'Sterilisasi sentral'
      ]
    },
    {
      name: 'Departemen Keuangan',
      head: 'Drs. Supriyanto, M.Ak',
      responsibilities: [
        'Manajemen keuangan',
        'Billing dan casemix',
        'Asuransi dan BPJS',
        'Financial planning'
      ]
    },
    {
      name: 'Departemen SDM',
      head: 'Dra. Fitri Handayani, MM',
      responsibilities: [
        'Rekrutmen dan seleksi',
        'Training dan development',
        'Performance management',
        'Employee relations'
      ]
    },
    {
      name: 'Departemen IT',
      head: 'Ir. Joko Purnomo, MT',
      responsibilities: [
        'Sistem informasi rumah sakit',
        'Telemedicine',
        'Cyber security',
        'Digital transformation'
      ]
    }
  ];

  const organizationStructure = [
    { level: 1, title: 'Dewan Komisaris', count: 5 },
    { level: 2, title: 'Direktur Utama', count: 1 },
    { level: 3, title: 'Direktur', count: 2 },
    { level: 4, title: 'Kepala Departemen', count: 8 },
    { level: 5, title: 'Kepala Unit', count: 24 },
    { level: 6, title: 'Supervisor', count: 45 },
    { level: 7, title: 'Staff', count: 720 }
  ];

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
            <span className="text-gray-900">Manajemen</span>
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
            <Users className="w-5 h-5" />
            <span className="font-medium">Tim Manajemen</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Kepemimpinan RS Medicare Prima
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            Dipimpin oleh profesional berpengalaman dengan dedikasi tinggi untuk memberikan pelayanan kesehatan terbaik
          </p>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Dewan Direksi</h2>
          
          <div className="space-y-12">
            {boardOfDirectors.map((director, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gradient-to-br from-teal-500 to-cyan-600 p-8 text-white text-center">
                    <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Users className="w-16 h-16" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{director.name}</h3>
                    <p className="text-teal-100 text-lg font-semibold mb-4">{director.position}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{director.experience}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-xs">{director.contact.email}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span className="text-xs">{director.contact.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                          <GraduationCap className="w-5 h-5 text-teal-600" />
                          <span>Pendidikan</span>
                        </h4>
                        <p className="text-gray-700 mb-6">{director.education}</p>
                        
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                          <Star className="w-5 h-5 text-teal-600" />
                          <span>Spesialisasi</span>
                        </h4>
                        <p className="text-gray-700">{director.specialization}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                          <Award className="w-5 h-5 text-teal-600" />
                          <span>Prestasi</span>
                        </h4>
                        <ul className="space-y-2">
                          {director.achievements.map((achievement, achievementIndex) => (
                            <li key={achievementIndex} className="flex items-start space-x-2">
                              <TrendingUp className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organization Structure */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Struktur Organisasi</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {organizationStructure.map((level, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index < 3 ? 'bg-teal-600' : index < 5 ? 'bg-cyan-500' : 'bg-gray-400'
                    }`}>
                      {level.level}
                    </div>
                    <span className="font-semibold text-gray-900">{level.title}</span>
                  </div>
                  <div className="text-teal-600 font-bold">{level.count} orang</div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center text-gray-600">
              <p>Total SDM: <span className="font-bold text-teal-600">805 orang</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Departemen</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <Building2 className="w-8 h-8 text-teal-600" />
                  <h3 className="text-xl font-bold text-gray-900">{dept.name}</h3>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Kepala Departemen</p>
                  <p className="font-semibold text-gray-900">{dept.head}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-3">Tanggung Jawab</p>
                  <ul className="space-y-2">
                    {dept.responsibilities.map((resp, respIndex) => (
                      <li key={respIndex} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Management */}
      <section className="py-16 bg-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Hubungi Tim Manajemen
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Untuk kerjasama, pertanyaan, atau saran terkait pelayanan rumah sakit
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="mailto:manajemen@medicareprima.com">
              <button className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Email Manajemen</span>
              </button>
            </Link>
            <Link href="tel:+622112345678">
              <button className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Telepon Kantor</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
