"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Image as ImageIcon } from 'lucide-react';
import PinCard from './PinCard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from './ui/ToastContext';

interface PinCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    digipin: string;
    lat: number;
    lng: number;
    address?: string;
    url: string;
}

const PinCardModal: React.FC<PinCardModalProps> = ({ isOpen, onClose, digipin, lat, lng, address, url }) => {
    const { showToast } = useToast();
    const [isExporting, setIsExporting] = React.useState(false);

    const handleDownloadPNG = async () => {
        const element = document.getElementById('pincard-export');
        if (element) {
            setIsExporting(true);
            try {
                const canvas = await html2canvas(element, { 
                    scale: 2, 
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });
                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `digipin-${digipin}.png`;
                link.href = dataUrl;
                link.click();
                showToast('PinCard saved as image!', 'success');
            } catch (error) {
                showToast('Failed to export image', 'error');
            }
            setIsExporting(false);
        }
    };

    const handleDownloadPDF = async () => {
        const element = document.getElementById('pincard-export');
        if (element) {
            setIsExporting(true);
            try {
                const canvas = await html2canvas(element, { 
                    scale: 2,
                    backgroundColor: '#ffffff'
                });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save(`digipin-${digipin}.pdf`);
                showToast('PinCard saved as PDF!', 'success');
            } catch (error) {
                showToast('Failed to export PDF', 'error');
            }
            setIsExporting(false);
        }
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
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto max-h-[90vh] overflow-hidden">
                            {/* Header */}
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">PIN Card</h3>
                                    <p className="text-sm text-gray-500">Save or print your location card</p>
                                </div>
                                <button 
                                    onClick={onClose} 
                                    className="p-2 hover:bg-white/80 rounded-full transition-colors"
                                    aria-label="Close"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="p-5 flex flex-col items-center space-y-5 overflow-y-auto">
                                {/* Card Preview */}
                                <div className="transform scale-[0.85] sm:scale-100 origin-center">
                                    <PinCard
                                        id="pincard-export"
                                        digipin={digipin}
                                        lat={lat}
                                        lng={lng}
                                        address={address}
                                        url={url}
                                    />
                                </div>

                                {/* Export Buttons */}
                                <div className="flex gap-3 w-full max-w-[340px]">
                                    <button
                                        onClick={handleDownloadPNG}
                                        disabled={isExporting}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
                                    >
                                        <ImageIcon size={18} />
                                        Save Image
                                    </button>
                                    <button
                                        onClick={handleDownloadPDF}
                                        disabled={isExporting}
                                        className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 py-3.5 px-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
                                    >
                                        <FileText size={18} />
                                        Save PDF
                                    </button>
                                </div>

                                {/* Tip */}
                                <p className="text-xs text-gray-400 text-center max-w-[300px]">
                                    Print this card and stick it on your door, or share digitally with delivery services
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PinCardModal;
