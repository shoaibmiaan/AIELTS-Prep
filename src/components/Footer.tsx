'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
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
        <>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            AI-powered IELTS preparation with personalized feedback and expert strategies to help you achieve your dream score.
          </p>
          <DarkModeToggle className="mb-4" />
        </>
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
        <>
          <div className="flex space-x-4 mb-4">
            <SocialIcon href="https://www.facebook.com/people/Solvio-Advisors/100085154420700/">
              <FacebookIcon className="w-5 h-5" />
            </SocialIcon>
            <SocialIcon href="https://www.linkedin.com/company/solvio-advisors/">
              <LinkedinIcon className="w-5 h-5" />
            </SocialIcon>
            <SocialIcon href="https://www.instagram.com/solvioadvisors/">
              <InstagramIcon className="w-5 h-5" />
            </SocialIcon>
            <SocialIcon href="https://twitter.com/solvioadvisors">
              <TwitterIcon className="w-5 h-5" />
            </SocialIcon>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            ✉️ support@ieltsmaster.com
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            💬 WhatsApp: +1 (555) 123-4567
          </p>
        </>
      )
    },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 pt-12 pb-8 font-sans border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                {section.title}
                {index === 0 && (
                  <span className="ml-2 text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full">
                    AI Powered
                  </span>
                )}
              </h3>

              {section.content ? (
                section.content
              ) : (
                <ul className="space-y-3">
                  {section.links?.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Button
                        variant="link"
                        onClick={() => link.protected ? handleProtectedClick(link.path) : handleNavigation(link.path)}
                        className="text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 text-sm !justify-start !p-0 !font-normal"
                      >
                        {link.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <p>© {new Date().getFullYear()} IELTSMaster. All rights reserved.</p>
            <span className="hidden sm:inline">•</span>
            <DarkModeToggle className="sm:hidden" />
            <p className="hidden sm:flex items-center">
              <span className="mx-2">•</span>
              <span>Color scheme:</span>
              <DarkModeToggle className="ml-2" />
            </p>
          </div>
          <p className="mt-4">
            This site is not affiliated with the British Council, IDP, or Cambridge Assessment English.
          </p>
        </div>
      </div>
    </footer>
  );
}