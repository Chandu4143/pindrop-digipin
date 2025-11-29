import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'DIGIPIN Finder - Free DIGIPIN Generator | PinDrop';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #6366f1 100%)',
          position: 'relative',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Pin icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            marginBottom: 25,
          }}
        >
          <svg width="85" height="85" viewBox="0 0 100 100" fill="none">
            <path
              d="M50 10c-22 0-40 18-40 40 0 30 40 70 40 70s40-40 40-70c0-22-18-40-40-40zm0 54c-8 0-14-6-14-14s6-14 14-14 14 6 14 14-6 14-14 14z"
              fill="white"
            />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-2px',
            textShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
        >
          DIGIPIN
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.9)',
            marginTop: 8,
            fontWeight: 500,
          }}
        >
          Finder & Generator
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.7)',
            marginTop: 12,
          }}
        >
          Free DIGIPIN lookup for any location in India
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              padding: '10px 20px',
              borderRadius: 20,
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              fontSize: 18,
            }}
          >
            pindrop-digipin.vercel.app
          </div>
          <div
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 16,
            }}
          >
            by PinDrop
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
