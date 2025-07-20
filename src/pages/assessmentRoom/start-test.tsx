import React, { useState } from 'react';
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

export default function AssessmentRoom() {
  const router = useRouter();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const handleModuleSelect = (module: string) => {
    setSelectedModule(module);
  };

  const handlePracticeStart = () => {
    if (!selectedModule) {
      alert('Please select a module first from the Test Modules section.');
      return;
    }
    router.push(`/assessmentRoom/library?module=${selectedModule}`);
  };

  const handleSimulationStart = () => {
    if (!selectedModule) {
      alert('Please select a module first from the Test Modules section.');
      return;
    }
    router.push(`/assessmentRoom/simulation?module=${selectedModule}`);
  };

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
            Assessment Room
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Prepare for your IELTS test by selecting a module and choosing a practice or simulation mode
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
                  className={`flex items-start p-6 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow ${selectedModule === module.title ? 'border-2 border-blue-500' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleModuleSelect(module.title)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${module.color} text-white`}>
                    <module.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4 flex-1">
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
                  </div>
                </div>
                <button
                  onClick={handlePracticeStart}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  disabled={!selectedModule}
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
                  </div>
                </div>
                <button
                  onClick={handleSimulationStart}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  disabled={!selectedModule}
                >
                  Start Full Simulation
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
