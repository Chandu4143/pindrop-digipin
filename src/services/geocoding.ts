/**
 * Geocoding Service using OpenStreetMap Nominatim (via API route)
 * Converts place names to coordinates
 */

export interface GeocodingResult {
  success: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  displayName?: string;
  error?: string;
}

/**
 * Search for a place by name and return coordinates
 * Uses our API route to avoid CORS issues with Nominatim
 * @param query - Place name to search for
 * @returns GeocodingResult with coordinates or error
 */
export async function searchPlace(query: string): Promise<GeocodingResult> {
  try {
    const params = new URLSearchParams({ q: query });
    const response = await fetch(`/api/geocode?${params}`);

    if (!response.ok) {
      return {
        success: false,
        error: 'Geocoding service unavailable',
      };
    }

    const results = await response.json();

    if (!results || results.length === 0) {
      return {
        success: false,
        error: 'No results found for this location',
      };
    }

    const place = results[0];
    return {
      success: true,
      coordinates: {
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
      },
      displayName: place.display_name,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to search for location',
    };
  }
}

export const geocodingService = {
  searchPlace,
};

export default geocodingService;
