/**
 * Onboarding Screen
 * Requirements: 71.1, 71.2, 71.3, 71.4, 71.5, 71.6, 71.7, 71.8
 */

import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { storeOnboardingCompleted } from '../../src/utils/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    icon: '🔨',
    title: 'Discover Skilled Artisans',
    description:
      'Browse hundreds of talented Nigerian artisans across 26+ craft categories — from woodworking to jewelry making.',
  },
  {
    id: '2',
    icon: '📋',
    title: 'Request Services Easily',
    description:
      'Send service requests directly to artisans, describe your needs, and get responses quickly.',
  },
  {
    id: '3',
    icon: '🤝',
    title: 'Book with Confidence',
    description:
      'Agree on terms, track your booking progress, and communicate with your artisan all in one place.',
  },
  {
    id: '4',
    icon: '⭐',
    title: 'Rate & Review',
    description:
      'Share your experience after every completed booking to help others find the best artisans.',
  },
  {
    id: '5',
    icon: '🚀',
    title: 'Grow Your Business',
    description:
      'Artisans can list services, manage bookings, and reach customers across Lagos — all from their phone.',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

  const isLastSlide = currentIndex === SLIDES.length - 1;

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const completeOnboarding = async () => {
    await storeOnboardingCompleted(true);
    router.replace('/(auth)/login');
  };

  const handleNext = () => {
    if (isLastSlide) {
      completeOnboarding();
    } else {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      <Text style={styles.slideIcon}>{item.icon}</Text>
      <Text style={[styles.slideTitle, { color: theme.colors.text }]}>{item.title}</Text>
      <Text style={[styles.slideDescription, { color: theme.colors.textSecondary }]}>
        {item.description}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Skip button */}
      {!isLastSlide && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        style={styles.flatList}
      />

      {/* Dot indicators */}
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? theme.colors.primary : theme.colors.border,
                width: index === currentIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Action buttons */}
      <View style={styles.buttonsContainer}>
        {isLastSlide ? (
          <TouchableOpacity
            style={[styles.getStartedButton, { backgroundColor: theme.colors.primary }]}
            onPress={completeOnboarding}
            accessibilityRole="button"
            accessibilityLabel="Get Started"
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel="Next slide"
          >
            <Text style={styles.nextText}>Next →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  flatList: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  slideIcon: {
    fontSize: 80,
    marginBottom: 32,
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  getStartedButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
