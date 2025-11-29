"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Navigation, ExternalLink, Check } from 'lucide-react';
import { useToast } from './ui/ToastContext';

interface BottomDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    selectedLocation: { lat: number; lng: number } | null;
    onShare: () => void;
    onPinCard: () => void;
    digipin: string;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({ isOpen, onClose, selectedLocation, onShare, onPinCard, digipin }) => {
    const { showToast } = useToast();
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(digipin);
        setCopied(true);
        showToast('DIGIPIN copied!', 'success');
        setTimeout(() => setCopied(false), 2000);
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
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40 md:hidden"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 md:hidden max-h-[85vh] overflow-hidden"
                    >
                        {/* Drag handle */}
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-10 h-1 bg-gray-300 rounded-full" />
                        </div>

                        <div className="px-5 pb-6 overflow-y-auto max-h-[calc(85vh-40px)]">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Your DIGIPIN</h3>
                                    <p className="text-sm text-gray-500">
                                        {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                                    </p>
                                </div>
                                <button 
                                    onClick={onClose} 
                                    className="p-2 hover:bg-gray-100 rounded-full -mr-2"
                                    aria-label="Close"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            {/* DIGIPIN Display */}
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-5 rounded-2xl mb-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="relative flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider block mb-1">DIGIPIN</span>
                                        <div className="text-2xl font-mono font-bold text-white tracking-tight">
                                            {digipin}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleCopy}
                                        className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                                        aria-label="Copy DIGIPIN"
                                    >
                                        {copied ? <Check size={20} className="text-white" /> : <Copy size={20} className="text-white" />}
                                    </button>
                                </div>
                            </div>

                            {/* PIN Card Button - Highlighted */}
                            <button
                                onClick={onPinCard}
                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg mb-4"
                            >
                                <span className="text-2xl">🪪</span>
                                Generate PIN Card
                            </button>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={onShare}
                                    className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg"
                                >
                                    <Share2 size={18} />
                                    Share
                                </button>
                                <button 
                                    onClick={handleNavigate}
                                    className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                                >
                                    <Navigation size={18} />
                                    Navigate
                                </button>
                            </div>

                            {/* Quick tip */}
                            <p className="text-xs text-gray-400 text-center mt-4">
                                Create a PIN Card to save or print your location
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default BottomDrawer;
