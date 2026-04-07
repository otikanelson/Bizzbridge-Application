import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { BookingStatus } from '../../constants/statuses';
import { formatStatus } from '../../utils/formatting';

interface StatusConfig {
  backgroundColor: string;
  textColor: string;
  label: string;
}

const STATUS_CONFIGS: Record<BookingStatus, StatusConfig> = {
  pending: {
    backgroundColor: '#FFF3CD',
    textColor: '#856404',
    label: 'Pending',
  },
  in_progress: {
    backgroundColor: '#CCE5FF',
    textColor: '#004085',
    label: 'In Progress',
  },
  completed: {
    backgroundColor: '#D4EDDA',
    textColor: '#155724',
    label: 'Completed',
  },
  cancelled: {
    backgroundColor: '#F8D7DA',
    textColor: '#721C24',
    label: 'Cancelled',
  },
  disputed: {
    backgroundColor: '#FFE5D0',
    textColor: '#7D3C00',
    label: 'Disputed',
  },
};

interface BookingStatusBadgeProps {
  status: BookingStatus;
  size?: 'sm' | 'md';
  style?: ViewStyle;
  testID?: string;
}

// Requirements: 48.2, 48.10
export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({
  status,
  size = 'md',
  style,
  testID,
}) => {
  const config = STATUS_CONFIGS[status] ?? {
    backgroundColor: '#E2E3E5',
    textColor: '#383D41',
    label: formatStatus(status),
  };

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.backgroundColor,
          paddingHorizontal: isSmall ? 8 : 10,
          paddingVertical: isSmall ? 2 : 4,
          borderRadius: isSmall ? 4 : 6,
        },
        style,
      ]}
      accessibilityLabel={`Status: ${config.label}`}
      testID={testID}
    >
      <Text
        style={[
          styles.badgeText,
          {
            color: config.textColor,
            fontSize: isSmall ? 11 : 13,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

export const getBookingStatusConfig = (status: BookingStatus): StatusConfig => {
  return STATUS_CONFIGS[status] ?? {
    backgroundColor: '#E2E3E5',
    textColor: '#383D41',
    label: formatStatus(status),
  };
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontWeight: '600',
  },
});
