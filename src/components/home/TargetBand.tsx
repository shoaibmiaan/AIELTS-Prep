'use client';
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
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference.toString();

        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset.toString();
      }
    };

    animateProgressRing('overall-progress', (userProgress.overall / 9) * 100);
    animateProgressRing('target-progress', (userProgress.targetBand / 9) * 100);
  }, [userProgress]);

  const progressPercentage = Math.round((userProgress.overall / userProgress.targetBand) * 100);

  return (
    <div className="bg-[rgb(var(--color-background))] dark:bg-[rgb(var(--color-card-dark))] rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 dark:text-[rgb(var(--color-foreground-dark))]">Target Band Score</h2>
      <div className="text-center">
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            {/* Background circle */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke={darkMode ? '[rgb(var(--color-border))]' : '[rgb(var(--color-border))]'}
              strokeWidth="2"
            ></circle>

            {/* Overall progress circle */}
            <circle
              id="overall-progress"
              className="progress-ring__circle transition-all duration-500"
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="[rgb(var(--color-warning))]"
              strokeWidth="2"
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
            ></circle>

            {/* Target progress circle */}
            <circle
              id="target-progress"
              className="progress-ring__circle transition-all duration-500"
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="[rgb(var(--color-success))]"
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
              fill={darkMode ? '[rgb(var(--color-foreground-dark))]' : '[rgb(var(--color-foreground))]'}
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
              fill={darkMode ? '[rgb(var(--color-muted-dark))]' : '[rgb(var(--color-muted))]'}
              dy=".3em"
              className="transition-colors duration-300"
            >
              Current
            </text>
          </svg>

          {/* Target band indicator */}
          <div className="absolute -bottom-2 left-0 right-0 text-center">
            <span className="inline-block bg-[rgb(var(--color-success)/0.1)] dark:bg-[rgb(var(--color-success-dark)/0.2)] text-[rgb(var(--color-success))] dark:text-[rgb(var(--color-success-dark))] text-xs px-2 py-1 rounded transition-colors duration-300">
              Target: {userProgress.targetBand}
            </span>
          </div>
        </div>

        {/* Target band selection */}
        <div className="mb-4">
          <label
            htmlFor="targetBand"
            className="block text-sm font-medium text-[rgb(var(--color-foreground))] dark:text-[rgb(var(--color-foreground-dark))] mb-1 transition-colors duration-300"
          >
            Your Target Band
          </label>
          <select
            id="targetBand"
            className="w-full px-3 py-2 border rounded-md dark:bg-[rgb(var(--color-background-dark))] dark:border-[rgb(var(--color-border-dark))] dark:text-[rgb(var(--color-foreground-dark))] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-secondary))] dark:focus:ring-[rgb(var(--color-secondary-dark))]"
            value={userProgress.targetBand}
            onChange={updateTargetBand}
          >
            {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((band) => (
              <option key={band} value={band}>Band {band}</option>
            ))}
          </select>
        </div>

        {/* Progress text */}
        <div className="text-sm text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted-dark))] mb-4 transition-colors duration-300">
          {userProgress.overall >= userProgress.targetBand ? (
            <span className="text-[rgb(var(--color-success))] dark:text-[rgb(var(--color-success-dark))]">
              Congratulations! You've reached your target band!
            </span>
          ) : (
            <span>You're {progressPercentage}% to your target band</span>
          )}
        </div>

        {/* Update goal button */}
        <button
          className="w-full bg-[rgb(var(--color-secondary))] hover:bg-[rgb(var(--color-secondary-dark))] text-[rgb(var(--color-foreground-light))] py-2 rounded-md font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-secondary))] dark:focus:ring-[rgb(var(--color-secondary-dark))] focus:ring-offset-2 dark:focus:ring-offset-[rgb(var(--color-background-dark))]"
        >
          Update Goal
        </button>
      </div>
    </div>
  );
}
