"use client";

import React, { useState, useEffect, useCallback } from 'react';
import MapContainer from '@/components/MapContainerClient';
import Sidebar from '@/components/Sidebar';
import BottomDrawer from '@/components/BottomDrawer';
import SearchBar from '@/components/SearchBar';
import ModeToggle from '@/components/ModeToggle';
import MyLocationButton from '@/components/MyLocationButton';
import ShareModal from '@/components/ShareModal';
import PinCardModal from '@/components/PinCardModal';
import ConverterTool from '@/components/ConverterTool';
import HeroOverlay from '@/components/HeroOverlay';
import Footer from '@/components/Footer';
import { encode, decode } from '@/services/encoding';
import { searchPlace } from '@/services/geocoding';
import { parseUrlParams, buildUrl } from '@/services/url';
import { useToast } from '@/components/ui/ToastContext';
import { Settings, X, MapPin, Zap, Globe, QrCode } from 'lucide-react';

export default function Home() {
  const { showToast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mode, setMode] = useState<'DIGIPIN' | 'WorldPIN'>('DIGIPIN');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPinCardModalOpen, setIsPinCardModalOpen] = useState(false);
  const [isToolsPanelOpen, setIsToolsPanelOpen] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Load location from URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const params = parseUrlParams(new URLSearchParams(window.location.search));
    if (params?.pin) {
      const urlMode = params.mode === 'world' ? 'world' : 'india';
      const result = decode(params.pin, urlMode);
      if (result.success && result.coordinates) {
        setMode(urlMode === 'world' ? 'WorldPIN' : 'DIGIPIN');
        setSelectedLocation({ lat: result.coordinates.latitude, lng: result.coordinates.longitude });
        setIsSidebarOpen(true);
        setShowHero(false);
        showToast('Location loaded from URL', 'success');
      }
    }
  }, [showToast]);

  // Derived state - use proper encoding service
  const digipin = selectedLocation
    ? encode({ latitude: selectedLocation.lat, longitude: selectedLocation.lng }, mode === 'DIGIPIN' ? 'india' : 'world').pin || ''
    : '';
  
  // Build shareable URL
  const shareableUrl = digipin 
    ? buildUrl(digipin, mode === 'DIGIPIN' ? 'india' : 'world')
    : (typeof window !== 'undefined' ? window.location.origin : '');

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setIsSidebarOpen(true);
    setShowHero(false);
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    
    // First, check if it's a DIGIPIN
    const result = decode(query, mode === 'DIGIPIN' ? 'india' : 'world');
    if (result.success && result.coordinates) {
      handleLocationSelect(result.coordinates.latitude, result.coordinates.longitude);
      showToast('DIGIPIN found!', 'success');
      setIsLoading(false);
      return;
    }

    // Otherwise, try geocoding (place name search)
    showToast('Searching...', 'info');
    const geoResult = await searchPlace(query);
    if (geoResult.success && geoResult.coordinates) {
      handleLocationSelect(geoResult.coordinates.latitude, geoResult.coordinates.longitude);
      showToast(`Found: ${geoResult.displayName?.split(',')[0] || query}`, 'success');
    } else {
      showToast(geoResult.error || 'Location not found', 'error');
    }
    setIsLoading(false);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleGetStarted = () => {
    setShowHero(false);
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-gray-50 relative">
      {/* Desktop Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedLocation={selectedLocation}
        onShare={handleShare}
        onPinCard={() => setIsPinCardModalOpen(true)}
        digipin={digipin}
      />

      {/* Main Map Area */}
      <div className="flex-1 relative h-full w-full">
        <MapContainer
          onLocationSelect={handleLocationSelect}
          selectedLocation={selectedLocation}
          mode={mode}
        />

        {/* Hero Overlay for first-time users */}
        {showHero && !selectedLocation && (
          <HeroOverlay onGetStarted={handleGetStarted} onSearch={handleSearch} />
        )}

        {/* Top Search Bar Overlay */}
        <div className={`absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-10 pointer-events-none transition-all duration-500 ${showHero && !selectedLocation ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="pointer-events-auto">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>

        {/* Bottom Right Controls */}
        <div className={`absolute bottom-24 md:bottom-8 right-4 z-10 pointer-events-none transition-all duration-500 ${showHero && !selectedLocation ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
          <div className="pointer-events-auto flex flex-col items-end gap-4">
            {/* Mode Toggle - Top */}
            <ModeToggle mode={mode} onModeChange={setMode} />
            
            {/* Action Buttons - Grouped in a card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-2 flex flex-col gap-2">
              {/* My Location */}
              <button
                onClick={() => {
                  const btn = document.querySelector('[data-location-btn]') as HTMLButtonElement;
                  btn?.click();
                }}
                className="hidden"
              />
              <MyLocationButton onLocationFound={handleLocationSelect} />
              
              {/* Divider */}
              <div className="h-px bg-gray-200 mx-1" />
              
              {/* Tools Button */}
              <button
                onClick={() => setIsToolsPanelOpen(!isToolsPanelOpen)}
                className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center ${
                  isToolsPanelOpen 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-600'
                }`}
                title="Converter Tools"
                aria-label="Open converter tools"
              >
                <Settings size={20} />
              </button>
              
              {/* PIN Card Button - Only when location selected */}
              {selectedLocation && (
                <>
                  <div className="h-px bg-gray-200 mx-1" />
                  <button
                    onClick={() => setIsPinCardModalOpen(true)}
                    className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 flex items-center justify-center"
                    aria-label="Generate PIN Card"
                    title="Generate PIN Card"
                  >
                    <QrCode size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tools Panel */}
        {isToolsPanelOpen && (
          <div className="absolute bottom-24 md:bottom-8 left-4 z-10 w-80 max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100 animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center rounded-t-2xl">
              <div>
                <h2 className="font-bold text-gray-900">Converter Tools</h2>
                <p className="text-xs text-gray-500">Convert between coordinates and PINs</p>
              </div>
              <button
                onClick={() => setIsToolsPanelOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close tools panel"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <ConverterTool mode={mode} onLocationSelect={handleLocationSelect} />
            </div>
          </div>
        )}

        {/* Feature hints - shown on desktop when no location selected */}
        {!selectedLocation && !showHero && (
          <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 gap-4 animate-fade-in">
            <FeatureHint icon={<MapPin size={16} />} text="Click anywhere on the map" />
            <FeatureHint icon={<Zap size={16} />} text="Search by place or DIGIPIN" />
            <FeatureHint icon={<Globe size={16} />} text="Switch to WorldPIN for global" />
          </div>
        )}
      </div>

      {/* Mobile Bottom Drawer */}
      <BottomDrawer
        isOpen={!!selectedLocation}
        onClose={() => setSelectedLocation(null)}
        selectedLocation={selectedLocation}
        onShare={handleShare}
        onPinCard={() => setIsPinCardModalOpen(true)}
        digipin={digipin}
      />

      {/* Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        digipin={digipin}
        url={shareableUrl}
      />

      <PinCardModal
        isOpen={isPinCardModalOpen}
        onClose={() => setIsPinCardModalOpen(false)}
        digipin={digipin}
        lat={selectedLocation?.lat || 0}
        lng={selectedLocation?.lng || 0}
        address="Selected Location"
        url={shareableUrl}
      />

      {/* Footer for SEO */}
      <Footer />
    </main>
  );
}

// Feature hint component
function FeatureHint({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-100 text-sm text-gray-600">
      <span className="text-blue-500">{icon}</span>
      {text}
    </div>
  );
}
