"use client";

import React from 'react';
import { Share2, Copy, MapPin, X } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    selectedLocation: { lat: number; lng: number } | null;
    onShare: () => void;
    digipin: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, selectedLocation, onShare, digipin }) => {
    if (!isOpen || !selectedLocation) return null;

    return (
        <div className="hidden md:flex flex-col w-96 h-full bg-white border-l border-gray-200 shadow-xl z-30 absolute right-0 top-0 overflow-y-auto">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Location Details</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* DIGIPIN Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">DIGIPIN</span>
                            <button
                                className="p-1.5 bg-white rounded-lg text-blue-600 hover:text-blue-700 shadow-sm transition-all hover:shadow"
                                title="Copy DIGIPIN"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                        <div className="text-3xl font-mono font-bold text-blue-900 tracking-tight break-all">
                            {digipin}
                        </div>
                    </div>

                    {/* Coordinates */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Coordinates</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-gray-400 block">Latitude</span>
                                <span className="font-mono text-gray-700">{selectedLocation.lat.toFixed(6)}</span>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 block">Longitude</span>
                                <span className="font-mono text-gray-700">{selectedLocation.lng.toFixed(6)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onShare}
                            className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            <Share2 size={18} />
                            Share Location
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                            <MapPin size={18} />
                            Open in Google Maps
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
