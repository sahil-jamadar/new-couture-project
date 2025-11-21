import SizeGuideImage from "@/assets/Size_Guide.png";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
    ColorVariant,
    getColorVariantsByProduct,
    getProductById,
    getProductsByCollection,
    Product,
} from "@/lib/collectionService";
import {
    Check,
    ChevronRight,
    Home,
    Minus,
    Plus,
    RefreshCw,
    Ruler,
    Share2,
    Shield,
    ShoppingCart,
    Truck
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetailPage2 = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { productId } = useParams<{ productId: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [selectedVariantId, setSelectedVariantId] = useState<string>("");
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0); // For new variant structure
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Get cart count from localStorage
    const getCartItemCount = () => {
        try {
            const cart = localStorage.getItem("coutures-cart");
            if (cart) {
                const items = JSON.parse(cart);
                return items.reduce((sum: number, item: any) => sum + item.quantity, 0);
            }
        } catch (e) {
            return 0;
        }
        return 0;
    };

    const [cartCount, setCartCount] = useState(getCartItemCount());

    // Load product data
    useEffect(() => {
        // Scroll to top when component mounts or productId changes
        window.scrollTo(0, 0);
        
        const loadProductData = async () => {
            if (!productId) {
                navigate("/");
                return;
            }

            setLoading(true);
            try {
                const productData = await getProductById(productId);

                if (!productData) {
                    toast({
                        title: "Product not found",
                        description: "The product you're looking for doesn't exist.",
                        variant: "destructive",
                    });
                    navigate("/");
                    return;
                }

                setProduct(productData);
                
                // Check if product uses new variant structure
                const hasNewVariants = !!(productData.variants && productData.variants.length > 0);
                
                if (hasNewVariants && productData.variants) {
                    // New variant structure: use first variant's first image
                    const initialImage = productData.variants[0]?.images[0] || "";
                    setCurrentImage(initialImage);
                    setSelectedVariantIndex(0);
                } else {
                    // Old structure: use thumbnail or first image
                    const initialImage = productData.thumbnail || (productData.images && productData.images[0]) || "";
                    setCurrentImage(initialImage);
                }

                if (productData.hasColorVariants) {
                    const variants = await getColorVariantsByProduct(productId);
                    setColorVariants(variants);
                }

                if (productData.collectionId) {
                    const collectionProducts = await getProductsByCollection(productData.collectionId);
                    const filteredProducts = collectionProducts
                        .filter(p => p.id !== productId)
                        .slice(0, 8);
                    setSimilarProducts(filteredProducts);
                }
            } catch (error) {
                console.error("Error loading product:", error);
                toast({
                    title: "Error",
                    description: "Failed to load product. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        loadProductData();
    }, [productId, navigate, toast]);

    const selectedVariant = useMemo(() => {
        if (selectedVariantId && colorVariants.length > 0) {
            return colorVariants.find(v => v.id === selectedVariantId);
        }
        return null;
    }, [selectedVariantId, colorVariants]);

    // Check if product uses new variant structure
    const hasNewVariants = !!(product?.variants && product.variants.length > 0);
    
    // Get current product variant from new structure
    const currentProductVariant = useMemo(() => {
        if (hasNewVariants && product?.variants) {
            return product.variants[selectedVariantIndex];
        }
        return null;
    }, [hasNewVariants, product, selectedVariantIndex]);

    // Get product name (supports both old and new structure)
    const productName = product?.title || product?.name || "Product";
    
    // Get current price (supports both old and new structure)
    const currentPrice = currentProductVariant?.price 
        || selectedVariant?.price 
        || product?.price 
        || product?.basePrice 
        || 0;
    
    // Get stock status
    const isInStock = currentProductVariant 
        ? (currentProductVariant.stock > 0)
        : selectedVariant 
            ? selectedVariant.inStock 
            : (product?.inStock !== false);
    
    // Get all images (supports both old and new structure)
    const allImages = useMemo(() => {
        if (currentProductVariant?.images && currentProductVariant.images.length > 0) {
            // New variant structure: use current variant's images
            return currentProductVariant.images;
        } else if (product?.images && product.images.length > 0) {
            // Old structure: use product images
            return product.images;
        } else if (product?.thumbnail) {
            // Fallback to thumbnail
            return [product.thumbnail];
        }
        return [];
    }, [currentProductVariant, product]);

    const handleAddToCart = () => {
        if (!product) return;

        // Determine display name based on structure
        let displayName = productName;
        if (currentProductVariant) {
            displayName = `${productName} - ${currentProductVariant.color}`;
        } else if (selectedVariant) {
            displayName = `${productName} - ${selectedVariant.colorName}`;
        }

        const cartProduct = {
            id: selectedVariantId 
                ? `${product.id}-${selectedVariantId}` 
                : currentProductVariant 
                    ? `${product.id}-${currentProductVariant.color}` 
                    : product.id,
            productId: product.id,
            name: displayName,
            description: product.description || "Premium quality fabric",
            price: currentPrice,
            image: currentImage || allImages[0] || product.thumbnail || "",
            material: product.material || "Premium Fabric",
            quantity: quantity,
            color: currentProductVariant?.color || selectedVariant?.colorName || "",
        };

        console.log("\n🛒 Adding item to cart:");
        console.log("   - Product ID:", product.id);
        console.log("   - Cart Item ID:", cartProduct.id);
        console.log("   - Product Name:", cartProduct.name);
        console.log("   - Color:", cartProduct.color || "⚠️ NO COLOR");
        console.log("   - Quantity:", cartProduct.quantity);
        console.log("   - Price:", cartProduct.price);
        console.log("   - Has Variants:", !!product.variants);
        if (product.variants) {
            console.log("   - Available Colors:", product.variants.map(v => v.color).join(", "));
            console.log("   - Current Variant:", currentProductVariant);
        }

        try {
            const cartData = localStorage.getItem("coutures-cart");
            let cart = cartData ? JSON.parse(cartData) : [];

            const existing = cart.find((item: any) => item.id === cartProduct.id);
            if (existing) {
                console.log("✓ Item already in cart, updating quantity");
                cart = cart.map((item: any) =>
                    item.id === cartProduct.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
                toast({
                    title: "✓ Cart Updated",
                    description: `Quantity increased to ${existing.quantity + quantity} meters`,
                });
            } else {
                console.log("✓ Adding new item to cart");
                cart.push(cartProduct);
                toast({
                    title: "✓ Added to Cart",
                    description: `${cartProduct.name} added successfully`,
                });
            }

            localStorage.setItem("coutures-cart", JSON.stringify(cart));
            console.log("✅ Cart saved to localStorage. Total items:", cart.length);
            setCartCount(getCartItemCount());
        } catch (error) {
            console.error("❌ Error adding to cart:", error);
            toast({
                title: "Error",
                description: "Failed to add item to cart",
                variant: "destructive",
            });
        }
    };

    const handleSimilarProductAddToCart = (prod: any) => {
        try {
            const cartData = localStorage.getItem("coutures-cart");
            let cart = cartData ? JSON.parse(cartData) : [];

            // Get product name (support both old and new structure)
            const prodName = prod.title || prod.name || "Product";
            
            // Get first price (from variants if available, otherwise use direct price)
            const prodPrice = prod.variants && prod.variants.length > 0
                ? prod.variants[0].price
                : prod.price || prod.basePrice || 0;
            
            // Get first image
            const prodImage = prod.variants && prod.variants.length > 0
                ? prod.variants[0].images[0]
                : prod.image || prod.thumbnail || (prod.images && prod.images[0]) || "";

            const cartProduct = {
                ...prod,
                name: prodName,
                price: prodPrice,
                image: prodImage,
                quantity: 1
            };

            const existing = cart.find((item: any) => item.id === prod.id);
            if (existing) {
                cart = cart.map((item: any) =>
                    item.id === prod.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                cart.push(cartProduct);
            }

            localStorage.setItem("coutures-cart", JSON.stringify(cart));
            setCartCount(getCartItemCount());
            toast({
                title: "✓ Added to Cart",
                description: `${prodName} added successfully`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add item to cart",
                variant: "destructive",
            });
        }
    };

    const handleVariantSelect = (variant: ColorVariant) => {
        setSelectedVariantId(variant.id);
        if (variant.images && variant.images.length > 0) {
            setCurrentImage(variant.images[0]);
            setCurrentImageIndex(0);
        }
    };

    const handleNewVariantSelect = (index: number) => {
        setSelectedVariantIndex(index);
        if (product?.variants && product.variants[index]?.images && product.variants[index].images.length > 0) {
            setCurrentImage(product.variants[index].images[0]);
            setCurrentImageIndex(0);
        }
    };

    const handleImageSelect = (image: string, index: number) => {
        setCurrentImage(image);
        setCurrentImageIndex(index);
    };

    // Share product (native share when available, otherwise copy link)
    const handleShare = async () => {
        const url = window.location.href;
        try {
            if ((navigator as any).share) {
                await (navigator as any).share({
                    title: productName,
                    text: product?.description || '',
                    url,
                });
                toast({ title: 'Shared', description: 'Product shared successfully' });
            } else {
                await navigator.clipboard.writeText(url);
                toast({ title: 'Link copied', description: 'Product link copied to clipboard' });
            }
        } catch (error) {
            console.error('Share failed', error);
            toast({ title: 'Error', description: 'Failed to share product', variant: 'destructive' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header cartItemCount={cartCount} onSearchChange={setSearchQuery} />
                <div className="container mx-auto px-4 pt-32 pb-16">
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-600 text-lg">Loading product...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            <Header cartItemCount={cartCount} onSearchChange={setSearchQuery} />

            {/* Breadcrumb */}
            <div className="border-b border-gray-200 bg-gray-50 mt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex items-center gap-2 text-sm text-gray-600">
                        <button
                            onClick={() => navigate("/")}
                            className="hover:text-gray-900 transition-colors flex items-center gap-1"
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </button>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <button
                            onClick={() => navigate(-1)}
                            className="hover:text-gray-900 transition-colors"
                        >
                            Collection
                        </button>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-gray-900 font-medium truncate">{productName}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

                    {/* LEFT: Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                            {currentImage ? (
                                <img
                                    src={currentImage}
                                    alt={productName}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-8xl">🎨</span>
                                </div>
                            )}

                            {/* Image Counter */}
                            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                                {currentImageIndex + 1} / {allImages.length}
                            </div>

                            {/* Stock Badge */}
                            {!isInStock && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <Badge variant="destructive" className="text-lg py-2 px-4">
                                        Out of Stock
                                    </Badge>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-5 gap-3">
                                {allImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleImageSelect(image, index)}
                                        className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${currentImageIndex === index
                                            ? "border-gray-900 ring-2 ring-gray-300"
                                            : "border-gray-200 hover:border-gray-400"
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`View ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Color Variants - New Structure */}
                        {hasNewVariants && product.variants && product.variants.length > 1 && (
                            <div className="pt-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    Available Colors ({product.variants.length})
                                </h3>
                                <div className="grid grid-cols-4 gap-3">
                                    {product.variants.map((variant, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleNewVariantSelect(index)}
                                            disabled={variant.stock <= 0}
                                            className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${selectedVariantIndex === index
                                                ? "border-gray-900 ring-2 ring-gray-300 scale-95"
                                                : "border-gray-200 hover:border-gray-400"
                                                } ${variant.stock <= 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                                        >
                                            {variant.images && variant.images[0] ? (
                                                <img
                                                    src={variant.images[0]}
                                                    alt={variant.color}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-4xl">🎨</span>
                                                </div>
                                            )}
                                            {selectedVariantIndex === index && (
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                                        <Check className="w-5 h-5 text-gray-900" />
                                                    </div>
                                                </div>
                                            )}
                                            {variant.stock <= 0 && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">OUT</span>
                                                </div>
                                            )}
                                            <p className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 text-center">
                                                {variant.color}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Variants - Old Structure */}
                        {colorVariants.length > 0 && (
                            <div className="pt-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    Available Colors ({colorVariants.length})
                                </h3>
                                <div className="grid grid-cols-4 gap-3">
                                    {colorVariants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => handleVariantSelect(variant)}
                                            disabled={!variant.inStock}
                                            className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${selectedVariantId === variant.id
                                                ? "border-gray-900 ring-2 ring-gray-300 scale-95"
                                                : "border-gray-200 hover:border-gray-400"
                                                } ${!variant.inStock ? "opacity-40 cursor-not-allowed" : ""}`}
                                        >
                                            {variant.images && variant.images[0] ? (
                                                <img
                                                    src={variant.images[0]}
                                                    alt={variant.colorName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div
                                                    className="w-full h-full"
                                                    style={{ backgroundColor: variant.colorCode }}
                                                />
                                            )}
                                            {selectedVariantId === variant.id && (
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                                        <Check className="w-5 h-5 text-gray-900" />
                                                    </div>
                                                </div>
                                            )}
                                            {!variant.inStock && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">OUT</span>
                                                </div>
                                            )}
                                            <p className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 text-center">
                                                {variant.colorName}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Product Info */}
                    <div className="space-y-6 relative">
                        {/* Top-right: Share icon button */}
                        <div className="absolute top-0 right-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Share product"
                                title="Share this product"
                                onClick={handleShare}
                                className="text-gray-700 hover:bg-gray-100"
                            >
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>
                        {/* Material Badge */}
                        {product.material && (
                            <Badge className="bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300">
                                {product.material}
                            </Badge>
                        )}

                        {/* Product Title */}
                        <div>
                            <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                                {productName}
                            </h1>
                            {product.description && (
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {product.description}
                                </p>
                            )}
                        </div>


                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-gray-900">
                                ₹{currentPrice.toLocaleString()}
                            </span>
                            <span className="text-lg text-gray-500">per meter</span>
                            {isInStock ? (
                                <Badge className="ml-auto bg-green-50 text-green-700 border border-green-200">
                                    <Check className="w-3 h-3 mr-1" />
                                    In Stock
                                </Badge>
                            ) : (
                                <Badge variant="destructive" className="ml-auto">
                                    Out of Stock
                                </Badge>
                            )}
                        </div>

                        <Separator />

                        {/* Quantity Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                Quantity (meters)
                            </label>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                        className="h-12 w-12 rounded-l-lg rounded-r-none hover:bg-gray-100"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <div className="w-20 h-12 flex items-center justify-center border-x-2 border-gray-300">
                                        <span className="text-xl font-semibold text-gray-900">{quantity}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="h-12 w-12 rounded-r-lg rounded-l-none hover:bg-gray-100"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex-1 text-right">
                                    <p className="text-sm text-gray-600">Total</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ₹{(currentPrice * quantity).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Button
                                onClick={handleAddToCart}
                                disabled={!isInStock}
                                size="lg"
                                className="w-full bg-gray-900 hover:bg-black text-white py-6 text-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Add to Cart
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-4 gap-4 pt-4">
                            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <Truck className="w-6 h-6 text-gray-700 mb-2" />
                                <p className="text-xs font-medium text-gray-900">Free Delivery</p>
                                <p className="text-xs text-gray-600">Above ₹2000</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <RefreshCw className="w-6 h-6 text-gray-700 mb-2" />
                                <p className="text-xs font-medium text-gray-900">Easy Returns</p>
                                <p className="text-xs text-gray-600">7 Days Policy</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <Shield className="w-6 h-6 text-gray-700 mb-2" />
                                <p className="text-xs font-medium text-gray-900">Secure Payment</p>
                                <p className="text-xs text-gray-600">100% Safe</p>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                        <Ruler className="w-6 h-6 text-gray-700 mb-2" />
                                        <p className="text-xs font-medium text-gray-900">View Size Guide</p>
                                        <p className="text-xs text-gray-600">Sizing Info</p>
                                    </div>
                                </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-playfair font-bold">Size Guide</DialogTitle>
                                </DialogHeader>
                                <div className="relative overflow-auto max-h-[calc(90vh-120px)]">
                                    <img 
                                        src={SizeGuideImage} 
                                        alt="Size Guide" 
                                        className="w-full h-auto rounded-lg"
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                        </div>
                    </div>
                </div>

                {/* Product Details Sections */}
                <div className="mt-16 space-y-12">

                    {/* Description & Specifications Section */}
                    <div className="space-y-4">
                        <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900 pb-3 border-b-2 border-gray-900">
                            Description & Specifications
                        </h2>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 space-y-8">
                            {/* Description */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4 text-lg sm:text-xl">About This Product</h3>
                                <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                                    {product.description || "Experience the finest quality fabric designed for elegance and comfort. Perfect for creating stunning garments that stand the test of time."}
                                </p>
                                {product.features && product.features.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="font-semibold text-gray-900 mb-4 text-base sm:text-lg">Key Features:</h4>
                                        <ul className="space-y-3">
                                            {product.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-3 text-gray-700">
                                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm sm:text-base">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Specifications */}
                            <div className="pt-6 border-t border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-4 text-lg sm:text-xl">Technical Specifications</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    {product.material && (
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 px-4 bg-gray-50 rounded-lg gap-1 sm:gap-2">
                                            <span className="font-medium text-gray-900 text-sm sm:text-base">Material:</span>
                                            <span className="text-gray-700 text-sm sm:text-base">{product.material}</span>
                                        </div>
                                    )}
                                    {product.weight && (
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 px-4 bg-gray-50 rounded-lg gap-1 sm:gap-2">
                                            <span className="font-medium text-gray-900 text-sm sm:text-base">Weight:</span>
                                            <span className="text-gray-700 text-sm sm:text-base">{product.weight}</span>
                                        </div>
                                    )}
                                    {product.width && (
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 px-4 bg-gray-50 rounded-lg gap-1 sm:gap-2">
                                            <span className="font-medium text-gray-900 text-sm sm:text-base">Width:</span>
                                            <span className="text-gray-700 text-sm sm:text-base">{product.width}</span>
                                        </div>
                                    )}
                                    {product.color && (
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 px-4 bg-gray-50 rounded-lg gap-1 sm:gap-2">
                                            <span className="font-medium text-gray-900 text-sm sm:text-base">Color:</span>
                                            <span className="text-gray-700 text-sm sm:text-base">{product.color}</span>
                                        </div>
                                    )}
                                    {product.pattern && (
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 px-4 bg-gray-50 rounded-lg gap-1 sm:gap-2">
                                            <span className="font-medium text-gray-900 text-sm sm:text-base">Pattern:</span>
                                            <span className="text-gray-700 text-sm sm:text-base">{product.pattern}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Similar Products */}
                    {similarProducts.length > 0 && (
                        <div className="mt-20">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                        You May Also Like
                                    </h2>
                                    <p className="text-gray-600">More premium fabrics from this collection</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {similarProducts.map((prod) => (
                                    <div key={prod.id} className="hover-lift">
                                        <ProductCard
                                            product={{
                                                id: prod.id,
                                                name: prod.title,
                                                description: prod.description || 'Premium quality fabric',
                                                price: prod.variants[0]?.price || 0,
                                                image: prod.variants[0]?.images[0] || (prod.images && prod.images[0]) || '',
                                                material: prod.material || 'Premium Fabric',
                                            }}
                                            onAddToCart={handleSimilarProductAddToCart}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>




            {/* Footer */}
            <footer className="relative mt-20 overflow-hidden bg-gray-900">
                <div className="relative z-10 py-16">
                    <div className="container mx-auto px-4 text-center">
                        <div className="mb-8">
                            <h2 className="font-playfair text-4xl font-bold mb-3 text-white">
                                The Coutures
                            </h2>
                            <p className="text-white/90 text-xl italic tracking-wide">
                                "Your Style, Our Signature"
                            </p>
                        </div>
                        <div className="flex items-center justify-center mb-8">
                            <div className="w-16 h-px bg-white/30" />
                            <div className="mx-4 w-2 h-2 bg-white/50 rounded-full" />
                            <div className="w-16 h-px bg-white/30" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-white/80 text-lg">
                                Premium Fabrics & Luxury Apparel
                            </p>
                            <p className="text-white/60 text-sm">
                                © 2025 The Coutures. Crafting Excellence Since Today.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>)


};

export default ProductDetailPage2;
