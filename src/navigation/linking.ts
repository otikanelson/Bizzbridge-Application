/**
 * Deep Link Configuration
 * Defines URL patterns and helpers for deep linking in BizBridge.
 *
 * Supported deep links:
 *   bizbridge://services/:id   → Service details screen
 *   bizbridge://artisans/:id   → Artisan profile screen
 *
 * Requirements: 54.1, 54.2, 54.3, 54.4, 54.5, 54.6, 54.7
 *
 * The app scheme "bizbridge" is configured in app.json.
 * Expo Router handles file-based routing automatically; this module
 * provides URL pattern constants, a shareable-link generator, and a
 * helper that resolves a deep-link URL to an in-app route path so
 * callers can redirect unauthenticated users to login first.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Custom URL scheme registered in app.json */
export const APP_SCHEME = 'bizbridge';

/** Deep link URL patterns (for documentation / validation) */
export const DEEP_LINK_PATTERNS = {
  SERVICE: `${APP_SCHEME}://services/:id`,
  ARTISAN: `${APP_SCHEME}://artisans/:id`,
} as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DeepLinkType = 'service' | 'artisan' | 'unknown';

export interface ParsedDeepLink {
  type: DeepLinkType;
  /** The entity id extracted from the URL, or null when not applicable */
  id: string | null;
  /**
   * The Expo Router path to navigate to after authentication.
   * e.g. "/service/abc123" or "/artisan/abc123"
   */
  targetPath: string | null;
}

// ---------------------------------------------------------------------------
// URL generation helpers
// ---------------------------------------------------------------------------

/**
 * Generates a shareable deep link URL for a service.
 *
 * @example
 * generateServiceLink('abc123') // → "bizbridge://services/abc123"
 */
export function generateServiceLink(serviceId: string): string {
  return `${APP_SCHEME}://services/${serviceId}`;
}

/**
 * Generates a shareable deep link URL for an artisan profile.
 *
 * @example
 * generateArtisanLink('xyz789') // → "bizbridge://artisans/xyz789"
 */
export function generateArtisanLink(artisanId: string): string {
  return `${APP_SCHEME}://artisans/${artisanId}`;
}

// ---------------------------------------------------------------------------
// URL parsing
// ---------------------------------------------------------------------------

/**
 * Parses a deep link URL and returns structured information about it.
 *
 * Handles both custom-scheme URLs (bizbridge://...) and HTTPS universal
 * links (https://bizbridge.ng/...) to satisfy requirements 54.6 and 54.7.
 *
 * Returns `{ type: 'unknown', id: null, targetPath: null }` for unrecognised
 * URLs so callers can show an appropriate error (requirement 54.5).
 */
export function parseDeepLink(url: string): ParsedDeepLink {
  try {
    // Normalise: replace custom scheme with https so URL() can parse it
    const normalised = url
      .replace(/^bizbridge:\/\//, 'https://bizbridge.app/')
      .replace(/^https?:\/\/bizbridge\.ng\//, 'https://bizbridge.app/');

    const parsed = new URL(normalised);
    const segments = parsed.pathname.replace(/^\//, '').split('/');

    // bizbridge://services/:id  →  segments = ['services', ':id']
    if (segments[0] === 'services' && segments[1]) {
      return {
        type: 'service',
        id: segments[1],
        targetPath: `/service/${segments[1]}`,
      };
    }

    // bizbridge://artisans/:id  →  segments = ['artisans', ':id']
    if (segments[0] === 'artisans' && segments[1]) {
      return {
        type: 'artisan',
        id: segments[1],
        targetPath: `/artisan/${segments[1]}`,
      };
    }

    return { type: 'unknown', id: null, targetPath: null };
  } catch {
    return { type: 'unknown', id: null, targetPath: null };
  }
}

// ---------------------------------------------------------------------------
// Unauthenticated access helper
// ---------------------------------------------------------------------------

/**
 * Returns the route the app should navigate to when a deep link is opened.
 *
 * - If the user is authenticated, returns `targetPath` directly.
 * - If the user is NOT authenticated, returns the login path with the
 *   original `targetPath` encoded as a `redirect` query parameter so the
 *   login screen can forward the user after a successful sign-in
 *   (requirement 54.4).
 *
 * @param targetPath  The in-app path resolved by `parseDeepLink`
 * @param isAuthenticated  Whether the user currently has a valid session
 */
export function resolveDeepLinkRoute(
  targetPath: string,
  isAuthenticated: boolean,
): string {
  if (isAuthenticated) {
    return targetPath;
  }
  const encoded = encodeURIComponent(targetPath);
  return `/(auth)/login?redirect=${encoded}`;
}

// ---------------------------------------------------------------------------
// Expo Router linking configuration
// ---------------------------------------------------------------------------

/**
 * Linking configuration object compatible with Expo Router / React Navigation.
 *
 * Pass this to the `<NavigationContainer linking={...}>` prop (or the Expo
 * Router root layout) to enable automatic deep-link handling.
 *
 * Requirements 54.6 (iOS universal links) and 54.7 (Android app links) are
 * satisfied by including the HTTPS prefixes alongside the custom scheme.
 */
export const linkingConfig = {
  prefixes: [
    `${APP_SCHEME}://`,
    'https://bizbridge.ng',
    'https://www.bizbridge.ng',
  ],
  config: {
    screens: {
      // Service details: bizbridge://services/:id
      'service/[id]': 'services/:id',
      // Artisan profile: bizbridge://artisans/:id
      'artisan/[id]': 'artisans/:id',
    },
  },
} as const;
