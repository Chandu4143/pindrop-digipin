/**
 * Location Service for PinDrop
 * Handles browser geolocation with proper error handling
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

import {
  Coordinates,
  GeolocationResult,
  GeolocationError,
} from '@/types';

/** Geolocation options for the browser API */
const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000, // 10 seconds
  maximumAge: 60000, // 1 minute cache
};

/**
 * Maps browser GeolocationPositionError codes to our error types
 * @param error - The browser geolocation error
 * @returns Our GeolocationError type
 */
function mapGeolocationError(error: GeolocationPositionError): GeolocationError {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'permission_denied';
    case error.POSITION_UNAVAILABLE:
      return 'position_unavailable';
    case error.TIMEOUT:
      return 'timeout';
    default:
      return 'position_unavailable';
  }
}

/**
 * Gets the user's current location using the browser Geolocation API
 * @returns Promise<GeolocationResult> with coordinates or error
 * 
 * Requirements:
 * - 3.1: Request browser geolocation permission
 * - 3.2: Retrieve user's current coordinates
 * - 3.3: Return coordinates for DIGIPIN generation
 * - 3.4: Handle permission_denied error
 * - 3.5: Handle timeout and position_unavailable errors
 */
export function getCurrentLocation(): Promise<GeolocationResult> {
  return new Promise((resolve) => {
    // Check if geolocation is supported
    if (!navigator?.geolocation) {
      resolve({
        success: false,
        error: 'position_unavailable',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position: GeolocationPosition) => {
        const coordinates: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        resolve({
          success: true,
          coordinates,
        });
      },
      // Error callback
      (error: GeolocationPositionError) => {
        resolve({
          success: false,
          error: mapGeolocationError(error),
        });
      },
      // Options
      GEOLOCATION_OPTIONS
    );
  });
}

/**
 * Gets a user-friendly error message for a geolocation error
 * @param error - The geolocation error type
 * @returns Human-readable error message
 */
export function getGeolocationErrorMessage(error: GeolocationError): string {
  switch (error) {
    case 'permission_denied':
      return 'Location access denied. Please enable location permissions in your browser settings.';
    case 'position_unavailable':
      return 'Unable to determine your location. Please try again or enter coordinates manually.';
    case 'timeout':
      return 'Location request timed out. Please try again.';
    default:
      return 'An unknown error occurred while getting your location.';
  }
}

/**
 * Checks if geolocation is supported in the current browser
 * @returns true if geolocation is available
 */
export function isGeolocationSupported(): boolean {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator;
}

/**
 * Location service interface for dependency injection
 */
export const locationService = {
  getCurrentLocation,
  getGeolocationErrorMessage,
  isGeolocationSupported,
};

export default locationService;
