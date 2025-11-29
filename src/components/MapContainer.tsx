"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap, useMapEvents, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Next.js
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
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], 14, {
        duration: 1.5
      });
    }
  }, [center, map]);
  return null;
};

const MapContainer: React.FC<MapContainerProps> = ({ onLocationSelect, selectedLocation, mode }) => {

  // Grid highlight coordinates (mocked)
  const gridPositions = selectedLocation ? [
    [selectedLocation.lat - 0.001, selectedLocation.lng - 0.001],
    [selectedLocation.lat - 0.001, selectedLocation.lng + 0.001],
    [selectedLocation.lat + 0.001, selectedLocation.lng + 0.001],
    [selectedLocation.lat + 0.001, selectedLocation.lng - 0.001],
  ] as [number, number][] : [];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200 relative z-0">
      <LeafletMap
        center={[20.5937, 78.9629]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEvents onLocationSelect={onLocationSelect} />
        <MapUpdater center={selectedLocation} />

        {selectedLocation && (
          <>
            <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={defaultIcon}>
            </Marker>
            <Polygon
              positions={gridPositions}
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2 }}
            />
          </>
        )}
      </LeafletMap>

      {/* Mode Indicator */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold shadow-sm border border-gray-200">
        Mode: {mode}
      </div>
    </div>
  );
};

export default MapContainer;
