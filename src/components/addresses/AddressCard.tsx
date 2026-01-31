import React from 'react';
import { MapPin, Phone, Edit, Trash2, Star } from 'lucide-react';
import type { Address } from '../../types/phase2';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  const getAddressTypeBadge = (type: string) => {
    const styles = {
      home: 'bg-blue-100 text-blue-800',
      work: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return styles[type as keyof typeof styles] || styles.other;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{address.fullName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAddressTypeBadge(address.addressType)}`}>
              {address.addressType}
            </span>
            {address.isDefault && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                Default
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p>{address.addressLine1}</p>
            {address.addressLine2 && <p>{address.addressLine2}</p>}
            <p>{address.city}, {address.state} {address.postalCode}</p>
            <p>{address.country}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{address.phone}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(address)}
          className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address)}
            className="flex-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
          >
            <Star className="w-4 h-4" />
            Set Default
          </button>
        )}
        <button
          onClick={() => onDelete(address)}
          disabled={address.isDefault}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${
            address.isDefault
              ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
              : 'text-red-600 bg-red-50 hover:bg-red-100'
          }`}
          title={address.isDefault ? 'Cannot delete default address' : 'Delete address'}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
