import { Product, ProductCard } from "./ProductCard";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  return (
    <section id={id} className="py-8 sm:py-6 lg:py-10 scroll-mt-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and View All Button */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
          
          {products.length > 0 && (
            <button onClick={() => navigate('/products')} className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-200 hover:border-purple-300 rounded-lg transition-colors duration-200">
              <span>View All</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Our collection is being updated. Check back soon for new arrivals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product, index) => (
              <div 
                key={product.id}
                className="opacity-0 animate-fade-in"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'forwards'
                }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
