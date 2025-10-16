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
    <section id={id} className="py-16 gradient-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-dark-primary mb-4">
            {title}
          </h2>
          <p className="text-lg text-dark-secondary max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product, index) => {
            const hasDetailPage = getProductDetail(product.id) !== null;
            return (
              <Card 
                key={product.id} 
                className={`group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 gradient-card backdrop-blur ${
                  hasDetailPage ? 'cursor-pointer hover:ring-2 hover:ring-primary/50 shadow-glow' : ''
                }`}
                onClick={() => handleCardClick(product, index)}
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