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
      className="bg-gradient-to-r from-purple-500 to-pink-500 py-4 overflow-hidden relative cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-colors mt-16 shadow-lg"
    >
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
        className="whitespace-nowrap text-white font-medium text-lg"
        style={{ animation: 'scroll-left 20s linear infinite' }}
      >
        ✨ Click here to schedule your bespoke tailoring appointment - Our expert team will visit your location ✨
      </div>
    </div>
  );
};