import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, where, updateDoc, doc } from "firebase/firestore";
import { firestore } from "./firebase";

// Interface for tailoring appointment data
export interface TailoringAppointment {
  id?: string;
  uid: string; // User ID from Firebase Auth
  name: string;
  phone: string;
  email: string;
  address: string;
  preferredDate: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: any;
  updatedAt: any;
}

// Create a new tailoring appointment
export const createTailoringAppointment = async (appointmentData: Omit<TailoringAppointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
  try {
    console.log("📝 Creating tailoring appointment:", appointmentData);
    
    const appointmentWithMetadata = {
      ...appointmentData,
      status: 'pending' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(firestore, "tailoring_appointments"), appointmentWithMetadata);
    console.log("✅ Tailoring appointment created with ID:", docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error("❌ Error creating tailoring appointment:", error);
    throw error;
  }
};

// Get all tailoring appointments (for admin panel)
export const getTailoringAppointments = async () => {
  try {
    console.log("📡 Fetching all tailoring appointments...");
    
    const q = query(
      collection(firestore, "tailoring_appointments"),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const appointments: TailoringAppointment[] = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data()
      } as TailoringAppointment);
    });
    
    console.log("✅ Fetched tailoring appointments:", appointments.length);
    return appointments;
  } catch (error) {
    console.error("❌ Error fetching tailoring appointments:", error);
    throw error;
  }
};

// Get appointments by status
export const getTailoringAppointmentsByStatus = async (status: TailoringAppointment['status']) => {
  try {
    console.log("📡 Fetching tailoring appointments by status:", status);
    
    const q = query(
      collection(firestore, "tailoring_appointments"),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const appointments: TailoringAppointment[] = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data()
      } as TailoringAppointment);
    });
    
    console.log(`✅ Fetched ${appointments.length} ${status} appointments`);
    return appointments;
  } catch (error) {
    console.error("❌ Error fetching appointments by status:", error);
    throw error;
  }
};

// Get appointments for a specific user
export const getUserTailoringAppointments = async (uid: string) => {
  try {
    console.log("📡 Fetching tailoring appointments for user:", uid);
    
    const q = query(
      collection(firestore, "tailoring_appointments"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const appointments: TailoringAppointment[] = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data()
      } as TailoringAppointment);
    });
    
    console.log(`✅ Fetched ${appointments.length} appointments for user`);
    return appointments;
  } catch (error) {
    console.error("❌ Error fetching user appointments:", error);
    // Fallback without orderBy if createdAt field is missing
    try {
      const q = query(
        collection(firestore, "tailoring_appointments"),
        where("uid", "==", uid)
      );
      
      const querySnapshot = await getDocs(q);
      const appointments: TailoringAppointment[] = [];
      
      querySnapshot.forEach((doc) => {
        appointments.push({
          id: doc.id,
          ...doc.data()
        } as TailoringAppointment);
      });
      
      console.log(`✅ Fetched ${appointments.length} appointments for user (fallback)`);
      return appointments;
    } catch (fallbackError) {
      console.error("❌ Fallback query also failed:", fallbackError);
      throw fallbackError;
    }
  }
};

// Update appointment status
export const updateTailoringAppointmentStatus = async (appointmentId: string, newStatus: TailoringAppointment['status']) => {
  try {
    console.log("🔄 Updating appointment status:", appointmentId, "->", newStatus);
    
    const appointmentRef = doc(firestore, "tailoring_appointments", appointmentId);
    await updateDoc(appointmentRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    
    console.log("✅ Appointment status updated successfully");
  } catch (error) {
    console.error("❌ Error updating appointment status:", error);
    throw error;
  }
};

// Get appointments by date range
export const getTailoringAppointmentsByDateRange = async (startDate: Date, endDate: Date) => {
  try {
    console.log("📡 Fetching appointments between:", startDate, "and", endDate);
    
    const q = query(
      collection(firestore, "tailoring_appointments"),
      where("preferredDate", ">=", startDate.toISOString().split('T')[0]),
      where("preferredDate", "<=", endDate.toISOString().split('T')[0]),
      orderBy("preferredDate", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const appointments: TailoringAppointment[] = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data()
      } as TailoringAppointment);
    });
    
    console.log(`✅ Fetched ${appointments.length} appointments for date range`);
    return appointments;
  } catch (error) {
    console.error("❌ Error fetching appointments by date range:", error);
    throw error;
  }
};