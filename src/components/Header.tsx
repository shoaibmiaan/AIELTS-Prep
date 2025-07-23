'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const learnDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  // Check if the current path is the homepage
  const isHomePage = router.pathname === '/';

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  const isPremium = !!user?.membership?.toLowerCase().includes('premium'); // Placeholder logic

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (learnDropdownRef.current && !learnDropdownRef.current.contains(event.target as Node)) {
        setLearnDropdownOpen(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLearnDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLearnDropdownOpen(prev => !prev);
    setAccountDropdownOpen(false);
  };

  const toggleAccountDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAccountDropdownOpen(prev => !prev);
    setLearnDropdownOpen(false);
  };

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const handleProtectedRoute = (route: string) => {
    if (user) {
      router.push(route);
    } else {
      handleNavigation('/login');
    }
  };

  return (
    <header className={`sticky top-0 z-50 shadow-md ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigation('/')}>
          <img src="/logo.png" alt="IELTSMaster Logo" className="w-12 h-12" />
          <span className="text-xl font-bold text-yellow-800 dark:text-yellow-400">IELTSMaster</span>
        </div>

        {/* Navbar */}
        <nav className="hidden md:flex space-x-8">
          {/* Home Button - Always Underlined on the Homepage */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleNavigation('/'); }}
            className={`text-gray-700 dark:text-white font-medium ${isHomePage ? 'underline text-yellow-600 dark:text-yellow-400' : 'hover:text-yellow-600 dark:hover:text-yellow-400'}`}
          >
            Home
          </a>

          <div className="relative" ref={learnDropdownRef}>
            <button className="text-gray-700 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 font-medium flex items-center" onClick={toggleLearnDropdown}>
              Learn <span className="ml-1 text-xs">▼</span>
            </button>
            {learnDropdownOpen && (
              <div className="absolute bg-white dark:bg-gray-800 shadow-lg rounded-md mt-2 w-48 z-10">
                <a href="#" onClick={(e) => { e.preventDefault(); handleProtectedRoute('/learnLab'); }} className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white">learnLab</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleProtectedRoute('/grammar'); }} className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white">Grammar</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleProtectedRoute('/vocabulary'); }} className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white">Vocabulary</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleProtectedRoute('/strategies'); }} className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white">Strategies</a>
              </div>
            )}
          </div>
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/practice'); }} className="text-yellow-600 dark:text-yellow-400 font-medium border-b-2 border-yellow-600 dark:border-yellow-400">Practice</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleProtectedRoute('/ai-tools'); }} className="text-gray-700 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 font-medium">AI Tools</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleProtectedRoute('/community'); }} className="text-gray-700 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 font-medium">Community</a>
        </nav>

        {/* User and Dark Mode Buttons */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-white" aria-label="Toggle dark mode">
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* User Account Dropdown */}
          {user ? (
            <div className="relative" ref={accountDropdownRef}>
              <button className="flex items-center space-x-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-white" onClick={toggleAccountDropdown} aria-label="User profile">
                <div className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img src={user.avatar} alt="User avatar" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <span className="text-sm font-medium">{user.name ? user.name[0].toUpperCase() : 'U'}</span>
                    </div>
                  )}
                  <span className="hidden md:inline">{user.name || user.email}</span>
                  <span className="ml-1 text-xs">▼</span>
                </div>
              </button>
              {accountDropdownOpen && (
                <div className="absolute right-0 bg-white dark:bg-gray-800 shadow-lg rounded-md mt-2 w-48 z-10">
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/profile'); }} className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white">
                    <span className="mr-2">👤</span> Profile
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/progress'); }} className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white">
                    <span className="mr-2">📊</span> Progress
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/settings'); }} className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white">
                    <span className="mr-2">⚙️</span> Settings
                  </a>
                  <div className="border-t dark:border-gray-700"></div>
                  <a href="#" onClick={(e) => { e.preventDefault(); logout(); handleNavigation('/login'); }} className="block px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700">
                    <span className="mr-2">🚪</span> Logout
                  </a>
                </div>
              )}
            </div>
          ) : (
            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-white" onClick={() => handleNavigation('/login')} aria-label="Login">
              <span>👤</span>
            </button>
          )}

          {/* Go Premium / Premium Dashboard Button */}
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium" onClick={() => handleNavigation(isPremium ? '/premium-dashboard' : '/pricing')}>
            {isPremium ? 'Premium Dashboard' : 'Go Premium'}
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600 dark:text-white" onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); }} aria-label="Mobile menu">
            <span className="text-2xl">☰</span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700`} onClick={() => setMobileMenuOpen(false)}>
        <div className="container mx-auto px-6 py-3 flex flex-col space-y-3">
          <a href="#" onClick={(e) => { e.preventDefault(); handleProtectedRoute('/learnLab'); }} className="py-2 border-b dark:border-gray-700 dark:text-white">Learn</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/practice'); }} className="py-2 border-b dark:border-gray-700 text-yellow-600 dark:text-yellow-400">Practice</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleProtectedRoute('/ai-tools'); }} className="py-2 border-b dark:border-gray-700 dark:text-white">AI Tools</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleProtectedRoute('/community'); }} className="py-2 border-b dark:border-gray-700 dark:text-white">Community</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleProtectedRoute('/premium-dashboard'); }} className="py-2 border-b dark:border-gray-700 dark:text-white">PremiumDashboard</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/pricing'); }} className="py-2 border-b dark:border-gray-700 dark:text-white">Pricing</a>
          {user && (
            <>
              <div className="flex items-center space-x-2 py-2 border-b dark:border-gray-700">
                {user.avatar ? (
                  <img src={user.avatar} alt="User avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-sm font-medium">{user.name ? user.name[0].toUpperCase() : 'U'}</span>
                  </div>
                )}
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/profile'); }} className="dark:text-white">{user.name || user.email}</a>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); logout(); handleNavigation('/login'); }} className="py-2 text-red-500">Logout</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
