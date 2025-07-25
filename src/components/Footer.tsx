'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { FacebookIcon, LinkedinIcon, InstagramIcon, TwitterIcon } from '@/components/ui/SocialIcons';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const handleProtectedClick = (route: string) => {
    if (user) {
      router.push(route);
    } else {
      router.push(`/login?redirect=${encodeURIComponent(route)}`);
    }
  };

  const footerLinks = [
    {
      title: 'IELTSMaster',
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">IELTSMaster</h1>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                AI Powered
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Achieve your dream IELTS score with personalized AI feedback and expert strategies.
          </p>
        </div>
      )
    },
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '/courses', protected: true },
        { name: 'Mock Tests', path: '/mock-tests', protected: true },
        { name: 'Pricing', path: '/pricing' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', path: '/blog' },
        { name: 'Study Guides', path: '/guides' },
        { name: 'Vocabulary Builder', path: '/vocabulary', protected: true },
        { name: 'Grammar Checker', path: '/grammar', protected: true },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'FAQ', path: '/faq' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
      ],
    },
    {
      title: 'Connect With Us',
      content: (
        <div className="space-y-4">
          <div className="flex space-x-3">
            <a href="https://www.facebook.com/people/Solvio-Advisors/100085154420700/" className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
              <FacebookIcon className="w-5 h-5 text-blue-600" />
            </a>
            <a href="https://www.linkedin.com/company/solvio-advisors/" className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
              <LinkedinIcon className="w-5 h-5 text-blue-600" />
            </a>
            <a href="https://www.instagram.com/solvioadvisors/" className="p-2 bg-gray-100 rounded-full hover:bg-pink-100 transition-colors">
              <InstagramIcon className="w-5 h-5 text-pink-600" />
            </a>
            <a href="https://twitter.com/solvioadvisors" className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
              <TwitterIcon className="w-5 h-5 text-blue-400" />
            </a>
          </div>

          <div className="flex items-start space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 text-sm">support@ieltsmaster.com</p>
          </div>

          <div className="flex items-start space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
          </div>

          <div className="flex items-start space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-600 text-sm">123 Education St, Learning City</p>
          </div>
        </div>
      )
    },
  ];

  return (
    <footer className="bg-gray-50 text-gray-600 pt-12 pb-8 font-sans border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-4">
              {index === 0 ? (
                section.content
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h3>

                  {section.content ? (
                    section.content
                  ) : (
                    <ul className="space-y-3">
                      {section.links?.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <button
                            onClick={() => link.protected ? handleProtectedClick(link.path) : handleNavigation(link.path)}
                            className="text-gray-600 hover:text-blue-600 text-sm w-full text-left transition-colors"
                          >
                            {link.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} IELTSMaster. All rights reserved.
            </p>

            <p className="text-gray-500 text-sm text-center">
              This site is not affiliated with the British Council, IDP, or Cambridge Assessment English.
            </p>

            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-gray-500 text-sm">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}