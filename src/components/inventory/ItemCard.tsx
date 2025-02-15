import React from 'react';
import { Item } from '../../types/database';
import { Package, MapPin, Info, Tag, Hash } from 'lucide-react';
import QRCode from 'qrcode.react';

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
}

export default function ItemCard({ item, onEdit }: ItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
        </div>
        <div className="w-24 h-24">
          <QRCode value={item.qr_code} size={96} />
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Package className="w-4 h-4 mr-2" />
          <span>Status: </span>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
            item.status === 'available' ? 'bg-green-100 text-green-800' :
            item.status === 'borrowed' ? 'bg-blue-100 text-blue-800' :
            item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
            item.status === 'unavailable' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {item.status}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Tag className="w-4 h-4 mr-2" />
          <span>Category: </span>
          <span className="ml-2">{item.categories?.name || 'Uncategorized'}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Hash className="w-4 h-4 mr-2" />
          <span>Quantity: </span>
          <span className={`ml-2 font-medium ${
            item.quantity === 0 ? 'text-red-600' : 
            item.quantity < 3 ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {item.quantity || 0} available
          </span>
        </div>
        
        {item.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{item.location}</span>
          </div>
        )}
        
        {item.condition && (
          <div className="flex items-center text-sm text-gray-600">
            <Info className="w-4 h-4 mr-2" />
            <span>Condition: {item.condition}</span>
          </div>
        )}
      </div>
      
      <button
        onClick={() => onEdit(item)}
        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Edit Item
      </button>
    </div>
  );
}