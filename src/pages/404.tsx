// pages/404.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import Head from 'next/head';

const PageNotFound = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Page Not Found - IELTS Master</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
        <div className="max-w-3xl w-full text-center">
          {/* Animated floating elements */}
          <div className="relative mb-12">
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 left-1/4"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">❓</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-9xl font-bold text-primary dark:text-primary-light">
                4
                <motion.span
                  animate={{ rotate: [0, 20, 0, -20, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  0
                </motion.span>
                4
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 right-1/4"
            >
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </motion.div>
          </div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Oops! Looks like you've wandered off the test path
          </motion.h1>

          <motion.p
            className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            This page seems to be more elusive than band 9 vocabulary.
            While our digital examiners search for it, why not try one of these
            band-boosting alternatives?
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Writing Evaluator</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get instant band score feedback on your essays
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/writing')}
              >
                Try Now
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Speaking Simulator</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Practice with our AI examiner
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/speaking')}
              >
                Start Practice
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Mock Test</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Full IELTS practice test with scoring
              </p>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => router.push('/test')}
              >
                Take Test
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push('/')}
            >
              <span className="mr-2">🏠</span> Return to Home Page
            </Button>

            <div className="mt-8 text-gray-600 dark:text-gray-400 text-sm">
              <p>If you were looking for a specific resource, it might have:</p>
              <ul className="flex flex-wrap justify-center gap-4 mt-2">
                <li className="flex items-center">
                  <span className="mr-2">✏️</span> Been misspelled
                </li>
                <li className="flex items-center">
                  <span className="mr-2">⏱️</span> Timed out
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🧪</span> Moved during an experiment
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🌍</span> Gone on a gap year
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Floating footer */}
        <motion.div
          className="mt-16 text-gray-500 dark:text-gray-500 text-sm"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          Error Code: 404 - PAGE_NOT_FOUND | Our digital examiner is baffled
        </motion.div>
      </div>
    </>
  );
};

export default PageNotFound;