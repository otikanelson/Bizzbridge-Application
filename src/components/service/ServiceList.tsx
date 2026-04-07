import React from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  ListRenderItem,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Service } from '../../types/models';
import { ServiceCard } from './ServiceCard';

interface ServiceListProps {
  services: Service[];
  onServicePress: (service: Service) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  numColumns?: 1 | 2;
  testID?: string;
}

// Requirements: 41.1, 41.2, 41.3, 41.4, 41.5, 41.6
export const ServiceList: React.FC<ServiceListProps> = ({
  services,
  onServicePress,
  onRefresh,
  refreshing = false,
  loading = false,
  emptyMessage = 'No services found',
  style,
  contentContainerStyle,
  numColumns = 1,
  testID,
}) => {
  const { theme } = useTheme();

  const renderItem: ListRenderItem<Service> = ({ item }) => (
    <ServiceCard
      service={item}
      onPress={onServicePress}
      style={numColumns === 2 ? styles.gridCard : undefined}
      testID={`service-card-${item._id}`}
    />
  );

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

  const keyExtractor = (item: Service) => item._id;

  return (
    <FlatList
      data={services}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      key={`service-list-${numColumns}`}
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
        services.length === 0 && styles.emptyContentContainer,
        contentContainerStyle,
      ]}
      style={[{ backgroundColor: theme.colors.background }, style]}
      showsVerticalScrollIndicator={false}
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    textAlign: 'center',
  },
  gridCard: {
    flex: 1,
    marginHorizontal: 4,
  },
});
