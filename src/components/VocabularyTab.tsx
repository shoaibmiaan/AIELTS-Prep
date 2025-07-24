import ProgressBar from '@/components/ProgressBar';
import { Activity } from '@/types';

export default function VocabularyTab({
  userProgress,
  startVocabularyPractice,
  recentActivities
}: {
  userProgress: {
    vocabulary: number;
    reading: number;
    writing: number;
    speaking: number;
    listening: number;
  };
  startVocabularyPractice: () => void;
  recentActivities: Activity[];
}) {
  const vocabularyLevels = [
    { name: 'Beginner', words: '0-500' },
    { name: 'Elementary', words: '501-1000' },
    { name: 'Intermediate', words: '1001-2500' },
    { name: 'Upper Intermediate', words: '2501-5000' },
    { name: 'Advanced', words: '5001-7500' },
    { name: 'Proficient', words: '7500+' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vocabulary Progress */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Vocabulary Mastery
            </h2>
            <button
              onClick={startVocabularyPractice}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
            >
              Practice Now
            </button>
          </div>

          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Your Vocabulary Progress</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                {userProgress.vocabulary}%
              </span>
            </div>
            <ProgressBar progress={userProgress.vocabulary} color="indigo" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                Words Mastered
              </h3>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                1,250
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                +42 this week
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
                Current Level
              </h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                Intermediate
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                1001-2500 words
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Vocabulary Levels
            </h3>
            <div className="space-y-4">
              {vocabularyLevels.map((level, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    level.name === 'Intermediate'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {level.name}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {level.words}
                    </span>
                  </div>
                  {level.name === 'Intermediate' && (
                    <div className="mt-2">
                      <div className="h-2 bg-indigo-200 dark:bg-indigo-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 dark:bg-indigo-500"
                          style={{ width: `${(1250 - 1000) / (2500 - 1000) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                        Mastered 250 of 1500 words in this level
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recent Activities
          </h2>

          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    activity.action === 'Completed'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                      : activity.action === 'Learned'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                        : 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {activity.action} {activity.module}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.date}
                      </p>
                    </div>
                    {activity.score && (
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium">
                        {activity.score}
                      </span>
                    )}
                  </div>
                  {activity.improvement && (
                    <p className="text-sm mt-2 text-green-600 dark:text-green-400">
                      {activity.improvement}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                No recent activities yet
              </p>
              <button
                onClick={startVocabularyPractice}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-full transition duration-300"
              >
                Start Practicing
              </button>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Vocabulary Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Academic', 'Business', 'Technology', 'Environment', 'Health', 'Education', 'Travel', 'Culture'].map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
