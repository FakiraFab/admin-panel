import { useState } from 'react';
import { EditIcon, TrashIcon, ChevronDown, ChevronUp, Package, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchInquiries, deleteInquiry } from '../../lib/api';
import { useToast } from '../../components/ui/toast';
import type { Enquiry } from '../../types';
import EditInquiry from './EditInquiry';
import { Pagination } from '../../components/ui/Pagination';

const InquiryList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['inquiries', currentPage, itemsPerPage],
    queryFn: () => fetchInquiries({ page: currentPage, limit: itemsPerPage }),
  });

  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [editingInquiry, setEditingInquiry] = useState<Enquiry | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Extract inquiries from the response data
  const inquiries = response?.data || [];

  const getStatusColor = (buyOption: string) => {
    switch (buyOption) {
      case 'Personal':
        return 'bg-blue-100 text-blue-800';
      case 'Wholesale':
        return 'bg-green-100 text-green-800';
      case 'Other':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleEdit = (inquiry: Enquiry) => setEditingInquiry(inquiry);

  const handleCancel = () => setEditingInquiry(null);

  const handleSave = () => {
    setEditingInquiry(null);
    queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    showToast('Inquiry updated successfully!', 'success');
  };

  const handleDelete = (inquiry: Enquiry) => {
    showToast('Are you sure you want to delete this inquiry?', 'confirm', {
      onConfirm: async () => {
        try {
          await deleteInquiry(inquiry._id!);
          showToast('Inquiry deleted!', 'success');
          queryClient.invalidateQueries({ queryKey: ['inquiries'] });
        } catch {
          showToast('Failed to delete inquiry.', 'error');
        }
      },
      onCancel: () => showToast('Delete cancelled.', 'info'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Inquiries</h1>
        <div className="text-sm text-gray-500">
          {inquiries.length} {inquiries.length === 1 ? 'inquiry' : 'inquiries'} found
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-red-500 bg-red-50 rounded-lg text-center">
              Error loading inquiries. Please try again.
            </div>
          ) : (
            <div className="overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inquiries?.map((inquiry: Enquiry) => (
                      <tr key={inquiry._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {inquiry.productImage ? (
                                <img
                                  className="h-12 w-12 rounded-md object-contain hover:scale-110 transition-transform"
                                  src={inquiry.productImage}
                                  alt={inquiry.productName}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                  <Package className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {inquiry.productName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {inquiry.variant || 'No variant'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {inquiry.userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {inquiry.location || 'No location'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {inquiry.userEmail}
                          </div>
                          <div className="text-sm text-gray-500">
                            {inquiry.whatsappNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                inquiry.buyOption
                              )}`}
                            >
                              {inquiry.buyOption}
                            </span>
                            <span className="text-sm text-gray-500">
                              {inquiry.quantity} m
                            </span>
                          </div>
                          {inquiry.message && (
                            <div className="mt-1 text-sm text-gray-500 line-clamp-1">
                              {inquiry.message}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {inquiry.createdAt
                            ? new Date(inquiry.createdAt).toLocaleDateString()
                            : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(inquiry)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Edit"
                            >
                              <EditIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(inquiry)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                            <a
                              href={`https://wa.me/${inquiry.whatsappNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-900 transition-colors"
                              title="Send WhatsApp Message"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-4">
                {inquiries?.map((inquiry: Enquiry) => (
                  <div 
                    key={inquiry._id} 
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div 
                      className="p-4 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleRowExpand(inquiry._id!)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10">
                          {inquiry.productImage ? (
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={inquiry.productImage}
                              alt={inquiry.productName}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {inquiry.productName}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {inquiry.userName} • {inquiry.buyOption}
                          </p>
                        </div>
                      </div>
                      <div>
                        {expandedRows[inquiry._id!] ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedRows[inquiry._id!] && (
                      <div className="px-4 pb-4 space-y-3 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Variant</p>
                            <p className="text-sm font-medium">
                              {inquiry.variant || '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Quantity</p>
                            <p className="text-sm font-medium">
                              {inquiry.quantity} m
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium break-all">
                              {inquiry.userEmail}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">WhatsApp</p>
                            <p className="text-sm font-medium">
                              {inquiry.whatsappNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="text-sm font-medium">
                              {inquiry.location || '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="text-sm font-medium">
                              {inquiry.createdAt
                                ? new Date(inquiry.createdAt).toLocaleDateString()
                                : '-'}
                            </p>
                          </div>
                        </div>

                        {inquiry.message && (
                          <div>
                            <p className="text-xs text-gray-500">Message</p>
                            <p className="text-sm">
                              {inquiry.message}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(inquiry);
                            }}
                            className="px-3 py-1.5 text-sm flex items-center rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            <EditIcon className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(inquiry);
                            }}
                            className="px-3 py-1.5 text-sm flex items-center rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                          <a
                            href={`https://wa.me/${inquiry.whatsappNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-sm flex items-center rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {inquiries?.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <div className="mx-auto h-24 w-24 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are currently no inquiries to display.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {response?.data && response.data.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil((response?.total || 0) / itemsPerPage)}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {editingInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <EditInquiry
              inquiry={editingInquiry}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryList;