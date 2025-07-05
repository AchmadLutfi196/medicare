'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/database';

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
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function PrismaAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for logged in user on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if we're on a login/register page by examining the URL
        const isAuthPage = window.location.pathname === '/login' || 
                          window.location.pathname === '/register';
        
        if (isAuthPage) {
          // If on login/register page, clear any existing user data
          setCurrentUser(null);
          localStorage.removeItem('medicare_current_user');
        } else {
          // Otherwise, attempt to restore user from localStorage
          const storedUser = localStorage.getItem('medicare_current_user');
          if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
          }
        }
        
        // Optional: Call the auth status API to validate session
        try {
          const statusResponse = await fetch('/api/auth/status', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          // If API says not authenticated, clear local state
          if (statusResponse.ok) {
            const statusResult = await statusResponse.json();
            if (statusResult.success && !statusResult.authenticated) {
              // If server says we're not authenticated but we have local user data,
              // we should clear it to be consistent
              if (localStorage.getItem('medicare_current_user')) {
                console.log('Server reports not authenticated, clearing local state');
                setCurrentUser(null);
                localStorage.removeItem('medicare_current_user');
              }
            }
          }
        } catch (apiError) {
          console.error('Error checking auth status with API:', apiError);
          // Non-critical error, continue with local auth state
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // If there's any error, clear state to be safe
        setCurrentUser(null);
        localStorage.removeItem('medicare_current_user');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    // Always clear any existing user data before attempting login
    setCurrentUser(null);
    localStorage.removeItem('medicare_current_user');
    
    try {
      console.log('Login attempt for:', email);

      // Try the direct login endpoint first (uses raw SQL)
      try {
        console.log('Attempting direct login');
        // Make sure email is trimmed to avoid whitespace issues
        const trimmedEmail = email.trim().toLowerCase(); // Ensure lowercase for case-insensitive matching
        const directResponse = await fetch('/api/auth/direct-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: trimmedEmail, password }),
          // Prevent caching
          cache: 'no-store',
        });

        console.log('Direct login status:', directResponse.status);
        
        // Check if we got a valid response
        const contentType = directResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Server returned non-JSON response for direct login:', contentType);
          console.error('Status:', directResponse.status);
          
          try {
            const textResponse = await directResponse.text();
            console.error('Response text (first 500 chars):', textResponse.substring(0, 500));
          } catch (e) {
            console.error('Could not get response text:', e);
          }
        } else {
          const directResult = await directResponse.json();
          console.log('Direct login response:', { success: directResult.success });
          
          // Only set the current user if login was successful
          if (directResult.success && directResult.data) {
            console.log('Login successful, setting current user');
            setCurrentUser(directResult.data);
            
            // Store user in localStorage for persistence
            localStorage.setItem('medicare_current_user', JSON.stringify(directResult.data));
            
            // Also store user in a cookie for middleware/SSR
            try {
              // Set cookie with basic user info (avoid storing full user data in cookie)
              document.cookie = `medicare_user=${directResult.data.id}; path=/; max-age=86400; SameSite=Strict`;
            } catch (cookieError) {
              console.error('Error setting cookie:', cookieError);
            }
            
            // Dispatch storage event to force other components to refresh
            window.dispatchEvent(new Event('storage'));
            
            return directResult;
          }
          
          // If we got a response but not successful, ensure user data is cleared
          if (!directResult.success) {
            console.log('Login failed, ensuring user data is cleared');
            setCurrentUser(null);
            localStorage.removeItem('medicare_current_user');
            
            // Dispatch storage event to force other components to refresh
            window.dispatchEvent(new Event('storage'));
          }
          
          return directResult;
        }
      } catch (directError) {
        console.error('Error with direct login attempt:', directError);
      }
      
      // Fall back to the standard login endpoint if direct login failed
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Standard login status:', response.status);
      
      // Check for non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Server returned non-JSON response for login:', contentType);
        console.error('Status:', response.status);
        
        try {
          const textResponse = await response.text();
          console.error('Response text (first 500 chars):', textResponse.substring(0, 500));
        } catch (e) {
          console.error('Could not get response text:', e);
        }
        
        return {
          success: false,
          error: 'Server error. Please try again later.',
        };
      }

      const result = await response.json();
      console.log('Login response:', { success: result.success });

      if (result.success && result.data) {
        console.log('Standard login successful, setting current user');
        setCurrentUser(result.data);
        // Store user in localStorage for persistence
        localStorage.setItem('medicare_current_user', JSON.stringify(result.data));
      } else {
        console.log('Standard login failed, clearing any existing user data');
        setCurrentUser(null);
        localStorage.removeItem('medicare_current_user');
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An error occurred during login',
      };
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      console.log('Sending registration request with data:', {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName
      });
      
      // More detailed logging for debugging
      console.log('Registration data details:', {
        hasEmail: !!userData.email,
        hasPassword: !!userData.password,
        hasFirstName: !!userData.firstName,
        hasLastName: !!userData.lastName,
        hasPhone: !!userData.phone,
        gender: userData.gender || 'not provided',
        dateOfBirth: userData.dateOfBirth || 'not provided',
        hasAddress: !!userData.address
      });
      
      // Use the direct registration endpoint that uses raw SQL queries
      // This bypasses Prisma client issues with schema sync
      console.log('Using direct registration endpoint with raw SQL');
      try {
        const directResponse = await fetch('/api/auth/direct-register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        
        console.log('Direct registration status:', directResponse.status);
        
        // Check for non-JSON responses (like HTML error pages)
        const contentType = directResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Server returned non-JSON response for direct registration:', contentType);
          
          try {
            const textResponse = await directResponse.text();
            console.error('Response text (first 500 chars):', textResponse.substring(0, 500));
            return {
              success: false,
              error: `Server error (${directResponse.status}): Non-JSON response`
            };
          } catch (e) {
            console.error('Could not get response text:', e);
          }
        }
        
        const directResult = await directResponse.json();
        console.log('Direct registration response:', directResult);
        
        if (directResult.success) {
          // Store user in localStorage for persistence if registration is successful
          if (directResult.data) {
            setCurrentUser(directResult.data);
            localStorage.setItem('medicare_current_user', JSON.stringify(directResult.data));
          }
          return directResult;
        }
        
        // If we got a response but it wasn't successful, return it with the error
        if (directResult.error) {
          return directResult;
        }
      } catch (directError) {
        console.error('Error with direct registration attempt:', directError);
        return {
          success: false,
          error: `Registration error: ${directError instanceof Error ? directError.message : 'Unknown error'}`
        };
      }
      
      // Return a general error if the direct registration failed
      return {
        success: false,
        error: 'Registration failed. Please try again later.'
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error instanceof Error 
          ? `Registration error: ${error.message}`
          : 'An unexpected error occurred during registration',
      };
    }
  };

  // Logout function
  const logout = async () => {
    console.log('Logging out user');
    
    // Clear user state in context immediately
    setCurrentUser(null);
    
    // Clear from local storage and cookies
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem('medicare_current_user');
      
      // Clear cookie
      document.cookie = 'medicare_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
      
      console.log('Cleared user data from localStorage and cookies');
    }
    
    // Call the API endpoint to invalidate server-side session if needed
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      console.log('Logout API called successfully');
    } catch (error) {
      console.error('Error during logout API call:', error);
      // We still consider logout successful even if the API call fails
      // because we've already removed the user from local storage
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function usePrismaAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('usePrismaAuth must be used within an PrismaAuthProvider');
  }
  return context;
}
