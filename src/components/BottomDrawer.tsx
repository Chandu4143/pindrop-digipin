"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, MapPin } from 'lucide-react';

interface BottomDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    selectedLocation: { lat: number; lng: number } | null;
    onShare: () => void;
    digipin: string;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({ isOpen, onClose, selectedLocation, onShare, digipin }) => {

    return (
        <AnimatePresence>
            {isOpen && selectedLocation && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40 md:hidden"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 500 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 p-6 md:hidden max-h-[80vh] overflow-y-auto"
                    >
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Selected Location</h3>
                                <p className="text-sm text-gray-500">
                                    {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">DIGIPIN</span>
                                <button className="text-blue-600 hover:text-blue-700">
                                    <Copy size={16} />
                                </button>
                            </div>
                            <div className="text-3xl font-mono font-bold text-blue-900 tracking-tight">
                                {digipin}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={onShare}
                                className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                            >
                                <Share2 size={18} />
                                Share
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                                <MapPin size={18} />
                                Navigate
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default BottomDrawer;
