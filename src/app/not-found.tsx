import Link from 'next/link';
import { MapPin, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <MapPin size={48} className="text-white/80" />
        </div>
        
        {/* Error code */}
        <h1 className="text-8xl font-bold text-white/20 mb-4">404</h1>
        
        {/* Message */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          Location Not Found
        </h2>
        <p className="text-blue-200/70 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Try searching for a DIGIPIN or location instead.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            <Home size={20} />
            Go Home
          </Link>
          <Link
            href="/?action=search"
            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
          >
            <Search size={20} />
            Search Location
          </Link>
        </div>
        
        {/* SEO content */}
        <div className="sr-only">
          <p>
            This is the 404 error page for DIGIPIN Finder by PinDrop. 
            The requested page was not found. Please return to the homepage 
            to generate DIGIPIN codes, find your DIGIPIN, or search for locations.
          </p>
        </div>
      </div>
    </main>
  );
}
