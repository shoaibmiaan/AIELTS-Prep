'use client';
import { createContext, useContext, useState, useEffect, FC, ReactNode } from 'react';

interface ThemeColors {
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  primaryHover: string;
  border: string;
  accent: string;
}

interface ThemeConfig {
  light: ThemeColors;
  dark: ThemeColors;
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: ThemeColors;
  toggleTheme: () => void;
}

const themeConfig: ThemeConfig = {
  light: {
    background: '#F0F4F8',
    cardBackground: '#FFFFFF',
    textPrimary: '#1A202C',
    textSecondary: '#4A5568',
    primary: '#D97706',
    primaryHover: '#B45309',
    border: '#E2E8F0',
    accent: '#3182CE'
  },
  dark: {
    background: '#1A202C',
    cardBackground: '#2D3748',
    textPrimary: '#F7FAFC',
    textSecondary: '#CBD5E0',
    primary: '#D97706',
    primaryHover: '#F59E0B',
    border: '#4A5568',
    accent: '#63B3ED'
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      colors: themeConfig[theme],
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};