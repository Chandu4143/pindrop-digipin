/**
 * Share Service for PinDrop
 * Handles sharing functionality including URL generation, clipboard, WhatsApp, and QR codes
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import { Mode } from '@/types';
import { buildUrl } from './url';

/**
 * Generates a shareable URL for a PIN
 * @param pin - The DIGIPIN/WorldPIN to share
 * @param mode - The operating mode
 * @param baseUrl - Optional base URL (defaults to current origin)
 * @returns The complete shareable URL
 */
export function generateShareUrl(pin: string, mode: Mode, baseUrl?: string): string {
  return buildUrl(pin, mode, baseUrl);
}

/**
 * Copies text to the clipboard
 * @param text - The text to copy
 * @returns Promise resolving to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    if (typeof document !== 'undefined') {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
    
    return false;
  } catch {
    return false;
  }
}


/**
 * Generates a WhatsApp share URL with pre-filled message
 * @param pin - The DIGIPIN/WorldPIN to share
 * @param shareUrl - The shareable URL to include in the message
 * @returns WhatsApp URL that opens with pre-filled message
 */
export function generateWhatsAppUrl(pin: string, shareUrl: string): string {
  const message = `Check out this location!\n\nPIN: ${pin}\n\n${shareUrl}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/?text=${encodedMessage}`;
}

/**
 * Generates a QR code as a data URL
 * @param url - The URL to encode in the QR code
 * @returns Promise resolving to a data URL string of the QR code image
 */
export async function generateQRCode(url: string): Promise<string> {
  try {
    // Dynamic import to avoid SSR issues
    const QRCode = await import('qrcode');
    const dataUrl = await QRCode.toDataURL(url, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
    return dataUrl;
  } catch (error) {
    throw new Error(
      `Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Share service interface for dependency injection
 */
export const shareService = {
  generateShareUrl,
  copyToClipboard,
  generateWhatsAppUrl,
  generateQRCode,
};

export default shareService;
