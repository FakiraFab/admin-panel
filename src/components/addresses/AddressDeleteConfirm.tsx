import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Address } from '../../types/phase2';

interface AddressDeleteConfirmProps {
  address: Address | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const AddressDeleteConfirm: React.FC<AddressDeleteConfirmProps> = ({
  address,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen || !address) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-6 py-4">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Delete Address
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-500 text-center mb-4">
              Are you sure you want to delete this address? This action cannot be undone.
            </p>

            {/* Address Preview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{address.fullName}</p>
                <p className="text-gray-600 mt-1">{address.city}, {address.state}</p>
                <p className="text-gray-600">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800 mt-1">
                    {address.addressType}
                  </span>
                </p>
              </div>
            </div>

            {/* Warning for default address */}
            {address.isDefault && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ This is a default address. You should not delete it.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Deleting...' : 'Delete Address'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
