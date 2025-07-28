import React, { useState } from "react";
import { X } from "lucide-react";
import { updateSubcategory } from "../../lib/api";
import { useToast } from "../../components/ui/toast";
import { useQueryClient } from "@tanstack/react-query";

interface EditSubcategoryProps {
  subcategory: {
    _id: string;
    name: string;
    description?: string;
    parentCategory: {
      _id: string;
      name: string;
    };
  };
  onSave: (data: { name: string; description?: string }) => void | Promise<void>;
  onCancel: () => void;
}

const EditSubcategory: React.FC<EditSubcategoryProps> = ({ subcategory, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: subcategory.name || "",
    description: subcategory.description || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showToast("Subcategory name is required", "error");
      return;
    }

    setIsLoading(true);
    
    try {
      await updateSubcategory(subcategory._id, {
        
        name: formData.name.trim(),
        description: formData.description.trim(),
        parentCategory: subcategory.parentCategory._id,
      });
      
      showToast("Subcategory updated successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      onSave(formData);
    } catch (error) {
      console.error("Error updating subcategory:", error);
      showToast("Failed to update subcategory. Please try again.", "error");
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
        <h2 className="text-xl font-semibold text-[#1c1c1c]">Edit Subcategory</h2>
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
          <label htmlFor="parentCategory" className="block text-sm font-medium text-[#1c1c1c] mb-2">
            Parent Category
          </label>
          <input
            type="text"
            id="parentCategory"
            value={subcategory.parentCategory.name}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            disabled
            readOnly
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#1c1c1c] mb-2">
            Subcategory Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter subcategory name"
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
            placeholder="Enter subcategory description"
            disabled={isLoading}
          />
        </div>

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
            {isLoading ? "Updating..." : "Update Subcategory"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSubcategory;