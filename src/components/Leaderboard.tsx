import React from 'react';

const Leaderboard = () => {
  const leaderboardData = [
    { id: 1, name: 'Alex Johnson', score: 8.5, progress: 95, change: '+2' },
    { id: 2, name: 'Maria Garcia', score: 8.0, progress: 87, change: '+1' },
    { id: 3, name: 'James Smith', score: 7.5, progress: 80, change: '0' },
    { id: 4, name: 'Sarah Williams', score: 7.0, progress: 75, change: '-1' },
    { id: 5, name: 'John Davis', score: 6.5, progress: 65, change: '+3' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Weekly Leaderboard</h2>
      <div className="space-y-3">
        {leaderboardData.map((user, index) => (
          <div key={user.id} className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
              index === 0 ? 'bg-yellow-500 text-white' : 
              index === 1 ? 'bg-gray-300 text-gray-800 dark:bg-gray-600' : 
              index === 2 ? 'bg-amber-800 text-white' : 'bg-gray-200 dark:bg-gray-700'
            }`}>
              {index + 1}
            </div>
            <div className="ml-3 flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">{user.name}</h3>
              <div className="flex items-center">
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{user.score}</span>
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  user.change.startsWith('+') ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                  user.change.startsWith('-') ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {user.change}
                </span>
              </div>
            </div>
            <div className="w-16">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full" 
                  style={{ width: `${user.progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{user.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;