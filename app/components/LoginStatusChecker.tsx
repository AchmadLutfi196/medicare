'use client';

import React, { useState, useEffect } from 'react';
import { usePrismaAuth } from '../../contexts/PrismaAuthContext';

export default function LoginStatusChecker() {
  const [localStorageUser, setLocalStorageUser] = useState<any>(null);
  const [memoryUser, setMemoryUser] = useState<any>(null);
  const { currentUser, logout } = usePrismaAuth();

  useEffect(() => {
    const checkLocalStorage = () => {
      try {
        const storedUser = localStorage.getItem('medicare_current_user');
        if (storedUser) {
          setLocalStorageUser(JSON.parse(storedUser));
        } else {
          setLocalStorageUser(null);
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        setLocalStorageUser(null);
      }
    };

    checkLocalStorage();
    setMemoryUser(currentUser);

    // Listen for storage events to detect changes
    const handleStorageChange = () => {
      checkLocalStorage();
      setMemoryUser(currentUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentUser]);

  const handleForceLogout = async () => {
    await logout();
    window.location.reload(); // Force page reload
  };

  const handleClearStorage = () => {
    localStorage.removeItem('medicare_current_user');
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50 max-w-md opacity-90 hover:opacity-100 transition-opacity">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Login Status Checker</h2>
      
      <div className="mb-3">
        <h3 className="text-sm font-medium text-gray-700">Auth Context State:</h3>
        {currentUser ? (
          <div className="text-xs bg-green-50 p-2 rounded border border-green-200">
            <p className="text-green-800">Logged in as: {currentUser.email}</p>
            <p className="text-green-800">Name: {currentUser.firstName} {currentUser.lastName}</p>
            <p className="text-green-800">Role: {currentUser.role}</p>
          </div>
        ) : (
          <p className="text-xs text-red-600">Not logged in (context)</p>
        )}
      </div>
      
      <div className="mb-3">
        <h3 className="text-sm font-medium text-gray-700">LocalStorage State:</h3>
        {localStorageUser ? (
          <div className="text-xs bg-blue-50 p-2 rounded border border-blue-200">
            <p className="text-blue-800">Stored user: {localStorageUser.email}</p>
            <p className="text-blue-800">Name: {localStorageUser.firstName} {localStorageUser.lastName}</p>
            <p className="text-blue-800">Role: {localStorageUser.role}</p>
          </div>
        ) : (
          <p className="text-xs text-red-600">No user in localStorage</p>
        )}
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={handleForceLogout}
          className="text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
        >
          Force Logout
        </button>
        <button
          onClick={handleClearStorage}
          className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded"
        >
          Clear Storage
        </button>
        <button
          onClick={() => window.location.reload()}
          className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
