"use client";

import React from 'react';
import { Globe, MapPin } from 'lucide-react';

interface ModeToggleProps {
    mode: 'DIGIPIN' | 'WorldPIN';
    onModeChange: (mode: 'DIGIPIN' | 'WorldPIN') => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
    return (
        <div className="bg-white rounded-xl p-1.5 shadow-lg border border-gray-100 flex gap-1">
            <button
                onClick={() => onModeChange('DIGIPIN')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    mode === 'DIGIPIN'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50'
                }`}
                aria-label="Switch to DIGIPIN mode for India"
                title="India locations"
            >
                <MapPin size={16} />
                <span className="hidden sm:inline">DIGIPIN</span>
                <span className="sm:hidden">🇮🇳</span>
            </button>
            <button
                onClick={() => onModeChange('WorldPIN')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    mode === 'WorldPIN'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50'
                }`}
                aria-label="Switch to WorldPIN mode for global locations"
                title="Global locations"
            >
                <Globe size={16} />
                <span className="hidden sm:inline">WorldPIN</span>
                <span className="sm:hidden">🌍</span>
            </button>
        </div>
    );
};

export default ModeToggle;
