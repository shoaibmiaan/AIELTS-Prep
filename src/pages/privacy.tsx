'use client';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <Layout
      title="AIELTS Prep – Privacy Policy"
      description="Read our Privacy Policy to understand how we handle your data at AIELTS Prep."
    >
      <motion.section
        className="px-6 md:px-20 py-16 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-6">Privacy Policy</h1>
        <p className="text-gray-300 mb-8 text-sm">
          At AIELTS Prep, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data.
        </p>
        <div className="space-y-8 text-gray-300 text-sm">
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide, such as your name, email address, and performance data, to deliver personalized IELTS preparation services. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email, password).</li>
              <li>Practice test results and AI-generated feedback.</li>
              <li>Usage data (e.g., pages visited, time spent on platform).</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">2. How We Use Your Information</h2>
            <p>Your data is used to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide AI-driven feedback and personalized study plans.</li>
              <li>Improve our platform and services.</li>
              <li>Communicate updates, promotions, or support messages.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">3. Data Security</h2>
            <p>
              We implement industry-standard security measures, including encryption and secure servers, to protect your data from unauthorized access.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">4. Sharing Your Information</h2>
            <p>
              We do not sell or share your personal information with third parties, except as required by law or to provide our services (e.g., with trusted service providers under strict confidentiality agreements).
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. Contact us at{' '}
              <span className="text-orange-400">support@aieltsprep.com</span> to exercise these rights.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">6. Cookies</h2>
            <p>
              We use cookies to enhance your experience, such as remembering your preferences and tracking usage. You can manage cookie settings in your browser.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">7. Contact Us</h2>
            <p>
              For questions about this Privacy Policy, reach us at{' '}
              <span className="text-orange-400">support@aieltsprep.com</span> or{' '}
              <span className="text-orange-400">+1-800-IELTS-AI</span>.
            </p>
          </div>
        </div>
      </motion.section>
    </Layout>
  );
}