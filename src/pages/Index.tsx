import { BrandCarousel } from "@/components/BrandCarousel";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MixedCollection } from "@/components/MixedCollection";
import { Product } from "@/components/ProductCard";
import { ProductSection } from "@/components/ProductSection";
import { ScrollingBanner } from "@/components/ScrollingBanner";
import { TailoringServiceForm } from "@/components/TailoringServiceForm";
import { brands, cottonProducts, ethnicProducts, trouserProducts } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { useMemo, useState } from "react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTailoringFormOpen, setIsTailoringFormOpen] = useState(false);
  const { toast } = useToast();

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
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const filterProducts = (products: Product[]) => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.material?.toLowerCase().includes(query)
    );
  };

  const filteredCotton = useMemo(() => filterProducts(cottonProducts), [searchQuery]);
  const filteredTrouser = useMemo(() => filterProducts(trouserProducts), [searchQuery]);
  const filteredEthnic = useMemo(() => filterProducts(ethnicProducts), [searchQuery]);

  // Create mixed collection with 8 random products from all collections
  const mixedProducts = useMemo(() => {
    const allProducts = [...cottonProducts, ...trouserProducts, ...ethnicProducts];
    const shuffled = allProducts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header cartItemCount={cartCount} onSearchChange={setSearchQuery} />
      <Hero />
      
      {/* Professional Content Wrapper */}
      <div className="relative bg-white">
        {/* Elegant Transition from Hero */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent via-white/50 to-white" />
        
        {/* Main Content Container */}
        <div className="relative z-10 space-y-12 sm:space-y-16 lg:space-y-20 py-8 sm:py-12">
          <ScrollingBanner onBannerClick={() => setIsTailoringFormOpen(true)} />
          
          <TailoringServiceForm 
            isOpen={isTailoringFormOpen}
            onClose={() => setIsTailoringFormOpen(false)}
          />
          
          {/* Featured Collection with Enhanced Styling */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-50 opacity-50" />
            <div className="relative z-10">
              <MixedCollection
                id="featured-collection"
                title="Featured Collection Highlights"
                subtitle="Explore our curated selection of premium fabrics from across all collections"
                products={mixedProducts}
              />
            </div>
          </section>
          
          {/* Shirt Fabrics Collection */}
          <section className="relative">
            <ProductSection
              id="cotton-collection"
              title="Premium Shirt Fabrics"
              subtitle="Discover premium shirt fabrics crafted from Egyptian Giza cotton, Italian cotton, and linen blends"
              products={filteredCotton}
              onAddToCart={handleAddToCart}
            />
            <div className="mt-8 sm:mt-12">
              <BrandCarousel brands={brands.cotton} />
            </div>
          </section>

          {/* Elegant Separator */}
          <div className="flex items-center justify-center py-6 sm:py-8">
            <div className="w-16 sm:w-20 lg:w-24 h-px bg-gray-300" />
            <div className="mx-3 sm:mx-4 w-2 sm:w-3 h-2 sm:h-3 bg-gray-800 rounded-full" />
            <div className="w-16 sm:w-20 lg:w-24 h-px bg-gray-300" />
          </div>

          {/* Trouser Collection */}
          <section className="relative">
            <div className="absolute inset-0 bg-gray-50 opacity-60 rounded-3xl" />
            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
              <ProductSection
                id="trouser-collection"
                title="Trouser Fabrics"
                subtitle="Refined selection of unstitched trouser fabrics perfect for formal and semi-casual styles"
                products={filteredTrouser}
                onAddToCart={handleAddToCart}
              />
              <div className="mt-12">
                <BrandCarousel brands={brands.trouser} />
              </div>
            </div>
          </section>

          {/* Elegant Separator */}
          <div className="flex items-center justify-center py-8">
            <div className="w-24 h-px bg-gray-300" />
            <div className="mx-4 w-3 h-3 bg-gray-800 rounded-full" />
            <div className="w-24 h-px bg-gray-300" />
          </div>

          {/* Ethnic Collection */}
          <section className="relative">
            <ProductSection
              id="ethnic-collection"
              title="Indo-Western"
              subtitle="Exclusive lineup of unstitched fabrics for Indo-Western, Modi jackets, Sherwanis, and Jodhpuri wear"
              products={filteredEthnic}
              onAddToCart={handleAddToCart}
            />
            <div className="mt-12">
              <BrandCarousel brands={brands.ethnic} />
            </div>
          </section>
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
