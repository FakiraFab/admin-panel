import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRegistrations, updateRegistration } from '../../lib/api';
import { useToast } from '../../components/ui/toast';
import { Pagination } from '../../components/ui/Pagination';

interface Registration {
  _id: string;
  fullName: string;
  age: number;
  institution: string;
  educationLevel: string;
  email: string;
  contactNumber: string;
  workshopName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  specialRequirements?: string;
  createdAt: string;
}

export const RegistrationList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: registrationData, isLoading } = useQuery({
    queryKey: ['registrations', currentPage],
    queryFn: () => fetchRegistrations({ page: currentPage, limit: itemsPerPage })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateRegistration(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      showToast('Registration status updated successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to update registration status', 'error');
    }
  });

  const handleStatusChange = (registration: Registration, newStatus: 'Approved' | 'Rejected') => {
    updateMutation.mutate({ id: registration._id, status: newStatus });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1c1c1c]">Workshop Registrations</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading registrations...</p>
              </div>
            ) : registrationData?.data?.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No registrations found</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Workshop
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrationData?.data?.map((registration: Registration) => (
                    <tr key={registration._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {registration.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {registration.age} years • {registration.educationLevel}
                          </div>
                          <div className="text-sm text-gray-500">
                            {registration.institution}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{registration.workshopName}</div>
                        {registration.specialRequirements && (
                          <div className="text-sm text-gray-500">
                            Note: {registration.specialRequirements}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{registration.email}</div>
                        <div className="text-sm text-gray-500">{registration.contactNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                          {registration.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {registration.status === 'Pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusChange(registration, 'Approved')}
                              className="text-sm text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(registration, 'Rejected')}
                              className="text-sm text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
        {registrationData?.totalPages && registrationData.totalPages > 1 && (
          <div className="border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={registrationData.totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </Card>
    </div>
  );
};
