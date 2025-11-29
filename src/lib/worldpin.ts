/**
 * WorldPIN Encoder and Decoder Module
 * A global location encoding system using the same grid-based algorithm as DIGIPIN
 * but with worldwide coordinate bounds (-90 to 90 latitude, -180 to 180 longitude)
 * 
 * **Feature: pindrop, Property 6: WorldPIN global coverage**
 */

import { Coordinates, BoundingBox, WORLD_BOUNDS, VALID_CHARS } from '@/types';

/**
 * The 4x4 grid used for encoding coordinates to characters
 * Same grid as DIGIPIN for consistency
 */
const WORLDPIN_GRID: string[][] = [
  ['F', 'C', '9', '8'],
  ['J', '3', '2', '7'],
  ['K', '4', '5', '6'],
  ['L', 'M', 'P', 'T']
];

/**
 * Result of encoding coordinates to WorldPIN
 */
export interface WorldPINEncodeResult {
  success: boolean;
  pin?: string;
  gridBounds?: BoundingBox;
  error?: string;
}

/**
 * Result of decoding WorldPIN to coordinates
 */
export interface WorldPINDecodeResult {
  success: boolean;
  coordinates?: Coordinates;
  gridBounds?: BoundingBox;
  error?: string;
}

/**
 * Encodes global coordinates to a WorldPIN code
 * Uses the same 4x4 grid subdivision algorithm as DIGIPIN but with global bounds
 * 
 * @param lat - Latitude (-90 to 90)
 * @param lon - Longitude (-180 to 180)
 * @returns WorldPINEncodeResult with the encoded PIN or error
 */
export function encodeWorldPIN(lat: number, lon: number): WorldPINEncodeResult {
  // Validate bounds
  if (lat < WORLD_BOUNDS.minLat || lat > WORLD_BOUNDS.maxLat) {
    return {
      success: false,
      error: `Latitude out of range. Must be between ${WORLD_BOUNDS.minLat}° and ${WORLD_BOUNDS.maxLat}°`
    };
  }

  if (lon < WORLD_BOUNDS.minLon || lon > WORLD_BOUNDS.maxLon) {
    return {
      success: false,
      error: `Longitude out of range. Must be between ${WORLD_BOUNDS.minLon}° and ${WORLD_BOUNDS.maxLon}°`
    };
  }

  let minLat = WORLD_BOUNDS.minLat;
  let maxLat = WORLD_BOUNDS.maxLat;
  let minLon = WORLD_BOUNDS.minLon;
  let maxLon = WORLD_BOUNDS.maxLon;

  let worldPin = '';

  for (let level = 1; level <= 10; level++) {
    const latDiv = (maxLat - minLat) / 4;
    const lonDiv = (maxLon - minLon) / 4;

    // Calculate row (reversed - higher latitudes at top)
    let row = 3 - Math.floor((lat - minLat) / latDiv);
    let col = Math.floor((lon - minLon) / lonDiv);

    // Clamp to valid range (handles edge cases at boundaries)
    row = Math.max(0, Math.min(row, 3));
    col = Math.max(0, Math.min(col, 3));

    worldPin += WORLDPIN_GRID[row][col];

    // Add hyphens after 3rd and 6th characters for readability
    if (level === 3 || level === 6) {
      worldPin += '-';
    }

    // Update bounds for next level (reverse logic for row)
    maxLat = minLat + latDiv * (4 - row);
    minLat = minLat + latDiv * (3 - row);

    minLon = minLon + lonDiv * col;
    maxLon = minLon + lonDiv;
  }

  // Calculate final grid bounds
  const gridBounds = calculateGridBounds(lat, lon);

  return {
    success: true,
    pin: worldPin,
    gridBounds
  };
}


/**
 * Decodes a WorldPIN code back to coordinates
 * Returns the center point of the grid cell
 * 
 * @param worldPin - The WorldPIN code to decode (with or without hyphens)
 * @returns WorldPINDecodeResult with coordinates or error
 */
