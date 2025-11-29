// Mock DIGIPIN conversion logic

export const latLngToDigipin = (lat: number, lng: number): string => {
    // Simple mock: just hash the coords or something simple
    // In reality this would be a complex grid system
    const latPart = Math.abs(lat).toFixed(4).replace('.', '');
    const lngPart = Math.abs(lng).toFixed(4).replace('.', '');
    return `DG-${latPart.slice(0, 4)}-${lngPart.slice(0, 4)}`;
};

export const digipinToLatLng = (pin: string): { lat: number; lng: number } | null => {
    // Mock reverse
    // Expect format DG-XXXX-XXXX
    if (!pin.startsWith('DG-')) return null;
    const parts = pin.split('-');
    if (parts.length !== 3) return null;

    const lat = parseFloat(parts[1]) / 100; // Very rough mock
    const lng = parseFloat(parts[2]) / 100;

    return { lat, lng };
};
