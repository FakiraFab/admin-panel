import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSubcategories, fetchCategories } from "../../lib/api";
import EditSubcategory from "./EditSubcategory";
import { deleteSubcategory } from "./DeleteSubcategory";
import { useToast } from "../../components/ui/toast";

export const SubcategoryList: React.FC = () => {
  const { data: subcategories, isLoading, error } = useQuery({
    queryKey: ["subcategories"],
    queryFn: () => fetchSubcategories(),
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [editingSubcategory, setEditingSubcategory] = useState<any | null>(null);

  const getCategoryName = (categoryId: string) => {
    const cat = categories?.find((c: any) => c._id === categoryId);
    return cat ? cat.name : "-";
  };

  const handleEdit = (sub: any) => setEditingSubcategory(sub);
  const handleCancel = () => setEditingSubcategory(null);
  const handleSave = async (data: { name: string; description?: string }) => {
    

    setEditingSubcategory(null);
    queryClient.invalidateQueries({ queryKey: ["subcategories"] });
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
              <div className="p-4">Loading...</div>
            ) : error ? (
              <div className="p-4 text-red-500">Error loading subcategories</div>
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
                  {subcategories?.map((sub: any) => (
                    <tr key={sub._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium text-[#1c1c1c]">{sub.name}</td>
                      <td className="p-4 text-[#979797]">{sub.description}</td>
                      <td className="p-4 text-[#979797]">{getCategoryName(sub.parentCategory._id)}</td>
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
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
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