import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { Service, User } from '../../types/models';
import { getCategoryById } from '../../constants/categories';
import { formatPrice } from '../../utils/formatting';

interface ServiceCardProps {
  service: Service;
  onPress: (service: Service) => void;
  style?: ViewStyle;
  testID?: string;
}

// Requirements: 33.5, 5.8, 45.2, 45.3, 46.1, 47.1, 47.3, 47.4, 47.5, 47.8
export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onPress,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const category = getCategoryById(service.category);
  const artisan = typeof service.artisan === 'object' ? service.artisan as User : null;
  const artisanName = artisan?.businessName || artisan?.contactName || 'Unknown Artisan';
  const firstImage = service.images?.[0];
  const firstLocation = service.locations?.[0];

  const getPriceDisplay = (): string => {
    if (service.pricingType === 'fixed' && service.basePrice != null) {
      return formatPrice(service.basePrice);
    }
    if (service.pricingType === 'categorized' && service.pricingCategories?.length) {
      const prices = service.pricingCategories.map(p => p.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return min === max ? formatPrice(min) : `${formatPrice(min)} - ${formatPrice(max)}`;
    }
    if (service.pricingType === 'negotiate') {
      return 'Negotiable';
    }
    return 'Contact for price';
  };

  const getLocationDisplay = (): string => {
    if (!firstLocation) return '';
    return firstLocation.localities?.[0]
      ? `${firstLocation.localities[0]}, ${firstLocation.lga}`
      : firstLocation.lga;
  };

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
      onPress={() => onPress(service)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${service.title} by ${artisanName}`}
      testID={testID}
    >
      {/* Service Image */}
      <View style={styles.imageContainer}>
        {firstImage ? (
          <Image
            source={{ uri: firstImage }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={`${service.title} image`}
          />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: theme.colors.border },
            ]}
          >
            <Ionicons
              name="image-outline"
              size={40}
              color={theme.colors.textSecondary}
            />
          </View>
        )}
        {/* Category badge */}
        {category && (
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: category.color + 'CC' },
            ]}
          >
            <Ionicons name={category.icon as any} size={12} color="#FFFFFF" />
            <Text style={styles.categoryBadgeText} numberOfLines={1}>
              {category.name}
            </Text>
          </View>
        )}
        {/* Inactive badge */}
        {!service.isActive && (
          <View
            style={[
              styles.inactiveBadge,
              { backgroundColor: theme.colors.disabled },
            ]}
          >
            <Text style={styles.inactiveBadgeText}>Inactive</Text>
          </View>
        )}
      </View>

      {/* Service Info */}
      <View style={styles.infoContainer}>
        {/* Title */}
        <Text
          style={[styles.title, { color: theme.colors.text, ...theme.typography.body1 }]}
          numberOfLines={2}
        >
          {service.title}
        </Text>

        {/* Artisan name */}
        <View style={styles.artisanRow}>
          <Ionicons name="person-outline" size={13} color={theme.colors.textSecondary} />
          <Text
            style={[styles.artisanName, { color: theme.colors.textSecondary, ...theme.typography.caption }]}
            numberOfLines={1}
          >
            {artisanName}
          </Text>
        </View>

        {/* Price */}
        <Text
          style={[styles.price, { color: theme.colors.primary, ...theme.typography.body1 }]}
          numberOfLines={1}
        >
          {getPriceDisplay()}
        </Text>

        {/* Location */}
        {firstLocation && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={theme.colors.textSecondary} />
            <Text
              style={[styles.locationText, { color: theme.colors.textSecondary, ...theme.typography.caption }]}
              numberOfLines={1}
            >
              {getLocationDisplay()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    maxWidth: '60%',
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
  },
  inactiveBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  inactiveBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 12,
    gap: 4,
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
  artisanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  artisanName: {
    flex: 1,
  },
  price: {
    fontWeight: '700',
    marginTop: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    flex: 1,
  },
});
