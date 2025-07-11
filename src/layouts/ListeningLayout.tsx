'use client';

import { ReactNode } from 'react';

// Constants for Tailwind classes
const LAYOUT_CLASSES = {
  container: 'max-w-5xl mx-auto px-4 py-6',
  header: 'text-center mb-6',
  title: 'text-2xl font-bold tracking-wide text-gray-800',
  subtitle: 'text-sm text-gray-600 mt-2',
  audioContainer: 'flex justify-center items-center gap-4 mb-8',
  audio: 'w-full max-w-2xl rounded-lg shadow',
  time: 'text-sm text-gray-500 whitespace-nowrap',
  content: 'bg-white border rounded-lg p-6 shadow-md space-y-6',
  buttonContainer: 'mt-8 flex justify-end',
  button: 'bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition shadow',
};

interface ListeningLayoutProps {
  children: ReactNode;
  sectionTitle: string;
  subtitle: string;
  audioSrc?: string;
  timeElapsed?: string;
  onNext?: () => void;
  showNext?: boolean;
}

export default function ListeningLayout({
  children,
  sectionTitle,
  subtitle,
  audioSrc = '/audios/test1.mp3',
  timeElapsed,
  onNext,
  showNext = true,
}: ListeningLayoutProps) {
  return (
    <div className={LAYOUT_CLASSES.container}>
      <div className={LAYOUT_CLASSES.header}>
        <h1 className={LAYOUT_CLASSES.title}>{sectionTitle}</h1>
        <p className={LAYOUT_CLASSES.subtitle}>{subtitle}</p>
      </div>
      <div className={LAYOUT_CLASSES.audioContainer}>
        <audio controls className={LAYOUT_CLASSES.audio} aria-label="IELTS listening test audio">
          <source src={audioSrc} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
        {timeElapsed && <span className={LAYOUT_CLASSES.time}>Time: {timeElapsed}</span>}
      </div>
      <div className={LAYOUT_CLASSES.content}>{children}</div>
      {showNext && (
        <div className={LAYOUT_CLASSES.buttonContainer}>
          <button onClick={onNext} className={LAYOUT_CLASSES.button} aria-label="Proceed to next section">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
