import { collection, addDoc, getDocs, query, where, orderBy, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { firestore } from "./firebase";
import { Address } from "./addressService";
import { getProductById } from "./collectionService";

export interface OrderProduct {
  productId: string; // Document ID from products collection
  title: string;
  color: string; // Color variant
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  uid: string; // User ID
  products: OrderProduct[];
  totalAmount: number;
  totalQuantity: number;
  address: Address;
  paymentMode: "cod" | "online"; // Cash on Delivery or Online
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at?: any;
  updated_at?: any;
}

export interface OrderInput {
  uid: string;
  products: OrderProduct[];
  totalAmount: number;
  totalQuantity: number;
  address: Address;
  paymentMode: "cod" | "online";
}

/**
 * Validate stock availability for cart items
 */
export const validateStock = async (cartItems: Array<{ id: string; productId?: string; color: string; quantity: number }>): Promise<{
  valid: boolean;
  outOfStock: Array<{ id: string; color: string; productName: string }>;
}> => {
  const outOfStock: Array<{ id: string; color: string; productName: string }> = [];
  
  console.log(`🚀 Starting stock validation for ${cartItems.length} items`);
  
  for (const item of cartItems) {
    try {
      // Use productId if available, otherwise extract from id
      const actualProductId = item.productId || item.id.split('-')[0];
      
      console.log(`\n🔍 Validating Item:`);
      console.log(`   - Cart Item ID: ${item.id}`);
      console.log(`   - Product ID: ${actualProductId}`);
      console.log(`   - Color: "${item.color}"`);
      console.log(`   - Quantity: ${item.quantity}`);
      
      const product = await getProductById(actualProductId);
      
      if (!product) {
        console.log(`❌ Product not found: ${actualProductId}`);
        outOfStock.push({ 
          id: item.id, 
          color: item.color,
          productName: "Unknown Product"
        });
        continue;
      }
      
      console.log(`✓ Product found: ${product.title || product.name}`);
      
      // Check if product has variants
      if (!product.variants || product.variants.length === 0) {
        console.log(`⚠️ Product has no variants structure`);
        // If no color specified and old structure, check general stock
        if (!item.color && product.inStock !== false) {
          console.log(`✅ Old structure product in stock`);
          continue;
        }
        outOfStock.push({ 
          id: item.id, 
          color: item.color,
          productName: product.title || product.name || "Unknown Product"
        });
        continue;
      }
      
      console.log(`📦 Product has ${product.variants.length} variant(s):`);
      product.variants.forEach((v, i) => {
        console.log(`   ${i + 1}. Color: "${v.color}" | Stock: ${v.stock} | Price: ₹${v.price}`);
      });
      
      // Check if color is provided
      if (!item.color || item.color.trim() === "") {
        console.log(`⚠️ WARNING: Cart item has no color specified!`);
        console.log(`   This might be an old cart item. Marking as out of stock.`);
        outOfStock.push({ 
          id: item.id, 
          color: item.color || "Unknown",
          productName: product.title || product.name || "Unknown Product"
        });
        continue;
      }
      
      // Find matching variant by color (case-insensitive comparison)
      const variant = product.variants.find(v => 
        v.color.toLowerCase().trim() === item.color.toLowerCase().trim()
      );
      
      console.log(`🔎 Looking for color: "${item.color}"`);
      
      if (!variant) {
        console.log(`❌ Variant NOT FOUND for color: "${item.color}"`);
        console.log(`   Available colors: ${product.variants.map(v => `"${v.color}"`).join(', ')}`);
        outOfStock.push({ 
          id: item.id, 
          color: item.color,
          productName: product.title || product.name || "Unknown Product"
        });
      } else if (variant.stock < item.quantity) {
        console.log(`❌ INSUFFICIENT STOCK: ${variant.stock} < ${item.quantity}`);
        outOfStock.push({ 
          id: item.id, 
          color: item.color,
          productName: product.title || product.name || "Unknown Product"
        });
      } else {
        console.log(`✅ STOCK AVAILABLE: ${variant.stock} >= ${item.quantity}`);
      }
    } catch (error) {
      console.error(`❌ Error validating stock for item ${item.id}:`, error);
      outOfStock.push({ 
        id: item.id, 
        color: item.color,
        productName: "Unknown Product"
      });
    }
  }
  
  console.log(`\n📊 Stock validation complete:`);
  console.log(`   - Total items checked: ${cartItems.length}`);
  console.log(`   - Out of stock: ${outOfStock.length}`);
  if (outOfStock.length > 0) {
    console.log(`   - Out of stock items:`, outOfStock);
  }
  
  return {
    valid: outOfStock.length === 0,
    outOfStock
  };
};

/**
 * Update product stock after order placement
 */
const updateProductStock = async (productId: string, color: string, quantity: number): Promise<void> => {
  try {
    const productRef = doc(firestore, "products", productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      throw new Error("Product not found");
    }
    
    const productData = productSnap.data();
    const variants = productData.variants || [];
    
    const updatedVariants = variants.map((v: any) => {
      if (v.color === color) {
        return {
          ...v,
          stock: Math.max(0, v.stock - quantity)
        };
      }
      return v;
    });
    
    await updateDoc(productRef, { variants: updatedVariants });
  } catch (error) {
    console.error("Error updating product stock:", error);
    throw error;
  }
};

/**
 * Place a new order
 */
export const placeOrder = async (orderData: OrderInput): Promise<string> => {
  try {
    // Validate stock before placing order
    const stockValidation = await validateStock(
      orderData.products.map(p => ({ 
        id: p.productId, // Cart item id (can be productId-color format)
        productId: p.productId, // Actual product document ID
        color: p.color, 
        quantity: p.quantity 
      }))
    );
    
    if (!stockValidation.valid) {
      throw new Error(`Some products are out of stock: ${stockValidation.outOfStock.map(p => `${p.productName} (${p.color})`).join(", ")}`);
    }
    
    const ordersRef = collection(firestore, "orders");
    
    const orderDoc = {
      ...orderData,
      orderStatus: "pending" as const,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    };
    
    const docRef = await addDoc(ordersRef, orderDoc);
    
    // Update stock for each product
    for (const product of orderData.products) {
      await updateProductStock(product.productId, product.color, product.quantity);
    }
    
    return docRef.id;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

/**
 * Get all orders for a user
 */
export const getUserOrders = async (uid: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(firestore, "orders");
    const q = query(
      ordersRef, 
      where("uid", "==", uid),
      orderBy("created_at", "desc")
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orderRef = doc(firestore, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      return null;
    }
    
    return {
      id: orderSnap.id,
      ...orderSnap.data()
    } as Order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  orderId: string, 
  status: Order["orderStatus"]
): Promise<void> => {
  try {
    const orderRef = doc(firestore, "orders", orderId);
    
    await updateDoc(orderRef, {
      orderStatus: status,
      updated_at: Timestamp.now()
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
