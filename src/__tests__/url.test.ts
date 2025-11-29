/**
 * Property-based tests for the URL Service
 * Uses fast-check for property-based testing
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { parseUrlParams, buildUrl, isValidPinFormat } from '@/services/url';
import { VALID_CHARS, Mode } from '@/types';

/**
 * Arbitrary for generating valid DIGIPIN strings
 */
const validDigipinArb = fc.array(
  fc.constantFrom(...VALID_CHARS),
  { minLength: 10, maxLength: 10 }
).map(chars => {
  const pin = chars.join('');
  return `${pin.slice(0, 3)}-${pin.slice(3, 6)}-${pin.slice(6, 10)}`;
});

/**
 * Arbitrary for generating valid mode
 */
const modeArb = fc.constantFrom<Mode>('india', 'world');

/**
 * Arbitrary for generating invalid DIGIPIN strings
 */
const invalidDigipinArb = fc.oneof(
  // Too short
  fc.array(fc.constantFrom(...VALID_CHARS), { minLength: 1, maxLength: 9 }).map(c => c.join('')),
  // Too long
  fc.array(fc.constantFrom(...VALID_CHARS), { minLength: 11, maxLength: 15 }).map(c => c.join('')),
  // Invalid characters only
  fc.array(
    fc.constantFrom('A', 'B', 'D', 'E', 'G', 'H', 'I', 'N', 'O', 'Q', 'R', 'S', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1'),
    { minLength: 10, maxLength: 10 }
  ).map(c => c.join('')),
  // Empty string
  fc.constant(''),
);

describe('URL Service Property Tests', () => {
  /**
   * **Feature: pindrop, Property 4: Shareable URL generation**
   * **Validates: Requirements 7.5, 10.1**
   * 
   * For any valid PIN and mode, the generated shareable URL contains the PIN 
   * as a query parameter and can be parsed back to retrieve the original PIN and mode.
   */
  describe('Property 4: Shareable URL generation', () => {
    it('should generate URL containing PIN as query parameter', () => {
      fc.assert(
        fc.property(validDigipinArb, modeArb, (pin: string, mode: Mode) => {
          const url = buildUrl(pin, mode, 'https://example.com');
          
          // URL should contain the pin parameter
          expect(url).toContain('pin=');
          expect(url).toContain(encodeURIComponent(pin.toUpperCase()));
          
          // URL should contain the mode parameter
          expect(url).toContain(`mode=${mode}`);
        }),
        { numRuns: 100 }
      );
    });

    it('should round-trip: buildUrl then parseUrlParams returns original PIN and mode', () => {
      fc.assert(
        fc.property(validDigipinArb, modeArb, (pin: string, mode: Mode) => {
          // Build URL
          const url = buildUrl(pin, mode, 'https://example.com');
          
          // Parse the URL
          const urlObj = new URL(url);
          const parsed = parseUrlParams(urlObj.searchParams);
          
          // Should successfully parse
          expect(parsed).not.toBeNull();
          
          // Should return the same PIN (normalized to uppercase with hyphens)
          const normalizedPin = pin.toUpperCase().replace(/-/g, '');
          const expectedPin = `${normalizedPin.slice(0, 3)}-${normalizedPin.slice(3, 6)}-${normalizedPin.slice(6, 10)}`;
          expect(parsed!.pin).toBe(expectedPin);
          
          // Should return the same mode
          expect(parsed!.mode).toBe(mode);
        }),
        { numRuns: 100 }
      );
    });

    it('should handle PIN without hyphens in round-trip', () => {
      fc.assert(
        fc.property(validDigipinArb, modeArb, (pin: string, mode: Mode) => {
          // Remove hyphens from PIN
          const pinWithoutHyphens = pin.replace(/-/g, '');
          
          // Build URL with PIN without hyphens
          const url = buildUrl(pinWithoutHyphens, mode, 'https://example.com');
          
          // Parse the URL
          const urlObj = new URL(url);
          const parsed = parseUrlParams(urlObj.searchParams);
          
          // Should successfully parse
          expect(parsed).not.toBeNull();
          
          // Should return normalized PIN with hyphens
          const normalizedPin = pin.toUpperCase().replace(/-/g, '');
          const expectedPin = `${normalizedPin.slice(0, 3)}-${normalizedPin.slice(3, 6)}-${normalizedPin.slice(6, 10)}`;
          expect(parsed!.pin).toBe(expectedPin);
        }),
        { numRuns: 100 }
      );
    });

    it('should default to india mode when mode is not specified', () => {
      fc.assert(
        fc.property(validDigipinArb, (pin: string) => {
          // Create params without mode
          const params = { pin };
          const parsed = parseUrlParams(params);
          
          expect(parsed).not.toBeNull();
          expect(parsed!.mode).toBe('india');
        }),
        { numRuns: 100 }
      );
    });
  });


  /**
   * **Feature: pindrop, Property 8: Invalid URL parameter handling**
   * **Validates: Requirements 10.3**
   * 
   * For any URL containing an invalid PIN parameter (wrong format, invalid characters, 
   * or empty), the URL parser returns an error result rather than attempting to decode.
   */
  describe('Property 8: Invalid URL parameter handling', () => {
    it('should return null for invalid PIN formats', () => {
      fc.assert(
        fc.property(invalidDigipinArb, modeArb, (pin: string, mode: Mode) => {
          const params = { pin, mode };
          const parsed = parseUrlParams(params);
          
          // Should return null for invalid PIN
          expect(parsed).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('should return null when PIN parameter is missing', () => {
      fc.assert(
        fc.property(modeArb, (mode: Mode) => {
          // No pin parameter
          const params = { mode };
          const parsed = parseUrlParams(params);
          
          expect(parsed).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('should return null for null/undefined searchParams', () => {
      expect(parseUrlParams(null)).toBeNull();
    });

    it('should correctly identify invalid PIN formats with isValidPinFormat', () => {
      fc.assert(
        fc.property(invalidDigipinArb, (pin: string) => {
          expect(isValidPinFormat(pin)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should correctly identify valid PIN formats with isValidPinFormat', () => {
      fc.assert(
        fc.property(validDigipinArb, (pin: string) => {
          expect(isValidPinFormat(pin)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should handle URLSearchParams with invalid PIN', () => {
      fc.assert(
        fc.property(invalidDigipinArb, (pin: string) => {
          const searchParams = new URLSearchParams();
          searchParams.set('pin', pin);
          searchParams.set('mode', 'india');
          
          const parsed = parseUrlParams(searchParams);
          expect(parsed).toBeNull();
        }),
        { numRuns: 100 }
      );
    });
  });
});
