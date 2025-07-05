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
  MapPin
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Beranda', href: '/', icon: Heart },
    { name: 'Profile', href: '/profile', icon: Users },
    { name: 'Dokter', href: '/doctors', icon: Users },
    { name: 'Jadwal', href: '/schedule', icon: Clock },
    { name: 'Booking', href: '/booking', icon: Calendar },
    { name: 'Artikel', href: '/articles', icon: FileText },
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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-300 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <span className="text-xl font-bold text-gray-900">
                RS Medicare Prima
              </span>
              <p className="text-sm text-gray-600">Rumah Sakit Terpercaya</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-teal-50 text-teal-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Login Button */}
            <Link href="/login" className="hidden md:block">
              <button className="text-teal-600 hover:text-teal-700 px-4 py-2 rounded-lg font-semibold transition-colors">
                Masuk
              </button>
            </Link>

            {/* Emergency Number */}
            <div className="hidden xl:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Darurat:</span>
              </div>
              <Link href="tel:119">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>IGD 119</span>
                </button>
              </Link>
            </div>

            {/* Mobile Emergency Button */}
            <Link href="tel:119" className="md:hidden">
              <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg">
                <Phone className="w-5 h-5" />
              </button>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-teal-50 text-teal-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Emergency Section */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="px-3 py-2 mb-3">
                  <Link href="/login">
                    <button className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors">
                      Masuk
                    </button>
                  </Link>
                </div>
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <Phone className="w-4 h-4" />
                    <span>Hubungi IGD:</span>
                  </div>
                  <Link href="tel:119">
                    <button className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg inline-flex items-center justify-center space-x-2 transition-colors">
                      <Phone className="w-4 h-4" />
                      <span>IGD 119</span>
                    </button>
                  </Link>
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

