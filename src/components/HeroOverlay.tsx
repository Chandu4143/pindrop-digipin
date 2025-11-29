"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Share2, QrCode, ArrowRight, Sparkles } from 'lucide-react';

interface HeroOverlayProps {
  onGetStarted: () => void;
  onSearch: (query: string) => void;
}

const HeroOverlay: React.FC<HeroOverlayProps> = ({ onGetStarted, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const features = [
    { icon: <MapPin size={20} />, title: 'Precise Location', desc: 'Get exact DIGIPIN for any location in India' },
    { icon: <Share2 size={20} />, title: 'Easy Sharing', desc: 'Share locations via link, QR code, or WhatsApp' },
    { icon: <QrCode size={20} />, title: 'PIN Cards', desc: 'Generate beautiful shareable location cards' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-indigo-900/95 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl mx-auto px-6 py-8 text-center">
        {/* Logo & Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-blue-200 text-sm font-medium mb-4">
            <Sparkles size={16} className="text-yellow-400" />
            India&apos;s Digital Address System
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight"
        >
          Find Your{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            DIGIPIN
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-blue-100/80 mb-8 max-w-lg mx-auto"
        >
          Generate precise digital addresses for any location. Share with a single tap.
        </motion.p>

        {/* Search Bar */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="relative max-w-md mx-auto mb-8"
        >
          <div className="relative flex items-center bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
            <Search size={20} className="absolute left-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search place or enter DIGIPIN..."
              className="w-full py-4 pl-12 pr-32 text-gray-700 outline-none placeholder-gray-400 text-lg"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              Search
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.form>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border border-white/20"
          >
            <MapPin size={18} />
            Click on Map
          </button>
          <button
            onClick={() => onSearch('Delhi')}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border border-white/20"
          >
            Try: Delhi
          </button>
          <button
            onClick={() => onSearch('Mumbai')}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border border-white/20"
          >
            Try: Mumbai
          </button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white mb-3 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
              <p className="text-blue-200/70 text-sm">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Skip button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onGetStarted}
          className="mt-8 text-blue-300/60 hover:text-blue-200 text-sm font-medium transition-colors"
          aria-label="Skip introduction and go to map"
        >
          Skip intro →
        </motion.button>

        {/* SEO-friendly hidden content for crawlers - DIGIPIN focused */}
        <div className="sr-only">
          <h2>DIGIPIN Finder - Free DIGIPIN Generator</h2>
          <p>
            Find and generate DIGIPIN codes for any location in India. DIGIPIN (Digital Postal 
            Index Number) is India&apos;s official digital address system by India Post. Use this 
            free DIGIPIN finder to convert GPS coordinates to DIGIPIN codes instantly.
          </p>
          <h2>How to Find Your DIGIPIN</h2>
          <ol>
            <li>Search for your address or click on the map to find DIGIPIN</li>
            <li>Get your DIGIPIN code generated automatically</li>
            <li>Share your DIGIPIN via QR code, link, or WhatsApp</li>
          </ol>
          <h2>DIGIPIN Features</h2>
          <ul>
            <li>Free DIGIPIN generator for any location in India</li>
            <li>Convert DIGIPIN to GPS coordinates</li>
            <li>DIGIPIN QR code generator</li>
            <li>Share DIGIPIN via link or social media</li>
            <li>DIGIPIN lookup and search</li>
            <li>WorldPIN for global locations</li>
          </ul>
          <h2>What is DIGIPIN?</h2>
          <p>
            DIGIPIN is a 10-character alphanumeric code that identifies any location in India 
            with 4x4 meter accuracy. It&apos;s India Post&apos;s digital address system for precise 
            location sharing and delivery.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroOverlay;
