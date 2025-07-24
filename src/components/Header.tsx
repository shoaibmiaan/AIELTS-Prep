'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { DropdownItem } from '@/components/ui/DropdownItem';
import { NavLink } from '@/components/ui/NavLink';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
import { ChevronDownIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon, UserCircleIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const isPremium = !!user?.membership?.toLowerCase().includes('premium');

  // Ensure component is mounted before rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (route: string) => {
    router.push(route);
    setMobileMenuOpen(false);
  };

  const handleProtectedRoute = (route: string) => {
    if (user) {
      router.push(route);
    } else {
      router.push('/login');
    }
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { name: 'Home', path: '/', protected: false },
    {
      name: 'Learn',
      path: '/learn',
      protected: true,
      dropdown: [
        { name: 'Learn Lab', path: '/learnLab' },
        { name: 'Grammar', path: '/grammar' },
        { name: 'Vocabulary', path: '/vocabulary' },
        { name: 'Strategies', path: '/strategies' }
      ]
    },
    {
      name: 'Practice',
      path: '/assessmentRoom',
      protected: false
    },
    { name: 'AI Tools', path: '/ai-tools', protected: true },
    { name: 'Community', path: '/community', protected: true },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => handleNavigation('/')}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
            <Image
              src="/logo.png"
              alt="IELTSMaster Logo"
              width={48}
              height={48}
              className="p-1"
              onError={(e) => {
                (e.target as HTMLElement).innerHTML = '<span class="text-white font-bold text-lg">IM</span>';
              }}
            />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            IELTSMaster
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            item.dropdown ? (
              <Dropdown
                key={item.name}
                trigger={
                  <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                    <span>{item.name}</span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </div>
                }
              >
                {item.dropdown.map((subItem) => (
                  <DropdownItem
                    key={subItem.path}
                    onClick={() => item.protected ? handleProtectedRoute(subItem.path) : handleNavigation(subItem.path)}
                  >
                    {subItem.name}
                  </DropdownItem>
                ))}
              </Dropdown>
            ) : (
              <NavLink
                key={item.path}
                href={item.path}
                isActive={pathname === item.path}
                onClick={() => item.protected ? handleProtectedRoute(item.path) : handleNavigation(item.path)}
                className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {item.name}
              </NavLink>
            )
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Dark/Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
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
                      className="w-8 h-8 rounded-full object-cover border-2 border-transparent group-hover:border-amber-500 transition-colors"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
              }
              align="right"
            >
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name || 'Profile'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>

              <DropdownItem icon={<UserCircleIcon className="w-4 h-4" />} onClick={() => handleNavigation('/profile')}>
                My Profile
              </DropdownItem>
              <DropdownItem icon={<ChartBarIcon className="w-4 h-4" />} onClick={() => handleNavigation('/progress')}>
                My Progress
              </DropdownItem>

              {isPremium && (
                <DropdownItem
                  icon={<SparklesIcon className="w-4 h-4 text-amber-500" />}
                  onClick={() => handleNavigation('/premium')}
                  className="text-amber-600 dark:text-amber-400"
                >
                  Premium Features
                </DropdownItem>
              )}

              <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
              <DropdownItem
                icon={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
                onClick={() => { logout(); handleNavigation('/login'); }}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Logout
              </DropdownItem>
            </Dropdown>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => handleNavigation('/login')}
                className="hidden sm:flex hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Sign In
              </Button>
              <Button
                onClick={() => handleNavigation('/signup')}
                className="hidden sm:flex bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white dark:text-white"
              >
                Get Started
              </Button>
            </div>
          )}

          <button
            className="md:hidden text-gray-600 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
              <span className="font-medium text-gray-800 dark:text-gray-200">Navigation</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {theme === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
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
                    className="w-full text-left py-2 font-medium text-gray-800 dark:text-gray-200 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 px-3 rounded-lg"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    <span>{item.name}</span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                  <div className="pl-4 space-y-2">
                    {item.dropdown.map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        href={subItem.path}
                        className="block py-1.5 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => item.protected ? handleProtectedRoute(subItem.path) : null}
                      >
                        {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.path}
                  href={item.path}
                  className="block py-2 px-3 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => item.protected ? handleProtectedRoute(item.path) : null}
                >
                  {item.name}
                </NavLink>
              )
            ))}

            <div className="pt-2 border-t border-gray-200 dark:border-gray-800 space-y-2">
              {user ? (
                <>
                  <NavLink
                    href="/profile"
                    className="block py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    My Profile
                  </NavLink>
                  {isPremium && (
                    <NavLink
                      href="/premium"
                      className="block py-2 px-3 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    >
                      Premium Features
                    </NavLink>
                  )}
                  <button
                    onClick={() => { logout(); handleNavigation('/login'); }}
                    className="w-full text-left py-2 px-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() => handleNavigation('/login')}
                    className="w-full justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => handleNavigation('/signup')}
                    className="w-full justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white dark:text-white"
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