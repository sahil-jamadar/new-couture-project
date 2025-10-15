import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  material?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group overflow-hidden border-border/50 hover:shadow-premium transition-smooth cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-smooth ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-background/90 to-transparent transition-smooth ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-premium"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-playfair font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-smooth">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>
        {product.material && (
          <p className="text-xs text-accent font-medium mb-2 uppercase tracking-wide">
            {product.material}
          </p>
        )}
        <p className="text-xl font-bold text-primary">₹{product.price.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
};
