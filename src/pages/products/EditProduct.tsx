import React, { useState, useEffect, useRef } from "react";
import { X, Plus, AlertCircle } from "lucide-react";
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
import { fetchCategories, fetchSubcategories, updateProduct } from "../../lib/api";
import { useToast } from "../../components/ui/toast";
import ImageGuidelinesModal from '../../components/ui/ImageGuidelinesModal';
import CloudinaryUploader, { CloudinaryUploaderRef } from "../../components/ui/CloudinaryUploader";

// Color options matching AddProduct.tsx
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

interface ProductOption {
  color: string;
  colorCode: string;
  quantity: string;
  imageUrls: string[];
  price: string;
}

interface ProductSpecifications {
  material: string;
  style: string;
  length: string;
  blousePiece: string;
  designNo: string;
}

interface Product {
  _id: string;
  name: string;
  category: { _id: string; name: string } | string;
  subcategory: { _id: string; name: string } | string;
  description: string;
  fullDescription?: string;
  price: number;
  imageUrl: string;
  images: string[];
  quantity: number;
  unit: string;
  color?: string;
  colorCode?: string;
  specifications: ProductSpecifications;
  options: ProductOption[];
}

interface EditProductProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const EditProduct: React.FC<EditProductProps> = ({ product, isOpen, onClose }) => {

  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    subcategory: string;
    description: string;
    fullDescription: string;
    price: string;
    imageUrl: string;
    images: string[];
    quantity: string;
    unit: string;
    color: string;
    colorCode?: string;
    specifications: {
      material: string;
      style: string;
      length: string;
      blousePiece: string;
      designNo: string;
    };
    options: ProductOption[];
  }>({
    name: "",
    category: "",
    subcategory: "",
    description: "",
    fullDescription: "",
    price: "",
    imageUrl: "",
    images: [""],
    quantity: "",
    unit: "meter",
    color: "",
    colorCode: "",
    specifications: {
      material: "Cotton",
      style: "Traditional",
      length: "6 meters",
      blousePiece: "Yes",
      designNo: "",
    },
    options: [],
  });

  

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);

  // Refs for Cloudinary uploaders
  const primaryImageUploaderRef = useRef<CloudinaryUploaderRef>(null);
  const additionalImagesUploaderRef = useRef<CloudinaryUploaderRef>(null);
  const variantImageUploaderRefs = useRef<CloudinaryUploaderRef[]>([]);

  // State for selected files
  const [primaryImageFiles, setPrimaryImageFiles] = useState<File[]>([]);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [variantImageFiles, setVariantImageFiles] = useState<File[][]>([]);

  const queryClient = useQueryClient();
  const { showToast } = useToast();
  interface CategoryApiResponse {
    data: any[];
    total: number;
    totalPages: number;
  }

  interface SubcategoryApiResponse {
    data: any[];
    total: number;
    totalPages: number;
  }

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
    mutationFn: (data: any) => updateProduct(product._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast(`Product "${formData.name}" updated successfully!`, 'success');
      setErrors({});
      setImageErrors({});
      setIsSubmitting(false);
      onClose();
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to update product";
      showToast(errorMessage, 'error');
      setErrors({ submit: errorMessage });
      setIsSubmitting(false);
    },
  });

  // Pre-populate form with product data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: typeof product.category === 'object' ? product.category._id : product.category || "",
        subcategory: typeof product.subcategory === 'object' ? product.subcategory._id : product.subcategory || "",
        description: product.description || "",
        fullDescription: product.fullDescription || "",
        price: product.price?.toString() || "",
        imageUrl: product.imageUrl || "",
        images: product.images?.length > 0 ? product.images : [""],
        quantity: product.quantity?.toString() || "",
        unit: product.unit || "meter",
        color: product.color || "",
        colorCode: product.colorCode || "",
        specifications: {
          material: product.specifications?.material || "Cotton",
          style: product.specifications?.style || "Traditional",
          length: product.specifications?.length || "6 meters",
          blousePiece: product.specifications?.blousePiece || "Yes",
          designNo: product.specifications?.designNo || "",
        },
        options: product.options?.length > 0
          ? product.options.map((opt: any) => ({
              color: opt.color || "",
              colorCode: opt.colorCode || "",
              quantity: opt.quantity?.toString() || "",
              imageUrls: opt.imageUrls?.length > 0 ? opt.imageUrls : [""],
              price: opt.price?.toString() || "",
            }))
          : [],
      });
    }
    
  }, [product]);


  
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (field === "imageUrl" && imageErrors["primary"]) {
      setImageErrors(prev => ({ ...prev, primary: false }));
    }
  };

  const handleRemovePrimaryImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: "" }));
    setPrimaryImageFiles([]);
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      if (newImages.length === 0) {
        newImages.push("");
      }
      return { ...prev, images: newImages };
    });
  };

  const handleRemoveVariantImage = (optionIndex: number, imageIndex: number) => {
    setFormData(prev => {
      const newOptions = [...prev.options];
      const newImageUrls = [...newOptions[optionIndex].imageUrls];
      newImageUrls.splice(imageIndex, 1);
      if (newImageUrls.length === 0) {
        newImageUrls.push("");
      }
      newOptions[optionIndex] = { ...newOptions[optionIndex], imageUrls: newImageUrls };
      return { ...prev, options: newOptions };
    });
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


  console.log(product)

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subcategory) newErrors.subcategory = "Subcategory is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (primaryImageFiles.length === 0 && !formData.imageUrl.trim()) newErrors.imageUrl = "Primary image is required";
    if (!formData.quantity || Number(formData.quantity) <= 0) newErrors.quantity = "Valid quantity is required";
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (!formData.color) newErrors.color = "Primary color is required";
    if (formData.unit && !['piece', 'meter'].includes(formData.unit)) {
      newErrors.unit = "Unit must be either piece or meter";
    }

    if (formData.options && formData.options.length > 0) {
      formData.options.forEach((option, idx) => {
        if (!option.color) newErrors[`option_${idx}_color`] = "Color is required";
        if (!option.quantity || Number(option.quantity) <= 0) newErrors[`option_${idx}_quantity`] = "Valid quantity is required";
        if (!option.imageUrls.some(img => img.trim()) && (!variantImageFiles[idx] || variantImageFiles[idx].length === 0)) {
          newErrors[`option_${idx}_imageUrls`] = "At least one variant image is required";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Upload all images first
      const primaryImageUrls = primaryImageFiles.length > 0 
        ? await primaryImageUploaderRef.current?.uploadFiles() || []
        : [];

      const additionalImageUrls = additionalImageFiles.length > 0
        ? await additionalImagesUploaderRef.current?.uploadFiles() || []
        : [];

      // Upload variant images
      const variantImageUrls: string[][] = [];
      for (let i = 0; i < variantImageFiles.length; i++) {
        if (variantImageFiles[i].length > 0 && variantImageUploaderRefs.current[i]) {
          const urls = await variantImageUploaderRefs.current[i].uploadFiles() || [];
          variantImageUrls[i] = urls;
        } else {
          variantImageUrls[i] = [];
        }
      }

      // Update form data with uploaded URLs
      const payload = {
        ...formData,
        imageUrl: primaryImageUrls[0] || formData.imageUrl,
        // If new images are uploaded, use those; otherwise use existing images (filtered to remove empty strings)
        images: additionalImageUrls.length > 0 ? additionalImageUrls : formData.images.filter(Boolean),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      };
      
      // If primary image was removed and no new one was uploaded, explicitly set to empty string
      if (!primaryImageUrls[0] && !formData.imageUrl) {
        payload.imageUrl = "";
      }

      // Update options with uploaded variant URLs
      if (formData.options && formData.options.length > 0) {
        (payload as any).options = formData.options.map((opt, idx) => {
          // If new variant images are uploaded, use those; otherwise use existing images (filtered to remove empty strings)
          const updatedImageUrls = variantImageUrls[idx]?.length > 0 
            ? variantImageUrls[idx] 
            : opt.imageUrls.filter(Boolean);
            
          return {
            ...opt,
            quantity: Number(opt.quantity).toString(),
            price: opt.price ? Number(opt.price).toString() : "",
            imageUrls: updatedImageUrls,
          };
        });
      } else {
        (payload as any).options = undefined;
      }

      mutation.mutate(payload);
    } catch (error: any) {
      console.error('Upload error:', error);
      showToast(error.message || "Failed to upload images", 'error');
      setIsSubmitting(false);
    }
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

  if (!isOpen) return null;
  console.log(formData)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
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
                      {categoriesResponse?.data?.map((cat: any) => (
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
                      {subcategoriesResponse?.data?.map((sub: any) => (
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Unit *</label>
                <Select 
                  value={formData.unit}
                  onValueChange={value => handleInputChange("unit", value)}
                >
                  <SelectTrigger className={errors.unit ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="piece">Piece</SelectItem>
                    <SelectItem value="meter">Meter</SelectItem>
                  </SelectContent>
                </Select>
                {errors.unit && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.unit}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color *</label>
                <Select 
                  value={formData.color}
                  onValueChange={value => {
                    const colorOption = COLOR_OPTIONS.find(c => c.name === value);
                    handleInputChange("color", value);
                    if (colorOption) {
                      handleInputChange("colorCode", colorOption.code);
                    }
                  }}
                >
                  <SelectTrigger className={errors.color ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select color">
                      {formData.color && (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: COLOR_OPTIONS.find(c => c.name === formData.color)?.code }}
                          />
                          <span>{formData.color}</span>
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
                {errors.color && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.color}</p>}
              </div>
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
                  Primary Image *
                  <button
                    type="button"
                    className="text-xs text-blue-600 underline hover:text-blue-800"
                    onClick={() => setIsGuidelinesOpen(true)}
                  >
                    View Image Guidelines
                  </button>
                </label>
                {formData.imageUrl && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">Current primary image:</p>
                    <div className="relative w-32 h-32 border rounded-md overflow-hidden group">
                      <img 
                        src={formData.imageUrl} 
                        alt="Primary product image" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePrimaryImage}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
                <CloudinaryUploader
                  ref={primaryImageUploaderRef}
                  multiple={false}
                  onFilesChange={setPrimaryImageFiles}
                  buttonLabel="Select Primary Image"
                />
                {errors.imageUrl && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.imageUrl}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                {formData.images.some(img => img.trim()) && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">Current additional images:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.images.filter(img => img.trim()).map((img, i) => (
                        <div key={i} className="relative w-24 h-24 border rounded-md overflow-hidden group">
                          <img 
                            src={img} 
                            alt={`Additional product image ${i+1}`} 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveAdditionalImage(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <CloudinaryUploader
                  ref={additionalImagesUploaderRef}
                  multiple
                  onFilesChange={setAdditionalImageFiles}
                  buttonLabel="Select Additional Images"
                />
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
                      {option.imageUrls.some(img => img.trim()) && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2">Current variant images:</p>
                          <div className="flex flex-wrap gap-2">
                            {option.imageUrls.filter(img => img.trim()).map((img, i) => (
                              <div key={i} className="relative w-24 h-24 border rounded-md overflow-hidden group">
                                <img 
                                  src={img} 
                                  alt={`Variant ${idx+1} image ${i+1}`} 
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariantImage(idx, i)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Remove image"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <CloudinaryUploader
                        ref={(el) => {
                          if (el) {
                            variantImageUploaderRefs.current[idx] = el;
                          }
                        }}
                        multiple
                        onFilesChange={(files) => {
                          const newVariantFiles = [...variantImageFiles];
                          newVariantFiles[idx] = files;
                          setVariantImageFiles(newVariantFiles);
                        }}
                        buttonLabel="Select Variant Images"
                      />
                      {errors[`option_${idx}_imageUrls`] && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors[`option_${idx}_imageUrls`]}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating Product..." : "Update Product"}
            </button>
          </div>

          {errors.submit && (
            <div className="text-center px-6 pb-6">
              <p className="text-red-500 flex items-center justify-center gap-1">
                <AlertCircle size={16} />
                {errors.submit}
              </p>
            </div>
          )}
          <ImageGuidelinesModal isOpen={isGuidelinesOpen} onClose={() => setIsGuidelinesOpen(false)} />
        </form>
      </div>
    </div>
  );
};