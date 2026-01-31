import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit, Printer, AlertCircle } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { getOrderById, updateOrderStatus } from '../../lib/api';
import { useToast } from '../../components/ui/toast';
import { OrderTimeline } from '../../components/orders/OrderTimeline';
import { OrderItemsTable } from '../../components/orders/OrderItemsTable';
import { PaymentDetailsCard } from '../../components/orders/PaymentDetailsCard';
import { ShippingDetailsCard } from '../../components/orders/ShippingDetailsCard';
import { CustomerDetailsCard } from '../../components/orders/CustomerDetailsCard';
import { OrderStatusUpdateModal } from '../../components/orders/OrderStatusUpdateModal';
import type { User } from '../../types/phase2';
import { format } from 'date-fns';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  });

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Order-${order?.orderNumber}`,
  });

  const handleStatusUpdate = async (status: string, note: string) => {
    try {
      await updateOrderStatus(id!, { status, note });
      showToast('Order status updated successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update order status', 'error');
      throw error;
    }
  };

  const getUserInfo = (user: User | string) => {
    if (typeof user === 'string') {
      return { name: 'N/A', email: 'N/A', phone: '' };
    }
    return user;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Order Not Found</h3>
            <p className="text-red-700 mb-4">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <button
              onClick={() => navigate('/orders')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const user = getUserInfo(order.user);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order #{order.orderNumber}</h1>
            <p className="text-sm text-gray-500">
              Placed on {format(new Date(order.createdAt), 'MMMM dd, yyyy HH:mm')}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsStatusModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Update Status
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OrderItemsTable items={order.items} />
          <OrderTimeline statusHistory={order.statusHistory} />
        </div>

        <div className="space-y-6">
          <PaymentDetailsCard order={order} />
          <ShippingDetailsCard shipping={order.shipping} />
          <CustomerDetailsCard
            user={user}
            shippingAddress={order.shippingAddress}
            billingAddress={order.billingAddress}
          />
        </div>
      </div>

      {order.notes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-900 mb-2">Order Notes</h3>
          <p className="text-sm text-yellow-800">{order.notes}</p>
        </div>
      )}

      {isStatusModalOpen && (
        <OrderStatusUpdateModal
          currentStatus={order.orderStatus}
          onUpdate={handleStatusUpdate}
          onClose={() => setIsStatusModalOpen(false)}
        />
      )}

      {/* Print Template (Hidden) */}
      <div style={{ display: 'none' }}>
        <div ref={printRef} className="p-8 bg-white">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Invoice</h1>
            <p className="text-gray-600">Order #{order.orderNumber}</p>
            <p className="text-sm text-gray-500">
              {format(new Date(order.createdAt), 'MMMM dd, yyyy')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <p>{user.name}</p>
              <p>{user.email}</p>
              {user.phone && <p>{user.phone}</p>}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <table className="w-full mb-8 border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2">Product</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2">{item.productName}</td>
                  <td className="text-right py-2">{formatCurrency(item.priceAtPurchase)}</td>
                  <td className="text-right py-2">{item.quantity}</td>
                  <td className="text-right py-2">
                    {formatCurrency(item.priceAtPurchase * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ml-auto w-64">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.pricing.subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax ({order.pricing.taxRate}%):</span>
              <span>{formatCurrency(order.pricing.tax)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>{formatCurrency(order.pricing.shipping)}</span>
            </div>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between mb-2">
                <span>Discount:</span>
                <span>-{formatCurrency(order.pricing.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t-2 border-gray-300">
              <span>Total:</span>
              <span>{formatCurrency(order.pricing.total)}</span>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Thank you for your order!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
