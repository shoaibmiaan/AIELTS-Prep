'use client';
import { createContext, useContext, useState, useEffect, FC, ReactNode } from 'react';

// Define theme color types
interface ThemeColors {
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  highlight: string;
  border: string;
  buttonPrimary: string;
  buttonHover: string;
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

// Color configuration for light and dark themes
const themeConfig: ThemeConfig = {
  light: {
    background: 'transparent',  // Transparent background for light theme
    cardBackground: '#FFFFFF',  // White card background for light theme
    textPrimary: '#2D3748',  // Dark text for primary elements
    textSecondary: '#4A5568',  // Lighter text for secondary elements
    highlight: '#F59E0B',  // Accent highlight color (yellow)
    border: '#E2E8F0',  // Light borders
    buttonPrimary: '#F59E0B',  // Primary button color (yellow)
    buttonHover: '#D97706',  // Darker yellow for button hover
    accent: '#F59E0B',  // Accent color for links or highlights
  },
  dark: {
    background: 'transparent',  // Transparent background for dark theme
    cardBackground: '#1A202C',  // Dark card background
    textPrimary: '#EDF2F7',  // Light text for primary elements in dark theme
    textSecondary: '#A0AEC0',  // Lighter text for secondary elements
    highlight: '#F59E0B',  // Accent highlight color (yellow)
    border: '#4A5568',  // Darker borders
    buttonPrimary: '#E53E3E',  // Red for primary buttons
    buttonHover: '#F59E0B',  // Accent yellow for hover
    accent: '#F59E0B',  // Accent color for links or highlights
  },
};

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Retrieve the theme from localStorage on initial load
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors: themeConfig[theme], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