export function decodeWorldPIN(worldPin: string): WorldPINDecodeResult {
  // Remove hyphens and convert to uppercase
  const pin = worldPin.replace(/-/g, '').toUpperCase();

  if (pin.length !== 10) {
    return {
      success: false,
      error: 'Invalid WorldPIN: must be 10 characters (excluding hyphens)'
    };
  }

  let minLat = WORLD_BOUNDS.minLat;
  let maxLat = WORLD_BOUNDS.maxLat;
  let minLon = WORLD_BOUNDS.minLon;
  let maxLon = WORLD_BOUNDS.maxLon;

  for (let i = 0; i < 10; i++) {
    const char = pin[i];
    let found = false;
    let ri = -1, ci = -1;

    // Locate character in grid
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (WORLDPIN_GRID[r][c] === char) {
          ri = r;
          ci = c;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      return {
        success: false,
        error: `Invalid character '${char}' in WorldPIN. Valid characters: ${VALID_CHARS.join(', ')}`
      };
    }

    const latDiv = (maxLat - minLat) / 4;
    const lonDiv = (maxLon - minLon) / 4;

    const lat1 = maxLat - latDiv * (ri + 1);
    const lat2 = maxLat - latDiv * ri;
    const lon1 = minLon + lonDiv * ci;
    const lon2 = minLon + lonDiv * (ci + 1);

    // Update bounding box for next level
    minLat = lat1;
    maxLat = lat2;
    minLon = lon1;
    maxLon = lon2;
  }

  // Return center of the final grid cell
  const centerLat = (minLat + maxLat) / 2;
  const centerLon = (minLon + maxLon) / 2;

  return {
    success: true,
    coordinates: {
      latitude: centerLat,
      longitude: centerLon
    },
    gridBounds: {
      minLat,
      maxLat,
      minLon,
      maxLon
    }
  };
}

/**
 * Validates a WorldPIN format
 * @param pin - The PIN string to validate
 * @returns true if valid format, false otherwise
 */
export function validateWorldPIN(pin: string): boolean {
  if (!pin || typeof pin !== 'string') {
    return false;
  }

  const normalized = pin.toUpperCase().replace(/-/g, '');

  if (normalized.length !== 10) {
    return false;
  }

  // Check all characters are valid
  for (const char of normalized) {
    if (!VALID_CHARS.includes(char as typeof VALID_CHARS[number])) {
      return false;
    }
  }

  return true;
}

/**
 * Calculates the grid cell bounds for given coordinates
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns BoundingBox of the grid cell
 */
function calculateGridBounds(lat: number, lon: number): BoundingBox {
  let minLat = WORLD_BOUNDS.minLat;
  let maxLat = WORLD_BOUNDS.maxLat;
  let minLon = WORLD_BOUNDS.minLon;
  let maxLon = WORLD_BOUNDS.maxLon;

  for (let level = 0; level < 10; level++) {
    const latDiv = (maxLat - minLat) / 4;
    const lonDiv = (maxLon - minLon) / 4;

    let row = 3 - Math.floor((lat - minLat) / latDiv);
    let col = Math.floor((lon - minLon) / lonDiv);

    row = Math.max(0, Math.min(row, 3));
    col = Math.max(0, Math.min(col, 3));

    maxLat = minLat + latDiv * (4 - row);
    minLat = minLat + latDiv * (3 - row);
    minLon = minLon + lonDiv * col;
    maxLon = minLon + lonDiv;
  }

  return { minLat, maxLat, minLon, maxLon };
}

/**
 * Checks if coordinates are within global bounds
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns true if within bounds
 */
export function isWithinWorldBounds(lat: number, lon: number): boolean {
  return (
    lat >= WORLD_BOUNDS.minLat &&
    lat <= WORLD_BOUNDS.maxLat &&
    lon >= WORLD_BOUNDS.minLon &&
    lon <= WORLD_BOUNDS.maxLon
  );
}

const worldPin = {
  encodeWorldPIN,
  decodeWorldPIN,
  validateWorldPIN,
  isWithinWorldBounds
};

export default worldPin;
