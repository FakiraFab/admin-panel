import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import type { Payment, Order, User } from '../../types/phase2';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface PaymentDetailsModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
  onRefund?: () => void;
}

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  payment,
  isOpen,
  onClose,
  onRefund,
}) => {
  if (!isOpen || !payment) return null;

  const order = typeof payment.order === 'string' ? null : payment.order;
  const user = typeof payment.user === 'string' ? null : payment.user;

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

  const canRefund = payment.status === 'completed' && !payment.refundDetails;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-6">
            {/* Payment Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Payment Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Payment ID</p>
                  <p className="text-sm font-medium text-gray-900">
                    {payment.razorpayPaymentId || payment._id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Amount</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                  <div>{getPaymentMethodBadge(payment.paymentMethod)}</div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <PaymentStatusBadge status={payment.status} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Transaction Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Currency</p>
                  <p className="text-sm font-medium text-gray-900">{payment.currency}</p>
                </div>
              </div>
            </div>

            {/* Razorpay Details */}
            {payment.razorpayOrderId && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Razorpay Details</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Razorpay Order ID</p>
                    <p className="text-sm font-medium text-gray-900 break-all">
                      {payment.razorpayOrderId}
                    </p>
                  </div>
                  {payment.razorpayPaymentId && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Razorpay Payment ID</p>
                      <p className="text-sm font-medium text-gray-900 break-all">
                        {payment.razorpayPaymentId}
                      </p>
                    </div>
                  )}
                  {payment.razorpaySignature && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Payment Signature</p>
                      <p className="text-xs font-mono text-gray-700 break-all bg-gray-50 p-2 rounded">
                        {payment.razorpaySignature}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Information */}
            {order && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order Number</p>
                    <a
                      href={`/orders/${order._id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      {order.orderNumber}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order Status</p>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Information */}
            {user && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Name</p>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Failure Reason */}
            {payment.status === 'failed' && payment.failureReason && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Failure Information</h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Reason</p>
                  <p className="text-sm text-red-800">{payment.failureReason}</p>
                </div>
              </div>
            )}

            {/* Refund Details */}
            {payment.refundDetails && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Refund Information</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Refund ID</p>
                      <p className="text-sm font-medium text-gray-900">
                        {payment.refundDetails.refundId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Refund Amount</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(payment.refundDetails.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {payment.refundDetails.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Processed Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(payment.refundDetails.processedAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Refund Reason</p>
                    <p className="text-sm text-gray-700">{payment.refundDetails.reason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
            {canRefund && onRefund && (
              <button
                onClick={onRefund}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Initiate Refund
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
