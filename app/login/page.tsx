'use client';

import React, { useState } from 'react';
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
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const router = useRouter();
  const { login, logout, loading: authLoading } = usePrismaAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Always logout when on login page to ensure navbar state is consistent
      const clearAuthState = async () => {
        console.log('Login page: Clearing auth state');
        // This will clear both the context state and local storage
        await logout();
        
        // Force any components using localStorage to update
        window.dispatchEvent(new Event('storage'));
        
        // Double-check that localStorage is really cleared
        if (localStorage.getItem('medicare_current_user')) {
          console.warn('Login page: Found unexpected user data, clearing again');
          localStorage.removeItem('medicare_current_user');
          window.dispatchEvent(new Event('storage'));
        }
      };
      
      clearAuthState();

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('registered') === 'true') {
        setShowSuccessMessage(true);
        // Remove the parameter from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
      
      // If there's a logout parameter, show a message
      if (urlParams.get('logout') === 'true') {
        // Remove the parameter from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [logout]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Normalize email: trim whitespace and convert to lowercase
      const normalizedEmail = email.trim().toLowerCase();
      console.log('Attempting login with normalized email:', normalizedEmail);
      
      // Force logout before attempting login to ensure clean state
      await logout();
      
      // Now attempt login with clean state
      const result = await login(normalizedEmail, password);

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
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-xl">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h2>
          <p className="text-gray-600">Masuk ke akun RS Medicare Prima Anda</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
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
              <p className="text-red-600 text-sm font-medium">{error}</p>
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
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="Masukkan email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => setEmail(e.target.value.trim())}
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
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Ingat saya
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors">
                Lupa password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Masuk</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>

            {/* Quick Access Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">Akses Cepat:</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('patient@example.com');
                    setPassword('patient123');
                  }}
                  className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Pasien</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@medicare.com');
                    setPassword('admin123');
                  }}
                  className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Stethoscope className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Admin</span>
                </button>
              </div>
            </div>
          </form>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link href="/register" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
              Daftar sekarang
            </Link>
          </p>
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
