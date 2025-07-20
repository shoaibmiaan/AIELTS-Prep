import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginModal from '@/components/home/LoginModal';

export default function IELTSCoursePage() {
  const router = useRouter();
  const { courseId } = router.query;
  const { user, logout } = useAuth();

  // UI State
  const [darkMode, setDarkMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('course');

  // Course Data
  const [course, setCourse] = useState({
    id: courseId,
    title: 'Grammar Mastery for IELTS',
    description: 'Master essential grammar rules to boost your writing and speaking scores',
    progress: user ? 45 : 0,
    totalLessons: 12,
    completedLessons: user ? 5 : 0,
    instructor: 'Dr. Sarah Johnson',
    rating: 4.8,
    enrolled: 12450,
    lastAccessed: user ? 'Complex Sentences' : null
  });

  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: 'Introduction to IELTS Grammar',
      duration: '15 min',
      type: 'video',
      completed: true,
      locked: false,
      preview: false
    },
    {
      id: 2,
      title: 'Sentence Structures',
      duration: '25 min',
      type: 'interactive',
      completed: true,
      locked: false,
      preview: false
    },
    {
      id: 3,
      title: 'Complex Sentences',
      duration: '30 min',
      type: 'video',
      completed: user ? true : false,
      locked: !user,
      preview: true
    },
    {
      id: 4,
      title: 'Conditional Sentences',
      duration: '35 min',
      type: 'interactive',
      completed: false,
      locked: !user,
      preview: false
    },
    // ... more lessons
  ]);

  const [relatedCourses, setRelatedCourses] = useState([
    {
      id: 'writing101',
      title: 'Academic Writing Masterclass',
      lessons: 15,
      progress: 0,
      thumbnail: '/courses/writing-thumb.jpg'
    },
    {
      id: 'speaking202',
      title: 'Speaking Fluency Builder',
      lessons: 10,
      progress: 0,
      thumbnail: '/courses/speaking-thumb.jpg'
    }
  ]);

  // Initialize dark mode (same as homepage)
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedMode === 'true' || (!savedMode && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Fetch course data based on courseId
    // This would be replaced with actual API call
    if (courseId) {
      // setCourse(fetchCourse(courseId))
    }
  }, [courseId]);

  // Toggle dark mode (same as homepage)
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Navigation handlers (similar to homepage)
  const handleProtectedClick = (route: string) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      router.push(route);
    }
  };

  const navigateTo = (route: string) => {
    setActiveTab(route);
    router.push(`/dashboard/${route}`);
  };

  // Course specific handlers
  const startLesson = (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson && !lesson.locked) {
      router.push(`/courses/${courseId}/lessons/${lessonId}`);
    } else if (lesson?.locked) {
      toast.error('Please sign in to access this lesson');
      setShowLoginModal(true);
    }
  };

  const enrollCourse = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      // API call to enroll
      toast.success('Successfully enrolled in course!');
      setLessons(lessons.map(l => ({ ...l, locked: false })));
    }
  };

  return (
    <div className={`font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen`}>
      <Head>
        <title>{course.title} | IELTS Master</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>

      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        activeTab={activeTab}
        navigateTo={navigateTo}
        handleProtectedClick={handleProtectedClick}
        handleNavigation={() => {}}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-2/3">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-sm font-medium">
                Grammar Course
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {course.rating} ★ ({course.enrolled.toLocaleString()} students)
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {course.title}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <i className="fas fa-chalkboard-teacher text-amber-500"></i>
                <span className="text-gray-700 dark:text-gray-300">{course.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-book-open text-amber-500"></i>
                <span className="text-gray-700 dark:text-gray-300">{course.totalLessons} lessons</span>
              </div>
            </div>

            {user ? (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                <div
                  className="bg-amber-500 h-4 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            ) : null}

            <div className="flex gap-4">
              {user ? (
                <>
                  {course.lastAccessed && (
                    <button
                      onClick={() => startLesson(lessons.find(l => l.title === course.lastAccessed)?.id || 0)}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Continue Learning
                    </button>
                  )}
                  <button className="px-6 py-3 border border-amber-500 text-amber-500 hover:bg-amber-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors">
                    <i className="fas fa-bookmark mr-2"></i>
                    Save for Later
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={enrollCourse}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Enroll for Free
                  </button>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-6 py-3 border border-amber-500 text-amber-500 hover:bg-amber-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors"
                  >
                    Preview Course
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="md:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="relative pb-[56.25%] bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fas fa-play-circle text-5xl text-amber-500 opacity-80"></i>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 dark:text-white">Course Preview</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Watch the introduction to see what you'll learn</p>
                <button className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors">
                  Play Preview
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Content</h2>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`border-b border-gray-200 dark:border-gray-700 last:border-0 ${lesson.locked ? 'opacity-70' : ''}`}
              >
                <div className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    {lesson.completed ? (
                      <div className="w-full h-full rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <i className="fas fa-check text-green-500 dark:text-green-300"></i>
                      </div>
                    ) : (
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${
                        lesson.locked ? 'bg-gray-100 dark:bg-gray-600' : 'bg-amber-100 dark:bg-amber-900'
                      }`}>
                        <i className={`fas ${
                          lesson.locked ? 'fa-lock text-gray-400' :
                          lesson.type === 'video' ? 'fa-play text-amber-500' : 'fa-mouse-pointer text-amber-500'
                        }`}></i>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <h3 className={`font-medium ${
                      lesson.locked ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      {index + 1}. {lesson.title}
                      {lesson.preview && !lesson.locked && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                          Free Preview
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {lesson.duration} • {lesson.type === 'video' ? 'Video Lesson' : 'Interactive Exercise'}
                    </p>
                  </div>

                  <button
                    onClick={() => startLesson(lesson.id)}
                    disabled={lesson.locked}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      lesson.locked ?
                        'text-gray-400 cursor-not-allowed' :
                        'text-amber-500 hover:bg-amber-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {lesson.completed ? 'Review' : 'Start'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Courses */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You Might Also Like</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedCourses.map(course => (
              <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative pb-[56.25%] bg-gray-200 dark:bg-gray-700">
                  {/* Thumbnail placeholder */}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 dark:text-white">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{course.lessons} lessons</p>
                  <button
                    onClick={() => router.push(`/courses/${course.id}`)}
                    className="text-amber-500 hover:text-amber-600 font-medium"
                  >
                    View Course →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        email={""}
        setEmail={() => {}}
        password={""}
        setPassword={() => {}}
        handleLogin={() => {}}
        handleFreePlan={() => {}}
        darkMode={darkMode}
      />

      <Footer
        handleNavigation={() => {}}
        handleProtectedClick={handleProtectedClick}
      />

      <style jsx global>{`
        html {
          transition: background-color 0.3s ease;
        }
        body {
          transition: background-color 0.3s ease;
        }
      `}</style>
    </div>
  );
}