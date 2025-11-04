import { ShareDialog } from "@/components/ShareDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProduct } from "@/contexts/ProductContext";
import { getProductDetail } from "@/data/productDetails";
import { ShoppingCart } from "lucide-react";
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
  const navigate = useNavigate();
  const { setSelectedProduct } = useProduct();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const productDetail = getProductDetail(product.id);
  const hasDetailPage = productDetail !== null;

  const handleCardClick = () => {
    if (hasDetailPage) {
      // Store the clicked product in context for consistency
      setSelectedProduct(product);
      navigate(`/product/${product.id}`);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareDialogOpen(true);
  };

  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    return hasDetailPage
      ? `${baseUrl}/product/${product.id}`
      : `${baseUrl}#${product.id}`;
  };

  return (
    <Card
      className={`group overflow-hidden border border-gray-200/80 bg-white hover:shadow-xl hover:border-primary/30 transition-all duration-300 rounded-lg ${
        hasDetailPage ? "cursor-pointer" : ""
      }`}
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-playfair font-bold text-sm sm:text-base text-gray-900 line-clamp-2 group-hover:text-primary transition-colors duration-300 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Brand & Material */}
          <div className="flex items-center gap-2 text-xs">
            {product.brand && (
              <span className="text-primary/80 font-semibold uppercase tracking-wide">
                {product.brand}
              </span>
            )}
            {product.material && (
              <>
                {product.brand && <span className="text-gray-300">•</span>}
                <span className="text-gray-500 uppercase">
                  {product.material}
                </span>
              </>
            )}
          </div>

          {/* Description - Desktop only */}
          <p className="text-xs text-gray-600 line-clamp-1 hidden sm:block leading-relaxed">
            {product.description}
          </p>

          <div className="h-2"></div>

          <div className="flex gap-4">
            {/* Price Section */}
            <div className="flex items-baseline justify-between border-t border-gray-100">
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
            </div>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-md transition-all duration-300 hover:shadow-md font-medium text-sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>

      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        url={getShareUrl()}
        title={`Check out this ${product.name}!`}
        description={`${product.description} - Premium quality fabric from The Coutures`}
      />
    </Card>
  );
};
