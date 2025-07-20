'use client';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Blog() {
  return (
    <Layout
      title="AIELTS Prep – Blog"
      description="Explore our latest articles and updates to boost your IELTS preparation."
    >
      <motion.section
        className="px-6 md:px-20 py-16 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-bold text-gray-100 mb-6">AIELTS Prep Blog</h1>
        <p className="text-gray-300 mb-8 text-sm">
          Stay updated with the latest IELTS tips, strategies, and AI-driven insights to help you achieve your target band score.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Top 5 IELTS Writing Tips for 2025',
              date: 'July 10, 2025',
              excerpt: 'Learn the latest strategies to boost your IELTS Writing score with AI feedback.',
              link: '/blog/top-5-writing-tips',
            },
            {
              title: 'How to Ace the IELTS Speaking Test',
              date: 'July 5, 2025',
              excerpt: 'Master the speaking section with AI-powered practice and feedback.',
              link: '/blog/ace-speaking-test',
            },
            {
              title: 'Understanding IELTS Band Scores',
              date: 'June 30, 2025',
              excerpt: 'Get insights into how band scores work and how to improve yours.',
              link: '/blog/understanding-band-scores',
            },
          ].map((post, i) => (
            <motion.div
              key={i}
              className="bg-gray-800/70 p-6 rounded-xl hover:border-orange-500 border border-transparent transition hover:bg-gray-800/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-100">
                <Link href={post.link}>{post.title}</Link>
              </h3>
              <p className="text-gray-400 text-sm mb-2">{post.date}</p>
              <p className="text-gray-300 text-sm">{post.excerpt}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/blog/all">
            <button
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
              aria-label="View All Blog Posts"
            >
              View All Posts
            </button>
          </Link>
        </div>
      </motion.section>
    </Layout>
  );
}