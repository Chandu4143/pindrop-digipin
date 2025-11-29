"use client";

import React from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, useMap, useMapEvents, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom marker icon
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapContainerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation: { lat: number; lng: number } | null;
  mode: 'DIGIPIN' | 'WorldPIN';
}

// Component to handle map clicks
const MapEvents = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Component to fly to selected location
const MapUpdater = ({ center }: { center: { lat: number; lng: number } | null }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], 16, {
        duration: 1.5
      });
    }
  }, [center, map]);
  return null;
};

const MapContainer: React.FC<MapContainerProps> = ({ onLocationSelect, selectedLocation, mode }) => {
  // Grid highlight coordinates
  const gridPositions = selectedLocation ? [
    [selectedLocation.lat - 0.0008, selectedLocation.lng - 0.0008],
    [selectedLocation.lat - 0.0008, selectedLocation.lng + 0.0008],
    [selectedLocation.lat + 0.0008, selectedLocation.lng + 0.0008],
    [selectedLocation.lat + 0.0008, selectedLocation.lng - 0.0008],
  ] as [number, number][] : [];

  // Default center based on mode
  const defaultCenter: [number, number] = mode === 'DIGIPIN' 
    ? [20.5937, 78.9629] // India center
    : [20, 0]; // World center

  return (
    <div className="w-full h-full overflow-hidden relative z-0">
      <LeafletMap
        center={defaultCenter}
        zoom={mode === 'DIGIPIN' ? 5 : 2}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        className="z-0"
      >
        {/* Map tiles - using a cleaner style */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEvents onLocationSelect={onLocationSelect} />
        <MapUpdater center={selectedLocation} />

        {selectedLocation && (
          <>
            <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={defaultIcon} />
            <Polygon
              positions={gridPositions}
              pathOptions={{ 
                color: '#3b82f6', 
                fillColor: '#3b82f6', 
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '5, 5'
              }}
            />
          </>
        )}
      </LeafletMap>

      {/* Mode Indicator Badge */}
      <div className="absolute top-4 left-4 z-[1000]">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-lg border backdrop-blur-sm ${
          mode === 'DIGIPIN' 
            ? 'bg-blue-500/90 text-white border-blue-400' 
            : 'bg-purple-500/90 text-white border-purple-400'
        }`}>
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          {mode === 'DIGIPIN' ? '🇮🇳 India Mode' : '🌍 World Mode'}
        </div>
      </div>

      {/* Zoom controls hint */}
      <div className="absolute bottom-4 left-4 z-[1000] hidden md:block">
        <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-gray-500 shadow-md border border-gray-100">
          Scroll to zoom • Click to select
        </div>
      </div>
    </div>
  );
};

export default MapContainer;
