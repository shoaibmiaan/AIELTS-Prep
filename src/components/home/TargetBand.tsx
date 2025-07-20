import React from 'react';
import { useEffect } from 'react';

interface UserProgress {
  overall: number;
  targetBand: number;
}

interface TargetBandProps {
  userProgress: UserProgress;
  updateTargetBand: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  darkMode: boolean;
}

export default function TargetBand({
  userProgress,
  updateTargetBand,
  darkMode
}: TargetBandProps) {
  // Animate progress rings on mount and when userProgress changes
  useEffect(() => {
    const animateProgressRing = (id: string, percent: number) => {
      const circle = document.querySelector(`#${id}`) as SVGCircleElement | null;
      if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset.toString();
      }
    };

    animateProgressRing('overall-progress', (userProgress.overall / 9) * 100);
    animateProgressRing('target-progress', (userProgress.targetBand / 9) * 100);
  }, [userProgress]);

  const progressPercentage = Math.round((userProgress.overall / userProgress.targetBand) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 dark:text-white">Target Band Score</h2>
      <div className="text-center">
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            {/* Background circle */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2"
            ></circle>

            {/* Overall progress circle (orange) */}
            <circle
              id="overall-progress"
              className="progress-ring__circle transition-all duration-500"
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
            ></circle>

            {/* Target progress circle (green) */}
            <circle
              id="target-progress"
              className="progress-ring__circle transition-all duration-500"
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
            ></circle>

            {/* Current score text */}
            <text
              x="18"
              y="18"
              textAnchor="middle"
              fontSize="12"
              fill={darkMode ? "#ffffff" : "#1f2937"}
              dy=".3em"
              fontWeight="bold"
              className="transition-colors duration-300"
            >
              {userProgress.overall.toFixed(1)}
            </text>

            {/* "Current" label */}
            <text
              x="18"
              y="24"
              textAnchor="middle"
              fontSize="8"
              fill={darkMode ? "#d1d5db" : "#6b7280"}
              dy=".3em"
              className="transition-colors duration-300"
            >
              Current
            </text>
          </svg>

          {/* Target band indicator */}
          <div className="absolute -bottom-2 left-0 right-0 text-center">
            <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded transition-colors duration-300">
              Target: {userProgress.targetBand}
            </span>
          </div>
        </div>

        {/* Target band selection */}
        <div className="mb-4">
          <label
            htmlFor="targetBand"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300"
          >
            Your Target Band
          </label>
          <select
            id="targetBand"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={userProgress.targetBand}
            onChange={updateTargetBand}
          >
            {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((band) => (
              <option key={band} value={band}>Band {band}</option>
            ))}
          </select>
        </div>

        {/* Progress text */}
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
          {userProgress.overall >= userProgress.targetBand ? (
            <span className="text-green-600 dark:text-green-400">
              Congratulations! You've reached your target band!
            </span>
          ) : (
            <span>You're {progressPercentage}% to your target band</span>
          )}
        </div>

        {/* Update goal button */}
        <button
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Update Goal
        </button>
      </div>
    </div>
  );
}