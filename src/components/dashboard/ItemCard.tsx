import React, { useState } from 'react';
import { Item } from '../../types/database';
import { Package, MapPin, Tag, Box } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import BorrowModal from './BorrowModal';

interface ItemCardProps {
  item: Item;
  onUpdate?: (updatedItem: Item) => void;
}

export default function ItemCard({ item, onUpdate }: ItemCardProps) {
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(item.quantity);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const isAvailable = currentQuantity > 0;

  const handleBorrow = async (data: { 
    expected_return_date: string;
    project_name?: string;
    course_details?: string;
  }) => {
    if (!isAvailable || isLoading) return;

    setIsLoading(true);
    try {
      console.log('Starting borrow process for item:', item.id);

      // Update the quantity in the database
      const { error: updateError } = await supabase
        .from('items')
        .update({ 
          quantity: currentQuantity - 1,
          status: currentQuantity === 1 ? 'borrowed' : 'available'
        })
        .eq('id', item.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      console.log('Item quantity updated in database');

      // Add a new loan entry
      const { data: loanData, error: loanError } = await supabase
        .from('loans')
        .insert([{
          item_id: item.id,
          borrower_id: user?.id,
          expected_return_date: data.expected_return_date,
          project_name: data.project_name,
          course_details: data.course_details,
          status: 'active',
          borrow_date: new Date().toISOString()
        }])
        .select()
        .single();

      if (loanError) {
        console.error('Loan error:', loanError);
        throw loanError;
      }

      console.log('Loan created:', loanData);

      // Update local state for quantity
      setCurrentQuantity((prev) => prev - 1);

      // Optionally notify the parent component
      if (onUpdate) {
        onUpdate({ ...item, quantity: currentQuantity - 1 });
      }

      toast.success('Item borrowed successfully');
      setShowBorrowModal(false);
    } catch (err) {
      console.error('Error details:', err);
      toast.error(`Failed to borrow item: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-yellow-400">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {item.description}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {item.categories?.name && (
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-200">
                <Tag className="w-4 h-4 mr-2 text-yellow-400" />
                <span>{item.categories.name}</span>
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-200">
              <Box className="w-4 h-4 mr-2 text-yellow-400" />
              <span>Quantity: {currentQuantity}</span>
            </div>
            
            {item.location && (
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-200">
                <MapPin className="w-4 h-4 mr-2 text-yellow-400" />
                <span>{item.location}</span>
              </div>
            )}

            {item.condition && (
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-200">
                <Package className="w-4 h-4 mr-2 text-yellow-400" />
                <span>Condition: {item.condition}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowBorrowModal(true)}
            disabled={!isAvailable || isLoading}
            className={`w-full px-4 py-2 rounded-md transition-colors font-medium
              ${isAvailable && !isLoading
                ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {isLoading ? 'Processing...' : isAvailable ? 'Borrow Item' : 'Not Available'}
          </button>
        </div>
      </div>

      {showBorrowModal && (
        <BorrowModal
        item={item}
          onClose={() => setShowBorrowModal(false)}
          onSubmit={handleBorrow}
        />
      )}
    </>
  );
}
  