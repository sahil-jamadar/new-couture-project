import { Product } from "@/components/ProductCard";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { validateStock } from "@/lib/orderService";
import { AlertCircle, ArrowLeft, Minus, Plus, Scissors, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem extends Product {
  quantity: number;
  color: string;
  productId?: string;
}

export const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [outOfStockItems, setOutOfStockItems] = useState<Set<string>>(new Set());
  const [checkingStock, setCheckingStock] = useState(false);

  useEffect(() => {
    // Load cart from localStorage
    try {
      const cartData = localStorage.getItem("coutures-cart");
      console.log("📦 Loading cart from localStorage...");
      if (cartData) {
        const items = JSON.parse(cartData);
        console.log("✅ Cart loaded:", items.length, "items");
        console.log("🔍 Cart items details:", items.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          color: item.color,
          quantity: item.quantity,
          price: item.price
        })));
        setCartItems(items);
      } else {
        console.log("📭 No cart data found in localStorage");
      }
    } catch (e) {
      console.error("❌ Failed to load cart", e);
    }
  }, []);

  // Validate stock whenever cart items change
  useEffect(() => {
    const checkStock = async () => {
      if (cartItems.length === 0) return;

      console.log("\n🔄 Starting stock validation for cart items...");
      setCheckingStock(true);
      try {
        const itemsToValidate = cartItems.map(item => ({
          id: item.id,
          productId: item.productId || item.id.split('-')[0],
          color: item.color || "",
          quantity: item.quantity
        }));
        
        console.log("📋 Items to validate:", itemsToValidate);
        
        const validation = await validateStock(itemsToValidate);

        console.log("✓ Validation result:", {
          valid: validation.valid,
          outOfStockCount: validation.outOfStock.length,
          outOfStockItems: validation.outOfStock
        });

        if (!validation.valid) {
          const outOfStockSet = new Set(
            validation.outOfStock.map(item => item.id)
          );
          console.log("🚫 Setting out of stock items:", Array.from(outOfStockSet));
          setOutOfStockItems(outOfStockSet);

          toast({
            title: "Stock Update",
            description: `${validation.outOfStock.length} item(s) are out of stock`,
            variant: "destructive"
          });
        } else {
          console.log("✅ All items are in stock!");
          setOutOfStockItems(new Set());
        }
      } catch (error) {
        console.error("❌ Error checking stock:", error);
      } finally {
        setCheckingStock(false);
      }
    };

    checkStock();
  }, [cartItems, toast]);

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem("coutures-cart", JSON.stringify(newCart));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const newCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    updateCart(newCart);
  };

  const handleRemoveItem = (productId: string, color: string) => {
    const newCart = cartItems.filter((item) => !(item.id === productId && item.color === color));
    updateCart(newCart);
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart",
    });
  };

  const isItemOutOfStock = (itemId: string, color: string) => {
    // Check using the full cart item id
    const isOutOfStock = outOfStockItems.has(itemId);
    console.log(`🔍 Checking if item is out of stock: ${itemId}, Color: ${color}, Result: ${isOutOfStock}`);
    return isOutOfStock;
  };

  const hasOutOfStockItems = outOfStockItems.size > 0;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <h1 className="font-playfair text-4xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Start adding fabrics to your collection
            </p>
            <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
          <h1 className="font-playfair text-4xl font-bold">Shopping Cart</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {hasOutOfStockItems && (
              <Card className="border-destructive bg-destructive/5">
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-destructive mb-1">
                      Some items are out of stock or have issues
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      These items might be old cart entries without color information. Please remove them and add fresh items from the product page.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log("🗑️ Clearing cart...");
                        localStorage.removeItem("coutures-cart");
                        setCartItems([]);
                        setOutOfStockItems(new Set());
                        toast({
                          title: "Cart Cleared",
                          description: "All items removed. Please add items again from product pages.",
                        });
                      }}
                      className="text-destructive border-destructive hover:bg-destructive/10"
                    >
                      Clear Cart & Start Fresh
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {cartItems.map((item) => {
              const itemOutOfStock = isItemOutOfStock(item.id, item.color || "");
              
              return (
                <Card key={`${item.id}-${item.color}`} className={`overflow-hidden ${itemOutOfStock ? 'border-destructive opacity-75' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                        {itemOutOfStock && (
                          <Badge variant="destructive" className="absolute top-0 right-0 text-xs">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-playfair font-semibold text-lg mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.description}
                        </p>
                        {item.color && (
                          <p className="text-xs text-accent font-medium mb-1">
                            Color: {item.color}
                          </p>
                        )}
                        {item.material && (
                          <p className="text-xs text-accent font-medium uppercase">
                            {item.material}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-primary mb-4">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                            disabled={itemOutOfStock}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={itemOutOfStock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemoveItem(item.id, item.color || "")}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-premium">
              <CardContent className="p-6">
                <h2 className="font-playfair text-2xl font-bold mb-6">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-primary">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 shadow-premium"
                  disabled={hasOutOfStockItems || checkingStock}
                  onClick={() => {
                    if (!isLoggedIn) {
                      setShowLoginDialog(true);
                    } else {
                      navigate('/checkout');
                    }
                  }}
                >
                  {checkingStock ? "Checking Stock..." : hasOutOfStockItems ? "Remove Out of Stock Items" : "Proceed to Checkout"}
                </Button>
                
                <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Login Required</AlertDialogTitle>
                      <AlertDialogDescription>
                        Please login to your account to proceed with the checkout process.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction onClick={() => navigate('/login')}>
                        Go to Login
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            {/* Tailoring Services Link */}
            <Card className="mt-6 shadow-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Scissors className="h-6 w-6 text-primary mr-3" />
                    <div>
                      <h3 className="font-playfair text-lg font-bold">Need Tailoring Services?</h3>
                      <p className="text-sm text-muted-foreground">
                        Professional alterations and custom fitting available
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white"
                    onClick={() => {
                      // Navigate to tailoring services section or contact
                      const tailoringSection = document.getElementById('tailoring-services');
                      if (tailoringSection) {
                        tailoringSection.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate('/#tailoring');
                      }
                    }}
                  >
                    <Scissors className="mr-2 h-4 w-4" />
                    View Services
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
