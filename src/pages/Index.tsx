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
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartCount} onSearchChange={setSearchQuery} />
      <Hero />
      
      <ScrollingBanner onBannerClick={() => setIsTailoringFormOpen(true)} />
      
      <TailoringServiceForm 
        isOpen={isTailoringFormOpen}
        onClose={() => setIsTailoringFormOpen(false)}
      />
      
      <MixedCollection
        id="featured-collection"
        title="Featured Collection Highlights"
        subtitle="Explore our curated selection of premium fabrics from across all collections"
        products={mixedProducts}
      />
      
      <ProductSection
        id="cotton-collection"
        title="Textured & Printed Cotton Collection"
        subtitle="Discover premium shirt fabrics crafted from Egyptian Giza cotton, Italian cotton, and linen blends"
        products={filteredCotton}
        onAddToCart={handleAddToCart}
      />

      <BrandCarousel brands={brands.cotton} />

      <ProductSection
        id="trouser-collection"
        title="Pants & Trouser Fabrics"
        subtitle="Refined selection of unstitched trouser fabrics perfect for formal and semi-casual styles"
        products={filteredTrouser}
        onAddToCart={handleAddToCart}
      />

      <BrandCarousel brands={brands.trouser} />

      <ProductSection
        id="ethnic-collection"
        title="Indo-Western & Ethnic Wear"
        subtitle="Exclusive lineup of unstitched fabrics for ethnic and contemporary men's wear"
        products={filteredEthnic}
        onAddToCart={handleAddToCart}
      />

      <BrandCarousel brands={brands.ethnic} />

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-3xl font-bold mb-4">The Coutures</h2>
          <p className="text-primary-foreground/80 mb-6 italic">
            Your Style, Our Signature
          </p>
          <p className="text-sm text-primary-foreground/60">
            © 2025 The Coutures. Premium Fabrics & Apparel.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
