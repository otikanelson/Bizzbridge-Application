import React, { useMemo } from 'react';
import {
  SectionList,
  RefreshControl,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  SectionListRenderItem,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Booking } from '../../types/models';
import { BookingStatus, BOOKING_STATUSES } from '../../constants/statuses';
import { BookingCard } from './BookingCard';
import { formatStatus } from '../../utils/formatting';
import { getBookingStatusConfig } from './BookingStatus';

interface BookingSection {
  title: string;
  status: BookingStatus;
  data: Booking[];
}

interface BookingListProps {
  bookings: Booking[];
  viewerRole: 'customer' | 'artisan';
  onBookingPress: (booking: Booking) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  style?: ViewStyle;
  testID?: string;
}

// Requirements: 9.3, 12.3
export const BookingList: React.FC<BookingListProps> = ({
  bookings,
  viewerRole,
  onBookingPress,
  onRefresh,
  refreshing = false,
  loading = false,
  emptyMessage = 'No bookings found',
  style,
  testID,
}) => {
  const { theme } = useTheme();

  // Group bookings by status, preserving status order
  const sections = useMemo<BookingSection[]>(() => {
    const grouped: Partial<Record<BookingStatus, Booking[]>> = {};

    for (const booking of bookings) {
      const status = booking.status;
      if (!grouped[status]) {
        grouped[status] = [];
      }
      grouped[status]!.push(booking);
    }

    return BOOKING_STATUSES
      .filter(status => grouped[status]?.length)
      .map(status => ({
        title: formatStatus(status),
        status,
        data: grouped[status]!,
      }));
  }, [bookings]);

  const renderItem: SectionListRenderItem<Booking, BookingSection> = ({ item }) => (
    <BookingCard
      booking={item}
      viewerRole={viewerRole}
      onPress={onBookingPress}
      testID={`booking-card-${item._id}`}
    />
  );

  const renderSectionHeader = ({ section }: { section: BookingSection }) => {
    const config = getBookingStatusConfig(section.status);
    return (
      <View
        style={[
          styles.sectionHeader,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View
          style={[
            styles.sectionDot,
            { backgroundColor: config.textColor },
          ]}
        />
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.text, ...theme.typography.body2 },
          ]}
        >
          {section.title}
        </Text>
        <Text
          style={[
            styles.sectionCount,
            { color: theme.colors.textSecondary, ...theme.typography.caption },
          ]}
        >
          ({section.data.length})
        </Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text
          style={[
            styles.emptyText,
            { color: theme.colors.textSecondary, ...theme.typography.body2 },
          ]}
        >
          {emptyMessage}
        </Text>
      </View>
    );
  };

  const keyExtractor = (item: Booking) => item._id;

  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={keyExtractor}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        ) : undefined
      }
      contentContainerStyle={[
        styles.contentContainer,
        sections.length === 0 && styles.emptyContentContainer,
      ]}
      style={[{ backgroundColor: theme.colors.background }, style]}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
      testID={testID}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 4,
    gap: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  sectionCount: {
    marginLeft: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    textAlign: 'center',
  },
});
