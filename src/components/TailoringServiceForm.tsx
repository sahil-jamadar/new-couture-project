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
import { useState } from 'react';

interface TailoringServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TailoringServiceForm = ({ isOpen, onClose }: TailoringServiceFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    preferredDate: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    
    toast({
      title: "Request Submitted Successfully!",
      description: "Our team will contact you within 24 hours to confirm your appointment.",
    });
    
    onClose();
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      preferredDate: '',
      notes: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair">Book Tailoring Service</DialogTitle>
          <DialogDescription>
            Enter your details below and our expert tailoring team will visit you at your preferred location.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              placeholder="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
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
            />
            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Full Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="min-h-[100px]"
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
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Additional Notes (Optional)"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="min-h-[80px]"
            />
          </div>
          <Button type="submit" className="w-full">
            Schedule Appointment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};