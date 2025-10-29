import { Product, ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cottonProducts, ethnicProducts, trouserProducts } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface BrandProduct extends Product {
  brand: string;
  category: string;
}

const BrandPage = () => {
  const navigate = useNavigate();
  const { brandName } = useParams<{ brandName: string }>();
  const { toast } = useToast();
  const [brandProducts, setBrandProducts] = useState<BrandProduct[]>([]);

  // Brand-specific product mappings
  const brandProductMapping: Record<string, BrandProduct[]> = {
    "Raymond": [
      {
        ...cottonProducts[1], // Denis Art White Edition
        brand: "Raymond",
        category: "Cotton",
        name: "Raymond Premium Cotton",
        description: "Premium Raymond cotton fabric with superior finish"
      },
      {
        ...trouserProducts[0], // Premium Wool Blend
        brand: "Raymond",
        category: "Trouser",
        name: "Raymond Wool Trouser",
        description: "Raymond's signature wool blend for formal trousers"
      },
      {
        ...ethnicProducts[0], // Silk Brocade Premium
        brand: "Raymond",
        category: "Ethnic",
        name: "Raymond Silk Brocade",
        description: "Luxurious Raymond silk brocade for ethnic wear"
      }
    ],
    "Arvind": [
      {
        ...cottonProducts[2], // Paper Cotton Textured
        brand: "Arvind",
        category: "Cotton",
        name: "Arvind Cotton Collection",
        description: "Arvind's innovative cotton fabric technology"
      },
      {
        ...trouserProducts[1], // Cotton Stretch Fabric
        brand: "Arvind",
        category: "Trouser",
        name: "Arvind Stretch Trouser",
        description: "Arvind's comfort-fit trouser fabric with stretch"
      }
    ],
    "Siyaram": [
      {
        ...cottonProducts[3], // Italian Cotton Dobby
        brand: "Siyaram",
        category: "Cotton",
        name: "Siyaram Dobby Collection",
        description: "Siyaram's premium dobby weave cotton fabric"
      },
      {
        ...ethnicProducts[1], // Handloom Cotton Khadi
        brand: "Siyaram",
        category: "Ethnic",
        name: "Siyaram Heritage Khadi",
        description: "Siyaram's traditional khadi with modern appeal"
      }
    ],
    "Grasim": [
      {
        ...cottonProducts[0], // 100% Linen-60 Lee
        brand: "Grasim",
        category: "Cotton",
        name: "Grasim Linen Premium",
        description: "Grasim's finest linen collection for comfort"
      }
    ],
    "Donear": [
      {
        ...trouserProducts[0],
        brand: "Donear",
        category: "Trouser",
        name: "Donear Premium Suiting",
        description: "Donear's premium suiting fabric collection"
      }
    ],
    "Digjam": [
      {
        ...ethnicProducts[0],
        brand: "Digjam",
        category: "Ethnic",
        name: "Digjam Designer Collection",
        description: "Digjam's contemporary ethnic wear fabrics"
      }
    ]
  };

  useEffect(() => {
    if (brandName) {
      const decodedBrandName = decodeURIComponent(brandName);
      const products = brandProductMapping[decodedBrandName] || [];
      setBrandProducts(products);
    }
  }, [brandName]);

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
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  if (!brandName) {
    return null;
  }

  const decodedBrandName = decodeURIComponent(brandName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-10 border-b border-purple-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="gap-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl px-4 py-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-playfair font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {decodedBrandName} Collection
              </h1>
              <p className="text-gray-600 mt-1">Premium fabrics by {decodedBrandName}</p>
            </div>
            <div className="w-32"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </div>

      {/* Brand Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
            Discover {decodedBrandName}
          </h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto opacity-90">
            Explore our curated collection of premium {decodedBrandName} fabrics, 
            crafted for excellence and designed for sophistication.
          </p>
          <Badge className="bg-white/20 text-white text-lg px-6 py-2">
            {brandProducts.length} Products Available
          </Badge>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-16">
        {brandProducts.length > 0 ? (
          <>
            {/* Category Sections */}
            {["Cotton", "Trouser", "Ethnic"].map(category => {
              const categoryProducts = brandProducts.filter(p => p.category === category);
              if (categoryProducts.length === 0) return null;

              return (
                <section key={category} className="mb-16">
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-playfair font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                      {decodedBrandName} {category} Collection
                    </h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Premium {category.toLowerCase()} fabrics featuring {decodedBrandName}'s signature quality and craftsmanship.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {categoryProducts.map((product) => (
                      <ProductCard
                        key={`${product.id}-${product.brand}`}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        ) : (
          <div className="text-center py-16">
            <Card className="max-w-md mx-auto border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-6">
                  We're currently updating our {decodedBrandName} collection. Please check back soon!
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Explore Other Brands
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Brand Information */}
        <div className="mt-20">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-playfair font-bold text-center mb-6 text-gray-800">
                About {decodedBrandName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Premium Quality</h4>
                  <p className="text-gray-600">
                    {decodedBrandName} is renowned for its exceptional fabric quality and attention to detail.
                  </p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Design Innovation</h4>
                  <p className="text-gray-600">
                    Cutting-edge designs that blend traditional craftsmanship with modern aesthetics.
                  </p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌟</span>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Trusted Heritage</h4>
                  <p className="text-gray-600">
                    Years of excellence in fabric manufacturing with a commitment to customer satisfaction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BrandPage;