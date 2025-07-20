'use client';

import { useEffect, useState } from 'react';

export default function FocusedLayout({ children }: { children: React.ReactNode }) {
  const [fullscreenRequested, setFullscreenRequested] = useState(false); // Track if fullscreen has been requested

  // Fullscreen logic for the test (only trigger once when the test starts)
  const goFullScreen = () => {
    if (!fullscreenRequested) {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
      else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
      else if ((el as any).msRequestFullscreen) (el as any).msRequestFullscreen();

      setFullscreenRequested(true); // Mark fullscreen as requested
    }
  };

  // Prevent right-click, select, copy, paste, etc.
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', prevent);
    document.addEventListener('selectstart', prevent);
    document.addEventListener('copy', prevent);
    document.addEventListener('cut', prevent);
    document.addEventListener('paste', prevent);

    const keyDownHandler = (e: KeyboardEvent) => {
      // Block F12, Ctrl/Cmd+Shift+I/J/C/U, Ctrl+S, Ctrl+P, PrintScreen
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.metaKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && ['S', 'P', 'U'].includes(e.key.toUpperCase())) ||
        (e.metaKey && ['S', 'P', 'U'].includes(e.key.toUpperCase())) ||
        (e.key === 'PrintScreen')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    window.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('contextmenu', prevent);
      document.removeEventListener('selectstart', prevent);
      document.removeEventListener('copy', prevent);
      document.removeEventListener('cut', prevent);
      document.removeEventListener('paste', prevent);
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 text-black flex flex-col items-center justify-center relative">
      {children}
    </div>
  );
}
