import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCategories } from "../../lib/api";
import EditCategory from "./EditCategory";
import { deleteCategory } from "./DeleteCategory";
import { useToast } from "../../components/ui/toast";
import { Pagination } from "../../components/ui/Pagination";

export const CategoryList: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  interface CategoryApiResponse {
    data: any[];
    total: number;
    totalPages: number;
  }

  const { data: categoryData, isLoading, error } = useQuery<CategoryApiResponse>({
    queryKey: ["categories", currentPage, itemsPerPage],
    queryFn: () => fetchCategories({ page: currentPage, limit: itemsPerPage })
  });

  const handleEdit = (category: any) => setEditingCategory(category);
  const handleCancel = () => setEditingCategory(null);
  const handleSave = () => {
    setEditingCategory(null);
  };
  
  const handleDelete = (category: any) => {
    showToast('Are you sure you want to delete this category?', 'confirm', {
      onConfirm: async () => {
        try {
          await deleteCategory(category._id);
          showToast('Category deleted!', 'success');
          queryClient.invalidateQueries({ queryKey: ["categories"] });
        } catch {
          showToast('Failed to delete category.', 'error');
        }
      },
      onCancel: () => showToast('Delete cancelled.', 'info'),
    });
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    // Scroll to top with smooth behavior
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Invalidate the query to force a fresh fetch for the new page
    await queryClient.invalidateQueries({ queryKey: ["categories", page, itemsPerPage] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1c1c1c]">Categories</h1>
        <Link
          to="/categories/add"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Category
        </Link>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading categories...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="text-red-500 mb-2">⚠️ Error loading categories</div>
                <p className="text-gray-500">Please try refreshing the page</p>
              </div>
            ) : categoryData?.data?.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No categories found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Image</th>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Name</th>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Description</th>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Created At</th>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryData?.data?.map((category: any) => (
                    <tr key={category._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        {category.categoryImage ? (
                          <img
                            src={category.categoryImage}
                            alt={category.name}
                            className="w-12 h-12 object-contain transition-transform duration-300 transform hover:scale-150  rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No Image</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-medium text-[#1c1c1c]">{category.name}</td>
                      <td className="p-4 text-[#979797]">{category.description || "-"}</td>
                      <td className="p-4 text-[#979797]">
                        {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : ""}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded" 
                            onClick={() => handleEdit(category)}
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded" 
                            onClick={() => handleDelete(category)}
                          >
                            <TrashIcon className="w-4 h-4" />
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
        {!isLoading && !error && categoryData && (
          <div className="border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={categoryData.totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </Card>
      
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-0 w-full max-w-lg">
            <EditCategory
              category={editingCategory}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};