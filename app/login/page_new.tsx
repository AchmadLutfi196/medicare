'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  User,
  Stethoscope,
  CheckCircle
} from 'lucide-react';
import { usePrismaAuth } from '../../contexts/PrismaAuthContext';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const router = useRouter();
  const { login, logout, loading: authLoading } = usePrismaAuth();

  // Check if user just registered and reset login state on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Always logout when on login page to ensure navbar state is consistent
      const clearAuthState = async () => {
        console.log('Login page: Clearing auth state');
        // This will clear both the context state and local storage
        await logout();
        
        // Force any components using localStorage to update by dispatching a storage event
        window.dispatchEvent(new Event('storage'));
        
        // Double-check that localStorage is really cleared
        if (localStorage.getItem('medicare_current_user')) {
          console.warn('Login page: Found unexpected user data, clearing again');
          localStorage.removeItem('medicare_current_user');
          window.dispatchEvent(new Event('storage'));
        }
      };
      
      clearAuthState();
      
      // Check for registration success parameter
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('registered') === 'true') {
        setShowSuccessMessage(true);
        // Remove the parameter from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
      
      // If there's a logout parameter, show a message
      if (urlParams.get('logout') === 'true') {
        Swal.fire({
          title: 'Logout Berhasil',
          text: 'Anda telah berhasil keluar dari sistem.',
          icon: 'success',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });
        // Remove the parameter from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Normalize email: trim whitespace and convert to lowercase
      const normalizedEmail = email.trim().toLowerCase();
      console.log('Attempting login with normalized email:', normalizedEmail);
      
      // Log details for debugging
      console.log(`Email: "${normalizedEmail}", Password: "${password}" (length: ${password.length})`);
      
      // Force logout before attempting login to ensure clean state
      await logout();
      
      // Now attempt login with clean state
      console.log('Calling login function with normalized email and password');
      const result = await login(normalizedEmail, password);
      console.log('Login result:', result);

      if (result.success && result.data) {
        console.log('Login successful, user data:', {
          id: result.data.id,
          email: result.data.email,
          role: result.data.role,
          firstName: result.data.firstName
        });
        
        // Show success alert
        await Swal.fire({
          title: 'Login Berhasil!',
          text: `Selamat datang, ${result.data.firstName}!`,
          icon: 'success',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });
        
        // Check user role and redirect accordingly
        if (result.data.role === 'ADMIN' || result.data.role === 'STAFF') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        console.error('Login failed:', result.error);
        
        // Determine the appropriate error message
        let errorMessage = 'Email atau password salah. Pastikan Anda mengetikkan email dan password dengan benar.';
        
        if (result.error?.includes('belum memiliki password')) {
          errorMessage = result.error;
        } else if (result.error?.includes('Database error')) {
          errorMessage = 'Terjadi kesalahan pada sistem. Tim kami sedang memperbaikinya.';
        }
        
        setError(errorMessage);
        
        // Show error alert
        Swal.fire({
          title: 'Login Gagal',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Coba Lagi'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan saat login. Silakan coba lagi.');
      
      // Show error alert for exceptions
      Swal.fire({
        title: 'Terjadi Kesalahan',
        text: 'Tidak dapat melakukan login. Silahkan coba lagi nanti.',
        icon: 'error',
        confirmButtonText: 'Tutup'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-3 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">RS Medicare Prima</h1>
              <p className="text-sm text-gray-600">Sistem Informasi Rumah Sakit</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Masuk</h2>
            <p className="text-gray-600">Silakan masuk ke akun Anda</p>
          </div>

          {showSuccessMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800 text-sm font-medium">
                  Pendaftaran berhasil! Silakan masuk dengan akun yang baru Anda buat.
                </p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start space-x-2">
                <div className="text-red-600 text-sm">
                  <p className="font-medium">Login gagal</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => setEmail(e.target.value.trim())}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan email Anda"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan password Anda"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Ingat saya
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-500 font-medium">
                Lupa password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Memproses...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Masuk</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </button>
          </form>

          {/* Login Tips */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-3">Informasi Login:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="h-3 w-3" />
                <span>Gunakan email dan password yang sudah Anda daftarkan</span>
              </div>
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-3 w-3" />
                <span>Hubungi admin jika Anda kesulitan masuk ke akun</span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="font-medium mb-1">Akun Demo:</p>
                <p>Admin: admin@medicare.com / admin123</p>
                <p>Pasien: patient@example.com / patient123</p>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link href="/register" className="font-medium text-teal-600 hover:text-teal-500">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Akses Cepat</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/booking" 
              className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 group"
            >
              <div className="bg-blue-500 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Booking Online</span>
            </Link>
            <Link 
              href="/patient-info" 
              className="flex flex-col items-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 group"
            >
              <div className="bg-emerald-500 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Info Pasien</span>
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
