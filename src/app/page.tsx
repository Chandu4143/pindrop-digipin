"use client";

import React, { useState } from 'react';
import MapContainer from '@/components/MapContainer';
import Sidebar from '@/components/Sidebar';
import BottomDrawer from '@/components/BottomDrawer';
import SearchBar from '@/components/SearchBar';
import ModeToggle from '@/components/ModeToggle';
import MyLocationButton from '@/components/MyLocationButton';
import ShareModal from '@/components/ShareModal';
import PinCardModal from '@/components/PinCardModal';
import { encode, decode } from '@/services/encoding';
import { useToast } from '@/components/ui/ToastContext';

export default function Home() {
  const { showToast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mode, setMode] = useState<'DIGIPIN' | 'WorldPIN'>('DIGIPIN');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPinCardModalOpen, setIsPinCardModalOpen] = useState(false);

  // Derived state - use proper encoding service
  const digipin = selectedLocation
    ? encode({ latitude: selectedLocation.lat, longitude: selectedLocation.lng }, mode === 'DIGIPIN' ? 'india' : 'world').pin || ''
    : '';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleLocationSelect = React.useCallback((lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setIsSidebarOpen(true);
  }, []);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Check if it's a DIGIPIN
    const result = decode(query, mode === 'DIGIPIN' ? 'india' : 'world');
    if (result.success && result.coordinates) {
      handleLocationSelect(result.coordinates.latitude, result.coordinates.longitude);
      showToast('DIGIPIN found!', 'success');
    } else {
      showToast(`Search functionality for "${query}" is mocked. Try clicking the map!`, 'info');
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-gray-50 relative">

      {/* Desktop Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedLocation={selectedLocation}
        onShare={handleShare}
        digipin={digipin}
      />

      {/* Main Map Area */}
      <div className="flex-1 relative h-full w-full">
        <MapContainer
          onLocationSelect={handleLocationSelect}
          selectedLocation={selectedLocation}
          mode={mode}
        />

        {/* Top Search Bar Overlay */}
        <div className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Bottom Right Controls */}
        <div className="absolute bottom-24 md:bottom-8 right-4 z-10 flex flex-col gap-3 items-end pointer-events-none">
          <div className="pointer-events-auto space-y-3">
            <ModeToggle mode={mode} onModeChange={setMode} />
            <div className="flex justify-end">
              <MyLocationButton onLocationFound={handleLocationSelect} />
            </div>
            {selectedLocation && (
              <button
                onClick={() => setIsPinCardModalOpen(true)}
                className="bg-white p-3 rounded-full shadow-lg border border-gray-200 text-blue-600 hover:bg-blue-50 transition-all font-bold text-xs"
              >
                PIN CARD
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Drawer */}
      <BottomDrawer
        isOpen={!!selectedLocation}
        onClose={() => setSelectedLocation(null)}
        selectedLocation={selectedLocation}
        onShare={handleShare}
        digipin={digipin}
      />

      {/* Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        digipin={digipin}
        url={currentUrl}
      />

      <PinCardModal
        isOpen={isPinCardModalOpen}
        onClose={() => setIsPinCardModalOpen(false)}
        digipin={digipin}
        lat={selectedLocation?.lat || 0}
        lng={selectedLocation?.lng || 0}
        address="Selected Location" // Placeholder
        url={currentUrl}
      />

    </main>
  );
}
