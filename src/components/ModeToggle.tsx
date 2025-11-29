"use client";

import React from 'react';

interface ModeToggleProps {
    mode: 'DIGIPIN' | 'WorldPIN';
    onModeChange: (mode: 'DIGIPIN' | 'WorldPIN') => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
    return (
        <div className="flex bg-white rounded-lg p-1 shadow-md border border-gray-200">
            <button
                onClick={() => onModeChange('DIGIPIN')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'DIGIPIN'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
            >
                DIGIPIN
            </button>
            <button
                onClick={() => onModeChange('WorldPIN')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'WorldPIN'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
            >
                WorldPIN
            </button>
        </div>
    );
};

export default ModeToggle;
