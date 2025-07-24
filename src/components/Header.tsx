'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { DropdownItem } from '@/components/ui/DropdownItem';
import { NavLink } from '@/components/ui/NavLink';
import { ChevronDownIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon, UserCircleIcon, ChartBarIcon, SparklesIcon, GlobeAltIcon, AcademicCapIcon, BookOpenIcon, LightBulbIcon, UsersIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const isPremium = !!user?.membership?.toLowerCase().includes('premium');

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (route: string) => {
    router.push(route);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleProtectedRoute = (route: string) => {
    if (user) {
      router.push(route);
    } else {
      router.push('/login');
    }
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const navItems = [
    {
      name: 'Home',
      path: '/',
      protected: false,
      icon: <RocketLaunchIcon className="w-5 h-5 md:hidden" />
    },
    {
      name: 'Learn',
      path: '/learn',
      protected: true,
      icon: <AcademicCapIcon className="w-5 h-5 md:hidden" />,
      dropdown: [
        { name: 'Learn Lab', path: '/learnLab', icon: <LightBulbIcon className="w-4 h-4" /> },
        { name: 'Grammar', path: '/grammar', icon: <BookOpenIcon className="w-4 h-4" /> },
        { name: 'Vocabulary', path: '/vocabulary', icon: <BookOpenIcon className="w-4 h-4" /> },
        { name: 'Strategies', path: '/strategies', icon: <LightBulbIcon className="w-4 h-4" /> }
      ]
    },
    {
      name: 'Practice',
      path: '/assessmentRoom',
      protected: false,
      icon: <BookOpenIcon className="w-5 h-5 md:hidden" />
    },
    {
      name: 'AI Tools',
      path: '/ai-tools',
      protected: true,
      icon: <SparklesIcon className="w-5 h-5 md:hidden" />
    },
    {
      name: 'Community',
      path: '/community',
      protected: true,
      icon: <UsersIcon className="w-5 h-5 md:hidden" />
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <header className={`sticky top-0 z-50 bg-white shadow-sm transition-all duration-300 ${scrolled ? 'shadow-lg border-b border-gray-200' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => handleNavigation('/')}
        >
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform shadow-sm">
            <GlobeAltIcon className="w-6 h-6 text-gray-700" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-800">
              IELTSMaster
            </span>
            <span className="text-xs text-gray-500 -mt-1">Worldwide Learning Platform</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1" ref={dropdownRef}>
          {navItems.map((item) => (
            item.dropdown ? (
              <div key={item.name} className="relative">
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={`flex items-center space-x-1 text-gray-700 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 ${openDropdown === item.name ? 'bg-gray-100' : ''}`}
                >
                  <span>{item.name}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {openDropdown === item.name && (
                  <div className="absolute left-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    {item.dropdown.map((subItem) => (
                      <button
                        key={subItem.path}
                        onClick={() => item.protected ? handleProtectedRoute(subItem.path) : handleNavigation(subItem.path)}
                        className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {subItem.icon && (
                          <span className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500">
                            {subItem.icon}
                          </span>
                        )}
                        {subItem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.path}
                onClick={() => item.protected ? handleProtectedRoute(item.path) : handleNavigation(item.path)}
                className={`px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 ${pathname === item.path ? 'bg-gray-100' : ''}`}
              >
                {item.name}
              </button>
            )
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Selector */}
          <Dropdown
            trigger={
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium hidden sm:inline mr-1">EN</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </button>
            }
            align="right"
          >
            <DropdownItem onClick={() => {}}>English (EN)</DropdownItem>
            <DropdownItem onClick={() => {}}>中文 (CN)</DropdownItem>
            <DropdownItem onClick={() => {}}>Español (ES)</DropdownItem>
            <DropdownItem onClick={() => {}}>العربية (AR)</DropdownItem>
            <DropdownItem onClick={() => {}}>हिन्दी (HI)</DropdownItem>
          </Dropdown>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {user ? (
            <Dropdown
              trigger={
                <div className="flex items-center space-x-2 group cursor-pointer">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-transparent hover:border-gray-300 transition-colors"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium hover:bg-gray-200 transition-colors">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  {isPremium && (
                    <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors">
                      Premium
                    </span>
                  )}
                </div>
              }
              align="right"
            >
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900 flex items-center">
                  {user.name || 'Profile'}
                  {isPremium && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      Premium
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>

              <DropdownItem
                icon={<UserCircleIcon className="w-4 h-4" />}
                onClick={() => handleNavigation('/profile')}
              >
                My Profile
              </DropdownItem>
              <DropdownItem
                icon={<ChartBarIcon className="w-4 h-4" />}
                onClick={() => handleNavigation('/progress')}
              >
                My Progress
              </DropdownItem>

              {isPremium && (
                <DropdownItem
                  icon={<SparklesIcon className="w-4 h-4" />}
                  onClick={() => handleNavigation('/premium')}
                >
                  Premium Features
                </DropdownItem>
              )}

              <div className="border-t border-gray-200 my-1"></div>
              <DropdownItem
                icon={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
                onClick={() => { logout(); handleNavigation('/login'); }}
                className="text-red-500 hover:bg-red-50"
              >
                Logout
              </DropdownItem>
            </Dropdown>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => handleNavigation('/login')}
                className="hidden sm:flex hover:bg-gray-100"
              >
                Sign In
              </Button>
              <Button
                onClick={() => handleNavigation('/signup')}
                className="hidden sm:flex bg-gray-800 text-white hover:bg-gray-700"
              >
                Get Started
              </Button>
            </div>
          )}

          <button
            className="md:hidden text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Mobile menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="font-medium text-gray-800">Navigation</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {navItems.map((item) => (
              item.dropdown ? (
                <div key={item.name} className="space-y-2">
                  <button
                    className="w-full text-left py-2 font-medium text-gray-800 flex justify-between items-center hover:bg-gray-100 px-3 rounded-lg"
                    onClick={() => toggleDropdown(item.name)}
                  >
                    <div className="flex items-center space-x-2">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                  {openDropdown === item.name && (
                    <div className="pl-4 space-y-2 mt-2">
                      {item.dropdown.map((subItem) => (
                        <button
                          key={subItem.path}
                          onClick={() => {
                            item.protected ? handleProtectedRoute(subItem.path) : handleNavigation(subItem.path);
                            setOpenDropdown(null);
                          }}
                          className="block w-full text-left py-1.5 px-3 rounded-lg hover:bg-gray-100 flex items-center space-x-2"
                        >
                          {subItem.icon}
                          <span>{subItem.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.path}
                  onClick={() => item.protected ? handleProtectedRoute(item.path) : handleNavigation(item.path)}
                  className="w-full text-left py-2 px-3 rounded-lg font-medium text-gray-800 hover:bg-gray-100 flex items-center space-x-2"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              )
            ))}

            <div className="pt-2 border-t border-gray-200 space-y-2">
              {user ? (
                <>
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className="block w-full text-left py-2 px-3 rounded-lg hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    <span>My Profile</span>
                  </button>
                  {isPremium && (
                    <button
                      onClick={() => handleNavigation('/premium')}
                      className="block w-full text-left py-2 px-3 rounded-lg hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <SparklesIcon className="w-5 h-5" />
                      <span>Premium Features</span>
                    </button>
                  )}
                  <button
                    onClick={() => { logout(); handleNavigation('/login'); }}
                    className="block w-full text-left py-2 px-3 rounded-lg text-red-500 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() => handleNavigation('/login')}
                    className="w-full justify-center hover:bg-gray-100"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => handleNavigation('/signup')}
                    className="w-full justify-center bg-gray-800 text-white hover:bg-gray-700"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;