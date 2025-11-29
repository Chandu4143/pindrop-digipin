"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText } from 'lucide-react';
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

    const handleDownloadPNG = async () => {
        const element = document.getElementById('pincard-export');
        if (element) {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `digipin-${digipin}.png`;
            link.href = dataUrl;
            link.click();
            showToast('PinCard downloaded as PNG', 'success');
        }
    };

    const handleDownloadPDF = async () => {
        const element = document.getElementById('pincard-export');
        if (element) {
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`digipin-${digipin}.pdf`);
            showToast('PinCard downloaded as PDF', 'success');
        }
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
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 pointer-events-auto max-h-[90vh] overflow-y-auto">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-900">PinCard</h3>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 flex flex-col items-center space-y-6">
                                <div className="transform scale-90 sm:scale-100 origin-center">
                                    <PinCard
                                        id="pincard-export"
                                        digipin={digipin}
                                        lat={lat}
                                        lng={lng}
                                        address={address}
                                        url={url}
                                    />
                                </div>

                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={handleDownloadPNG}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md"
                                    >
                                        <Download size={18} />
                                        Save Image
                                    </button>
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        <FileText size={18} />
                                        Save PDF
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

export default PinCardModal;
