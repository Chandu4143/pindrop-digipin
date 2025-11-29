export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="text-center">
        {/* Animated loader */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin" />
          <div className="absolute inset-2 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" className="text-white">
              <path
                d="M50 10c-22 0-40 18-40 40 0 30 40 70 40 70s40-40 40-70c0-22-18-40-40-40zm0 54c-8 0-14-6-14-14s6-14 14-14 14 6 14 14-6 14-14 14z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
        
        {/* Loading text */}
        <p className="text-white/80 text-lg font-medium">Loading DIGIPIN Finder...</p>
        <p className="text-blue-200/50 text-sm mt-2">Preparing your map experience</p>
      </div>
    </main>
  );
}
