'use client';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to submit contact form
      setSuccess('Your message has been sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <Layout
      title="AIELTS Prep – Contact Us"
      description="Get in touch with the AIELTS Prep team for support or inquiries."
    >
      <motion.section
        className="px-6 md:px-20 py-16 bg-black/70 backdrop-blur-sm flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-md w-full bg-gray-800/70 p-8 rounded-xl border border-transparent hover:border-orange-500 transition">
          <h1 className="text-2xl font-bold text-gray-100 mb-6">Contact Us</h1>
          <p className="text-gray-300 mb-6 text-sm">
            Have questions or need support? Fill out the form below, and our team will get back to you soon.
          </p>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-4">{success}</p>}
          <div
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="name" className="text-gray-300 text-sm">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-gray-900/50 text-white rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                required
                aria-label="Full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-gray-300 text-sm">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-gray-900/50 text-white rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                required
                aria-label="Email address"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-gray-300 text-sm">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-gray-900/50 text-white rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                rows={5}
                required
                aria-label="Your message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
              aria-label="Send Message"
            >
              Send Message
            </button>
          </div>
          <div className="mt-6 text-gray-300 text-sm">
            <p>Or reach us directly at:</p>
            <p className="text-orange-400">support@aieltsprep.com</p>
            <p className="text-orange-400">+1-800-IELTS-AI</p>
          </div>
        </div>
      </motion.section>
    </Layout>
  );
}