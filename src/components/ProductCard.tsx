import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProductDetail } from "@/data/productDetails";
import { Eye, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  material?: string;
  brand?: string;
  category?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  // Check if this product has detailed information available
  const productDetail = getProductDetail(product.id);
  const hasDetailPage = productDetail !== null;

  const handleCardClick = () => {
    if (hasDetailPage) {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <Card
      className={`group overflow-hidden border-border hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 gradient-card backdrop-blur ${
        hasDetailPage ? 'cursor-pointer hover:scale-[1.02] shadow-glow' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-smooth ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        
        {/* Detail Page Indicator */}
        {hasDetailPage && (
          <>
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
              <Eye className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">View Details</span>
            </Badge>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-card/90 backdrop-blur rounded-full p-4 shadow-lg">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-playfair font-semibold text-lg mb-2 text-dark-primary group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-dark-secondary mb-3 line-clamp-2">
          {product.description}
        </p>
        {product.material && (
          <p className="text-xs text-accent font-medium mb-3 uppercase tracking-wide">
            {product.material}
          </p>
        )}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xl font-bold text-gradient-purple">
            ₹{product.price.toLocaleString()}
          </p>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};
