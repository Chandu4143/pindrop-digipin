"use client";

import React, { useState } from 'react';
import { encode, decode } from '@/services/encoding';
import { ArrowDownUp, Copy, Check, MapPin, AlertCircle } from 'lucide-react';

interface ConverterToolProps {
  mode: 'DIGIPIN' | 'WorldPIN';
  onLocationSelect?: (lat: number, lng: number) => void;
}

const ConverterTool: React.FC<ConverterToolProps> = ({ mode, onLocationSelect }) => {
  // Coords to PIN state
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [resultPin, setResultPin] = useState('');
  const [pinError, setPinError] = useState('');

  // PIN to Coords state
  const [inputPin, setInputPin] = useState('');
  const [resultLat, setResultLat] = useState('');
  const [resultLng, setResultLng] = useState('');
  const [coordsError, setCoordsError] = useState('');

  const [copiedPin, setCopiedPin] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  const handleCoordsToPin = () => {
    setPinError('');
    setResultPin('');
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      setPinError('Please enter valid numbers');
      return;
    }

    if (lat < -90 || lat > 90) {
      setPinError('Latitude must be between -90 and 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      setPinError('Longitude must be between -180 and 180');
      return;
    }

    const result = encode({ latitude: lat, longitude: lng }, mode === 'DIGIPIN' ? 'india' : 'world');
    if (result.success && result.pin) {
      setResultPin(result.pin);
    } else {
      setPinError(result.error || 'Conversion failed');
    }
  };

  const handlePinToCoords = () => {
    setCoordsError('');
    setResultLat('');
    setResultLng('');

    if (!inputPin.trim()) {
      setCoordsError('Please enter a PIN');
      return;
    }

    const result = decode(inputPin.trim(), mode === 'DIGIPIN' ? 'india' : 'world');
    if (result.success && result.coordinates) {
      setResultLat(result.coordinates.latitude.toFixed(6));
      setResultLng(result.coordinates.longitude.toFixed(6));
    } else {
      setCoordsError(result.error || 'Invalid PIN format');
    }
  };

  const copyToClipboard = async (text: string, type: 'pin' | 'coords') => {
    await navigator.clipboard.writeText(text);
    if (type === 'pin') {
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    } else {
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2000);
    }
  };

  const showOnMap = (lat: string, lng: string) => {
    if (onLocationSelect && lat && lng) {
      onLocationSelect(parseFloat(lat), parseFloat(lng));
    }
  };

  const modeColor = mode === 'DIGIPIN' ? 'blue' : 'purple';

  return (
    <div className="space-y-4">
      {/* Coordinates to PIN */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-8 h-8 rounded-lg bg-${modeColor}-100 flex items-center justify-center`}>
            <ArrowDownUp size={16} className={`text-${modeColor}-600`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Coordinates → {mode}</h3>
            <p className="text-xs text-gray-400">Convert lat/lng to PIN</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Latitude"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Longitude"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <button
          onClick={handleCoordsToPin}
          className={`w-full bg-${modeColor}-600 hover:bg-${modeColor}-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors`}
        >
          Convert
        </button>

        {pinError && (
          <div className="flex items-center gap-2 mt-3 text-red-500 text-xs">
            <AlertCircle size={14} />
            {pinError}
          </div>
        )}

        {resultPin && (
          <div className={`mt-3 p-3 bg-${modeColor}-50 border border-${modeColor}-200 rounded-lg flex items-center justify-between`}>
            <span className={`font-mono font-bold text-${modeColor}-800`}>{resultPin}</span>
            <div className="flex gap-1">
              {onLocationSelect && (
                <button
                  onClick={() => showOnMap(latitude, longitude)}
                  className={`p-2 hover:bg-${modeColor}-100 rounded-lg transition-colors`}
                  title="Show on map"
                >
                  <MapPin size={16} className={`text-${modeColor}-600`} />
                </button>
              )}
              <button
                onClick={() => copyToClipboard(resultPin, 'pin')}
                className={`p-2 hover:bg-${modeColor}-100 rounded-lg transition-colors`}
                title="Copy"
              >
                {copiedPin ? <Check size={16} className="text-green-600" /> : <Copy size={16} className={`text-${modeColor}-600`} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PIN to Coordinates */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <ArrowDownUp size={16} className="text-indigo-600 rotate-180" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">{mode} → Coordinates</h3>
            <p className="text-xs text-gray-400">Convert PIN to lat/lng</p>
          </div>
        </div>

        <input
          type="text"
          value={inputPin}
          onChange={(e) => setInputPin(e.target.value.toUpperCase())}
          placeholder="Enter PIN (e.g. 422-7K9-7JML)"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all mb-3"
        />

        <button
          onClick={handlePinToCoords}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          Convert
        </button>

        {coordsError && (
          <div className="flex items-center gap-2 mt-3 text-red-500 text-xs">
            <AlertCircle size={14} />
            {coordsError}
          </div>
        )}

        {resultLat && resultLng && (
          <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm space-y-1">
                <p><span className="text-gray-500">Lat:</span> <span className="font-mono font-bold text-indigo-800">{resultLat}</span></p>
                <p><span className="text-gray-500">Lng:</span> <span className="font-mono font-bold text-indigo-800">{resultLng}</span></p>
              </div>
              <div className="flex gap-1">
                {onLocationSelect && (
                  <button
                    onClick={() => showOnMap(resultLat, resultLng)}
                    className="p-2 hover:bg-indigo-100 rounded-lg transition-colors"
                    title="Show on map"
                  >
                    <MapPin size={16} className="text-indigo-600" />
                  </button>
                )}
                <button
                  onClick={() => copyToClipboard(`${resultLat}, ${resultLng}`, 'coords')}
                  className="p-2 hover:bg-indigo-100 rounded-lg transition-colors"
                  title="Copy"
                >
                  {copiedCoords ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-indigo-600" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConverterTool;
