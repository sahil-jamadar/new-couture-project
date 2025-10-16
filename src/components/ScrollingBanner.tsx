import { useEffect, useRef } from 'react';

interface ScrollingBannerProps {
  onBannerClick: () => void;
}

export const ScrollingBanner = ({ onBannerClick }: ScrollingBannerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    // Reset animation when it ends
    const handleAnimationEnd = () => {
      if (scrollElement) {
        scrollElement.style.animation = 'none';
        // Trigger reflow
        void scrollElement.offsetWidth;
        scrollElement.style.animation = 'scroll-left 20s linear infinite';
      }
    };

    scrollElement.addEventListener('animationend', handleAnimationEnd);
    return () => {
      scrollElement.removeEventListener('animationend', handleAnimationEnd);
    };
  }, []);

  return (
    <div 
      onClick={onBannerClick}
      className="bg-gradient-premium py-6 overflow-hidden relative cursor-pointer hover:bg-gradient-accent transition-all duration-500 shadow-premium hover:shadow-glow group"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 group-hover:from-white/10 group-hover:to-white/10 transition-all duration-500" />
      
      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
      <div 
        ref={scrollRef}
        className="whitespace-nowrap text-primary-foreground font-medium text-xl tracking-wide relative z-10"
        style={{ animation: 'scroll-left 25s linear infinite' }}
      >
        ✨ Click here to schedule your bespoke tailoring appointment - Our expert artisans will visit your location for personalized service ✨
      </div>
    </div>
  );
};