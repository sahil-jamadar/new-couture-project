import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ColorVariant, getProductDetail } from "@/data/productDetails";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { productId } = useParams<{ productId: string }>();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (productId) {
      const productDetail = getProductDetail(productId);
      if (productDetail) {
        setProduct(productDetail);
        // Set first available color as default
        const firstAvailableColor = productDetail.colorVariants.find(v => v.inStock);
        if (firstAvailableColor) {
          setSelectedColor(firstAvailableColor.id);
        }
      } else {
        // Redirect to home if product not found
        navigate('/');
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

  const selectedVariant = product.colorVariants.find((v: ColorVariant) => v.id === selectedColor) || product.colorVariants[0];

  const handleAddToCart = () => {
    // Add a loading state for better UX
    const cartProduct = {
      id: `${product.id}-${selectedColor}`,
      name: `${product.name} - ${selectedVariant.name}`,
      description: product.subtitle,
      price: selectedVariant.price,
      image: selectedVariant.image,
      material: product.material,
      quantity: quantity
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
          description: `${cartProduct.name} quantity increased to ${existing.quantity + quantity} meters`,
        });
      } else {
        cart.push(cartProduct);
        toast({
          title: "✅ Added to Cart!",
          description: `${cartProduct.name} (${quantity} ${quantity === 1 ? 'meter' : 'meters'}) added successfully`,
        });
      }
      
      localStorage.setItem("coutures-cart", JSON.stringify(cart));
      
      // Add a small celebration effect
      const button = document.querySelector('[data-cart-button]') as HTMLElement;
      if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-10 border-b border-purple-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="gap-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl px-4 py-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Collection
            </Button>
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Product Details
              </span>
              <div className="w-4 h-0.5 bg-gray-300"></div>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                Choose Color
              </span>
              <div className="w-4 h-0.5 bg-gray-300"></div>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                Add to Cart
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Estimated Total</p>
              <p className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
            <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
              <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 p-8 relative">
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
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
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  Choose Your Color ({product.colorVariants.filter((v: ColorVariant) => v.inStock).length} Available)
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {product.colorVariants.map((variant: ColorVariant) => (
                    <div key={variant.id} className="text-center">
                      <button
                        onClick={() => setSelectedColor(variant.id)}
                        disabled={!variant.inStock}
                        className={`relative w-full aspect-square rounded-xl overflow-hidden border-3 transition-all duration-300 ${
                          selectedColor === variant.id
                            ? 'border-purple-500 ring-4 ring-purple-200 scale-105 shadow-xl'
                            : 'border-gray-200 hover:border-purple-300 hover:scale-102 hover:shadow-lg'
                        } ${!variant.inStock ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
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
                            <span className="text-white text-xs font-bold">OUT</span>
                          </div>
                        )}
                      </button>
                      <p className={`text-sm mt-2 font-medium ${
                        selectedColor === variant.id ? 'text-purple-600' : 'text-gray-600'
                      } ${!variant.inStock ? 'text-gray-400' : ''}`}>
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
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
              <Badge variant="secondary" className="mb-3 bg-purple-100 text-purple-700 px-3 py-1">
                {product.material}
              </Badge>
              <h1 className="text-4xl font-playfair font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{product.subtitle}</p>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Selected Color Display */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-purple-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Selected Option:</h3>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-16 h-16 rounded-xl border-3 border-purple-300 overflow-hidden shadow-md">
                    <img src={selectedVariant.image} alt={selectedVariant.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-lg text-gray-800">{selectedVariant.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedVariant.inStock ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">✓ In Stock</Badge>
                      ) : (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ₹{selectedVariant.price.toLocaleString()}
                    </span>
                    <p className="text-gray-500 text-sm">per meter</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Quantity Selector */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <label className="block font-semibold text-lg mb-4">Quantity (meters):</label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-12 w-12 rounded-xl border-2 hover:border-purple-300 hover:bg-purple-50"
                  >
                    -
                  </Button>
                  <div className="flex-1 max-w-[120px]">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl px-6 py-3 text-center">
                      <span className="text-2xl font-bold text-purple-600">{quantity}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12 rounded-xl border-2 hover:border-purple-300 hover:bg-purple-50"
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
            <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant.inStock}
                    data-cart-button
                    className="w-full bg-white text-purple-600 hover:bg-gray-50 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <ShoppingCart className="mr-3 h-6 w-6" />
                    Add to Cart - ₹{(selectedVariant.price * quantity).toLocaleString()}
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="py-3 bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Button>
                    <Button 
                      variant="outline" 
                      className="py-3 bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl"
                    >
                      Share
                    </Button>
                  </div>
                  {!selectedVariant.inStock && (
                    <div className="bg-red-500/20 border border-red-300 rounded-xl p-4 text-center">
                      <p className="font-medium">This color is currently out of stock</p>
                      <p className="text-sm opacity-90">Please select another color option</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Product Specifications */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-purple-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-6 text-gray-800">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <span className="font-medium text-purple-600 text-sm uppercase tracking-wide">Material</span>
                    <p className="text-gray-800 font-semibold text-lg">{product.material}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <span className="font-medium text-purple-600 text-sm uppercase tracking-wide">Weight</span>
                    <p className="text-gray-800 font-semibold text-lg">{product.weight}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <span className="font-medium text-purple-600 text-sm uppercase tracking-wide">Width</span>
                    <p className="text-gray-800 font-semibold text-lg">{product.width}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <span className="font-medium text-purple-600 text-sm uppercase tracking-wide">Care Instructions</span>
                    <p className="text-gray-800 font-semibold text-sm leading-relaxed">{product.care}</p>
                  </div>
                </div>
                <div className="mt-6 bg-white p-4 rounded-xl shadow-sm">
                  <span className="font-medium text-purple-600 text-sm uppercase tracking-wide block mb-3">Key Features</span>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature, index) => (
                      <Badge 
                        key={index} 
                        className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 px-3 py-1"
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
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚚</span>
              </div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Free Delivery</h4>
              <p className="text-gray-600 text-sm">Free shipping on orders above ₹2000</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔄</span>
              </div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Easy Returns</h4>
              <p className="text-gray-600 text-sm">7-day hassle-free return policy</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⭐</span>
              </div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Premium Quality</h4>
              <p className="text-gray-600 text-sm">Certified premium fabrics</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
