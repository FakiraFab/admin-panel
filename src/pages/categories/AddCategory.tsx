import React, { useState, useRef } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCategory } from "../../lib/api";
import ImageGuidelinesModal from '../../components/ui/ImageGuidelinesModal';
import CloudinaryUploader, { CloudinaryUploaderRef } from "../../components/ui/CloudinaryUploader";

export const AddCategory: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryImage: "",
    categoryBannerImage: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedBannerFiles, setSelectedBannerFiles] = useState<File[]>([]);
  const uploaderRef = useRef<CloudinaryUploaderRef>(null);
  const bannerUploaderRef = useRef<CloudinaryUploaderRef>(null);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setFormData({ name: "", description: "", categoryImage: "", categoryBannerImage: "" });
      setSelectedFiles([]);
      setSelectedBannerFiles([]);
      setErrors({});
    },
  });

  // ✅ Validation logic (for both onBlur and onChange)
  const validateField = (field: string, value: string): boolean => {
    let error = "";

    if (field === "name") {
      if (!value.trim()) error = "Category name is required.";
    }

    if (field === "description") {
      if (value.length > 300) error = "Description cannot exceed 300 characters.";
    }

    if (field === "categoryImage") {
      if (selectedFiles.length === 0) error = "Category image is required.";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  // ✅ Handle typing + live validation
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value); // live validation
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔍 Run full validation
    const validName = validateField("name", formData.name);
    const validDesc = validateField("description", formData.description);
    const validImage = validateField("categoryImage", formData.categoryImage);

    if (!validName || !validDesc || !validImage) return;

    try {
      let imageUrl = "";
      let bannerImageUrl = "";

      if (selectedFiles.length > 0 && uploaderRef.current) {
        const urls = await uploaderRef.current.uploadFiles();
        imageUrl = urls[0] || "";
      }

      if (selectedBannerFiles.length > 0 && bannerUploaderRef.current) {
        const urls = await bannerUploaderRef.current.uploadFiles();
        bannerImageUrl = urls[0] || "";
      }

      mutation.mutate({
        ...formData,
        categoryImage: imageUrl,
        categoryBannerImage: bannerImageUrl || null,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1c1c1c]">Add Category</h1>

      <Card className="max-w-md">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px]">
                Category Name<span className="text-[#ff0202]">*</span>
              </label>
              <Input
                className={`h-12 pl-6 rounded-xl border ${
                  errors.name ? "border-red-500" : "border-[#dadada]"
                }`}
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={(e) => validateField("name", e.target.value)}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px]">
                Description
              </label>
              <Textarea
                className={`h-[100px] pt-3 pl-6 rounded-xl border ${
                  errors.description ? "border-red-500" : "border-[#dadada]"
                } resize-none`}
                placeholder="Enter category description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                onBlur={(e) => validateField("description", e.target.value)}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Category Image */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px] flex items-center gap-2">
                Category Image<span className="text-[#ff0202]">*</span>
                <button
                  type="button"
                  className="text-xs text-blue-600 underline hover:text-blue-800"
                  onClick={() => setIsGuidelinesOpen(true)}
                >
                  View Image Guidelines
                </button>
              </label>
              <CloudinaryUploader
                ref={uploaderRef}
                multiple={false}
                onFilesChange={(files) => {
                  setSelectedFiles(files);
                  if (files.length > 0) {
                    setErrors((prev) => ({ ...prev, categoryImage: "" }));
                  } else {
                    validateField("categoryImage", "");
                  }
                }}
                buttonLabel="Select Category Image"
              />
              {errors.categoryImage && (
                <p className="text-xs text-red-500 mt-1">{errors.categoryImage}</p>
              )}
            </div>

            {/* Category Banner */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px] flex items-center gap-2">
                Category Banner Image
                <span className="text-xs text-gray-500">(Recommended: 1920x600)</span>
              </label>
              <CloudinaryUploader
                ref={bannerUploaderRef}
                multiple={false}
                onFilesChange={setSelectedBannerFiles}
                buttonLabel="Select Banner Image"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Add Category
            </button>

            <ImageGuidelinesModal
              isOpen={isGuidelinesOpen}
              onClose={() => setIsGuidelinesOpen(false)}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
