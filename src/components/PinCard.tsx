"use client";

import React from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';

interface PinCardProps {
    digipin: string;
    lat: number;
    lng: number;
    address?: string;
    url: string;
    id?: string; // For html2canvas targeting
}

const PinCard: React.FC<PinCardProps> = ({ digipin, lat, lng, address, url, id }) => {
    const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');

    React.useEffect(() => {
        if (url) {
            QRCode.toDataURL(url, { margin: 1, width: 128 })
                .then(setQrCodeUrl)
                .catch(console.error);
        }
    }, [url]);

    return (
        <div
            id={id}
            className="bg-white w-[350px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 font-sans"
        >
            {/* Header / Map Preview Placeholder */}
            <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 relative p-6 flex flex-col justify-between text-white">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-80">DIGIPIN Location</h3>
                    <h1 className="text-3xl font-bold mt-1 tracking-tight">{digipin}</h1>
                </div>
                <div className="text-sm opacity-90 font-mono">
                    {lat.toFixed(5)}, {lng.toFixed(5)}
                </div>
            </div>

            {/* Body */}
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Address</p>
                        <p className="text-gray-800 font-medium leading-snug">
                            {address || "Unknown Location"}
                        </p>
                    </div>
                    {qrCodeUrl && (
                        <div className="ml-4 shrink-0">
                            <Image
                                src={qrCodeUrl}
                                alt="QR"
                                width={80}
                                height={80}
                                className="rounded-lg border border-gray-100"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-500 font-medium">Verified Location</span>
                    </div>
                    <span className="text-xs text-blue-600 font-bold">pindrop.app</span>
                </div>
            </div>
        </div>
    );
};

export default PinCard;
