import React from 'react';
import { X, Mail, Phone, Calendar, ShoppingBag, MapPin, Heart, ShoppingCart } from 'lucide-react';
import type { User } from '../../types/phase2';
import { format } from 'date-fns';

interface UserDetailsModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-gray-900">{user.name}</h4>
              <div className="flex items-center gap-4 mt-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  user.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  user.isEmailVerified 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.isEmailVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h5 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h5>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="mb-6">
            <h5 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h5>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(user.createdAt), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
              {user.lastLogin && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Last Login</p>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(user.lastLogin), 'MMMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats - Placeholder for future integration */}
          <div className="mb-6">
            <h5 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">-</p>
                    <p className="text-sm text-gray-500">Total Orders</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">-</p>
                    <p className="text-sm text-gray-500">Addresses</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">-</p>
                    <p className="text-sm text-gray-500">Cart Items</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">-</p>
                    <p className="text-sm text-gray-500">Wishlist Items</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">* Activity stats will be available after backend integration</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
