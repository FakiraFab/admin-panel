import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { SearchInput } from "../../components/ui/search-input";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchBlogs, deleteBlog, toggleBlogPublish } from "../../lib/api";
import { useToast } from "../../components/ui/toast";
import { Pagination } from "../../components/ui/Pagination";
import { Filter, defaultSortOptions } from "../../components/ui/filter";
import { Blog } from "../../types";

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

export const BlogList: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState("-createdAt");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  interface BlogApiResponse {
    data: Blog[];
    total: number;
    totalPages: number;
  }

  const { data: blogData, isLoading, error } = useQuery<BlogApiResponse>({
    queryKey: ["blogs", currentPage, itemsPerPage, sortOrder, searchQuery, selectedCategory],
    queryFn: () =>
      fetchBlogs({
        page: currentPage,
        limit: itemsPerPage,
        sort: sortOrder,
        q: searchQuery || undefined,
        category: selectedCategory || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      showToast("Blog deleted successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: () => {
      showToast("Failed to delete blog. Please try again.", "error");
    },
  });

  const publishMutation = useMutation({
    mutationFn: toggleBlogPublish,
    onSuccess: (data) => {
      showToast(
        data.published ? "Blog published successfully!" : "Blog unpublished!",
        "success"
      );
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: () => {
      showToast("Failed to toggle publish status. Please try again.", "error");
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (blog: Blog) => {
    showToast(`Are you sure you want to delete "${blog.title}"?`, "confirm", {
      onConfirm: () => deleteMutation.mutate(blog._id),
      onCancel: () => showToast("Delete cancelled", "info"),
    });
  };

  const handleTogglePublish = (blog: Blog) => {
    publishMutation.mutate(blog._id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1c1c1c]">Blogs</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={setSearchQuery}
            placeholder="Search blogs..."
            isLoading={isLoading}
            className="w-full sm:w-96"
          />
          <Filter
            selectedSort={sortOrder}
            onSortChange={setSortOrder}
            sortOptions={defaultSortOptions}
            className="w-full sm:w-auto"
          />
          <Link
            to="/blogs/create"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4" />
            Add Blog
          </Link>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedCategory === ""
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Categories
        </button>
        {BLOG_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-4 sm:p-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
                <p className="text-gray-500 text-sm sm:text-base">Loading blogs...</p>
              </div>
            ) : error ? (
              <div className="p-4 sm:p-8 text-center">
                <div className="text-red-500 mb-2 text-sm sm:text-base">⚠️ Error loading blogs</div>
                <p className="text-gray-500 text-xs sm:text-sm">Please try refreshing the page</p>
              </div>
            ) : blogData?.data?.length === 0 ? (
              <div className="p-4 sm:p-8 text-center">
                <p className="text-gray-500 text-sm sm:text-base">No blogs found</p>
              </div>
            ) : (
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-3 sm:p-4 font-semibold text-[#1c1c1c] text-xs sm:text-sm">
                      Image
                    </th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-[#1c1c1c] text-xs sm:text-sm">
                      Title
                    </th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-[#1c1c1c] text-xs sm:text-sm hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-[#1c1c1c] text-xs sm:text-sm hidden lg:table-cell">
                      Author
                    </th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-[#1c1c1c] text-xs sm:text-sm">
                      Published
                    </th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-[#1c1c1c] text-xs sm:text-sm hidden sm:table-cell">
                      Created
                    </th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-[#1c1c1c] text-xs sm:text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {blogData?.data?.map((blog: Blog) => (
                    <tr key={blog._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 sm:p-4">
                        {blog.image ? (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg shadow-sm transition-transform duration-300 transform hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-[10px] sm:text-xs">No Image</span>
                          </div>
                        )}
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-[#1c1c1c] text-xs sm:text-sm line-clamp-2">
                            {blog.title}
                          </p>
                          <p className="text-[11px] sm:text-xs text-[#979797] line-clamp-1">
                            {blog.shortDescription}
                          </p>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 hidden md:table-cell">
                        <span className="text-xs sm:text-sm text-[#1c1c1c]">{blog.category}</span>
                      </td>
                      <td className="p-3 sm:p-4 hidden lg:table-cell">
                        <span className="text-xs sm:text-sm text-[#979797]">{blog.author}</span>
                      </td>
                      <td className="p-3 sm:p-4">
                        <button
                          onClick={() => handleTogglePublish(blog)}
                          disabled={publishMutation.isPending}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            blog.published ? "bg-green-500" : "bg-gray-300"
                          } disabled:opacity-50`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              blog.published ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="p-3 sm:p-4 hidden sm:table-cell">
                        <span className="text-[11px] sm:text-xs text-[#979797]">
                          {formatDate(blog.createdAt)}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Link
                            to={`/blogs/${blog._id}/edit`}
                            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Blog"
                          >
                            <EditIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog)}
                            disabled={deleteMutation.isPending}
                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                            title="Delete Blog"
                          >
                            <TrashIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>

        {!isLoading && !error && blogData && (
          <div className="border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={blogData.totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </Card>
    </div>
  );
};
