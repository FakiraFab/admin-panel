import React, { useState } from "react";
import { X, Plus, Trash2, AlertCircle } from "lucide-react";
import ImageGuidelinesModal from '../../components/ui/ImageGuidelinesModal';

interface ProductSpecifications {
  material: string;
  style: string;
  length: string;
  blousePiece: string;
  designNo: string;
}

interface ProductOption {
  color: string;
  colorCode: string;
  quantity: string;
  imageUrls: string[];
  price: string;
}

interface ProductFormData {
  name: string;
  category: string;
  subcategory: string;
  description: string;
  fullDescription: string;
  price: string;
  imageUrl: string;
  images: string[];
  quantity: string;
  specifications: ProductSpecifications;
  options: ProductOption[];
}

interface CategoryApiResponse {
  data: Array<{ _id: string; name: string }>;
  total: number;
  totalPages: number;
}

interface SubcategoryApiResponse {
  data: Array<{ _id: string; name: string }>;
  total: number;
  totalPages: number;
}
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCategories, fetchSubcategories, addProduct } from "../../lib/api";
import { useToast } from "../../components/ui/toast";

// Cloudinary upload widget
declare global {
  interface Window {
    cloudinary: any;
  }
}



// Enhanced color options with proper color codes
const COLOR_OPTIONS = [
  { name: "Red", code: "#e53e3e" },
  { name: "Blue", code: "#3182ce" },
  { name: "Navy", code: "#1a365d" },
  { name: "Green", code: "#38a169" },
  { name: "Yellow", code: "#ecc94b" },
  { name: "Orange", code: "#ff8c00" },
  { name: "Pink", code: "#ff69b4" },
  { name: "Purple", code: "#9f7aea" },
  { name: "Brown", code: "#8b4513" },
  { name: "Black", code: "#000000" },
  { name: "White", code: "#ffffff" },
  { name: "Gray", code: "#718096" },
  { name: "Maroon", code: "#8b0000" },
  { name: "Mustard", code: "#d69e2e" },
  { name: "Coral", code: "#ff7f7f" },
  { name: "Beige", code: "#c6a882" },
  { name: "Turquoise", code: "#38b2ac" },
  { name: "Lavender", code: "#b794f6" },
  { name: "Peach", code: "#fbb6ce" },
  { name: "Mint", code: "#81e6d9" },
];

