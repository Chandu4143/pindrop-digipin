"use client";

import React, { useState } from 'react';
import { Crosshair, Loader2 } from 'lucide-react';
import { getCurrentLocation, getGeolocationErrorMessage, isGeolocationSupported } from '@/services/location';
import { useToast } from '@/components/ui/ToastContext';

interface MyLocationButtonProps {
    onLocationFound: (lat: number, lng: number) => void;
}

const MyLocationButton: React.FC<MyLocationButtonProps> = ({ onLocationFound }) => {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleClick = async () => {
        setLoading(true);
        
        if (!isGeolocationSupported()) {
            showToast('Geolocation is not supported by your browser', 'error');
            setLoading(false);
            return;
        }

        const result = await getCurrentLocation();
        
        if (result.success && result.coordinates) {
            onLocationFound(result.coordinates.latitude, result.coordinates.longitude);
            showToast('Location found!', 'success');
        } else if (result.error) {
            showToast(getGeolocationErrorMessage(result.error), 'error');
        }
        
        setLoading(false);
    };

    return (
        <button
            onClick={handleClick}
            data-location-btn
            className={`p-3 rounded-xl transition-all duration-200 ${
                loading 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
            }`}
            disabled={loading}
            title="Use my current location"
            aria-label="Get my current location"
        >
            {loading ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                <Crosshair size={20} />
            )}
        </button>
    );
};

export default MyLocationButton;
