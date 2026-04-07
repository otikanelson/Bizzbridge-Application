import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface PickerOption {
  label: string;
  value: string | number;
}

interface PickerProps {
  options: PickerOption[];
  value?: string | number;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

// Requirements: 33.4, 33.11
export const Picker: React.FC<PickerProps> = ({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const containerStyle: ViewStyle = {
    marginBottom: theme.spacing.sm,
    ...style,
  };

  const labelStyle: TextStyle = {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  };

  const triggerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: error ? theme.colors.error : theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: disabled ? theme.colors.disabled : theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    minHeight: 44,
  };

  const triggerTextStyle: TextStyle = {
    ...theme.typography.body1,
    color: selectedOption
      ? theme.colors.text
      : theme.colors.textSecondary,
    flex: 1,
  };

  const errorStyle: TextStyle = {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  };

  const handleSelect = (option: PickerOption) => {
    onValueChange(option.value);
    setModalVisible(false);
  };

  return (
    <View style={containerStyle} testID={testID}>
      {label && <Text style={labelStyle}>{label}</Text>}

      <TouchableOpacity
        style={triggerStyle}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label || placeholder}
        accessibilityState={{ disabled }}
        testID={testID ? `${testID}-trigger` : undefined}
      >
        <Text style={triggerTextStyle} numberOfLines={1}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>▼</Text>
      </TouchableOpacity>

      {error && <Text style={errorStyle}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.md,
                ...theme.shadows.lg,
              },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: theme.colors.border },
              ]}
            >
              <Text
                style={{
                  ...theme.typography.h6,
                  color: theme.colors.text,
                }}
              >
                {label || placeholder}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                accessibilityLabel="Close picker"
                style={styles.closeButton}
              >
                <Text style={{ color: theme.colors.textSecondary, fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      {
                        backgroundColor: isSelected
                          ? theme.colors.primary + '20'
                          : 'transparent',
                        borderBottomColor: theme.colors.border,
                      },
                    ]}
                    onPress={() => handleSelect(item)}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text
                      style={{
                        ...theme.typography.body1,
                        color: isSelected ? theme.colors.primary : theme.colors.text,
                        fontWeight: isSelected ? '600' : 'normal',
                      }}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Text style={{ color: theme.colors.primary, fontSize: 16 }}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
              style={styles.optionList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 44,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
