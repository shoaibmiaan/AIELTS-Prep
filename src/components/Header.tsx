'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { colors } from '@/styles/theme';

interface HeaderProps {
  isLoggedIn: boolean;
  isPremium: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
  handleNavigation: (route: string) => void;
  handleProtectedClick: (route: string) => void;
}

export default function Header({ isLoggedIn, isPremium, darkMode, toggleDarkMode, handleNavigation, handleProtectedClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigation('/')}>
          <i className="fas fa-book-open text-yellow-600 text-2xl"></i>
          <span className="text-xl font-bold text-yellow-800 dark:text-yellow-400">IELTSMaster</span>
        </div>

        <nav className="hidden md:flex space-x-8">
          <div className="dropdown relative" ref={dropdownRef}>
            <button
              className="text-gray-700 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 font-medium"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Learn <i className="fas fa-chevron-down ml-1 text-xs"></i>
            </button>
            <div className={`dropdown-menu absolute ${dropdownOpen ? 'block' : 'hidden'} bg-white dark:bg-gray-800 shadow-lg rounded-md mt-2 w-48`}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleProtectedClick('/courses');
                }}
                className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white"
              >
                Courses
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleProtectedClick('/grammar');
                }}
                className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white"
              >
                Grammar/Vocabulary
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleProtectedClick('/strategies');
                }}
                className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white"
              >
                Strategies
              </a>
            </div>
          </div>
          <a
            href="#"
            className="text-yellow-600 dark:text-yellow-400 font-medium border-b-2 border-yellow-600 dark:border-yellow-400"
          >
            Practice
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleProtectedClick('/ai-tools');
            }}
            className="text-gray-700 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 font-medium"
          >
            AI Tools
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleProtectedClick('/community');
            }}
            className="text-gray-700 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 font-medium"
          >
            Community
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleProtectedClick('/premium-dashboard');
            }}
            className="text-gray-700 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 font-medium"
          >
            Premium Dashboard
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/pricing');
            }}
            className="text-gray-700 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 font-medium"
          >
            Pricing
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-white"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
          </button>

          {isLoggedIn ? (
            <div className="dropdown relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-white"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User profile"
              >
                <i className="fas fa-user"></i>
                <span className="hidden md:inline-block text-sm">My Account</span>
              </button>
              <div className={`dropdown-menu absolute right-0 ${dropdownOpen ? 'block' : 'hidden'} bg-white dark:bg-gray-800 shadow-lg rounded-md mt-2 w-48`}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/profile');
                  }}
                  className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white"
                >
                  <i className="fas fa-user-circle mr-2"></i> Profile
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/progress');
                  }}
                  className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white"
                >
                  <i className="fas fa-chart-line mr-2"></i> Progress
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/settings');
                  }}
                  className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white"
                >
                  <i className="fas fa-cog mr-2"></i> Settings
                </a>
                <div className="border-t dark:border-gray-700"></div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/logout');
                  }}
                  className="block px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </a>
              </div>
            </div>
          ) : (
            <button
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-white"
              onClick={() => handleNavigation('/login')}
              aria-label="Login"
            >
              <i className="fas fa-user"></i>
            </button>
          )}

          <button
            className="bg-black-600 hover:bg-black-70000 text-black px-4 py-2 rounded-md font-medium"
            onClick={() => handleNavigation(isPremium ? '/premium-dashboard' : '/pricing')}
          >
            {isPremium ? 'Premium Dashboard' : 'Go Premium'}
          </button>
          <button
            className="md:hidden text-black-60000 dark:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Mobile menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
      <div id="mobileMenu" className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700`}>
        <div className="container mx-auto px-6 py-3 flex flex-col space-y-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleProtectedClick('/courses');
            }}
            className="py-2 border-b dark:border-gray-700 dark:text-white"
          >
            Learn
          </a>
          <a
            href="#"
            className="py-2 border-b dark:border-gray-700 text-yellow-600 dark:text-yellow-400"
          >
            Practice
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleProtectedClick('/ai-tools');
            }}
            className="py-2 border-b dark:border-gray-700 dark:text-white"
          >
            AI Tools
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleProtectedClick('/community');
            }}
            className="py-2 border-b dark:border-gray-700 dark:text-white"
          >
            Community
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleProtectedClick('/premium-dashboard');
            }}
            className="py-2 border-b dark:border-gray-700 dark:text-white"
          >
            Premium Dashboard
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/pricing');
            }}
            className="py-2 border-b dark:border-gray-700 dark:text-white"
          >
            Pricing
          </a>
          {isLoggedIn && (
            <>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/profile');
                }}
                className="py-2 border-b dark:border-gray-700 dark:text-white"
              >
                My Profile
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/logout');
                }}
                className="py-2 text-red-500"
              >
                Logout
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}