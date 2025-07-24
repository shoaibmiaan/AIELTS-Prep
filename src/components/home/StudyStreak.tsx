import React from 'react';

const StudyStreak = ({ streak, darkMode }: { streak: number; darkMode: boolean }) => {
  return (
    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <h3 className="font-semibold text-lg mb-3">Study Streak</h3>
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-yellow-500">{streak}</div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>days in a row</div>
        </div>
        <div className="ml-6">
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            <i className="fas fa-fire text-yellow-500 mr-2"></i>
            Keep it going!
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Study tomorrow to maintain your streak
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyStreak;