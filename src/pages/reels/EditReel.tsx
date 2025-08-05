import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReel } from "../../lib/api";
import { useToast } from "../../components/ui/toast";
import { XIcon } from "lucide-react";

interface EditReelProps {
  reel: any;
  onSave: () => void;
  onCancel: () => void;
}

const EditReel: React.FC<EditReelProps> = ({ reel, onSave, onCancel }) => {
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

  useEffect(() => {
    if (reel) {
      setFormData({
        title: reel.title || "",
        description: reel.description || "",
        videoUrl: reel.videoUrl || "",
        thumbnail: reel.thumbnail || "",
        order: reel.order?.toString() || "",
        isActive: reel.isActive ?? true,
      });
    }
  }, [reel]);

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateReel(id, data),
    onSuccess: () => {
      showToast('Reel updated successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ["reels"] });
      onSave();
    },
    onError: () => {
      showToast('Failed to update reel. Please try again.', 'error');
    },
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

    mutation.mutate({ id: reel._id, data: submitData });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-[#1c1c1c]">Edit Reel</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <XIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <CardContent className="p-6 max-h-[70vh] overflow-y-auto">
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
                className="w-full h-32 rounded-xl object-cover border border-gray-200 mt-2" 
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
        </form>
      </CardContent>

      <div className="sticky bottom-0 bg-white p-6 border-t border-gray-200">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-12 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            onClick={handleSubmit}
            className="flex-1 h-12 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? 'Updating...' : 'Update Reel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReel;