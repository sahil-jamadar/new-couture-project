import { Card, CardContent } from "@/components/ui/card";

interface BrandCarouselProps {
  brands: string[];
}

export const BrandCarousel = ({ brands }: BrandCarouselProps) => {
  return (
    <section className="py-16 bg-secondary/30 my-20">
      <div className="container mx-auto px-4">
        <h3 className="text-center font-playfair text-2xl md:text-3xl font-semibold mb-12 text-foreground">
          Featured Brands
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <Card 
              key={brand} 
              className="group hover:shadow-elegant transition-smooth cursor-pointer border-border/50 hover:border-primary/50"
            >
              <CardContent className="p-6 flex items-center justify-center h-24">
                <h4 className="font-playfair text-lg md:text-xl font-bold text-primary group-hover:scale-110 transition-smooth text-center">
                  {brand}
                </h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
