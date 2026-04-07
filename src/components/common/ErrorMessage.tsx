import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

type ErrorType = 'network' | 'notFound' | 'server' | 'access' | 'offline' | 'generic';

interface ErrorMessageProps {
  message?: string;
  type?: ErrorType;
  onRetry?: () => void;
  retryLabel?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const DEFAULT_MESSAGES: Record<ErrorType, string> = {
  network: 'Network request failed. Please check your connection.',
  notFound: 'Not found. The item you are looking for does not exist.',
  server: 'Server error. Please try again later.',
  access: 'Access denied. You do not have permission to view this.',
  offline: 'You are offline. Please check your internet connection.',
  generic: 'Something went wrong. Please try again.',
};

const ERROR_ICONS: Record<ErrorType, string> = {
  network: '📡',
  notFound: '🔍',
  server: '⚠️',
  access: '🔒',
  offline: '📵',
  generic: '❌',
};

// Requirements: 33.9, 26.1, 26.9
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = 'generic',
  onRetry,
  retryLabel = 'Try Again',
  fullScreen = false,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const displayMessage = message || DEFAULT_MESSAGES[type];
  const icon = ERROR_ICONS[type];

  const containerStyle: ViewStyle = fullScreen
    ? {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
        padding: theme.spacing.xl,
      }
    : {
        alignItems: 'center',
        padding: theme.spacing.lg,
        ...style,
      };

  return (
    <View style={containerStyle} testID={testID}>
      <Text style={styles.icon}>{icon}</Text>

      <Text
        style={[
          styles.message,
          {
            ...theme.typography.body1,
            color: theme.colors.textSecondary,
          },
        ]}
      >
        {displayMessage}
      </Text>

      {onRetry && (
        <TouchableOpacity
          style={[
            styles.retryButton,
            {
              backgroundColor: theme.colors.primary,
              borderRadius: theme.borderRadius.sm,
            },
          ]}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
          testID={testID ? `${testID}-retry` : undefined}
        >
          <Text
            style={[
              styles.retryText,
              { ...theme.typography.button, color: '#FFFFFF' },
            ]}
          >
            {retryLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 40,
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    textTransform: 'none',
  },
});
