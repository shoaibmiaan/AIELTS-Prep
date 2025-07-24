import React from 'react';

const ProgressTracker = ({ progress, darkMode }: { progress: any; darkMode: boolean }) => {
  const skills = [
    { name: 'Listening', value: progress.listening, color: 'bg-blue-500' },
    { name: 'Reading', value: progress.reading, color: 'bg-green-500' },
    { name: 'Writing', value: progress.writing, color: 'bg-yellow-500' },
    { name: 'Speaking', value: progress.speaking, color: 'bg-red-500' },
  ];

  return (
    <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <h3 className="font-semibold text-xl mb-4">Your Progress</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {skills.map((skill) => (
          <div key={skill.name} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{skill.name}</span>
              <span className="text-sm font-medium">{skill.value}%</span>
            </div>
            <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className={`h-2 rounded-full ${skill.color}`}
                style={{ width: `${skill.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overall Band</div>
            <div className="text-2xl font-bold">{progress.overall}</div>
          </div>
          <div className="text-right">
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Target Band</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{progress.targetBand}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;