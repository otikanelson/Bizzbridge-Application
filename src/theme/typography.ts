import { TextStyle } from 'react-native';
import { ThemeTypography } from '../types/theme';

export const FONT_FAMILIES = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const typography: ThemeTypography = {
  h1: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: FONT_SIZES.xxxl,
    lineHeight: 40,
    fontWeight: '700',
  },
  h2: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: FONT_SIZES.xxl,
    lineHeight: 32,
    fontWeight: '700',
  },
  h3: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: FONT_SIZES.xl,
    lineHeight: 28,
    fontWeight: '600',
  },
  h4: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: FONT_SIZES.lg,
    lineHeight: 24,
    fontWeight: '600',
  },
  h5: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
    fontWeight: '500',
  },
  h6: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    fontWeight: '500',
  },
  body1: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
    fontWeight: '400',
  },
  body2: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    fontWeight: '400',
  },
  caption: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: FONT_SIZES.xs,
    lineHeight: 16,
    fontWeight: '400',
  },
  button: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
};
