import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Product, ProductCard } from "@/components/ProductCard";
import { ScrollingBanner } from "@/components/ScrollingBanner";
import { TailoringServiceForm } from "@/components/TailoringServiceForm";
import { TailoringServiceSection } from "@/components/TailoringServiceSection";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Product as FirebaseProduct, getAllActiveProducts } from "@/lib/collectionService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Constants
const CATEGORIES = ["Shirt Fabrics", "Trouser Fabrics", "Indo-Western"];
const MAX_PRODUCTS_PER_CATEGORY = 8;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTailoringFormOpen, setIsTailoringFormOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
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
      // Show login prompt if user is not logged in
      setShowLoginPrompt(true);
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
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2 sm:space-y-3">
                          <Skeleton className="h-48 sm:h-80 w-full rounded-lg" />
                          <Skeleton className="h-3 sm:h-4 w-3/4" />
                          <Skeleton className="h-2 sm:h-3 w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : categoryProducts.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
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
              onBookService={handleOpenTailoringForm}
              category="ethnic"
            />
        </div>
      </div>

      <Footer />

      {/* Login Prompt Dialog */}
      <AlertDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-playfair flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Login Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base py-4">
              <div className="space-y-3">
                <p className="text-gray-700">
                  You need to sign in to book a tailoring appointment.
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-gray-800 font-medium mb-2">✨ Benefits of signing in:</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• Track your appointments</li>
                    <li>• Save your preferences</li>
                    <li>• Faster booking process</li>
                    <li>• View order history</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="m-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowLoginPrompt(false);
                navigate('/login');
              }}
              className="m-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Go to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
