import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProductDetail } from "@/data/productDetails";
import { ShoppingCart } from "lucide-react";
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
  const navigate = useNavigate();
  const productDetail = getProductDetail(product.id);
  const hasDetailPage = productDetail !== null;

  const handleCardClick = () => {
    if (hasDetailPage) {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <Card
      className={`group overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 rounded-lg ${
        hasDetailPage ? 'cursor-pointer' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {product.brand && (
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              {product.brand}
            </p>
          )}
          
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
          
          {product.material && (
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {product.material}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.category && (
                <span className="text-xs text-gray-500 capitalize">
                  {product.category}
                </span>
              )}
            </div>
            
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="bg-gray-900 hover:bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

