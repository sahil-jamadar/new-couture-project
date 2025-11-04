import { Product, ProductCard } from "./ProductCard";

interface ProductSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductSection = ({
  id,
  title,
  subtitle,
  products,
  onAddToCart,
}: ProductSectionProps) => {
  return (
    <section id={id} className="py-2 sm:py-2 lg:py-2 scroll-mt-2 relative">
      <div className="container mx-auto px-2 sm:px-2 lg:px-2">
        {/* Enhanced Section Header */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          {/* Decorative Top Line */}
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="w-8 sm:w-12 lg:w-16 h-px bg-gray-300" />
            <div className="mx-2 sm:mx-4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-800 rounded-full" />
            <div className="w-8 sm:w-12 lg:w-16 h-px bg-gray-300" />
          </div>
          
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight px-4">
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              {subtitle}
            </p>
          )}
          
          {/* Decorative Bottom Line */}
          <div className="flex items-center justify-center mt-6 sm:mt-8">
            <div className="w-16 sm:w-20 lg:w-24 h-px bg-gray-300 opacity-50" />
          </div>
        </div>
        
        {/* Products Grid with Enhanced Spacing - 2 products per row on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="animate-fade-in hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
