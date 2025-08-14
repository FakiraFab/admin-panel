import React, { useState } from "react";
import { X } from "lucide-react";
import { updateCategory } from "../../lib/api";
import { useToast } from "../../components/ui/toast";
import { useQueryClient } from "@tanstack/react-query";
import ImageGuidelinesModal from '../../components/ui/ImageGuidelinesModal';

interface EditCategoryProps {
  category: {
    _id: string;
    name: string;
    description?: string;
    categoryImage?: string;
  };
  onSave: () => void;
  onCancel: () => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({ category, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: category.name || "",
    description: category.description || "",
    categoryImage: category.categoryImage || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showToast("Category name is required", "error");
      return;
    }

    setIsLoading(true);
    
    try {
      
      await updateCategory(category._id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        categoryImage: formData.categoryImage.trim(),
      });
      
      showToast("Category updated successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onSave();
    } catch (error) {
      console.error("Error updating category:", error);
      showToast("Failed to update category. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#1c1c1c]">Edit Category</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={isLoading}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#1c1c1c] mb-2">
            Category Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter category name"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[#1c1c1c] mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter category description"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="categoryImage" className="block text-sm font-medium text-[#1c1c1c] mb-2 flex items-center gap-2">
            Category Image URL
            <button
              type="button"
              className="text-xs text-blue-600 underline hover:text-blue-800"
              onClick={() => setIsGuidelinesOpen(true)}
            >
              View Image Guidelines
            </button>
          </label>
          <input
            type="url"
            id="categoryImage"
            name="categoryImage"
            value={formData.categoryImage}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
            disabled={isLoading}
          />
        </div>

        {formData.categoryImage && (
          <div>
            <label className="block text-sm font-medium text-[#1c1c1c] mb-2">
              Image Preview
            </label>
            <div className="w-full max-w-[200px] aspect-square border border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
              <img
                src={formData.categoryImage}
                alt="Category preview"
                className="w-full h-full object-cover"
                style={{ aspectRatio: '1/1' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Category"}
          </button>
        </div>
        <ImageGuidelinesModal isOpen={isGuidelinesOpen} onClose={() => setIsGuidelinesOpen(false)} />
      </form>
    </div>
  );
};

export default EditCategory;