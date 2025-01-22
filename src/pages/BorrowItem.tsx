import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function BorrowItem() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleDirectBorrow = async () => {
      if (!user || !itemId) {
        toast.error('Please login to borrow items');
        navigate('/login');
        return;
      }

      try {
        const { data: item } = await supabase
          .from('items')
          .select('*')
          .eq('id', itemId)
          .single();

        if (!item || item.quantity < 1) {
          toast.error('Item not available');
          navigate('/dashboard');
          return;
        }

        // Create loan and update quantity
        const { error } = await supabase.rpc('borrow_item', {
          p_borrower_id: user.id,
          p_item_id: itemId,
          p_project_name: 'QR Borrow'
        });

        if (error) throw error;

        toast.success('Item borrowed successfully');
        navigate('/dashboard');
      } catch (err) {
        console.error('Error borrowing item:', err);
        toast.error('Failed to borrow item');
        navigate('/dashboard');
      }
    };

    handleDirectBorrow();
  }, [itemId, user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        Processing borrow request...
      </div>
    </div>
  );
}