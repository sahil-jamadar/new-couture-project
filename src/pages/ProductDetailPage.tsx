import { Header } from "@/components/Header";
import { ShareDialog } from "@/components/ShareDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ColorVariant, getProductDetail } from "@/data/productDetails";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { productId } = useParams<{ productId: string }>();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

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

  useEffect(() => {
    if (productId) {
      const productDetail = getProductDetail(productId);
      if (productDetail) {
        setProduct(productDetail);
        // Set first available color as default
        const firstAvailableColor = productDetail.colorVariants.find(
          (v) => v.inStock
        );
        if (firstAvailableColor) {
          setSelectedColor(firstAvailableColor.id);
        }
      } else {
        // Redirect to home if product not found
        navigate("/");
      }
    }
  }, [productId, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  const selectedVariant =
    product.colorVariants.find((v: ColorVariant) => v.id === selectedColor) ||
    product.colorVariants[0];

  const handleAddToCart = () => {
    // Add a loading state for better UX
    const cartProduct = {
      id: `${product.id}-${selectedColor}`,
      name: `${product.name} - ${selectedVariant.name}`,
      description: product.subtitle,
      price: selectedVariant.price,
      image: selectedVariant.image,
      material: product.material,
      quantity: quantity,
    };

    try {
      const cartData = localStorage.getItem("coutures-cart");
      let cart = cartData ? JSON.parse(cartData) : [];

      const existing = cart.find((item: any) => item.id === cartProduct.id);
      if (existing) {
        cart = cart.map((item: any) =>
          item.id === cartProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast({
          title: "🛒 Cart Updated!",
          description: `${cartProduct.name} quantity increased to ${
            existing.quantity + quantity
          } meters`,
        });
      } else {
        cart.push(cartProduct);
        toast({
          title: "✅ Added to Cart!",
          description: `${cartProduct.name} (${quantity} ${
            quantity === 1 ? "meter" : "meters"
          }) added successfully`,
        });
      }

      localStorage.setItem("coutures-cart", JSON.stringify(cart));

      // Add a small celebration effect
      const button = document.querySelector(
        "[data-cart-button]"
      ) as HTMLElement;
      if (button) {
        button.style.transform = "scale(0.95)";
        setTimeout(() => {
          button.style.transform = "scale(1)";
        }, 150);
      }
    } catch (e) {
      toast({
        title: "❌ Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareClick = () => {
    setIsShareDialogOpen(true);
  };

  const getShareUrl = () => {
    return window.location.href;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Navigation Header */}
      <Header cartItemCount={getCartItemCount()} />

      {/* Product Breadcrumb */}
      <div className="bg-card/95 backdrop-blur-md shadow-lg border-b border-border mt-16">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-xl px-4 py-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Collection
            </Button>
            <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Product Details
              </span>
              <div className="w-4 h-0.5 bg-border"></div>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                Choose Color
              </span>
              <div className="w-4 h-0.5 bg-border"></div>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                Add to Cart
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Estimated Total</p>
              <p className="font-bold text-lg text-gradient-purple">
                ₹{(selectedVariant.price * quantity).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Section */}
          <div className="space-y-6">
            {/* Main Product Image with Enhanced Design */}
            <Card className="overflow-hidden border-0 shadow-elegant bg-gradient-card">
              <div className="aspect-square bg-gradient-hero p-8 relative">
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-premium text-primary-foreground">
                    {selectedVariant.name}
                  </Badge>
                </div>
                <img
                  src={selectedVariant.image}
                  alt={`${product.name} in ${selectedVariant.name}`}
                  className="w-full h-full object-cover rounded-xl shadow-lg transition-all duration-500 hover:scale-105"
                />
                {!selectedVariant.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                    <Badge variant="destructive" className="text-lg py-2 px-4">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Enhanced Color Selection Grid */}
            <Card className="border-0 shadow-elegant bg-card/90 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-foreground">
                  Choose Your Color (
                  {
                    product.colorVariants.filter((v: ColorVariant) => v.inStock)
                      .length
                  }{" "}
                  Available)
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {product.colorVariants.map((variant: ColorVariant) => (
                    <div key={variant.id} className="text-center">
                      <button
                        onClick={() => setSelectedColor(variant.id)}
                        disabled={!variant.inStock}
                        className={`relative w-full aspect-square rounded-xl overflow-hidden border-3 transition-all duration-300 ${
                          selectedColor === variant.id
                            ? "border-purple-500 ring-4 ring-purple-200 scale-105 shadow-xl"
                            : "border-gray-200 hover:border-purple-300 hover:scale-102 hover:shadow-lg"
                        } ${
                          !variant.inStock
                            ? "opacity-50 cursor-not-allowed grayscale"
                            : ""
                        }`}
                      >
                        <img
                          src={variant.image}
                          alt={variant.name}
                          className="w-full h-full object-cover transition-transform duration-300"
                        />
                        {selectedColor === variant.id && (
                          <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                            </div>
                          </div>
                        )}
                        {!variant.inStock && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              OUT
                            </span>
                          </div>
                        )}
                      </button>
                      <p
                        className={`text-sm mt-2 font-medium ${
                          selectedColor === variant.id
                            ? "text-primary"
                            : "text-muted-foreground"
                        } ${
                          !variant.inStock ? "text-muted-foreground/50" : ""
                        }`}
                      >
                        {variant.name}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Product Details */}
          <div className="space-y-8">
            {/* Product Header */}
            <div className="bg-gradient-accent p-6 rounded-2xl">
              <Badge
                variant="secondary"
                className="mb-3 bg-secondary text-secondary-foreground px-3 py-1"
              >
                {product.material}
              </Badge>
              <h1 className="text-4xl font-playfair font-bold text-gradient-purple mb-3">
                {product.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                {product.subtitle}
              </p>
              <p className="text-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Selected Color Display */}
            <Card className="border-0 shadow-elegant bg-gradient-card">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-foreground">
                  Selected Option:
                </h3>
                <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-sm border border-border">
                  <div className="w-16 h-16 rounded-xl border-3 border-primary/30 overflow-hidden shadow-md">
                    <img
                      src={selectedVariant.image}
                      alt={selectedVariant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-lg text-foreground">
                      {selectedVariant.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedVariant.inStock ? (
                        <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                          ✓ In Stock
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-gradient-purple">
                      ₹{selectedVariant.price.toLocaleString()}
                    </span>
                    <p className="text-muted-foreground text-sm">per meter</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Quantity Selector */}
            <Card className="border-0 shadow-elegant">
              <CardContent className="p-6">
                <label className="block font-semibold text-lg mb-4 text-foreground">
                  Quantity (meters):
                </label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-12 w-12 rounded-xl border-2 hover:border-primary/30 hover:bg-accent"
                  >
                    -
                  </Button>
                  <div className="flex-1 max-w-[120px]">
                    <div className="bg-gradient-accent border-2 border-primary/20 rounded-xl px-6 py-3 text-center">
                      <span className="text-2xl font-bold text-primary">
                        {quantity}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12 rounded-xl border-2 hover:border-primary/30 hover:bg-accent"
                  >
                    +
                  </Button>
                  <div className="ml-4 text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ₹{(selectedVariant.price * quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Add to Cart Section */}
            <Card className="border-0 shadow-premium bg-gradient-premium text-primary-foreground">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant.inStock}
                    data-cart-button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-foreground hover:bg-background/90 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <ShoppingCart className="mr-3 h-6 w-6" />
                    Add to Cart - ₹
                    {(selectedVariant.price * quantity).toLocaleString()}
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="py-3 px-4 bg-background/10 border border-background/30 text-foreground/80 
             hover:bg-gray-100 hover:border-gray-300 hover:text-foreground 
             dark:hover:bg-white/10 dark:hover:border-white/20 dark:hover:text-white 
             transition-all duration-200 rounded-xl"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Button>
                    <Button
                      onClick={handleShareClick}
                      variant="outline"
                      className="py-3 px-4 bg-background/10 border border-background/30 text-foreground/80 
             hover:bg-gray-100 hover:border-gray-300 hover:text-foreground 
             dark:hover:bg-white/10 dark:hover:border-white/20 dark:hover:text-white 
             transition-all duration-200 rounded-xl"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                  {!selectedVariant.inStock && (
                    <div className="bg-destructive/20 border border-destructive/30 rounded-xl p-4 text-center">
                      <p className="font-medium text-primary-foreground">
                        This color is currently out of stock
                      </p>
                      <p className="text-sm opacity-90 text-primary-foreground">
                        Please select another color option
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Product Specifications */}
            <Card className="border-0 shadow-elegant bg-gradient-accent">
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-6 text-foreground">
                  Product Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card p-4 rounded-xl shadow-sm border border-border">
                    <span className="font-medium text-primary text-sm uppercase tracking-wide">
                      Material
                    </span>
                    <p className="text-foreground font-semibold text-lg">
                      {product.material}
                    </p>
                  </div>
                  <div className="bg-card p-4 rounded-xl shadow-sm border border-border">
                    <span className="font-medium text-primary text-sm uppercase tracking-wide">
                      Weight
                    </span>
                    <p className="text-foreground font-semibold text-lg">
                      {product.weight}
                    </p>
                  </div>
                  <div className="bg-card p-4 rounded-xl shadow-sm border border-border">
                    <span className="font-medium text-primary text-sm uppercase tracking-wide">
                      Width
                    </span>
                    <p className="text-foreground font-semibold text-lg">
                      {product.width}
                    </p>
                  </div>
                  <div className="bg-card p-4 rounded-xl shadow-sm border border-border">
                    <span className="font-medium text-primary text-sm uppercase tracking-wide">
                      Care Instructions
                    </span>
                    <p className="text-foreground font-semibold text-sm leading-relaxed">
                      {product.care}
                    </p>
                  </div>
                </div>
                <div className="mt-6 bg-card p-4 rounded-xl shadow-sm border border-border">
                  <span className="font-medium text-primary text-sm uppercase tracking-wide block mb-3">
                    Key Features
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature, index) => (
                      <Badge
                        key={index}
                        className="bg-secondary text-secondary-foreground border-border px-3 py-1"
                      >
                        ✓ {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-elegant bg-gradient-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚚</span>
              </div>
              <h4 className="font-semibold text-lg text-foreground mb-2">
                Free Delivery
              </h4>
              <p className="text-muted-foreground text-sm">
                Free shipping on orders above ₹2000
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-elegant bg-gradient-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔄</span>
              </div>
              <h4 className="font-semibold text-lg text-foreground mb-2">
                Easy Returns
              </h4>
              <p className="text-muted-foreground text-sm">
                7-day hassle-free return policy
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-elegant bg-gradient-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⭐</span>
              </div>
              <h4 className="font-semibold text-lg text-foreground mb-2">
                Premium Quality
              </h4>
              <p className="text-muted-foreground text-sm">
                Certified premium fabrics
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {product && (
        <ShareDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          url={getShareUrl()}
          title={`Check out this ${product.name}!`}
          description={`${product.subtitle} - Premium quality fabric from The Coutures`}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
