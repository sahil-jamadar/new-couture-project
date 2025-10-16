import { Product } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProductDetail } from "@/data/productDetails";
import { Eye, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MixedCollectionProps {
  id?: string;
  title: string;
  subtitle: string;
  products: Product[];
}

export const MixedCollection = ({ id, title, subtitle, products }: MixedCollectionProps) => {
  const navigate = useNavigate();
  // Take only first 8 products
  const displayProducts = products.slice(0, 8);

  const handleCardClick = (product: Product, index: number) => {
    // Check if this product has detailed color variants available
    const productDetail = getProductDetail(product.id);
    if (productDetail) {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <section id={id} className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-accent opacity-30" />
      <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          {/* Decorative Top Elements */}
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="w-12 sm:w-16 lg:w-20 h-px bg-gradient-premium" />
            <div className="mx-4 sm:mx-6 flex items-center gap-1 sm:gap-2">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary rounded-full" />
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-accent rounded-full" />
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary rounded-full" />
            </div>
            <div className="w-12 sm:w-16 lg:w-20 h-px bg-gradient-premium" />
          </div>
          
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gradient-purple mb-4 sm:mb-6 leading-tight px-4">
            {title}
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          
          {/* Featured Badge */}
          <div className="mt-8">
            <Badge className="bg-gradient-premium text-primary-foreground px-6 py-2 text-sm font-medium">
              ✨ Handpicked Selection
            </Badge>
          </div>
        </div>

        {/* Enhanced Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {displayProducts.map((product, index) => {
            const hasDetailPage = getProductDetail(product.id) !== null;
            return (
              <Card 
                key={product.id} 
                className={`group overflow-hidden border-0 shadow-elegant hover:shadow-premium transition-all duration-500 transform hover:-translate-y-2 bg-card/90 backdrop-blur-sm hover-lift ${
                  hasDetailPage ? 'cursor-pointer hover:ring-2 hover:ring-primary/30 hover:shadow-glow' : ''
                }`}
                onClick={() => handleCardClick(product, index)}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
              <div className="aspect-[4/5] overflow-hidden relative">
                {hasDetailPage && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg gap-1">
                      <Palette className="h-3 w-3" />
                      <span className="text-xs font-medium">Colors</span>
                    </Badge>
                  </div>
                )}
                {hasDetailPage && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur rounded-full p-3 shadow-lg">
                        <Eye className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge 
                  variant="secondary" 
                  className="absolute top-3 left-3 bg-card/90 text-card-foreground font-medium"
                >
                  {hasDetailPage ? 'Click to View Colors' : 'Premium'}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-dark-primary group-hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-dark-secondary mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gradient-purple">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <Badge variant="outline" className="border-blue-200 text-blue-600">
                    {hasDetailPage ? 'Click for Options' : 'View Only'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};