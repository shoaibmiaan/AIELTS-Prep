// src/design-system/providers/ThemeProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { colorTokens } from '../theme/colors';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  colors: typeof colorTokens;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialMode = savedMode === 'true' || (!savedMode && prefersDark);

    setDarkMode(initialMode);
    document.documentElement.classList.toggle('dark', initialMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <ThemeContext.Provider value={{
      darkMode,
      toggleDarkMode,
      colors: colorTokens
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}