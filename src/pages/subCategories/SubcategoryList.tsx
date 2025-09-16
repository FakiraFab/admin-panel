import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Pagination } from "../../components/ui/Pagination";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSubcategories, fetchCategories } from "../../lib/api";
import EditSubcategory from "./EditSubcategory";
import { deleteSubcategory } from "./DeleteSubcategory";
import { useToast } from "../../components/ui/toast";

interface SubcategoryApiResponse {
  data: any[];
  total: number;
  totalPages: number;
}

interface CategoryApiResponse {
  data: any[];
  total: number;
  totalPages: number;
}

export const SubcategoryList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { data: subcategoryData, isLoading, error } = useQuery<SubcategoryApiResponse>({
    queryKey: ["subcategories", currentPage, itemsPerPage],
    queryFn: async () => {
      const response = await fetchSubcategories({ page: currentPage, limit: itemsPerPage });
      console.log("fetchSubcategories Response:", response);
      return response; // Directly return the response
    }
  });

  const { data: categoryData } = useQuery<CategoryApiResponse>({
    queryKey: ["categories"],
    queryFn: () => fetchCategories({ limit: 1000 }), // Fetch all categories with high limit
  });
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [editingSubcategory, setEditingSubcategory] = useState<any | null>(null);

  const handlePageChange = (page: number) => {
    const validPage = Number(page);
    if (!Number.isFinite(validPage)) return;
    
    setCurrentPage(validPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    queryClient.invalidateQueries({ queryKey: ["subcategories", validPage, itemsPerPage] });
  };

  const getCategoryName = (categoryId: string) => {
    const cat = categoryData?.data?.find((c: any) => c._id === categoryId);
    return cat ? cat.name : "-";
  };

  const handleEdit = (sub: any) => setEditingSubcategory(sub);
  const handleCancel = () => setEditingSubcategory(null);
  const handleSave = async () => {
    setEditingSubcategory(null);
    await queryClient.invalidateQueries({ queryKey: ["subcategories", currentPage, itemsPerPage] });
  };
  const handleDelete = (sub: any) => {
    showToast('Are you sure you want to delete this subcategory?', 'confirm', {
      onConfirm: async () => {
        try {
          await deleteSubcategory(sub._id);
          showToast('Subcategory deleted!', 'success');
          queryClient.invalidateQueries({ queryKey: ["subcategories"] });
        } catch {
          showToast('Failed to delete subcategory.', 'error');
        }
      },
      onCancel: () => showToast('Delete cancelled.', 'info'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1c1c1c]">Subcategories</h1>
        <Link
          to="/subcategories/add"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Subcategory
        </Link>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading subcategories...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="text-red-500 mb-2">⚠️ Error loading subcategories</div>
                <p className="text-gray-500">Please try refreshing the page</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Name</th>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Description</th>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Category</th>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Created At</th>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subcategoryData?.data?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        No subcategories found
                      </td>
                    </tr>
                  ) : (
                    subcategoryData?.data?.map((sub: any) => (
                    <tr key={sub._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium text-[#1c1c1c]">{sub.name}</td>
                      <td className="p-4 text-[#979797]">{sub.description}</td>
                      <td className="p-4 text-[#979797]">{getCategoryName(sub.parentCategory?._id || '')}</td>
                      <td className="p-4 text-[#979797]">{sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : ""}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" onClick={() => handleEdit(sub)}>
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => handleDelete(sub)}>
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
        {!isLoading && !error && subcategoryData?.totalPages && Number.isFinite(subcategoryData.totalPages) && (
          <div className="border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={Number(subcategoryData.totalPages)}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </Card>
      {editingSubcategory && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-0 w-full max-w-lg">
            <EditSubcategory
              subcategory={editingSubcategory}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};