import { ThemeColors } from '../types/theme';

export const COLORS = {
  // Primary colors (Red)
  primary: {
    main: '#DC143C',      // Crimson red
    light: '#FF6B6B',     // Light red
    dark: '#B22222',      // Dark red
    contrast: '#FFFFFF',  // White text on red
  },
  
  // Secondary colors (Black/Gray)
  secondary: {
    main: '#1A1A1A',      // Near black
    light: '#333333',     // Dark gray
    dark: '#000000',      // Pure black
    contrast: '#FFFFFF',  // White text on black
  },
  
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
    black: '#000000',
  },
  
  // Semantic colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
};

export const lightThemeColors: ThemeColors = {
  primary: COLORS.primary.main,
  secondary: COLORS.secondary.main,
  background: COLORS.neutral.white,
  surface: COLORS.neutral.gray100,
  card: COLORS.neutral.white,
  text: COLORS.neutral.gray900,
  textSecondary: COLORS.neutral.gray600,
  border: COLORS.neutral.gray300,
  error: COLORS.error,
  success: COLORS.success,
  warning: COLORS.warning,
  info: COLORS.info,
  disabled: COLORS.neutral.gray400,
  placeholder: COLORS.neutral.gray500,
  backdrop: 'rgba(0, 0, 0, 0.5)',
};

export const darkThemeColors: ThemeColors = {
  primary: COLORS.primary.light,
  secondary: COLORS.neutral.gray300,
  background: COLORS.neutral.gray900,
  surface: COLORS.neutral.gray800,
  card: COLORS.neutral.gray800,
  text: COLORS.neutral.white,
  textSecondary: COLORS.neutral.gray400,
  border: COLORS.neutral.gray700,
  error: COLORS.error,
  success: COLORS.success,
  warning: COLORS.warning,
  info: COLORS.info,
  disabled: COLORS.neutral.gray600,
  placeholder: COLORS.neutral.gray500,
  backdrop: 'rgba(0, 0, 0, 0.7)',
};
