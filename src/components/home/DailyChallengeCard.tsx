import React from 'react';

const DailyChallengeCard = ({ challenge, onStart, onComplete, darkMode }: {
  challenge: any;
  onStart: () => void;
  onComplete: () => void;
  darkMode: boolean;
}) => {
  const progressPercentage = (challenge.progress / challenge.total) * 100;

  return (
    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">Daily Challenge</h3>
        <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
          +{challenge.reward} XP
        </span>
      </div>

      <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{challenge.title}</p>

      <div className="mb-4">
        <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>{challenge.progress}/{challenge.total} completed</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      {challenge.completed ? (
        <button
          className={`w-full py-2 rounded-md text-sm font-medium ${darkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'}`}
          disabled
        >
          <i className="fas fa-check-circle mr-2"></i>
          Challenge Completed
        </button>
      ) : (
        <button
          onClick={challenge.progress === 0 ? onStart : onComplete}
          className={`w-full py-2 rounded-md text-sm font-medium ${darkMode ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white'}`}
        >
          {challenge.progress === 0 ? (
            <>
              <i className="fas fa-play mr-2"></i>
              Start Challenge
            </>
          ) : (
            <>
              <i className="fas fa-check mr-2"></i>
              Complete Challenge
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default DailyChallengeCard;