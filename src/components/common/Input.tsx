import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  maxLength,
  multiline = false,
  numberOfLines = 1,
  returnKeyType = 'done',
  onSubmitEditing,
  onFocus,
  onBlur,
  style,
  inputStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const getContainerStyle = (): ViewStyle => {
    return {
      marginBottom: theme.spacing.md,
      ...style,
    };
  };

  const getLabelStyle = (): TextStyle => {
    return {
      ...theme.typography.body2,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontWeight: '500',
    };
  };

  const getInputContainerStyle = (): ViewStyle => {
    return {
      borderWidth: 1,
      borderColor: error
        ? theme.colors.error
        : isFocused
        ? theme.colors.primary
        : theme.colors.border,
      borderRadius: theme.borderRadius.md,
      backgroundColor: disabled ? theme.colors.disabled : theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: multiline ? theme.spacing.sm : theme.spacing.xs + 4,
      minHeight: 44, // Ensure minimum touch target (Requirement 50.2)
    };
  };

  const getInputStyle = (): TextStyle => {
    return {
      ...theme.typography.body1,
      color: disabled ? theme.colors.textSecondary : theme.colors.text,
      padding: 0, // Remove default padding to control spacing
      margin: 0,
      ...(multiline && {
        minHeight: numberOfLines * 20,
        textAlignVertical: 'top',
      }),
      ...inputStyle,
    };
  };

  const getErrorStyle = (): TextStyle => {
    return {
      ...theme.typography.caption,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    };
  };

  return (
    <View style={getContainerStyle()}>
      {label && (
        <Text
          style={getLabelStyle()}
          accessibilityLabel={`${label} label`}
        >
          {label}
        </Text>
      )}
      <View style={getInputContainerStyle()}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholder}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={getInputStyle()}
          accessibilityRole="text"
          accessibilityLabel={accessibilityLabel || label || placeholder}
          accessibilityHint={accessibilityHint}
          accessibilityState={{
            disabled,
          }}
          testID={testID}
        />
      </View>
      {error && (
        <Text
          style={getErrorStyle()}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      )}
    </View>
  );
};
