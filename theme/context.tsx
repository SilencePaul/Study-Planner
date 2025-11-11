import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme } from './index';
import { useAppContext } from '@/app/context';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAppContext();
  const systemColorScheme = useColorScheme();
  
  const getTheme = (): Theme => {
    if (state.settings.theme === 'auto') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return state.settings.theme === 'dark' ? darkTheme : lightTheme;
  };

  const theme = getTheme();
  const isDark = state.settings.theme === 'dark' || 
    (state.settings.theme === 'auto' && systemColorScheme === 'dark');

  return (
    <ThemeContext.Provider value={{ theme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback to light theme if context is not available
    return { theme: lightTheme, isDark: false };
  }
  return context;
};

