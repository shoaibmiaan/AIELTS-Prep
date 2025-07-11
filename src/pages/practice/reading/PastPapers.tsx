'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

interface PastPaper {
  id: string;
  title: string;
  instructions: string | null;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PastPapersPage() {
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const { data, error } = await supabase
          .from('reading_papers')
          .select('id, title, instructions')
          .eq('status', 'published');

        if (error) throw error;
        setPapers(data || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching papers.');
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  if (error) {
    return (
      <motion.div
        className="p-6 text-center text-red-600 dark:text-red-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {error}
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        className="p-6 text-center text-gray-600 dark:text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading papers...
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-6 bg-white dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <BookOpen /> IELTS Past Papers
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {papers.map((paper) => (
          <motion.div
            key={paper.id}
            className="border rounded-lg p-6 shadow-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">{paper.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{paper.instructions || 'No instructions provided.'}</p>
            <Link
              href={`/practice/reading/${paper.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Start Test
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}