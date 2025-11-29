"use client";

import React, { useState } from 'react';
import { Crosshair } from 'lucide-react';

interface MyLocationButtonProps {
    onLocationFound: (lat: number, lng: number) => void;
}

const MyLocationButton: React.FC<MyLocationButtonProps> = ({ onLocationFound }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                onLocationFound(position.coords.latitude, position.coords.longitude);
                setLoading(false);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location');
                setLoading(false);
            }
        );
    };

    return (
        <button
            onClick={handleClick}
            className="bg-white p-3 rounded-full shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all disabled:opacity-50"
            disabled={loading}
            title="Use my location"
        >
            <Crosshair size={24} className={loading ? 'animate-spin' : ''} />
        </button>
    );
};

export default MyLocationButton;
