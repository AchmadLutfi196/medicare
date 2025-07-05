'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  Heart
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Dokter', href: '/admin/doctors', icon: Users },
    { name: 'Booking', href: '/admin/bookings', icon: Calendar },
    { name: 'Artikel', href: '/admin/articles', icon: FileText },
    { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex lg:flex-col`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700/50 flex-shrink-0">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"></div>
            </div>
            <div>
              <span className="text-xl font-bold text-white">Medicare</span>
              <p className="text-sm text-slate-300 -mt-1">Admin Panel</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="px-6 py-6 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">A</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">Admin User</h3>
              <p className="text-slate-300 text-sm">Super Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className={`p-2 rounded-lg mr-3 transition-all duration-200 ${
                  active 
                    ? 'bg-white/20' 
                    : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium">{item.name}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-700/50 space-y-4 flex-shrink-0">
          {/* Quick Stats */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
            <div className="text-slate-300 text-xs font-medium mb-2">Status Sistem</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">Online</span>
              </div>
              <span className="text-slate-400 text-xs">99.9% uptime</span>
            </div>
          </div>

          {/* Logout Button */}
          <Link 
            href="/login"
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 rounded-xl hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-slate-700/30 transition-all duration-200 group"
          >
            <div className="p-2 rounded-lg mr-3 bg-slate-700/50 group-hover:bg-red-500/20 transition-all duration-200">
              <LogOut className="h-5 w-5" />
            </div>
            <span>Logout</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top bar */}
        <div className="flex-shrink-0 flex h-20 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-6 border-r border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 lg:hidden transition-colors duration-200"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-6 flex justify-between items-center">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full max-w-lg">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search-field"
                    className="block w-full h-12 pl-10 pr-4 py-3 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50/50 rounded-xl transition-all duration-200"
                    placeholder="Cari pasien, dokter, atau booking..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            <div className="ml-6 flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="relative bg-gray-50 p-3 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200">
                  <Bell className="h-5 w-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-white"></div>
                </button>
              </div>

              {/* User Profile */}
              <div className="relative flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2 hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">Super Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
