import React, { useState } from 'react';
import { PlusIcon, EditIcon, TrashIcon, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBanners, addBanner, updateBanner, deleteBanner } from '../../lib/api';
import { useToast } from '../../components/ui/toast';
import { Pagination } from '../../components/ui/Pagination';
import ImageGuidelinesModal from '../../components/ui/ImageGuidelinesModal';

interface BannerForm {
  title: string;
  image: string;
  link?: string;
  isActive: boolean;
}

interface BannerErrors {
  title?: string;
  image?: string;
  imageLoad?: boolean;
}

export const Banners: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [formData, setFormData] = useState<BannerForm>({
    title: '',
    image: '',
    link: '',
    isActive: true
  });
  const [errors, setErrors] = useState<BannerErrors>({});
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Fetch banners
  const { data: bannerData, isLoading } = useQuery({
    queryKey: ['banners', currentPage],
    queryFn: () => fetchBanners({ page: currentPage, limit: itemsPerPage })
  });

  // Add banner mutation
  const addMutation = useMutation({
    mutationFn: addBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      showToast('Banner added successfully!', 'success');
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to add banner', 'error');
    }
  });

  // Update banner mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      showToast('Banner updated successfully!', 'success');
      setEditingBanner(null);
      resetForm();
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to update banner', 'error');
    }
  });

  // Delete banner mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      showToast('Banner deleted successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to delete banner', 'error');
    }
  });

  const handleInputChange = (name: keyof BannerForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user types
    if (errors[name as keyof BannerErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: BannerErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageError = () => {
    setErrors(prev => ({
      ...prev,
      imageLoad: true
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner._id, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      image: banner.image,
      link: banner.link || '',
      isActive: banner.isActive
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = (banner: any) => {
    showToast('Are you sure you want to delete this banner?', 'confirm', {
      onConfirm: () => deleteMutation.mutate(banner._id),
      onCancel: () => showToast('Delete cancelled.', 'info')
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      image: '',
      link: '',
      isActive: true
    });
    setErrors({});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1c1c1c]">Banners</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingBanner(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Banner
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading banners...</p>
              </div>
            ) : bannerData?.data?.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No banners found</p>
              </div>
            ) : (
              <div className="min-w-full divide-y divide-gray-200">
                {bannerData?.data?.map((banner: any) => (
                  <div key={banner._id} className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 relative">
                        {banner.image ? (
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/image.svg'; // fallback image
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${banner.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{banner.title}</h3>
                        {banner.link && (
                          <a href={banner.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            {banner.link}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        {bannerData?.totalPages && bannerData.totalPages > 1 && (
          <div className="border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={bannerData.totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#1c1c1c]">
                {editingBanner ? 'Edit Banner' : 'Add Banner'}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={errors.title ? 'border-red-500' : ''}
                  placeholder="Enter banner title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  Image URL
                  <button
                    type="button"
                    className="text-xs text-blue-600 underline hover:text-blue-800"
                    onClick={() => setIsGuidelinesOpen(true)}
                  >
                    View Image Guidelines
                  </button>
                </label>
                <Input
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className={errors.image ? 'border-red-500' : ''}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {errors.image}
                  </p>
                )}
                {formData.image && (
                  <div className="mt-2">
                    {errors.imageLoad ? (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={16} />
                        Failed to load image
                      </p>
                    ) : (
                      <div className="w-full max-w-[320px] aspect-[16/9] bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                        <img
                          src={formData.image}
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                          style={{ aspectRatio: '16/9' }}
                          onError={handleImageError}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link (Optional)
                </label>
                <Input
                  value={formData.link}
                  onChange={(e) => handleInputChange('link', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={addMutation.isPending || updateMutation.isPending}
                >
                  {addMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingBanner
                    ? 'Update Banner'
                    : 'Add Banner'}
                </button>
              </div>
            </form>
            <ImageGuidelinesModal isOpen={isGuidelinesOpen} onClose={() => setIsGuidelinesOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
