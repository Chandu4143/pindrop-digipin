# PinDrop - DIGIPIN Finder

<div align="center">

![PinDrop Logo](public/icon.svg)

**Free DIGIPIN Generator & Finder for India**

[Live Demo](https://pindrop-digipin.vercel.app) · [Report Bug](https://github.com/yourusername/pindrop/issues) · [Request Feature](https://github.com/yourusername/pindrop/issues)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## About

PinDrop is a free, open-source web application that helps you discover, generate, and share **DIGIPIN** codes for any location in India. DIGIPIN (Digital Postal Index Number) is India Post's revolutionary digital address system that converts GPS coordinates into simple 10-character alphanumeric codes with 4x4 meter accuracy.

### Why PinDrop?

- 🆓 **Completely Free** - No registration, no limits, no ads
- 🎯 **Precise** - 4x4 meter location accuracy
- 📱 **Mobile-First** - Works beautifully on any device
- 🔗 **Easy Sharing** - QR codes, links, WhatsApp, and more
- 🌍 **WorldPIN Support** - Generate location codes globally
- ⚡ **Fast** - Instant DIGIPIN generation
- 🔒 **Private** - No data stored, works offline

---

## Features

### 🗺️ Interactive Map
- Click anywhere on the map to generate a DIGIPIN
- Search by place name, address, or existing DIGIPIN
- Use your current location with one tap
- Smooth pan and zoom with OpenStreetMap

### 📍 DIGIPIN Generation
- Instant DIGIPIN code generation for any location
- Convert DIGIPIN back to GPS coordinates
- Copy to clipboard with one click
- Supports both DIGIPIN (India) and WorldPIN (Global)

### 📤 Sharing Options
- Generate QR codes for any DIGIPIN
- Share via WhatsApp, Email, or any app
- Create shareable links
- Download PIN Cards as images

### 🎴 PIN Cards
- Beautiful, shareable location cards
- Include QR code, coordinates, and address
- Download as PNG or PDF
- Perfect for business cards, deliveries, or emergencies

### 🔄 Converter Tools
- Coordinates → DIGIPIN
- DIGIPIN → Coordinates
- Batch conversion support
- Real-time validation

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 14](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Leaflet](https://leafletjs.com/) | Interactive maps |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [QRCode](https://www.npmjs.com/package/qrcode) | QR code generation |
| [Lucide React](https://lucide.dev/) | Icons |

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chandu4143/pindrop.git
   cd pindrop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` if you need to configure any API keys. (no APIs for now, but let it be there for the future)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

### Generate Icons (Optional)

To generate PNG icons from the SVG source:

```bash
npm install sharp --save-dev
npm run generate-icons
```

---

## Project Structure

```
pindrop/
├── public/              # Static assets
│   ├── icon.svg         # App icon
│   ├── manifest.json    # PWA manifest
│   └── robots.txt       # SEO robots file
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── layout.tsx   # Root layout with SEO
│   │   ├── page.tsx     # Main page
│   │   ├── metadata.ts  # SEO metadata
│   │   └── ...
│   ├── components/      # React components
│   │   ├── MapContainer*.tsx
│   │   ├── Sidebar.tsx
│   │   ├── BottomDrawer.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ShareModal.tsx
│   │   ├── PinCard.tsx
│   │   └── ...
│   ├── services/        # Business logic
│   │   ├── encoding.ts  # DIGIPIN encoding/decoding
│   │   ├── geocoding.ts # Address lookup
│   │   └── ...
│   ├── lib/             # Utilities
│   │   └── worldpin.ts  # WorldPIN algorithm
│   └── types/           # TypeScript types
├── scripts/             # Build scripts
└── package.json
```

---

## How DIGIPIN Works

DIGIPIN divides India into a grid of 4m × 4m cells. Each cell is assigned a unique 10-character code using a base-10 character set. The algorithm:

1. Takes latitude and longitude coordinates
2. Maps them to a grid cell within India's boundaries
3. Encodes the cell position as a 10-character string
4. Format: `XXX-XXX-XXXX` (with hyphens for readability)

### Example
```
Location: India Gate, New Delhi
Coordinates: 28.6129° N, 77.2295° E
DIGIPIN: 3PJ-7KL-4MN2
```

---

## API Reference

### Encoding Service

```typescript
import { encode, decode } from '@/services/encoding';

// Generate DIGIPIN from coordinates
const result = encode({ latitude: 28.6129, longitude: 77.2295 }, 'india');
// { success: true, pin: '3PJ-7KL-4MN2' }

// Decode DIGIPIN to coordinates
const location = decode('3PJ-7KL-4MN2', 'india');
// { success: true, coordinates: { latitude: 28.6129, longitude: 77.2295 } }
```

### URL Service

```typescript
import { buildUrl, parseUrlParams } from '@/services/url';

// Create shareable URL
const url = buildUrl('3PJ-7KL-4MN2', 'india');
// https://pindrop-digipin.vercel.app/?pin=3PJ-7KL-4MN2&mode=india

// Parse URL parameters
const params = parseUrlParams(new URLSearchParams(window.location.search));
// { pin: '3PJ-7KL-4MN2', mode: 'india' }
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run generate-icons` | Generate PNG icons |

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [India Post](https://www.indiapost.gov.in/) for the DIGIPIN system
- [OpenStreetMap](https://www.openstreetmap.org/) for map tiles
- [Nominatim](https://nominatim.org/) for geocoding

---

## Disclaimer

PinDrop is an independent, unofficial tool. DIGIPIN is a service by India Post. This application is not affiliated with or endorsed by India Post or the Government of India.

---

<div align="center">

Made with ❤️ in India

[⬆ Back to top](#pindrop---digipin-finder)

</div>
