'use client';

import { useEffect, useState } from 'react';

// Constants for Tailwind classes
const LAYOUT_CLASSES = {
  container: 'w-full min-h-screen bg-gray-100 text-black flex flex-col items-center justify-center relative',
};

// Custom hook for fullscreen management
function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const requestFullscreen = async () => {
    if (isFullscreen) return;
    try {
      const el = document.documentElement;
      await el.requestFullscreen?.();
      setIsFullscreen(true);
    } catch (err) {
      console.error('Fullscreen request failed:', err);
    }
  };

  return { requestFullscreen, isFullscreen };
}

interface FocusedLayoutProps {
  children: React.ReactNode;
}

export default function FocusedLayout({ children }: FocusedLayoutProps) {
  const { requestFullscreen } = useFullscreen();

  // Prevent specific user interactions for test environment
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    const keyDownHandler = (e: KeyboardEvent) => {
      const isBlockedKey =
        e.key === 'F12' ||
        e.key === 'PrintScreen' ||
        ((e.ctrlKey || e.metaKey) && ['S', 'P', 'U'].includes(e.key.toUpperCase())) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase()));

      if (isBlockedKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const events = ['contextmenu', 'selectstart', 'copy', 'cut', 'paste'] as const;
    events.forEach((event) => document.addEventListener(event, preventDefault));
    window.addEventListener('keydown', keyDownHandler);

    // Trigger fullscreen on mount
    requestFullscreen();

    return () => {
      events.forEach((event) => document.removeEventListener(event, preventDefault));
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [requestFullscreen]);

  return <div className={LAYOUT_CLASSES.container}>{children}</div>;
}
