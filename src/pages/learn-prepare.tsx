import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, Globe, Calendar, Headphones, Mic, Pencil, BarChart, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const categories = [
  {
    title: 'Reading Resources',
    icon: BookOpen,
    color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    resources: [
      {
        title: 'Academic Reading Strategies',
        type: 'Guide',
        duration: '15 min read',
        level: 'Intermediate',
      },
      {
        title: 'Skimming and Scanning Techniques',
        type: 'Video Lesson',
        duration: '12 min',
        level: 'Beginner',
      },
      {
        title: 'Practice Passages with Answers',
        type: 'Practice Test',
        duration: '60 min',
        level: 'Advanced',
      },
      {
        title: 'Vocabulary Builder for IELTS',
        type: 'Flashcards',
        duration: '30 min',
        level: 'All Levels',
      },
    ]
  },
  {
    title: 'Listening Materials',
    icon: Headphones,
    color: 'bg-gradient-to-r from-green-500 to-teal-600',
    resources: [
      {
        title: 'Common Listening Challenges',
        type: 'Article',
        duration: '10 min read',
        level: 'Beginner',
      },
      {
        title: 'Accent Training Exercises',
        type: 'Audio Course',
        duration: '8 modules',
        level: 'Intermediate',
      },
      {
        title: 'Practice Tests with Audio',
        type: 'Practice Test',
        duration: '30 min',
        level: 'Advanced',
      },
      {
        title: 'Note-taking Strategies',
        type: 'Video Tutorial',
        duration: '18 min',
        level: 'Intermediate',
      },
    ]
  },
  {
    title: 'Speaking Preparation',
    icon: Mic,
    color: 'bg-gradient-to-r from-yellow-500 to-orange-600',
    resources: [
      {
        title: 'Common Speaking Topics',
        type: 'Guide',
        duration: '20 min read',
        level: 'All Levels',
      },
      {
        title: 'Pronunciation Masterclass',
        type: 'Video Course',
        duration: '45 min',
        level: 'Intermediate',
      },
      {
        title: 'Fluency Development Exercises',
        type: 'Practice Drills',
        duration: 'Daily',
        level: 'Advanced',
      },
      {
        title: 'Sample Band 9 Answers',
        type: 'Audio Examples',
        duration: '30 min',
        level: 'Advanced',
      },
    ]
  },
  {
    title: 'Writing Skills',
    icon: Pencil,
    color: 'bg-gradient-to-r from-purple-500 to-pink-600',
    resources: [
      {
        title: 'Essay Structure Guide',
        type: 'Article',
        duration: '12 min read',
        level: 'Beginner',
      },
      {
        title: 'Task 1 Academic Templates',
        type: 'Templates',
        duration: 'Download',
        level: 'Intermediate',
      },
      {
        title: 'Grammar for High Scores',
        type: 'Video Course',
        duration: '35 min',
        level: 'Advanced',
      },
      {
        title: 'Sample Essays with Feedback',
        type: 'Examples',
        duration: '45 min',
        level: 'Advanced',
      },
    ]
  },
];

export default function LearnPreparePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('');

  const handleProtectedClick = (route: string) => {
    setCurrentPage(route);
    if (!user) {
      router.push('/login');
      toast('Please login to access this content', {
        icon: '🔒',
      });
    } else {
      router.push(route);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            IELTS Learning Resources
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Master all IELTS modules with our comprehensive study materials, practice tests, and expert strategies
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-8 mb-8 transition-all duration-300 hover:shadow-lg"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Study Plan</h2>

              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="bg-blue-100 dark:bg-blue-900/50 w-10 h-10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Daily Practice</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">30-60 minutes of focused practice</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="bg-green-100 dark:bg-green-900/50 w-10 h-10 rounded-full flex items-center justify-center">
                    <BarChart className="w-5 h-5 text-green-500 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Weekly Mock Tests</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Full simulation every Saturday</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="bg-yellow-100 dark:bg-yellow-900/50 w-10 h-10 rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Vocabulary Building</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Learn 20 new words daily</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="bg-purple-100 dark:bg-purple-900/50 w-10 h-10 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Review Sessions</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Sunday review of weekly progress</p>
                  </div>
                </div>
              </div>

              <button
                className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                onClick={() => handleProtectedClick('/dashboard/study-plan')}
              >
                Create Custom Study Plan
              </button>
            </motion.div>

            <motion.div
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold ml-4">Study Groups</h3>
              </div>
              <p className="mb-4 text-yellow-100">
                Join active study groups and collaborate with other IELTS learners
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
                  <div>
                    <h4 className="font-semibold">Reading Practice Group</h4>
                    <p className="text-sm text-yellow-100">12 active members</p>
                  </div>
                  <button
                    className="bg-white text-yellow-600 px-4 py-1 rounded text-sm font-medium hover:bg-opacity-90 transition-opacity"
                    onClick={() => handleProtectedClick('/dashboard/community/reading-group')}
                  >
                    Join
                  </button>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
                  <div>
                    <h4 className="font-semibold">Writing Feedback Exchange</h4>
                    <p className="text-sm text-yellow-100">8 active members</p>
                  </div>
                  <button
                    className="bg-white text-yellow-600 px-4 py-1 rounded text-sm font-medium hover:bg-opacity-90 transition-opacity"
                    onClick={() => handleProtectedClick('/dashboard/community/writing-group')}
                  >
                    Join
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <div>
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-lg"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Learning Resources</h2>

              <div className="space-y-8">
                {categories.map((category, catIndex) => (
                  <motion.div
                    key={catIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * catIndex }}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color} text-white`}>
                        <category.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white ml-3">{category.title}</h3>
                    </div>

                    <div className="space-y-3">
                      {category.resources.map((resource, resIndex) => (
                        <motion.div
                          key={resIndex}
                          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 * catIndex + 0.05 * resIndex }}
                          onClick={() => handleProtectedClick(`/dashboard/resources/${category.title.toLowerCase().replace(' ', '-')}/${resIndex}`)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-white">{resource.title}</h4>
                              <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded mr-2">
                                  {resource.type}
                                </span>
                                <span>{resource.duration}</span>
                              </div>
                            </div>
                            <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs px-2 py-1 rounded">
                              {resource.level}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}