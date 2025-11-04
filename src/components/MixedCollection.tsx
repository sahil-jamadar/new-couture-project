import { Product, ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface MixedCollectionProps {
  id?: string;
  title: string;
  subtitle: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const MixedCollection = ({ id, title, subtitle, products, onAddToCart }: MixedCollectionProps) => {
  const navigate = useNavigate();
  // Take only first 8 products
  const displayProducts = products.slice(0, 8);

  return (
    <section id={id} className="py-2 sm:py-4 lg:py-5 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl opacity-25 animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full blur-3xl opacity-20" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          {/* Decorative Top Elements */}
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="w-16 sm:w-24 lg:w-32 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
            <div className="mx-4 sm:mx-6 flex items-center gap-2 sm:gap-3">
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-purple-600 rounded-full animate-pulse" />
              <div className="w-3 sm:w-4 h-3 sm:h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-purple-600 rounded-full animate-pulse" />
            </div>
            <div className="w-16 sm:w-24 lg:w-32 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
          </div>
          
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-purple-900 via-gray-800 to-purple-900 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight px-4">
            {title}
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            {subtitle}
          </p>
          
          {/* Enhanced Featured Badge */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300">
              ✨ Curated Excellence
            </Badge>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>8 Premium Selections</span>
            </div>
          </div>
        </div>

        {/* Enhanced Product Grid - 2 products per row on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {displayProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};