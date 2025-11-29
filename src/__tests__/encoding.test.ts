/**
 * Property-based tests for the Encoding Service
 * Uses fast-check for property-based testing
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { encode, decode, validate, isWithinBounds, getBounds } from '@/services/encoding';
import { INDIA_BOUNDS, WORLD_BOUNDS, VALID_CHARS, Coordinates, Mode } from '@/types';
import { encodeWorldPIN, decodeWorldPIN, validateWorldPIN } from '@/lib/worldpin';

// Import the digipin library directly for comparison in mode-specific test
const digipin = require('../../../digipin/src/digipin.js');

/**
 * Arbitrary for generating valid coordinates within India bounds
 * Slightly inside bounds to avoid edge cases at exact boundaries
 */
const indiaCoordinatesArb = fc.record({
  latitude: fc.double({ 
    min: INDIA_BOUNDS.minLat + 0.001, 
    max: INDIA_BOUNDS.maxLat - 0.001,
    noNaN: true,
  }),
  longitude: fc.double({ 
    min: INDIA_BOUNDS.minLon + 0.001, 
    max: INDIA_BOUNDS.maxLon - 0.001,
    noNaN: true,
  }),
});

/**
 * Arbitrary for generating valid coordinates within World bounds
 */
const worldCoordinatesArb = fc.record({
  latitude: fc.double({ 
    min: WORLD_BOUNDS.minLat + 0.001, 
    max: WORLD_BOUNDS.maxLat - 0.001,
    noNaN: true,
  }),
  longitude: fc.double({ 
    min: WORLD_BOUNDS.minLon + 0.001, 
    max: WORLD_BOUNDS.maxLon - 0.001,
    noNaN: true,
  }),
});

/**
 * Arbitrary for generating coordinates outside India bounds but within world bounds
 */
const outsideIndiaBoundsArb = fc.oneof(
  // North of India
  fc.record({
    latitude: fc.double({ min: INDIA_BOUNDS.maxLat + 1, max: 89, noNaN: true }),
    longitude: fc.double({ min: -179, max: 179, noNaN: true }),
  }),
  // South of India
  fc.record({
    latitude: fc.double({ min: -89, max: INDIA_BOUNDS.minLat - 1, noNaN: true }),
    longitude: fc.double({ min: -179, max: 179, noNaN: true }),
  }),
  // West of India
  fc.record({
    latitude: fc.double({ min: -89, max: 89, noNaN: true }),
    longitude: fc.double({ min: -179, max: INDIA_BOUNDS.minLon - 1, noNaN: true }),
  }),
  // East of India
  fc.record({
    latitude: fc.double({ min: -89, max: 89, noNaN: true }),
    longitude: fc.double({ min: INDIA_BOUNDS.maxLon + 1, max: 179, noNaN: true }),
  }),
);

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
 * Arbitrary for generating invalid DIGIPIN strings (wrong format or characters)
 */
