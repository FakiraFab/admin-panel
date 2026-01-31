import React from 'react';
import { Package } from 'lucide-react';
import type { OrderItem } from '../../types/phase2';

interface OrderItemsTableProps {
  items: OrderItem[];
}

export const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ items }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Options</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-12 h-12 rounded-md object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{item.productName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {item.options && Object.keys(item.options).length > 0 ? (
                    <div className="text-sm text-gray-600">
                      {Object.entries(item.options).map(([key, value]) => (
                        <div key={key}>
                          <span className="capitalize">{key}:</span> {String(value)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="px-4 py-4 text-right text-sm text-gray-900">
                  {formatCurrency(item.priceAtPurchase)}
                </td>
                <td className="px-4 py-4 text-right text-sm text-gray-900">
                  {item.quantity}
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                  {formatCurrency(item.priceAtPurchase * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
