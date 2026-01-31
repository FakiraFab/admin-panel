import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Search, Filter as FilterIcon, Eye, RefreshCcw } from 'lucide-react';
import { getPayments } from '../../lib/api';
import { useToast } from '../../components/ui/toast';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { PaymentDetailsModal } from '../../components/payments/PaymentDetailsModal';
import { RefundModal } from '../../components/payments/RefundModal';
import { PaymentStatusBadge } from '../../components/payments/PaymentStatusBadge';
import type { Payment, Order, User } from '../../types/phase2';
import { format } from 'date-fns';
import { Card, CardContent } from '../../components/ui/card';

export const PaymentList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundingPayment, setRefundingPayment] = useState<Payment | null>(null);

  const [filters, setFilters] = useState({
    status: '',
    paymentMethod: '',
    orderNumber: '',
    razorpayOrderId: '',
    razorpayPaymentId: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });

  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['payments', currentPage, itemsPerPage, filters],
    queryFn: () =>
      getPayments({
        page: currentPage,
        limit: itemsPerPage,
        status: filters.status || undefined,
        paymentMethod: filters.paymentMethod as any || undefined,
        orderNumber: filters.orderNumber || undefined,
        razorpayOrderId: filters.razorpayOrderId || undefined,
        razorpayPaymentId: filters.razorpayPaymentId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        minAmount: filters.minAmount ? parseFloat(filters.minAmount) : undefined,
        maxAmount: filters.maxAmount ? parseFloat(filters.maxAmount) : undefined,
      }),
  });

  const payments = response?.data || [];
  const totalPages = response?.totalPages || 1;

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      paymentMethod: '',
      orderNumber: '',
      razorpayOrderId: '',
      razorpayPaymentId: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== '');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getPaymentMethodBadge = (method: string) => {
    return method === 'razorpay' ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
        Razorpay
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
        COD
      </span>
    );
  };

  const getOrderInfo = (order: Order | string) => {
    if (typeof order === 'string') {
      return { orderNumber: 'N/A', orderId: order };
    }
    return { orderNumber: order.orderNumber, orderId: order._id };
  };

  const getUserInfo = (user: User | string) => {
    if (typeof user === 'string') {
      return { name: 'N/A', email: 'N/A' };
    }
    return { name: user.name, email: user.email };
  };

  const handleRefundSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['payments'] });
    showToast('Payment list refreshed', 'success');
  };

  const canRefund = (payment: Payment) => {
    return payment.status === 'completed' && !payment.refundDetails;
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  const handleInitiateRefundFromDetails = () => {
    setRefundingPayment(selectedPayment);
    setSelectedPayment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Payments
        </h1>
        <div className="text-sm text-gray-500">
          {response?.total || 0} {response?.total === 1 ? 'payment' : 'payments'} found
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
            hasActiveFilters
              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FilterIcon className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
              {Object.values(filters).filter((value) => value !== '').length}
            </span>
          )}
        </button>
      </div>

      {isFiltersOpen && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={filters.paymentMethod}
                  onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Methods</option>
                  <option value="razorpay">Razorpay</option>
                  <option value="cod">COD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number
                </label>
                <input
                  type="text"
                  value={filters.orderNumber}
                  onChange={(e) => handleFilterChange('orderNumber', e.target.value)}
                  placeholder="Search by order number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Razorpay Order ID
                </label>
                <input
                  type="text"
                  value={filters.razorpayOrderId}
                  onChange={(e) => handleFilterChange('razorpayOrderId', e.target.value)}
                  placeholder="Search by Razorpay order ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Razorpay Payment ID
                </label>
                <input
                  type="text"
                  value={filters.razorpayPaymentId}
                  onChange={(e) => handleFilterChange('razorpayPaymentId', e.target.value)}
                  placeholder="Search by Razorpay payment ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Amount
                </label>
                <input
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                  placeholder="Minimum amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Amount
                </label>
                <input
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                  placeholder="Maximum amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-red-500 bg-red-50 rounded-lg text-center m-4">
              Error loading payments. Please try again.
            </div>
          ) : payments.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="No payments found"
              description="There are no payments matching your filters."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment: Payment) => {
                    const orderInfo = getOrderInfo(payment.order);
                    const userInfo = getUserInfo(payment.user);
                    return (
                      <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                            {payment.razorpayPaymentId || payment._id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={`/orders/${orderInfo.orderId}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            {orderInfo.orderNumber}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{userInfo.name}</div>
                          <div className="text-xs text-gray-500">{userInfo.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPaymentMethodBadge(payment.paymentMethod)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PaymentStatusBadge status={payment.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(payment)}
                              className="text-blue-600 hover:text-blue-900 transition-colors flex items-center gap-1"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {canRefund(payment) && (
                              <button
                                onClick={() => setRefundingPayment(payment)}
                                className="text-red-600 hover:text-red-900 transition-colors flex items-center gap-1"
                                title="Initiate Refund"
                              >
                                <RefreshCcw className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modals */}
      <PaymentDetailsModal
        payment={selectedPayment}
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        onRefund={handleInitiateRefundFromDetails}
      />

      <RefundModal
        payment={refundingPayment}
        isOpen={!!refundingPayment}
        onClose={() => setRefundingPayment(null)}
        onSuccess={handleRefundSuccess}
      />
    </div>
  );
};
