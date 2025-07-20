'use client';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient'; // Ensure this path is correct

export default function NewPost() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (!supabase) {
    return (
      <Layout
        title="AIELTS Prep – Create New Forum Post"
        description="Create a new post in the AIELTS Prep community forum to share your IELTS tips and experiences."
      >
        <motion.section
          className="px-6 md:px-20 py-16 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-6">Create New Post</h1>
          <p className="text-red-400 text-sm mb-4">Supabase client is not initialized. Check your configuration.</p>
        </motion.section>
      </Layout>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to create a post.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error: insertError } = await supabase
        .from('forum_posts')
        .insert({
          title,
          content,
          user_id: user.id,
          created_at: new Date().toISOString(),
          replies: 0,
        });

      if (insertError) throw insertError;
      setSuccess('Post created successfully!');
      setTitle('');
      setContent('');
    } catch (err) {
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout
        title="AIELTS Prep – Create New Forum Post"
        description="Create a new post in the AIELTS Prep community forum to share your IELTS tips and experiences."
      >
        <motion.section
          className="px-6 md:px-20 py-16 bg-black/70 backdrop-blur-sm dark:bg-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 dark:text-gray-800 mb-6">Create New Post</h1>
          <p className="text-red-400 dark:text-red-600 text-sm mb-4">You must be logged in to create a post.</p>
          <div className="text-center">
            <Link href="/login">
              <button
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 dark:bg-orange-400 dark:hover:bg-orange-500 text-white dark:text-gray-800 font-semibold rounded-lg transition"
                aria-label="Log in to create post"
              >
                Log In
              </button>
            </Link>
          </div>
        </motion.section>
      </Layout>
    );
  }

  return (
    <Layout
      title="AIELTS Prep – Create New Forum Post"
      description="Create a new post in the AIELTS Prep community forum to share your IELTS tips and experiences."
    >
      <motion.section
        className="px-6 md:px-20 py-16 bg-black/70 backdrop-blur-sm dark:bg-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 dark:text-gray-800 mb-6">Create New Post</h1>
        <p className="text-gray-300 dark:text-gray-600 mb-8 text-sm">
          Share your IELTS insights or ask a question to connect with the community.
        </p>
        <div className="mb-4 text-right">
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-full bg-gray-700 dark:bg-gray-200 text-white dark:text-black"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
        {success && <p className="text-green-400 dark:text-green-600 text-sm mb-4">{success}</p>}
        {error && <p className="text-red-400 dark:text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="bg-gray-800/70 dark:bg-gray-200/70 p-6 rounded-xl">
          <div className="mb-6">
            <label htmlFor="title" className="block text-gray-300 dark:text-gray-700 text-sm mb-2">Post Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900/50 dark:bg-gray-100/50 text-white dark:text-gray-800 rounded-lg border border-gray-700 dark:border-gray-300 focus:border-orange-500 dark:focus:border-orange-400 focus:outline-none"
              required
              aria-label="Post title"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="content" className="block text-gray-300 dark:text-gray-700 text-sm mb-2">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900/50 dark:bg-gray-100/50 text-white dark:text-gray-800 rounded-lg border border-gray-700 dark:border-gray-300 focus:border-orange-500 dark:focus:border-orange-400 focus:outline-none"
              rows={6}
              required
              aria-label="Post content"
            ></textarea>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 dark:bg-orange-400 dark:hover:bg-orange-500 text-white dark:text-gray-800 font-semibold rounded-lg transition disabled:bg-gray-600 dark:disabled:bg-gray-300 disabled:cursor-not-allowed"
              aria-label="Submit new post"
            >
              {loading ? 'Submitting...' : 'Submit Post'}
            </button>
          </motion.div>
        </form>
        <div className="mt-6 text-center">
          <Link href="/community/forum">
            <button
              className="px-6 py-3 border border-orange-500 text-orange-400 dark:text-orange-500 hover:bg-orange-500 dark:hover:bg-orange-400 hover:text-white dark:hover:text-gray-800 font-semibold rounded-lg transition"
              aria-label="Back to Forum"
            >
              Back to Forum
            </button>
          </Link>
        </div>
      </motion.section>
    </Layout>
  );
}