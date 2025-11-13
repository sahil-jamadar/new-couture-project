import { Header } from "@/components/Header";
import { ProductCard, Product } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllActiveProducts, Product as FirebaseProduct } from "@/lib/collectionService";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CategoryProducts = () => {
  const { category } = useParams<{ category: string }>();
  const [allProducts, setAllProducts] = useState<FirebaseProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Category mapping
  const categoryMapping: { [key: string]: string } = {
    "shirt-fabrics": "Shirt Fabrics",
    "trouser-fabrics": "Trouser Fabrics",
    "indo-western": "Indo-Western",
  };

  const displayCategory = categoryMapping[category || ""] || category || "";

  // Load all products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getAllActiveProducts();
        setAllProducts(products);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Update cart count
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

  useEffect(() => {
    setCartCount(getCartItemCount());
  }, []);

  // Filter products by category
  const categoryProducts = useMemo(() => {
    return allProducts
      .filter(p => p.category === displayCategory)
      .map(p => ({
        id: p.id,
        name: p.title || 'Untitled Product',
        description: p.description || 'No description available',
        price: p.variants[0]?.price || 0,
        image: p.variants[0]?.images[0] || '',
        material: p.material || 'Not specified',
        category: p.category,
      }));
  }, [allProducts, displayCategory]);

  const handleAddToCart = (product: Product) => {
    try {
      const firebaseProduct = allProducts.find(p => p.id === product.id);
      
      if (!firebaseProduct) {
        toast({
          title: "Error",
          description: "Product details not available. Please try from product page.",
          variant: "destructive",
        });
        return;
      }
      
      const hasVariants = firebaseProduct.variants && firebaseProduct.variants.length > 0;
      
      if (hasVariants && firebaseProduct.variants) {
        const firstVariant = firebaseProduct.variants[0];
        
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
        
        const cartData = localStorage.getItem("coutures-cart");
        let cart = cartData ? JSON.parse(cartData) : [];
        
        const existing = cart.find((item: any) => item.id === cartProduct.id);
        if (existing) {
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
          cart.push(cartProduct);
          toast({
            title: "✓ Added to Cart",
            description: `${cartProduct.name} added successfully`,
          });
        }
        
        localStorage.setItem("coutures-cart", JSON.stringify(cart));
        setCartCount(getCartItemCount());
      } else {
        toast({
          title: "Notice",
          description: "Please add this item from the product detail page to select color",
        });
        navigate(`/product/${product.id}`);
      }
    } catch (e) {
      console.error("Error adding to cart:", e);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header cartItemCount={cartCount} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        {/* Category Header */}
        <div className="mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {displayCategory}
          </h1>
          <p className="text-gray-600 text-lg">
            Explore our premium collection of {displayCategory.toLowerCase()}
          </p>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-80 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No products found in this category
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative mt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gray-900" />
        <div className="relative z-10 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-8">
              <h2 className="font-playfair text-4xl font-bold mb-3 text-white">
                The Coutures
              </h2>
              <p className="text-white/90 text-xl italic tracking-wide">
                "your style, our signature"
              </p>
            </div>
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-px bg-white/30" />
              <div className="mx-4 w-2 h-2 bg-white/50 rounded-full" />
              <div className="w-16 h-px bg-white/30" />
            </div>
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

export default CategoryProducts;
