import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, AlertCircle } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBlog, updateBlog } from "../../lib/api";
import { useToast } from "../../components/ui/toast";
import { BlogFormData, Blog } from "../../types";

const BLOG_CATEGORIES = [
  "Styling Tips",
  "Product Guides",
  "Traditions",
  "DIY",
  "Care Tips",
  "Trending",
  "Fabric Guide",
  "Design Inspiration",
];

export const EditBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    shortDescription: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
    category: "",
    tags: [],
    author: "FakiraFab",
    image: "",
    published: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [keywordInput, setKeywordInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const { data: blog, isLoading, error } = useQuery<Blog>({
    queryKey: ["blog", id],
    queryFn: () => fetchBlog(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        shortDescription: blog.shortDescription,
        content: blog.content,
        metaTitle: blog.metaTitle || "",
        metaDescription: blog.metaDescription || "",
        metaKeywords: blog.metaKeywords || [],
        category: blog.category,
        tags: blog.tags || [],
        author: blog.author,
        image: blog.image || "",
        published: blog.published,
      });
    }
  }, [blog]);

  const mutation = useMutation({
    mutationFn: (data: BlogFormData) => updateBlog(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", id] });
      showToast(`Blog "${formData.title}" updated successfully!`, "success");
      navigate("/blogs");
    },
    onError: (error: any) => {
      let errorMessage = "Failed to update blog";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      showToast(errorMessage, "error");
      setErrors({ submit: errorMessage });
    },
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.metaKeywords?.includes(keywordInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        metaKeywords: [...(prev.metaKeywords || []), keywordInput.trim()],
      }));
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      metaKeywords: (prev.metaKeywords || []).filter((k) => k !== keyword),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tag),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required";
    } else if (formData.shortDescription.trim().length < 10) {
      newErrors.shortDescription = "Short description must be at least 10 characters";
    } else if (formData.shortDescription.trim().length > 200) {
      newErrors.shortDescription = "Short description cannot exceed 200 characters";
    }
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.category) newErrors.category = "Category is required";

    if (formData.metaDescription && formData.metaDescription.length > 160) {
      newErrors.metaDescription = "Meta description cannot exceed 160 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️ Error loading blog</div>
          <p className="text-gray-500 mb-4">Unable to find the blog you're looking for</p>
          <button
            onClick={() => navigate("/blogs")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Blog</h1>
        <div className="text-xs sm:text-sm text-gray-500">
          Fields marked with * are required
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={errors.title ? "border-red-500" : ""}
                  placeholder="Enter blog title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <Textarea
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                  className={errors.shortDescription ? "border-red-500" : ""}
                  placeholder="Brief description for preview"
                  rows={2}
                />
                <div className="flex justify-between items-center mt-1">
                  <div>
                    {errors.shortDescription && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.shortDescription}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formData.shortDescription.length}/200
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <Input
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Author name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              Content
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Content *
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  className={errors.content ? "border-red-500" : ""}
                  placeholder="Write your blog content here..."
                  rows={10}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {errors.content}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <Input
                  value={formData.image || ""}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              SEO Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <Input
                  value={formData.metaTitle || ""}
                  onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                  placeholder="SEO title for search engines"
                  maxLength={60}
                />
                <span className="text-xs text-gray-500 mt-1 block">
                  {formData.metaTitle?.length || 0}/60
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <Textarea
                  value={formData.metaDescription || ""}
                  onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                  placeholder="SEO description for search engines"
                  rows={2}
                  maxLength={160}
                />
                <div className="flex justify-between items-center mt-1">
                  <div>
                    {errors.metaDescription && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.metaDescription}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formData.metaDescription?.length || 0}/160
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Keywords
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addKeyword();
                        }
                      }}
                      placeholder="Add keyword and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.metaKeywords || []).map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="hover:text-blue-900"
                        >
                          <X size={16} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Add tag and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-green-900"
                        >
                          <X size={16} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              Publish Settings
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleInputChange("published", !formData.published)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                  formData.published ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    formData.published ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {formData.published ? "Published" : "Draft"}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => navigate("/blogs")}
            className="px-6 sm:px-8 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Updating Blog..." : "Update Blog"}
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
      </form>
    </div>
  );
};
