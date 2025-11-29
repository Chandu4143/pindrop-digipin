"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, MapPin, X, ExternalLink, Check, Navigation } from 'lucide-react';
import { useToast } from './ui/ToastContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    selectedLocation: { lat: number; lng: number } | null;
    onShare: () => void;
    onPinCard: () => void;
    digipin: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, selectedLocation, onShare, onPinCard, digipin }) => {
    const { showToast } = useToast();
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(digipin);
        setCopied(true);
        showToast('DIGIPIN copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOpenGoogleMaps = () => {
        if (selectedLocation) {
            window.open(
                `https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`,
                '_blank'
            );
        }
    };

    const handleNavigate = () => {
        if (selectedLocation) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`,
                '_blank'
            );
        }
    };

    return (
        <AnimatePresence>
            {isOpen && selectedLocation && (
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="hidden md:flex flex-col w-[400px] h-full bg-white border-l border-gray-100 shadow-2xl z-30 absolute right-0 top-0 overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full mb-2">
                                    <MapPin size={12} />
                                    Location Selected
                                </span>
                                <h2 className="text-xl font-bold text-gray-900">Location Details</h2>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="p-2 hover:bg-white/80 rounded-full transition-colors"
                                aria-label="Close sidebar"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* DIGIPIN Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-2xl shadow-lg shadow-blue-500/25 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                            
                            <div className="relative">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Your DIGIPIN</span>
                                    <button
                                        onClick={handleCopy}
                                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                                        title="Copy DIGIPIN"
                                        aria-label="Copy DIGIPIN"
                                    >
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <div className="text-3xl font-mono font-bold tracking-tight break-all">
                                    {digipin}
                                </div>
                                <p className="text-blue-200 text-sm mt-2">
                                    Share this code to pinpoint this exact location
                                </p>
                            </div>
                        </div>

                        {/* Coordinates */}
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <Navigation size={14} />
                                GPS Coordinates
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-3 rounded-xl border border-gray-100">
                                    <span className="text-xs text-gray-400 block mb-1">Latitude</span>
                                    <span className="font-mono text-gray-800 font-semibold">{selectedLocation.lat.toFixed(6)}</span>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-gray-100">
                                    <span className="text-xs text-gray-400 block mb-1">Longitude</span>
                                    <span className="font-mono text-gray-800 font-semibold">{selectedLocation.lng.toFixed(6)}</span>
                                </div>
                            </div>
                        </div>

                        {/* PIN Card - Highlighted */}
                        <button
                            onClick={onPinCard}
                            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25 hover:shadow-xl hover:scale-[1.02]"
                        >
                            <span className="text-2xl">🪪</span>
                            Generate PIN Card
                        </button>

                        {/* Actions */}
                        <div className="space-y-3">
                            <button
                                onClick={onShare}
                                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 hover:shadow-xl"
                            >
                                <Share2 size={18} />
                                Share Location
                            </button>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={handleOpenGoogleMaps}
                                    className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                                >
                                    <ExternalLink size={16} />
                                    View Map
                                </button>
                                <button 
                                    onClick={handleNavigate}
                                    className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 py-3 px-4 rounded-xl font-medium hover:bg-blue-100 transition-all"
                                >
                                    <Navigation size={16} />
                                    Navigate
                                </button>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <p className="text-sm text-amber-800">
                                <strong>Tip:</strong> DIGIPIN is a standardized digital address system by India Post. 
                                Share this code instead of complex addresses!
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-400 text-center">
                            Powered by DIGIPIN - India Digital Address System
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Sidebar;
