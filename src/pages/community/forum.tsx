'use client';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Forum() {
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState([
    { id: 1, title: 'Tips for IELTS Writing Task 2', author: 'Ayesha K.', date: '2025-07-12', replies: 15 },
    { id: 2, title: 'How to improve Speaking fluency?', author: 'Usman R.', date: '2025-07-11', replies: 8 },
    { id: 3, title: 'Best resources for Listening practice', author: 'Fatima S.', date: '2025-07-10', replies: 12 },
  ]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout
      title="AIELTS Prep – Community Forum"
      description="Join our community forum to discuss IELTS strategies, share tips, and connect with peers."
    >
      <motion.section
        className="px-6 md:px-20 py-16 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-6">Community Forum</h1>
        <p className="text-gray-300 mb-8 text-sm">
          Engage with IELTS aspirants worldwide, share your experiences, and get expert advice.
        </p>
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search forum posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900/50 text-white rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
            aria-label="Search forum posts"
          />
        </div>
        <div className="space-y-6 mb-12">
          {filteredPosts.length === 0 ? (
            <p className="text-gray-400 text-sm">No posts found.</p>
          ) : (
            filteredPosts.map((post, i) => (
              <motion.div
                key={post.id}
                className="bg-gray-800/70 p-6 rounded-xl hover:border-orange-500 border border-transparent transition hover:bg-gray-800/90"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  <Link href={`/community/forum/${post.id}`}>{post.title}</Link>
                </h3>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>By {post.author}</span>
                  <span>{post.date} • {post.replies} Replies</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
        <div className="text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/community/forum/new">
              <button
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
                aria-label="Create New Post"
              >
                Create New Post
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </Layout>
  );
}