import { ProductCard, Product } from "./ProductCard";

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
    <section id={id} className="py-20 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
