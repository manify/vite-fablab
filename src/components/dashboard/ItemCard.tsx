import React, { useState } from 'react';
import { Item } from '../../types/database';
import { Package, MapPin, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import BorrowModal from './BorrowModal';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const { user } = useAuth();

  const handleBorrow = async (data: { 
    expected_return_date: string;
    project_name?: string;
    course_details?: string;
  }) => {
    try {
      const { error } = await supabase
        .from('loans')
        .insert([{
          item_id: item.id,
          borrower_id: user!.id,
          expected_return_date: data.expected_return_date,
          project_name: data.project_name,
          course_details: data.course_details,
          status: 'active'
        }]);

      if (error) throw error;
      toast.success('Item borrowed successfully');
      setShowBorrowModal(false);
    } catch (err) {
      toast.error('Failed to borrow item');
      console.error('Error borrowing item:', err);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-yellow-400">{item.name}</h3>
              <p className="text-sm text-white mt-1">{item.description}</p>
            </div>
          </div>

          <div className="space-y-2">
            {item.categories?.name && (
              <div className="flex items-center text-sm text-white">
                <Tag className="w-4 h-4 mr-2 text-yellow-400" />
                <span>{item.categories.name}</span>
              </div>
            )}
            
            {item.location && (
              <div className="flex items-center text-sm text-white">
                <MapPin className="w-4 h-4 mr-2 text-yellow-400" />
                <span>{item.location}</span>
              </div>
            )}

            {item.condition && (
              <div className="flex items-center text-sm text-white">
                <Package className="w-4 h-4 mr-2 text-yellow-400" />
                <span>Condition: {item.condition}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowBorrowModal(true)}
            className="w-full px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors font-medium"
          >
            Borrow Item
          </button>
        </div>
      </div>

      {showBorrowModal && (
        <BorrowModal
          onClose={() => setShowBorrowModal(false)}
          onSubmit={handleBorrow}
        />
      )}
    </>
  );
}