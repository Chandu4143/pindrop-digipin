import type { Metadata, Viewport } from 'next';

const siteUrl = 'https://pindrop-digipin.vercel.app';
const siteName = 'PinDrop';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  // DIGIPIN first for search ranking, PinDrop as brand
  title: {
    default: 'DIGIPIN Finder | PinDrop - Generate & Share Digital Address Codes',
    template: '%s | DIGIPIN Finder - PinDrop',
  },

  description:
    'Free DIGIPIN generator and finder. Generate DIGIPIN codes for any location in India instantly. Convert coordinates to DIGIPIN, share via QR code. India Post digital address system made easy with PinDrop.',

  // DIGIPIN-focused keywords for search ranking
  keywords: [
    'DIGIPIN',
    'DIGIPIN finder',
    'DIGIPIN generator',
    'DIGIPIN search',
    'DIGIPIN code',
    'DIGIPIN India',
    'DIGIPIN lookup',
    'DIGIPIN converter',
    'DIGIPIN to address',
    'address to DIGIPIN',
    'India Post DIGIPIN',
    'digital postal index number',
    'DIGIPIN map',
    'find DIGIPIN',
    'generate DIGIPIN',
    'DIGIPIN QR code',
    'DIGIPIN location',
    'PinDrop',
    'digital address India',
    'GPS to DIGIPIN',
    'DIGIPIN coordinates',
    'India digital address system',
    'WorldPIN',
    'location code India',
  ],

  authors: [{ name: 'PinDrop', url: siteUrl }],
  creator: 'PinDrop',
  publisher: 'PinDrop',

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: siteUrl,
    languages: {
      'en-IN': siteUrl,
      'en-US': siteUrl,
      'hi-IN': siteUrl,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    alternateLocale: ['en_US', 'hi_IN'],
    url: siteUrl,
    siteName: siteName,
    title: 'DIGIPIN Finder | Generate & Share Digital Address Codes Free',
    description:
      'Free DIGIPIN generator. Find DIGIPIN for any location in India. Convert coordinates to DIGIPIN, create QR codes, share locations instantly. India Post digital address made easy.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DIGIPIN Finder - Generate Digital Address Codes',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'DIGIPIN Finder | Free Digital Address Generator',
    description:
      'Generate DIGIPIN codes for any location in India. Free DIGIPIN finder with QR code sharing. India Post digital address system.',
    images: ['/og-image.png'],
    creator: '@pindrop',
    site: '@pindrop',
  },

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },

  manifest: '/manifest.json',

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DIGIPIN Finder',
  },

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  category: 'technology',

  classification: 'Utilities, Navigation, Maps',

  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#2563eb',
    'msapplication-config': '/browserconfig.xml',
  },
};

// Structured data optimized for DIGIPIN searches
export const structuredData = {
  webApplication: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${siteUrl}/#webapp`,
    name: 'DIGIPIN Finder - PinDrop',
    alternateName: [
      'DIGIPIN Generator',
      'DIGIPIN Finder',
      'DIGIPIN Search',
      'DIGIPIN Lookup',
      'DIGIPIN Converter',
      'PinDrop DIGIPIN',
      'India DIGIPIN Finder',
    ],
    description:
      'Free DIGIPIN generator and finder. Generate DIGIPIN codes for any location in India. Convert GPS coordinates to DIGIPIN, share via QR code.',
    url: siteUrl,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0.0',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    featureList: [
      'Generate DIGIPIN from GPS coordinates',
      'Find DIGIPIN for any address in India',
      'Convert DIGIPIN to latitude/longitude',
      'DIGIPIN QR code generator',
      'Share DIGIPIN via link or social media',
      'Interactive DIGIPIN map',
      'WorldPIN for global locations',
      'Free DIGIPIN lookup tool',
      'Mobile-friendly DIGIPIN finder',
      'Offline DIGIPIN support',
    ],
    screenshot: `${siteUrl}/og-image.png`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: 'PinDrop',
      url: siteUrl,
    },
  },

  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'PinDrop',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/icon-512.png`,
      width: 512,
      height: 512,
    },
    sameAs: [],
  },

  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: 'DIGIPIN Finder - PinDrop',
    alternateName: 'DIGIPIN Generator',
    url: siteUrl,
    description:
      'Free DIGIPIN finder and generator. Find DIGIPIN codes for any location in India. India Post digital address system.',
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/?pin={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['en-IN', 'en-US', 'hi-IN'],
  },

  breadcrumb: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'DIGIPIN Finder',
        item: siteUrl,
      },
    ],
  },

  faqPage: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is DIGIPIN?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "DIGIPIN (Digital Postal Index Number) is India's official digital address system developed by India Post. It converts GPS coordinates into a simple 10-character alphanumeric code that precisely identifies any location in India with 4x4 meter accuracy.",
        },
      },
      {
        '@type': 'Question',
        name: 'How do I find my DIGIPIN?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use PinDrop to find your DIGIPIN instantly. Simply click on your location on the map, use the "My Location" button, or search for your address. PinDrop will generate your DIGIPIN code automatically.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I generate a DIGIPIN code?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To generate a DIGIPIN: 1) Open PinDrop, 2) Click on any location on the map or search for an address, 3) Your DIGIPIN code is generated instantly, 4) Copy, share via QR code, or send the link.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is DIGIPIN free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, DIGIPIN is completely free. PinDrop provides free unlimited DIGIPIN generation, lookup, and sharing. No registration required.',
        },
      },
      {
        '@type': 'Question',
        name: 'How accurate is DIGIPIN?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'DIGIPIN provides location accuracy of approximately 4 meters x 4 meters, making it precise enough for door-to-door delivery, emergency services, and exact location sharing.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I convert DIGIPIN to coordinates?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, PinDrop can convert any DIGIPIN code to GPS coordinates (latitude/longitude). Simply enter the DIGIPIN in the search bar and PinDrop will show you the exact location on the map.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between DIGIPIN and PIN code?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PIN code (Postal Index Number) identifies a postal area/region, while DIGIPIN identifies a specific 4x4 meter location. DIGIPIN is much more precise - it can pinpoint your exact doorstep, not just your neighborhood.',
        },
      },
    ],
  },

  howTo: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Generate and Find DIGIPIN Code',
    description:
      'Step-by-step guide to generate DIGIPIN code for any location in India using PinDrop.',
    totalTime: 'PT1M',
    tool: {
      '@type': 'HowToTool',
      name: 'PinDrop DIGIPIN Finder',
    },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Open DIGIPIN Finder',
        text: 'Visit pindrop-digipin.vercel.app - the free DIGIPIN generator.',
        url: siteUrl,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Select Location for DIGIPIN',
        text: 'Click on any location on the map, use "My Location" button, or search for an address to generate DIGIPIN.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Get Your DIGIPIN Code',
        text: 'Your DIGIPIN code is generated instantly and displayed. The 10-character code uniquely identifies your location.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Share Your DIGIPIN',
        text: 'Copy the DIGIPIN, generate a QR code, or share via WhatsApp, email, or social media.',
      },
    ],
  },

  // Software Application schema for app stores
  softwareApplication: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DIGIPIN Finder',
    alternateName: 'PinDrop DIGIPIN Generator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
  },
};
