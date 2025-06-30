'use client';

import { useEffect, useRef, useState } from 'react';

export default function FocusedLayout({ children }: { children: React.ReactNode }) {
  const [hasWarned, setHasWarned] = useState(false);
  const [warningShown, setWarningShown] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const warningTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fullscreen logic
  useEffect(() => {
    function goFullScreen() {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
      else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
      else if ((el as any).msRequestFullscreen) (el as any).msRequestFullscreen();
    }
    goFullScreen();

    // If user exits fullscreen, try to re-enter
    const fullscreenChangeHandler = () => {
      if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement
      ) {
        goFullScreen();
      }
    };
    document.addEventListener('fullscreenchange', fullscreenChangeHandler);

    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
    };
  }, []);

  // Tab switch/visibility/block
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setWarningShown(true);
        setShowWarningModal(true);
        // Add a short delay so modal displays before any route changes
        if (!hasWarned) {
          if (warningTimeout.current) clearTimeout(warningTimeout.current);
          warningTimeout.current = setTimeout(() => {
            setShowWarningModal(false);
          }, 3500);
        }
      } else if (warningShown) {
        if (hasWarned) {
          setShowWarningModal(false);
          setShowFinalModal(true);
          setTimeout(() => {
            window.location.href = '/dashboard'; // Or auto-submit logic here
          }, 3000);
        } else {
          setHasWarned(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (warningTimeout.current) clearTimeout(warningTimeout.current);
    };
  }, [hasWarned, warningShown]);

  // Disable right-click, select, copy, paste, F12, Ctrl+S, etc
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

  // Light background (like real test)
  return (
    <div className="w-full min-h-screen bg-gray-100 text-black flex flex-col items-center justify-center relative">
      {children}
      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-yellow-100 border-2 border-yellow-500 rounded-2xl px-8 py-6 text-yellow-800 font-semibold text-xl shadow-lg">
            <span role="img" aria-label="warning" className="mr-2">⚠️</span>
            <span>
              Switching tabs or minimizing is not allowed.<br />
              <span className="text-red-700 font-bold">One more time will end your test.</span>
            </span>
          </div>
        </div>
      )}
      {/* Final Modal */}
      {showFinalModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-white border-2 border-red-500 rounded-2xl px-10 py-8 text-red-800 font-bold text-xl shadow-xl">
            <span role="img" aria-label="cross" className="mr-2">❌</span>
            You switched tabs twice. Your test has been ended and submitted.
          </div>
        </div>
      )}
    </div>
  );
}
