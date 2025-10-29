import { Product } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cottonProducts, ethnicProducts, trouserProducts } from "@/data/products";
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";

interface SearchSuggestionsProps {
  onSearchChange: (query: string) => void;
  initialValue?: string;
}

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'product' | 'material' | 'brand' | 'category';
  category?: string;
  product?: Product;
}

export const SearchWithSuggestions = ({ onSearchChange, initialValue = "" }: SearchSuggestionsProps) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const allProducts = [...cottonProducts, ...trouserProducts, ...ethnicProducts];
  
  // Extract unique materials, brands, and categories
  const allMaterials = [...new Set(allProducts.map(p => p.material).filter(Boolean))];
  const allBrands = ["Raymond", "Arvind", "Siyaram", "Grasim", "Donear", "Digjam"];
  const allCategories = ["Cotton", "Trouser", "Ethnic", "Linen", "Silk", "Wool"];

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
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchTerm = query.toLowerCase();
    const newSuggestions: SearchSuggestion[] = [];

    // Product suggestions
    allProducts.forEach(product => {
      if (
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      ) {
        newSuggestions.push({
          id: `product-${product.id}`,
          title: product.name,
          type: 'product',
          category: product.material,
          product
        });
      }
    });

    // Material suggestions
    allMaterials.forEach(material => {
      if (material && material.toLowerCase().includes(searchTerm)) {
        newSuggestions.push({
          id: `material-${material}`,
          title: material,
          type: 'material',
          category: 'Material'
        });
      }
    });

    // Brand suggestions
    allBrands.forEach(brand => {
      if (brand.toLowerCase().includes(searchTerm)) {
        newSuggestions.push({
          id: `brand-${brand}`,
          title: brand,
          type: 'brand',
          category: 'Brand'
        });
      }
    });

    // Category suggestions
    allCategories.forEach(category => {
      if (category.toLowerCase().includes(searchTerm)) {
        newSuggestions.push({
          id: `category-${category}`,
          title: category,
          type: 'category',
          category: 'Category'
        });
      }
    });

    // Remove duplicates and limit to 8 suggestions
    const uniqueSuggestions = newSuggestions
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.title === suggestion.title && s.type === suggestion.type)
      )
      .slice(0, 8);

    setSuggestions(uniqueSuggestions);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  }, [query]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    onSearchChange(value);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    // Navigate with type parameter for better filtering
    const searchParams = new URLSearchParams();
    searchParams.set('q', suggestion.title);
    searchParams.set('type', suggestion.type);
    if (suggestion.category) {
      searchParams.set('category', suggestion.category);
    }
    
    // Navigate to search results with parameters
    navigate(`/search?${searchParams.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query.trim()) {
          // Direct search when no suggestion is selected
          setShowSuggestions(false);
          navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const clearSearch = () => {
    setQuery("");
    onSearchChange("");
    setShowSuggestions(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product': return '🧵';
      case 'brand': return '🏷️';
      case 'material': return '🧶';
      case 'category': return '📁';
      default: return '🔍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'product': return 'bg-blue-100 text-blue-700';
      case 'brand': return 'bg-purple-100 text-purple-700';
      case 'material': return 'bg-green-100 text-green-700';
      case 'category': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search fabrics, brands, materials..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          className="pl-10 pr-10 bg-white/90 backdrop-blur border-purple-200 focus:border-purple-400 focus:ring-purple-200"
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

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 border-0 shadow-xl bg-white/95 backdrop-blur">
          <CardContent className="p-2">
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
                  <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 truncate">
                        {suggestion.title}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getTypeColor(suggestion.type)}`}
                      >
                        {suggestion.category || suggestion.type}
                      </Badge>
                    </div>
                    {suggestion.product && (
                      <p className="text-sm text-gray-600 truncate">
                        {suggestion.product.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {query.length >= 2 && (
              <div className="border-t mt-2 pt-2">
                <div className="text-xs text-gray-500 px-3 py-1">
                  {suggestions.length > 0 
                    ? `${suggestions.length} suggestion${suggestions.length !== 1 ? 's' : ''} found`
                    : 'No suggestions found'
                  }
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};