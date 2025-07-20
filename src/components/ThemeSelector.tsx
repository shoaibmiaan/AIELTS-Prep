import { useState, useEffect } from 'react';

export const ThemeSelector = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedMode === 'true' || (!savedMode && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      className="p-2 bg-white dark:bg-gray-800 rounded-full"
      onClick={toggleTheme}
    >
      {darkMode ? (
        <i className="fas fa-sun text-yellow-500"></i>
      ) : (
        <i className="fas fa-moon text-gray-600"></i>
      )}
    </button>
  );
};
