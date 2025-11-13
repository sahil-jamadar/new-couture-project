import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { getUserOrders, Order } from "@/lib/orderService";
import { ArrowLeft, Package, Clock, Truck, CheckCircle2, XCircle, MapPin, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MyOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please login to view your orders",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    const loadOrders = async () => {
      if (!user?.uid) return;

      setLoading(true);
      try {
        const userOrders = await getUserOrders(user.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
        toast({
          title: "Error",
          description: "Failed to load your orders",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, isLoggedIn, navigate, toast]);

  const getStatusIcon = (status: Order["orderStatus"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle2 className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order["orderStatus"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "shipped":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={0} onSearchChange={() => {}} />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={0} onSearchChange={() => {}} />

      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="font-playfair text-2xl font-bold mb-1">My Orders</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage your orders
          </p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-semibold mb-1">No Orders Yet</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Button size="sm" onClick={() => navigate("/")}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 py-3 px-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(order.orderStatus)} flex items-center gap-1 w-fit text-xs`}>
                      {getStatusIcon(order.orderStatus)}
                      <span className="capitalize">{order.orderStatus}</span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  {/* Order Products */}
                  <div className="space-y-2 mb-4">
                    {order.products.map((product, index) => (
                      <div key={index} className="flex gap-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-14 h-14 object-cover rounded border"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{product.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            Color: {product.color} • Qty: {product.quantity}
                          </p>
                          <span className="text-sm font-semibold">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-3" />

                  {/* Order Summary */}
                  <div className="grid md:grid-cols-2 gap-3">
                    {/* Delivery Address */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        Delivery Address
                      </h4>
                      <div className="text-xs space-y-0.5 bg-muted/30 p-2.5 rounded">
                        <p>{order.address.addressLine1}</p>
                        {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                        <p>{order.address.district}, {order.address.state}</p>
                        <p>PIN: {order.address.pincode}</p>
                        <p>Mobile: {order.address.mobileNumber}</p>
                      </div>
                    </div>

                    {/* Payment & Total */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" />
                        Payment Details
                      </h4>
                      <div className="bg-muted/30 p-2.5 rounded space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span>Payment:</span>
                          <span className="font-medium uppercase">{order.paymentMode}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Items:</span>
                          <span className="font-medium">{order.totalQuantity}</span>
                        </div>
                        <Separator className="my-1" />
                        <div className="flex justify-between font-semibold text-base">
                          <span>Total:</span>
                          <span className="text-primary">
                            ₹{order.totalAmount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
