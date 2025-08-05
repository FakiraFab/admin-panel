import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, EditIcon, TrashIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchReels, toggleReelVisibility } from "../../lib/api";
import EditReel from "./EditReel";
import { deleteReel } from "./DeleteReel";
import { useToast } from "../../components/ui/toast";
import { Pagination } from "../../components/ui/Pagination";

export const ReelsList: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [editingReel, setEditingReel] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  interface ReelApiResponse {
    data: any[];
    total: number;
    totalPages: number;
  }

  const { data: reelData, isLoading, error } = useQuery<ReelApiResponse>({
    queryKey: ["reels", currentPage, itemsPerPage],
    queryFn: () => fetchReels({ page: currentPage, limit: itemsPerPage })
  });

  const handleEdit = (reel: any) => setEditingReel(reel);
  const handleCancel = () => setEditingReel(null);
  const handleSave = () => {
    setEditingReel(null);
  };
  
  const handleDelete = (reel: any) => {
    showToast('Are you sure you want to delete this reel?', 'confirm', {
      onConfirm: async () => {
        try {
          await deleteReel(reel._id);
          showToast('Reel deleted!', 'success');
          queryClient.invalidateQueries({ queryKey: ["reels"] });
        } catch {
          showToast('Failed to delete reel.', 'error');
        }
      },
      onCancel: () => showToast('Delete cancelled.', 'info'),
    });
  };

  const handleToggleVisibility = async (reel: any) => {
    try {
      await toggleReelVisibility(reel._id);
      showToast(`Reel ${reel.isActive ? 'deactivated' : 'activated'} successfully!`, 'success');
      queryClient.invalidateQueries({ queryKey: ["reels"] });
    } catch {
      showToast('Failed to toggle reel visibility.', 'error');
    }
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    // Scroll to top with smooth behavior
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Invalidate the query to force a fresh fetch for the new page
    await queryClient.invalidateQueries({ queryKey: ["reels", page, itemsPerPage] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1c1c1c]">Reels</h1>
        <Link
          to="/reels/add"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Reel
        </Link>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading reels...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="text-red-500 mb-2">⚠️ Error loading reels</div>
                <p className="text-gray-500">Please try refreshing the page</p>
              </div>
            ) : reelData?.data?.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No reels found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Thumbnail</th>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Title</th>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Description</th>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Order</th>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Status</th>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Created At</th>
                    <th className="text-left p-4 font-semibold text-[#1c1c1c]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reelData?.data?.map((reel: any) => (
                    <tr key={reel._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        {reel.thumbnail ? (
                          <img
                            src={reel.thumbnail}
                            alt={reel.title}
                            className="w-12 h-12 object-cover rounded-lg transition-transform duration-300 transform hover:scale-150"
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
                      <td className="p-4 font-medium text-[#1c1c1c]">{reel.title}</td>
                      <td className="p-4 text-[#979797] max-w-xs truncate">{reel.description || "-"}</td>
                      <td className="p-4 text-[#979797]">{reel.order || "-"}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reel.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {reel.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-[#979797]">
                        {reel.createdAt ? new Date(reel.createdAt).toLocaleDateString() : ""}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded" 
                            onClick={() => handleEdit(reel)}
                            title="Edit reel"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button 
                            className={`p-2 rounded ${
                              reel.isActive 
                                ? 'text-orange-600 hover:bg-orange-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            onClick={() => handleToggleVisibility(reel)}
                            title={reel.isActive ? 'Deactivate reel' : 'Activate reel'}
                          >
                            {reel.isActive ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded" 
                            onClick={() => handleDelete(reel)}
                            title="Delete reel"
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
        {!isLoading && !error && reelData && (
          <div className="border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={reelData.totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </Card>
      
      {editingReel && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-0 w-full max-w-lg">
            <EditReel
              reel={editingReel}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}; 