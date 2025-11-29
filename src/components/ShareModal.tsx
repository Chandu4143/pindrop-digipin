"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link, MessageCircle } from 'lucide-react';
import QRCode from 'qrcode';
import Image from 'next/image';
import { useToast } from './ui/ToastContext';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    digipin: string;
    url: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, digipin, url }) => {
    const { showToast } = useToast();
    const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');

    React.useEffect(() => {
        if (isOpen && url) {
            QRCode.toDataURL(url)
                .then(setQrCodeUrl)
                .catch(console.error);
        }
    }, [isOpen, url]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url);
        showToast('Link copied to clipboard!', 'success');
    };

    const handleWhatsApp = () => {
        const text = `Check out this location: ${digipin} - ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-50"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 pointer-events-auto overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-900">Share Location</h3>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex justify-center mb-6">
                                    {qrCodeUrl && (
                                        <Image
                                            src={qrCodeUrl}
                                            alt="QR Code"
                                            width={192}
                                            height={192}
                                            className="border border-gray-200 rounded-xl"
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleCopyLink}
                                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                                    >
                                        <Link size={24} className="text-blue-600" />
                                        <span className="text-sm font-medium text-gray-700">Copy Link</span>
                                    </button>
                                    <button
                                        onClick={handleWhatsApp}
                                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors border border-green-200"
                                    >
                                        <MessageCircle size={24} className="text-green-600" />
                                        <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ShareModal;
