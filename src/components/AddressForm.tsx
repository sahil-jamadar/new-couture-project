import { useState } from "react";
import { AddressInput } from "@/lib/addressService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface AddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (addressData: AddressInput) => Promise<void>;
  loading?: boolean;
}

export const AddressForm = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}: AddressFormProps) => {
  const [formData, setFormData] = useState<AddressInput>({
    addressLine1: "",
    addressLine2: "",
    state: "",
    district: "",
    pincode: "",
    mobileNumber: "",
    isDefault: false
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AddressInput, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddressInput, string>> = {};

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address Line 1 is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.district.trim()) {
      newErrors.district = "District is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        addressLine1: "",
        addressLine2: "",
        state: "",
        district: "",
        pincode: "",
        mobileNumber: "",
        isDefault: false
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error submitting address:", error);
    }
  };

  const handleChange = (field: keyof AddressInput, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="addressLine1">
              Address Line 1 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="addressLine1"
              placeholder="House No., Building Name"
              value={formData.addressLine1}
              onChange={(e) => handleChange("addressLine1", e.target.value)}
              disabled={loading}
            />
            {errors.addressLine1 && (
              <p className="text-sm text-red-500">{errors.addressLine1}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input
              id="addressLine2"
              placeholder="Road Name, Area, Colony"
              value={formData.addressLine2}
              onChange={(e) => handleChange("addressLine2", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="district">
                District <span className="text-red-500">*</span>
              </Label>
              <Input
                id="district"
                placeholder="District"
                value={formData.district}
                onChange={(e) => handleChange("district", e.target.value)}
                disabled={loading}
              />
              {errors.district && (
                <p className="text-sm text-red-500">{errors.district}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">
                State <span className="text-red-500">*</span>
              </Label>
              <Input
                id="state"
                placeholder="State"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                disabled={loading}
              />
              {errors.state && (
                <p className="text-sm text-red-500">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pincode">
                Pincode <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pincode"
                placeholder="000000"
                value={formData.pincode}
                onChange={(e) => handleChange("pincode", e.target.value)}
                maxLength={6}
                disabled={loading}
              />
              {errors.pincode && (
                <p className="text-sm text-red-500">{errors.pincode}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mobileNumber"
                placeholder="0000000000"
                value={formData.mobileNumber}
                onChange={(e) => handleChange("mobileNumber", e.target.value)}
                maxLength={10}
                disabled={loading}
              />
              {errors.mobileNumber && (
                <p className="text-sm text-red-500">{errors.mobileNumber}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) => handleChange("isDefault", checked as boolean)}
              disabled={loading}
            />
            <Label
              htmlFor="isDefault"
              className="text-sm font-normal cursor-pointer"
            >
              Set as default address
            </Label>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
