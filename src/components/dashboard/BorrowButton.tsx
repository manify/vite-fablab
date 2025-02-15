import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import QRCodeScanner from './QRCodeScanner';
import BorrowModal from './BorrowModal';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Item } from '../../types/database';

interface BorrowButtonProps {
  className?: string;
}

export default function BorrowButton({ className }: BorrowButtonProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { user } = useAuth();

  const handleScan = async (qrCode: string) => {
    try {
      // Find item by QR code
      const { data: items, error } = await supabase
        .from('items')
        .select('*, categories(name)')
        .eq('qr_code', qrCode)
        .single();

      if (error) throw error;
      if (!items) throw new Error('Item not found');

      if (items.quantity <= 0) {
        throw new Error('This item is currently not available');
      }

      setSelectedItem(items);
      setShowScanner(false);
      setShowBorrowModal(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to find item');
    }
  };

  const handleBorrow = async (data: { 
    expected_return_date: string;
    project_name?: string;
    course_details?: string;
  }) => {
    if (!selectedItem || !user) return;

    try {
      const { error } = await supabase
        .from('loans')
        .insert([{
          item_id: selectedItem.id,
          borrower_id: user.id,
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
    }
  };

  return (
    <>
      <button
        onClick={() => setShowScanner(true)}
        className={`flex items-center px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors ${className}`}
      >
        <QrCode className="w-5 h-5 mr-2" />
        Scan to Borrow
      </button>

      {showScanner && (
        <QRCodeScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showBorrowModal && selectedItem && (
        <BorrowModal
          onClose={() => setShowBorrowModal(false)}
          onSubmit={handleBorrow}
        />
      )}
    </>
  );
}