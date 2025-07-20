'use client';
import { useRouter } from 'next/router';

interface FooterProps {
  handleNavigation: (route: string) => void;
  handleProtectedClick: (route: string) => void;
}

export default function Footer({ handleNavigation, handleProtectedClick }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">IELTSMaster</h3>
            <p className="text-gray-400">AI-powered IELTS preparation with personalized feedback and expert strategies.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/'); }} className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleProtectedClick('/courses'); }} className="text-gray-400 hover:text-white">Courses</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleProtectedClick('/mock-tests'); }} className="text-gray-400 hover:text-white">Mock Tests</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/pricing'); }} className="text-gray-400 hover:text-white">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/faq'); }} className="text-gray-400 hover:text-white">FAQ</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/contact'); }} className="text-gray-400 hover:text-white">Contact Us</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/privacy'); }} className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/terms'); }} className="text-gray-400 hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://www.facebook.com/people/Solvio-Advisors/100085154420700/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/solvio-advisors/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-400"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="https://www.instagram.com/solvioadvisors/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-purple-600"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
            <p className="text-gray-400">Email: support@ieltsmaster.com</p>
            <p className="text-gray-400">WhatsApp: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2023 IELTSMaster. All rights reserved.</p>
          <p className="mt-2 text-sm">This site is not affiliated with the British Council, IDP, or Cambridge Assessment English.</p>
        </div>
      </div>
    </footer>
  );
}