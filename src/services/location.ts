/**
 * Location Service for PinDrop
 * Handles browser geolocation with proper error handling and IP fallback
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
  timeout: 15000, // 15 seconds
  maximumAge: 60000, // 1 minute cache
};

/**
 * Fallback: Get approximate location from IP address
 * Uses multiple free IP geolocation APIs with fallbacks
 */
async function getLocationFromIP(): Promise<GeolocationResult> {
  // List of IP geolocation services to try (in order)
  const services = [
    {
      url: 'https://ipapi.co/json/',
      extract: (data: Record<string, unknown>) => ({
        lat: data.latitude as number,
        lon: data.longitude as number,
      }),
    },
    {
      url: 'https://ipwho.is/',
      extract: (data: Record<string, unknown>) => ({
        lat: data.latitude as number,
        lon: data.longitude as number,
      }),
    },
    {
      url: 'https://freeipapi.com/api/json',
      extract: (data: Record<string, unknown>) => ({
        lat: data.latitude as number,
        lon: data.longitude as number,
      }),
    },
  ];

  for (const service of services) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(service.url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const coords = service.extract(data);

        if (coords.lat && coords.lon && !isNaN(coords.lat) && !isNaN(coords.lon)) {
          console.log(`IP location found via ${service.url}:`, coords);
          return {
            success: true,
            coordinates: {
              latitude: coords.lat,
              longitude: coords.lon,
            },
          };
        }
      }
    } catch (err) {
      console.log(`IP service ${service.url} failed:`, err);
      // Continue to next service
    }
  }

  console.log('All IP geolocation services failed');
  return { success: false, error: 'position_unavailable' };
}

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
 * Falls back to IP-based location if GPS fails
 * @returns Promise<GeolocationResult> with coordinates or error
 * 
 * Requirements:
 * - 3.1: Request browser geolocation permission
 * - 3.2: Retrieve user's current coordinates
 * - 3.3: Return coordinates for DIGIPIN generation
 * - 3.4: Handle permission_denied error
 * - 3.5: Handle timeout and position_unavailable errors
 */
export async function getCurrentLocation(): Promise<GeolocationResult> {
  // First try browser geolocation
  const browserResult = await getBrowserLocation();
  
  if (browserResult.success) {
    return browserResult;
  }
  
  // If permission denied, don't try IP fallback - user explicitly denied
  if (browserResult.error === 'permission_denied') {
    return browserResult;
  }
  
  // Try IP-based fallback for position_unavailable or timeout
  console.log('Browser geolocation failed, trying IP fallback...');
  const ipResult = await getLocationFromIP();
  
  if (ipResult.success) {
    return ipResult;
  }
  
  // Return original browser error if IP fallback also fails
  return browserResult;
}

/**
 * Gets location from browser Geolocation API only
 */
function getBrowserLocation(): Promise<GeolocationResult> {
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
      return 'Unable to determine your location. Try searching for a place name instead, or click on the map.';
    case 'timeout':
      return 'Location request timed out. Try searching for a place name or clicking on the map.';
    default:
      return 'Could not get your location. Try searching for a place name or clicking on the map.';
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
