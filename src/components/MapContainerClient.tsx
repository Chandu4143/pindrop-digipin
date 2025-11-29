"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface MapContainerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation: { lat: number; lng: number } | null;
  mode: 'DIGIPIN' | 'WorldPIN';
}

// Dynamically import the actual map component with SSR disabled
const MapContainerInner = dynamic(() => import('./MapContainerInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

const MapContainerClient: React.FC<MapContainerProps> = (props) => {
  return <MapContainerInner {...props} />;
};

export default MapContainerClient;
