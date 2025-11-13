import { collection, getDocs, addDoc, query, where, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { firestore } from "./firebase";

export interface Address {
  id: string;
  uid: string; // User ID
  addressLine1: string;
  addressLine2?: string;
  state: string;
  district: string;
  pincode: string;
  mobileNumber: string;
  isDefault?: boolean;
  created_at?: any;
  updated_at?: any;
}

export interface AddressInput {
  addressLine1: string;
  addressLine2?: string;
  state: string;
  district: string;
  pincode: string;
  mobileNumber: string;
  isDefault?: boolean;
}

/**
 * Get all addresses for a specific user
 */
export const getUserAddresses = async (uid: string): Promise<Address[]> => {
  try {
    const addressesRef = collection(firestore, "addresses");
    const q = query(addressesRef, where("uid", "==", uid));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Address));
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    throw error;
  }
};

/**
 * Add a new address for a user
 */
export const addAddress = async (uid: string, addressData: AddressInput): Promise<string> => {
  try {
    const addressesRef = collection(firestore, "addresses");
    
    // If this is set as default, unset other default addresses
    if (addressData.isDefault) {
      const existingAddresses = await getUserAddresses(uid);
      const defaultAddress = existingAddresses.find(addr => addr.isDefault);
      
      if (defaultAddress) {
        const defaultAddressRef = doc(firestore, "addresses", defaultAddress.id);
        await updateDoc(defaultAddressRef, { isDefault: false });
      }
    }
    
    const docRef = await addDoc(addressesRef, {
      uid,
      ...addressData,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
};

/**
 * Update an existing address
 */
export const updateAddress = async (addressId: string, addressData: Partial<AddressInput>): Promise<void> => {
  try {
    const addressRef = doc(firestore, "addresses", addressId);
    
    await updateDoc(addressRef, {
      ...addressData,
      updated_at: Timestamp.now()
    });
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

/**
 * Delete an address
 */
export const deleteAddress = async (addressId: string): Promise<void> => {
  try {
    const addressRef = doc(firestore, "addresses", addressId);
    await deleteDoc(addressRef);
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
};

/**
 * Set an address as default
 */
export const setDefaultAddress = async (uid: string, addressId: string): Promise<void> => {
  try {
    // Unset all default addresses for this user
    const addresses = await getUserAddresses(uid);
    
    for (const addr of addresses) {
      if (addr.isDefault) {
        const addrRef = doc(firestore, "addresses", addr.id);
        await updateDoc(addrRef, { isDefault: false });
      }
    }
    
    // Set the selected address as default
    const addressRef = doc(firestore, "addresses", addressId);
    await updateDoc(addressRef, { 
      isDefault: true,
      updated_at: Timestamp.now()
    });
  } catch (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
};
