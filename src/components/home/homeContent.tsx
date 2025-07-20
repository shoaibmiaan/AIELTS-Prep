import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

interface UserProgress {
  writing: number;
  listening: number;
  speaking: number;
  reading: number;
  overall: number;
  targetBand: number;
}

interface Lesson {
  id: number;
  title: string;
  module: string;
  duration: string;
  progress: number;
  locked: boolean;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  score: number;
  date: string;
  improvement: string;
}

interface WritingSample {
  id: number;
  task: string;
  band: number;
  date: string;
  wordCount: number;
  feedback: boolean;
}

interface CommunityPost {
  id: number;
  title: string;
  comments: number;
  author: string;
  time: string;
}

interface MockTest {
  id: number;
  type: string;
  date: string;
  score: number;
  timeSpent: string;
}

interface homeContentProps {
  user: any;
  darkMode: boolean;
  navigateTo: (route: string) => void;
  startMockTest: () => void;
  analyzeWriting: () => void;
  startSpeakingPractice: () => void;
  viewWritingFeedback: (id: number) => void;
  continueLesson: (id: number) => void;
}

export default function homeContent({
  user,
  darkMode,
  navigateTo,
  startMockTest,
  analyzeWriting,
  startSpeakingPractice,
  viewWritingFeedback,
  continueLesson
}: homeContentProps) {
  const router = useRouter();

  const [userProgress, setUserProgress] = useState<UserProgress>({
    writing: user ? 65 : 30,
    listening: user ? 45 : 0,
    speaking: user ? 30 : 0,
    reading: user ? 70 : 45,
    overall: user ? 6.5 : 5.0,
    targetBand: user ? 7.5 : 6.0
  });

  const [studyPlan, setStudyPlan] = useState<Lesson[]>([
    { id: 1, title: 'Complex Sentences', module: 'Writing', duration: '25 min', progress: user ? 65 : 30, locked: false },
    { id: 2, title: 'Map Labelling', module: 'Listening', duration: '35 min', progress: user ? 45 : 0, locked: !user },
    { id: 3, title: 'Part 3 Strategies', module: 'Speaking', duration: '45 min', progress: user ? 30 : 0, locked: false },
    { id: 4, title: 'True/False/Not Given', module: 'Reading', duration: '40 min', progress: 0, locked: true }
  ]);

  const [recentActivities, setRecentActivities] = useState<Activity[]>(
    user ? [
      { id: 1, type: 'writing', title: 'Writing Task 2 Evaluation', score: 6.0, date: '2 hours ago', improvement: '+0.5 from last' },
      { id: 2, type: 'mock', title: 'Full Mock Test', score: 6.5, date: '1 day ago', improvement: '+1.0 from last' },
      { id: 3, type: 'speaking', title: 'Speaking Part 2 Practice', score: 5.5, date: '3 days ago', improvement: '+0.5 from last' }
    ] : []
  );

  const [writingSamples, setWritingSamples] = useState<WritingSample[]>(
    user ? [
      { id: 1, task: 'Task 2 - Opinion Essay', band: 6.0, date: 'Jul 15', wordCount: 265, feedback: true },
      { id: 2, task: 'Task 1 - Line Graph', band: 6.5, date: 'Jul 10', wordCount: 187, feedback: true },
      { id: 3, task: 'Task 2 - Discussion Essay', band: 5.5, date: 'Jul 5', wordCount: 243, feedback: false }
    ] : []
  );

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    { id: 1, title: 'How to improve speaking fluency quickly?', comments: 42, author: 'Rajesh', time: '2 hours ago' },
    { id: 2, title: 'Writing Task 2 sample answer review', comments: 18, author: 'Maria', time: '5 hours ago' },
    { id: 3, title: 'Listening section 3 strategies', comments: 7, author: 'Ahmed', time: '1 day ago' }
  ]);

  const [mockTests, setMockTests] = useState<MockTest[]>(
    user ? [
      { id: 1, type: 'Full Test', date: 'Jul 16', score: 6.5, timeSpent: '2h 45m' },
      { id: 2, type: 'Reading Only', date: 'Jul 12', score: 7.0, timeSpent: '1h 05m' },
      { id: 3, type: 'Listening Only', date: 'Jul 8', score: 6.5, timeSpent: '40m' }
    ] : []
  );

  // Animate progress rings
  useEffect(() => {
    const animateProgressRing = (id: string, percent: number) => {
      const circle = document.querySelector(`#${id}`) as SVGCircleElement;
      if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference.toString();

        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset.toString();
      }
    };

    animateProgressRing('writing-progress', userProgress.writing);
    animateProgressRing('listening-progress', userProgress.listening);
    animateProgressRing('speaking-progress', userProgress.speaking);
    animateProgressRing('reading-progress', userProgress.reading);
    animateProgressRing('overall-progress', (userProgress.overall / 9) * 100);
    animateProgressRing('target-progress', (userProgress.targetBand / 9) * 100);
  }, [userProgress]);

  // Update target band
  const updateTargetBand = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserProgress({
      ...userProgress,
      targetBand: parseFloat(e.target.value)
    });
    toast.success('Target band updated!');
  };

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 md:p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user?.email?.split('@')[0]}!</h1>
            <p className="mb-4 opacity-90">Keep up your 7-day streak! Practice today to maintain it.</p>
            <div className="flex flex-wrap gap-2">
              <button
                className="bg-white text-yellow-600 px-4 py-2 rounded-md font-medium"
                onClick={startMockTest}
              >
                Take Mock Test
              </button>
              <button
                className="bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-md font-medium"
                onClick={() => navigateTo('/courses')}
              >
                Continue Learning
              </button>
              <button
                className="bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-md font-medium"
                onClick={analyzeWriting}
              >
                Analyze Writing
              </button>
              <button
                className="bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-md font-medium"
                onClick={startSpeakingPractice}
              >
                Speaking Practice
              </button>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="text-center mr-6">
              <div className="text-3xl font-bold">7</div>
              <div className="text-sm opacity-80">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{userProgress.overall}</div>
              <div className="text-sm opacity-80">Current Band</div>
            </div>
          </div>
        </div>
      </div>

      {/* Your Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">Your Progress Overview</h2>
              <button
                className="text-yellow-600 dark:text-yellow-400 text-sm font-medium"
                onClick={() => navigateTo('/progress')}
              >
                View Details →
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Writing Progress */}
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="2"></circle>
                    <circle
                      id="writing-progress"
                      className="progress-ring__circle"
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    ></circle>
                    <text x="18" y="20" textAnchor="middle" fontSize="10" fill={darkMode ? "#ffffff" : "#1f2937"}>
                      {userProgress.writing}%
                    </text>
                  </svg>
                </div>
                <h3 className="font-medium dark:text-white">Writing</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Band {userProgress.overall - 0.5}</p>
              </div>

              {/* Listening Progress */}
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="2"></circle>
                    <circle
                      id="listening-progress"
                      className="progress-ring__circle"
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                    ></circle>
                    <text x="18" y="20" textAnchor="middle" fontSize="10" fill={darkMode ? "#ffffff" : "#1f2937"}>
                      {userProgress.listening}%
                    </text>
                  </svg>
                </div>
                <h3 className="font-medium dark:text-white">Listening</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Band {userProgress.overall + 0.5}</p>
              </div>

              {/* Speaking Progress */}
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="2"></circle>
                    <circle
                      id="speaking-progress"
                      className="progress-ring__circle"
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    ></circle>
                    <text x="18" y="20" textAnchor="middle" fontSize="10" fill={darkMode ? "#ffffff" : "#1f2937"}>
                      {userProgress.speaking}%
                    </text>
                  </svg>
                </div>
                <h3 className="font-medium dark:text-white">Speaking</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Band {userProgress.overall}</p>
              </div>

              {/* Reading Progress */}
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="2"></circle>
                    <circle
                      id="reading-progress"
                      className="progress-ring__circle"
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    ></circle>
                    <text x="18" y="20" textAnchor="middle" fontSize="10" fill={darkMode ? "#ffffff" : "#1f2937"}>
                      {userProgress.reading}%
                    </text>
                  </svg>
                </div>
                <h3 className="font-medium dark:text-white">Reading</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Band {userProgress.overall + 0.5}</p>
              </div>
            </div>
          </div>

          {/* Study Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">Your Study Plan</h2>
              <button
                className="text-yellow-600 dark:text-yellow-400 text-sm font-medium"
                onClick={() => navigateTo('/courses')}
              >
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {studyPlan.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-lg border ${lesson.locked ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700' : 'border-yellow-100 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900'} transition-all duration-300`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-medium ${lesson.locked ? 'text-gray-500 dark:text-gray-400' : 'dark:text-white'}`}>
                        {lesson.title}
                        {lesson.locked && <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">Locked</span>}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {lesson.module} • {lesson.duration}
                      </p>
                    </div>
                    {!lesson.locked && (
                      <button
                        className="text-yellow-600 dark:text-yellow-400 text-sm font-medium"
                        onClick={() => continueLesson(lesson.id)}
                      >
                        {lesson.progress > 0 ? 'Continue' : 'Start'}
                      </button>
                    )}
                  </div>
                  {lesson.progress > 0 && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${lesson.module === 'Writing' ? 'bg-yellow-500' : lesson.module === 'Listening' ? 'bg-purple-500' : lesson.module === 'Speaking' ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${lesson.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {lesson.progress}% complete
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Writing Samples */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">Recent Writing Samples</h2>
              <button
                className="text-yellow-600 dark:text-yellow-400 text-sm font-medium"
                onClick={analyzeWriting}
              >
                + New Sample →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Task</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Band</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Words</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Feedback</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {writingSamples.map((sample) => (
                    <tr key={sample.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => viewWritingFeedback(sample.id)}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium dark:text-white">{sample.task}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${sample.band >= 6.5 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : sample.band >= 5.5 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
                          {sample.band}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{sample.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{sample.wordCount}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {sample.feedback ? (
                          <i className="fas fa-check-circle text-green-500"></i>
                        ) : (
                          <i className="fas fa-clock text-yellow-500"></i>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Tools Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Experience Our AI Tools</h2>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Writing Checker */}
              <div className="md:w-1/2 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 flex items-center dark:text-white">
                  <i className="fas fa-edit text-yellow-600 dark:text-yellow-400 mr-2"></i> Writing Checker
                </h3>
                <textarea
                  className="w-full h-40 p-3 border rounded-md mb-4 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  placeholder="Paste your IELTS essay here..."
                >
                  The internet has revolutionized how we communicate. Some argue it has made relationships stronger, while others believe it causes isolation. In my opinion, the internet brings people together despite physical distances.
                </textarea>
                <button
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md font-medium"
                  onClick={analyzeWriting}
                >
                  Analyze My Writing
                </button>
              </div>

              {/* Speaking Analyzer */}
              <div className="md:w-1/2 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 flex items-center dark:text-white">
                  <i className="fas fa-microphone-alt text-purple-600 dark:text-purple-400 mr-2"></i> Speaking Analyzer
                </h3>
                <div className="bg-white dark:bg-gray-600 rounded-md p-4 mb-4 text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-3">Describe a time you helped someone</p>
                  <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium mb-2"
                    onClick={startSpeakingPractice}
                  >
                    <i className="fas fa-microphone mr-2"></i> Record Response
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400">(Sample: 45 seconds)</p>
                </div>
                <button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-medium"
                  onClick={startSpeakingPractice}
                >
                  Analyze My Speaking
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Quick Actions</h2>
            <div className="space-y-3">
              <button
                className="w-full flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-800 transition-colors"
                onClick={startMockTest}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center mr-4">
                    <i className="fas fa-clock text-yellow-600 dark:text-yellow-400"></i>
                  </div>
                  <span className="font-medium dark:text-white">Take Mock Test</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
              <button
                className="w-full flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
                onClick={startSpeakingPractice}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center mr-4">
                    <i className="fas fa-microphone-alt text-purple-600 dark:text-purple-400"></i>
                  </div>
                  <span className="font-medium dark:text-white">Speaking Practice</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
              <button
                className="w-full flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                onClick={analyzeWriting}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mr-4">
                    <i className="fas fa-edit text-blue-600 dark:text-blue-400"></i>
                  </div>
                  <span className="font-medium dark:text-white">Analyze Writing</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
              <button
                className="w-full flex items-center justify-between p-4 bg-green-50 dark:bg-green-900 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
                onClick={() => navigateTo('/vocabulary')}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mr-4">
                    <i className="fas fa-book text-green-600 dark:text-green-400"></i>
                  </div>
                  <span className="font-medium dark:text-white">Vocabulary Builder</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${activity.type === 'writing' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400' : activity.type === 'speaking' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'}`}>
                    {activity.type === 'writing' ? (
                      <i className="fas fa-edit"></i>
                    ) : activity.type === 'speaking' ? (
                      <i className="fas fa-microphone-alt"></i>
                    ) : (
                      <i className="fas fa-clipboard-list"></i>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium dark:text-white">{activity.title}</h3>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${activity.score >= 6.5 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : activity.score >= 5.5 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
                        Band {activity.score}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</span>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">{activity.improvement}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Band */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Target Band Score</h2>
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="2"></circle>
                  <circle
                    id="overall-progress"
                    className="progress-ring__circle"
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                  ></circle>
                  <circle
                    id="target-progress"
                    className="progress-ring__circle"
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="100 100"
                    strokeDashoffset="17"
                  ></circle>
                  <text x="18" y="18" textAnchor="middle" fontSize="12" fill={darkMode ? "#ffffff" : "#1f2937"} dy=".3em" fontWeight="bold">
                    {userProgress.overall}
                  </text>
                  <text x="18" y="24" textAnchor="middle" fontSize="8" fill={darkMode ? "#d1d5db" : "#6b7280"} dy=".3em">
                    Current
                  </text>
                </svg>
              </div>
              <div className="mb-4">
                <label htmlFor="targetBand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Target Band
                </label>
                <select
                  id="targetBand"
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={userProgress.targetBand}
                  onChange={updateTargetBand}
                >
                  <option value="6.0">6.0</option>
                  <option value="6.5">6.5</option>
                  <option value="7.0">7.0</option>
                  <option value="7.5">7.5</option>
                  <option value="8.0">8.0</option>
                  <option value="8.5">8.5</option>
                  <option value="9.0">9.0</option>
                </select>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                You're {(userProgress.overall / userProgress.targetBand * 100).toFixed(0)}% to your target
              </div>
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md font-medium">
                Update Goal
              </button>
            </div>
          </div>

          {/* Community Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Community Discussions</h2>
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div key={post.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                  <h3 className="font-medium text-yellow-600 dark:text-yellow-400">{post.title}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <span>{post.author}</span>
                    <span className="mx-2">•</span>
                    <span>{post.time}</span>
                    <span className="ml-auto flex items-center">
                      <i className="far fa-comment mr-1"></i> {post.comments}
                    </span>
                  </div>
                </div>
              ))}
              <button
                className="w-full mt-4 text-yellow-600 dark:text-yellow-400 font-medium text-sm"
                onClick={() => navigateTo('/community')}
              >
                View all discussions →
              </button>
            </div>
          </div>

          {/* Mock Test History */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Mock Test History</h2>
            <div className="space-y-3">
              {mockTests.map((test) => (
                <div key={test.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-medium dark:text-white">{test.type}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{test.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${test.score >= 6.5 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}`}>
                      Band {test.score}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{test.timeSpent}</p>
                  </div>
                </div>
              ))}
              <button
                className="w-full mt-2 text-yellow-600 dark:text-yellow-400 font-medium text-sm"
                onClick={() => navigateTo('/mock-tests')}
              >
                View full history →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
