import React from 'react';

const ProgressTracker = ({ 
  progress,
  title,
  module,
  duration,
  locked,
  onClick
}: {
  progress: number;
  title: string;
  module: string;
  duration: string;
  locked: boolean;
  onClick: () => void;
}) => {
  return (
    <div 
      className={`p-4 rounded-xl border ${
        locked 
          ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50' 
          : 'border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-800 hover:shadow-md cursor-pointer transition-shadow'
      }`}
      onClick={!locked ? onClick : undefined}
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-xs">
              {module}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">{duration}</span>
          </div>
        </div>
        {locked ? (
          <span className="text-gray-400 dark:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
        ) : (
          <div className="relative w-12 h-12">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeDasharray={`${progress}, 100`}
              />
            </svg>
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {progress}%
            </span>
          </div>
        )}
      </div>
      <div className="mt-2">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;