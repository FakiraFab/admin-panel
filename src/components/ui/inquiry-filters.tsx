import React from 'react';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { X } from 'lucide-react';

interface InquiryFiltersProps {
  filters: {
    userName?: string;
    userEmail?: string;
    whatsappNumber?: string;
    buyOption?: string;
    location?: string;
    companyName?: string;
    productName?: string;
    variant?: string;
    status?: string;
    createdFrom?: string;
    createdTo?: string;
    updatedFrom?: string;
    updatedTo?: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const InquiryFilters: React.FC<InquiryFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Search Filters</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Customer Information</h4>
              <Input
                type="text"
                placeholder="Customer Name"
                value={filters.userName || ''}
                onChange={(e) => onFilterChange('userName', e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email"
                value={filters.userEmail || ''}
                onChange={(e) => onFilterChange('userEmail', e.target.value)}
              />
              <Input
                type="tel"
                placeholder="WhatsApp Number"
                value={filters.whatsappNumber || ''}
                onChange={(e) => onFilterChange('whatsappNumber', e.target.value)}
              />
              <Input
                type="text"
                placeholder="Location"
                value={filters.location || ''}
                onChange={(e) => onFilterChange('location', e.target.value)}
              />
              <Input
                type="text"
                placeholder="Company Name"
                value={filters.companyName || ''}
                onChange={(e) => onFilterChange('companyName', e.target.value)}
              />
            </div>

            {/* Product Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Product Information</h4>
              <Input
                type="text"
                placeholder="Product Name"
                value={filters.productName || ''}
                onChange={(e) => onFilterChange('productName', e.target.value)}
              />
              <Input
                type="text"
                placeholder="Variant"
                value={filters.variant || ''}
                onChange={(e) => onFilterChange('variant', e.target.value)}
              />
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Buy Option</label>
                <Select
                  value={filters.buyOption || ''}
                  onValueChange={(value) => onFilterChange('buyOption', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Buy Option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Options</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Wholesale">Wholesale</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Status</label>
                <Select
                  value={filters.status || ''}
                  onValueChange={(value) => onFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700">Date Filters</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Created Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={filters.createdFrom || ''}
                    onChange={(e) => onFilterChange('createdFrom', e.target.value)}
                  />
                  <Input
                    type="date"
                    value={filters.createdTo || ''}
                    onChange={(e) => onFilterChange('createdTo', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Updated Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={filters.updatedFrom || ''}
                    onChange={(e) => onFilterChange('updatedFrom', e.target.value)}
                  />
                  <Input
                    type="date"
                    value={filters.updatedTo || ''}
                    onChange={(e) => onFilterChange('updatedTo', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};