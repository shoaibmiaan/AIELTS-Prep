'use client';
import { useRouter } from 'next/router';

interface FooterProps {
  handleNavigation: (route: string) => void;
  handleProtectedClick: (route: string) => void;
}

export default function Footer({ handleNavigation, handleProtectedClick }: FooterProps) {
  return (
    <footer className="bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-foreground-dark))] pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">IELTSMaster</h3>
            <p className="text-[rgb(var(--color-muted-dark))]">AI-powered IELTS preparation with personalized feedback and expert strategies.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/'); }} className="text-[rgb(var(--color-muted-dark))] hover:text-[rgb(var(--color-foreground-dark))]">Home</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleProtectedClick('/courses'); }} className="text-[rgb(var(--color-muted-dark))] hover:text-[rgb(var(--color-foreground-dark))]">Courses</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleProtectedClick('/mock-tests'); }} className="text-[rgb(var(--color-muted-dark))] hover:text-[rgb(var(--color-foreground-dark))]">Mock Tests</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/pricing'); }} className="text-[rgb(var(--color-muted-dark))] hover:text-[rgb(var(--color-foreground-dark))]">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/faq'); }} className="text-[rgb(var(--color-muted-dark))] hover:text-[rgb(var(--color-foreground-dark))]">FAQ</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/contact'); }} className="text-[rgb(var(--color-muted-dark))] hover:text-[rgb(var(--color-foreground-dark))]">Contact Us</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/privacy'); }} className="text-[rgb(var(--color-muted-dark))] hover:text-[rgb(var(--color-foreground-dark))]">Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/terms'); }} className="text-[rgb(var(--color-muted-dark))] hover:text-[rgb(var(--color-foreground-dark))]">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://www.facebook.com/people/Solvio-Advisors/100085154420700/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[rgb(var(--color-card-dark))] flex items-center justify-center hover:bg-[rgb(var(--color-secondary))]"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/solvio-advisors/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[rgb(var(--color-card-dark))] flex items-center justify-center hover:bg-[rgb(var(--color-secondary-dark))]"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="https://www.instagram.com/solvioadvisors/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[rgb(var(--color-card-dark))] flex items-center justify-center hover:bg-[rgb(var(--color-secondary-dark))]"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
            <p className="text-[rgb(var(--color-muted-dark))]">Email: support@ieltsmaster.com</p>
            <p className="text-[rgb(var(--color-muted-dark))]">WhatsApp: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="border-t border-[rgb(var(--color-border-dark))] pt-8 text-center text-[rgb(var(--color-muted-dark))]">
          <p>© 2023 IELTSMaster. All rights reserved.</p>
          <p className="mt-2 text-sm">This site is not affiliated with the British Council, IDP, or Cambridge Assessment English.</p>
        </div>
      </div>
    </footer>
  );
}