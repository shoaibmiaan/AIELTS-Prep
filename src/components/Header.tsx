'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { DropdownItem } from '@/components/ui/DropdownItem';
import { ChevronDownIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon, UserCircleIcon, ChartBarIcon, SparklesIcon, GlobeAltIcon, AcademicCapIcon, BookOpenIcon, LightBulbIcon, UsersIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
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
    const handleScroll = () => setScrolled(window.scrollY > 10);
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
    user ? router.push(route) : router.push('/login');
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleDropdown = (name: string) => setOpenDropdown(openDropdown === name ? null : name);

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

  if (!mounted) return null;

  return (
    <header className={`
      sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300
      ${scrolled ? 'shadow-lg border-b border-gray-200 dark:border-gray-700' : ''}
    `}>
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => handleNavigation('/')}
        >
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform shadow-sm">
            <GlobeAltIcon className="w-6 h-6 text-gray-700 dark:text-gray-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
              IELTSMaster
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
              Worldwide Learning Platform
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1" ref={dropdownRef}>
          {navItems.map((item) => (
            item.dropdown ? (
              <div key={item.name} className="relative">
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={`
                    flex items-center space-x-1 text-gray-700 dark:text-gray-200 font-medium px-3 py-2 rounded-lg
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    ${openDropdown === item.name ? 'bg-gray-100 dark:bg-gray-800' : ''}
                  `}
                >
                  <span>{item.name}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {openDropdown === item.name && (
                  <div className="
                    absolute left-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800
                    divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg
                    ring-1 ring-black ring-opacity-5 focus:outline-none z-50
                  ">
                    {item.dropdown.map((subItem) => (
                      <button
                        key={subItem.path}
                        onClick={() => item.protected ? handleProtectedRoute(subItem.path) : handleNavigation(subItem.path)}
                        className="
                          group flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                          hover:bg-gray-100 dark:hover:bg-gray-700
                        "
                      >
                        {subItem.icon && (
                          <span className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400">
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
                className={`
                  px-3 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-200
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  ${pathname === item.path ? 'bg-gray-100 dark:bg-gray-800' : ''}
                `}
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
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span className="text-sm font-medium hidden sm:inline mr-1">EN</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </button>
            }
            align="right"
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
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
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5 text-yellow-300" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
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
                      className="w-8 h-8 rounded-full object-cover border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  {isPremium && (
                    <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-600 text-yellow-800 dark:text-yellow-100">
                      Premium
                    </span>
                  )}
                </div>
              }
              align="right"
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 flex items-center">
                  {user.name || 'Profile'}
                  {isPremium && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-600 text-yellow-800 dark:text-yellow-100">
                      Premium
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
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

              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <DropdownItem
                icon={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
                onClick={() => { logout(); handleNavigation('/login'); }}
                className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
              >
                Logout
              </DropdownItem>
            </Dropdown>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => handleNavigation('/login')}
                className="hidden sm:flex text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Sign In
              </Button>
              <Button
                onClick={() => handleNavigation('/signup')}
                className="hidden sm:flex bg-gray-800 dark:bg-blue-600 text-white hover:bg-gray-700 dark:hover:bg-blue-700"
              >
                Get Started
              </Button>
            </div>
          )}

          <button
            className="md:hidden text-gray-600 dark:text-gray-400 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-medium text-gray-800 dark:text-gray-200">Navigation</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <SunIcon className="h-5 w-5 text-yellow-300" />
                  ) : (
                    <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {navItems.map((item) => (
              item.dropdown ? (
                <div key={item.name} className="space-y-2">
                  <button
                    className="w-full text-left py-2 font-medium text-gray-800 dark:text-gray-200 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-3 rounded-lg"
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
                          className="block w-full text-left py-1.5 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2 text-gray-700 dark:text-gray-300"
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
                  className="w-full text-left py-2 px-3 rounded-lg font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              )
            ))}

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
              {user ? (
                <>
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className="block w-full text-left py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2 text-gray-800 dark:text-gray-200"
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    <span>My Profile</span>
                  </button>
                  {isPremium && (
                    <button
                      onClick={() => handleNavigation('/premium')}
                      className="block w-full text-left py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2 text-gray-800 dark:text-gray-200"
                    >
                      <SparklesIcon className="w-5 h-5" />
                      <span>Premium Features</span>
                    </button>
                  )}
                  <button
                    onClick={() => { logout(); handleNavigation('/login'); }}
                    className="block w-full text-left py-2 px-3 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 flex items-center space-x-2"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() => handleNavigation('/login')}
                    className="w-full justify-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => handleNavigation('/signup')}
                    className="w-full justify-center bg-gray-800 dark:bg-blue-600 text-white hover:bg-gray-700 dark:hover:bg-blue-700"
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