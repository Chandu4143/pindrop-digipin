"use client";

import React from 'react';
import { MapPin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-0 pointer-events-none">
      {/* Visible footer for desktop - subtle branding */}
      <div className="hidden md:flex justify-center pb-2 pointer-events-auto">
        <a 
          href="https://pindrop-digipin.vercel.app"
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm"
          aria-label="PinDrop - Find & Share Locations"
        >
          <MapPin size={12} />
          <span>PinDrop</span>
          <span className="text-gray-300">•</span>
          <span>Made with</span>
          <Heart size={10} className="text-red-400" />
          <span>in India</span>
        </a>
      </div>
      
      {/* SEO-friendly hidden content - DIGIPIN focused */}
      <div className="sr-only">
        <nav aria-label="Footer navigation">
          <h2>DIGIPIN Finder by PinDrop</h2>
          <p>
            Free DIGIPIN generator and finder. Generate DIGIPIN codes for any location in India.
            DIGIPIN is India Post&apos;s digital address system for precise location identification.
            Use PinDrop to find, generate, and share DIGIPIN codes instantly.
          </p>
          
          <h3>DIGIPIN Tools</h3>
          <ul>
            <li><a href="/">DIGIPIN Finder - Generate DIGIPIN</a></li>
            <li><a href="/?action=search">Search DIGIPIN by Address</a></li>
            <li><a href="/?action=locate">Find My DIGIPIN</a></li>
          </ul>
          
          <h3>About DIGIPIN</h3>
          <p>
            DIGIPIN (Digital Postal Index Number) is a 10-character code that identifies 
            any location in India with 4x4 meter accuracy. Generate your DIGIPIN free with PinDrop.
          </p>
          
          <h3>Contact</h3>
          <address>
            DIGIPIN Finder - PinDrop<br />
            Website: pindrop-digipin.vercel.app
          </address>
          
          <p>© {currentYear} PinDrop. Free DIGIPIN generator.</p>
          <p>
            DIGIPIN is a service by India Post. PinDrop is a free tool 
            to help users find and share DIGIPIN codes.
          </p>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
