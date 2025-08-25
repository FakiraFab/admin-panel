import { useState } from 'react';
import { X, Save, User, Mail, Phone, MapPin, Package, MessageSquare } from 'lucide-react';
import type { Enquiry } from '../../types';
import { updateInquiry } from '../../lib/api';




interface EditInquiryProps {  
  inquiry: Enquiry;
  
  onSave: () => void;
  onCancel: () => void;
}




const EditInquiry: React.FC<EditInquiryProps> = ({ inquiry, onSave, onCancel }) => {
  console.log('Received inquiry prop:', inquiry);
  
  const [formData, setFormData] = useState({
    userName: inquiry.userName || '',
    userEmail: inquiry.userEmail || '',
    whatsappNumber: inquiry.whatsappNumber || '',
    buyOption: inquiry.buyOption || 'Personal',
    location: inquiry.location || '',
    quantity: inquiry.quantity || 1,
    variant: inquiry.variant || '',
    message: inquiry.message || '',
    status: inquiry.status || 'Pending',
    companyName: inquiry.companyName || '',
  });

  console.log('Initial formData:', formData);

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would typically make an API call to update the inquiry
      
      
      await updateInquiry(inquiry._id, formData);
      onSave();
    } catch (error) {
      console.error('Failed to update inquiry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buyOptions = ['Personal', 'Wholesale', 'Other'];
  const statusOptions = ['Pending', 'Processing', 'Completed', 'Cancelled'];

  return (
    <div className="bg-white rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Edit Inquiry</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          {inquiry.productImage && (
            <img
              src={inquiry.productImage}
              alt={inquiry.productName}
              className="w-16 h-16 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
          <div>
            <h3 className="font-medium text-gray-900">{inquiry.productName}</h3>
            <p className="text-sm text-gray-500">Product ID: {inquiry.product?._id}</p>
            {inquiry.variant && (
              <p className="text-sm text-gray-600">Variant: {inquiry.variant}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4" />
              Customer Information
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {formData.buyOption === 'Wholesale' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Order Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Order Information
            </h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buy Option
              </label>
              <select
                name="buyOption"
                value={formData.buyOption}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {buyOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity (Meters)
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variant
              </label>
              <input
                type="text"
                name="variant"
                value={formData.variant}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Customer message..."
          />
        </div>

        {/* Metadata */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-700 mb-2">Inquiry Details</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Created:</span>{' '}
              {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString() : 'N/A'}
            </div>
            <div>
              <span className="font-medium">Inquiry ID:</span> {inquiry._id}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInquiry;