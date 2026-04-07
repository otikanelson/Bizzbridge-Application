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
import { ServiceRequest } from '../../types/models';
import { ServiceRequestStatus, SERVICE_REQUEST_STATUSES } from '../../constants/statuses';
import { RequestCard, getRequestStatusConfig } from './RequestCard';
import { formatStatus } from '../../utils/formatting';

interface RequestSection {
  title: string;
  status: ServiceRequestStatus;
  data: ServiceRequest[];
}

interface RequestListProps {
  requests: ServiceRequest[];
  viewerRole: 'customer' | 'artisan';
  onRequestPress: (request: ServiceRequest) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  style?: ViewStyle;
  testID?: string;
}

// Requirements: 10.3, 13.3
export const RequestList: React.FC<RequestListProps> = ({
  requests,
  viewerRole,
  onRequestPress,
  onRefresh,
  refreshing = false,
  loading = false,
  emptyMessage = 'No requests found',
  style,
  testID,
}) => {
  const { theme } = useTheme();

  // Group requests by status, preserving status order
  const sections = useMemo<RequestSection[]>(() => {
    const grouped: Partial<Record<ServiceRequestStatus, ServiceRequest[]>> = {};

    for (const request of requests) {
      const status = request.status;
      if (!grouped[status]) {
        grouped[status] = [];
      }
      grouped[status]!.push(request);
    }

    return SERVICE_REQUEST_STATUSES
      .filter(status => grouped[status]?.length)
      .map(status => ({
        title: formatStatus(status),
        status,
        data: grouped[status]!,
      }));
  }, [requests]);

  const renderItem: SectionListRenderItem<ServiceRequest, RequestSection> = ({ item }) => (
    <RequestCard
      request={item}
      viewerRole={viewerRole}
      onPress={onRequestPress}
      testID={`request-card-${item._id}`}
    />
  );

  const renderSectionHeader = ({ section }: { section: RequestSection }) => {
    const config = getRequestStatusConfig(section.status);
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

  const keyExtractor = (item: ServiceRequest) => item._id;

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