export const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    subcategory: "",
    description: "",
    fullDescription: "",
    price: "",
    imageUrl: "",
    images: [""],
    quantity: "",
    specifications: {
      material: "Cotton",
      style: "Traditional",
      length: "6 meters",
      blousePiece: "Yes",
      designNo: "",
    },
    options: [
      {
        color: "",
        colorCode: "",
        quantity: "",
        imageUrls: [""],
        price: "",
      },
    ],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);

  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { data: categoriesResponse, isLoading: categoriesLoading } = useQuery<CategoryApiResponse>({
    queryKey: ["categories"],
    queryFn: () => fetchCategories({ limit: 1000 }), // Fetch all categories with high limit
  });

  const { data: subcategoriesResponse, isLoading: subcategoriesLoading } = useQuery<SubcategoryApiResponse>({
    queryKey: ["subcategories", formData.category],
    queryFn: () => fetchSubcategories({ categoryId: formData.category, limit: 1000 }), // Fetch all subcategories with high limit
    enabled: !!formData.category,
  });

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast(`Product "${formData.name}" added successfully!`, 'success');
      setFormData({
        name: "",
        category: "",
        subcategory: "",
        description: "",
        fullDescription: "",
        price: "",
        imageUrl: "",
        images: [""],
        quantity: "",
        specifications: {
          material: "Cotton",
          style: "Traditional",
          length: "6 meters",
          blousePiece: "Yes",
          designNo: "",
        },
        options: [
          {
            color: "",
            colorCode: "",
            quantity: "",
            imageUrls: [""],
            price: "",
          },
        ],
      });
      setErrors({});
      setImageErrors({});
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to add product";
      showToast(errorMessage, 'error');
      setErrors({ submit: errorMessage });
      setIsSubmitting(false);
    },
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (field === "imageUrl" && imageErrors["primary"]) {
      setImageErrors(prev => ({ ...prev, primary: false }));
    }
  };

  const handleSpecChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value,
      },
    }));
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      
      if (field === "color") {
        const colorOption = COLOR_OPTIONS.find(c => c.name === value);
        if (colorOption) {
          newOptions[index].colorCode = colorOption.code;
        }
      }
      
      return { ...prev, options: newOptions };
    });
  };

  const handleOptionImageChange = (optionIdx: number, imgIdx: number, value: string) => {
    setFormData(prev => {
      const newOptions = [...prev.options];
      const newImageUrls = [...newOptions[optionIdx].imageUrls];
      newImageUrls[imgIdx] = value;
      newOptions[optionIdx].imageUrls = newImageUrls;
      return { ...prev, options: newOptions };
    });
    if (imageErrors[`option_${optionIdx}_${imgIdx}`]) {
      setImageErrors(prev => ({ ...prev, [`option_${optionIdx}_${imgIdx}`]: false }));
    }
  };

  const handleImagesChange = (idx: number, value: string) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages[idx] = value;
      return { ...prev, images: newImages };
    });
    if (imageErrors[`image_${idx}`]) {
      setImageErrors(prev => ({ ...prev, [`image_${idx}`]: false }));
    }
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [
        ...prev.options,
        { color: "", colorCode: "", quantity: "", imageUrls: [""], price: "" },
      ],
    }));
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 1) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, idx) => idx !== index),
      }));
      setImageErrors(prev => {
        const newErrors = { ...prev };
        Object.keys(newErrors).forEach(key => {
          if (key.startsWith(`option_${index}_`)) {
            delete newErrors[key];
          }
        });
        return newErrors;
      });
    }
  };

  const addImage = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImage = (index: number) => {
    if (formData.images.length > 1) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, idx) => idx !== index),
      }));
      setImageErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`image_${index}`];
        return newErrors;
      });
    }
  };

  const addOptionImage = (optionIdx: number) => {
    setFormData(prev => {
      const newOptions = [...prev.options];
      newOptions[optionIdx].imageUrls = [...newOptions[optionIdx].imageUrls, ""];
      return { ...prev, options: newOptions };
    });
  };

  const removeOptionImage = (optionIdx: number, imgIdx: number) => {
    setFormData(prev => {
      const newOptions = [...prev.options];
      if (newOptions[optionIdx].imageUrls.length > 1) {
        newOptions[optionIdx].imageUrls = newOptions[optionIdx].imageUrls.filter((_, idx) => idx !== imgIdx);
      }
      return { ...prev, options: newOptions };
    });
    setImageErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`option_${optionIdx}_${imgIdx}`];
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subcategory) newErrors.subcategory = "Subcategory is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.imageUrl.trim()) newErrors.imageUrl = "Primary image URL is required";
    if (!formData.quantity || Number(formData.quantity) <= 0) newErrors.quantity = "Valid quantity is required";

    formData.options.forEach((option, idx) => {
      if (!option.color) newErrors[`option_${idx}_color`] = "Color is required";
      if (!option.quantity || Number(option.quantity) <= 0) newErrors[`option_${idx}_quantity`] = "Valid quantity is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const payload = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      images: formData.images.filter(Boolean),
      options: formData.options.map(opt => ({
        ...opt,
        quantity: Number(opt.quantity),
        price: opt.price ? Number(opt.price) : undefined,
        imageUrls: opt.imageUrls.filter(Boolean),
      })),
    };
    
    mutation.mutate(payload);
  };

  const handleImageError = (key: string) => {
    setImageErrors(prev => ({ ...prev, [key]: true }));
  };

  const ColorSelector = ({ value, onChange, error }: { value: string; onChange: (value: string) => void; error?: string }) => (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`w-full ${error ? 'border-red-500' : ''}`}>
          <SelectValue placeholder="Select color">
            {value && (
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: COLOR_OPTIONS.find(c => c.name === value)?.code }}
                />
                <span>{value}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {COLOR_OPTIONS.map((color) => (
            <SelectItem key={color.name} value={color.name}>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.code }}
                />
                <span>{color.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle size={16} />{error}</p>}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <div className="text-sm text-gray-500">
          Fields marked with * are required
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <Input 
                  value={formData.name} 
                  onChange={e => handleInputChange("name", e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                  placeholder="Enter product name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <Select 
                  value={formData.category}
                  onValueChange={value => handleInputChange("category", value)} 
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Choose Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesResponse?.data?.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</label>
                <Select
                  value={formData.subcategory}
                  onValueChange={value => handleInputChange("subcategory", value)}
                  disabled={!formData.category || subcategoriesLoading}
                >
                  <SelectTrigger className={errors.subcategory ? 'border-red-500' : ''}>
                    <SelectValue placeholder={!formData.category ? "Select category first" : "Choose Subcategory"} />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategoriesResponse?.data?.map((sub) => (
                      <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subcategory && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.subcategory}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Price *</label>
                <Input 
                  type="number" 
                  value={formData.price} 
                  onChange={e => handleInputChange("price", e.target.value)}
                  className={errors.price ? 'border-red-500' : ''}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Quantity *</label>
                <Input 
                  type="number" 
                  value={formData.quantity} 
                  onChange={e => handleInputChange("quantity", e.target.value)}
                  className={errors.quantity ? 'border-red-500' : ''}
                  placeholder="0"
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.quantity}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <Textarea 
                value={formData.description} 
                onChange={e => handleInputChange("description", e.target.value)}
                className={errors.description ? 'border-red-500' : ''}
                placeholder="Enter product description"
                rows={3}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.description}</p>}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
              <Textarea 
                value={formData.fullDescription} 
                onChange={e => handleInputChange("fullDescription", e.target.value)}
                placeholder="Enter detailed product description"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Product Images</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Primary Image URL *
                <button
                  type="button"
                  className="text-xs text-blue-600 underline hover:text-blue-800"
                  onClick={() => setIsGuidelinesOpen(true)}
                >
                  View Image Guidelines
                </button>
              </label>
              <Input 
                value={formData.imageUrl} 
                onChange={e => handleInputChange("imageUrl", e.target.value)}
                className={errors.imageUrl ? 'border-red-500' : ''}
                placeholder="https://example.com/image.jpg"
              />
              {errors.imageUrl && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.imageUrl}</p>}
              {formData.imageUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Image Preview (as shown in product card):</p>
                  {imageErrors.primary ? (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={16} />
                      Failed to load image
                    </p>
                  ) : (
                    <div className="w-full max-w-[250px] aspect-square bg-gray-100 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={formData.imageUrl}
                        alt="Primary image preview"
                        className="w-full h-full object-cover"
                        style={{ aspectRatio: '1/1' }}
                        onError={() => handleImageError("primary")}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
              <div className="space-y-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Input 
                        value={img} 
                        onChange={e => handleImagesChange(idx, e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => addImage()}
                        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    {img && (
                      <div className="ml-2">
                        {imageErrors[`image_${idx}`] ? (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle size={16} />
                            Failed to load image
                          </p>
                        ) : (
                          <div className="w-full max-w-[250px] aspect-square bg-gray-100 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden">
                            <img
                              src={img}
                              alt={`Additional image ${idx + 1} preview`}
                              className="w-full h-full object-cover"
                              style={{ aspectRatio: '1/1' }}
                              onError={() => handleImageError(`image_${idx}`)}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                <Input 
                  value={formData.specifications.material} 
                  onChange={e => handleSpecChange("material", e.target.value)}
                  placeholder="Cotton"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                <Input 
                  value={formData.specifications.style} 
                  onChange={e => handleSpecChange("style", e.target.value)}
                  placeholder="Traditional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                <Input 
                  value={formData.specifications.length} 
                  onChange={e => handleSpecChange("length", e.target.value)}
                  placeholder="6 meters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blouse Piece</label>
                <Select value={formData.specifications.blousePiece} onValueChange={value => handleSpecChange("blousePiece", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Design No</label>
                <Input 
                  value={formData.specifications.designNo} 
                  onChange={e => handleSpecChange("designNo", e.target.value)}
                  placeholder="Enter design number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Product Variants</h2>
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                <Plus size={16} />
                Add Variant
              </button>
            </div>

            <div className="space-y-6">
              {formData.options.map((option, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Variant {idx + 1}</h3>
                    {formData.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        <X size={14} />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                      <ColorSelector
                        value={option.color}
                        onChange={value => handleOptionChange(idx, "color", value)}
                        error={errors[`option_${idx}_color`]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                      <Input 
                        type="number"
                        value={option.quantity}
                        onChange={e => handleOptionChange(idx, "quantity", e.target.value)}
                        className={errors[`option_${idx}_quantity`] ? 'border-red-500' : ''}
                        placeholder="0"
                      />
                      {errors[`option_${idx}_quantity`] && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors[`option_${idx}_quantity`]}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (Optional)</label>
                      <Input 
                        type="number"
                        value={option.price}
                        onChange={e => handleOptionChange(idx, "price", e.target.value)}
                        placeholder="Leave empty to use base price"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Variant Images</label>
                    <div className="space-y-2">
                      {option.imageUrls.map((img, imgIdx) => (
                        <div key={imgIdx} className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <Input 
                              value={img}
                              onChange={e => handleOptionImageChange(idx, imgIdx, e.target.value)}
                              placeholder="https://example.com/variant-image.jpg"
                              className="flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => addOptionImage(idx)}
                              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                            {option.imageUrls.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeOptionImage(idx, imgIdx)}
                                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                          {img && (
                            <div className="ml-2">
                              {imageErrors[`option_${idx}_${imgIdx}`] ? (
                                <p className="text-red-500 text-sm flex items-center gap-1">
                                  <AlertCircle size={16} />
                                  Failed to load image
                                </p>
                              ) : (
                                <div className="w-full max-w-[250px] aspect-square bg-gray-100 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden">
                                  <img
                                    src={img}
                                    alt={`Variant ${idx + 1} image ${imgIdx + 1} preview`}
                                    className="w-full h-full object-cover"
                                    style={{ aspectRatio: '1/1' }}
                                    onError={() => handleImageError(`option_${idx}_${imgIdx}`)}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
          >
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </button>
        </div>

        {errors.submit && (
          <div className="text-center">
            <p className="text-red-500 flex items-center justify-center gap-1">
              <AlertCircle size={16} />
              {errors.submit}
            </p>
          </div>
        )}
        <ImageGuidelinesModal isOpen={isGuidelinesOpen} onClose={() => setIsGuidelinesOpen(false)} />
      </form>
    </div>
  );
};