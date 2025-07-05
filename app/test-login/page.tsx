'use client';

import React, { useEffect, useState } from 'react';
import { usePrismaAuth } from '../../contexts/PrismaAuthContext';

export default function TestLoginPage() {
  const { currentUser, login, logout } = usePrismaAuth();
  const [localStorageUser, setLocalStorageUser] = useState<any>(null);
  const [testEmail, setTestEmail] = useState('dosen@gmail.com');
  const [testPassword, setTestPassword] = useState('123456');
  const [loginResult, setLoginResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('medicare_current_user');
      if (storedUser) {
        try {
          setLocalStorageUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
    }
  }, []);

  const handleManualLogin = async () => {
    setIsLoading(true);
    try {
      console.log(`Testing login with email: ${testEmail}, password: ${testPassword}`);
      const normalizedEmail = testEmail.trim().toLowerCase();
      
      // Force logout first to ensure clean state
      await logout();
      
      // First check with debug endpoint
      try {
        const debugResponse = await fetch('/api/auth/debug-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: normalizedEmail, password: testPassword })
        });
        
        if (debugResponse.ok) {
          const debugResult = await debugResponse.json();
          console.log('Debug endpoint result:', debugResult);
          
          // Show debug info in UI
          if (debugResult.debug) {
            setLoginResult({
              debugInfo: debugResult.debug,
              isDebugMode: true
            });
          }
        }
      } catch (debugError) {
        console.error('Debug endpoint error:', debugError);
      }
      
      // Now attempt actual login
      const result = await login(normalizedEmail, testPassword);
      setLoginResult({
        ...result,
        isDebugMode: false
      });
      
      // Update localStorage check
      const storedUser = localStorage.getItem('medicare_current_user');
      if (storedUser) {
        setLocalStorageUser(JSON.parse(storedUser));
      } else {
        setLocalStorageUser(null);
      }
      
      console.log('Login result:', result);
    } catch (error) {
      console.error('Error during login test:', error);
      setLoginResult({ success: false, error: String(error), isDebugMode: false });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocalStorageUser(null);
    setLoginResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Login Test Tool</h1>
        
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Auth Context State:</h2>
            {currentUser ? (
              <div>
                <p className="font-medium text-green-700">Logged in as: {currentUser.email}</p>
                <div className="mt-4 text-gray-700 space-y-1">
                  <p>Name: {currentUser.firstName} {currentUser.lastName}</p>
                  <p>Role: {currentUser.role}</p>
                  <p>ID: {currentUser.id}</p>
                </div>
              </div>
            ) : (
              <p className="text-red-500">Not logged in (currentUser is null)</p>
            )}
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">LocalStorage State:</h2>
            {localStorageUser ? (
              <div>
                <p className="font-medium text-green-700">Stored user: {localStorageUser.email}</p>
                <div className="mt-4 text-gray-700 space-y-1">
                  <p>Name: {localStorageUser.firstName} {localStorageUser.lastName}</p>
                  <p>Role: {localStorageUser.role}</p>
                  <p>ID: {localStorageUser.id}</p>
                </div>
              </div>
            ) : (
              <p className="text-red-500">No user in localStorage</p>
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Login</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input 
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input 
                type="text"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleManualLogin}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isLoading ? 'Testing...' : 'Test Login'}
            </button>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Force Logout
            </button>
          </div>
          
          {loginResult && (
            <div className={`mt-4 p-4 rounded ${loginResult.isDebugMode ? 'bg-yellow-100' : (loginResult.success ? 'bg-green-100' : 'bg-red-100')}`}>
              {loginResult.isDebugMode && loginResult.debugInfo ? (
                <div>
                  <h3 className="font-medium">Debug Information</h3>
                  <div className="mt-2 text-xs font-mono bg-gray-800 text-white p-3 rounded overflow-auto">
                    <p>User Found: {loginResult.debugInfo.userFound ? 'Yes' : 'No'}</p>
                    {loginResult.debugInfo.userFound && (
                      <>
                        <p>User ID: {loginResult.debugInfo.id}</p>
                        <p>Email: {loginResult.debugInfo.email}</p>
                        <p>Stored Password: {loginResult.debugInfo.storedPassword}</p>
                        <p>Entered Password: {loginResult.debugInfo.enteredPassword}</p>
                        <p>Match: {loginResult.debugInfo.passwordsMatch ? 'YES' : 'NO'}</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-medium">{loginResult.success ? 'Login Success' : 'Login Failed'}</h3>
                  {loginResult.success ? (
                    <div className="mt-2">
                      <p>Logged in as: {loginResult.data?.email}</p>
                      <p>Name: {loginResult.data?.firstName} {loginResult.data?.lastName}</p>
                      <p>Role: {loginResult.data?.role}</p>
                    </div>
                  ) : (
                    <p className="text-red-600">{loginResult.error || 'Unknown error'}</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Technical Notes</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>This page directly tests the login function without redirects</li>
            <li>Login with dosen@gmail.com and 123456 should work based on database</li>
            <li>The test runs the same login function used by the login page</li>
            <li>Force Logout clears both context state and localStorage</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
