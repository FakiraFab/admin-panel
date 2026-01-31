import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { Payment, RefundRequest } from '../../types/phase2';
import { initiateRefund } from '../../lib/api';
import { useToast } from '../ui/toast';

interface RefundModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RefundModal: React.FC<RefundModalProps> = ({
  payment,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string; reason?: string }>({});

  const { showToast } = useToast();

  if (!isOpen || !payment) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const validateForm = () => {
    const newErrors: { amount?: string; reason?: string } = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Refund amount must be greater than 0';
    } else if (parseFloat(amount) > payment.amount) {
      newErrors.amount = `Refund amount cannot exceed ${formatCurrency(payment.amount)}`;
    }

    if (!reason) {
      newErrors.reason = 'Please select a refund reason';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const refundData: RefundRequest = {
        amount: parseFloat(amount),
        reason,
        notes: notes || undefined,
      };

      await initiateRefund(payment._id, refundData);
      showToast('Refund initiated successfully', 'success');
      onSuccess();
      handleClose();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || 'Failed to initiate refund',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setReason('');
    setNotes('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Initiate Refund</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-4">
              {/* Payment Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Payment Information
                    </p>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>
                        Payment ID: <span className="font-medium">{payment.razorpayPaymentId || payment._id}</span>
                      </p>
                      <p>
                        Total Amount: <span className="font-medium">{formatCurrency(payment.amount)}</span>
                      </p>
                      <p>
                        Maximum Refundable: <span className="font-medium">{formatCurrency(payment.amount)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Refund Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.01"
                    min="0"
                    max={payment.amount}
                    placeholder="0.00"
                    className={`w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.amount ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>

              {/* Refund Reason */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Reason <span className="text-red-500">*</span>
                </label>
                <select
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.reason ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a reason</option>
                  <option value="Customer request">Customer request</option>
                  <option value="Product defect">Product defect</option>
                  <option value="Order cancellation">Order cancellation</option>
                  <option value="Duplicate payment">Duplicate payment</option>
                  <option value="Other">Other</option>
                </select>
                {errors.reason && (
                  <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add any additional notes about this refund..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Confirmation Section */}
              {amount && parseFloat(amount) > 0 && parseFloat(amount) <= payment.amount && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-900 mb-1">
                    Refund Confirmation
                  </p>
                  <p className="text-sm text-yellow-800">
                    You are about to refund <span className="font-semibold">{formatCurrency(parseFloat(amount))}</span> to the customer.
                    This action cannot be undone.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {isLoading ? 'Processing...' : 'Confirm Refund'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
