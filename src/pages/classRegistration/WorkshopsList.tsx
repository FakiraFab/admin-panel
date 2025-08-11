import React, { useState } from 'react';
import { PlusIcon, EditIcon, TrashIcon, Users, Clock, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWorkshops, deleteWorkshop } from '../../lib/api';
import { useToast } from '../../components/ui/toast';
import { Pagination } from '../../components/ui/Pagination';
import { AddWorkshop } from './AddWorkshop';
import { EditWorkshop } from './EditWorkshop';

export const WorkshopsList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<any | null>(null);

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: workshopData, isLoading } = useQuery({
    queryKey: ['workshops', currentPage],
    queryFn: () => fetchWorkshops({ page: currentPage, limit: itemsPerPage })
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWorkshop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
      showToast('Workshop deleted successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to delete workshop', 'error');
    }
  });

  const handleDelete = (workshop: any) => {
    showToast('Are you sure you want to delete this workshop?', 'confirm', {
      onConfirm: () => deleteMutation.mutate(workshop._id),
      onCancel: () => showToast('Delete cancelled.', 'info')
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1c1c1c]">Workshops</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Workshop
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading workshops...</p>
              </div>
            ) : workshopData?.data?.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No workshops found</p>
              </div>
            ) : (
              <div className="min-w-full divide-y divide-gray-200">
                {workshopData?.data?.map((workshop: any) => (
                  <div key={workshop._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-gray-900">{workshop.name}</h3>
                        <p className="text-gray-600">{workshop.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(workshop.dateTime)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {workshop.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {workshop.maxParticipants} participants
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {workshop.location}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-gray-900">
                            ₹{workshop.price}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => setEditingWorkshop(workshop)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(workshop)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        {workshopData?.data && workshopData.data.length > 0 && (
          <div className="border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={workshopData.totalPages||1}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </Card>

      {isAddModalOpen && (
        <AddWorkshop
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {editingWorkshop && (
        <EditWorkshop
          workshop={editingWorkshop}
          onClose={() => setEditingWorkshop(null)}
        />
      )}
    </div>
  );
};
