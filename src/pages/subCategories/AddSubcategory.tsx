import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { AlertCircle } from "lucide-react";

interface SubcategoryFormData {
  name: string;
  description: string;
  parentCategory: string;
}

interface CategoryApiResponse {
  data: Array<{ _id: string; name: string }>;
  total: number;
  totalPages: number;
}

interface FormErrors {
  name?: string;
  parentCategory?: string;
  submit?: string;
}
import { Textarea } from "../../components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addSubcategory, fetchCategories } from "../../lib/api";

export const AddSubcategory: React.FC = () => {
  const [formData, setFormData] = useState<SubcategoryFormData>({
    name: "",
    description: "",
    parentCategory: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const queryClient = useQueryClient();
  const { data: categoriesResponse, isLoading: categoriesLoading } = useQuery<CategoryApiResponse>({
    queryKey: ["categories"],
    queryFn: () => fetchCategories({ limit: 1000 }), // Fetch all categories with high limit
  });

  const mutation = useMutation({
    mutationFn: addSubcategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      setFormData({ name: "", description: "", parentCategory: "" });
      setErrors({});
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to add subcategory";
      setErrors({ submit: errorMessage });
    }
  });

  const handleInputChange = (field: keyof SubcategoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'name' || field === 'parentCategory') {
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Subcategory name is required";
    }
    
    if (!formData.parentCategory) {
      newErrors.parentCategory = "Please select a category";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    mutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1c1c1c]">Add Subcategory</h1>

      <Card className="max-w-md">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px]">
                Category<span className="text-[#ff0202]">*</span>
              </label>
              <select
                className="h-12 pl-6 rounded-xl border border-[#dadada] w-full"
                value={formData.parentCategory}
                onChange={e => handleInputChange("parentCategory", e.target.value)}
                required
                disabled={categoriesLoading}
              >
                <option value="">Select category</option>
                {categoriesResponse?.data?.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              {errors.parentCategory && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.parentCategory}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px]">
                Subcategory Name<span className="text-[#ff0202]">*</span>
              </label>
              <Input
                className={`h-12 pl-6 rounded-xl border ${errors.name ? 'border-red-500' : 'border-[#dadada]'}`}
                placeholder="Enter subcategory name"
                value={formData.name}
                onChange={e => handleInputChange("name", e.target.value)}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px]">
                Description
              </label>
              <Textarea
                className="h-[100px] pt-3 pl-6 rounded-xl border border-[#dadada] resize-none"
                placeholder="Enter subcategory description"
                value={formData.description}
                onChange={e => handleInputChange("description", e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={mutation.status === 'pending'}
            >
              {mutation.status === 'pending' ? "Adding..." : "Add Subcategory"}
            </button>

            {errors.submit && (
              <p className="text-red-500 text-sm mt-4 flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.submit}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 