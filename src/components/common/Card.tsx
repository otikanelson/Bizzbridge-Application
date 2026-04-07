import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 'sm',
  padding = 'md',
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    };

    // Padding styles (Requirement 33.2)
    const paddingStyles: Record<string, ViewStyle> = {
      none: {},
      xs: { padding: theme.spacing.xs },
      sm: { padding: theme.spacing.sm },
      md: { padding: theme.spacing.md },
      lg: { padding: theme.spacing.lg },
      xl: { padding: theme.spacing.xl },
    };

    // Elevation/shadow styles (Requirement 33.2, 35.8)
    const elevationStyles: Record<string, ViewStyle> = {
      none: {},
      sm: theme.shadows.sm,
      md: theme.shadows.md,
      lg: theme.shadows.lg,
    };

    return {
      ...baseStyle,
      ...paddingStyles[padding],
      ...elevationStyles[elevation],
      ...style,
    };
  };

  return (
    <View style={getCardStyle()} testID={testID}>
      {children}
    </View>
  );
};
