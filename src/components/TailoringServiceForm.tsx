import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createTailoringAppointment } from "@/lib/tailoringService";
import { useState } from 'react';

interface TailoringServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TailoringServiceForm = ({ isOpen, onClose }: TailoringServiceFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    preferredDate: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.phone.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.email.trim()) {
      toast({
        title: "Error", 
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.address.trim()) {
      toast({
        title: "Error",
        description: "Please enter your address.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.preferredDate) {
      toast({
        title: "Error",
        description: "Please select your preferred date.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if date is in the future
    const selectedDate = new Date(formData.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast({
        title: "Error",
        description: "Please select a future date for your appointment.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('📝 Submitting tailoring appointment:', formData);
      
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }
      
      // Create appointment in Firestore
      const appointmentId = await createTailoringAppointment({
        uid: user.uid,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        preferredDate: formData.preferredDate,
        notes: formData.notes.trim() || undefined
      });
      
      console.log('✅ Tailoring appointment created successfully:', appointmentId);
      
      toast({
        title: "Request Submitted Successfully!",
        description: "Our team will contact you within 24 hours to confirm your appointment.",
      });
      
      // Reset form and close dialog
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        preferredDate: '',
        notes: ''
      });
      
      onClose();
    } catch (error) {
      console.error('❌ Error submitting tailoring appointment:', error);
      
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Prevent closing dialog while submitting
      if (!open && isSubmitting) {
        return;
      }
      onClose();
    }}>
      <DialogContent className="sm:max-w-[500px]" onEscapeKeyDown={(e) => {
        // Prevent closing with ESC key while submitting
        if (isSubmitting) {
          e.preventDefault();
        }
      }} onPointerDownOutside={(e) => {
        // Prevent closing by clicking outside while submitting
        if (isSubmitting) {
          e.preventDefault();
        }
      }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair">Book Tailoring Service</DialogTitle>
          <DialogDescription>
            Enter your details below and our expert tailoring team will visit you at your preferred location.
          </DialogDescription>
        </DialogHeader>

        {/* Charges Information Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900 mb-1">Tailoring Charges Apply</p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Please note that tailoring service charges will be applicable based on the type of garment and customization required. Our team will provide you with a detailed quote during the consultation.
            </p>
          </div>
        </div>
        
        {/* Loading overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm text-gray-600 font-medium">Submitting your request...</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              placeholder="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
            />
            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Full Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className={`min-h-[100px] ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Preferred Date for Visit"
              name="preferredDate"
              type="date"
              value={formData.preferredDate}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
              className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Additional Notes (Optional)"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`min-h-[80px] ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
          
          {/* Submit button with loading state */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </div>
            ) : (
              "Schedule Appointment"
            )}
          </Button>
          
          {/* Warning during submission */}
          {isSubmitting && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm text-yellow-800">
                  <strong>Please wait...</strong> Do not close this dialog while submitting your request.
                </p>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};