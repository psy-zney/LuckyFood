import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, spacing, typography, borderRadius, shadows } from './theme';

type ThemeColors = typeof lightColors | typeof darkColors;
type ThemeShadows = typeof shadows.light | typeof shadows.dark;

interface ThemeContextType {
  colors: ThemeColors;
  spacing: typeof spacing;
  typography: typeof typography;
  borderRadius: typeof borderRadius;
  shadows: ThemeShadows;
  isDark: boolean;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const setDarkMode = (dark: boolean) => {
    setIsDark(dark);
  };

  const value: ThemeContextType = {
    colors: isDark ? darkColors : lightColors,
    spacing,
    typography,
    borderRadius,
    shadows: isDark ? shadows.dark : shadows.light,
    isDark,
    toggleTheme,
    setDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
