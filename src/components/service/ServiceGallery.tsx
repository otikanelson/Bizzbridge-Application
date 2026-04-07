import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Text,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewStyle,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ServiceGalleryProps {
  images: string[];
  style?: ViewStyle;
  testID?: string;
}

// Requirements: 43.1, 43.2, 43.3, 43.4, 43.5, 43.6, 43.7, 43.8
export const ServiceGallery: React.FC<ServiceGalleryProps> = ({
  images,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const fullscreenScrollRef = useRef<ScrollView>(null);

  const validImages = images?.filter(Boolean) ?? [];

  if (validImages.length === 0) {
    return (
      <View
        style={[
          styles.placeholder,
          { backgroundColor: theme.colors.border },
          style,
        ]}
        testID={testID}
      >
        <Ionicons name="image-outline" size={48} color={theme.colors.textSecondary} />
        <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
          No images available
        </Text>
      </View>
    );
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const handleFullscreenScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setFullscreenIndex(index);
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setFullscreenVisible(true);
    // Scroll to the tapped image after modal opens
    setTimeout(() => {
      fullscreenScrollRef.current?.scrollTo({
        x: index * SCREEN_WIDTH,
        animated: false,
      });
    }, 50);
  };

  const closeFullscreen = () => {
    setFullscreenVisible(false);
  };

  return (
    <View style={[styles.container, style]} testID={testID}>
      {/* Swipeable gallery */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        accessibilityLabel="Service image gallery"
      >
        {validImages.map((uri, index) => (
          <TouchableOpacity
            key={`${uri}-${index}`}
            activeOpacity={0.95}
            onPress={() => openFullscreen(index)}
            accessibilityRole="button"
            accessibilityLabel={`View image ${index + 1} of ${validImages.length} fullscreen`}
          >
            <Image
              source={{ uri }}
              style={styles.galleryImage}
              resizeMode="cover"
              accessibilityLabel={`Service image ${index + 1}`}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dot indicators */}
      {validImages.length > 1 && (
        <View style={styles.indicatorContainer}>
          {validImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === activeIndex
                      ? theme.colors.primary
                      : 'rgba(255,255,255,0.6)',
                  width: index === activeIndex ? 16 : 8,
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* Image counter */}
      {validImages.length > 1 && (
        <View
          style={[
            styles.counter,
            { backgroundColor: 'rgba(0,0,0,0.5)' },
          ]}
        >
          <Text style={styles.counterText}>
            {activeIndex + 1} / {validImages.length}
          </Text>
        </View>
      )}

      {/* Fullscreen modal with pinch-to-zoom */}
      <Modal
        visible={fullscreenVisible}
        transparent
        animationType="fade"
        onRequestClose={closeFullscreen}
        statusBarTranslucent
      >
        <View style={styles.fullscreenContainer}>
          <StatusBar hidden />

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeFullscreen}
            accessibilityRole="button"
            accessibilityLabel="Close fullscreen"
          >
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Fullscreen image counter */}
          <View style={styles.fullscreenCounter}>
            <Text style={styles.counterText}>
              {fullscreenIndex + 1} / {validImages.length}
            </Text>
          </View>

          {/* Scrollable fullscreen images */}
          <ScrollView
            ref={fullscreenScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleFullscreenScroll}
            scrollEventThrottle={16}
          >
            {validImages.map((uri, index) => (
              <ScrollView
                key={`fullscreen-${uri}-${index}`}
                style={styles.fullscreenImageWrapper}
                contentContainerStyle={styles.fullscreenImageContent}
                maximumZoomScale={4}
                minimumZoomScale={1}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                centerContent
                bouncesZoom
              >
                <Image
                  source={{ uri }}
                  style={styles.fullscreenImage}
                  resizeMode="contain"
                  accessibilityLabel={`Fullscreen image ${index + 1}`}
                />
              </ScrollView>
            ))}
          </ScrollView>

          {/* Fullscreen dot indicators */}
          {validImages.length > 1 && (
            <View style={styles.fullscreenIndicators}>
              {validImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === fullscreenIndex
                          ? '#FFFFFF'
                          : 'rgba(255,255,255,0.4)',
                      width: index === fullscreenIndex ? 16 : 8,
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 260,
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: 260,
  },
  placeholder: {
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 14,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  counter: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  // Fullscreen styles
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 16,
    right: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 22,
  },
  fullscreenCounter: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 16,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fullscreenImageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  fullscreenImageContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  fullscreenIndicators: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
});
