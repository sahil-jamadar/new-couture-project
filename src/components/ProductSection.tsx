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
    <section id={id} className="py-12 sm:py-16 lg:py-20 scroll-mt-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          {/* Decorative Top Line */}
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="w-8 sm:w-12 lg:w-16 h-px bg-gradient-premium" />
            <div className="mx-2 sm:mx-4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary rounded-full" />
            <div className="w-8 sm:w-12 lg:w-16 h-px bg-gradient-premium" />
          </div>
          
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gradient-purple mb-4 sm:mb-6 leading-tight px-4">
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              {subtitle}
            </p>
          )}
          
          {/* Decorative Bottom Line */}
          <div className="flex items-center justify-center mt-6 sm:mt-8">
            <div className="w-16 sm:w-20 lg:w-24 h-px bg-gradient-premium opacity-50" />
          </div>
        </div>
        
        {/* Products Grid with Enhanced Spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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
