/**
 * Tests for navigation/linking.ts
 * Validates deep link URL generation, parsing, and unauthenticated redirect logic.
 * Requirements: 54.1, 54.2, 54.3, 54.4, 54.5
 */

import {
  generateServiceLink,
  generateArtisanLink,
  parseDeepLink,
  resolveDeepLinkRoute,
  APP_SCHEME,
} from './linking';

// ---------------------------------------------------------------------------
// generateServiceLink
// ---------------------------------------------------------------------------
describe('generateServiceLink', () => {
  it('produces a bizbridge:// URL for a service id', () => {
    expect(generateServiceLink('abc123')).toBe('bizbridge://services/abc123');
  });

  it('uses the APP_SCHEME constant', () => {
    const link = generateServiceLink('x');
    expect(link.startsWith(`${APP_SCHEME}://`)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// generateArtisanLink
// ---------------------------------------------------------------------------
describe('generateArtisanLink', () => {
  it('produces a bizbridge:// URL for an artisan id', () => {
    expect(generateArtisanLink('xyz789')).toBe('bizbridge://artisans/xyz789');
  });

  it('uses the APP_SCHEME constant', () => {
    const link = generateArtisanLink('y');
    expect(link.startsWith(`${APP_SCHEME}://`)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// parseDeepLink – service links (requirement 54.1)
// ---------------------------------------------------------------------------
describe('parseDeepLink – service', () => {
  it('parses a custom-scheme service URL', () => {
    const result = parseDeepLink('bizbridge://services/abc123');
    expect(result.type).toBe('service');
    expect(result.id).toBe('abc123');
    expect(result.targetPath).toBe('/service/abc123');
  });

  it('parses an HTTPS universal link for a service', () => {
    const result = parseDeepLink('https://bizbridge.ng/services/abc123');
    expect(result.type).toBe('service');
    expect(result.id).toBe('abc123');
    expect(result.targetPath).toBe('/service/abc123');
  });
});

// ---------------------------------------------------------------------------
// parseDeepLink – artisan links (requirement 54.2)
// ---------------------------------------------------------------------------
describe('parseDeepLink – artisan', () => {
  it('parses a custom-scheme artisan URL', () => {
    const result = parseDeepLink('bizbridge://artisans/xyz789');
    expect(result.type).toBe('artisan');
    expect(result.id).toBe('xyz789');
    expect(result.targetPath).toBe('/artisan/xyz789');
  });

  it('parses an HTTPS universal link for an artisan', () => {
    const result = parseDeepLink('https://bizbridge.ng/artisans/xyz789');
    expect(result.type).toBe('artisan');
    expect(result.id).toBe('xyz789');
    expect(result.targetPath).toBe('/artisan/xyz789');
  });
});

// ---------------------------------------------------------------------------
// parseDeepLink – invalid / unknown URLs (requirement 54.5)
// ---------------------------------------------------------------------------
describe('parseDeepLink – unknown / invalid', () => {
  it('returns unknown type for an unrecognised path', () => {
    const result = parseDeepLink('bizbridge://unknown/path');
    expect(result.type).toBe('unknown');
    expect(result.id).toBeNull();
    expect(result.targetPath).toBeNull();
  });

  it('returns unknown type for a completely invalid string', () => {
    const result = parseDeepLink('not-a-url');
    expect(result.type).toBe('unknown');
    expect(result.id).toBeNull();
    expect(result.targetPath).toBeNull();
  });

  it('returns unknown type when id segment is missing', () => {
    const result = parseDeepLink('bizbridge://services/');
    expect(result.type).toBe('unknown');
  });
});

// ---------------------------------------------------------------------------
// resolveDeepLinkRoute (requirement 54.3, 54.4)
// ---------------------------------------------------------------------------
describe('resolveDeepLinkRoute', () => {
  it('returns the target path directly when authenticated (req 54.3)', () => {
    const route = resolveDeepLinkRoute('/service/abc123', true);
    expect(route).toBe('/service/abc123');
  });

  it('redirects to login with encoded redirect param when unauthenticated (req 54.4)', () => {
    const route = resolveDeepLinkRoute('/service/abc123', false);
    expect(route).toContain('/(auth)/login');
    expect(route).toContain('redirect=');
    expect(route).toContain(encodeURIComponent('/service/abc123'));
  });

  it('encodes the artisan target path in the redirect param', () => {
    const route = resolveDeepLinkRoute('/artisan/xyz789', false);
    expect(route).toContain(encodeURIComponent('/artisan/xyz789'));
  });
});
