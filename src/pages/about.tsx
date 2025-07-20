'use client';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <Layout
      title="AIELTS Prep – About Us"
      description="Learn about AIELTS Prep, our mission, and how our AI-driven platform helps you achieve your IELTS goals."
    >
      <motion.section
        className="px-6 md:px-20 py-16 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-6">About AIELTS Prep</h1>
        <p className="text-gray-300 mb-8 text-sm">
          At AIELTS Prep, we’re revolutionizing IELTS preparation with cutting-edge AI technology. Our mission is to empower students worldwide to achieve their target band scores through personalized, data-driven learning experiences.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-100">Our Mission</h2>
            <p className="text-gray-300 text-sm">
              We aim to make IELTS preparation accessible, effective, and engaging by leveraging advanced AI tools. From instant feedback on writing and speaking to adaptive study plans, we’re here to help you succeed.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden">
            <Image
              src="/ai-powered-learning.jpg"
              alt="AI-powered learning illustration"
              width={600}
              height={400}
              className="object-cover w-full hover:scale-105 transition duration-700 transition-opacity opacity-0 duration-300"
              onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'AI-Driven Feedback', desc: 'Instant, accurate scoring for Writing and Speaking.', icon: '🧠' },
            { title: 'Personalized Plans', desc: 'Tailored study paths based on your performance.', icon: '📈' },
            { title: 'Global Community', desc: 'Connect with IELTS aspirants worldwide.', icon: '🌍' },
            { title: '24/7 Support', desc: 'Access AI tutors anytime, anywhere.', icon: '🤖' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-gray-800/70 p-6 rounded-xl hover:border-orange-500 border border-transparent transition hover:bg-gray-800/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-2xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/practice">
              <button
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
                aria-label="Start Practicing Now"
              >
                Start Practicing Now
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </Layout>
  );
}