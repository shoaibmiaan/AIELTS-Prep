import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { BookOpen, Headphones, Mic, Pencil, Clock, Award, BarChart, CheckCircle } from 'lucide-react';

const modules = [
  {
    title: 'Reading',
    icon: BookOpen,
    color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    description: 'Academic passages with comprehension questions',
    time: '60 minutes',
    questions: 40,
  },
  {
    title: 'Listening',
    icon: Headphones,
    color: 'bg-gradient-to-r from-green-500 to-teal-600',
    description: 'Recordings with multiple-choice and matching questions',
    time: '30 minutes',
    questions: 40,
  },
  {
    title: 'Speaking',
    icon: Mic,
    color: 'bg-gradient-to-r from-yellow-500 to-orange-600',
    description: 'Face-to-face interview with an examiner',
    time: '11-14 minutes',
    questions: 3,
  },
  {
    title: 'Writing',
    icon: Pencil,
    color: 'bg-gradient-to-r from-purple-500 to-pink-600',
    description: 'Essay writing and report tasks',
    time: '60 minutes',
    questions: 2,
  },
];

export default function StartTestPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            IELTS Test Simulation
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Experience a realistic IELTS test environment with full-length practice tests
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Test Modules</h2>

            <div className="space-y-6">
              {modules.map((module, index) => (
                <motion.div
                  key={index}
                  className="flex items-start p-6 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${module.color} text-white`}>
                    <module.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{module.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{module.description}</p>
                    <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="mr-4">{module.time}</span>
                      <Award className="w-4 h-4 mr-1" />
                      <span>{module.questions} questions</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Test Options</h2>

            <div className="space-y-8">
              <motion.div
                className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 p-6 rounded-xl border border-blue-200 dark:border-blue-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-start">
                  <div className="bg-blue-500 dark:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                    <BarChart className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Practice Test</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      Take individual modules at your own pace with instant feedback and explanations
                    </p>
                    <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                        <span>No time limit</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                        <span>Detailed answer explanations</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                        <span>Instant scoring</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                        <span>Focus on specific skills</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/practice')}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Start Practice Test
                </button>
              </motion.div>

              <motion.div
                className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 p-6 rounded-xl border border-purple-200 dark:border-purple-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-start">
                  <div className="bg-purple-500 dark:bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Full Simulation</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      Experience the complete IELTS test under timed conditions with realistic scoring
                    </p>
                    <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-purple-500 mr-2" />
                        <span>Timed test conditions</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-purple-500 mr-2" />
                        <span>Full 4-module test</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-purple-500 mr-2" />
                        <span>Official band score prediction</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-purple-500 mr-2" />
                        <span>Performance analytics</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/simulation')}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Start Full Simulation
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3">Ready for your IELTS journey?</h3>
              <p className="text-indigo-100 max-w-xl">
                Get personalized recommendations based on your test results and track your progress over time.
              </p>
            </div>
            <button
              className="mt-4 md:mt-0 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              onClick={() => router.push('/progress')}
            >
              View My Progress
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}