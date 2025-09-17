import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addReel } from "../../lib/api";
import { useToast } from "../../components/ui/toast";
import { useNavigate } from "react-router-dom";

export const AddReel: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnail: "",
    order: "",
    isActive: true,
  });

  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: addReel,
    onSuccess: () => {
      showToast('Reel created successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ["reels"] });
      navigate('/reels');
    },
    onError: () => {
      showToast('Failed to create reel. Please try again.', 'error');
    },
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      showToast('Title is required.', 'error');
      return;
    }
    
    if (!formData.videoUrl.trim()) {
      showToast('Video URL is required.', 'error');
      return;
    }

    const submitData = {
      ...formData,
      order: formData.order ? parseInt(formData.order) : undefined,
    };

    mutation.mutate(submitData);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1c1c1c]">Add Reel</h1>

      <Card className="max-w-md">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px]">
                Title<span className="text-[#ff0202]">*</span>
              </label>
              <Input
                className="h-12 pl-6 rounded-xl border border-[#dadada]"
                placeholder="Enter reel title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px]">
                Description
              </label>
              <Textarea
                className="h-[100px] pt-3 pl-6 rounded-xl border border-[#dadada] resize-none"
                placeholder="Enter reel description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px]">
                Video URL<span className="text-[#ff0202]">*</span>
              </label>
              <Input
                className="h-12 pl-6 rounded-xl border border-[#dadada]"
                placeholder="Enter video URL"
                value={formData.videoUrl}
                onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px]">
                Thumbnail URL
              </label>
              <Input
                className="h-12 pl-6 rounded-xl border border-[#dadada]"
                placeholder="Enter thumbnail URL"
                value={formData.thumbnail}
                onChange={(e) => handleInputChange("thumbnail", e.target.value)}
              />
              {formData.thumbnail && (
                <img 
                  src={formData.thumbnail} 
                  alt="Thumbnail Preview" 
                  className="w-full h-full rounded-xl object-cover border border-gray-200 mt-2" 
                />
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px]">
                Display Order
              </label>
              <Input
                type="number"
                className="h-12 pl-6 rounded-xl border border-[#dadada]"
                placeholder="Enter display order (optional)"
                value={formData.order}
                onChange={(e) => handleInputChange("order", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px]">
                Status
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="isActive"
                    checked={formData.isActive === true}
                    onChange={() => handleInputChange("isActive", true)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="isActive"
                    checked={formData.isActive === false}
                    onChange={() => handleInputChange("isActive", false)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Inactive</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-12 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? 'Creating...' : 'Add Reel'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 