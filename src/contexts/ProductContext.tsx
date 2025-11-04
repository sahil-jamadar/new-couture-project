import { Product } from '@/components/ProductCard';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ProductContextType {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product) => void;
  clearSelectedProduct: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const clearSelectedProduct = () => {
    setSelectedProduct(null);
  };

  return (
    <ProductContext.Provider value={{
      selectedProduct,
      setSelectedProduct,
      clearSelectedProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};