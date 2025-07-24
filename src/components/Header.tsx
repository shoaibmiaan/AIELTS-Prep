'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { DropdownItem } from '@/components/ui/DropdownItem';
import { NavLink } from '@/components/ui/NavLink';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
import { SunIcon, MoonIcon, ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isPremium = !!user?.membership?.toLowerCase().includes('premium');

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

  const navItems = [
    { name: 'Home', path: '/', protected: false },
    { name: 'Learn', path: '/learn', protected: true, dropdown: [
      { name: 'Learn Lab', path: '/learnLab' },
      { name: 'Grammar', path: '/grammar' },
      { name: 'Vocabulary', path: '/vocabulary' },
      { name: 'Strategies', path: '/strategies' }
    ]},
    { name: 'Practice', path: '/practice', protected: false },
    { name: 'AI Tools', path: '/ai-tools', protected: true },
    { name: 'Community', path: '/community', protected: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => handleNavigation('/')}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 dark:bg-amber-600 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
            <span className="text-white font-bold text-lg">IM</span>
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            IELTSMaster
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            item.dropdown ? (
              <Dropdown
                key={item.name}
                trigger={
                  <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors">
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
                onClick={() => item.protected ? handleProtectedRoute(item.path) : null}
              >
                {item.name}
              </NavLink>
            )
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <DarkModeToggle className="hidden sm:block" />

          {user ? (
            <Dropdown
              trigger={
                <div className="flex items-center space-x-2 group">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-transparent group-hover:border-amber-500 transition-colors"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-white font-medium group-hover:from-amber-600 group-hover:to-amber-700 transition-colors">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden md:inline text-gray-700 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {user.name || user.email}
                  </span>
                </div>
              }
              align="right"
            >
              <DropdownItem icon="👤" onClick={() => handleNavigation('/profile')}>
                Profile
              </DropdownItem>
              <DropdownItem icon="📊" onClick={() => handleNavigation('/progress')}>
                Progress
              </DropdownItem>
              {isPremium && (
                <DropdownItem icon="⭐" onClick={() => handleNavigation('/premium')}>
                  Premium
                </DropdownItem>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <DropdownItem
                icon="🚪"
                onClick={() => { logout(); handleNavigation('/login'); }}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
              >
                Logout
              </DropdownItem>
            </Dropdown>
          ) : (
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/login')}
              className="hidden sm:flex"
            >
              Sign In
            </Button>
          )}

          <Button
            onClick={() => handleNavigation(isPremium ? '/premium-dashboard' : '/pricing')}
            className="hidden sm:flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
          >
            {isPremium ? (
              <>
                <span>⭐</span>
                <span>Premium</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Go Premium</span>
              </>
            )}
          </Button>

          <DarkModeToggle className="sm:hidden" />

          <button
            className="md:hidden text-gray-600 dark:text-gray-300 p-2"
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
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-medium text-gray-800 dark:text-gray-200">Menu</span>
              <DarkModeToggle />
            </div>

            {navItems.map((item) => (
              item.dropdown ? (
                <div key={item.name} className="space-y-2">
                  <button
                    className="w-full text-left py-2 font-medium text-gray-800 dark:text-gray-200 flex justify-between items-center"
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
                        className="block py-1.5"
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
                  className="block py-2 font-medium"
                  onClick={() => item.protected ? handleProtectedRoute(item.path) : null}
                >
                  {item.name}
                </NavLink>
              )
            ))}

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              {user ? (
                <>
                  <NavLink href="/profile" className="block py-2">
                    Profile
                  </NavLink>
                  <button
                    onClick={() => { logout(); handleNavigation('/login'); }}
                    className="w-full text-left py-2 text-red-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Button
                  onClick={() => handleNavigation('/login')}
                  className="w-full justify-center"
                >
                  Sign In
                </Button>
              )}

              <Button
                onClick={() => handleNavigation(isPremium ? '/premium-dashboard' : '/pricing')}
                className="w-full justify-center mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
              >
                {isPremium ? 'Premium Dashboard' : 'Go Premium'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;