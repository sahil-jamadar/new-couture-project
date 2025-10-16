import heroImage from "@/assets/hero-fashion-influencers.jpeg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  const scrollToCollection = () => {
    const element = document.getElementById("cotton-collection");
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-dark-gradient">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/70" /> {/* Dark overlay */}
        <img
          src={heroImage}
          alt="Fashion influencers showcasing premium styles"
          className="w-full h-full object-cover transform scale-110 animate-subtle-zoom"
          style={{
            animation: 'subtle-zoom 20s infinite alternate',
          }}
        />
        {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-purple-600/30 to-pink-600/40" /> */}
      </div>

      {/* Content with Spread Gradient Overlay */}
      <div className="container mx-auto px-4 z-10 text-center md:text-left max-w-6xl">
        <div className="max-w-3xl animate-fade-in relative">
          {/* Multiple Gradient Layers for Natural Spread Effect */}
          <div className="absolute -inset-8 bg-gradient-to-r from-black/60 via-black/40 to-transparent rounded-full blur-3xl" />
          <div className="absolute -inset-12 bg-gradient-to-br from-purple-900/50 via-black/30 to-transparent rounded-full blur-2xl" />
          <div className="absolute -inset-6 bg-gradient-to-t from-black/50 via-transparent to-black/30 rounded-full blur-xl" />
          
          {/* Content Container */}
          <div className="relative z-10 p-8 md:p-12">
            <p className="text-accent font-medium text-sm md:text-base tracking-widest uppercase mb-4 text-purple-200 text-shadow-strong">
              Inspired by Fashion Icons
            </p>
            <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight text-shadow-strong">
              Elevate Your Style<br />
              <span className="text-gradient-purple">With The Best</span>
            </h1>
            
            {/* Elegant Slogan */}
            <div className="mb-6">
              <p className="text-accent font-medium text-lg md:text-xl tracking-wider italic text-white/90 text-shadow-glow">
                "your style, our signature"
              </p>
            </div>
            
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl leading-relaxed text-shadow-strong">
              Join the fashion revolution with our curated collection of premium fabrics. From runway-inspired designs to timeless classics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                size="lg"
                onClick={scrollToCollection}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-premium group transition-all duration-300 hover:shadow-glow hover-lift"
              >
                Explore Collections
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/80 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all duration-300 hover-lift"
              >
                View Catalogue
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