const invalidDigipinArb = fc.oneof(
  // Too short
  fc.array(fc.constantFrom(...VALID_CHARS), { minLength: 1, maxLength: 9 }).map(c => c.join('')),
  // Too long
  fc.array(fc.constantFrom(...VALID_CHARS), { minLength: 11, maxLength: 15 }).map(c => c.join('')),
  // Invalid characters
  fc.array(fc.constantFrom('A', 'B', 'D', 'E', 'G', 'H', 'I', 'N', 'O', 'Q', 'R', 'S', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1'), { minLength: 10, maxLength: 10 }).map(c => c.join('')),
  // Empty string
  fc.constant(''),
);

describe('Encoding Service Property Tests', () => {
  /**
   * **Feature: pindrop, Property 1: Round-trip encoding consistency**
   * **Validates: Requirements 2.2, 4.1, 5.1**
   * 
   * For any valid coordinates within India bounds, encoding to a PIN and then 
   * decoding back should return coordinates within the same grid cell 
   * (approximately equal within the ~4m precision).
   */
  describe('Property 1: Round-trip encoding consistency', () => {
    it('should return coordinates within the same grid cell after encode-decode round trip', () => {
      fc.assert(
        fc.property(indiaCoordinatesArb, (coords: Coordinates) => {
          // Encode the coordinates
          const encodeResult = encode(coords, 'india');
          expect(encodeResult.success).toBe(true);
          expect(encodeResult.pin).toBeDefined();

          // Decode the PIN back to coordinates
          const decodeResult = decode(encodeResult.pin!, 'india');
          expect(decodeResult.success).toBe(true);
          expect(decodeResult.coordinates).toBeDefined();

          // The decoded coordinates should be within the grid bounds
          // The grid cell is approximately 4m x 4m at level 10
          // We check that the decoded coordinates are within the grid bounds
          if (encodeResult.gridBounds) {
            const decoded = decodeResult.coordinates!;
            expect(decoded.latitude).toBeGreaterThanOrEqual(encodeResult.gridBounds.minLat);
            expect(decoded.latitude).toBeLessThanOrEqual(encodeResult.gridBounds.maxLat);
            expect(decoded.longitude).toBeGreaterThanOrEqual(encodeResult.gridBounds.minLon);
            expect(decoded.longitude).toBeLessThanOrEqual(encodeResult.gridBounds.maxLon);
          }

          // Re-encoding the decoded coordinates should produce the same PIN
          const reEncodeResult = encode(decodeResult.coordinates!, 'india');
          expect(reEncodeResult.success).toBe(true);
          expect(reEncodeResult.pin).toBe(encodeResult.pin);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: pindrop, Property 2: Coordinate bounds validation**
   * **Validates: Requirements 2.4, 4.2, 4.3**
   * 
   * For any pair of latitude and longitude values, the system correctly identifies 
   * whether they fall within the valid bounds for the current mode.
   */
  describe('Property 2: Coordinate bounds validation', () => {
    it('should correctly identify coordinates within India bounds', () => {
      fc.assert(
        fc.property(indiaCoordinatesArb, (coords: Coordinates) => {
          expect(isWithinBounds(coords, 'india')).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should correctly identify coordinates outside India bounds', () => {
      fc.assert(
        fc.property(outsideIndiaBoundsArb, (coords: Coordinates) => {
          expect(isWithinBounds(coords, 'india')).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should correctly identify coordinates within World bounds', () => {
      fc.assert(
        fc.property(worldCoordinatesArb, (coords: Coordinates) => {
          expect(isWithinBounds(coords, 'world')).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should return correct bounds for each mode', () => {
      const indiaBounds = getBounds('india');
      expect(indiaBounds).toEqual(INDIA_BOUNDS);

      const worldBounds = getBounds('world');
      expect(worldBounds).toEqual(WORLD_BOUNDS);
    });
  });

  /**
   * **Feature: pindrop, Property 3: DIGIPIN format validation**
   * **Validates: Requirements 5.3, 5.4, 5.5**
   * 
   * For any input string, the validator correctly identifies whether it matches 
   * the DIGIPIN format (XXX-XXX-XXXX or XXXXXXXXXX) using only valid characters.
   */
  describe('Property 3: DIGIPIN format validation', () => {
    it('should accept valid DIGIPIN formats', () => {
      fc.assert(
        fc.property(validDigipinArb, (pin: string) => {
          const result = validate(pin);
          expect(result.valid).toBe(true);
          expect(result.normalized).toBeDefined();
          // Normalized format should be XXX-XXX-XXXX
          expect(result.normalized).toMatch(/^[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{4}$/);
        }),
        { numRuns: 100 }
      );
    });

    it('should accept valid DIGIPIN without hyphens', () => {
      fc.assert(
        fc.property(validDigipinArb, (pin: string) => {
          // Remove hyphens
          const pinWithoutHyphens = pin.replace(/-/g, '');
          const result = validate(pinWithoutHyphens);
          expect(result.valid).toBe(true);
          expect(result.normalized).toBeDefined();
        }),
        { numRuns: 100 }
      );
    });

    it('should reject invalid DIGIPIN formats', () => {
      fc.assert(
        fc.property(invalidDigipinArb, (pin: string) => {
          const result = validate(pin);
          expect(result.valid).toBe(false);
          expect(result.errors).toBeDefined();
          expect(result.errors!.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    it('should be case-insensitive', () => {
      fc.assert(
        fc.property(validDigipinArb, (pin: string) => {
          const lowerResult = validate(pin.toLowerCase());
          const upperResult = validate(pin.toUpperCase());
          
          expect(lowerResult.valid).toBe(upperResult.valid);
          if (lowerResult.valid && upperResult.valid) {
            expect(lowerResult.normalized).toBe(upperResult.normalized);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: pindrop, Property 7: Mode-specific encoding**
   * **Validates: Requirements 9.4**
   * 
   * For any coordinates within India bounds, Indian_Mode uses the DIGIPIN library 
   * and produces the same result as calling the library directly.
   */
  describe('Property 7: Mode-specific encoding', () => {
    it('should produce same result as direct DIGIPIN library call for India mode', () => {
      fc.assert(
        fc.property(indiaCoordinatesArb, (coords: Coordinates) => {
          // Encode using our service
          const serviceResult = encode(coords, 'india');
          expect(serviceResult.success).toBe(true);

          // Encode using the library directly
          const libraryResult = digipin.getDigiPin(coords.latitude, coords.longitude);

          // Results should match
          expect(serviceResult.pin).toBe(libraryResult);
        }),
        { numRuns: 100 }
      );
    });

    it('should decode to same coordinates as direct DIGIPIN library call', () => {
      fc.assert(
        fc.property(indiaCoordinatesArb, (coords: Coordinates) => {
          // First encode to get a valid PIN
          const pin = digipin.getDigiPin(coords.latitude, coords.longitude);

          // Decode using our service
          const serviceResult = decode(pin, 'india');
          expect(serviceResult.success).toBe(true);

          // Decode using the library directly
          const libraryResult = digipin.getLatLngFromDigiPin(pin);

          // Results should match (library returns strings, we parse to numbers)
          expect(serviceResult.coordinates!.latitude).toBeCloseTo(parseFloat(libraryResult.latitude), 6);
          expect(serviceResult.coordinates!.longitude).toBeCloseTo(parseFloat(libraryResult.longitude), 6);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: pindrop, Property 6: WorldPIN global coverage**
   * **Validates: Requirements 9.2**
   * 
   * For any valid global coordinates (latitude -90 to 90, longitude -180 to 180),
   * World_Mode generates a valid WorldPIN code.
   */
  describe('Property 6: WorldPIN global coverage', () => {
    it('should generate valid WorldPIN for any global coordinates', () => {
      fc.assert(
        fc.property(worldCoordinatesArb, (coords: Coordinates) => {
          // Encode using WorldPIN
          const result = encodeWorldPIN(coords.latitude, coords.longitude);
          
          // Should succeed for any valid global coordinates
          expect(result.success).toBe(true);
          expect(result.pin).toBeDefined();
          
          // PIN should be valid format (10 chars with hyphens: XXX-XXX-XXXX)
          expect(result.pin).toMatch(/^[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{4}$/);
          
          // Should have grid bounds
          expect(result.gridBounds).toBeDefined();
        }),
        { numRuns: 100 }
      );
    });

    it('should round-trip encode/decode for any global coordinates', () => {
      fc.assert(
        fc.property(worldCoordinatesArb, (coords: Coordinates) => {
          // Encode
          const encodeResult = encodeWorldPIN(coords.latitude, coords.longitude);
          expect(encodeResult.success).toBe(true);
          
          // Decode
          const decodeResult = decodeWorldPIN(encodeResult.pin!);
          expect(decodeResult.success).toBe(true);
          expect(decodeResult.coordinates).toBeDefined();
          
          // Decoded coordinates should be within the grid bounds
          if (encodeResult.gridBounds) {
            const decoded = decodeResult.coordinates!;
            expect(decoded.latitude).toBeGreaterThanOrEqual(encodeResult.gridBounds.minLat);
            expect(decoded.latitude).toBeLessThanOrEqual(encodeResult.gridBounds.maxLat);
            expect(decoded.longitude).toBeGreaterThanOrEqual(encodeResult.gridBounds.minLon);
            expect(decoded.longitude).toBeLessThanOrEqual(encodeResult.gridBounds.maxLon);
          }
          
          // Re-encoding should produce the same PIN
          const reEncodeResult = encodeWorldPIN(decodeResult.coordinates!.latitude, decodeResult.coordinates!.longitude);
          expect(reEncodeResult.success).toBe(true);
          expect(reEncodeResult.pin).toBe(encodeResult.pin);
        }),
        { numRuns: 100 }
      );
    });

    it('should work through encoding service in world mode', () => {
      fc.assert(
        fc.property(worldCoordinatesArb, (coords: Coordinates) => {
          // Encode using the encoding service in world mode
          const serviceResult = encode(coords, 'world');
          expect(serviceResult.success).toBe(true);
          expect(serviceResult.pin).toBeDefined();
          
          // Should match direct WorldPIN encoding
          const directResult = encodeWorldPIN(coords.latitude, coords.longitude);
          expect(serviceResult.pin).toBe(directResult.pin);
          
          // Decode using the encoding service
          const decodeResult = decode(serviceResult.pin!, 'world');
          expect(decodeResult.success).toBe(true);
          expect(decodeResult.coordinates).toBeDefined();
        }),
        { numRuns: 100 }
      );
    });

    it('should validate WorldPIN format correctly', () => {
      fc.assert(
        fc.property(worldCoordinatesArb, (coords: Coordinates) => {
          // Generate a WorldPIN
          const result = encodeWorldPIN(coords.latitude, coords.longitude);
          expect(result.success).toBe(true);
          
          // Validate the generated PIN
          expect(validateWorldPIN(result.pin!)).toBe(true);
          
          // Also validate without hyphens
          const pinWithoutHyphens = result.pin!.replace(/-/g, '');
          expect(validateWorldPIN(pinWithoutHyphens)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });
});
