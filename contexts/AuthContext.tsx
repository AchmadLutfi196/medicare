'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/database';

// NOTICE: This context is being deprecated in favor of PrismaAuthContext
// This file remains to prevent breaking existing code during transition

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; data?: User }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string; data?: User }>;
  logout: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      // Redirecting to Prisma-based API endpoint
      const response = await fetch('/api/auth/prisma-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      
      if (result.success) {
        setCurrentUser(result.data);
        localStorage.setItem('medicare_current_user', JSON.stringify(result.data));
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      // Redirecting to Prisma-based API endpoint
      const response = await fetch('/api/auth/prisma-route/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          role: 'patient'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setCurrentUser(result.data);
        localStorage.setItem('medicare_current_user', JSON.stringify(result.data));
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  };

  const logout = async () => {
    try {
      setCurrentUser(null);
      localStorage.removeItem('medicare_current_user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    // Check localStorage for user data
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('medicare_current_user');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setCurrentUser(null);
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
    
    // Return empty unsubscribe function to maintain compatibility
    return () => {};
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
