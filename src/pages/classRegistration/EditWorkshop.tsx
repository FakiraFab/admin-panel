import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../components/ui/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateWorkshop } from '../../lib/api';

interface WorkshopForm {
  name: string;
  description: string;
  dateTime: string;
  duration: string;
  maxParticipants: string;
  price: string;
  location: string;
  requirements: string;
}

interface WorkshopErrors {
  name?: string;
  description?: string;
  dateTime?: string;
  duration?: string;
  maxParticipants?: string;
  price?: string;
  location?: string;
}

interface EditWorkshopProps {
  workshop: any;
  onClose: () => void;
}

export const EditWorkshop: React.FC<EditWorkshopProps> = ({ workshop, onClose }) => {
  const [formData, setFormData] = useState<WorkshopForm>({
    name: workshop.name || '',
    description: workshop.description || '',
    dateTime: workshop.dateTime ? new Date(workshop.dateTime).toISOString().slice(0, 16) : '',
    duration: workshop.duration || '',
    maxParticipants: workshop.maxParticipants?.toString() || '',
    price: workshop.price?.toString() || '',
    location: workshop.location || '',
    requirements: workshop.requirements || ''
  });

  const [errors, setErrors] = useState<WorkshopErrors>({});
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: any) => updateWorkshop(workshop._id, data),
    onSuccess: () => {
      showToast('Workshop updated successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
      onClose();
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to update workshop', 'error');
    }
  });

  const handleInputChange = (name: keyof WorkshopForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof WorkshopErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: WorkshopErrors = {};
    const required = ['name', 'description', 'dateTime', 'duration', 'maxParticipants', 'price', 'location'];

    required.forEach(field => {
      if (!formData[field as keyof WorkshopForm].trim()) {
        newErrors[field as keyof WorkshopErrors] = 'This field is required';
      }
    });

    // Additional validations
    if (formData.maxParticipants && !/^\d+$/.test(formData.maxParticipants)) {
      newErrors.maxParticipants = 'Must be a valid number';
    }

    if (formData.price && !/^\d+(\.\d{1,2})?$/.test(formData.price)) {
      newErrors.price = 'Must be a valid price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    mutation.mutate({
      ...formData,
      maxParticipants: parseInt(formData.maxParticipants),
      price: parseFloat(formData.price)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1c1c1c]">Edit Workshop</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workshop Name*
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
              placeholder="Enter workshop name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={16} />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={errors.description ? 'border-red-500' : ''}
              placeholder="Enter workshop description"
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={16} />
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date and Time*
              </label>
              <Input
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => handleInputChange('dateTime', e.target.value)}
                className={errors.dateTime ? 'border-red-500' : ''}
              />
              {errors.dateTime && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={16} />
                  {errors.dateTime}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration*
              </label>
              <Input
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className={errors.duration ? 'border-red-500' : ''}
                placeholder="e.g., 2 hours"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={16} />
                  {errors.duration}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Participants*
              </label>
              <Input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                className={errors.maxParticipants ? 'border-red-500' : ''}
                placeholder="Enter max participants"
              />
              {errors.maxParticipants && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={16} />
                  {errors.maxParticipants}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price*
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={errors.price ? 'border-red-500' : ''}
                placeholder="Enter price"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={16} />
                  {errors.price}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location*
            </label>
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={errors.location ? 'border-red-500' : ''}
              placeholder="Enter workshop location"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={16} />
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements (Optional)
            </label>
            <Textarea
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              placeholder="Enter any special requirements or prerequisites"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Updating...' : 'Update Workshop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
