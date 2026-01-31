import React from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import type { StatusHistoryItem } from '../../types/phase2';

interface OrderTimelineProps {
  statusHistory: StatusHistoryItem[];
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ statusHistory }) => {
  const sortedHistory = [...statusHistory].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'confirmed':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-purple-500';
      case 'shipped':
        return 'bg-indigo-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'returned':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Order Timeline
      </h3>
      <div className="space-y-4">
        {sortedHistory.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}></div>
              {index < sortedHistory.length - 1 && (
                <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 capitalize">
                  {item.status.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-gray-500">
                  {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
              {item.note && (
                <p className="text-sm text-gray-600">{item.note}</p>
              )}
              {item.updatedBy && (
                <p className="text-xs text-gray-500 mt-1">Updated by: {item.updatedBy}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
