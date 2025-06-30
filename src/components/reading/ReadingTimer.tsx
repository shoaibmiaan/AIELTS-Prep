// src/components/reading/ReadingTimer.tsx
import React from 'react';

interface ReadingTimerProps {
  timeLeft: number; // seconds
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const ReadingTimer: React.FC<ReadingTimerProps> = ({ timeLeft }) => (
  <div className="sticky top-0 bg-white z-20 py-2 px-6 flex items-center justify-center border-b text-2xl font-bold tracking-wide">
    Time Left: <span className="ml-2 text-red-600">{formatTime(timeLeft)}</span>
  </div>
);

export default ReadingTimer;
