# BizBridge Mobile Application

A cross-platform mobile application built with TypeScript and Expo that connects Nigerian artisans with customers seeking handcrafted products and services.

## Technology Stack

- **Framework**: Expo SDK 55
- **Language**: TypeScript 5.x with strict mode
- **Navigation**: Expo Router (file-based routing)
- **HTTP Client**: Axios 1.x
- **Storage**: @react-native-async-storage/async-storage
- **UI Library**: React Native Paper 5.x
- **Icons**: @expo/vector-icons
- **Image Handling**: expo-image-picker
- **Date Utilities**: date-fns

## Project Structure

```
mobile/
├── app/                       # Expo Router app directory
│   ├── _layout.tsx           # Root layout
│   ├── index.tsx             # Entry point
│   ├── (auth)/               # Auth route group
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── register-choice.tsx
│   │   ├── register-customer.tsx
│   │   └── register-artisan.tsx
│   ├── (customer)/           # Customer tabs route group
│   │   ├── _layout.tsx
│   │   ├── index.tsx         # Home
│   │   ├── search.tsx
│   │   ├── bookings.tsx
│   │   ├── requests.tsx
│   │   └── profile.tsx
│   └── (artisan)/            # Artisan tabs route group
│       ├── _layout.tsx
│       ├── index.tsx         # Dashboard
│       ├── my-work.tsx
│       ├── inbox.tsx
│       ├── services.tsx
│       └── profile.tsx
├── src/
│   ├── constants/            # Static configuration
│   ├── types/                # TypeScript definitions
│   ├── theme/                # Theme system
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom hooks
│   ├── services/             # API services
│   ├── utils/                # Utility functions
│   └── context/              # React contexts
├── assets/                   # Static assets
├── app.json                  # Expo configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies

```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and Android SDK

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on specific platform:
   ```bash
   npm run android  # Run on Android
   npm run ios      # Run on iOS
   npm run web      # Run on web
   ```

## Configuration

### App Configuration (app.json)

- **App Name**: BizBridge
- **Slug**: bizbridge
- **Version**: 1.0.0
- **Bundle Identifier (iOS)**: com.bizbridge.mobile
- **Package Name (Android)**: com.bizbridge.mobile
- **URL Scheme**: bizbridge://

### TypeScript Configuration

- Strict mode enabled
- ES Module interop enabled
- Synthetic default imports allowed
- JSON module resolution enabled

## Features

### Authentication
- Customer registration and login
- Artisan registration and login
- JWT token-based authentication

### Customer Features
- Browse and search services
- View service details
- Send service requests to artisans
- Manage bookings
- Track request status
- Leave reviews

### Artisan Features
- Create and manage service listings
- View and respond to service requests
- Manage work bookings
- Track business analytics
- Update profile and portfolio

### Common Features
- Light/dark theme support
- Profile management
- Image upload
- Real-time messaging
- Push notifications (planned)

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error handling
- Write descriptive component and function names

### File Organization
- Group related files by feature
- Keep components small and focused
- Separate business logic from UI
- Use custom hooks for reusable logic

### Testing
- Write unit tests for utilities and services
- Test custom hooks
- Test critical user flows
- Use property-based testing where applicable

## License

Proprietary - All rights reserved
