import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import type { User as UserType, Address } from '../../types/phase2';

interface CustomerDetailsCardProps {
  user: UserType;
  shippingAddress: Address;
  billingAddress: Address;
}

export const CustomerDetailsCard: React.FC<CustomerDetailsCardProps> = ({ 
  user, 
  shippingAddress, 
  billingAddress 
}) => {
  const formatAddress = (address: Address) => {
    return (
      <>
        <p className="font-medium text-gray-900">{address.fullName}</p>
        <p className="text-sm text-gray-600">{address.addressLine1}</p>
        {address.addressLine2 && <p className="text-sm text-gray-600">{address.addressLine2}</p>}
        <p className="text-sm text-gray-600">
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p className="text-sm text-gray-600">{address.country}</p>
        <p className="text-sm text-gray-600 mt-1">
          <Phone className="w-3 h-3 inline mr-1" />
          {address.phone}
        </p>
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        Customer Details
      </h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{user.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                {user.email}
              </a>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${user.phone}`} className="text-blue-600 hover:underline">
                  {user.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Shipping Address
          </h4>
          <div className="text-sm space-y-1">
            {formatAddress(shippingAddress)}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Billing Address
          </h4>
          <div className="text-sm space-y-1">
            {formatAddress(billingAddress)}
          </div>
        </div>
      </div>
    </div>
  );
};
