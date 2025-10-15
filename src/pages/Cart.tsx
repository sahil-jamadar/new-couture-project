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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem extends Product {
  quantity: number;
}

export const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    // Load cart from localStorage
    try {
      const cartData = localStorage.getItem("coutures-cart");
      if (cartData) {
        setCartItems(JSON.parse(cartData));
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, []);

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

  const handleRemoveItem = (productId: string) => {
    const newCart = cartItems.filter((item) => item.id !== productId);
    updateCart(newCart);
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart",
    });
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

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
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-playfair font-semibold text-lg mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
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
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="font-medium">₹{tax.toLocaleString()}</span>
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
                  onClick={() => {
                    if (!isLoggedIn) {
                      setShowLoginDialog(true);
                    } else {
                      // Handle checkout process
                      console.log("Proceeding to checkout");
                    }
                  }}
                >
                  Proceed to Checkout
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
          </div>
        </div>
      </div>
    </div>
  );
};
