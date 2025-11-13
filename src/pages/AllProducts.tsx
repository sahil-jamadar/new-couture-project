import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { ProductCard, Product } from "@/components/ProductCard";
import { getAllActiveProducts } from "@/lib/collectionService";
import { useToast } from "@/hooks/use-toast";

const AllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Cart count helper (same as other pages)
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
    const load = async () => {
      setLoading(true);
      try {
        const prods = await getAllActiveProducts();
        // Map remote product shape to ProductCard's expected shape (best-effort)
        const mapped = prods.map(p => ({
          id: p.id,
          title: p.title || p.name,
          name: p.name,
          description: p.description,
          variants: p.variants,
          price: p.price || p.basePrice,
          images: p.images,
          image: p.thumbnail || (p.images && p.images[0]) || '',
          material: p.material,
          collectionId: p.collectionId,
          active: p.active,
        })) as Product[];
        setProducts(mapped);
      } catch (error) {
        console.error("Error loading all products:", error);
        toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const handleAddToCart = (product: Product) => {
    try {
      const cartData = localStorage.getItem("coutures-cart");
      let cart = cartData ? JSON.parse(cartData) : [];

      const existing = cart.find((item: any) => item.id === product.id);
      if (existing) {
        cart = cart.map((item: any) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        toast({ title: "Updated Cart", description: `${product.title || product.name} quantity increased` });
      } else {
        cart.push({ ...product, quantity: 1 });
        toast({ title: "Added to Cart", description: `${product.title || product.name} added to cart` });
      }

      localStorage.setItem("coutures-cart", JSON.stringify(cart));
      setCartCount(getCartItemCount());
    } catch (e) {
      toast({ title: "Error", description: "Failed to add to cart", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header cartItemCount={cartCount} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-playfair text-3xl lg:text-4xl font-bold mb-6">All Products</h1>

        {loading ? (
          <p className="text-gray-600">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">There are no products to show right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((prod) => (
              <div key={prod.id} className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
                <ProductCard product={prod} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AllProducts;
