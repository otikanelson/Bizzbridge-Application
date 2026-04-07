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
import { Booking, User, Service } from '../../types/models';
import { formatDate, formatPrice } from '../../utils/formatting';
import { BookingStatusBadge } from './BookingStatus';

interface BookingCardProps {
  booking: Booking;
  viewerRole: 'customer' | 'artisan';
  onPress: (booking: Booking) => void;
  style?: ViewStyle;
  testID?: string;
}

// Requirements: 33.6, 9.4, 12.4, 48.1, 48.3, 48.4, 48.5, 48.6
export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  viewerRole,
  onPress,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const artisan = typeof booking.artisan === 'object' ? booking.artisan as User : null;
  const customer = typeof booking.customer === 'object' ? booking.customer as User : null;
  const service = typeof booking.service === 'object' ? booking.service as Service : null;

  const artisanName = artisan?.businessName || artisan?.contactName || 'Unknown Artisan';
  const customerName = customer?.fullName || 'Unknown Customer';
  const otherPartyName = viewerRole === 'customer' ? artisanName : customerName;
  const otherPartyLabel = viewerRole === 'customer' ? 'Artisan' : 'Customer';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.md,
          borderColor: theme.colors.border,
          ...theme.shadows.sm,
        },
        style,
      ]}
      onPress={() => onPress(booking)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Booking: ${booking.title}`}
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
          {booking.title}
        </Text>
        <BookingStatusBadge status={booking.status} size="sm" />
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
      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
        <Text
          style={[styles.metaText, { color: theme.colors.textSecondary, ...theme.typography.caption }]}
        >
          {formatDate(booking.scheduledStartDate)}
        </Text>
      </View>

      {/* Price */}
      <View style={styles.footer}>
        <Text
          style={[styles.price, { color: theme.colors.primary, ...theme.typography.body2 }]}
        >
          {formatPrice(booking.agreedTerms.price)}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
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
  price: {
    fontWeight: '700',
  },
});
