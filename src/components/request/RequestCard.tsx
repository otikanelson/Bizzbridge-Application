import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { ServiceRequest, User, Service } from '../../types/models';
import { ServiceRequestStatus } from '../../constants/statuses';
import { formatDate, formatStatus } from '../../utils/formatting';

interface RequestStatusConfig {
  backgroundColor: string;
  textColor: string;
  label: string;
}

const REQUEST_STATUS_CONFIGS: Record<ServiceRequestStatus, RequestStatusConfig> = {
  pending: {
    backgroundColor: '#FFF3CD',
    textColor: '#856404',
    label: 'Pending',
  },
  viewed: {
    backgroundColor: '#CCE5FF',
    textColor: '#004085',
    label: 'Viewed',
  },
  accepted: {
    backgroundColor: '#D4EDDA',
    textColor: '#155724',
    label: 'Accepted',
  },
  declined: {
    backgroundColor: '#F8D7DA',
    textColor: '#721C24',
    label: 'Declined',
  },
  converted: {
    backgroundColor: '#D1ECF1',
    textColor: '#0C5460',
    label: 'Converted',
  },
  retracted: {
    backgroundColor: '#E2E3E5',
    textColor: '#383D41',
    label: 'Retracted',
  },
};

export const getRequestStatusConfig = (status: ServiceRequestStatus): RequestStatusConfig => {
  return REQUEST_STATUS_CONFIGS[status] ?? {
    backgroundColor: '#E2E3E5',
    textColor: '#383D41',
    label: formatStatus(status),
  };
};

interface RequestStatusBadgeProps {
  status: ServiceRequestStatus;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({
  status,
  size = 'md',
  style,
}) => {
  const config = getRequestStatusConfig(status);
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        {
          backgroundColor: config.backgroundColor,
          paddingHorizontal: isSmall ? 8 : 10,
          paddingVertical: isSmall ? 2 : 4,
          borderRadius: isSmall ? 4 : 6,
          alignSelf: 'flex-start',
        },
        style,
      ]}
      accessibilityLabel={`Status: ${config.label}`}
    >
      <Text
        style={{
          color: config.textColor,
          fontSize: isSmall ? 11 : 13,
          fontWeight: '600',
        }}
      >
        {config.label}
      </Text>
    </View>
  );
};

interface RequestCardProps {
  request: ServiceRequest;
  viewerRole: 'customer' | 'artisan';
  onPress: (request: ServiceRequest) => void;
  style?: ViewStyle;
  testID?: string;
}

// Requirements: 33.7, 10.4, 13.4, 48.7, 48.8, 48.9
export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  viewerRole,
  onPress,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const artisan = typeof request.artisan === 'object' ? request.artisan as User : null;
  const customer = typeof request.customer === 'object' ? request.customer as User : null;
  const service = typeof request.service === 'object' ? request.service as Service : null;

  const artisanName = artisan?.businessName || artisan?.contactName || 'Unknown Artisan';
  const customerName = customer?.fullName || 'Unknown Customer';
  const otherPartyName = viewerRole === 'customer' ? artisanName : customerName;
  const otherPartyLabel = viewerRole === 'customer' ? 'Artisan' : 'Customer';

  // Highlight unread requests for artisans (pending/viewed)
  const isUnread =
    viewerRole === 'artisan' &&
    (request.status === 'pending' || request.status === 'viewed');

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.md,
          borderColor: isUnread ? theme.colors.primary : theme.colors.border,
          borderWidth: isUnread ? 2 : 1,
          ...theme.shadows.sm,
        },
        style,
      ]}
      onPress={() => onPress(request)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Request: ${request.title}`}
      testID={testID}
    >
      {/* Header row: title + status */}
      <View style={styles.headerRow}>
        <Text
          style={[
            styles.title,
            { color: theme.colors.text, ...theme.typography.body1 },
          ]}
          numberOfLines={2}
        >
          {request.title}
        </Text>
        <RequestStatusBadge status={request.status} size="sm" />
      </View>

      {/* Service name */}
      {service && (
        <View style={styles.row}>
          <Ionicons name="construct-outline" size={14} color={theme.colors.textSecondary} />
          <Text
            style={[styles.metaText, { color: theme.colors.textSecondary, ...theme.typography.caption }]}
            numberOfLines={1}
          >
            {service.title}
          </Text>
        </View>
      )}

      {/* Other party */}
      <View style={styles.row}>
        <Ionicons name="person-outline" size={14} color={theme.colors.textSecondary} />
        <Text
          style={[styles.metaText, { color: theme.colors.textSecondary, ...theme.typography.caption }]}
          numberOfLines={1}
        >
          {otherPartyLabel}: {otherPartyName}
        </Text>
      </View>

      {/* Date */}
      <View style={styles.footer}>
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
          <Text
            style={[styles.metaText, { color: theme.colors.textSecondary, ...theme.typography.caption }]}
          >
            {formatDate(request.createdAt)}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
    marginBottom: 12,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
});
