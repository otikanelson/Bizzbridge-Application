# Button Component

A reusable, accessible button component with multiple variants, sizes, and states.

## Features

- ✅ Three variants: primary, secondary, outline
- ✅ Three sizes: small, medium, large
- ✅ Disabled and loading states
- ✅ Full width option
- ✅ Theme-aware (supports light/dark mode)
- ✅ Minimum 44x44px touch target (WCAG AA compliance)
- ✅ Accessibility support with labels and hints
- ✅ Custom styling support

## Requirements Satisfied

- **33.1**: Button component with variants and sizes
- **33.11**: Theme colors and typography applied
- **35.7**: Typography system integration
- **50.2**: Minimum 44x44 touch target for accessibility

## Usage

### Basic Usage

```tsx
import { Button } from '@/components/common';

<Button
  title="Click Me"
  onPress={() => console.log('Pressed!')}
/>
```

### Variants

```tsx
// Primary (default)
<Button title="Primary" onPress={handlePress} variant="primary" />

// Secondary
<Button title="Secondary" onPress={handlePress} variant="secondary" />

// Outline
<Button title="Outline" onPress={handlePress} variant="outline" />
```

### Sizes

```tsx
// Small
<Button title="Small" onPress={handlePress} size="small" />

// Medium (default)
<Button title="Medium" onPress={handlePress} size="medium" />

// Large
<Button title="Large" onPress={handlePress} size="large" />
```

### States

```tsx
// Disabled
<Button title="Disabled" onPress={handlePress} disabled />

// Loading
<Button title="Loading" onPress={handlePress} loading />
```

### Full Width

```tsx
<Button title="Full Width" onPress={handlePress} fullWidth />
```

### Accessibility

```tsx
<Button
  title="Submit"
  onPress={handleSubmit}
  accessibilityLabel="Submit registration form"
  accessibilityHint="Double tap to submit your registration"
/>
```

### Custom Styling

```tsx
<Button
  title="Custom"
  onPress={handlePress}
  style={{ marginTop: 20 }}
  textStyle={{ fontSize: 18 }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **required** | Button text |
| `onPress` | `() => void` | **required** | Function called when button is pressed |
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Button style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `disabled` | `boolean` | `false` | Whether button is disabled |
| `loading` | `boolean` | `false` | Whether button is in loading state |
| `fullWidth` | `boolean` | `false` | Whether button should take full width |
| `style` | `ViewStyle` | `undefined` | Custom container styles |
| `textStyle` | `TextStyle` | `undefined` | Custom text styles |
| `accessibilityLabel` | `string` | `title` | Accessibility label for screen readers |
| `accessibilityHint` | `string` | `undefined` | Accessibility hint for screen readers |
| `testID` | `string` | `undefined` | Test identifier |

## Styling

The Button component automatically applies theme colors and typography:

- **Primary variant**: Uses `theme.colors.primary` background with white text
- **Secondary variant**: Uses `theme.colors.secondary` background with white text
- **Outline variant**: Transparent background with `theme.colors.primary` border and text
- **Disabled state**: Uses `theme.colors.disabled` for reduced opacity
- **Loading state**: Shows ActivityIndicator with appropriate color

## Accessibility

The Button component follows WCAG AA accessibility guidelines:

1. **Minimum Touch Target**: All buttons have a minimum 44x44px touch target
2. **Accessibility Role**: Properly marked as "button" for screen readers
3. **Accessibility State**: Communicates disabled and loading states
4. **Accessibility Labels**: Supports custom labels and hints
5. **Color Contrast**: Theme colors ensure sufficient contrast ratios

## Examples

See `Button.example.tsx` for comprehensive usage examples.

## Theme Integration

The Button component uses the theme system for consistent styling:

```tsx
const { theme } = useTheme();

// Colors
theme.colors.primary
theme.colors.secondary
theme.colors.disabled

// Typography
theme.typography.button

// Spacing
theme.spacing.xs
theme.spacing.sm
theme.spacing.md
theme.spacing.lg
theme.spacing.xl

// Border Radius
theme.borderRadius.md
```

## Notes

- The button automatically prevents multiple presses when in loading state
- The loading indicator color matches the button variant
- Custom styles are merged with default styles, allowing for easy customization
- The component is fully typed with TypeScript for better developer experience
