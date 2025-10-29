import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface BrandCarouselProps {
  brands: string[];
}

export const BrandCarousel = ({ brands }: BrandCarouselProps) => {
  const navigate = useNavigate();

  const handleBrandClick = (brand: string) => {
    navigate(`/brand/${encodeURIComponent(brand)}`);
  };

  return (
    <section className="py-12 sm:py-16 bg-gray-50 my-12 sm:my-16 lg:my-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center font-playfair text-xl sm:text-2xl md:text-3xl font-semibold mb-8 sm:mb-12 text-gray-800">
          Featured Brands
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {brands.map((brand) => (
            <Card 
              key={brand} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-gray-200 hover:border-gray-800 hover:scale-105 bg-white shadow-md"
              onClick={() => handleBrandClick(brand)}
            >
              <CardContent className="p-4 sm:p-6 flex items-center justify-center h-20 sm:h-24">
                <h4 className="font-playfair text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 group-hover:scale-110 transition-all text-center">
                  {brand}
                </h4>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-gray-600 text-xs sm:text-sm px-4">Click on any brand to explore their exclusive fabric collections</p>
        </div>
      </div>
    </section>
  );
};
