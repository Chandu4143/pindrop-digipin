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
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #6366f1 100%)',
          padding: '60px 80px',
          position: 'relative',
        }}
      >
        {/* Grid pattern overlay */}
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

        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
          }}
        />

        {/* Content container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '60px' }}>
          {/* Pin icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
            }}
          >
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
              <path
                d="M50 10c-22 0-40 18-40 40 0 30 40 70 40 70s40-40 40-70c0-22-18-40-40-40zm0 54c-8 0-14-6-14-14s6-14 14-14 14 6 14 14-6 14-14 14z"
                fill="white"
              />
            </svg>
          </div>

          {/* Text content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                fontSize: 88,
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-2px',
                textShadow: '0 4px 8px rgba(0,0,0,0.2)',
              }}
            >
              DIGIPIN
            </div>
            <div
              style={{
                fontSize: 36,
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 500,
              }}
            >
              Finder & Generator
            </div>
            <div
              style={{
                fontSize: 22,
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 400,
              }}
            >
              India&apos;s Digital Address System
            </div>
          </div>
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '35px',
            marginLeft: '260px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'rgba(255,255,255,0.85)',
              fontSize: 22,
            }}
          >
            <span>✓</span>
            <span>Generate DIGIPIN for any location</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'rgba(255,255,255,0.85)',
              fontSize: 22,
            }}
          >
            <span>✓</span>
            <span>Convert DIGIPIN to coordinates</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'rgba(255,255,255,0.85)',
              fontSize: 22,
            }}
          >
            <span>✓</span>
            <span>Share via QR code & links - FREE</span>
          </div>
        </div>

        {/* URL badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 55,
            left: 340,
            display: 'flex',
            alignItems: 'center',
            padding: '12px 24px',
            borderRadius: 25,
            background: 'rgba(255,255,255,0.15)',
            color: 'white',
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          pindrop-digipin.vercel.app
        </div>

        {/* PinDrop branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            right: 60,
            color: 'rgba(255,255,255,0.6)',
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          by PinDrop
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
