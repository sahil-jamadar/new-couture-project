import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard, Product } from "@/components/ProductCard";
import { ScrollingBanner } from "@/components/ScrollingBanner";
import { TailoringServiceForm } from "@/components/TailoringServiceForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getAllActiveProducts, Product as FirebaseProduct } from "@/lib/collectionService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TailoringServiceSection } from "@/components/TailoringServiceSection";

// Constants
const CATEGORIES = ["Shirt Fabrics", "Trouser Fabrics", "Indo-Western"];
const MAX_PRODUCTS_PER_CATEGORY = 8;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTailoringFormOpen, setIsTailoringFormOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<FirebaseProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const { toast } = useToast();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Load all products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getAllActiveProducts();
        console.log("Loaded products from Firebase:", products);
        setAllProducts(products);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleOpenTailoringForm = () => {
    if (authLoading) {
      // Don't do anything while auth is loading
      return;
    }
    
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to book a tailoring service",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    setIsTailoringFormOpen(true);
  };

  // Get cart from localStorage to display count
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

  const handleAddToCart = (product: Product) => {
    try {
      console.log("\n🛒 [Index] Adding item to cart:", product);
      
      // Get the Firebase product to access variants
      const firebaseProduct = allProducts.find(p => p.id === product.id);
      console.log("   - Firebase product found:", !!firebaseProduct);
      
      if (!firebaseProduct) {
        console.warn("⚠️ Product not found in Firebase products list");
        toast({
          title: "Error",
          description: "Product details not available. Please try from product page.",
          variant: "destructive",
        });
        return;
      }
      
      // Check if product has variants
      const hasVariants = firebaseProduct.variants && firebaseProduct.variants.length > 0;
      console.log("   - Has variants:", hasVariants);
      
      if (hasVariants && firebaseProduct.variants) {
        console.log("   - Available variants:", firebaseProduct.variants.map(v => `${v.color} (stock: ${v.stock})`));
        
        // Use first variant by default
        const firstVariant = firebaseProduct.variants[0];
        console.log("   - Using first variant:", firstVariant.color);
        
        const cartProduct = {
          id: `${product.id}-${firstVariant.color}`,
          productId: product.id,
          name: `${product.name} - ${firstVariant.color}`,
          description: product.description,
          price: firstVariant.price,
          image: firstVariant.images[0] || product.image,
          material: product.material,
          quantity: 1,
          color: firstVariant.color,
        };
        
        console.log("   - Cart product:", cartProduct);
        
        const cartData = localStorage.getItem("coutures-cart");
        let cart = cartData ? JSON.parse(cartData) : [];
        
        const existing = cart.find((item: any) => item.id === cartProduct.id);
        if (existing) {
          console.log("✓ Item already in cart, updating quantity");
          cart = cart.map((item: any) =>
            item.id === cartProduct.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          toast({
            title: "✓ Cart Updated",
            description: `${cartProduct.name} quantity increased`,
          });
        } else {
          console.log("✓ Adding new item to cart");
          cart.push(cartProduct);
          toast({
            title: "✓ Added to Cart",
            description: `${cartProduct.name} added successfully`,
          });
        }
        
        localStorage.setItem("coutures-cart", JSON.stringify(cart));
        console.log("✅ Cart saved. Total items:", cart.length);
        setCartCount(getCartItemCount());
      } else {
        console.warn("⚠️ Product has no variants - this shouldn't happen with new structure");
        toast({
          title: "Notice",
          description: "Please add this item from the product detail page to select color",
        });
        // Navigate to product page instead
        navigate(`/product/${product.id}`);
      }
    } catch (e) {
      console.error("❌ Error adding to cart:", e);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  // Filter products by category with limit
  const getProductsByCategory = (category: string) => {
    return allProducts
      .filter(p => p.category === category)
      .slice(0, MAX_PRODUCTS_PER_CATEGORY)
      .map(p => ({
        id: p.id,
        name: p.title || 'Untitled Product',
        description: p.description || 'No description available',
        price: p.variants[0]?.price || 0,
        image: p.variants[0]?.images[0] || '',
        material: p.material || 'Not specified',
        category: p.category,
      }));
  };

  const getCategoryUrl = (category: string) => {
    return `/category/${category.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header cartItemCount={cartCount} onSearchChange={setSearchQuery} />
      <Hero />
      
      {/* Professional Content Wrapper */}
      <div className="relative bg-white">
        {/* Elegant Transition from Hero */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent via-white/50 to-white" />
        
        {/* Professional Announcement Banner */}
        <div className="relative z-20 -mt-12">
          <ScrollingBanner onBannerClick={handleOpenTailoringForm} />
        </div>
        
        {/* Main Content Container */}
        <div className="relative z-10 space-y-2 sm:space-y-2 lg:space-y-2 pt-8">
          <TailoringServiceForm 
            isOpen={isTailoringFormOpen}
            onClose={() => setIsTailoringFormOpen(false)}
          />
          
          {/* Category Sections */}
          {CATEGORIES.map((category) => {
            const categoryProducts = getProductsByCategory(category);
            
            return (
              <section key={category} className="relative overflow-hidden py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-wide">
                        {category}
                      </h2>
                      <p className="text-gray-600 mt-2">Explore our premium collection</p>
                    </div>
                    {categoryProducts.length > 0 && (
                      <Button
                        onClick={() => navigate(getCategoryUrl(category))}
                        variant="outline"
                        className="hidden sm:flex"
                      >
                        View All
                      </Button>
                    )}
                  </div>

                  {/* Products Grid */}
                  {productsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-3">
                          <Skeleton className="h-80 w-full rounded-lg" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : categoryProducts.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        {categoryProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                          />
                        ))}
                      </div>
                      {/* Mobile View All Button */}
                      <div className="sm:hidden mt-8 text-center">
                        <Button
                          onClick={() => navigate(getCategoryUrl(category))}
                          variant="outline"
                          className="w-full max-w-xs"
                        >
                          View All {category}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No products available in this category</p>
                    </div>
                  )}
                </div>
              </section>
            );
          })}

          {/* Premium Tailoring Service */}
            <TailoringServiceSection 
              onBookService={() => setIsTailoringFormOpen(true)}
              category="ethnic"
            />
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
};

export default Index;
