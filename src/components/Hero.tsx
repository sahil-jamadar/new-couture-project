import heroImage from "@/assets/hero-fashion-influencers.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/50" /> {/* Dark overlay for text readability */}
        <img
          src={heroImage}
          alt="Fashion influencers showcasing premium styles"
          className="w-full h-full object-cover object-center sm:object-top"
        />
      </div>

      {/* Content with Spread Gradient Overlay */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center md:text-left max-w-7xl">
        <div className="max-w-4xl animate-fade-in relative">
          {/* Multiple Gradient Layers for Natural Spread Effect */}
          <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-black/60 via-black/40 to-transparent rounded-full blur-3xl" />
          <div className="absolute -inset-6 sm:-inset-12 bg-gradient-to-br from-black/50 via-black/30 to-transparent rounded-full blur-2xl" />
          <div className="absolute -inset-3 sm:-inset-6 bg-gradient-to-t from-black/50 via-transparent to-black/30 rounded-full blur-xl" />
          
          {/* Content Container */}
          <div className="relative z-10 p-3 sm:p-6 md:p-8 lg:p-12">
            <p className="text-white/80 font-medium text-[10px] sm:text-sm md:text-base tracking-widest uppercase mb-2 sm:mb-3 md:mb-4 text-shadow-strong">
              Inspired by Fashion Icons
            </p>
            <h1 className="font-playfair text-xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 text-white leading-tight text-shadow-strong">
              Elevate Your Style<br className="hidden sm:block" />
              <span className="text-white">With The Best</span>
            </h1>
            
            {/* Elegant Slogan */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <p className="text-white/90 font-medium text-xs sm:text-base md:text-lg lg:text-xl tracking-wider italic text-shadow-glow">
                "your style, our signature"
              </p>
            </div>
            
            <p className="text-xs sm:text-base md:text-lg lg:text-xl text-gray-100 mb-4 sm:mb-6 md:mb-8 max-w-2xl leading-relaxed text-shadow-strong hidden sm:block">
              Join the fashion revolution with our curated collection of premium fabrics. From runway-inspired designs to timeless classics.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
