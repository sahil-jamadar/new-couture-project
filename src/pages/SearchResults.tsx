import { Product, ProductCard } from "@/components/ProductCard";
import { SearchWithSuggestions } from "@/components/SearchWithSuggestions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cottonProducts, ethnicProducts, trouserProducts } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Filter, Search, X } from "lucide-react";
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const query = searchParams.get('q') || '';
  const searchType = searchParams.get('type') || '';
  const searchCategory = searchParams.get('category') || '';
  const allProducts = [...cottonProducts, ...trouserProducts, ...ethnicProducts];

  useEffect(() => {
    if (query.trim()) {
      performSearch(query, searchType, searchCategory);
    }
  }, [query, searchType, searchCategory, selectedBrand, selectedPriceRange, selectedMaterial, selectedCategory]);

  const performSearch = (searchQuery: string, type?: string, category?: string) => {
    const searchTerm = searchQuery.toLowerCase();
    let results = [];
    
    // Smart search based on type from suggestions
    if (type === 'brand') {
      results = allProducts.filter(product => 
        product.brand?.toLowerCase().includes(searchTerm) ||
        product.name.toLowerCase().includes(searchTerm) // fallback to name if no brand
      );
    } else if (type === 'material') {
      results = allProducts.filter(product => 
        product.material?.toLowerCase().includes(searchTerm)
      );
    } else if (type === 'category') {
      results = allProducts.filter(product => {
        const productCategory = getProductCategory(product);
        return productCategory.toLowerCase().includes(searchTerm);
      });
    } else {
      // General search across all fields
      results = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        (product.material?.toLowerCase().includes(searchTerm)) ||
        (product.brand?.toLowerCase().includes(searchTerm))
      );
    }

    // Apply additional filters
    if (selectedBrand !== 'all') {
      results = results.filter(product => product.brand === selectedBrand);
    }
    
    if (selectedMaterial !== 'all') {
      results = results.filter(product => product.material === selectedMaterial);
    }
    
    if (selectedPriceRange !== 'all') {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      results = results.filter(product => {
        const price = product.price;
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min; // For "500+" range
        }
      });
    }
    
    if (selectedCategory !== 'all') {
      results = results.filter(product => {
        const productCategory = getProductCategory(product);
        return productCategory === selectedCategory;
      });
    }

    // Related products - broader search for similar terms (only if not too many results)
    let related = [];
    if (results.length < 10) {
      const relatedTerms = searchTerm.split(' ');
      related = allProducts.filter(product => {
        if (results.some(p => p.id === product.id)) return false;
        
        return relatedTerms.some(term => 
          term.length > 2 && (
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            (product.material && product.material.toLowerCase().includes(term))
          )
        );
      });
    }

    setSearchResults(results);
    setRelatedProducts(related.slice(0, 8));
  };
  
  const getProductCategory = (product: Product) => {
    if (cottonProducts.includes(product)) return 'Cotton';
    if (trouserProducts.includes(product)) return 'Trouser';
    if (ethnicProducts.includes(product)) return 'Ethnic';
    return 'Other';
  };
  
  const clearFilters = () => {
    setSelectedBrand('all');
    setSelectedPriceRange('all');
    setSelectedMaterial('all');
    setSelectedCategory('all');
  };
  
  const uniqueBrands = [...new Set(allProducts.map(p => p.brand).filter(Boolean))] as string[];
  const uniqueMaterials = [...new Set(allProducts.map(p => p.material).filter(Boolean))] as string[];
  const categories = ['Cotton', 'Trouser', 'Ethnic'];

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
              <SearchWithSuggestions 
                onSearchChange={handleNewSearch}
                initialValue={query}
              />
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
            {query ? `Results for "${query}"` : 'Enter a search term to find products'}
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
          
          {/* Active Search Type Badge */}
          {searchType && (
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                Searching in: {searchType.charAt(0).toUpperCase() + searchType.slice(1)}s
                {searchCategory && ` (${searchCategory})`}
              </Badge>
            </div>
          )}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                {/* Brand Filter */}
                {uniqueBrands.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Brand</label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Brands" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        {uniqueBrands.map(brand => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Material Filter */}
                {uniqueMaterials.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Material</label>
                    <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Materials" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Materials</SelectItem>
                        {uniqueMaterials.map(material => (
                          <SelectItem key={material} value={material}>{material}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

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

        {query ? (
          <>
            {searchResults.length > 0 ? (
              <>
                {/* Main Search Results */}
                <section className="mb-16">
                  <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-8">
                    Search Results ({searchResults.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
            ) : (
              /* No Results */
              <div className="text-center py-16">
                <Card className="max-w-md mx-auto border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No Results Found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      We couldn't find any products matching "{query}". Try searching with different keywords.
                    </p>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500 font-medium">Search suggestions:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {['Cotton', 'Linen', 'Silk', 'Raymond', 'Trouser', 'Ethnic'].map(suggestion => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            onClick={() => handleNewSearch(suggestion)}
                            className="text-xs"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Search Tips */}
            <div className="mt-20">
              <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
                <CardContent className="p-8">
                  <h3 className="text-xl font-playfair font-bold text-center mb-6 text-gray-800">
                    Search Tips
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🔍</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">Product Names</h4>
                      <p className="text-gray-600 text-sm">
                        Search by specific product names like "Linen", "Cotton", or "Dobby"
                      </p>
                    </div>
                    <div>
                      <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🏷️</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">Brand Names</h4>
                      <p className="text-gray-600 text-sm">
                        Find products by brands like "Raymond", "Arvind", or "Siyaram"
                      </p>
                    </div>
                    <div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🧶</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">Materials</h4>
                      <p className="text-gray-600 text-sm">
                        Search by fabric types like "Silk", "Wool", or "Cotton Blend"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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