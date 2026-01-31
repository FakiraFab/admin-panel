import React from 'react';
import { Truck, ExternalLink } from 'lucide-react';
import type { ShippingInfo } from '../../types/phase2';

interface ShippingDetailsCardProps {
  shipping: ShippingInfo;
}

export const ShippingDetailsCard: React.FC<ShippingDetailsCardProps> = ({ shipping }) => {
  const getShippingStatusColor = (status: string) => {
    switch (status) {
      case 'not_created':
        return 'bg-gray-100 text-gray-800';
      case 'created':
        return 'bg-blue-100 text-blue-800';
      case 'awb_assigned':
        return 'bg-cyan-100 text-cyan-800';
      case 'picked':
        return 'bg-purple-100 text-purple-800';
      case 'in_transit':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'rto':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5" />
        Shipping Details
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Shipping Provider</span>
          <span className="font-medium text-gray-900">{shipping.provider}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Shipping Status</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getShippingStatusColor(shipping.status)}`}>
            {shipping.status.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>
        
        {shipping.shiprocketOrderId && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Shiprocket Order ID</span>
            <span className="text-sm font-mono text-gray-900">{shipping.shiprocketOrderId}</span>
          </div>
        )}
        
        {shipping.shipmentId && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Shipment ID</span>
            <span className="text-sm font-mono text-gray-900">{shipping.shipmentId}</span>
          </div>
        )}
        
        {shipping.awbCode && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">AWB Code</span>
            <span className="text-sm font-mono text-gray-900">{shipping.awbCode}</span>
          </div>
        )}
        
        {shipping.courierName && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Courier</span>
            <span className="font-medium text-gray-900">{shipping.courierName}</span>
          </div>
        )}
        
        {shipping.trackingUrl && (
          <div className="pt-3 border-t border-gray-200">
            <a
              href={shipping.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-sm font-medium">Track Shipment</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
