import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addSubcategory, fetchCategories } from "../../lib/api";

export const AddSubcategory: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentCategory: "",
  });

  const queryClient = useQueryClient();
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const mutation = useMutation({
    mutationFn: addSubcategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      setFormData({ name: "", description: "", parentCategory: "" });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    // console.log(field,value)
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentCategory || !formData.name) return;
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
                {categories?.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-black tracking-[0.01px]">
                Subcategory Name<span className="text-[#ff0202]">*</span>
              </label>
              <Input
                className="h-12 pl-6 rounded-xl border border-[#dadada]"
                placeholder="Enter subcategory name"
                value={formData.name}
                onChange={e => handleInputChange("name", e.target.value)}
                required
              />
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
              className="w-full h-12 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              disabled={mutation.status === 'pending'}
            >
              {mutation.status === 'pending' ? "Adding..." : "Add Subcategory"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 