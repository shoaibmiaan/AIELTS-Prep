'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import LoginModal from '@/components/home/LoginModal';

export default function IELTSCoursePage() {
  const router = useRouter();
  const { courseId } = router.query;
  const { user } = useAuth();

  // UI State
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Course Data with safe initialization
  const [course, setCourse] = useState({
    id: courseId || '',
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
  ]);

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
      toast.success('Successfully enrolled in course!');
      setLessons(lessons.map(l => ({ ...l, locked: false })));
    }
  };

  return (
    <div className="font-sans bg-background text-foreground transition-colors duration-300 min-h-screen">
      <Head>
        <title>{course.title} | IELTS Master</title>
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-2/3">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                Grammar Course
              </span>
              <span className="text-muted">
                {course.rating} ★ ({course.enrolled.toLocaleString()} students)
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {course.title}
            </h1>

            <p className="text-lg text-muted mb-6">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <i className="fas fa-chalkboard-teacher text-secondary"></i>
                <span className="text-muted">{course.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-book-open text-secondary"></i>
                <span className="text-muted">{course.totalLessons} lessons</span>
              </div>
            </div>

            {user ? (
              <div className="w-full bg-muted/20 rounded-full h-4 mb-4">
                <div
                  className="bg-secondary h-4 rounded-full"
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
                      className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Continue Learning
                    </button>
                  )}
                  <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Save for Later
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={enrollCourse}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Enroll for Free
                  </button>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Preview Course
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Course Content</h2>

          <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`border-b border-border last:border-0 ${lesson.locked ? 'opacity-70' : ''}`}
              >
                <div className="flex items-center p-4 hover:bg-background/50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    {lesson.completed ? (
                      <div className="w-full h-full rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <i className="fas fa-check text-green-600 dark:text-green-400"></i>
                      </div>
                    ) : (
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${
                        lesson.locked ? 'bg-muted/20' : 'bg-primary/10'
                      }`}>
                        <i className={`fas ${
                          lesson.locked ? 'fa-lock text-muted' :
                          lesson.type === 'video' ? 'fa-play text-primary' : 'fa-mouse-pointer text-primary'
                        }`}></i>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <h3 className={`font-medium ${
                      lesson.locked ? 'text-muted' : 'text-foreground'
                    }`}>
                      {index + 1}. {lesson.title}
                      {lesson.preview && !lesson.locked && (
                        <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                          Free Preview
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted">
                      {lesson.duration} • {lesson.type === 'video' ? 'Video Lesson' : 'Interactive Exercise'}
                    </p>
                  </div>

                  <button
                    onClick={() => startLesson(lesson.id)}
                    disabled={lesson.locked}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      lesson.locked ?
                        'text-muted cursor-not-allowed' :
                        'text-primary hover:bg-primary/10'
                    }`}
                  >
                    {lesson.completed ? 'Review' : 'Start'}
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
      />
    </div>
  );
}