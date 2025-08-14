import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCategory } from "../../lib/api";
import ImageGuidelinesModal from '../../components/ui/ImageGuidelinesModal';


export const AddCategory: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryImage: "",
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setFormData({ name: "", description: "" ,categoryImage: ""});
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1c1c1c]">Add Category</h1>

      <Card className="max-w-md">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px]">
                Category Name<span className="text-[#ff0202]">*</span>
              </label>
              <Input
                className="h-12 pl-6 rounded-xl border border-[#dadada]"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px]">
                Description
              </label>
              <Textarea
                className="h-[100px] pt-3 pl-6 rounded-xl border border-[#dadada] resize-none"
                placeholder="Enter category description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px] flex items-center gap-2">
                Category Image URL
                <button
                  type="button"
                  className="text-xs text-blue-600 underline hover:text-blue-800"
                  onClick={() => setIsGuidelinesOpen(true)}
                >
                  View Image Guidelines
                </button>
              </label>
              <Input
                className="h-12 pl-6 rounded-xl border border-[#dadada]"
                placeholder="Enter Category Image URL"
                value={formData.categoryImage}
                onChange={(e) => handleInputChange("categoryImage", e.target.value)}
              />
              {formData.categoryImage && (
                <div className="w-full max-w-[200px] aspect-square bg-gray-100 rounded-xl object-cover border border-gray-200 mt-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={formData.categoryImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '1/1' }}
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Add Category
            </button>
            <ImageGuidelinesModal isOpen={isGuidelinesOpen} onClose={() => setIsGuidelinesOpen(false)} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};