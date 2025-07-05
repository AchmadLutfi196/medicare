'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  CreditCard,
  Shield,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Users,
  Heart,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Download,
  Loader2
} from 'lucide-react';
import { useContent } from '../../hooks/useContent';

export default function PatientInfoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Fetch content from database
  const { 
    faqs, 
    guides, 
    hospitalInfo,
    loading, 
    error 
  } = useContent();

  // Fallback data for documents (could be moved to database later)
  const documents = [
    { name: 'Panduan Pasien Rawat Jalan', size: '2.1 MB', type: 'PDF' },
    { name: 'Panduan Pasien Rawat Inap', size: '1.8 MB', type: 'PDF' },
    { name: 'Prosedur Emergency', size: '1.2 MB', type: 'PDF' },
    { name: 'Daftar Tarif Layanan', size: '956 KB', type: 'PDF' },
    { name: 'Formulir Pengaduan', size: '245 KB', type: 'PDF' }
  ];

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  // Group FAQs by category
  const groupedFAQs = faqs.reduce((acc, faq) => {
    const category = faq.category || 'Umum';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

  // Convert grouped FAQs to the expected format
  const faqData = Object.entries(groupedFAQs).map(([category, questions]) => ({
    category,
    questions: questions.map((faq, index) => ({
      id: index + 1,
      question: faq.question,
      answer: faq.answer
    }))
  }));

  // Filter guides for patient info
  const patientGuides = guides.filter(guide => 
    guide.type === 'patient' || 
    guide.type === 'general' ||
    guide.title.toLowerCase().includes('pasien') ||
    guide.title.toLowerCase().includes('kunjungan')
  ).slice(0, 3);

  // Create guidelines from guides or use fallback
  const guidelines = patientGuides.length > 0 
    ? patientGuides.map((guide, index) => ({
        title: guide.title,
        icon: [CheckCircle, Shield, FileText][index] || CheckCircle,
        items: guide.steps.slice(0, 5)
      }))
    : [
        {
          title: 'Persiapan Kunjungan',
          icon: CheckCircle,
          items: [
            'Bawa kartu identitas (KTP/SIM/Paspor)',
            'Bawa kartu asuransi atau BPJS (jika ada)',
            'Siapkan daftar obat yang sedang dikonsumsi',
            'Catat keluhan dan gejala yang dialami',
            'Datang 15 menit sebelum jadwal konsultasi'
          ]
        },
        {
          title: 'Selama di Rumah Sakit',
          icon: Shield,
          items: [
            'Ikuti protokol kesehatan yang berlaku',
            'Gunakan masker di area rumah sakit',
            'Jaga kebersihan tangan dengan hand sanitizer',
            'Ikuti petunjuk petugas keamanan',
            'Jaga ketenangan dan ketertiban'
          ]
        },
        {
          title: 'Setelah Konsultasi',
          icon: FileText,
          items: [
            'Pastikan mendapat resep obat (jika diperlukan)',
            'Tanyakan jadwal kontrol berikutnya',
            'Simpan hasil pemeriksaan dengan baik',
            'Ikuti anjuran dokter dengan disiplin',
            'Hubungi kami jika ada pertanyaan'
          ]
        }
      ];

  // Emergency info from hospital info or fallback
  const emergencyInfo = hospitalInfo ? {
    numbers: [
      { label: 'IGD 24 Jam', number: hospitalInfo.emergencyNumber || '119', description: 'Layanan gawat darurat' },
      { label: 'Ambulans', number: hospitalInfo.phone || '+62 21 5555-0119', description: 'Layanan ambulans darurat' },
      { label: 'Info Umum', number: hospitalInfo.phone || '+62 21 5555-0100', description: 'Informasi umum rumah sakit' },
      { label: 'WhatsApp', number: hospitalInfo.phone || '+62 812-3456-7890', description: 'Chat untuk informasi' }
    ],
    location: {
      address: hospitalInfo.address || 'Jl. Kesehatan Raya No. 123, Jakarta Selatan 12345',
      landmark: 'Dekat Mall Kesehatan, seberang Universitas Medika'
    }
  } : {
    numbers: [
      { label: 'IGD 24 Jam', number: '119', description: 'Layanan gawat darurat' },
      { label: 'Ambulans', number: '+62 21 5555-0119', description: 'Layanan ambulans darurat' },
      { label: 'Info Umum', number: '+62 21 5555-0100', description: 'Informasi umum rumah sakit' },
      { label: 'WhatsApp', number: '+62 812-3456-7890', description: 'Chat untuk informasi' }
    ],
    location: {
      address: 'Jl. Kesehatan Raya No. 123, Jakarta Selatan 12345',
      landmark: 'Dekat Mall Kesehatan, seberang Universitas Medika'
    }
  };

  if (loading) {
    return (
      <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat informasi pasien...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Gagal memuat informasi pasien</p>
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

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <Link href="/" className="text-teal-100 hover:text-white mr-4">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-5xl font-bold">Informasi Pasien</h1>
            </div>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Panduan lengkap untuk membantu Anda mendapatkan pelayanan terbaik di RS Medicare Prima
            </p>
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-red-50 rounded-xl">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Emergency</h3>
              <p className="text-red-600 text-2xl font-bold">119</p>
              <p className="text-sm text-gray-600">24 Jam Siaga</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Booking Online</h3>
              <p className="text-green-600 text-lg font-bold">24/7</p>
              <p className="text-sm text-gray-600">Tersedia Setiap Saat</p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Asuransi</h3>
              <p className="text-blue-600 text-lg font-bold">50+</p>
              <p className="text-sm text-gray-600">Partner Asuransi</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Dokter Spesialis</h3>
              <p className="text-purple-600 text-lg font-bold">120+</p>
              <p className="text-sm text-gray-600">Dokter Berpengalaman</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Panduan Pasien</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ikuti panduan berikut untuk mendapatkan pelayanan yang optimal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {guidelines.map((guide, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <guide.icon className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{guide.title}</h3>
                </div>
                
                <ul className="space-y-3">
                  {guide.items.map((item: string, itemIndex: number) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temukan jawaban atas pertanyaan yang sering diajukan
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {faqData.map((category) => (
              <div key={category.category} className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-teal-600" />
                  {category.category}
                </h3>
                
                <div className="space-y-3">
                  {category.questions.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">{faq.question}</span>
                        {openFaq === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      
                      {openFaq === faq.id && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Information */}
      <section className="py-12 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
              Informasi Darurat
            </h2>
            <p className="text-gray-600">Hubungi nomor berikut untuk situasi darurat</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4">Nomor Penting</h3>
              <div className="space-y-4">
                {emergencyInfo.numbers.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{contact.label}</div>
                      <div className="text-sm text-gray-600">{contact.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-teal-600">{contact.number}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4">Lokasi</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-teal-600 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Alamat</div>
                    <div className="text-gray-700">{emergencyInfo.location.address}</div>
                    <div className="text-sm text-gray-600 mt-1">{emergencyInfo.location.landmark}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documents Download */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dokumen & Formulir</h2>
            <p className="text-gray-600">Download panduan dan formulir yang diperlukan</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-red-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{doc.name}</div>
                      <div className="text-sm text-gray-600">{doc.type} • {doc.size}</div>
                    </div>
                  </div>
                  <button className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-semibold">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Masih Ada Pertanyaan?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Tim customer service kami siap membantu Anda 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Hubungi Kami</span>
            </button>
            <Link href="/contact">
              <button className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Live Chat</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
