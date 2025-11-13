import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCollectionBySlug, getCollectionById, getProductsByCollection, Collection, Product } from "@/lib/collectionService";
import { ProductCard } from "@/components/ProductCard";
import { Product as ProductCardType } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get cart count from localStorage
  const getCartItemCount = () => {
    try {
      const cart = localStorage.getItem("coutures-cart");
      if (cart) {
        const items = JSON.parse(cart);
        return items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      }
    } catch (e) {
      return 0;
    }
    return 0;
  };

  const [cartCount, setCartCount] = useState(getCartItemCount());

  useEffect(() => {
    const loadCollectionData = async () => {
      if (!slug) {
        navigate("/");
        return;
      }

      setLoading(true);
      try {
        // Try to fetch collection by slug first, then by ID
        let collectionData = await getCollectionBySlug(slug);
        
        // If not found by slug, try by ID
        if (!collectionData) {
          collectionData = await getCollectionById(slug);
        }
        
        if (!collectionData) {
          console.log("Collection not found for slug/id:", slug);
          toast({
            title: "Collection not found",
            description: "The collection you're looking for doesn't exist.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        console.log("Collection loaded:", collectionData);
        setCollection(collectionData);

        // Fetch products in this collection
        const productsData = await getProductsByCollection(collectionData.id);
        console.log("Products loaded:", productsData.length);
        setProducts(productsData);
      } catch (error) {
        console.error("Error loading collection:", error);
        toast({
          title: "Error",
          description: "Failed to load collection. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCollectionData();
  }, [slug, navigate, toast]);

  const handleAddToCart = (product: ProductCardType) => {
    try {
      const cartData = localStorage.getItem("coutures-cart");
      let cart = cartData ? JSON.parse(cartData) : [];
      
      const existing = cart.find((item: any) => item.id === product.id);
      if (existing) {
        cart = cart.map((item: any) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        toast({
          title: "Updated Cart",
          description: `${product.name} quantity increased`,
        });
      } else {
        cart.push({ ...product, quantity: 1 });
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart`,
        });
      }
      
      localStorage.setItem("coutures-cart", JSON.stringify(cart));
      setCartCount(getCartItemCount());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <Header cartItemCount={cartCount} onSearchChange={setSearchQuery} />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600">Loading collection...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <Header cartItemCount={cartCount} onSearchChange={setSearchQuery} />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover:bg-purple-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Collection Header */}
        <div className="mb-12 text-center">
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

          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-900 via-gray-800 to-purple-900 bg-clip-text text-transparent mb-4">
            {collection.name}
          </h1>
          
          {collection.description && (
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {collection.description}
            </p>
          )}

          {/* Product Count */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>{products.length} {products.length === 1 ? 'Product' : 'Products'} Available</span>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Products Yet</h3>
            <p className="text-gray-500">
              This collection is being updated with new products. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.title,
                    description: product.description || 'No description available',
                    price: product.variants[0]?.price || 0,
                    image: product.variants[0]?.images[0] || '',
                    material: product.material || 'Not specified',
                  }}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Enhanced Professional Footer */}
      <footer className="relative mt-20 overflow-hidden">
        {/* Footer Background */}
        <div className="absolute inset-0 bg-gray-900" />
        
        {/* Footer Content */}
        <div className="relative z-10 py-16">
          <div className="container mx-auto px-4 text-center">
            {/* Logo and Branding */}
            <div className="mb-8">
              <h2 className="font-playfair text-4xl font-bold mb-3 text-white">
                The Coutures
              </h2>
              <p className="text-white/90 text-xl italic tracking-wide">
                "your style, our signature"
              </p>
            </div>
            
            {/* Decorative Line */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-px bg-white/30" />
              <div className="mx-4 w-2 h-2 bg-white/50 rounded-full" />
              <div className="w-16 h-px bg-white/30" />
            </div>
            
            {/* Footer Info */}
            <div className="space-y-2">
              <p className="text-white/80 text-lg">
                Premium Fabrics & Luxury Apparel
              </p>
              <p className="text-white/60 text-sm">
                © 2025 The Coutures. Crafting Excellence Since Today.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
