import { collection, getDocs, query, where, orderBy, doc, getDoc } from "firebase/firestore";
import { firestore } from "./firebase";

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  active: boolean;
  category?: string;
  displayOrder?: number;
  created_at?: any;
}

export interface ProductVariant {
  color: string;
  price: number;
  stock: number;
  images: string[];
}

export interface Product {
  id: string;
  collectionId: string;
  
  // New variant-based structure
  title?: string;           // Product title (new format)
  variants?: ProductVariant[]; // Array of color variants (new format)
  
  // Old structure (for backward compatibility)
  name?: string;            // Product name (old format)
  price?: number;           // Price (old format)
  basePrice?: number;       // Alternative field name (old format)
  images?: string[];        // Array of image URLs (old format)
  color?: string;           // Single color (old format)
  
  // Common fields
  slug?: string;
  description?: string;
  material?: string;
  weight?: string;
  width?: string;
  care?: string;
  features?: string[];
  thumbnail?: string;
  hasColorVariants?: boolean;
  active: boolean;
  featured?: boolean;
  isFeatured?: boolean;     // Alternative field name
  inStock?: boolean;
  created_at?: any;
  pattern?: string;
  popularity?: number;
  category?: string;
}

export interface ColorVariant {
  id: string;
  productId: string;
  colorName: string;
  colorCode: string;
  price: number;
  discountPrice?: number;
  images: string[];
  inStock: boolean;
  stockQuantity?: number;
  created_at?: any;
}

/**
 * Fetch all active collections ordered by displayOrder
 */
export const getActiveCollections = async (): Promise<Collection[]> => {
  try {
    const q = query(
      collection(firestore, "collections"),
      where("active", "==", true),
      orderBy("displayOrder", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Collection[];
  } catch (error) {
    console.error("Error fetching collections:", error);
    // If orderBy fails (index not created), try without it
    try {
      const q = query(
        collection(firestore, "collections"),
        where("active", "==", true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Collection[];
    } catch (fallbackError) {
      console.error("Error fetching collections (fallback):", fallbackError);
      return [];
    }
  }
};

/**
 * Fetch featured collections for homepage
 */
export const getFeaturedCollections = async (): Promise<Collection[]> => {
  try {
    const collections = await getActiveCollections();
    // For now, return all active collections. Later can add 'featured' field
    return collections.slice(0, 8); // Limit to 8 for featured section
  } catch (error) {
    console.error("Error fetching featured collections:", error);
    return [];
  }
};

/**
 * Fetch a single collection by slug
 */
export const getCollectionBySlug = async (slug: string): Promise<Collection | null> => {
  try {
    const q = query(
      collection(firestore, "collections"),
      where("slug", "==", slug),
      where("active", "==", true)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Collection;
  } catch (error) {
    console.error("Error fetching collection by slug:", error);
    return null;
  }
};

/**
 * Fetch a single collection by ID
 */
export const getCollectionById = async (collectionId: string): Promise<Collection | null> => {
  try {
    const docRef = doc(firestore, "collections", collectionId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Collection;
  } catch (error) {
    console.error("Error fetching collection by ID:", error);
    return null;
  }
};

/**
 * Fetch all products in a collection
 */
export const getProductsByCollection = async (collectionId: string): Promise<Product[]> => {
  try {
    const q = query(
      collection(firestore, "products"),
      where("collectionId", "==", collectionId),
      where("active", "==", true),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products by collection:", error);
    // Fallback without orderBy
    try {
      const q = query(
        collection(firestore, "products"),
        where("collectionId", "==", collectionId),
        where("active", "==", true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (fallbackError) {
      console.error("Error fetching products (fallback):", fallbackError);
      return [];
    }
  }
};

/**
 * Fetch featured products for homepage
 */
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(firestore, "products"),
      where("featured", "==", true),
      where("active", "==", true),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    // Fallback without orderBy
    try {
      const q = query(
        collection(firestore, "products"),
        where("featured", "==", true),
        where("active", "==", true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (fallbackError) {
      console.error("Error fetching featured products (fallback):", fallbackError);
      return [];
    }
  }
};

/**
 * Fetch all active products (for random selection)
 */
export const getAllActiveProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(firestore, "products"),
      where("active", "==", true),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error("Error fetching all products:", error);
    // Fallback without orderBy
    try {
      const q = query(
        collection(firestore, "products"),
        where("active", "==", true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (fallbackError) {
      console.error("Error fetching all products (fallback):", fallbackError);
      return [];
    }
  }
};

/**
 * Fetch a single product by ID
 */
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const docRef = doc(firestore, "products", productId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

/**
 * Fetch color variants for a product
 */
export const getColorVariantsByProduct = async (productId: string): Promise<ColorVariant[]> => {
  try {
    const q = query(
      collection(firestore, "color_variants"),
      where("productId", "==", productId),
      orderBy("colorName", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ColorVariant[];
  } catch (error) {
    console.error("Error fetching color variants:", error);
    // Fallback without orderBy
    try {
      const q = query(
        collection(firestore, "color_variants"),
        where("productId", "==", productId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ColorVariant[];
    } catch (fallbackError) {
      console.error("Error fetching color variants (fallback):", fallbackError);
      return [];
    }
  }
};
