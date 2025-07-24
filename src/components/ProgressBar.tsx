import React from 'react';

const ProgressBar = ({
  progress,
  color = 'indigo'
}: {
  progress: number;
  color?: 'indigo' | 'green' | 'red' | 'yellow';
}) => {
  const colorClasses = {
    indigo: 'bg-indigo-600 dark:bg-indigo-500',
    green: 'bg-green-600 dark:bg-green-500',
    red: 'bg-red-600 dark:bg-red-500',
    yellow: 'bg-yellow-600 dark:bg-yellow-500'
  };

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full ${colorClasses[color]}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;