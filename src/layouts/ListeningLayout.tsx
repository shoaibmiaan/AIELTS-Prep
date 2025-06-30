'use client';

import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  sectionTitle: string;
  subtitle: string;
  timeElapsed?: string;
  onNext?: () => void;
  showNext?: boolean;
};

export default function ListeningLayout({
  children,
  sectionTitle,
  subtitle,
  timeElapsed,
  onNext,
  showNext = true,
}: Props) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-wide text-gray-800">
          {sectionTitle}
        </h1>
        <p className="text-sm text-gray-600 mt-2">{subtitle}</p>
      </div>

      {/* Audio + Time */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <audio controls className="w-full max-w-2xl rounded-lg shadow">
          <source src="/audios/test1.mp3" type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
        {timeElapsed && (
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Time: {timeElapsed}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="bg-white border rounded-lg p-6 shadow-md space-y-6">
        {children}
      </div>

      {/* Next Button */}
      {showNext && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={onNext}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition shadow"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
