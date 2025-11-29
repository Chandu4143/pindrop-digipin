"use client";

import React from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';
import { MapPin, Navigation } from 'lucide-react';

interface PinCardProps {
    digipin: string;
    lat: number;
    lng: number;
    address?: string;
    url: string;
    id?: string;
}

const PinCard: React.FC<PinCardProps> = ({ digipin, lat, lng, address, url, id }) => {
    const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');

    React.useEffect(() => {
        if (url) {
            QRCode.toDataURL(url, { 
                margin: 1, 
                width: 128,
                color: {
                    dark: '#1e293b',
                    light: '#ffffff'
                }
            })
                .then(setQrCodeUrl)
                .catch(console.error);
        }
    }, [url]);

    return (
        <div
            id={id}
            className="bg-white w-[340px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 font-sans"
        >
            {/* Header with gradient */}
            <div className="h-36 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative p-5 flex flex-col justify-between text-white">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white rounded-full" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white rounded-full" />
                    <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                </div>
                
                {/* Pin icon */}
                <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <MapPin size={24} className="text-white" />
                </div>

                <div className="relative">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-200">DIGIPIN</span>
                    <h1 className="text-3xl font-bold mt-1 tracking-tight font-mono">{digipin}</h1>
                </div>
                
                <div className="relative flex items-center gap-2 text-sm text-blue-100">
                    <Navigation size={14} />
                    <span className="font-mono">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
                </div>
            </div>

            {/* Body */}
            <div className="p-5">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Location</p>
                        <p className="text-gray-800 font-medium leading-snug truncate">
                            {address || "Selected Location"}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            Scan QR to open in map →
                        </p>
                    </div>
                    {qrCodeUrl && (
                        <div className="shrink-0 bg-white p-1.5 rounded-xl shadow-md border border-gray-100">
                            <Image
                                src={qrCodeUrl}
                                alt="QR Code"
                                width={72}
                                height={72}
                                className="rounded-lg"
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-gray-500 font-medium">Verified Location</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md flex items-center justify-center">
                            <MapPin size={12} className="text-white" />
                        </div>
                        <span className="text-xs text-gray-600 font-bold">PinDrop</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PinCard;
