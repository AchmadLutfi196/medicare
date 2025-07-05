'use client';

import React, { useEffect, useState } from 'react';
import { usePrismaAuth } from '../../contexts/PrismaAuthContext';
import { useRouter } from 'next/navigation';

export default function CheckLogin() {
  const { currentUser, logout } = usePrismaAuth();
  const router = useRouter();
  const [storageUser, setStorageUser] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('medicare_current_user');
      setStorageUser(userData);
      
      if (!userData && !currentUser) {
        // If no user is logged in, redirect to login
        router.push('/login');
      }
    }
  }, [currentUser, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login?logout=true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-teal-700">Status Login</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Auth Context:</h2>
          {currentUser ? (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="font-medium text-green-800">Anda telah login!</p>
              <p className="text-green-700">Email: {currentUser.email}</p>
              <p className="text-green-700">Nama: {currentUser.firstName} {currentUser.lastName}</p>
              <p className="text-green-700">Role: {currentUser.role}</p>
            </div>
          ) : (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="font-medium text-red-800">Tidak ada user yang login (di context)</p>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Local Storage:</h2>
          {storageUser ? (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="font-medium text-blue-800">Data user ditemukan di local storage</p>
              <p className="text-blue-700 break-all text-xs mt-2">
                {storageUser}
              </p>
            </div>
          ) : (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="font-medium text-red-800">Tidak ada data user di local storage</p>
            </div>
          )}
        </div>
        
        <div className="flex space-x-4">
          {currentUser ? (
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Login
            </button>
          )}
          
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
