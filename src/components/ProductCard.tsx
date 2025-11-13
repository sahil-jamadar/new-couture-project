import { ShareDialog } from "@/components/ShareDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProduct } from "@/contexts/ProductContext";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface ProductVariant {
  color: string;
  price: number;
  stock: number;
  images: string[];
}

export interface Product {
  id: string;
  
  // New variant-based structure
  title?: string;
  variants?: ProductVariant[];
  
  // Old structure (backward compatibility)
  name?: string;
  price?: number;
  image?: string;
  images?: string[];
  color?: string;
  
  // Common fields
  description?: string;  // Make description optional for safety
  material?: string;
  brand?: string;
  category?: string;
  collectionId?: string;
  active?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();
  const { setSelectedProduct } = useProduct();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  // Helper: Check if product uses new variant format
  const hasVariants = !!(product.variants && product.variants.length > 0);
  
  // Get product name (new format uses 'title', old format uses 'name')
  const productName = product.title || product.name || 'Untitled Product';

  console.log("Product details card", product);
  
  
  // Get product description
  const productDescription = product.description || 'Premium quality product';
  
  // Get first/display image (always use first variant's first image for consistency)
  const displayImage = hasVariants && product.variants && product.variants[0]?.images?.length > 0
    ? product.variants[0].images[0]
    : product.image || product.images?.[0] || '';
  
  // Get first variant's price as the display price (for new format)
  const firstVariantPrice = hasVariants && product.variants && product.variants[0]
    ? product.variants[0].price
    : null;
  
  // Get price (show range for variants with different prices, single price otherwise)
  const priceDisplay = hasVariants && product.variants
    ? (() => {
        const prices = product.variants.map(v => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return minPrice === maxPrice ? minPrice : null; // null means show range
      })()
    : product.price || 0;
  
  const priceRange = hasVariants && product.variants && priceDisplay === null
    ? {
        min: Math.min(...product.variants.map(v => v.price)),
        max: Math.max(...product.variants.map(v => v.price))
      }
    : null;
  
  // Get material (could be from product or first variant color name as fallback)
  const displayMaterial = product.material || (hasVariants && product.variants?.[0]?.color);

  // Debug logging
  console.log("ProductCard - Product:", product.id);
  console.log("ProductCard - Name:", productName);
  console.log("ProductCard - Display Image:", displayImage);
  console.log("ProductCard - Has Variants:", hasVariants);
  if (hasVariants) {
    console.log("ProductCard - Variants:", product.variants);
  }

  const handleCardClick = () => {
    // Always navigate to the product detail page
    // Store the clicked product in context for consistency
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareDialogOpen(true);
  };


  return (
    <Card
      className="group overflow-hidden border border-gray-200/80 bg-white hover:shadow-xl hover:border-primary/30 transition-all duration-300 rounded-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
        {displayImage ? (
          <img
            src={displayImage}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              console.error("Image failed to load:", displayImage);
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100"><span class="text-6xl">🎨</span></div>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
            <span className="text-6xl">🎨</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Variant indicator badge */}
        {hasVariants && product.variants && product.variants.length > 1 && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
            {product.variants.length} colors
          </div>
        )}
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-playfair font-bold text-sm sm:text-base text-gray-900 line-clamp-2 group-hover:text-primary transition-colors duration-300 min-h-[2.5rem]">
            {productName}
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
          {/* <p className="text-xs text-gray-600 line-clamp-1 hidden sm:block leading-relaxed">
            {product.description}
          </p> */}

          <div className="flex gap-4 items-center">
            {/* Price Section */}
            <div className="flex items-baseline justify-between flex-1">
              <div className="flex flex-col py-2">
                {priceRange ? (
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    ₹{priceRange.min.toLocaleString()} - ₹{priceRange.max.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    ₹{priceDisplay?.toLocaleString() || '0'}
                  </span>
                )}
                {product.category && (
                  <span className="text-xs text-gray-500 capitalize">
                    {product.category}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart: icon-only on small screens, full text on sm+ */}
            <div className="flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-md bg-gray-900 text-white hover:bg-black transition-colors"
                aria-label="Add to cart"
                title="Add to cart"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-black text-white rounded-md transition-colors font-medium text-sm"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </CardContent>

    </Card>
  );
};
