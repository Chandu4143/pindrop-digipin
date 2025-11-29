/**
 * Shared TypeScript interfaces for PinDrop application
 */

/** Operating mode for the application */
export type Mode = 'india' | 'world';

/** Geographic coordinates */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/** Bounding box for geographic regions */
export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

/** Result of a location lookup/encoding */
export interface LocationResult {
  pin: string;
  coordinates: Coordinates;
  mode: Mode;
  gridBounds: BoundingBox;
  timestamp: number;
}

/** Result of encoding coordinates to a PIN */
export interface EncodingResult {
  success: boolean;
  pin?: string;
  error?: string;
  gridBounds?: BoundingBox;
}

/** Result of decoding a PIN to coordinates */
export interface DecodingResult {
  success: boolean;
  coordinates?: Coordinates;
  error?: string;
  gridBounds?: BoundingBox;
}

/** Result of validating a PIN format */
export interface ValidationResult {
  valid: boolean;
  normalized?: string;
  errors?: string[];
}


/** Result of geolocation request */
export interface GeolocationResult {
  success: boolean;
  coordinates?: Coordinates;
  error?: GeolocationError;
}

/** Types of geolocation errors */
export type GeolocationError = 'permission_denied' | 'position_unavailable' | 'timeout';

/** URL parameters for shared links */
export interface UrlParams {
  pin: string;
  mode: Mode;
}

/** Data for generating a PinCard */
export interface PinCardData {
  pin: string;
  coordinates: Coordinates;
  customText?: string;
  createdAt: Date;
}

// Constants

/** DIGIPIN bounds (India) */
export const INDIA_BOUNDS: BoundingBox = {
  minLat: 2.5,
  maxLat: 38.5,
  minLon: 63.5,
  maxLon: 99.5,
};

/** WorldPIN bounds (global) */
export const WORLD_BOUNDS: BoundingBox = {
  minLat: -90,
  maxLat: 90,
  minLon: -180,
  maxLon: 180,
};

/** Valid DIGIPIN characters */
export const VALID_CHARS = ['2', '3', '4', '5', '6', '7', '8', '9', 'C', 'F', 'J', 'K', 'L', 'M', 'P', 'T'] as const;

/** DIGIPIN format regex (with or without hyphens) */
export const DIGIPIN_REGEX = /^[2-9CFJKLMPT]{3}-?[2-9CFJKLMPT]{3}-?[2-9CFJKLMPT]{4}$/i;
