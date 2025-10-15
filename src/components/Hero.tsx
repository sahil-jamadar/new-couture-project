import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-fabrics.jpg";

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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Premium luxury fabrics"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center md:text-left max-w-6xl">
        <div className="max-w-3xl animate-fade-in">
          <p className="text-accent font-medium text-sm md:text-base tracking-widest uppercase mb-4">
            Premium Fabric Collection
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
            Your Style,<br />
            <span className="text-primary">Our Signature</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            Discover exclusive collections of premium Egyptian cotton, Italian fabrics, and Indo-Western wear. Where craftsmanship meets elegance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              size="lg"
              onClick={scrollToCollection}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-premium group"
            >
              Explore Collections
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              View Catalogue
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
