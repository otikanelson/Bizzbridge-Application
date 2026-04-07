# Card Component

A reusable, theme-aware card component for displaying content containers with configurable elevation and padding.

## Features

- ✅ Configurable elevation/shadow support (none, sm, md, lg)
- ✅ Configurable padding (none, xs, sm, md, lg, xl)
- ✅ Theme-aware (supports light/dark mode)
- ✅ Rounded corners with theme border radius
- ✅ Custom styling support
- ✅ Flexible content container

## Requirements Satisfied

- **33.2**: Card component for displaying content containers
- **33.11**: Theme colors applied
- **35.7**: Typography system integration (via theme)
- **35.8**: Shadows and elevation for visual hierarchy

## Usage

### Basic Usage

```tsx
import { Card } from '@/components/common';
import { Text } from 'react-native';

<Card>
  <Text>Card Content</Text>
</Card>
```

### Elevation Levels

```tsx
// No elevation
<Card elevation="none">
  <Text>Flat Card</Text>
</Card>

// Small elevation (default)
<Card elevation="sm">
  <Text>Small Shadow</Text>
</Card>

// Medium elevation
<Card elevation="md">
  <Text>Medium Shadow</Text>
</Card>

// Large elevation
<Card elevation="lg">
  <Text>Large Shadow</Text>
</Card>
```

### Padding Options

```tsx
// No padding
<Card padding="none">
  <Text>No Padding</Text>
</Card>

// Extra small padding
<Card padding="xs">
  <Text>XS Padding</Text>
</Card>

// Small padding
<Card padding="sm">
  <Text>Small Padding</Text>
</Card>

// Medium padding (default)
<Card padding="md">
  <Text>Medium Padding</Text>
</Card>

// Large padding
<Card padding="lg">
  <Text>Large Padding</Text>
</Card>

// Extra large padding
<Card padding="xl">
  <Text>XL Padding</Text>
</Card>
```

### Custom Styling

```tsx
<Card
  elevation="md"
  padding="lg"
  style={{ marginBottom: 16, borderWidth: 2 }}
>
  <Text>Custom Styled Card</Text>
</Card>
```

### Complex Content

```tsx
<Card elevation="md" padding="lg">
  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Card Title</Text>
  <Text style={{ marginTop: 8 }}>Card description goes here</Text>
  <Button title="Action" onPress={handlePress} style={{ marginTop: 16 }} />
</Card>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **required** | Content to display inside the card |
| `elevation` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'sm'` | Shadow/elevation level |
| `padding` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Internal padding |
| `style` | `ViewStyle` | `undefined` | Custom container styles |
| `testID` | `string` | `undefined` | Test identifier |

## Styling

The Card component automatically applies theme styles:

- **Background**: Uses `theme.colors.card` for background color
- **Border**: Uses `theme.colors.border` for border color
- **Border Radius**: Uses `theme.borderRadius.md` for rounded corners
- **Shadows**: Uses `theme.shadows.sm/md/lg` for elevation effects

### Elevation Styles

- **none**: No shadow, flat appearance
- **sm**: Subtle shadow (2px elevation on Android)
- **md**: Medium shadow (4px elevation on Android)
- **lg**: Prominent shadow (8px elevation on Android)

### Padding Values

Based on theme spacing scale:
- **none**: 0px
- **xs**: 4px
- **sm**: 8px
- **md**: 16px (default)
- **lg**: 24px
- **xl**: 32px

## Theme Integration

The Card component uses the theme system for consistent styling:

```tsx
const { theme } = useTheme();

// Colors
theme.colors.card        // Background color
theme.colors.border      // Border color

// Spacing
theme.spacing.xs         // 4px
theme.spacing.sm         // 8px
theme.spacing.md         // 16px
theme.spacing.lg         // 24px
theme.spacing.xl         // 32px

// Border Radius
theme.borderRadius.md    // 8px

// Shadows
theme.shadows.sm         // Small elevation
theme.shadows.md         // Medium elevation
theme.shadows.lg         // Large elevation
```

## Common Use Cases

### Service Card

```tsx
<Card elevation="md" padding="md">
  <Image source={{ uri: service.image }} style={styles.image} />
  <Text style={styles.title}>{service.title}</Text>
  <Text style={styles.category}>{service.category}</Text>
  <Text style={styles.price}>{service.price}</Text>
</Card>
```

### Booking Card

```tsx
<Card elevation="sm" padding="lg">
  <Text style={styles.bookingTitle}>{booking.title}</Text>
  <Text style={styles.artisan}>{booking.artisan.name}</Text>
  <Text style={styles.date}>{formatDate(booking.date)}</Text>
  <BookingStatus status={booking.status} />
</Card>
```

### Dashboard Stat Card

```tsx
<Card elevation="md" padding="lg" style={{ flex: 1 }}>
  <Text style={styles.statValue}>{stats.activeBookings}</Text>
  <Text style={styles.statLabel}>Active Bookings</Text>
</Card>
```

### Form Container

```tsx
<Card elevation="sm" padding="xl">
  <Input label="Email" value={email} onChangeText={setEmail} />
  <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />
  <Button title="Login" onPress={handleLogin} fullWidth />
</Card>
```

## Platform Differences

### iOS
- Uses `shadowColor`, `shadowOffset`, `shadowOpacity`, and `shadowRadius` for shadows
- Shadows appear softer and more diffused

### Android
- Uses `elevation` property for shadows
- Shadows appear more defined with harder edges
- Elevation values: sm=2, md=4, lg=8

## Notes

- The Card component is a simple container and doesn't handle touch interactions by default
- For touchable cards, wrap the Card in a TouchableOpacity or Pressable component
- Custom styles are merged with default styles, allowing for easy customization
- The component automatically adapts to light and dark themes
- Border is always 1px to provide subtle definition in both themes

## Accessibility

While the Card component itself doesn't have specific accessibility requirements, ensure that:
- Content inside cards has proper accessibility labels
- Interactive elements within cards meet minimum touch target sizes (44x44px)
- Text has sufficient color contrast with the card background
- Screen readers can properly navigate card content

