import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface EmptyStateAction {
  label: string;
  onPress: () => void;
}

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  action?: EmptyStateAction;
  style?: ViewStyle;
  testID?: string;
}

// Requirements: 33.10, 28.1, 28.2, 28.3, 28.4, 28.5, 28.6, 28.7
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  message,
  action,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        style,
      ]}
      testID={testID}
    >
      <Text style={styles.icon}>{icon}</Text>

      <Text
        style={[
          styles.title,
          {
            ...theme.typography.h5,
            color: theme.colors.text,
          },
        ]}
      >
        {title}
      </Text>

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

      {action && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: theme.colors.primary,
              borderRadius: theme.borderRadius.sm,
            },
          ]}
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          testID={testID ? `${testID}-action` : undefined}
        >
          <Text
            style={[
              styles.actionText,
              { ...theme.typography.button, color: '#FFFFFF' },
            ]}
          >
            {action.label}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    textTransform: 'none',
  },
});
