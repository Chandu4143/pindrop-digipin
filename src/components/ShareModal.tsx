"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, MessageCircle, Download, Copy, Check, Twitter, Mail } from 'lucide-react';
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
    const [copiedLink, setCopiedLink] = React.useState(false);
    const [copiedPin, setCopiedPin] = React.useState(false);

    React.useEffect(() => {
        if (isOpen && url) {
            QRCode.toDataURL(url, { 
                width: 400, 
                margin: 2,
                color: {
                    dark: '#1e293b',
                    light: '#ffffff'
                }
            })
                .then(setQrCodeUrl)
                .catch(console.error);
        }
    }, [isOpen, url]);

    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(url);
        setCopiedLink(true);
        showToast('Link copied to clipboard!', 'success');
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const handleCopyPin = async () => {
        await navigator.clipboard.writeText(digipin);
        setCopiedPin(true);
        showToast('DIGIPIN copied!', 'success');
        setTimeout(() => setCopiedPin(false), 2000);
    };

    const handleDownloadQR = () => {
        if (!qrCodeUrl) return;
        const link = document.createElement('a');
        link.download = `digipin-${digipin}-qr.png`;
        link.href = qrCodeUrl;
        link.click();
        showToast('QR code downloaded!', 'success');
    };

    const handleWhatsApp = () => {
        const message = `📍 DIGIPIN Location\n\n🔢 PIN: ${digipin}\n🔗 ${url}\n\nOpen the link to view this location!`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleTwitter = () => {
        const text = `Check out this location! DIGIPIN: ${digipin}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    };

    const handleEmail = () => {
        const subject = `Location: ${digipin}`;
        const body = `Hi,\n\nI wanted to share this location with you.\n\nDIGIPIN: ${digipin}\nLink: ${url}\n\nOpen the link to view the exact location on the map.`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-50"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm pointer-events-auto overflow-hidden">
                            {/* Header */}
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Share Location</h3>
                                    <p className="text-sm text-gray-500">Send this DIGIPIN to anyone</p>
                                </div>
                                <button 
                                    onClick={onClose} 
                                    className="p-2 hover:bg-white/80 rounded-full transition-colors"
                                    aria-label="Close"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="p-5 space-y-5">
                                {/* QR Code */}
                                <div className="flex flex-col items-center">
                                    <div className="bg-white p-3 rounded-2xl shadow-lg border border-gray-100">
                                        {qrCodeUrl && (
                                            <Image
                                                src={qrCodeUrl}
                                                alt="QR Code for DIGIPIN"
                                                width={180}
                                                height={180}
                                                className="rounded-xl"
                                            />
                                        )}
                                    </div>
                                    <button
                                        onClick={handleDownloadQR}
                                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold mt-3 transition-colors"
                                    >
                                        <Download size={16} />
                                        Download QR Code
                                    </button>
                                </div>

                                {/* DIGIPIN display */}
                                <button
                                    onClick={handleCopyPin}
                                    className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                                >
                                    <div className="text-left">
                                        <span className="text-xs text-gray-500 block">DIGIPIN</span>
                                        <span className="font-mono font-bold text-lg text-gray-800">{digipin}</span>
                                    </div>
                                    {copiedPin ? (
                                        <Check size={20} className="text-green-500" />
                                    ) : (
                                        <Copy size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    )}
                                </button>

                                {/* Share options */}
                                <div className="grid grid-cols-4 gap-3">
                                    <ShareButton
                                        icon={copiedLink ? <Check size={22} /> : <Link2 size={22} />}
                                        label="Copy"
                                        onClick={handleCopyLink}
                                        color="bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    />
                                    <ShareButton
                                        icon={<MessageCircle size={22} />}
                                        label="WhatsApp"
                                        onClick={handleWhatsApp}
                                        color="bg-green-100 text-green-700 hover:bg-green-200"
                                    />
                                    <ShareButton
                                        icon={<Twitter size={22} />}
                                        label="Twitter"
                                        onClick={handleTwitter}
                                        color="bg-blue-100 text-blue-700 hover:bg-blue-200"
                                    />
                                    <ShareButton
                                        icon={<Mail size={22} />}
                                        label="Email"
                                        onClick={handleEmail}
                                        color="bg-purple-100 text-purple-700 hover:bg-purple-200"
                                    />
                                </div>

                                {/* Tip */}
                                <p className="text-xs text-gray-400 text-center">
                                    Recipients can scan the QR code or use the link to view this location
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// Share button component
function ShareButton({ 
    icon, 
    label, 
    onClick, 
    color 
}: { 
    icon: React.ReactNode; 
    label: string; 
    onClick: () => void; 
    color: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all duration-200 ${color}`}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
}

export default ShareModal;
