'use client';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
  const router = useRouter();
  const { user } = useAuth();

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const handleProtectedClick = (route: string) => {
    if (user) {
      router.push(route);
    } else {
      router.push('/login?redirect=' + encodeURIComponent(route));
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 pt-16 pb-8 font-sans">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">IELTSMaster</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              AI-powered IELTS preparation with personalized feedback and expert strategies.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigation('/')}
                  className="text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 text-sm"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProtectedClick('/courses')}
                  className="text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 text-sm"
                >
                  Courses
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProtectedClick('/mock-tests')}
                  className="text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 text-sm"
                >
                  Mock Tests
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/pricing')}
                  className="text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 text-sm"
                >
                  Pricing
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigation('/faq')}
                  className="text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 text-sm"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/contact')}
                  className="text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 text-sm"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/privacy')}
                  className="text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 text-sm"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/terms')}
                  className="text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 text-sm"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://www.facebook.com/people/Solvio-Advisors/100085154420700/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-amber-500 dark:hover:bg-amber-400 text-gray-600 dark:text-gray-300 hover:text-white transition-colors"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/solvio-advisors/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-amber-500 dark:hover:bg-amber-400 text-gray-600 dark:text-gray-300 hover:text-white transition-colors"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="https://www.instagram.com/solvioadvisors/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-amber-500 dark:hover:bg-amber-400 text-gray-600 dark:text-gray-300 hover:text-white transition-colors"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Email: support@ieltsmaster.com</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">WhatsApp: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600 pt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2025 IELTSMaster. All rights reserved.</p>
          <p className="mt-2">
            This site is not affiliated with the British Council, IDP, or Cambridge Assessment English.
          </p>
        </div>
      </div>
    </footer>
  );
}