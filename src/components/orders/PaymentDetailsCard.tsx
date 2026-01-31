import React from 'react';
import { CreditCard } from 'lucide-react';
import type { Order } from '../../types/phase2';

interface PaymentDetailsCardProps {
  order: Order;
}

export const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({ order }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5" />
        Payment Details
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Payment Method</span>
          <span className="font-medium text-gray-900 uppercase">{order.paymentMethod}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Payment Status</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
            {order.paymentStatus}
          </span>
        </div>
        
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm text-gray-900">{formatCurrency(order.pricing.subtotal)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Tax ({order.pricing.taxRate}%)</span>
            <span className="text-sm text-gray-900">{formatCurrency(order.pricing.tax)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Shipping</span>
            <span className="text-sm text-gray-900">{formatCurrency(order.pricing.shipping)}</span>
          </div>
          {order.pricing.discount > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Discount</span>
              <span className="text-sm text-green-600">-{formatCurrency(order.pricing.discount)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(order.pricing.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
