import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      // Ensure minimum 44x44 touch target (Requirement 50.2)
      minHeight: 44,
      minWidth: 44,
    };

    // Size styles with minimum touch target consideration
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingVertical: theme.spacing.xs + 4, // 8px to ensure 44px height
        paddingHorizontal: theme.spacing.md,
      },
      medium: {
        paddingVertical: theme.spacing.sm + 4, // 12px to ensure 44px height
        paddingHorizontal: theme.spacing.lg,
      },
      large: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: disabled ? theme.colors.disabled : theme.colors.primary,
      },
      secondary: {
        backgroundColor: disabled ? theme.colors.disabled : theme.colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: disabled ? theme.colors.disabled : theme.colors.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...theme.typography.button,
      textTransform: 'none', // Override uppercase from theme for better readability
    };

    // Size-specific text styles
    const sizeTextStyles: Record<string, TextStyle> = {
      small: {
        fontSize: 14,
        lineHeight: 20,
      },
      medium: {
        fontSize: 16,
        lineHeight: 24,
      },
      large: {
        fontSize: 18,
        lineHeight: 26,
      },
    };

    // Variant-specific text colors
    const variantTextStyles: Record<string, TextStyle> = {
      primary: {
        color: disabled ? theme.colors.textSecondary : '#FFFFFF',
      },
      secondary: {
        color: disabled ? theme.colors.textSecondary : '#FFFFFF',
      },
      outline: {
        color: disabled ? theme.colors.disabled : theme.colors.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
      ...textStyle,
    };
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      testID={testID}
    >
      {loading ? (
        <>
          <ActivityIndicator
            size="small"
            color={variant === 'outline' ? theme.colors.primary : '#FFFFFF'}
            style={styles.loader}
          />
          <Text style={getTextStyle()}>{title}</Text>
        </>
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loader: {
    marginRight: 8,
  },
});
