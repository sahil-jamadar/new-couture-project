import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { collection, query as firestoreQuery, where, getDocs, orderBy, limit, DocumentData } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

interface SearchSuggestionsProps {
  onSearchChange: (query: string) => void;
  initialValue?: string;
}

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'product';
  category?: string;
  price?: number;
  image?: string;
}

export const SearchWithSuggestions = ({ onSearchChange, initialValue = "" }: SearchSuggestionsProps) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      try {
        const searchTerm = query.trim();
        const searchTermLower = searchTerm.toLowerCase();
        const searchTermUpper = searchTerm.toUpperCase();
        const searchTermCapitalized = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1).toLowerCase();
        
                // Search for products where title starts with search term (case-insensitive approach)
        const productsRef = collection(firestore, "products");
        
        // We'll fetch active products and filter client-side for "startsWith" since Firestore doesn't support case-insensitive startsWith
        const q = firestoreQuery(
          productsRef,
          where("active", "==", true),
          orderBy("title"),
          limit(50)
        );

        const querySnapshot = await getDocs(q);
        const newSuggestions: SearchSuggestion[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as DocumentData;
          const productTitle = (data.title as string) || "";
          
          // Check if title starts with search term (case-insensitive)
          if (productTitle.toLowerCase().startsWith(searchTermLower)) {
            newSuggestions.push({
              id: doc.id,
              title: productTitle,
              type: 'product',
              category: (data.category as string) || "",
              price: (data.variants?.[0]?.price as number) || 0,
              image: (data.variants?.[0]?.images?.[0] as string) || ""
            });
          }
        });

        // Sort by title and limit to 8 suggestions
        const sortedSuggestions = newSuggestions
          .sort((a, b) => a.title.localeCompare(b.title))
          .slice(0, 8);

        setSuggestions(sortedSuggestions);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Error searching products:", error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchProducts();
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    onSearchChange(value);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    // Navigate directly to product page
    navigate(`/product/${suggestion.id}`);
  };

  const handleSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };



  const clearSearch = () => {
    setQuery("");
    onSearchChange("");
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <button
          onClick={handleSearch}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-black transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>
        <Input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          className="pl-5 pr-10 bg-white/90 backdrop-blur border-purple-200 focus:border-purple-400 focus:ring-purple-200 text-black"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 border-0 shadow-xl bg-white/95 backdrop-blur">
          <CardContent className="p-2">
            {isSearching ? (
              <div className="px-3 py-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-xs text-gray-500">Searching...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                        index === selectedIndex
                          ? 'bg-purple-100 text-purple-800'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {suggestion.image && (
                        <img 
                          src={suggestion.image} 
                          alt={suggestion.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800 truncate">
                            {suggestion.title}
                          </span>
                          {suggestion.category && (
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-blue-100 text-blue-700"
                            >
                              {suggestion.category}
                            </Badge>
                          )}
                        </div>
                        {suggestion.price > 0 && (
                          <p className="text-sm text-gray-600">
                            ₹{suggestion.price.toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="border-t mt-2 pt-2">
                  <div className="text-xs text-gray-500 px-3 py-1">
                    {suggestions.length} product{suggestions.length !== 1 ? 's' : ''} found
                  </div>
                </div>
              </>
            ) : query.length >= 2 ? (
              <div className="px-3 py-4 text-center">
                <p className="text-sm text-gray-500">No products found</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
};