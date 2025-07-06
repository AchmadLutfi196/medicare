'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Calendar,
  Award,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { doctorApi } from '../../../hooks/useDoctors';
import { Doctor } from '../../../types/database';

// Mock data untuk backup
const dummyDoctors = [
  {
    id: '1',
    name: 'Dr. Ahmad Wijaya, Sp.JP',
    specialty: 'Kardiologi',
    phone: '+62 813-2345-6789',
    email: 'ahmad.wijaya@medicare.com',
    experience: '15 tahun',
    patients: 1250,
    rating: 4.9,
    status: 'Active',
    schedule: 'Senin - Jumat'
  },
  {
    id: '2',
    name: 'Dr. Siti Nurhaliza, Sp.A',
    specialty: 'Anak',
    phone: '+62 813-2345-6790',
    email: 'siti.nurhaliza@medicare.com',
    experience: '12 tahun',
    patients: 980,
    rating: 4.8,
    status: 'Active',
    schedule: 'Senin - Sabtu'
  },
  {
    id: '3',
    name: 'Dr. Lisa Maharani, Sp.M',
    specialty: 'Mata',
    phone: '+62 813-2345-6791',
    email: 'lisa.maharani@medicare.com',
    experience: '8 tahun',
    patients: 650,
    rating: 4.7,
    status: 'Active',
    schedule: 'Selasa - Sabtu'
  },
  {
    id: '4',
    name: 'Dr. Rudi Hermawan, Sp.PD',
    specialty: 'Penyakit Dalam',
    phone: '+62 813-2345-6792',
    email: 'rudi.hermawan@medicare.com',
    experience: '20 tahun',
    patients: 1580,
    rating: 4.9,
    status: 'Active',
    schedule: 'Senin - Jumat'
  }
];

const DoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    phone: '',
    email: '',
    experience: '',
    status: 'Active',
    schedule: ''
  });
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch doctors data
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const result = await doctorApi.getAll();
      
      if (result.success && result.data && result.data.length > 0) {
        setDoctors(result.data);
        setError(null);
        console.log('Data dokter berhasil dimuat dari API');
      } else {
        // Fallback ke dummy data jika API tidak berhasil atau tidak ada data
        console.log('API tidak mengembalikan data: ', result.error || 'Tidak ada data');
        
        // Jika kita sudah memiliki data lokal, pertahankan
        if (doctors.length > 0 && !doctors.some(d => d.id.toString().startsWith('temp-'))) {
          console.log('Mempertahankan data yang sudah ada');
        } else {
          console.log('Menggunakan data dummy dokter');
          setDoctors(dummyDoctors);
        }
        
        setError(result.error || 'Tidak ada data dokter ditemukan');
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      
      // Jika kita sudah memiliki data lokal, pertahankan
      if (doctors.length > 0) {
        console.log('Mempertahankan data yang sudah ada');
      } else {
        console.log('Menggunakan data dummy dokter');
        setDoctors(dummyDoctors);
      }
      
      setError('Gagal terhubung ke server. Menggunakan data lokal.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const specialties = ['Semua', 'Kardiologi', 'Anak', 'Mata', 'Penyakit Dalam', 'Bedah', 'Orthopedi'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doctor.specialty && doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = filterSpecialty === '' || filterSpecialty === 'Semua' || 
                            (doctor.specialty && doctor.specialty === filterSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const handleAddClick = () => {
    setCurrentDoctor(null);
    setFormData({
      name: '',
      specialty: '',
      phone: '',
      email: '',
      experience: '',
      status: 'Active',
      schedule: ''
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (doctor: any) => {
    setCurrentDoctor(doctor);
    setFormData({
      name: doctor.name || '',
      specialty: doctor.specialty || '',
      phone: doctor.phone || '',
      email: doctor.email || '',
      experience: doctor.experience || '',
      status: doctor.status || 'Active',
      schedule: doctor.schedule || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (doctor: any) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${doctor.name}?`)) {
      try {
        setLoading(true);
        
        // Check if doctor ID is a temporary ID (local only)
        const isTemporaryDoctor = doctor.id.toString().startsWith('temp-');
        
        if (!isTemporaryDoctor) {
          try {
            const result = await doctorApi.delete(doctor.id);
            
            if (result.success) {
              alert('Dokter berhasil dihapus');
              fetchDoctors();
            } else {
              console.error("API Error deleting doctor:", result.error);
              // Fallback jika API gagal
              setDoctors(prev => prev.filter(d => d.id !== doctor.id));
              alert('Dokter berhasil dihapus di antarmuka (mode offline)');
            }
          } catch (apiErr) {
            console.error("API call exception on delete:", apiErr);
            // Fallback jika exception pada API
            setDoctors(prev => prev.filter(d => d.id !== doctor.id));
            alert('Dokter berhasil dihapus di antarmuka (mode offline)');
          }
        } else {
          // Jika dokter hanya ada di data lokal
          setDoctors(prev => prev.filter(d => d.id !== doctor.id));
          alert('Dokter berhasil dihapus dari data sementara');
        }
      } catch (err) {
        console.error('Error in delete handler:', err);
        alert('Gagal menghapus dokter - terjadi kesalahan tidak terduga');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Convert schedule from string to object format
      // Parse schedule string like "Senin - Jumat" to appropriate format
      const scheduleObj: {[key: string]: string[]} = {};
      const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
      
      // Default times
      const defaultTimes = ['08:00-12:00', '13:00-17:00'];
      
      // Try to parse the schedule text
      const scheduleText = formData.schedule.toLowerCase();
      days.forEach(day => {
        if (scheduleText.includes(day.toLowerCase())) {
          scheduleObj[day] = defaultTimes;
        }
      });
      
      // Prepare doctor data with the correct schedule format
      const doctorData = {
        name: formData.name,
        specialty: formData.specialty,
        phone: formData.phone || '',
        email: formData.email,
        experience: formData.experience,
        bio: currentDoctor?.bio || '',
        rating: currentDoctor?.rating || 0,
        reviewCount: currentDoctor?.reviewCount || 0,
        consultationTypes: ['offline' as 'offline' | 'online' | 'emergency'],
        isAvailable: true,
        schedule: scheduleObj
      };
      
      try {
        if (currentDoctor) {
          // Update existing doctor
          const result = await doctorApi.update(currentDoctor.id, doctorData);
          
          if (result.success) {
            alert('Dokter berhasil diperbarui');
          } else {
            console.error("API Error updating doctor:", result.error);
            // Fallback jika API gagal - update hanya di UI
            alert(`Dokter berhasil diperbarui di antarmuka (mode offline)`);
            setDoctors(prev => 
              prev.map(d => d.id === currentDoctor.id ? {...d, ...doctorData, schedule: formData.schedule} : d)
            );
          }
        } else {
          // Create new doctor
          const result = await doctorApi.create({
            ...doctorData,
            profileImage: '',
            languages: ['Indonesia', 'English'],
            education: ['Universitas Indonesia'],
            certifications: [],
            price: '100000'
          } as any);
          
          if (result.success && result.data) {
            alert('Dokter berhasil ditambahkan');
          } else {
            console.error("API Error creating doctor:", result.error);
            // Fallback jika API gagal - tambahkan hanya di UI
            const newDoctor = {
              ...doctorData,
              id: `temp-${Date.now()}`,
              patients: 0,
              schedule: formData.schedule // Gunakan format string untuk tampilan
            };
            setDoctors(prev => [...prev, newDoctor]);
            alert(`Dokter berhasil ditambahkan di antarmuka (mode offline)`);
          }
        }
      } catch (apiError) {
        console.error("API call exception:", apiError);
        // Fallback jika ada exception saat memanggil API
        if (currentDoctor) {
          // Update local data
          setDoctors(prev => 
            prev.map(d => d.id === currentDoctor.id ? {...d, ...doctorData, schedule: formData.schedule} : d)
          );
          alert(`Dokter berhasil diperbarui di antarmuka (mode offline)`);
        } else {
          // Create local data
          const newDoctor = {
            ...doctorData,
            id: `temp-${Date.now()}`,
            patients: 0,
            schedule: formData.schedule // Gunakan format string untuk tampilan
          };
          setDoctors(prev => [...prev, newDoctor]);
          alert(`Dokter berhasil ditambahkan di antarmuka (mode offline)`);
        }
      }
      
      setIsModalOpen(false);
      fetchDoctors();
    } catch (err) {
      console.error('Error saving doctor:', err);
      alert(`Gagal ${currentDoctor ? 'memperbarui' : 'menambahkan'} dokter`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Tampilkan modal form
  const renderModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              {currentDoctor ? 'Edit Dokter' : 'Tambah Dokter Baru'}
            </h2>
            
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Dokter</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Spesialisasi</label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Pilih Spesialisasi</option>
                    {specialties.filter(s => s !== 'Semua').map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pengalaman</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Jadwal</label>
                  <input
                    type="text"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-teal-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      <span>Menyimpan...</span>
                    </div>
                  ) : (
                    'Simpan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Error alert */}
      {error && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-amber-500 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800">Perhatian</p>
              <p className="text-amber-700 text-sm">{error}</p>
              {error.includes('server') && (
                <p className="text-amber-600 text-xs mt-1">
                  Aplikasi berjalan dalam mode offline dengan data sampel.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Dokter</h1>
          <p className="text-gray-600">Kelola data dokter dan spesialis</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Dokter</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Dokter</p>
              <p className="text-2xl font-bold text-gray-900">{doctors.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Spesialis</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Jadwal Aktif</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Pasien</p>
              <p className="text-2xl font-bold text-gray-900">4,460</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari dokter..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
            >
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Loader2 className="animate-spin w-12 h-12 mx-auto text-teal-600 mb-4" />
          <p className="text-gray-600">Memuat data dokter...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && doctors.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-red-600 mb-4" />
          <p className="text-gray-800 font-medium">Gagal memuat data</p>
          <p className="text-gray-600 mt-2">{error}</p>
          <button 
            onClick={fetchDoctors}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Coba Lagi
          </button>
        </div>
      )}
      
      {/* Warning if using dummy data */}
      {error && !loading && doctors.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
            <div>
              <p className="text-sm text-yellow-600">{error}</p>
              <button 
                onClick={fetchDoctors}
                className="mt-2 text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Mode Warning if needed */}
      {doctors.some(d => d.id.toString().startsWith('temp-')) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
            <div>
              <p className="font-medium text-yellow-700">Aplikasi berjalan dalam mode offline</p>
              <p className="text-sm text-yellow-600">Beberapa perubahan hanya tersimpan sementara dan akan hilang jika halaman dimuat ulang. Hubungi administrator sistem untuk memperbaiki koneksi ke API.</p>
            </div>
          </div>
        </div>
      )}

      {/* Doctors Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dokter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pengalaman
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pasien
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jadwal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
                            <span className="text-teal-600 font-medium text-sm">
                              {doctor.name.split(' ')[1]?.charAt(0) || doctor.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                            <div className="text-sm text-gray-500">{doctor.specialty}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.phone}</div>
                        <div className="text-sm text-gray-500">{doctor.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doctor.experience}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(doctor.patients || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{doctor.rating || 0}</span>
                          <span className="ml-1 text-yellow-400">★</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {typeof doctor.schedule === 'string' ? doctor.schedule : 'Belum diatur'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            className="text-teal-600 hover:text-teal-900" 
                            title="Lihat detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-blue-600 hover:text-blue-900" 
                            onClick={() => handleEditClick(doctor)}
                            title="Edit dokter"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900" 
                            onClick={() => handleDeleteClick(doctor)}
                            title="Hapus dokter"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      Tidak ada dokter yang ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Form modal */}
      {renderModal()}
    </div>
  );
};

export default DoctorsPage;
