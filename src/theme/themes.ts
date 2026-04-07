import { ViewStyle } from 'react-native';
import { Theme } from '../types/theme';
import { lightThemeColors, darkThemeColors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

const commonTheme = {
  typography,
  spacing,
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    } as ViewStyle,
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    } as ViewStyle,
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    } as ViewStyle,
  },
};

export const lightTheme: Theme = {
  dark: false,
  colors: lightThemeColors,
  ...commonTheme,
};

export const darkTheme: Theme = {
  dark: true,
  colors: darkThemeColors,
  ...commonTheme,
};
