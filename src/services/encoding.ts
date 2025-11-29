/**
 * Encoding Service for PinDrop
 * Handles DIGIPIN encoding/decoding for India mode using the existing digipin library
 * 
 * **Feature: pindrop, Property 1: Round-trip encoding consistency**
 * **Feature: pindrop, Property 2: Coordinate bounds validation**
 * **Feature: pindrop, Property 3: DIGIPIN format validation**
 * **Feature: pindrop, Property 7: Mode-specific encoding**
 */

import {
  Coordinates,
  BoundingBox,
  Mode,
  EncodingResult,
  DecodingResult,
  ValidationResult,
  INDIA_BOUNDS,
  WORLD_BOUNDS,
  VALID_CHARS,
  DIGIPIN_REGEX,
} from '@/types';

// Import the existing digipin library
// eslint-disable-next-line @typescript-eslint/no-require-imports
const digipin = require('../../../digipin/src/digipin.js');

// Import WorldPIN module for global encoding
import { encodeWorldPIN, decodeWorldPIN } from '@/lib/worldpin';

/**
 * Encodes coordinates to a PIN based on the current mode
 * @param coords - The coordinates to encode
 * @param mode - The operating mode ('india' or 'world')
 * @returns EncodingResult with the PIN or error
 */
export function encode(coords: Coordinates, mode: Mode): EncodingResult {
  const { latitude, longitude } = coords;
  
  // Validate coordinates are within mode bounds
  if (!isWithinBounds(coords, mode)) {
    const bounds = getBounds(mode);
    return {
      success: false,
      error: mode === 'india' 
        ? `Coordinates outside India bounds. Latitude must be ${bounds.minLat}° to ${bounds.maxLat}°, Longitude must be ${bounds.minLon}° to ${bounds.maxLon}°`
        : `Coordinates outside valid range. Latitude must be -90° to 90°, Longitude must be -180° to 180°`,
    };
  }

  try {
    if (mode === 'india') {
      // Use the existing DIGIPIN library for India mode
      const pin = digipin.getDigiPin(latitude, longitude);
      const gridBounds = calculateGridBounds(coords, mode);
      return {
        success: true,
        pin,
        gridBounds,
      };
    } else {
      // World mode - use WorldPIN encoder for global coordinates
      const result = encodeWorldPIN(latitude, longitude);
      if (result.success) {
        return {
          success: true,
          pin: result.pin,
          gridBounds: result.gridBounds,
        };
      } else {
        return {
          success: false,
          error: result.error,
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown encoding error',
    };
  }
}

/**
 * Decodes a PIN to coordinates based on the current mode
 * @param pin - The PIN to decode
 * @param mode - The operating mode ('india' or 'world')
 * @returns DecodingResult with coordinates or error
 */
export function decode(pin: string, mode: Mode): DecodingResult {
  // First validate the PIN format
  const validation = validate(pin);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors?.join(', ') || 'Invalid PIN format',
    };
  }

  const normalizedPin = validation.normalized!;

  try {
    if (mode === 'india') {
      // Use the existing DIGIPIN library for India mode
      const result = digipin.getLatLngFromDigiPin(normalizedPin);
      const coordinates: Coordinates = {
        latitude: parseFloat(result.latitude),
        longitude: parseFloat(result.longitude),
      };
      const gridBounds = calculateGridBounds(coordinates, mode);
      return {
        success: true,
        coordinates,
        gridBounds,
      };
    } else {
      // World mode - use WorldPIN decoder for global coordinates
      const result = decodeWorldPIN(normalizedPin);
      if (result.success && result.coordinates) {
        return {
          success: true,
          coordinates: result.coordinates,
          gridBounds: result.gridBounds,
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to decode WorldPIN',
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown decoding error',
    };
  }
}

/**
 * Validates a PIN format
 * @param pin - The PIN string to validate
 * @returns ValidationResult indicating if the PIN is valid
 */
export function validate(pin: string): ValidationResult {
  if (!pin || typeof pin !== 'string') {
    return {
      valid: false,
      errors: ['PIN is required'],
    };
  }

  const errors: string[] = [];
  
  // Remove hyphens for validation
  const normalized = pin.toUpperCase().replace(/-/g, '');
  
  // Check length
  if (normalized.length !== 10) {
    errors.push('PIN must be 10 characters (excluding hyphens)');
  }

  // Check format with regex
  if (!DIGIPIN_REGEX.test(pin)) {
    // Check for invalid characters
    const invalidChars = normalized.split('').filter(
      char => !VALID_CHARS.includes(char as typeof VALID_CHARS[number])
    );
    
    if (invalidChars.length > 0) {
      const uniqueInvalid = Array.from(new Set(invalidChars));
      errors.push(`Invalid characters: ${uniqueInvalid.join(', ')}. Valid characters are: ${VALID_CHARS.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  // Format with hyphens: XXX-XXX-XXXX
  const formatted = `${normalized.slice(0, 3)}-${normalized.slice(3, 6)}-${normalized.slice(6, 10)}`;

  return {
    valid: true,
    normalized: formatted,
  };
}

/**
 * Checks if coordinates are within the valid bounds for a mode
 * @param coords - The coordinates to check
 * @param mode - The operating mode
 * @returns true if coordinates are within bounds
 */
export function isWithinBounds(coords: Coordinates, mode: Mode): boolean {
  const bounds = getBounds(mode);
  const { latitude, longitude } = coords;
  
  return (
    latitude >= bounds.minLat &&
    latitude <= bounds.maxLat &&
    longitude >= bounds.minLon &&
    longitude <= bounds.maxLon
  );
}

/**
 * Gets the bounding box for a mode
 * @param mode - The operating mode
 * @returns BoundingBox for the mode
 */
export function getBounds(mode: Mode): BoundingBox {
  return mode === 'india' ? INDIA_BOUNDS : WORLD_BOUNDS;
}

/**
 * Calculates the approximate grid cell bounds for a coordinate
 * This is an approximation based on the 10-level grid subdivision
 * @param coords - The coordinates
 * @param mode - The operating mode
 * @returns BoundingBox representing the grid cell
 */
function calculateGridBounds(coords: Coordinates, mode: Mode): BoundingBox {
  const bounds = getBounds(mode);
  const { latitude, longitude } = coords;
  
  let minLat = bounds.minLat;
  let maxLat = bounds.maxLat;
  let minLon = bounds.minLon;
  let maxLon = bounds.maxLon;

  // Subdivide 10 times (same as DIGIPIN algorithm)
  for (let level = 0; level < 10; level++) {
    const latDiv = (maxLat - minLat) / 4;
    const lonDiv = (maxLon - minLon) / 4;

    // Calculate which cell the coordinate falls into
    let row = 3 - Math.floor((latitude - minLat) / latDiv);
    let col = Math.floor((longitude - minLon) / lonDiv);

    // Clamp to valid range
    row = Math.max(0, Math.min(row, 3));
    col = Math.max(0, Math.min(col, 3));

    // Update bounds for next level
    maxLat = minLat + latDiv * (4 - row);
    minLat = minLat + latDiv * (3 - row);
    minLon = minLon + lonDiv * col;
    maxLon = minLon + lonDiv;
  }

  return { minLat, maxLat, minLon, maxLon };
}

/**
 * Encoding service interface for dependency injection
 */
export const encodingService = {
  encode,
  decode,
  validate,
  isWithinBounds,
  getBounds,
};

export default encodingService;
