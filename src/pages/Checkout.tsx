import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { AddressSelector } from "@/components/AddressSelector";
import { AddressForm } from "@/components/AddressForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getUserAddresses, addAddress, Address, AddressInput } from "@/lib/addressService";
import { placeOrder, validateStock, OrderProduct } from "@/lib/orderService";
import { ArrowLeft, ShoppingBag, CreditCard } from "lucide-react";

interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  image: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [stockErrors, setStockErrors] = useState<string[]>([]);

  // Load cart items
  useEffect(() => {
    const loadCart = () => {
      try {
        const cart = localStorage.getItem("coutures-cart");
        if (cart) {
          setCartItems(JSON.parse(cart));
        } else {
          navigate("/cart");
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        navigate("/cart");
      }
    };

    loadCart();
  }, [navigate]);

  // Load addresses
  useEffect(() => {
    const loadAddresses = async () => {
      if (!user?.uid) return;

      try {
        const userAddresses = await getUserAddresses(user.uid);
        setAddresses(userAddresses);

        // Auto-select default address or first address
        const defaultAddr = userAddresses.find(addr => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (userAddresses.length > 0) {
          setSelectedAddressId(userAddresses[0].id);
        }
      } catch (error) {
        console.error("Error loading addresses:", error);
        toast({
          title: "Error",
          description: "Failed to load addresses",
          variant: "destructive"
        });
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [user, toast]);

  // Validate stock on load
  useEffect(() => {
    const checkStock = async () => {
      if (cartItems.length === 0) return;

      // Validate stock before showing checkout
      const validation = await validateStock(
        cartItems.map(item => ({
          id: item.id,
          productId: item.productId || item.id.split('-')[0],
          color: item.color || "",
          quantity: item.quantity
        }))
      );

      if (!validation.valid) {
        const errors = validation.outOfStock.map(
          item => `${item.productName} (${item.color}) is out of stock`
        );
        setStockErrors(errors);
      }
    };

    checkStock();
  }, [cartItems]);

  const handleAddAddress = async (addressData: AddressInput) => {
    if (!user?.uid) return;

    setAddressSaving(true);
    try {
      const addressId = await addAddress(user.uid, addressData);

      // Reload addresses
      const userAddresses = await getUserAddresses(user.uid);
      setAddresses(userAddresses);
      setSelectedAddressId(addressId);

      toast({
        title: "Success",
        description: "Address added successfully"
      });
    } catch (error) {
      console.error("Error adding address:", error);
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive"
      });
      throw error;
    } finally {
      setAddressSaving(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    if (!user?.uid) {
      toast({
        title: "Error",
        description: "Please log in to place an order",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    if (!selectedAddressId) {
      toast({
        title: "Error",
        description: "Please select a delivery address",
        variant: "destructive"
      });
      return;
    }

    if (stockErrors.length > 0) {
      toast({
        title: "Error",
        description: "Some items are out of stock. Please update your cart.",
        variant: "destructive"
      });
      return;
    }

    setPlacingOrder(true);

    try {
      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
      if (!selectedAddress) {
        throw new Error("Selected address not found");
      }

      const orderProducts: OrderProduct[] = cartItems.map(item => ({
        productId: item.productId || item.id.split('-')[0],
        title: item.name,
        color: item.color,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      const orderId = await placeOrder({
        uid: user.uid,
        products: orderProducts,
        totalAmount: calculateTotal(),
        totalQuantity: getTotalQuantity(),
        address: selectedAddress,
        paymentMode: "cod"
      });

      // Clear cart
      localStorage.removeItem("coutures-cart");

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${orderId.substring(0, 8)} has been placed.`
      });

      // Redirect to orders page
      navigate("/orders");
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to place order",
        variant: "destructive"
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header cartItemCount={0} />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/cart")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Checkout
          </h1>
        </div>

        {/* Stock Errors */}
        {stockErrors.length > 0 && (
          <Card className="p-4 mb-6 border-red-500 bg-red-50 dark:bg-red-900/20">
            <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">
              Stock Unavailable
            </h3>
            <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-300">
              {stockErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Address */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <AddressSelector
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onSelectAddress={setSelectedAddressId}
                onAddNewAddress={() => setIsAddressFormOpen(true)}
                loading={loadingAddresses}
              />
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Payment Method
              </h3>
              <div className="flex items-center gap-3 p-4 border-2 border-primary rounded-lg bg-primary/5">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Cash on Delivery
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pay when you receive your order
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.color}`} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">Color: {item.color}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal ({getTotalQuantity()} items)
                  </span>
                  <span className="font-medium">₹{calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>₹{calculateTotal().toLocaleString()}</span>
              </div>

              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={
                  placingOrder ||
                  !selectedAddressId ||
                  cartItems.length === 0 ||
                  stockErrors.length > 0
                }
              >
                <ShoppingBag className="h-5 w-5" />
                {placingOrder ? "Placing Order..." : "Place Order"}
              </Button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                By placing this order, you agree to our Terms & Conditions
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Address Form Dialog */}
      <AddressForm
        isOpen={isAddressFormOpen}
        onClose={() => setIsAddressFormOpen(false)}
        onSubmit={handleAddAddress}
        loading={addressSaving}
      />
    </div>
  );
};

export default Checkout;
