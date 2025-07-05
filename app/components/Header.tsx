'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Phone, 
  Heart,
  Calendar,
  Users,
  Clock,
  FileText,
  MapPin,
  MessageSquare,
  LogIn,
  UserPlus,
  Stethoscope
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Beranda', href: '/', icon: Heart },
    { name: 'Profil', href: '/profile', icon: Users },
    { name: 'Dokter', href: '/doctors', icon: Stethoscope },
    { name: 'Jadwal', href: '/schedule', icon: Clock },
    { name: 'Booking', href: '/booking', icon: Calendar },
    { name: 'Testimoni', href: '/testimonials', icon: MessageSquare },
    { name: 'Info Pasien', href: '/patient-info', icon: FileText },
    { name: 'Kontak', href: '/contact', icon: MapPin },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 sm:space-x-4 hover:opacity-95 transition-opacity group mr-4 sm:mr-8 lg:mr-16">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 via-cyan-400 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl group-hover:scale-105 transition-transform duration-200">
                <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="currentColor" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Medicare 
                  <span className="text-teal-600 ml-1">Prima</span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium -mt-1">Rumah Sakit Terpercaya</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 flex-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-teal-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 ml-auto">
            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/login">
                <button className="flex items-center space-x-2 px-3 lg:px-4 py-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg font-semibold transition-all duration-200 border border-teal-200 hover:border-teal-300">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden lg:inline">Masuk</span>
                </button>
              </Link>
              <Link href="/register">
                <button className="flex items-center space-x-2 px-3 lg:px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden lg:inline">Daftar</span>
                </button>
              </Link>
            </div>

            {/* Emergency Number - Desktop */}
            <div className="hidden xl:flex items-center space-x-3 ml-3 pl-3 border-l border-gray-200">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600 font-medium">Darurat:</span>
              </div>
              <Link href="tel:119">
                <button className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                  <Phone className="w-4 h-4" />
                  <span>119</span>
                </button>
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-1 lg:hidden">
              {/* Mobile Auth Buttons */}
              <div className="hidden sm:flex md:hidden items-center space-x-1">
                <Link href="/login">
                  <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200">
                    <LogIn className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/register">
                  <button className="p-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-lg transition-all duration-200 shadow-md">
                    <UserPlus className="w-5 h-5" />
                  </button>
                </Link>
              </div>

              {/* Mobile Emergency Button */}
              <Link href="tel:119">
                <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 sm:p-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-5 w-5" />
                ) : (
                  <Menu className="block h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="absolute top-full left-0 right-0 bg-white/98 backdrop-blur-md border-t border-gray-200 shadow-2xl z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="py-4 sm:py-6 space-y-3 sm:space-y-4">
                  {/* Navigation Links */}
                  <div className="space-y-1 sm:space-y-2">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-200 ${
                            isActive(item.href)
                              ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-white shadow-lg'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-teal-600'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg ${
                            isActive(item.href) 
                              ? 'bg-white/20' 
                              : 'bg-gray-100'
                          }`}>
                            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <span>{item.name}</span>
                          {isActive(item.href) && (
                            <div className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                  
                  {/* Auth Section - Mobile Only */}
                  <div className="sm:hidden pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg font-semibold transition-all duration-200 border border-teal-200 hover:border-teal-300 text-sm">
                          <LogIn className="w-4 h-4" />
                          <span>Masuk</span>
                        </button>
                      </Link>
                      <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm">
                          <UserPlus className="w-4 h-4" />
                          <span>Daftar</span>
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Emergency Section - Compact for Mobile */}
                  <div className="xl:hidden bg-gradient-to-r from-red-50 to-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-red-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs sm:text-sm font-semibold text-red-700">Darurat 24/7</span>
                      </div>
                      <Link href="tel:119" onClick={() => setIsMenuOpen(false)}>
                        <button className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl text-sm">
                          <Phone className="w-4 h-4" />
                          <span>119</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

