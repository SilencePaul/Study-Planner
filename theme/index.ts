export const lightTheme = {
  colors: {
    primary: '#4A90E2',
    secondary: '#7B68EE',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E0E0E0',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    gold: '#FFD700',
    silver: '#C0C0C0',
    red: '#F44336',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
};

export const darkTheme = {
  colors: {
    primary: '#5BA3F5',
    secondary: '#9B7DFF',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
    gold: '#FFD700',
    silver: '#C0C0C0',
    red: '#EF5350',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
};

export type Theme = typeof lightTheme;

