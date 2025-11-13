import { Product, ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Filter, Search, X } from "lucide-react";
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit, DocumentData } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');

  const queryParam = searchParams.get('q') || '';
  const categories = ["Shirt Fabrics", "Trouser Fabrics", "Indo-Western"];

  useEffect(() => {
    if (queryParam.trim()) {
      performSearch(queryParam);
    }
  }, [queryParam, selectedCategory, selectedPriceRange]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const searchTerm = searchQuery.trim().toLowerCase();
      const productsRef = collection(firestore, "products");
      
      // Fetch active products and filter client-side for title search
      const q = query(
        productsRef,
        where("active", "==", true),
        orderBy("title"),
        limit(100)
      );

      const querySnapshot = await getDocs(q);
      const results: Product[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        const productTitle = (data.title as string) || "";
        
        // Check if title contains search term (case-insensitive)
        if (productTitle.toLowerCase().includes(searchTerm)) {
          results.push({
            id: doc.id,
            name: (data.title as string) || "",
            description: (data.description as string) || "",
            price: (data.variants?.[0]?.price as number) || 0,
            image: (data.variants?.[0]?.images?.[0] as string) || "",
            material: (data.material as string) || "",
            category: (data.category as string) || "",
          });
        }
      });

      // Apply filters
      let filteredResults = [...results];
      
      if (selectedCategory !== 'all') {
        filteredResults = filteredResults.filter(product => product.category === selectedCategory);
      }
      
      if (selectedPriceRange !== 'all') {
        const [min, max] = selectedPriceRange.split('-').map(Number);
        filteredResults = filteredResults.filter(product => {
          const price = product.price;
          if (max) {
            return price >= min && price <= max;
          } else {
            return price >= min; // For "5000+" range
          }
        });
      }

      setSearchResults(filteredResults);
      setRelatedProducts([]);
    } catch (error) {
      console.error("Error searching products:", error);
      toast({
        title: "Search Error",
        description: "Failed to search products. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedPriceRange('all');
  };

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

  const handleNewSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      // Update URL with new search query
      const newSearchParams = new URLSearchParams();
      newSearchParams.set('q', newQuery.trim());
      setSearchParams(newSearchParams);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-10 border-b border-purple-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="gap-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl px-4 py-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </Button>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={queryParam}
                  onChange={(e) => {
                    const newSearchParams = new URLSearchParams(searchParams);
                    if (e.target.value.trim()) {
                      newSearchParams.set('q', e.target.value.trim());
                    } else {
                      newSearchParams.delete('q');
                    }
                    setSearchParams(newSearchParams);
                  }}
                  placeholder="Search for fabrics..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Header with Filters */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Search Results
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {queryParam ? `Results for "${queryParam}"` : 'Enter a search term to find products'}
          </p>
          
          {/* Filter Toggle and Results Count */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            {searchResults.length > 0 && (
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg px-4 py-2">
                {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} found
              </Badge>
            )}
            {searchResults.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 hover:bg-purple-50 hover:border-purple-300"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            )}
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && searchResults.length > 0 && (
          <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Filter Results</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Price Range</label>
                  <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-1000">₹0 - ₹1,000</SelectItem>
                      <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                      <SelectItem value="2000-3000">₹2,000 - ₹3,000</SelectItem>
                      <SelectItem value="3000-5000">₹3,000 - ₹5,000</SelectItem>
                      <SelectItem value="5000">₹5,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {queryParam ? (
          <>
            {searchResults.length > 0 ? (
              <>
                {/* Main Search Results */}
                <section className="mb-16">
                  <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-8">
                    Search Results ({searchResults.length})
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
                    {searchResults.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </section>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-8">
                      Related Products ({relatedProducts.length})
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
                      {relatedProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : null}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Start Your Search
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Use the search bar above to find your perfect fabric from our extensive collection
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Premium Cotton', 'Silk Fabrics', 'Raymond Collection', 'Trouser Fabrics', 'Ethnic Wear'].map(suggestion => (
                <Button
                  key={suggestion}
                  variant="outline"
                  onClick={() => handleNewSearch(suggestion)}
                  className="hover:bg-purple-50 hover:border-purple-300"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;