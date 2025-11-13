import { useState } from "react";
import { Address } from "@/lib/addressService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, MapPin, Plus } from "lucide-react";

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (addressId: string) => void;
  onAddNewAddress: () => void;
  loading?: boolean;
}

export const AddressSelector = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
  loading = false
}: AddressSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Select Delivery Address
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddNewAddress}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <Card className="p-8 text-center border-dashed">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Addresses Found
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Add a delivery address to continue with your order
          </p>
          <Button onClick={onAddNewAddress} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedAddressId === address.id
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => onSelectAddress(address.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedAddressId === address.id
                        ? "border-primary bg-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAddressId === address.id && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      {address.isDefault && (
                        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {address.addressLine1}
                    </p>
                    
                    {address.addressLine2 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {address.addressLine2}
                      </p>
                    )}
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {address.district}, {address.state} - {address.pincode}
                    </p>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      Mobile: {address.mobileNumber}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
