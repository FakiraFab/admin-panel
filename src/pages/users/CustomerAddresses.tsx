import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Plus } from 'lucide-react';
import { getUserAddresses, updateAddress, deleteAddress, getUserById } from '../../lib/api';
import { useToast } from '../../components/ui/toast';
import { EmptyState } from '../../components/ui/EmptyState';
import { AddressCard } from '../../components/addresses/AddressCard';
import { AddressEditModal } from '../../components/addresses/AddressEditModal';
import { AddressDeleteConfirm } from '../../components/addresses/AddressDeleteConfirm';
import type { Address, User } from '../../types/phase2';

export const CustomerAddresses: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch user info
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });

  // Fetch addresses
  const { data: addresses = [], isLoading: isLoadingAddresses, error } = useQuery({
    queryKey: ['addresses', userId],
    queryFn: () => getUserAddresses(userId!),
    enabled: !!userId,
  });

  const isLoading = isLoadingUser || isLoadingAddresses;

  const handleSetDefault = async (address: Address) => {
    if (!address._id) return;

    try {
      await updateAddress(address._id, { isDefault: true });
      showToast('Default address updated successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['addresses', userId] });
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update default address', 'error');
    }
  };

  const handleDeleteAddress = async () => {
    if (!deletingAddress?._id) return;

    setIsDeleting(true);
    try {
      await deleteAddress(deletingAddress._id);
      showToast('Address deleted successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['addresses', userId] });
      setDeletingAddress(null);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to delete address', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/users')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isLoadingUser ? 'Loading...' : `${user?.name}'s Addresses`}
            </h1>
            <p className="text-gray-600">Manage customer shipping and billing addresses</p>
          </div>
          <button
            disabled
            title="Add New Address - Coming Soon"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-md cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading addresses. Please try again.</p>
        </div>
      ) : addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No addresses found"
          description="This customer hasn't added any addresses yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={setEditingAddress}
              onDelete={setDeletingAddress}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {editingAddress && (
        <AddressEditModal
          address={editingAddress}
          isOpen={!!editingAddress}
          onClose={() => setEditingAddress(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['addresses', userId] });
            setEditingAddress(null);
          }}
        />
      )}

      <AddressDeleteConfirm
        address={deletingAddress}
        isOpen={!!deletingAddress}
        onClose={() => setDeletingAddress(null)}
        onConfirm={handleDeleteAddress}
        isLoading={isDeleting}
      />
    </div>
  );
};
