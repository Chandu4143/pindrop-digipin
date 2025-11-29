/**
 * URL Service for PinDrop
 * Handles URL parameter parsing and building for shareable links
 * 
 * **Feature: pindrop, Property 4: Shareable URL generation**
 * **Feature: pindrop, Property 8: Invalid URL parameter handling**
 */

import { Mode, UrlParams, DIGIPIN_REGEX } from '@/types';

/**
 * Parses URL parameters to extract pin and mode
 * @param searchParams - URLSearchParams or object with pin and mode
 * @returns UrlParams if valid, null if invalid or missing
 */
export function parseUrlParams(
  searchParams: URLSearchParams | { pin?: string; mode?: string } | null
): UrlParams | null {
  if (!searchParams) {
    return null;
  }

  let pin: string | null = null;
  let mode: string | null = null;

  if (searchParams instanceof URLSearchParams) {
    pin = searchParams.get('pin');
    mode = searchParams.get('mode');
  } else {
    pin = searchParams.pin ?? null;
    mode = searchParams.mode ?? null;
  }

  // If no pin parameter, return null
  if (!pin) {
    return null;
  }

  // Validate the PIN format
  const normalizedPin = pin.toUpperCase().replace(/-/g, '');
  
  // Check length
  if (normalizedPin.length !== 10) {
    return null;
  }

  // Check format with regex
  if (!DIGIPIN_REGEX.test(pin)) {
    return null;
  }

  // Validate and normalize mode
  const validMode: Mode = mode === 'world' ? 'world' : 'india';

  // Format PIN with hyphens: XXX-XXX-XXXX
  const formattedPin = `${normalizedPin.slice(0, 3)}-${normalizedPin.slice(3, 6)}-${normalizedPin.slice(6, 10)}`;

  return {
    pin: formattedPin,
    mode: validMode,
  };
}


/**
 * Builds a shareable URL with pin and mode parameters
 * @param pin - The DIGIPIN/WorldPIN to include
 * @param mode - The operating mode
 * @param baseUrl - Optional base URL (defaults to current origin or empty string)
 * @returns The complete shareable URL
 */
export function buildUrl(pin: string, mode: Mode, baseUrl?: string): string {
  // Normalize the PIN format
  const normalizedPin = pin.toUpperCase().replace(/-/g, '');
  const formattedPin = `${normalizedPin.slice(0, 3)}-${normalizedPin.slice(3, 6)}-${normalizedPin.slice(6, 10)}`;

  // Build URL with query parameters
  const params = new URLSearchParams();
  params.set('pin', formattedPin);
  params.set('mode', mode);

  // Use provided baseUrl or try to get current origin
  let base = baseUrl ?? '';
  if (!base && typeof window !== 'undefined') {
    base = window.location.origin;
  }

  return `${base}?${params.toString()}`;
}

/**
 * Validates if a PIN string is in valid format for URL parameters
 * @param pin - The PIN string to validate
 * @returns true if valid format, false otherwise
 */
export function isValidPinFormat(pin: string): boolean {
  if (!pin || typeof pin !== 'string') {
    return false;
  }

  const normalized = pin.toUpperCase().replace(/-/g, '');
  
  if (normalized.length !== 10) {
    return false;
  }

  return DIGIPIN_REGEX.test(pin);
}

/**
 * URL service interface for dependency injection
 */
export const urlService = {
  parseUrlParams,
  buildUrl,
  isValidPinFormat,
};

export default urlService;
