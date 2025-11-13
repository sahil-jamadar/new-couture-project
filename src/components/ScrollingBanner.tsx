
interface ScrollingBannerProps {
  onBannerClick: () => void;
}

export const ScrollingBanner = ({ onBannerClick }: ScrollingBannerProps) => {
  return (
    <div 
      onClick={onBannerClick}
      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-4 sm:py-5 overflow-hidden relative cursor-pointer hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 transition-all duration-300 group shadow-lg hover:shadow-xl border-b border-gray-600"
    >
      {/* Professional shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent group-hover:via-white/12 transition-all duration-500" />
      
      {/* Premium accent bars */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-70"></div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
      
      {/* Elegant corner accents */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-yellow-400/15 to-transparent opacity-40"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-yellow-400/15 to-transparent opacity-40"></div>
      
      {/* Static professional content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Professional service badge */}
          <div className="inline-flex items-center gap-2 mb-2 px-4 py-1.5 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-full border border-yellow-400/30 backdrop-blur-sm">
            <span className="text-yellow-400 text-sm">👑</span>
            <span className="text-xs font-bold text-white tracking-wider">PREMIUM TAILORING SERVICE</span>
          </div>
          
          {/* Main content */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 animate-pulse">✨</span>
              <span className="text-lg sm:text-xl font-bold text-white tracking-wide">
                Expert Custom Tailoring
              </span>
              <span className="text-yellow-400 animate-pulse">✨</span>
            </div>
            
            <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
            
            <div className="flex items-center gap-2 text-white">
              <span className="text-yellow-400">⚡</span>
              <span className="text-sm font-semibold">Perfect Fit Guaranteed</span>
            </div>
            
            <div className="hidden lg:block w-px h-8 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
            
            <div className="hidden lg:flex items-center gap-2 text-white">
              <span className="text-red-400">❤️</span>
              <span className="text-sm font-semibold">Premium Quality</span>
            </div>
          </div>
          
          {/* Enhanced call to action */}
          <div className="mt-3 flex items-center justify-center gap-4 text-sm">
            <span className="font-bold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/30">
              📞 Book Appointment
            </span>
            <span className="hidden sm:inline text-white/80">•</span>
            <span className="hidden sm:inline font-semibold text-white/90">Home Measurements Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};