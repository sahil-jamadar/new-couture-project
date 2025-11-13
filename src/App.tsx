import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Cart } from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CollectionPage from "./pages/CollectionPage";
import CategoryProducts from "./pages/CategoryProducts";
import Index from "./pages/Index";
import Login from "./pages/Login";
import MyAppointments from "./pages/MyAppointments";
import MyOrders from "./pages/MyOrders";
import NotFound from "./pages/NotFound";
import ProductDetailPage2 from "./pages/ProductDetailPage2";
import SearchResults from "./pages/SearchResults";
import AllProducts from "./pages/AllProducts";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <ProductProvider>
                <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/products" element={<AllProducts />} />
              <Route path="/product/:productId" element={<ProductDetailPage2 />} />
              <Route path="/collection/:slug" element={<CollectionPage />} />
              <Route path="/category/:category" element={<CategoryProducts />} />
              <Route path="/appointments" element={<MyAppointments />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
                </Routes>
              </ProductProvider>
            </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
