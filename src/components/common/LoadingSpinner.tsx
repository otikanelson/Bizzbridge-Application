import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  message?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  style?: ViewStyle;
  testID?: string;
}

// Requirements: 33.8, 27.4
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  message,
  fullScreen = false,
  overlay = false,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  if (overlay) {
    return (
      <View style={styles.overlayContainer} testID={testID}>
        <View
          style={[
            styles.overlayBox,
            {
              backgroundColor: theme.colors.card,
              borderRadius: theme.borderRadius.md,
              ...theme.shadows.md,
            },
          ]}
        >
          <ActivityIndicator size={size} color={theme.colors.primary} />
          {message && (
            <Text
              style={[
                styles.message,
                {
                  ...theme.typography.body2,
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              {message}
            </Text>
          )}
        </View>
      </View>
    );
  }

  if (fullScreen) {
    return (
      <View
        style={[
          styles.fullScreenContainer,
          { backgroundColor: theme.colors.background },
        ]}
        testID={testID}
      >
        <ActivityIndicator size={size} color={theme.colors.primary} />
        {message && (
          <Text
            style={[
              styles.message,
              {
                ...theme.typography.body1,
                color: theme.colors.textSecondary,
              },
            ]}
          >
            {message}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.inlineContainer, style]} testID={testID}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {message && (
        <Text
          style={[
            styles.message,
            {
              ...theme.typography.body2,
              color: theme.colors.textSecondary,
            },
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inlineContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  overlayBox: {
    padding: 24,
    alignItems: 'center',
    minWidth: 120,
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
  },
});
