'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useThemeStore } from '@/lib/theme-store';
import { Home, Building2, User, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, fetchCurrentUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch current user on mount if we have a token
    if (typeof window !== 'undefined' && localStorage.getItem('access_token')) {
      fetchCurrentUser();
    }
  }, [fetchCurrentUser]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Home className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">HouseBooking</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/houses"
              className={`transition-colors ${
                isActive('/houses') 
                  ? 'text-primary-500' 
                  : 'text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Browse Houses
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' ? (
                  <Link
                    href="/admin"
                    className={`transition-colors ${
                      pathname.startsWith('/admin') 
                        ? 'text-primary-500' 
                        : 'text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className={`transition-colors ${
                      pathname.startsWith('/dashboard') 
                        ? 'text-primary-500' 
                        : 'text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    My Bookings
                  </Link>
                )}

                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 dark:text-dark-300">
                    <User className="w-5 h-5 inline mr-1" />
                    {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center"
                  >
                    <LogOut className="w-5 h-5 mr-1" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="hidden md:block text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white transition-colors p-2"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/houses"
              className="block text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse Houses
            </Link>

            {/* Theme Toggle in Mobile */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-5 h-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' ? (
                  <Link
                    href="/admin"
                    className="block text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="block text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                )}

                <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                  <p className="text-gray-600 dark:text-dark-300 mb-2">{user?.name}</p>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block btn-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
