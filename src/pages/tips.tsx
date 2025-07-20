'use client';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

export default function Tips() {
  return (
    <Layout
      title="AIELTS Prep – IELTS Tips"
      description="Discover expert tips and AI-driven strategies to excel in your IELTS exam."
    >
      <motion.section
        className="px-6 md:px-20 py-16 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-bold text-gray-100 mb-6">IELTS Tips & Strategies</h1>
        <p className="text-gray-300 mb-8 text-sm">
          Boost your IELTS performance with expert advice and AI-powered insights tailored to your needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Mastering IELTS Writing',
              tips: [
                'Use AI feedback to refine your essays.',
                'Practice with timed tasks to improve speed.',
                'Focus on coherence and task response.',
              ],
            },
            {
              title: 'Excelling in IELTS Speaking',
              tips: [
                'Record and analyze your answers with AI tools.',
                'Practice common question types daily.',
                'Work on fluency and pronunciation.',
              ],
            },
            {
              title: 'Acing IELTS Reading',
              tips: [
                'Use AI to identify weak areas in comprehension.',
                'Practice skimming and scanning techniques.',
                'Manage your time effectively during tests.',
              ],
            },
            {
              title: 'Improving IELTS Listening',
              tips: [
                'Leverage AI to practice with diverse accents.',
                'Take notes while listening to mock tests.',
                'Review incorrect answers with detailed feedback.',
              ],
            },
          ].map((category, i) => (
            <motion.div
              key={i}
              className="bg-gray-800/70 p-6 rounded-xl hover:border-orange-500 border border-transparent transition hover:bg-gray-800/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-100">{category.title}</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                {category.tips.map((tip, j) => (
                  <li key={j}>✔ {tip}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </Layout>
  );
}